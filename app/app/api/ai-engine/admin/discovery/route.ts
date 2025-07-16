
// WeGroup Platform - AI Model Discovery API
// Intelligent Model Research & Recommendations

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { discoveryType, searchCriteria, targetUseCases } = data

    // Create discovery record
    const discovery = await prisma.modelDiscovery.create({
      data: {
        discoveryType,
        searchCriteria: searchCriteria || {},
        targetUseCases: targetUseCases || [],
        currentModels: [],
        tenantId: session.user.tenantId || 'default',
        triggeredBy: session.user.id || 'system',
        status: 'RUNNING'
      }
    })

    // Start discovery process using LLM
    try {
      const discoveryResults = await performModelDiscovery(searchCriteria, targetUseCases)
      
      // Update discovery with results
      await prisma.modelDiscovery.update({
        where: { id: discovery.id },
        data: {
          status: 'COMPLETED',
          executedAt: new Date(),
          foundModels: discoveryResults.foundModels,
          recommendations: discoveryResults.recommendations,
          analysisResults: discoveryResults.analysis,
          performanceComparison: discoveryResults.performance,
          costComparison: discoveryResults.costs
        }
      })

      return NextResponse.json({
        success: true,
        discovery: {
          id: discovery.id,
          status: 'COMPLETED',
          results: discoveryResults
        }
      })
    } catch (error) {
      // Mark discovery as failed
      await prisma.modelDiscovery.update({
        where: { id: discovery.id },
        data: {
          status: 'FAILED',
          executedAt: new Date()
        }
      })

      throw error
    }
  } catch (error) {
    console.error('Model discovery error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to perform model discovery'
    }, { status: 500 })
  }
}

async function performModelDiscovery(searchCriteria: any, targetUseCases: string[]) {
  try {
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [{
          role: 'user',
          content: `As an AI Model Discovery System, research and recommend the best AI models for the following requirements:

Search Criteria: ${JSON.stringify(searchCriteria)}
Target Use Cases: ${JSON.stringify(targetUseCases)}

Research the latest AI models available (both open source and commercial) and provide:

1. FOUND MODELS - List of discovered models with details
2. RECOMMENDATIONS - Top 3-5 recommended models with reasoning
3. PERFORMANCE ANALYSIS - Comparative performance metrics
4. COST ANALYSIS - Cost comparison and optimization recommendations
5. IMPLEMENTATION GUIDANCE - Integration recommendations

Focus on:
- Latest state-of-the-art models (2024)
- Performance benchmarks and accuracy scores
- Cost efficiency analysis
- Licensing and compliance considerations
- Integration complexity assessment

Provide response in JSON format:
{
  "foundModels": [
    {
      "name": "Model Name",
      "provider": "Provider",
      "modelType": "TEXT_GENERATION",
      "description": "Model description",
      "isOpenSource": true,
      "licenseType": "Apache-2.0",
      "apiEndpoint": "https://api.example.com",
      "primaryPurpose": "Text Generation",
      "useCases": ["chat", "completion"],
      "supportedLanguages": ["en", "de"],
      "costPerToken": 0.0001,
      "accuracy": 0.95,
      "latency": 100,
      "riskLevel": "LOW",
      "securityFeatures": ["encryption", "audit"],
      "lastUpdated": "2024-12-01"
    }
  ],
  "recommendations": [
    {
      "modelId": "recommended-model-1",
      "rank": 1,
      "reasoning": "Best performance for the use case",
      "pros": ["High accuracy", "Low cost"],
      "cons": ["Limited languages"],
      "fitScore": 0.95,
      "implementationEffort": "Medium",
      "expectedROI": "High"
    }
  ],
  "analysis": {
    "totalModelsFound": 15,
    "openSourceCount": 8,
    "commercialCount": 7,
    "avgAccuracy": 0.89,
    "avgCostPerToken": 0.0002,
    "keyTrends": ["Multimodal capabilities", "Reduced costs"]
  },
  "performance": {
    "bestAccuracy": 0.98,
    "bestLatency": 50,
    "bestCostEfficiency": 0.95,
    "benchmarkResults": {}
  },
  "costs": {
    "cheapestOption": "model-x",
    "mostExpensive": "model-y",
    "costRange": [0.0001, 0.01],
    "budgetRecommendations": []
  }
}

Respond with raw JSON only.`
        }],
        response_format: { type: "json_object" },
        max_tokens: 4000
      })
    })

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`)
    }

    const result = await response.json()
    return JSON.parse(result.choices[0].message.content)
  } catch (error) {
    console.error('Model discovery LLM error:', error)
    return {
      foundModels: [],
      recommendations: [],
      analysis: { error: 'Discovery processing failed' },
      performance: {},
      costs: {}
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const discoveries = await prisma.modelDiscovery.findMany({
      where: { tenantId: session.user.tenantId || 'default' },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    return NextResponse.json({
      success: true,
      discoveries
    })
  } catch (error) {
    console.error('Discovery fetch error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch discoveries'
    }, { status: 500 })
  }
}
