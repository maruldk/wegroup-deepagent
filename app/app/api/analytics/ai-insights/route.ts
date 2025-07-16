
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma as db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { dataType, timeframe, modules } = body
    const userId = session.user.id

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { tenant: true }
    })

    if (!user?.tenant) {
      return NextResponse.json({ error: 'No tenant selected' }, { status: 400 })
    }

    const tenantId = user.tenant.id

    // Gather relevant data based on request
    let dataToAnalyze: any = {}

    if (modules?.includes('WECREATE')) {
      const projects = await db.creativeProject.findMany({
        where: { tenantId },
        include: {
          assets: {
            take: 20,
            orderBy: { createdAt: 'desc' }
          },
          _count: { select: { assets: true, collaborations: true } }
        },
        take: 50,
        orderBy: { updatedAt: 'desc' }
      })
      dataToAnalyze.weCreate = projects
    }

    if (modules?.includes('WESELL')) {
      const opportunities = await db.salesOpportunity.findMany({
        where: { tenantId },
        include: {
          customer: { select: { companyName: true, customerTier: true } },
          proposals: { take: 5 }
        },
        take: 50,
        orderBy: { updatedAt: 'desc' }
      })
      dataToAnalyze.weSell = opportunities
    }

    if (modules?.includes('HR')) {
      const users = await db.user.findMany({
        where: { tenantId },
        select: {
          id: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true
        },
        take: 100
      })
      dataToAnalyze.hr = users
    }

    // Prepare prompt for AI analysis
    const analysisPrompt = `
Analyze the following business data and provide actionable insights:

Data Type: ${dataType}
Timeframe: ${timeframe}
Modules: ${modules?.join(', ')}

Data Summary:
${JSON.stringify(dataToAnalyze, null, 2)}

Please provide:
1. Key performance insights
2. Trends and patterns
3. Anomalies or concerns
4. Actionable recommendations
5. Predictive insights for the next ${timeframe}

Respond in JSON format with the following structure:
{
  "insights": [
    {
      "category": "performance|trend|anomaly|recommendation|prediction",
      "title": "Brief title",
      "description": "Detailed insight",
      "confidence": 0.0-1.0,
      "impact": "low|medium|high",
      "actionable": true/false,
      "recommendedActions": ["action1", "action2"]
    }
  ],
  "summary": "Overall summary of findings",
  "scorecard": {
    "overallHealth": 0.0-1.0,
    "performanceScore": 0.0-1.0,
    "trendScore": 0.0-1.0,
    "riskScore": 0.0-1.0
  }
}
`

    // Call AI API for insights
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
        response_format: { type: 'json_object' },
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error('Failed to get AI insights')
    }

    const aiResponse = await response.json()
    const insights = JSON.parse(aiResponse.choices[0].message.content)

    return NextResponse.json({
      success: true,
      data: {
        insights: insights.insights || [],
        summary: insights.summary || '',
        scorecard: insights.scorecard || {},
        generatedAt: new Date().toISOString(),
        dataPoints: Object.keys(dataToAnalyze).length,
        modules: modules || []
      }
    })

  } catch (error) {
    console.error('Error generating AI insights:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate AI insights',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
