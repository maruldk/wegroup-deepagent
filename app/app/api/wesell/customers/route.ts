
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()
export const dynamic = "force-dynamic"

const createCustomerSchema = z.object({
  companyName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.enum(['UNKNOWN', 'MICRO', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE']).optional(),
  annualRevenue: z.number().optional(),
  customerType: z.enum(['PROSPECT', 'LEAD', 'ACTIVE_CUSTOMER', 'INACTIVE_CUSTOMER', 'VIP_CUSTOMER', 'PARTNER', 'VENDOR']),
  customerTier: z.enum(['STANDARD', 'PREMIUM', 'VIP', 'ENTERPRISE']),
  source: z.string().optional(),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
  billingAddress: z.any().optional(),
  shippingAddress: z.any().optional()
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const customerType = searchParams.get('customerType')
    const customerTier = searchParams.get('customerTier')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {
      tenantId: session.user.tenantId || 'default',
      isActive: true
    }

    if (customerType) {
      where.customerType = customerType
    }

    if (customerTier) {
      where.customerTier = customerTier
    }

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          leads: {
            select: {
              id: true,
              status: true,
              aiQualificationScore: true
            }
          },
          opportunities: {
            select: {
              id: true,
              stage: true,
              estimatedValue: true,
              aiCloseProbability: true
            }
          },
          orders: {
            select: {
              id: true,
              totalAmount: true,
              orderDate: true
            }
          },
          _count: {
            select: {
              leads: true,
              opportunities: true,
              orders: true,
              interactions: true
            }
          }
        },
        orderBy: [
          { customerTier: 'desc' },
          { totalOrderValue: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.customer.count({ where })
    ])

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
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
    const validatedData = createCustomerSchema.parse(body)

    // Generate customer number
    const customerCount = await prisma.customer.count({
      where: { tenantId: session.user.tenantId || 'default' }
    })
    const customerNumber = `CUST-${String(customerCount + 1).padStart(6, '0')}`

    // AI-powered customer analysis
    let aiAnalysis = null
    try {
      const analysisPrompt = `Analyze this customer profile and predict:
- Lifetime value potential (scale 1-100)
- Churn probability (0-1)
- Cross-sell opportunities
- Engagement score potential
- Next best actions

Customer Data:
Company: ${validatedData.companyName || 'Individual'}
Industry: ${validatedData.industry || 'Unknown'}
Company Size: ${validatedData.companySize || 'Unknown'}
Annual Revenue: ${validatedData.annualRevenue || 'Unknown'}
Source: ${validatedData.source || 'Unknown'}
Type: ${validatedData.customerType}
Tier: ${validatedData.customerTier}`

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
              content: 'You are an expert customer analytics AI. Provide insights in JSON format with: lifetimeValueScore (0-100), churnProbability (0-1), crossSellScore (0-100), engagementScore (0-100), nextBestAction (string), and sentiment (0-1).'
            },
            {
              role: 'user',
              content: analysisPrompt
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 800
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
      console.warn('AI customer analysis failed:', error)
    }

    const customer = await prisma.customer.create({
      data: {
        customerNumber,
        companyName: validatedData.companyName,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        website: validatedData.website,
        industry: validatedData.industry,
        companySize: validatedData.companySize as any,
        annualRevenue: validatedData.annualRevenue,
        customerType: validatedData.customerType as any,
        customerTier: validatedData.customerTier as any,
        source: validatedData.source,
        tags: validatedData.tags,
        notes: validatedData.notes,
        billingAddress: validatedData.billingAddress || {},
        shippingAddress: validatedData.shippingAddress || {},
        
        // AI-enhanced fields
        aiLifetimeValue: aiAnalysis?.lifetimeValueScore ? aiAnalysis.lifetimeValueScore * 100 : null,
        aiChurnProbability: aiAnalysis?.churnProbability || 0,
        aiCrossSellScore: aiAnalysis?.crossSellScore || 0,
        aiEngagementScore: aiAnalysis?.engagementScore || 0,
        aiSentimentScore: aiAnalysis?.sentiment || 0.5,
        aiNextBestAction: aiAnalysis?.nextBestAction,
        
        tenantId: session.user.tenantId || 'default',
        assignedSalesRep: session.user.id,
        firstContactDate: new Date()
      },
      include: {
        leads: true,
        opportunities: true,
        orders: true,
        _count: {
          select: {
            leads: true,
            opportunities: true,
            orders: true,
            interactions: true
          }
        }
      }
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
