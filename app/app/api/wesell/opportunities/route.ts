
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()
export const dynamic = "force-dynamic"

const createOpportunitySchema = z.object({
  customerId: z.string(),
  opportunityName: z.string().min(1, 'Opportunity name is required'),
  description: z.string().optional(),
  stage: z.enum(['DISCOVERY', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']),
  estimatedValue: z.number().optional(),
  estimatedCloseDate: z.string().optional(),
  probability: z.number().min(0).max(100).optional(),
  tags: z.array(z.string()).default([]),
  competitorInfo: z.any().optional(),
  decisionCriteria: z.array(z.any()).default([]),
  keyStakeholders: z.array(z.any()).default([])
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const stage = searchParams.get('stage')
    const customerId = searchParams.get('customerId')
    const highValue = searchParams.get('highValue') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {
      tenantId: session.user.tenantId || 'default',
      isActive: true
    }

    if (stage) {
      where.stage = stage
    }

    if (customerId) {
      where.customerId = customerId
    }

    if (highValue) {
      where.estimatedValue = { gte: 10000 }
    }

    const [opportunities, total] = await Promise.all([
      prisma.salesOpportunity.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              customerNumber: true,
              companyName: true,
              firstName: true,
              lastName: true,
              email: true,
              customerType: true,
              customerTier: true,
              aiLifetimeValue: true
            }
          },
          proposals: {
            select: {
              id: true,
              proposalNumber: true,
              status: true,
              totalValue: true,
              createdAt: true
            }
          },
          activities: {
            select: {
              id: true,
              activityType: true,
              subject: true,
              outcome: true,
              completedAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 3
          },
          _count: {
            select: {
              proposals: true,
              activities: true
            }
          }
        },
        orderBy: [
          { aiCloseProbability: 'desc' },
          { estimatedValue: 'desc' },
          { updatedAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.salesOpportunity.count({ where })
    ])

    return NextResponse.json({
      opportunities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching opportunities:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createOpportunitySchema.parse(body)

    // Verify customer exists
    const customer = await prisma.customer.findFirst({
      where: {
        id: validatedData.customerId,
        tenantId: session.user.tenantId || 'default'
      }
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // AI-powered opportunity analysis
    let aiAnalysis = null
    try {
      const analysisPrompt = `Analyze this sales opportunity and provide insights:

Customer Profile:
- Company: ${customer.companyName || 'Individual'}
- Industry: ${customer.industry || 'Unknown'}
- Company Size: ${customer.companySize || 'Unknown'}
- Annual Revenue: ${customer.annualRevenue || 'Unknown'}
- Customer Type: ${customer.customerType}
- Customer Tier: ${customer.customerTier}

Opportunity Details:
- Name: ${validatedData.opportunityName}
- Description: ${validatedData.description || 'None'}
- Stage: ${validatedData.stage}
- Estimated Value: ${validatedData.estimatedValue || 'Unknown'}
- Target Close Date: ${validatedData.estimatedCloseDate || 'Unknown'}
- Initial Probability: ${validatedData.probability || 'Unknown'}%
- Competitors: ${JSON.stringify(validatedData.competitorInfo) || 'Unknown'}
- Decision Criteria: ${JSON.stringify(validatedData.decisionCriteria) || 'Unknown'}

Provide analysis on close probability, revenue prediction, risk factors, and recommendations.`

      const analysisResponse = await fetch('https://apps.abacus.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert sales opportunity analyst. Analyze opportunities and provide predictive insights. Return JSON with: closeProbability (0-100), predictedRevenue (number), riskFactors (array), recommendations (array), competitorThreat (0-100).'
            },
            {
              role: 'user',
              content: analysisPrompt
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 1000
        })
      })

      if (analysisResponse.ok) {
        const analysis = await analysisResponse.json()
        const content = analysis.choices?.[0]?.message?.content
        if (content) {
          aiAnalysis = JSON.parse(content)
        }
      }
    } catch (error) {
      console.warn('AI opportunity analysis failed:', error)
    }

    const opportunity = await prisma.salesOpportunity.create({
      data: {
        customerId: validatedData.customerId,
        opportunityName: validatedData.opportunityName,
        description: validatedData.description,
        stage: validatedData.stage as any,
        estimatedValue: validatedData.estimatedValue,
        estimatedCloseDate: validatedData.estimatedCloseDate ? new Date(validatedData.estimatedCloseDate) : null,
        probability: validatedData.probability,
        tags: validatedData.tags,
        competitorInfo: validatedData.competitorInfo || {},
        decisionCriteria: validatedData.decisionCriteria,
        keyStakeholders: validatedData.keyStakeholders,
        
        // AI-enhanced fields
        aiCloseProbability: aiAnalysis?.closeProbability || validatedData.probability || 0,
        aiRevenuePrediktion: aiAnalysis?.predictedRevenue || validatedData.estimatedValue || 0,
        aiRiskFactors: aiAnalysis?.riskFactors || [],
        aiRecommendations: aiAnalysis?.recommendations || [],
        aiCompetitorAnalysis: { threatLevel: aiAnalysis?.competitorThreat || 0 },
        
        tenantId: session.user.tenantId || 'default',
        assignedTo: session.user.id,
        createdBy: session.user.id
      },
      include: {
        customer: {
          select: {
            id: true,
            customerNumber: true,
            companyName: true,
            firstName: true,
            lastName: true,
            email: true,
            customerType: true,
            customerTier: true
          }
        }
      }
    })

    return NextResponse.json(opportunity, { status: 201 })
  } catch (error) {
    console.error('Error creating opportunity:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
