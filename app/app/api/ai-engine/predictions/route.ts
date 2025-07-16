
// WeGroup Platform - Sprint 4: AI Predictions API
// Predictive Analytics and Forecasting

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiEngine } from '../../../../lib/ai-engine'

export const dynamic = "force-dynamic"

// GET /api/ai-engine/predictions - Generate Predictions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') as '24h' | '48h' | '7d' | '30d' || '48h'
    const tenantId = searchParams.get('tenantId') || session.user.tenantId

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      )
    }

    const predictions = await aiEngine.generatePredictions(tenantId, timeframe)

    return NextResponse.json({
      success: true,
      predictions,
      timeframe
    })
  } catch (error) {
    console.error('AI Predictions API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate predictions' },
      { status: 500 }
    )
  }
}

// POST /api/ai-engine/predictions - Request Custom Prediction
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      predictionType,
      context,
      timeframe,
      parameters
    } = body

    if (!predictionType || !context) {
      return NextResponse.json(
        { error: 'Prediction type and context are required' },
        { status: 400 }
      )
    }

    // Use LLM API for custom prediction
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
          content: `Generate a business prediction for:

Prediction Type: ${predictionType}
Context: ${JSON.stringify(context)}
Timeframe: ${timeframe}
Parameters: ${JSON.stringify(parameters)}

Provide a detailed prediction with:
{
  "prediction": {
    "outcome": "specific prediction outcome",
    "confidence": 0.85,
    "probability": 0.72,
    "impact": "high|medium|low",
    "factors": ["factor1", "factor2", "factor3"]
  },
  "timeline": {
    "shortTerm": "1-7 days prediction",
    "mediumTerm": "1-4 weeks prediction", 
    "longTerm": "1-3 months prediction"
  },
  "recommendations": [
    {
      "action": "recommended action",
      "priority": "high|medium|low",
      "timeline": "immediate|week|month"
    }
  ],
  "riskFactors": [
    {
      "risk": "potential risk",
      "probability": 0.3,
      "mitigation": "mitigation strategy"
    }
  ]
}

Respond with raw JSON only.`
        }],
        response_format: { type: "json_object" },
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`)
    }

    const result = await response.json()
    const predictionData = JSON.parse(result.choices[0].message.content)

    return NextResponse.json({
      success: true,
      prediction: {
        type: predictionType,
        requestedBy: session.user.id,
        generatedAt: new Date(),
        ...predictionData
      }
    })
  } catch (error) {
    console.error('Custom Prediction error:', error)
    return NextResponse.json(
      { error: 'Failed to generate custom prediction' },
      { status: 500 }
    )
  }
}
