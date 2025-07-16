
// WeGroup Platform - AI Model Administration API
// Enhanced Model Registry & Management System

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
    const filter = searchParams.get('filter') || 'all'
    const source = searchParams.get('source') || 'all'
    const limit = parseInt(searchParams.get('limit') || '50')

    let whereClause: any = {}

    if (filter !== 'all') {
      whereClause.status = filter
    }

    if (source !== 'all') {
      whereClause.modelSource = source
    }

    const models = await prisma.aIModel.findMany({
      where: whereClause,
      include: {
        metrics: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        approvals: {
          take: 3,
          orderBy: { createdAt: 'desc' }
        },
        testResults: {
          take: 3,
          orderBy: { createdAt: 'desc' }
        },
        costRecords: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      },
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    const enhancedModels = models.map(model => ({
      ...model,
      totalCost: model.costRecords[0]?.totalCost || 0,
      recentAccuracy: model.metrics[0]?.metricValue || model.accuracy,
      needsApproval: model.approvals.some(a => a.status === 'PENDING'),
      lastTestScore: model.testResults[0]?.accuracy || 0
    }))

    return NextResponse.json({
      success: true,
      models: enhancedModels,
      total: models.length
    })
  } catch (error) {
    console.error('Model registry fetch error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch models'
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
    
    // Create new AI model with enhanced administration fields
    const model = await prisma.aIModel.create({
      data: {
        name: data.name,
        description: data.description,
        modelType: data.modelType,
        version: data.version || '1.0.0',
        status: 'PENDING_APPROVAL',
        modelSource: data.modelSource,
        isOpenSource: data.isOpenSource || true,
        licenseType: data.licenseType,
        provider: data.provider,
        apiEndpoint: data.apiEndpoint,
        apiKeyRequired: data.apiKeyRequired || false,
        costPerRequest: data.costPerRequest,
        costPerToken: data.costPerToken,
        primaryPurpose: data.primaryPurpose,
        useCases: data.useCases || [],
        supportedLanguages: data.supportedLanguages || [],
        securityCompliance: data.securityCompliance || {},
        auditRequired: data.auditRequired || false,
        approvalRequired: data.approvalRequired || true,
        riskLevel: data.riskLevel || 'LOW',
        tenantId: session.user.tenantId || 'default',
        createdBy: session.user.id || 'system',
        tags: data.tags || []
      }
    })

    // Create approval request if required
    if (data.approvalRequired) {
      await prisma.modelApproval.create({
        data: {
          modelId: model.id,
          requestedBy: session.user.id || 'system',
          approvalType: 'DEPLOYMENT',
          requestReason: `New model registration: ${model.name}`,
          riskAssessment: {
            riskLevel: data.riskLevel,
            assessmentDate: new Date(),
            assessedBy: session.user.id
          },
          tenantId: session.user.tenantId || 'default'
        }
      })
    }

    return NextResponse.json({
      success: true,
      model,
      message: 'Model registered successfully'
    })
  } catch (error) {
    console.error('Model registration error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to register model'
    }, { status: 500 })
  }
}
