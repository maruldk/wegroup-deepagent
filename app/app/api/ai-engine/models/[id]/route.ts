
// WeGroup Platform - Sprint 4: Individual AI Model API
// CRUD Operations for Individual AI Models

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { aiEngine } from '../../../../../lib/ai-engine'

export const dynamic = "force-dynamic"

const prisma = new PrismaClient()

// GET /api/ai-engine/models/[id] - Get AI Model Details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const model = await prisma.aIModel.findUnique({
      where: { id: params.id },
      include: {
        decisions: {
          take: 20,
          orderBy: { createdAt: 'desc' }
        },
        metrics: {
          take: 50,
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!model) {
      return NextResponse.json(
        { error: 'AI model not found' },
        { status: 404 }
      )
    }

    // Get performance statistics
    const performance = await aiEngine.getModelPerformance(params.id)

    return NextResponse.json({
      success: true,
      model,
      performance
    })
  } catch (error) {
    console.error('Get AI Model error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch AI model' },
      { status: 500 }
    )
  }
}

// PUT /api/ai-engine/models/[id] - Update AI Model
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      modelConfig,
      confidenceThreshold,
      tags,
      isActive
    } = body

    const updatedModel = await prisma.aIModel.update({
      where: { id: params.id },
      data: {
        name,
        description,
        modelConfig,
        confidenceThreshold,
        tags,
        isActive
      }
    })

    return NextResponse.json({
      success: true,
      model: updatedModel,
      message: 'AI model updated successfully'
    })
  } catch (error) {
    console.error('Update AI Model error:', error)
    return NextResponse.json(
      { error: 'Failed to update AI model' },
      { status: 500 }
    )
  }
}

// DELETE /api/ai-engine/models/[id] - Delete AI Model
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.aIModel.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'AI model deleted successfully'
    })
  } catch (error) {
    console.error('Delete AI Model error:', error)
    return NextResponse.json(
      { error: 'Failed to delete AI model' },
      { status: 500 }
    )
  }
}
