
// WeGroup Platform - Model Approval Workflow API
// Super-Admin Approval System

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const type = searchParams.get('type') || 'all'

    let whereClause: any = {
      tenantId: session.user.tenantId || 'default'
    }

    if (status !== 'all') {
      whereClause.status = status
    }

    if (type !== 'all') {
      whereClause.approvalType = type
    }

    const approvals = await prisma.modelApproval.findMany({
      where: whereClause,
      include: {
        model: {
          select: {
            name: true,
            modelType: true,
            provider: true,
            riskLevel: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json({
      success: true,
      approvals
    })
  } catch (error) {
    console.error('Approvals fetch error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch approvals'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { approvalId, action, comments } = data

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid action. Must be "approve" or "reject"'
      }, { status: 400 })
    }

    const approval = await prisma.modelApproval.findUnique({
      where: { id: approvalId },
      include: { model: true }
    })

    if (!approval) {
      return NextResponse.json({
        success: false,
        error: 'Approval not found'
      }, { status: 404 })
    }

    // Update approval status
    const updatedApproval = await prisma.modelApproval.update({
      where: { id: approvalId },
      data: {
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        approvalComments: comments,
        approvedAt: action === 'approve' ? new Date() : null,
        rejectedAt: action === 'reject' ? new Date() : null,
        approverIds: [session.user.id || 'system']
      }
    })

    // Update model status based on approval
    if (action === 'approve') {
      let newModelStatus = 'READY'
      
      if (approval.approvalType === 'DEPLOYMENT') {
        newModelStatus = 'READY'
      } else if (approval.approvalType === 'CONFIGURATION_CHANGE') {
        newModelStatus = approval.model.status // Keep current status
      }

      await prisma.aIModel.update({
        where: { id: approval.modelId },
        data: {
          status: newModelStatus as any,
          updatedAt: new Date()
        }
      })
    } else {
      // Rejected - keep in pending state or archive
      await prisma.aIModel.update({
        where: { id: approval.modelId },
        data: {
          status: 'PENDING_APPROVAL' as any,
          updatedAt: new Date()
        }
      })
    }

    // Create super admin action record
    await prisma.superAdminAction.create({
      data: {
        actionType: action === 'approve' ? 'MODEL_DEPLOYMENT' : 'MODEL_DEACTIVATION',
        targetType: 'model_approval',
        targetId: approvalId,
        actionData: {
          approvalId,
          modelId: approval.modelId,
          action,
          comments
        },
        reason: comments || `${action === 'approve' ? 'Approved' : 'Rejected'} model ${approval.approvalType.toLowerCase()}`,
        status: 'COMPLETED',
        executedAt: new Date(),
        tenantId: session.user.tenantId || 'default',
        requestedBy: session.user.id || 'system'
      }
    })

    return NextResponse.json({
      success: true,
      approval: updatedApproval,
      message: `Model ${action}d successfully`
    })
  } catch (error) {
    console.error('Approval processing error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process approval'
    }, { status: 500 })
  }
}
