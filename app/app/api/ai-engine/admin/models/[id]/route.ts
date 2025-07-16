
// WeGroup Platform - Individual Model Management API
// Enhanced Model CRUD Operations

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = "force-dynamic"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const model = await prisma.aIModel.findUnique({
      where: { id: params.id },
      include: {
        metrics: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        approvals: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        testResults: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        costRecords: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        decisions: {
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    })

    if (!model) {
      return NextResponse.json({
        success: false,
        error: 'Model not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      model
    })
  } catch (error) {
    console.error('Model fetch error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch model'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    // Check if significant changes require approval
    const currentModel = await prisma.aIModel.findUnique({
      where: { id: params.id }
    })

    if (!currentModel) {
      return NextResponse.json({
        success: false,
        error: 'Model not found'
      }, { status: 404 })
    }

    const significantChanges = [
      'modelType', 'provider', 'apiEndpoint', 'riskLevel'
    ].some(field => data[field] && data[field] !== currentModel[field as keyof typeof currentModel])

    let newStatus = data.status || currentModel.status
    if (significantChanges && currentModel.approvalRequired) {
      newStatus = 'PENDING_APPROVAL'
    }

    const updatedModel = await prisma.aIModel.update({
      where: { id: params.id },
      data: {
        ...data,
        status: newStatus,
        updatedAt: new Date()
      }
    })

    // Create approval request for significant changes
    if (significantChanges && currentModel.approvalRequired) {
      await prisma.modelApproval.create({
        data: {
          modelId: params.id,
          requestedBy: session.user.id || 'system',
          approvalType: 'CONFIGURATION_CHANGE',
          requestReason: 'Significant model configuration changes detected',
          tenantId: session.user.tenantId || 'default'
        }
      })
    }

    return NextResponse.json({
      success: true,
      model: updatedModel,
      requiresApproval: significantChanges && currentModel.approvalRequired
    })
  } catch (error) {
    console.error('Model update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update model'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const model = await prisma.aIModel.findUnique({
      where: { id: params.id }
    })

    if (!model) {
      return NextResponse.json({
        success: false,
        error: 'Model not found'
      }, { status: 404 })
    }

    // Soft delete - mark as archived
    await prisma.aIModel.update({
      where: { id: params.id },
      data: {
        status: 'ARCHIVED',
        isActive: false,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Model archived successfully'
    })
  } catch (error) {
    console.error('Model deletion error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to archive model'
    }, { status: 500 })
  }
}
