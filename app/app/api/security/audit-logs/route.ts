
// WeGroup Platform - Sprint 4: Security Audit Logs API
// Security Event Logging and Compliance Tracking

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

export const dynamic = "force-dynamic"

const prisma = new PrismaClient()

// GET /api/security/audit-logs - Get Security Audit Logs
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId') || session.user.tenantId
    const eventType = searchParams.get('eventType')
    const severity = searchParams.get('severity')
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '100')

    const where: any = {}
    if (tenantId) where.tenantId = tenantId
    if (eventType) where.eventType = eventType
    if (severity) where.severity = severity
    if (userId) where.userId = userId

    const auditLogs = await prisma.securityAuditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit
    })

    return NextResponse.json({
      success: true,
      auditLogs,
      total: auditLogs.length
    })
  } catch (error) {
    console.error('Security Audit Logs API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}

// POST /api/security/audit-logs - Create Security Audit Log
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      eventType,
      severity,
      description,
      details,
      resourceType,
      resourceId,
      action,
      riskScore,
      anomalyScore
    } = body

    if (!eventType || !description) {
      return NextResponse.json(
        { error: 'Event type and description are required' },
        { status: 400 }
      )
    }

    // Get request information
    const userAgent = request.headers.get('user-agent')
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwardedFor || realIp || 'unknown'

    const auditLog = await prisma.securityAuditLog.create({
      data: {
        eventType,
        severity: severity || 'INFO',
        description,
        details: details || {},
        userId: session.user.id,
        ipAddress,
        userAgent,
        resourceType,
        resourceId,
        action,
        riskScore,
        anomalyScore,
        tenantId: session.user.tenantId
      }
    })

    return NextResponse.json({
      success: true,
      auditLog,
      message: 'Security audit log created successfully'
    })
  } catch (error) {
    console.error('Create Security Audit Log error:', error)
    return NextResponse.json(
      { error: 'Failed to create security audit log' },
      { status: 500 }
    )
  }
}
