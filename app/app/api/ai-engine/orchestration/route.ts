
// WeGroup Platform - Sprint 4: AI Orchestration API
// Cross-Module AI Orchestration Management

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { aiEngine } from '../../../../lib/ai-engine'

export const dynamic = "force-dynamic"

const prisma = new PrismaClient()

// GET /api/ai-engine/orchestration - List Orchestrators
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId') || session.user.tenantId || ''

    const orchestrators = await prisma.aIOrchestrator.findMany({
      where: { tenantId },
      include: {
        executions: {
          take: 5,
          orderBy: { startedAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      orchestrators,
      total: orchestrators.length
    })
  } catch (error) {
    console.error('AI Orchestration API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orchestrators' },
      { status: 500 }
    )
  }
}

// POST /api/ai-engine/orchestration - Create Orchestrator
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      orchestrationRules,
      enabledModules,
      eventTriggers,
      workflowDefinition,
      priority
    } = body

    if (!name || !enabledModules?.length) {
      return NextResponse.json(
        { error: 'Name and enabled modules are required' },
        { status: 400 }
      )
    }

    const orchestrator = await prisma.aIOrchestrator.create({
      data: {
        name,
        description,
        orchestrationRules: orchestrationRules || [],
        enabledModules,
        eventTriggers: eventTriggers || [],
        workflowDefinition: workflowDefinition || {},
        priority: priority || 'MEDIUM',
        tenantId: session.user.tenantId || '',
        createdBy: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      orchestrator,
      message: 'AI orchestrator created successfully'
    })
  } catch (error) {
    console.error('Create AI Orchestrator error:', error)
    return NextResponse.json(
      { error: 'Failed to create AI orchestrator' },
      { status: 500 }
    )
  }
}
