
// WeGroup Platform - Sprint 4: Performance Alerts API
// Alert Management and Incident Tracking

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { performanceMonitor } from '../../../../lib/performance-monitor'

export const dynamic = "force-dynamic"

const prisma = new PrismaClient()

// GET /api/monitoring/alerts - Get Alerts and Incidents
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId') || session.user.tenantId
    const status = searchParams.get('status') || undefined

    const alerts = await performanceMonitor.getAlerts(tenantId, status)

    return NextResponse.json({
      success: true,
      ...alerts
    })
  } catch (error) {
    console.error('Performance Alerts API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}

// POST /api/monitoring/alerts - Create Alert Rule
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
      metricQuery,
      threshold,
      operator,
      evaluationWindow,
      severity,
      notificationChannels,
      cooldownPeriod
    } = body

    if (!name || !metricQuery || threshold === undefined || !operator) {
      return NextResponse.json(
        { error: 'Name, metric query, threshold, and operator are required' },
        { status: 400 }
      )
    }

    const alertRule = await prisma.alertRule.create({
      data: {
        name,
        description,
        metricQuery,
        threshold,
        operator,
        evaluationWindow: evaluationWindow || 300,
        severity: severity || 'WARNING',
        notificationChannels: notificationChannels || [],
        cooldownPeriod: cooldownPeriod || 900,
        tenantId: session.user.tenantId,
        createdBy: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      alertRule,
      message: 'Alert rule created successfully'
    })
  } catch (error) {
    console.error('Create Alert Rule error:', error)
    return NextResponse.json(
      { error: 'Failed to create alert rule' },
      { status: 500 }
    )
  }
}
