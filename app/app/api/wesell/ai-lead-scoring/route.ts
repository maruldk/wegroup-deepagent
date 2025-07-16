
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
    const { leadId, forceRecalculation } = body
    const userId = session.user.id

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { tenant: true }
    })

    if (!user?.tenant) {
      return NextResponse.json({ error: 'No tenant selected' }, { status: 400 })
    }

    const tenantId = user.tenant.id

    // Get lead with related data
    const lead = await db.lead.findFirst({
      where: { id: leadId, tenantId },
      include: {
        customer: {
          include: {
            interactions: {
              orderBy: { createdAt: 'desc' },
              take: 10
            },
            opportunities: {
              orderBy: { createdAt: 'desc' },
              take: 5
            }
          }
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Skip AI scoring if recent and not forced
    const lastUpdated = lead.updatedAt
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    
    if (!forceRecalculation && lastUpdated > oneHourAgo && (lead.aiQualificationScore || 0) > 0) {
      return NextResponse.json({
        success: true,
        data: {
          leadId: lead.id,
          aiQualificationScore: lead.aiQualificationScore,
          aiConversionProbability: lead.aiConversionProbability,
          aiPriorityScore: lead.aiPriorityScore,
          aiRecommendedActions: lead.aiRecommendedActions,
          lastUpdated: lead.updatedAt,
          cached: true
        }
      })
    }

    // Prepare data for AI analysis
    const analysisData = {
      lead: {
        source: lead.leadSource,
        status: lead.status,
        qualificationScore: lead.qualificationScore,
        budgetRange: lead.budgetRange,
        timeframe: lead.timeframe,
        isDecisionMaker: lead.decisionMaker,
        contactAttempts: lead.contactAttempts,
        daysSinceCreated: Math.floor((new Date().getTime() - lead.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      },
      customer: {
        companySize: lead.customer.companySize,
        industry: lead.customer.industry,
        annualRevenue: lead.customer.annualRevenue?.toString(),
        customerType: lead.customer.customerType,
        lifecycleStage: lead.customer.lifecycleStage,
        totalOrders: lead.customer.totalOrders,
        averageOrderValue: lead.customer.averageOrderValue?.toString(),
        recentInteractionCount: lead.customer.interactions.length,
        openOpportunities: lead.customer.opportunities.filter((o: any) => o.stage !== 'CLOSED_WON' && o.stage !== 'CLOSED_LOST').length
      },
      activities: lead.activities.map((activity: any) => ({
        type: activity.activityType,
        outcome: activity.outcome,
        daysSinceActivity: Math.floor((new Date().getTime() - activity.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      }))
    }

    // AI Scoring Prompt
    const scoringPrompt = `
Analyze this sales lead and provide AI-driven scoring and recommendations:

LEAD DATA:
${JSON.stringify(analysisData, null, 2)}

Please evaluate:
1. Lead qualification score (0-100)
2. Conversion probability (0-1.0)
3. Priority score (0-1.0)
4. Next best actions
5. Risk factors
6. Engagement recommendations

Consider factors like:
- Company fit and profile
- Engagement level and responsiveness
- Budget and timeline alignment
- Decision-making authority
- Past interaction patterns
- Industry and market factors

Respond in JSON format:
{
  "qualificationScore": 0-100,
  "conversionProbability": 0.0-1.0,
  "priorityScore": 0.0-1.0,
  "confidenceLevel": 0.0-1.0,
  "scoringFactors": {
    "companyFit": 0.0-1.0,
    "engagement": 0.0-1.0,
    "budget": 0.0-1.0,
    "timeline": 0.0-1.0,
    "authority": 0.0-1.0
  },
  "recommendedActions": [
    {
      "action": "Action description",
      "priority": "HIGH|MEDIUM|LOW",
      "timeframe": "Timeline for action"
    }
  ],
  "riskFactors": ["risk1", "risk2"],
  "engagementStrategy": "Recommended engagement approach",
  "nextContactDate": "Suggested next contact date",
  "insights": ["insight1", "insight2", "insight3"]
}
`

    // Call AI API
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
            content: scoringPrompt
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1500
      })
    })

    if (!response.ok) {
      throw new Error('Failed to get AI scoring')
    }

    const aiResponse = await response.json()
    const scoring = JSON.parse(aiResponse.choices[0].message.content)

    // Calculate next contact date
    let nextContactDate = null
    if (scoring.nextContactDate) {
      try {
        nextContactDate = new Date(scoring.nextContactDate)
      } catch (e) {
        // Fallback: add days based on priority
        const daysToAdd = scoring.priorityScore > 0.8 ? 1 : scoring.priorityScore > 0.5 ? 3 : 7
        nextContactDate = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000)
      }
    }

    // Update lead with AI scoring
    const updatedLead = await db.lead.update({
      where: { id: leadId },
      data: {
        aiQualificationScore: scoring.qualificationScore || 50,
        aiConversionProbability: scoring.conversionProbability || 0.5,
        aiPriorityScore: scoring.priorityScore || 0.5,
        aiRecommendedActions: scoring.recommendedActions || [],
        aiNextContactDate: nextContactDate
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        leadId: updatedLead.id,
        aiQualificationScore: updatedLead.aiQualificationScore,
        aiConversionProbability: updatedLead.aiConversionProbability,
        aiPriorityScore: updatedLead.aiPriorityScore,
        aiRecommendedActions: updatedLead.aiRecommendedActions,
        aiNextContactDate: updatedLead.aiNextContactDate,
        aiInsights: {
          scoringFactors: scoring.scoringFactors,
          riskFactors: scoring.riskFactors,
          engagementStrategy: scoring.engagementStrategy,
          insights: scoring.insights,
          confidenceLevel: scoring.confidenceLevel
        },
        lastUpdated: new Date(),
        cached: false
      }
    })

  } catch (error) {
    console.error('Error in AI lead scoring:', error)
    return NextResponse.json(
      { 
        error: 'Failed to score lead',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const minScore = parseFloat(searchParams.get('minScore') || '0')
    const userId = session.user.id

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { tenant: true }
    })

    if (!user?.tenant) {
      return NextResponse.json({ error: 'No tenant selected' }, { status: 400 })
    }

    // Get leads with AI scoring
    const leads = await db.lead.findMany({
      where: {
        tenantId: user.tenant.id,
        aiQualificationScore: {
          gte: minScore
        }
      },
      include: {
        customer: {
          select: {
            companyName: true,
            firstName: true,
            lastName: true,
            email: true,
            customerTier: true
          }
        }
      },
      orderBy: [
        { aiPriorityScore: 'desc' },
        { aiQualificationScore: 'desc' }
      ],
      take: limit
    })

    return NextResponse.json({
      success: true,
      data: leads.map((lead: any) => ({
        id: lead.id,
        customer: lead.customer,
        leadSource: lead.leadSource,
        status: lead.status,
        aiQualificationScore: lead.aiQualificationScore,
        aiConversionProbability: lead.aiConversionProbability,
        aiPriorityScore: lead.aiPriorityScore,
        aiRecommendedActions: lead.aiRecommendedActions,
        aiNextContactDate: lead.aiNextContactDate,
        updatedAt: lead.updatedAt
      }))
    })

  } catch (error) {
    console.error('Error fetching scored leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}
