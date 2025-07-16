
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Calculate and update confidence scores
export async function POST(request: NextRequest) {
  try {
    const { invoiceId, tenantId } = await request.json();

    if (!invoiceId || !tenantId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get invoice and OCR data
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        ocrResults: true,
        confidenceScores: true
      }
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Calculate confidence scores using AI
    const messages = [
      {
        role: 'user',
        content: `Analyze this invoice data and calculate confidence scores for different aspects:

Invoice Data:
${JSON.stringify(invoice.extractedData, null, 2)}

OCR Results:
${JSON.stringify(invoice.ocrResults?.[0]?.extractedFields || {}, null, 2)}

Calculate confidence scores (0-1) for:
1. OCR accuracy
2. Data extraction quality
3. Validation completeness
4. Duplicate detection probability
5. Vendor matching accuracy

Also provide:
- Overall confidence score
- Processing recommendation (AUTOMATIC, MANUAL_REVIEW, or REJECT)
- Risk factors identified
- Confidence level (LOW, MEDIUM, HIGH)

Please respond in JSON format:
{
  "ocrConfidence": "number between 0 and 1",
  "dataExtractionConfidence": "number between 0 and 1",
  "validationConfidence": "number between 0 and 1",
  "duplicateCheckConfidence": "number between 0 and 1",
  "vendorMatchConfidence": "number between 0 and 1",
  "overallConfidence": "number between 0 and 1",
  "confidenceLevel": "LOW, MEDIUM, or HIGH",
  "processingRecommendation": "AUTOMATIC, MANUAL_REVIEW, or REJECT",
  "riskFactors": ["list of risk factors"],
  "scoringFactors": {
    "textQuality": "number",
    "fieldCompleteness": "number",
    "dataConsistency": "number"
  }
}

Respond with raw JSON only.`
      }
    ];

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: messages,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      })
    });

    const aiResponse = await response.json();
    const confidenceAnalysis = JSON.parse(aiResponse.choices[0].message.content);

    // Find existing confidence score or create new one
    let confidenceScore = await prisma.confidenceScore.findFirst({
      where: { invoiceId }
    });

    if (confidenceScore) {
      confidenceScore = await prisma.confidenceScore.update({
        where: { id: confidenceScore.id },
        data: {
          ocrConfidence: confidenceAnalysis.ocrConfidence,
          dataExtractionConfidence: confidenceAnalysis.dataExtractionConfidence,
          validationConfidence: confidenceAnalysis.validationConfidence,
          duplicateCheckConfidence: confidenceAnalysis.duplicateCheckConfidence,
          vendorMatchConfidence: confidenceAnalysis.vendorMatchConfidence,
          overallConfidence: confidenceAnalysis.overallConfidence,
          confidenceLevel: confidenceAnalysis.confidenceLevel,
          processingRecommendation: confidenceAnalysis.processingRecommendation,
          scoringFactors: confidenceAnalysis.scoringFactors,
          mlModelVersion: 'gpt-4.1-mini',
          mlPredictions: confidenceAnalysis
        }
      });
    } else {
      confidenceScore = await prisma.confidenceScore.create({
        data: {
          invoiceId,
          tenantId,
          ocrConfidence: confidenceAnalysis.ocrConfidence,
          dataExtractionConfidence: confidenceAnalysis.dataExtractionConfidence,
          validationConfidence: confidenceAnalysis.validationConfidence,
          duplicateCheckConfidence: confidenceAnalysis.duplicateCheckConfidence,
          vendorMatchConfidence: confidenceAnalysis.vendorMatchConfidence,
          overallConfidence: confidenceAnalysis.overallConfidence,
          confidenceLevel: confidenceAnalysis.confidenceLevel,
          processingRecommendation: confidenceAnalysis.processingRecommendation,
          scoringFactors: confidenceAnalysis.scoringFactors,
          mlModelVersion: 'gpt-4.1-mini',
          mlPredictions: confidenceAnalysis
        }
      });
    }

    // Update invoice with confidence data
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        aiValidationScore: confidenceAnalysis.overallConfidence,
        processingStatus: confidenceAnalysis.processingRecommendation === 'AUTOMATIC' ? 'VALIDATED' : 'VALIDATION_PENDING'
      }
    });

    return NextResponse.json({
      success: true,
      confidenceScore,
      analysis: confidenceAnalysis
    });

  } catch (error) {
    console.error('Confidence scoring error:', error);
    return NextResponse.json({ error: 'Confidence scoring failed' }, { status: 500 });
  }
}

// Get confidence score for an invoice
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('invoiceId');

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID required' }, { status: 400 });
    }

    const confidenceScore = await prisma.confidenceScore.findFirst({
      where: { invoiceId },
      include: {
        invoice: {
          select: {
            invoiceNumber: true,
            vendorName: true,
            totalAmount: true,
            processingStatus: true
          }
        }
      }
    });

    if (!confidenceScore) {
      return NextResponse.json({ error: 'Confidence score not found' }, { status: 404 });
    }

    return NextResponse.json(confidenceScore);

  } catch (error) {
    console.error('Error fetching confidence score:', error);
    return NextResponse.json({ error: 'Failed to fetch confidence score' }, { status: 500 });
  }
}
