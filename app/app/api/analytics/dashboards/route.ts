
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
    const type = searchParams.get('type')
    const userId = session.user.id

    // Get user's current tenant
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { tenant: true }
    })

    if (!user?.tenant) {
      return NextResponse.json({ error: 'No tenant selected' }, { status: 400 })
    }

    const tenantId = user.tenant.id

    // Build filter conditions
    const whereClause: any = {
      tenantId,
      OR: [
        { isPublic: true },
        { createdBy: userId },
        { allowedUsers: { has: userId } }
      ]
    }

    if (type) {
      whereClause.dashboardType = type.toUpperCase()
    }

    const dashboards = await db.analyticsDashboard.findMany({
      where: whereClause,
      include: {
        widgets: {
          where: { isActive: true },
          orderBy: { position: 'asc' }
        },
        reports: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            widgets: true,
            reports: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: dashboards.map((dashboard: any) => ({
        ...dashboard,
        widgetCount: dashboard._count.widgets,
        reportCount: dashboard._count.reports
      }))
    })

  } catch (error) {
    console.error('Error fetching analytics dashboards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboards' },
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
    const { name, description, dashboardType, config, isPublic, allowedRoles, allowedUsers } = body
    const userId = session.user.id

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { tenant: true }
    })

    if (!user?.tenant) {
      return NextResponse.json({ error: 'No tenant selected' }, { status: 400 })
    }

    const dashboard = await db.analyticsDashboard.create({
      data: {
        name,
        description,
        dashboardType: dashboardType || 'STANDARD',
        config: config || {},
        layout: {},
        isPublic: isPublic || false,
        allowedRoles: allowedRoles || [],
        allowedUsers: allowedUsers || [],
        tenantId: user.tenant.id,
        createdBy: userId
      },
      include: {
        widgets: true,
        _count: {
          select: {
            widgets: true,
            reports: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: dashboard
    })

  } catch (error) {
    console.error('Error creating analytics dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to create dashboard' },
      { status: 500 }
    )
  }
}
