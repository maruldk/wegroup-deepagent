
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()
export const dynamic = "force-dynamic"

const createAssetSchema = z.object({
  projectId: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assetType: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'TEMPLATE', 'AVATAR', 'LOGO', 'ICON', 'FONT', 'COLOR_PALETTE', 'DESIGN_SYSTEM']),
  content: z.string().optional(), // For text assets
  fileUrl: z.string().optional(),
  aiGeneratedPrompt: z.string().optional(),
  aiTags: z.array(z.string()).default([]),
  colorPalette: z.array(z.any()).optional(),
  dominantColors: z.array(z.string()).default([])
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const assetType = searchParams.get('assetType')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {
      tenantId: session.user.tenantId || 'default'
    }

    if (projectId) {
      where.projectId = projectId
    }

    if (assetType) {
      where.assetType = assetType
    }

    const [assets, total] = await Promise.all([
      prisma.creativeAsset.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              title: true,
              projectType: true
            }
          },
          usageHistory: {
            select: {
              usageType: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.creativeAsset.count({ where })
    ])

    return NextResponse.json({
      assets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching assets:', error)
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
    const validatedData = createAssetSchema.parse(body)

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

    // Generate AI analysis for the content if it's provided
    let aiAnalysis = null
    if (validatedData.content && validatedData.assetType === 'TEXT') {
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
                content: 'You are an expert content analyst. Analyze the provided text and return a JSON object with quality score (0-100), suggested tags, sentiment score (-1 to 1), and readability assessment.'
              },
              {
                role: 'user',
                content: `Analyze this content: ${validatedData.content}`
              }
            ],
            response_format: { type: "json_object" },
            max_tokens: 500
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
        console.warn('AI analysis failed:', error)
      }
    }

    const asset = await prisma.creativeAsset.create({
      data: {
        projectId: validatedData.projectId,
        title: validatedData.title,
        description: validatedData.description,
        assetType: validatedData.assetType as any,
        fileUrl: validatedData.fileUrl,
        textContent: validatedData.content,
        aiGeneratedPrompt: validatedData.aiGeneratedPrompt,
        aiTags: validatedData.aiTags,
        aiQualityScore: aiAnalysis?.qualityScore || 0,
        aiDescription: aiAnalysis?.description,
        colorPalette: validatedData.colorPalette || [],
        dominantColors: validatedData.dominantColors,
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

    return NextResponse.json(asset, { status: 201 })
  } catch (error) {
    console.error('Error creating asset:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
