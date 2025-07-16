
// WeGroup Platform - Sprint 4: Performance Dashboard API
// Real-time Dashboard Metrics and KPIs

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { performanceMonitor } from '../../../../lib/performance-monitor'

export const dynamic = "force-dynamic"

// GET /api/monitoring/dashboard - Get Dashboard Metrics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId') || session.user.tenantId

    const dashboardMetrics = await performanceMonitor.getDashboardMetrics(tenantId)

    return NextResponse.json({
      success: true,
      metrics: dashboardMetrics
    })
  } catch (error) {
    console.error('Performance Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    )
  }
}
