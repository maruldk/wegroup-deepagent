
// WeGroup Platform - Sprint 4: Performance Metrics API
// System Performance Monitoring and Metrics Collection

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { performanceMonitor } from '../../../../lib/performance-monitor'

export const dynamic = "force-dynamic"

// GET /api/monitoring/metrics - Get Performance Metrics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId') || session.user.tenantId
    const metricName = searchParams.get('metricName') || undefined
    const timeframe = searchParams.get('timeframe') as '1h' | '24h' | '7d' || '24h'
    const limit = parseInt(searchParams.get('limit') || '100')

    const metrics = await performanceMonitor.getMetrics(
      tenantId,
      metricName,
      timeframe,
      limit
    )

    return NextResponse.json({
      success: true,
      ...metrics
    })
  } catch (error) {
    console.error('Performance Metrics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch performance metrics' },
      { status: 500 }
    )
  }
}

// POST /api/monitoring/metrics - Record Custom Metric
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      value,
      type,
      unit,
      component,
      tags,
      tenantId
    } = body

    if (!name || value === undefined || !type) {
      return NextResponse.json(
        { error: 'Name, value, and type are required' },
        { status: 400 }
      )
    }

    await performanceMonitor.recordMetric(
      tenantId || session.user.tenantId,
      {
        name,
        value,
        type,
        unit,
        component,
        tags
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Metric recorded successfully'
    })
  } catch (error) {
    console.error('Record Metric error:', error)
    return NextResponse.json(
      { error: 'Failed to record metric' },
      { status: 500 }
    )
  }
}
