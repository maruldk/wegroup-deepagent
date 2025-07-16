
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// OCR Processing with streaming LLM response
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const invoiceId = formData.get('invoiceId') as string;
    const tenantId = formData.get('tenantId') as string;

    if (!file || !invoiceId || !tenantId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create OCR result record
    const ocrResult = await prisma.oCRResult.create({
      data: {
        invoiceId,
        tenantId,
        ocrEngine: 'ABACUS_AI',
        processingStartTime: new Date(),
        validationStatus: 'PENDING'
      }
    });

    // Convert file to base64 for LLM processing
    const buffer = await file.arrayBuffer();
    const base64String = Buffer.from(buffer).toString('base64');

    // Prepare LLM request for OCR and data extraction
    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'file',
            file: {
              filename: file.name,
              file_data: `data:${file.type};base64,${base64String}`
            }
          },
          {
            type: 'text',
            text: `Extract the following information from this invoice document:
            - Invoice Number
            - Invoice Date
            - Due Date
            - Vendor Name
            - Vendor Email
            - Total Amount
            - Currency
            - Line Items (if any)
            - Payment Terms
            - Tax Information
            
            Please respond in JSON format with the following structure:
            {
              "invoiceNumber": "string",
              "invoiceDate": "YYYY-MM-DD",
              "dueDate": "YYYY-MM-DD",
              "vendorName": "string",
              "vendorEmail": "string",
              "totalAmount": "number",
              "currency": "string",
              "lineItems": [{"description": "string", "quantity": "number", "unitPrice": "number", "totalPrice": "number"}],
              "paymentTerms": "string",
              "taxInformation": {"taxRate": "number", "taxAmount": "number"},
              "confidence": "number between 0 and 1"
            }
            
            Respond with raw JSON only. Do not include code blocks, markdown, or any other formatting.`
          }
        ]
      }
    ];

    // Stream LLM response
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: messages,
        stream: true,
        max_tokens: 3000,
        response_format: { type: "json_object" }
      })
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let buffer = '';
        
        try {
          const reader = response.body?.getReader();
          if (!reader) throw new Error('No reader available');

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  // Process complete JSON response
                  try {
                    const extractedData = JSON.parse(buffer);
                    
                    // Update OCR result with extracted data
                    await prisma.oCRResult.update({
                      where: { id: ocrResult.id },
                      data: {
                        processingEndTime: new Date(),
                        processingDuration: (Date.now() - ocrResult.processingStartTime.getTime()) / 1000,
                        rawText: buffer,
                        extractedFields: extractedData,
                        overallConfidence: extractedData.confidence || 0,
                        validationStatus: 'COMPLETED'
                      }
                    });

                    // Update Invoice with extracted data
                    await prisma.invoice.update({
                      where: { id: invoiceId },
                      data: {
                        invoiceNumber: extractedData.invoiceNumber || '',
                        vendorName: extractedData.vendorName || '',
                        vendorEmail: extractedData.vendorEmail || '',
                        invoiceDate: extractedData.invoiceDate ? new Date(extractedData.invoiceDate) : new Date(),
                        dueDate: extractedData.dueDate ? new Date(extractedData.dueDate) : new Date(),
                        totalAmount: extractedData.totalAmount || 0,
                        currency: extractedData.currency || 'EUR',
                        extractedData: extractedData,
                        ocrConfidenceScore: extractedData.confidence || 0,
                        processingStatus: 'OCR_COMPLETED'
                      }
                    });

                    // Create confidence score record
                    await prisma.confidenceScore.create({
                      data: {
                        invoiceId,
                        tenantId,
                        ocrConfidence: extractedData.confidence || 0,
                        overallConfidence: extractedData.confidence || 0,
                        confidenceLevel: extractedData.confidence > 0.8 ? 'HIGH' : extractedData.confidence > 0.5 ? 'MEDIUM' : 'LOW',
                        processingRecommendation: extractedData.confidence > 0.8 ? 'AUTOMATIC' : 'MANUAL_REVIEW'
                      }
                    });

                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  } catch (error) {
                    console.error('Error processing OCR result:', error);
                    controller.error(error);
                  }
                  controller.close();
                  return;
                }
                
                try {
                  const parsed = JSON.parse(data);
                  buffer += parsed.content || '';
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({content: parsed.content || '', status: 'processing'})}\n\n`));
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          console.error('Streaming error:', error);
          
          // Update OCR result with error
          await prisma.oCRResult.update({
            where: { id: ocrResult.id },
            data: {
              processingEndTime: new Date(),
              validationStatus: 'FAILED',
              validationErrors: [{ error: 'OCR processing failed', message: (error as Error).message || 'Unknown error' }]
            }
          });
          
          controller.error(error);
        }
      }
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('OCR processing error:', error);
    return NextResponse.json({ error: 'OCR processing failed' }, { status: 500 });
  }
}
