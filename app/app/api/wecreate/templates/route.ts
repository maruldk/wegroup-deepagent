
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()
export const dynamic = "force-dynamic"

const createTemplateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.enum(['SOCIAL_MEDIA', 'MARKETING', 'PRESENTATION', 'EMAIL', 'DOCUMENT', 'GRAPHIC_DESIGN', 'VIDEO', 'AVATAR', 'BRAND_KIT']),
  templateType: z.string(),
  templateData: z.any(),
  isPublic: z.boolean().default(false),
  isPremium: z.boolean().default(false),
  tags: z.array(z.string()).default([])
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const templateType = searchParams.get('templateType')
    const isPopular = searchParams.get('popular') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const where: any = {
      OR: [
        { tenantId: session.user.tenantId || 'default' },
        { isPublic: true }
      ]
    }

    if (category) {
      where.category = category
    }

    if (templateType) {
      where.templateType = templateType
    }

    if (isPopular) {
      where.isPopular = true
    }

    const [templates, total] = await Promise.all([
      prisma.contentTemplate.findMany({
        where,
        include: {
          usages: {
            select: {
              id: true,
              createdAt: true
            },
            take: 1
          },
          _count: {
            select: {
              usages: true
            }
          }
        },
        orderBy: [
          { isPopular: 'desc' },
          { usageCount: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.contentTemplate.count({ where })
    ])

    return NextResponse.json({
      templates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching templates:', error)
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
    const validatedData = createTemplateSchema.parse(body)

    // AI Optimization for templates
    let aiOptimizationData = null
    try {
      const optimizationResponse = await fetch('https://apps.abacus.ai/v1/chat/completions', {
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
              content: 'You are an expert template optimizer. Analyze the template structure and suggest improvements, target use cases, and performance predictions. Return JSON with performanceScore (0-100), suitabilityTags (array), and recommendedUse (array).'
            },
            {
              role: 'user',
              content: `Optimize this template:
Title: ${validatedData.title}
Category: ${validatedData.category}
Type: ${validatedData.templateType}
Structure: ${JSON.stringify(validatedData.templateData)}`
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 800
        })
      })

      if (optimizationResponse.ok) {
        const optimization = await optimizationResponse.json()
        const content = optimization.choices?.[0]?.message?.content
        if (content) {
          aiOptimizationData = JSON.parse(content)
        }
      }
    } catch (error) {
      console.warn('AI optimization failed:', error)
    }

    const template = await prisma.contentTemplate.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category as any,
        templateType: validatedData.templateType,
        templateData: validatedData.templateData,
        isPublic: validatedData.isPublic,
        isPremium: validatedData.isPremium,
        tags: validatedData.tags,
        aiOptimized: !!aiOptimizationData,
        aiPerformanceScore: aiOptimizationData?.performanceScore || 0,
        aiSuitabilityTags: aiOptimizationData?.suitabilityTags || [],
        aiRecommendedUse: aiOptimizationData?.recommendedUse || [],
        tenantId: session.user.tenantId || 'default',
        createdBy: session.user.id
      }
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Error creating template:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
