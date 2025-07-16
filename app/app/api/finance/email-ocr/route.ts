
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Email-specific OCR processing with streaming LLM response
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const emailInvoiceId = formData.get('emailInvoiceId') as string;
    const tenantId = formData.get('tenantId') as string;
    const emailContext = formData.get('emailContext') as string;

    if (!file || !emailInvoiceId || !tenantId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get email invoice details for context
    const emailInvoice = await prisma.emailInvoice.findUnique({
      where: { id: emailInvoiceId },
      include: {
        classification: true,
        emailConfig: true
      }
    });

    if (!emailInvoice) {
      return NextResponse.json({ error: 'Email invoice not found' }, { status: 404 });
    }

    // Create or get linked invoice  
    let invoice = (emailInvoice as any).invoice;
    if (!invoice && emailInvoice.invoiceId) {
      invoice = await prisma.invoice.findUnique({
        where: { id: emailInvoice.invoiceId }
      });
    }

    if (!invoice) {
      // Create new invoice record
      invoice = await prisma.invoice.create({
        data: {
          invoiceNumber: `EMAIL-${emailInvoiceId.substring(0, 8)}`,
          vendorName: emailInvoice.classification?.vendorName || emailInvoice.senderName || 'Unknown Vendor',
          vendorEmail: emailInvoice.senderEmail,
          invoiceDate: emailInvoice.receivedAt,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          totalAmount: 0,
          currency: 'EUR',
          processingStatus: 'OCR_IN_PROGRESS',
          extractedData: { 
            emailSource: true, 
            emailInvoiceId: emailInvoiceId,
            emailSubject: emailInvoice.subject,
            emailSender: emailInvoice.senderEmail
          },
          tenantId
        }
      });

      // Link email invoice to invoice
      await prisma.emailInvoice.update({
        where: { id: emailInvoiceId },
        data: { invoiceId: invoice.id }
      });
    }

    // Create OCR result record
    const ocrResult = await prisma.oCRResult.create({
      data: {
        invoiceId: invoice.id,
        tenantId,
        ocrEngine: 'ABACUS_AI_EMAIL',
        processingStartTime: new Date(),
        validationStatus: 'PENDING'
      }
    });

    // Convert file to base64 for LLM processing
    const buffer = await file.arrayBuffer();
    const base64String = Buffer.from(buffer).toString('base64');

    // Parse email context if provided
    const emailContextData = emailContext ? JSON.parse(emailContext) : {};

    // Prepare enhanced LLM request with email context
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
            text: `Extract invoice information from this document with email context:
            
            EMAIL CONTEXT:
            - Subject: ${emailInvoice.subject}
            - Sender: ${emailInvoice.senderEmail}
            - Received: ${emailInvoice.receivedAt}
            - Classification: ${emailInvoice.classification?.documentType || 'Unknown'}
            - Vendor Detected: ${emailInvoice.classification?.vendorName || 'Unknown'}
            - Confidence: ${emailInvoice.classification?.confidence || 0}
            
            EXTRACTION REQUIREMENTS:
            Please extract and verify the following information:
            - Invoice Number
            - Invoice Date
            - Due Date
            - Vendor Name (verify against email sender)
            - Vendor Email (use email sender if not found in document)
            - Total Amount
            - Currency
            - Line Items (if any)
            - Payment Terms
            - Tax Information
            - Purchase Order Number (if mentioned)
            - Payment Instructions
            
            VALIDATION RULES:
            - Verify vendor name matches or is related to email sender
            - Check if invoice date is reasonable (not too far in past/future)
            - Validate amount format and currency
            - Flag any discrepancies between email context and document
            
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
              "purchaseOrderNumber": "string",
              "paymentInstructions": "string",
              "emailVerification": {
                "vendorMatchesEmail": "boolean",
                "emailSenderTrusted": "boolean",
                "discrepancies": ["array of discrepancies found"]
              },
              "confidence": "number between 0 and 1",
              "ocrQuality": "number between 0 and 1",
              "documentType": "INVOICE|RECEIPT|CREDIT_NOTE|QUOTE",
              "processingNotes": "string with additional notes"
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
                      where: { id: invoice.id },
                      data: {
                        invoiceNumber: extractedData.invoiceNumber || invoice.invoiceNumber,
                        vendorName: extractedData.vendorName || invoice.vendorName,
                        vendorEmail: extractedData.vendorEmail || invoice.vendorEmail,
                        invoiceDate: extractedData.invoiceDate ? new Date(extractedData.invoiceDate) : invoice.invoiceDate,
                        dueDate: extractedData.dueDate ? new Date(extractedData.dueDate) : invoice.dueDate,
                        totalAmount: extractedData.totalAmount || 0,
                        currency: extractedData.currency || invoice.currency,
                        extractedData: {
                          ...invoice.extractedData,
                          ...extractedData,
                          emailOcrProcessing: true
                        },
                        ocrConfidenceScore: extractedData.confidence || 0,
                        processingStatus: 'OCR_COMPLETED'
                      }
                    });

                    // Create confidence score record
                    await prisma.confidenceScore.create({
                      data: {
                        invoiceId: invoice.id,
                        tenantId,
                        ocrConfidence: extractedData.confidence || 0,
                        overallConfidence: extractedData.confidence || 0,
                        confidenceLevel: extractedData.confidence > 0.8 ? 'HIGH' : extractedData.confidence > 0.5 ? 'MEDIUM' : 'LOW',
                        processingRecommendation: extractedData.confidence > 0.8 ? 'AUTOMATIC' : 'MANUAL_REVIEW'
                      }
                    });

                    // Update email invoice status
                    await prisma.emailInvoice.update({
                      where: { id: emailInvoiceId },
                      data: {
                        extractionStatus: 'COMPLETED',
                        processingStatus: 'COMPLETED'
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
              validationErrors: [{ error: 'Email OCR processing failed', message: (error as Error).message || 'Unknown error' }]
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
    console.error('Email OCR processing error:', error);
    return NextResponse.json({ error: 'Email OCR processing failed' }, { status: 500 });
  }
}
