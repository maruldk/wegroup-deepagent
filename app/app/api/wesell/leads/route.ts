
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()
export const dynamic = "force-dynamic"

const createLeadSchema = z.object({
  customerId: z.string(),
  leadSource: z.string().optional(),
  qualificationScore: z.number().min(0).max(100).optional(),
  budgetRange: z.string().optional(),
  timeframe: z.string().optional(),
  decisionMaker: z.boolean().optional(),
  notes: z.string().optional()
})

const qualifyLeadSchema = z.object({
  leadId: z.string(),
  customerInfo: z.string().optional(),
  interactionHistory: z.string().optional(),
  productInterest: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')
    const priority = searchParams.get('priority') // 'high', 'medium', 'low'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {
      tenantId: session.user.tenantId || 'default'
    }

    if (status) {
      where.status = status
    }

    if (customerId) {
      where.customerId = customerId
    }

    let orderBy: any = { createdAt: 'desc' }

    if (priority) {
      if (priority === 'high') {
        where.aiPriorityScore = { gte: 70 }
        orderBy = { aiPriorityScore: 'desc' }
      } else if (priority === 'medium') {
        where.aiPriorityScore = { gte: 40, lt: 70 }
      } else if (priority === 'low') {
        where.aiPriorityScore = { lt: 40 }
      }
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
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
              phone: true,
              customerType: true,
              customerTier: true,
              aiLifetimeValue: true
            }
          },
          activities: {
            select: {
              id: true,
              activityType: true,
              subject: true,
              outcome: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 3
          }
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.lead.count({ where })
    ])

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
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
    const validatedData = createLeadSchema.parse(body)

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

    // AI-powered lead qualification
    let aiQualification = null
    try {
      const qualificationPrompt = `Analyze this lead and provide qualification insights:

Customer Profile:
- Company: ${customer.companyName || 'Individual'}
- Industry: ${customer.industry || 'Unknown'}
- Company Size: ${customer.companySize || 'Unknown'}
- Annual Revenue: ${customer.annualRevenue || 'Unknown'}
- Customer Type: ${customer.customerType}

Lead Details:
- Source: ${validatedData.leadSource || 'Unknown'}
- Budget Range: ${validatedData.budgetRange || 'Unknown'}
- Timeframe: ${validatedData.timeframe || 'Unknown'}
- Decision Maker: ${validatedData.decisionMaker || 'Unknown'}
- Notes: ${validatedData.notes || 'None'}

Provide qualification score, conversion probability, priority score, and recommended actions.`

      const qualificationResponse = await fetch('https://apps.abacus.ai/v1/chat/completions', {
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
              content: 'You are an expert sales qualification AI. Analyze leads and provide scores. Return JSON with: qualificationScore (0-100), conversionProbability (0-1), priorityScore (0-100), recommendedActions (array), and nextContactDate (ISO string).'
            },
            {
              role: 'user',
              content: qualificationPrompt
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 800
        })
      })

      if (qualificationResponse.ok) {
        const qualification = await qualificationResponse.json()
        const content = qualification.choices?.[0]?.message?.content
        if (content) {
          aiQualification = JSON.parse(content)
        }
      }
    } catch (error) {
      console.warn('AI lead qualification failed:', error)
    }

    const lead = await prisma.lead.create({
      data: {
        customerId: validatedData.customerId,
        leadSource: validatedData.leadSource,
        qualificationScore: validatedData.qualificationScore,
        budgetRange: validatedData.budgetRange,
        timeframe: validatedData.timeframe,
        decisionMaker: validatedData.decisionMaker,
        notes: validatedData.notes,
        
        // AI-enhanced fields
        aiQualificationScore: aiQualification?.qualificationScore || 0,
        aiConversionProbability: aiQualification?.conversionProbability || 0,
        aiPriorityScore: aiQualification?.priorityScore || 0,
        aiRecommendedActions: aiQualification?.recommendedActions || [],
        aiNextContactDate: aiQualification?.nextContactDate ? new Date(aiQualification.nextContactDate) : null,
        
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
            phone: true,
            customerType: true,
            customerTier: true
          }
        }
      }
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// AI Lead Qualification Endpoint
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = qualifyLeadSchema.parse(body)

    const lead = await prisma.lead.findFirst({
      where: {
        id: validatedData.leadId,
        tenantId: session.user.tenantId || 'default'
      },
      include: {
        customer: true,
        activities: true
      }
    })

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Enhanced AI qualification with additional context
    const enhancedQualificationPrompt = `Re-qualify this lead with additional context:

Customer Profile:
${JSON.stringify(lead.customer, null, 2)}

Lead Information:
${JSON.stringify({
      id: lead.id,
      source: lead.leadSource,
      budget: lead.budgetRange,
      timeframe: lead.timeframe,
      decisionMaker: lead.decisionMaker,
      notes: lead.notes
    }, null, 2)}

Additional Context:
- Customer Info: ${validatedData.customerInfo || 'None'}
- Interaction History: ${validatedData.interactionHistory || 'None'}
- Product Interest: ${validatedData.productInterest || 'None'}

Previous Activities:
${lead.activities.map(a => `${a.activityType}: ${a.subject} (${a.outcome})`).join('\n')}

Provide updated qualification assessment.`

    const qualificationResponse = await fetch('https://apps.abacus.ai/v1/chat/completions', {
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
            content: 'You are an expert sales qualification AI. Re-analyze this lead with additional context and update scores. Return JSON with updated qualificationScore, conversionProbability, priorityScore, recommendedActions, nextContactDate, and reasoning.'
          },
          {
            role: 'user',
            content: enhancedQualificationPrompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000
      })
    })

    if (!qualificationResponse.ok) {
      throw new Error('AI qualification failed')
    }

    const qualification = await qualificationResponse.json()
    const content = qualification.choices?.[0]?.message?.content
    
    if (!content) {
      throw new Error('No qualification content received')
    }

    const aiQualification = JSON.parse(content)

    // Update lead with new AI qualification
    const updatedLead = await prisma.lead.update({
      where: { id: validatedData.leadId },
      data: {
        aiQualificationScore: aiQualification.qualificationScore || lead.aiQualificationScore,
        aiConversionProbability: aiQualification.conversionProbability || lead.aiConversionProbability,
        aiPriorityScore: aiQualification.priorityScore || lead.aiPriorityScore,
        aiRecommendedActions: aiQualification.recommendedActions || lead.aiRecommendedActions,
        aiNextContactDate: aiQualification.nextContactDate ? new Date(aiQualification.nextContactDate) : lead.aiNextContactDate,
        updatedAt: new Date()
      },
      include: {
        customer: true
      }
    })

    return NextResponse.json({
      lead: updatedLead,
      aiInsights: {
        reasoning: aiQualification.reasoning,
        qualificationImprovement: (aiQualification.qualificationScore || 0) - (lead.aiQualificationScore || 0),
        recommendedActions: aiQualification.recommendedActions
      }
    })
  } catch (error) {
    console.error('Error qualifying lead:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Lead qualification failed' }, { status: 500 })
  }
}
