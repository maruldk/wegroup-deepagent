
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Email Classification with streaming LLM response
export async function POST(request: NextRequest) {
  try {
    const { tenantId, emailSubject, emailSender, emailBody, attachmentInfo } = await request.json();

    if (!tenantId || !emailSubject || !emailSender) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Prepare LLM request for advanced email classification
    const messages = [
      {
        role: 'user',
        content: `Perform advanced email classification for invoice processing:
        
        Subject: ${emailSubject}
        Sender: ${emailSender}
        Body: ${emailBody || 'No body content'}
        Attachments: ${JSON.stringify(attachmentInfo)}
        
        Analyze this email comprehensively and provide:
        1. Document type classification
        2. Vendor/supplier detection
        3. Priority assessment
        4. Business impact analysis
        5. Processing recommendations
        6. Fraud/spam detection
        7. Urgency scoring
        
        Please respond in JSON format with the following structure:
        {
          "documentType": "INVOICE|RECEIPT|QUOTE|CONTRACT|SPAM|PHISHING|OTHER",
          "confidence": "number between 0 and 1",
          "confidenceLevel": "LOW|MEDIUM|HIGH",
          "isInvoice": "boolean",
          "isSpam": "boolean",
          "isPhishing": "boolean",
          "fraudRiskScore": "number between 0 and 1",
          "vendorDetected": "boolean",
          "vendorName": "string or null",
          "vendorConfidence": "number between 0 and 1",
          "vendorType": "KNOWN|UNKNOWN|SUSPICIOUS",
          "priority": "LOW|NORMAL|HIGH|URGENT",
          "urgencyScore": "number between 0 and 1",
          "businessImpact": "LOW|MEDIUM|HIGH",
          "impactScore": "number between 0 and 1",
          "processingRecommendation": "AUTO_PROCESS|REVIEW|REJECT|ESCALATE|QUARANTINE",
          "approvalRecommendation": "AUTO_APPROVE|MANUAL|REJECT",
          "subjectAnalysis": {
            "keywords": ["array of detected keywords"],
            "sentiment": "POSITIVE|NEUTRAL|NEGATIVE",
            "language": "detected language code",
            "urgencyIndicators": ["array of urgency indicators"]
          },
          "senderAnalysis": {
            "domain": "sender domain",
            "domainReputation": "TRUSTED|NEUTRAL|SUSPICIOUS",
            "isKnownSender": "boolean",
            "senderHistory": "GOOD|NEUTRAL|BAD"
          },
          "contentAnalysis": {
            "hasInvoiceTerms": "boolean",
            "hasPaymentTerms": "boolean",
            "hasAmountMentions": "boolean",
            "hasDateMentions": "boolean",
            "suspiciousPatterns": ["array of suspicious patterns found"]
          },
          "attachmentAnalysis": {
            "hasPdfAttachments": "boolean",
            "hasImageAttachments": "boolean",
            "hasExecutableAttachments": "boolean",
            "suspiciousAttachments": "boolean",
            "attachmentTypes": ["array of attachment types"]
          },
          "reasoning": "detailed explanation of the classification decision"
        }
        
        Respond with raw JSON only. Do not include code blocks, markdown, or any other formatting.`
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
        max_tokens: 2000,
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
                    const classificationResult = JSON.parse(buffer);
                    
                    // Create classification record
                    const classification = await prisma.emailClassification.create({
                      data: {
                        tenantId,
                        emailSubject,
                        emailSender,
                        emailBodyPreview: emailBody?.substring(0, 500) || '',
                        attachmentInfo: attachmentInfo || {},
                        documentType: classificationResult.documentType,
                        confidence: classificationResult.confidence,
                        confidenceLevel: classificationResult.confidenceLevel,
                        subjectAnalysis: classificationResult.subjectAnalysis,
                        senderAnalysis: classificationResult.senderAnalysis,
                        contentAnalysis: classificationResult.contentAnalysis,
                        attachmentAnalysis: classificationResult.attachmentAnalysis,
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

                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                      ...classificationResult,
                      classificationId: classification.id,
                      status: 'completed'
                    })}\n\n`));
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  } catch (error) {
                    console.error('Error processing classification result:', error);
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
    console.error('Email classification error:', error);
    return NextResponse.json({ error: 'Email classification failed' }, { status: 500 });
  }
}

// Get classification history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const documentType = searchParams.get('documentType');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    }

    const where: any = { tenantId };
    if (documentType) {
      where.documentType = documentType;
    }

    const classifications = await prisma.emailClassification.findMany({
      where,
      include: {
        emailInvoices: {
          select: {
            id: true,
            subject: true,
            processingStatus: true,
            receivedAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    const stats = await prisma.emailClassification.groupBy({
      by: ['documentType', 'confidenceLevel'],
      where,
      _count: {
        documentType: true
      }
    });

    return NextResponse.json({
      classifications,
      stats: stats.reduce((acc, stat) => {
        const key = `${stat.documentType}_${stat.confidenceLevel}`;
        acc[key] = stat._count.documentType;
        return acc;
      }, {} as Record<string, number>)
    });

  } catch (error) {
    console.error('Error fetching classification history:', error);
    return NextResponse.json({ error: 'Failed to fetch classification history' }, { status: 500 });
  }
}
