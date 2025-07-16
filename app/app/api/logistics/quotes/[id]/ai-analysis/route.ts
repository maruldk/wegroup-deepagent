
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quote = await prisma.logisticsSupplierQuote.findUnique({
      where: { id: params.id },
      include: {
        supplier: {
          select: {
            id: true,
            companyName: true,
            performanceScore: true,
            qualityScore: true,
            reliabilityScore: true,
            onTimeDeliveryRate: true,
            totalOrders: true,
            winRate: true,
            servicesOffered: true,
            geographicalCoverage: true,
            certifications: true,
          },
        },
        rfq: {
          include: {
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
        },
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // Prepare AI analysis prompt
    const analysisPrompt = `
Analyze this logistics quote and provide detailed assessment:

QUOTE DETAILS:
- Quote ID: ${quote.quoteNumber}
- Supplier: ${quote.supplier.companyName}
- Total Price: ${quote.totalPrice} ${quote.currency}
- Delivery Time: ${quote.deliveryTime} days
- Payment Terms: ${quote.paymentTerms}

SUPPLIER PERFORMANCE:
- Performance Score: ${quote.supplier.performanceScore}%
- Quality Score: ${quote.supplier.qualityScore}%
- Reliability Score: ${quote.supplier.reliabilityScore}%
- On-time Delivery Rate: ${quote.supplier.onTimeDeliveryRate}%
- Total Orders: ${quote.supplier.totalOrders}
- Win Rate: ${quote.supplier.winRate}%

CUSTOMER REQUIREMENTS:
- Cargo Type: ${quote.rfq.customerRequest.cargoType}
- Weight: ${quote.rfq.customerRequest.weight} kg
- Volume: ${quote.rfq.customerRequest.volume} m³
- Value: ${quote.rfq.customerRequest.value} ${quote.currency}
- Urgent: ${quote.rfq.customerRequest.isUrgent}
- Requirements: ${JSON.stringify(quote.rfq.customerRequest.requirements)}

EVALUATION CRITERIA:
1. Price Competitiveness (30%)
2. Delivery Performance (25%)
3. Quality & Reliability (20%)
4. Service Capabilities (15%)
5. Risk Assessment (10%)

Please provide:
1. Overall AI Score (0-100)
2. Detailed analysis for each criterion
3. Strengths and weaknesses
4. Risk factors
5. Recommendation (HIGHLY_RECOMMENDED, RECOMMENDED, ACCEPTABLE, NOT_RECOMMENDED)
6. Justification for the recommendation

Respond in JSON format with the following structure:
{
  "aiScore": number,
  "recommendation": "HIGHLY_RECOMMENDED|RECOMMENDED|ACCEPTABLE|NOT_RECOMMENDED",
  "analysis": {
    "priceCompetitiveness": {
      "score": number,
      "analysis": "string"
    },
    "deliveryPerformance": {
      "score": number,
      "analysis": "string"
    },
    "qualityReliability": {
      "score": number,
      "analysis": "string"
    },
    "serviceCapabilities": {
      "score": number,
      "analysis": "string"
    },
    "riskAssessment": {
      "score": number,
      "analysis": "string"
    }
  },
  "strengths": ["string"],
  "weaknesses": ["string"],
  "riskFactors": ["string"],
  "justification": "string"
}
`;

    // Call LLM API for analysis
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
            content: analysisPrompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    const aiAnalysis = JSON.parse(data.choices[0].message.content);

    // Update quote with AI analysis
    const updatedQuote = await prisma.logisticsSupplierQuote.update({
      where: { id: params.id },
      data: {
        aiScore: aiAnalysis.aiScore,
        aiRecommendation: aiAnalysis.recommendation,
        aiAnalysis: aiAnalysis,
      },
      include: {
        supplier: {
          select: {
            id: true,
            supplierNumber: true,
            companyName: true,
            performanceScore: true,
          },
        },
        rfq: {
          select: {
            id: true,
            rfqNumber: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({
      quote: updatedQuote,
      analysis: aiAnalysis,
    });
  } catch (error) {
    console.error("Error performing AI analysis:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
