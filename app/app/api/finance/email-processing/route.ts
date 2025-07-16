
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Email Processing Pipeline with LLM Integration
export async function POST(request: NextRequest) {
  try {
    const { tenantId, emailConfigId, emailData } = await request.json();

    if (!tenantId || !emailConfigId || !emailData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create email processing log
    const processingLog = await prisma.emailProcessingLog.create({
      data: {
        tenantId,
        emailConfigId,
        processingStep: 'EMAIL_FETCH',
        processingStatus: 'STARTED',
        startTime: new Date(),
        inputData: emailData
      }
    });

    // Create email invoice record
    const emailInvoice = await prisma.emailInvoice.create({
      data: {
        tenantId,
        emailConfigId,
        messageId: emailData.messageId,
        subject: emailData.subject,
        senderEmail: emailData.senderEmail,
        senderName: emailData.senderName || '',
        receivedAt: new Date(emailData.receivedAt),
        emailBody: emailData.emailBody,
        emailBodyHtml: emailData.emailBodyHtml,
        attachmentCount: emailData.attachmentCount || 0,
        attachmentNames: emailData.attachmentNames || [],
        attachmentSizes: emailData.attachmentSizes || [],
        processingStatus: 'PROCESSING'
      }
    });

    // Step 1: Email Classification with LLM
    const classificationMessages = [
      {
        role: 'user',
        content: `Analyze this email and classify it for invoice processing:
        
        Subject: ${emailData.subject}
        Sender: ${emailData.senderEmail}
        Body Preview: ${emailData.emailBody?.substring(0, 500)}
        Attachments: ${emailData.attachmentNames?.join(', ')}
        
        Please respond in JSON format with the following structure:
        {
          "documentType": "INVOICE|RECEIPT|QUOTE|CONTRACT|SPAM|OTHER",
          "confidence": "number between 0 and 1",
          "isInvoice": "boolean",
          "vendorDetected": "boolean",
          "vendorName": "string or null",
          "vendorConfidence": "number between 0 and 1",
          "priority": "LOW|NORMAL|HIGH|URGENT",
          "urgencyScore": "number between 0 and 1",
          "businessImpact": "LOW|MEDIUM|HIGH",
          "processingRecommendation": "AUTO_PROCESS|REVIEW|REJECT|ESCALATE",
          "approvalRecommendation": "AUTO_APPROVE|MANUAL|REJECT",
          "reasoning": "string explaining the classification"
        }
        
        Respond with raw JSON only. Do not include code blocks, markdown, or any other formatting.`
      }
    ];

    const classificationResponse = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: classificationMessages,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      })
    });

    const classificationData = await classificationResponse.json();
    const classificationResult = JSON.parse(classificationData.choices[0].message.content);

    // Create classification record
    const classification = await prisma.emailClassification.create({
      data: {
        tenantId,
        emailSubject: emailData.subject,
        emailSender: emailData.senderEmail,
        emailBodyPreview: emailData.emailBody?.substring(0, 500) || '',
        attachmentInfo: {
          count: emailData.attachmentCount || 0,
          names: emailData.attachmentNames || [],
          sizes: emailData.attachmentSizes || []
        },
        documentType: classificationResult.documentType,
        confidence: classificationResult.confidence,
        confidenceLevel: classificationResult.confidence > 0.8 ? 'HIGH' : classificationResult.confidence > 0.5 ? 'MEDIUM' : 'LOW',
        vendorDetected: classificationResult.vendorDetected,
        vendorName: classificationResult.vendorName,
        vendorConfidence: classificationResult.vendorConfidence,
        priority: classificationResult.priority,
        urgencyScore: classificationResult.urgencyScore,
        businessImpact: classificationResult.businessImpact,
        processingRecommendation: classificationResult.processingRecommendation,
        approvalRecommendation: classificationResult.approvalRecommendation,
        modelVersion: 'gpt-4.1-mini',
        modelUsed: 'ABACUS_AI',
        modelFeatures: classificationResult
      }
    });

    // Update email invoice with classification
    await prisma.emailInvoice.update({
      where: { id: emailInvoice.id },
      data: {
        classificationId: classification.id,
        isInvoice: classificationResult.isInvoice,
        invoiceConfidence: classificationResult.confidence,
        documentType: classificationResult.documentType,
        processingStatus: 'COMPLETED'
      }
    });

    // Update processing log
    await prisma.emailProcessingLog.update({
      where: { id: processingLog.id },
      data: {
        processingStatus: 'COMPLETED',
        endTime: new Date(),
        processingDuration: (Date.now() - processingLog.startTime.getTime()) / 1000,
        outputData: classificationResult,
        aiModelUsed: 'gpt-4.1-mini',
        aiConfidence: classificationResult.confidence
      }
    });

    // If it's an invoice with high confidence, create Invoice record
    if (classificationResult.isInvoice && classificationResult.confidence > 0.7) {
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber: `EMAIL-${emailInvoice.id.substring(0, 8)}`,
          vendorName: classificationResult.vendorName || 'Unknown Vendor',
          vendorEmail: emailData.senderEmail,
          invoiceDate: new Date(emailData.receivedAt),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          totalAmount: 0, // Will be updated after OCR
          currency: 'EUR',
          processingStatus: 'RECEIVED',
          extractedData: { emailSource: true, emailInvoiceId: emailInvoice.id },
          tenantId
        }
      });

      // Link email invoice to invoice
      await prisma.emailInvoice.update({
        where: { id: emailInvoice.id },
        data: { invoiceId: invoice.id }
      });
    }

    return NextResponse.json({
      success: true,
      emailInvoiceId: emailInvoice.id,
      classificationId: classification.id,
      classification: classificationResult,
      processingRecommendation: classificationResult.processingRecommendation
    });

  } catch (error) {
    console.error('Email processing error:', error);
    return NextResponse.json({ error: 'Email processing failed' }, { status: 500 });
  }
}

// Get email processing status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const emailConfigId = searchParams.get('emailConfigId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    }

    const where: any = { tenantId };
    if (emailConfigId) {
      where.emailConfigId = emailConfigId;
    }

    const emailInvoices = await prisma.emailInvoice.findMany({
      where,
      include: {
        emailConfig: {
          select: {
            emailAddress: true,
            displayName: true
          }
        },
        classification: {
          select: {
            documentType: true,
            confidence: true,
            confidenceLevel: true,
            processingRecommendation: true,
            priority: true,
            vendorName: true
          }
        },
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            processingStatus: true
          }
        }
      },
      orderBy: { receivedAt: 'desc' },
      take: limit
    });

    const stats = await prisma.emailInvoice.groupBy({
      by: ['processingStatus'],
      where,
      _count: {
        processingStatus: true
      }
    });

    return NextResponse.json({
      emailInvoices,
      stats: stats.reduce((acc, stat) => {
        acc[stat.processingStatus] = stat._count.processingStatus;
        return acc;
      }, {} as Record<string, number>)
    });

  } catch (error) {
    console.error('Error fetching email processing status:', error);
    return NextResponse.json({ error: 'Failed to fetch email processing status' }, { status: 500 });
  }
}
