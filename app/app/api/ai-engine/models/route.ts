
// WeGroup Platform - Sprint 4: AI Models Management API
// RESTful API for AI Model CRUD Operations

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { aiEngine } from '../../../../lib/ai-engine'

export const dynamic = "force-dynamic"

const prisma = new PrismaClient()

// GET /api/ai-engine/models - List AI Models
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId') || session.user.tenantId
    const status = searchParams.get('status')
    const modelType = searchParams.get('modelType')

    const where: any = { tenantId }
    if (status) where.status = status
    if (modelType) where.modelType = modelType

    const models = await prisma.aIModel.findMany({
      where,
      include: {
        decisions: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        metrics: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const modelsWithStats = models.map(model => ({
      ...model,
      stats: {
        totalDecisions: model.decisions.length,
        recentDecisions: model.decisions.slice(0, 5),
        latestMetrics: model.metrics.slice(0, 5)
      }
    }))

    return NextResponse.json({
      success: true,
      models: modelsWithStats,
      total: models.length
    })
  } catch (error) {
    console.error('AI Models API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch AI models' },
      { status: 500 }
    )
  }
}

// POST /api/ai-engine/models - Create AI Model
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
      modelType,
      modelConfig,
      confidenceThreshold,
      tags
    } = body

    if (!name || !modelType) {
      return NextResponse.json(
        { error: 'Name and model type are required' },
        { status: 400 }
      )
    }

    const model = await prisma.aIModel.create({
      data: {
        name,
        description,
        modelType,
        modelConfig: modelConfig || {},
        confidenceThreshold: confidenceThreshold || 0.7,
        tags: tags || [],
        tenantId: session.user.tenantId || '',
        createdBy: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      model,
      message: 'AI model created successfully'
    })
  } catch (error) {
    console.error('Create AI Model error:', error)
    return NextResponse.json(
      { error: 'Failed to create AI model' },
      { status: 500 }
    )
  }
}
