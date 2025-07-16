
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

// GET /api/tenants/analytics - Get tenant analytics overview
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'DAILY';
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get tenant analytics
    const analytics = await prisma.tenantAnalytics.findMany({
      where: {
        periodType: period,
        periodStart: { gte: startDate }
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            displayName: true,
            planType: true,
            status: true
          }
        }
      },
      orderBy: { periodStart: 'desc' }
    });

    // Get overall tenant statistics
    const totalTenants = await prisma.tenant.count();
    const activeTenants = await prisma.tenant.count({
      where: { status: 'ACTIVE' }
    });
    const trialTenants = await prisma.tenant.count({
      where: { status: 'TRIAL' }
    });

    // Plan distribution
    const planDistribution = await prisma.tenant.groupBy({
      by: ['planType'],
      _count: true
    });

    // Recent activities across all tenants
    const recentActivities = await prisma.tenantActivity.findMany({
      where: {
        performedAt: { gte: startDate }
      },
      include: {
        tenant: {
          select: { name: true, displayName: true }
        },
        user: {
          select: { email: true, firstName: true, lastName: true }
        }
      },
      orderBy: { performedAt: 'desc' },
      take: 100
    });

    // Calculate aggregated metrics
    const aggregatedMetrics = analytics.reduce((acc, item) => ({
      totalUsers: acc.totalUsers + (item.totalUsers || 0),
      activeUsers: acc.activeUsers + (item.activeUsers || 0),
      totalActivities: acc.totalActivities + (item.totalActivities || 0),
      avgHealthScore: acc.avgHealthScore + (item.aiHealthScore || 0),
      avgSecurityScore: acc.avgSecurityScore + (item.securityScore || 0),
      count: acc.count + 1
    }), {
      totalUsers: 0,
      activeUsers: 0,
      totalActivities: 0,
      avgHealthScore: 0,
      avgSecurityScore: 0,
      count: 0
    });

    if (aggregatedMetrics.count > 0) {
      aggregatedMetrics.avgHealthScore /= aggregatedMetrics.count;
      aggregatedMetrics.avgSecurityScore /= aggregatedMetrics.count;
    }

    // Top performing tenants
    const topTenants = await prisma.tenant.findMany({
      where: { status: 'ACTIVE' },
      include: {
        analytics: {
          where: { periodType: 'DAILY' },
          orderBy: { periodStart: 'desc' },
          take: 1
        }
      },
      take: 10
    });

    const topTenantsWithScore = topTenants
      .map(tenant => ({
        ...tenant,
        healthScore: tenant.analytics[0]?.aiHealthScore || 0
      }))
      .sort((a, b) => b.healthScore - a.healthScore)
      .slice(0, 5);

    return NextResponse.json({
      overview: {
        totalTenants,
        activeTenants,
        trialTenants,
        inactiveTenants: totalTenants - activeTenants,
        planDistribution: planDistribution.map(p => ({
          planType: p.planType,
          count: p._count
        }))
      },
      aggregatedMetrics,
      analytics,
      recentActivities,
      topTenants: topTenantsWithScore
    });

  } catch (error) {
    console.error('Error fetching tenant analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
