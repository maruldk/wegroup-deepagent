
// WeGroup Platform - Sprint 4: Compliance Management API
// GDPR, SOC2, and Privacy Compliance Management

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

export const dynamic = "force-dynamic"

const prisma = new PrismaClient()

// GET /api/security/compliance - Get Compliance Records
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId') || session.user.tenantId
    const complianceType = searchParams.get('complianceType')
    const status = searchParams.get('status')

    const where: any = { tenantId }
    if (complianceType) where.complianceType = complianceType
    if (status) where.status = status

    const complianceRecords = await prisma.complianceRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    return NextResponse.json({
      success: true,
      complianceRecords,
      total: complianceRecords.length
    })
  } catch (error) {
    console.error('Compliance Records API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch compliance records' },
      { status: 500 }
    )
  }
}

// POST /api/security/compliance - Create Compliance Record
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      complianceType,
      dataSubjectId,
      requestType,
      description,
      legalBasis,
      retentionPeriod
    } = body

    if (!complianceType) {
      return NextResponse.json(
        { error: 'Compliance type is required' },
        { status: 400 }
      )
    }

    const complianceRecord = await prisma.complianceRecord.create({
      data: {
        complianceType,
        dataSubjectId,
        requestType,
        description,
        legalBasis,
        retentionPeriod,
        expiryDate: retentionPeriod ? 
          new Date(Date.now() + retentionPeriod * 24 * 60 * 60 * 1000) : 
          undefined,
        tenantId: session.user.tenantId || '',
        createdBy: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      complianceRecord,
      message: 'Compliance record created successfully'
    })
  } catch (error) {
    console.error('Create Compliance Record error:', error)
    return NextResponse.json(
      { error: 'Failed to create compliance record' },
      { status: 500 }
    )
  }
}
