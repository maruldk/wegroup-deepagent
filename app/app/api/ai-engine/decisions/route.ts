
// WeGroup Platform - Sprint 4: AI Decisions API
// AI Decision Making and Management

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { aiEngine } from '../../../../lib/ai-engine'
import { eventSystem } from '../../../../lib/event-system'

export const dynamic = "force-dynamic"

const prisma = new PrismaClient()

// GET /api/ai-engine/decisions - List AI Decisions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId') || session.user.tenantId
    const status = searchParams.get('status')
    const decisionType = searchParams.get('decisionType')
    const moduleSource = searchParams.get('moduleSource')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = { tenantId }
    if (status) where.status = status
    if (decisionType) where.decisionType = decisionType
    if (moduleSource) where.moduleSource = moduleSource

    const decisions = await prisma.aIDecision.findMany({
      where,
      include: {
        model: {
          select: {
            name: true,
            modelType: true,
            accuracy: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return NextResponse.json({
      success: true,
      decisions,
      total: decisions.length
    })
  } catch (error) {
    console.error('AI Decisions API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch AI decisions' },
      { status: 500 }
    )
  }
}

// POST /api/ai-engine/decisions - Create AI Decision
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      decisionType,
      context,
      inputData,
      moduleSource,
      affectedEntity
    } = body

    if (!decisionType || !context || !moduleSource) {
      return NextResponse.json(
        { error: 'Decision type, context, and module source are required' },
        { status: 400 }
      )
    }

    const decision = await aiEngine.makeDecision(
      decisionType,
      context,
      inputData || {},
      moduleSource,
      session.user.tenantId || '',
      affectedEntity
    )

    if (decision) {
      // Publish decision event
      await eventSystem.publishAIDecision(
        decision.id,
        decision.decisionType,
        {
          status: decision.status,
          confidence: decision.confidenceScore,
          reasoning: decision.decisionReasoning
        },
        session.user.tenantId || ''
      )

      return NextResponse.json({
        success: true,
        decision,
        message: 'AI decision created successfully'
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to create AI decision' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Create AI Decision error:', error)
    return NextResponse.json(
      { error: 'Failed to create AI decision' },
      { status: 500 }
    )
  }
}
