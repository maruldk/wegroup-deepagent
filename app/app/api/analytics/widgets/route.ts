
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma as db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dashboardId = searchParams.get('dashboardId')
    const widgetType = searchParams.get('type')
    const userId = session.user.id

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { tenant: true }
    })

    if (!user?.tenant) {
      return NextResponse.json({ error: 'No tenant selected' }, { status: 400 })
    }

    const whereClause: any = {
      dashboard: {
        tenantId: user.tenant.id
      },
      isActive: true
    }

    if (dashboardId) {
      whereClause.dashboardId = dashboardId
    }

    if (widgetType) {
      whereClause.widgetType = widgetType.toUpperCase()
    }

    const widgets = await db.analyticsWidget.findMany({
      where: whereClause,
      include: {
        dashboard: {
          select: {
            id: true,
            name: true,
            dashboardType: true
          }
        }
      },
      orderBy: { position: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: widgets
    })

  } catch (error) {
    console.error('Error fetching analytics widgets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch widgets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      dashboardId, 
      widgetType, 
      title, 
      description, 
      dataSource, 
      config, 
      position, 
      size,
      chartType,
      colorScheme
    } = body
    const userId = session.user.id

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { tenant: true }
    })

    if (!user?.tenant) {
      return NextResponse.json({ error: 'No tenant selected' }, { status: 400 })
    }

    // Verify dashboard exists and user has access
    const dashboard = await db.analyticsDashboard.findFirst({
      where: {
        id: dashboardId,
        tenantId: user.tenant.id,
        OR: [
          { createdBy: userId },
          { allowedUsers: { has: userId } },
          { isPublic: true }
        ]
      }
    })

    if (!dashboard) {
      return NextResponse.json({ error: 'Dashboard not found or access denied' }, { status: 404 })
    }

    const widget = await db.analyticsWidget.create({
      data: {
        dashboardId,
        widgetType: widgetType.toUpperCase(),
        title,
        description,
        dataSource,
        config: config || {},
        position: position || { x: 0, y: 0 },
        size: size || { width: 4, height: 3 },
        chartType,
        colorScheme: colorScheme || 'default'
      },
      include: {
        dashboard: {
          select: {
            id: true,
            name: true,
            dashboardType: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: widget
    })

  } catch (error) {
    console.error('Error creating analytics widget:', error)
    return NextResponse.json(
      { error: 'Failed to create widget' },
      { status: 500 }
    )
  }
}
