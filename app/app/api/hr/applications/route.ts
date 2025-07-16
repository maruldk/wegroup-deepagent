
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET /api/hr/applications - List job applications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const position = searchParams.get('position')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {
      tenantId: session.user.tenantId
    }

    if (status) {
      where.status = status
    }

    if (position) {
      where.position = { contains: position, mode: 'insensitive' }
    }

    const [applications, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        include: {
          assignedEmployee: {
            select: { id: true, firstName: true, lastName: true }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { appliedDate: 'desc' }
      }),
      prisma.jobApplication.count({ where })
    ])

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('HR Applications API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/hr/applications - Create job application
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      candidateName,
      candidateEmail,
      position,
      resumeUrl,
      coverLetterUrl,
      assignedEmployeeId
    } = body

    const application = await prisma.jobApplication.create({
      data: {
        candidateName,
        candidateEmail,
        position,
        resumeUrl,
        coverLetterUrl,
        assignedEmployeeId,
        tenantId: session.user.tenantId,
        // Initialize KI fields
        aiSuitabilityScore: 0.0,
        aiSkillsMatch: {},
        aiPersonalityFit: {},
        confidenceScore: 0.0
      },
      include: {
        assignedEmployee: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    console.error('Create Application Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
