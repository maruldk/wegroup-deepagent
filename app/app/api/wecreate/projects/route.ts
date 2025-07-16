
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()
export const dynamic = "force-dynamic"

const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  projectType: z.enum(['GENERAL', 'MARKETING_CAMPAIGN', 'SOCIAL_MEDIA', 'PRESENTATION', 'VIDEO_CONTENT', 'GRAPHIC_DESIGN', 'BRAND_IDENTITY', 'INTERACTIVE_STORY', 'AI_AVATAR_CREATION']),
  isCollaborative: z.boolean().default(false),
  maxCollaborators: z.number().optional(),
  deadlineDate: z.string().optional(),
  tags: z.array(z.string()).default([])
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const projectType = searchParams.get('projectType')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {
      tenantId: session.user.tenantId || 'default'
    }

    if (status) {
      where.status = status
    }

    if (projectType) {
      where.projectType = projectType
    }

    const [projects, total] = await Promise.all([
      prisma.creativeProject.findMany({
        where,
        include: {
          assets: {
            select: {
              id: true,
              title: true,
              assetType: true,
              thumbnailUrl: true,
              createdAt: true
            }
          },
          collaborations: {
            select: {
              userId: true,
              role: true
            }
          },
          _count: {
            select: {
              assets: true,
              collaborations: true,
              stories: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.creativeProject.count({ where })
    ])

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
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
    const validatedData = createProjectSchema.parse(body)

    const project = await prisma.creativeProject.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        projectType: validatedData.projectType as any,
        isCollaborative: validatedData.isCollaborative,
        maxCollaborators: validatedData.maxCollaborators,
        deadlineDate: validatedData.deadlineDate ? new Date(validatedData.deadlineDate) : null,
        tags: validatedData.tags,
        tenantId: session.user.tenantId || 'default',
        createdBy: session.user.id,
        status: 'DRAFT'
      },
      include: {
        assets: true,
        collaborations: true,
        _count: {
          select: {
            assets: true,
            collaborations: true,
            stories: true
          }
        }
      }
    })

    // Create owner collaboration entry
    await prisma.projectCollaboration.create({
      data: {
        projectId: project.id,
        userId: session.user.id,
        role: 'OWNER',
        tenantId: session.user.tenantId || 'default'
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
