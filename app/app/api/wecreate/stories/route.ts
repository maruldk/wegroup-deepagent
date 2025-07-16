
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()
export const dynamic = "force-dynamic"

const createStorySchema = z.object({
  projectId: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  storyType: z.enum(['LINEAR', 'BRANCHING', 'INTERACTIVE_PRESENTATION', 'WORKSHOP_GUIDE', 'CUSTOMER_JOURNEY', 'PRODUCT_DEMO']),
  storyData: z.any(),
  isPublic: z.boolean().default(false)
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const storyType = searchParams.get('storyType')
    const isPublished = searchParams.get('published') === 'true'

    const where: any = {
      tenantId: session.user.tenantId || 'default'
    }

    if (projectId) {
      where.projectId = projectId
    }

    if (storyType) {
      where.storyType = storyType
    }

    if (isPublished) {
      where.isPublished = true
    }

    const stories = await prisma.interactiveStory.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            title: true,
            projectType: true
          }
        },
        interactions: {
          select: {
            interactionType: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({ stories })
  } catch (error) {
    console.error('Error fetching stories:', error)
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
    const validatedData = createStorySchema.parse(body)

    // Verify project access
    const project = await prisma.creativeProject.findFirst({
      where: {
        id: validatedData.projectId,
        tenantId: session.user.tenantId || 'default'
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // AI-powered story analysis and optimization
    let aiAnalysis = null
    try {
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
              content: 'You are an expert storytelling analyst. Analyze the story structure and content to provide narrative quality score (0-100), engagement prediction (0-100), and optimization suggestions. Return JSON format.'
            },
            {
              role: 'user',
              content: `Analyze this interactive story:
Title: ${validatedData.title}
Type: ${validatedData.storyType}
Content: ${JSON.stringify(validatedData.storyData)}`
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
      console.warn('AI story analysis failed:', error)
    }

    const story = await prisma.interactiveStory.create({
      data: {
        projectId: validatedData.projectId,
        title: validatedData.title,
        description: validatedData.description,
        storyType: validatedData.storyType as any,
        storyData: validatedData.storyData,
        isPublic: validatedData.isPublic,
        aiNarrativeScore: aiAnalysis?.narrativeScore || 0,
        aiEngagementPrediction: aiAnalysis?.engagementPrediction || 0,
        aiOptimizations: aiAnalysis?.optimizations || [],
        tenantId: session.user.tenantId || 'default',
        createdBy: session.user.id
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            projectType: true
          }
        }
      }
    })

    return NextResponse.json(story, { status: 201 })
  } catch (error) {
    console.error('Error creating story:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
