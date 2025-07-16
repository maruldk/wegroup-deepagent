
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { rfqId } = body;

    // Get RFQ with quotes
    const rfq = await prisma.logisticsRFQ.findUnique({
      where: { id: rfqId },
      include: {
        quotes: {
          include: {
            supplier: {
              select: {
                id: true,
                supplierNumber: true,
                companyName: true,
                performanceScore: true,
                qualityScore: true,
                reliabilityScore: true,
                onTimeDeliveryRate: true,
                totalOrders: true,
                winRate: true,
              },
            },
          },
        },
        customerRequest: {
          select: {
            id: true,
            title: true,
            cargoType: true,
            weight: true,
            volume: true,
            value: true,
            isUrgent: true,
            requirements: true,
          },
        },
      },
    });

    if (!rfq) {
      return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    }

    if (rfq.quotes.length === 0) {
      return NextResponse.json({ error: "No quotes to compare" }, { status: 400 });
    }

    // Prepare comparison prompt
    const comparisonPrompt = `
Compare these logistics quotes for RFQ ${rfq.rfqNumber}:

CUSTOMER REQUIREMENTS:
- Cargo Type: ${rfq.customerRequest.cargoType}
- Weight: ${rfq.customerRequest.weight} kg
- Volume: ${rfq.customerRequest.volume} m³
- Value: ${rfq.customerRequest.value} EUR
- Urgent: ${rfq.customerRequest.isUrgent}
- Requirements: ${JSON.stringify(rfq.customerRequest.requirements)}

QUOTES TO COMPARE:
${rfq.quotes.map((quote, index) => `
Quote ${index + 1}:
- Supplier: ${quote.supplier.companyName}
- Price: ${quote.totalPrice} ${quote.currency}
- Delivery Time: ${quote.deliveryTime} days
- Payment Terms: ${quote.paymentTerms}
- Performance Score: ${quote.supplier.performanceScore}%
- Quality Score: ${quote.supplier.qualityScore}%
- Reliability Score: ${quote.supplier.reliabilityScore}%
- On-time Delivery: ${quote.supplier.onTimeDeliveryRate}%
- Total Orders: ${quote.supplier.totalOrders}
- Win Rate: ${quote.supplier.winRate}%
`).join('\n')}

Please provide a comprehensive comparison analysis including:
1. Price analysis (best, worst, average)
2. Delivery time analysis
3. Supplier performance comparison
4. Overall ranking with scores
5. Risk assessment for each quote
6. Best value recommendation
7. Alternative recommendations

Respond in JSON format with the following structure:
{
  "summary": {
    "totalQuotes": number,
    "averagePrice": number,
    "bestPrice": number,
    "worstPrice": number,
    "averageDeliveryTime": number,
    "bestDeliveryTime": number,
    "worstDeliveryTime": number
  },
  "rankings": [
    {
      "rank": number,
      "quoteId": "string",
      "supplierName": "string",
      "overallScore": number,
      "priceScore": number,
      "deliveryScore": number,
      "qualityScore": number,
      "reliabilityScore": number,
      "strengths": ["string"],
      "weaknesses": ["string"],
      "riskLevel": "LOW|MEDIUM|HIGH"
    }
  ],
  "recommendations": {
    "bestValue": {
      "quoteId": "string",
      "reason": "string"
    },
    "fastestDelivery": {
      "quoteId": "string",
      "reason": "string"
    },
    "mostReliable": {
      "quoteId": "string",
      "reason": "string"
    }
  },
  "insights": ["string"],
  "riskAnalysis": {
    "overallRisk": "LOW|MEDIUM|HIGH",
    "riskFactors": ["string"],
    "mitigation": ["string"]
  }
}
`;

    // Call LLM API for comparison
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'user',
            content: comparisonPrompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    const comparisonAnalysis = JSON.parse(data.choices[0].message.content);

    // Create or update quote comparison
    const quoteComparison = await prisma.logisticsQuoteComparison.upsert({
      where: { rfqId: rfqId },
      create: {
        tenantId: session.user.tenantId || "",
        rfqId: rfqId,
        comparisonData: comparisonAnalysis,
        rankings: comparisonAnalysis.rankings,
        bestQuoteId: comparisonAnalysis.recommendations.bestValue.quoteId,
        averagePrice: comparisonAnalysis.summary.averagePrice,
        priceRange: {
          min: comparisonAnalysis.summary.bestPrice,
          max: comparisonAnalysis.summary.worstPrice,
        },
        deliveryTimeRange: {
          min: comparisonAnalysis.summary.bestDeliveryTime,
          max: comparisonAnalysis.summary.worstDeliveryTime,
        },
        aiAnalysis: comparisonAnalysis,
        aiRecommendations: comparisonAnalysis.recommendations,
        riskAnalysis: comparisonAnalysis.riskAnalysis,
        status: "COMPLETED",
        analyzedAt: new Date(),
        analyzedBy: session.user.id,
      },
      update: {
        comparisonData: comparisonAnalysis,
        rankings: comparisonAnalysis.rankings,
        bestQuoteId: comparisonAnalysis.recommendations.bestValue.quoteId,
        averagePrice: comparisonAnalysis.summary.averagePrice,
        priceRange: {
          min: comparisonAnalysis.summary.bestPrice,
          max: comparisonAnalysis.summary.worstPrice,
        },
        deliveryTimeRange: {
          min: comparisonAnalysis.summary.bestDeliveryTime,
          max: comparisonAnalysis.summary.worstDeliveryTime,
        },
        aiAnalysis: comparisonAnalysis,
        aiRecommendations: comparisonAnalysis.recommendations,
        riskAnalysis: comparisonAnalysis.riskAnalysis,
        status: "COMPLETED",
        analyzedAt: new Date(),
        analyzedBy: session.user.id,
      },
    });

    // Update quote rankings
    for (const ranking of comparisonAnalysis.rankings) {
      await prisma.logisticsSupplierQuote.update({
        where: { id: ranking.quoteId },
        data: {
          aiScore: ranking.overallScore,
          aiRanking: ranking.rank,
          aiRecommendation: ranking.rank === 1 ? "HIGHLY_RECOMMENDED" : 
                           ranking.rank <= 3 ? "RECOMMENDED" : "ACCEPTABLE",
        },
      });
    }

    return NextResponse.json({
      comparison: quoteComparison,
      analysis: comparisonAnalysis,
    });
  } catch (error) {
    console.error("Error comparing quotes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
