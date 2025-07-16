
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
    const category = searchParams.get('category')
    const moduleType = searchParams.get('module')
    const userId = session.user.id

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { tenant: true }
    })

    if (!user?.tenant) {
      return NextResponse.json({ error: 'No tenant selected' }, { status: 400 })
    }

    const whereClause: any = {
      tenantId: user.tenant.id,
      isActive: true
    }

    if (category) {
      whereClause.category = category.toUpperCase()
    }

    if (moduleType) {
      whereClause.moduleType = moduleType.toUpperCase()
    }

    const kpis = await db.businessKPI.findMany({
      where: whereClause,
      include: {
        history: {
          take: 30,
          orderBy: { calculatedAt: 'desc' }
        },
        alerts: {
          where: { isActive: true },
          orderBy: { triggeredAt: 'desc' },
          take: 5
        },
        _count: {
          select: {
            history: true,
            alerts: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    // Calculate trends for each KPI
    const enhancedKpis = kpis.map((kpi: any) => {
      const history = kpi.history
      let trend = 0
      let trendPercentage = 0

      if (history.length >= 2) {
        const latest = history[0]?.value || 0
        const previous = history[1]?.value || 0
        trend = latest - previous
        trendPercentage = previous !== 0 ? ((latest - previous) / previous) * 100 : 0
      }

      return {
        ...kpi,
        trend,
        trendPercentage,
        historyCount: kpi._count.history,
        activeAlertsCount: kpi._count.alerts
      }
    })

    return NextResponse.json({
      success: true,
      data: enhancedKpis
    })

  } catch (error) {
    console.error('Error fetching KPIs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch KPIs' },
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
    const { name, description, category, formula, targetValue, dataSource, unit, moduleType } = body
    const userId = session.user.id

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { tenant: true }
    })

    if (!user?.tenant) {
      return NextResponse.json({ error: 'No tenant selected' }, { status: 400 })
    }

    const kpi = await db.businessKPI.create({
      data: {
        name,
        description,
        category: category.toUpperCase(),
        formula,
        targetValue: targetValue ? parseFloat(targetValue) : null,
        dataSource,
        unit,
        moduleType: moduleType ? moduleType.toUpperCase() : null,
        tenantId: user.tenant.id,
        createdBy: userId
      }
    })

    return NextResponse.json({
      success: true,
      data: kpi
    })

  } catch (error) {
    console.error('Error creating KPI:', error)
    return NextResponse.json(
      { error: 'Failed to create KPI' },
      { status: 500 }
    )
  }
}
