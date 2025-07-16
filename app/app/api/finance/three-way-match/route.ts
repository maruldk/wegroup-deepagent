
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Perform three-way matching
export async function POST(request: NextRequest) {
  try {
    const { invoiceId, tenantId, purchaseOrderData, goodsReceiptData } = await request.json();

    if (!invoiceId || !tenantId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get invoice data
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId }
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Use AI to perform three-way matching analysis
    const messages = [
      {
        role: 'user',
        content: `Perform a three-way matching analysis between Purchase Order, Goods Receipt, and Invoice:

INVOICE DATA:
- Invoice Number: ${invoice.invoiceNumber}
- Invoice Date: ${invoice.invoiceDate}
- Invoice Amount: ${invoice.totalAmount}
- Vendor: ${invoice.vendorName}
- Extracted Data: ${JSON.stringify(invoice.extractedData, null, 2)}

PURCHASE ORDER DATA:
${JSON.stringify(purchaseOrderData, null, 2)}

GOODS RECEIPT DATA:
${JSON.stringify(goodsReceiptData, null, 2)}

Analyze and provide:
1. Quantity matching (compare ordered vs received vs invoiced quantities)
2. Price matching (compare unit prices and total amounts)
3. Vendor matching (verify vendor consistency)
4. Date matching (check date consistency and terms)
5. Overall matching score (0-1)
6. Discrepancies found
7. Recommended actions

Apply these tolerances:
- Quantity: 5% tolerance
- Price: 2% tolerance
- Date: 7 days tolerance

Please respond in JSON format:
{
  "quantityMatch": "boolean",
  "priceMatch": "boolean", 
  "vendorMatch": "boolean",
  "dateMatch": "boolean",
  "overallMatchScore": "number between 0 and 1",
  "matchingStatus": "MATCHED, UNMATCHED, or MANUAL_REVIEW",
  "discrepancies": [
    {
      "type": "QUANTITY, PRICE, VENDOR, or DATE",
      "description": "string",
      "severity": "LOW, MEDIUM, or HIGH",
      "expectedValue": "string",
      "actualValue": "string"
    }
  ],
  "resolutionActions": [
    {
      "action": "string",
      "priority": "LOW, MEDIUM, or HIGH",
      "description": "string"
    }
  ],
  "aiAnalysis": {
    "confidence": "number between 0 and 1",
    "recommendation": "APPROVE, REJECT, or REVIEW",
    "riskFactors": ["list of risk factors"]
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
        max_tokens: 2000,
        response_format: { type: "json_object" }
      })
    });

    const aiResponse = await response.json();
    const matchingAnalysis = JSON.parse(aiResponse.choices[0].message.content);

    // Find existing three-way match or create new one
    let threeWayMatch = await prisma.threeWayMatch.findFirst({
      where: { invoiceId }
    });

    if (threeWayMatch) {
      threeWayMatch = await prisma.threeWayMatch.update({
        where: { id: threeWayMatch.id },
        data: {
          purchaseOrderNumber: purchaseOrderData?.orderNumber,
          purchaseOrderDate: purchaseOrderData?.orderDate ? new Date(purchaseOrderData.orderDate) : null,
          purchaseOrderAmount: purchaseOrderData?.totalAmount,
          purchaseOrderStatus: purchaseOrderData?.status,
          goodsReceiptNumber: goodsReceiptData?.receiptNumber,
          goodsReceiptDate: goodsReceiptData?.receiptDate ? new Date(goodsReceiptData.receiptDate) : null,
          goodsReceiptAmount: goodsReceiptData?.totalAmount,
          goodsReceiptStatus: goodsReceiptData?.status,
          invoiceNumber: invoice.invoiceNumber,
          invoiceDate: invoice.invoiceDate,
          invoiceAmount: invoice.totalAmount,
          quantityMatch: matchingAnalysis.quantityMatch,
          priceMatch: matchingAnalysis.priceMatch,
          vendorMatch: matchingAnalysis.vendorMatch,
          dateMatch: matchingAnalysis.dateMatch,
          overallMatchScore: matchingAnalysis.overallMatchScore,
          matchingStatus: matchingAnalysis.matchingStatus,
          discrepancies: matchingAnalysis.discrepancies,
          resolutionActions: matchingAnalysis.resolutionActions,
          aiMatchingScore: matchingAnalysis.aiAnalysis.confidence,
          aiRecommendation: matchingAnalysis.aiAnalysis.recommendation,
          aiAnalysis: matchingAnalysis.aiAnalysis
        }
      });
    } else {
      threeWayMatch = await prisma.threeWayMatch.create({
        data: {
          invoiceId,
          tenantId,
          purchaseOrderNumber: purchaseOrderData?.orderNumber,
          purchaseOrderDate: purchaseOrderData?.orderDate ? new Date(purchaseOrderData.orderDate) : null,
          purchaseOrderAmount: purchaseOrderData?.totalAmount,
          purchaseOrderStatus: purchaseOrderData?.status,
          goodsReceiptNumber: goodsReceiptData?.receiptNumber,
          goodsReceiptDate: goodsReceiptData?.receiptDate ? new Date(goodsReceiptData.receiptDate) : null,
          goodsReceiptAmount: goodsReceiptData?.totalAmount,
          goodsReceiptStatus: goodsReceiptData?.status,
          invoiceNumber: invoice.invoiceNumber,
          invoiceDate: invoice.invoiceDate,
          invoiceAmount: invoice.totalAmount,
          quantityMatch: matchingAnalysis.quantityMatch,
          priceMatch: matchingAnalysis.priceMatch,
          vendorMatch: matchingAnalysis.vendorMatch,
          dateMatch: matchingAnalysis.dateMatch,
          overallMatchScore: matchingAnalysis.overallMatchScore,
          matchingStatus: matchingAnalysis.matchingStatus,
          discrepancies: matchingAnalysis.discrepancies,
          resolutionActions: matchingAnalysis.resolutionActions,
          aiMatchingScore: matchingAnalysis.aiAnalysis.confidence,
          aiRecommendation: matchingAnalysis.aiAnalysis.recommendation,
          aiAnalysis: matchingAnalysis.aiAnalysis
        }
      });
    }

    // Update invoice status based on matching result
    const newStatus = matchingAnalysis.matchingStatus === 'MATCHED' ? 'VALIDATED' : 'VALIDATION_PENDING';
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        processingStatus: newStatus
      }
    });

    return NextResponse.json({
      success: true,
      threeWayMatch,
      analysis: matchingAnalysis
    });

  } catch (error) {
    console.error('Three-way matching error:', error);
    return NextResponse.json({ error: 'Three-way matching failed' }, { status: 500 });
  }
}

// Get three-way match results for an invoice
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('invoiceId');

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID required' }, { status: 400 });
    }

    const threeWayMatch = await prisma.threeWayMatch.findFirst({
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

    if (!threeWayMatch) {
      return NextResponse.json({ error: 'Three-way match not found' }, { status: 404 });
    }

    return NextResponse.json(threeWayMatch);

  } catch (error) {
    console.error('Error fetching three-way match:', error);
    return NextResponse.json({ error: 'Failed to fetch three-way match' }, { status: 500 });
  }
}
