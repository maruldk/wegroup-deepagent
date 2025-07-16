
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '30'; // days

    const metrics = await prisma.marketLaunchMetrics.findMany({
      where: {
        tenantId: session.user.tenantId,
        createdAt: {
          gte: new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate market performance
    const latest = metrics[0];
    const marketPerformance = {
      betaUsers: latest?.betaUsers || 0,
      activeUsers: latest?.activeUsers || 0,
      conversionRate: latest?.conversionRate || 0,
      revenue: latest?.revenue || 0,
      growthRate: latest?.growthRate || 0,
      satisfaction: latest?.satisfaction || 0,
      npsScore: latest?.npsScore || 0
    };

    // Calculate trends
    const trends = {
      userGrowth: metrics.length > 1 ? 
        ((metrics[0]?.activeUsers || 0) - (metrics[1]?.activeUsers || 0)) / (metrics[1]?.activeUsers || 1) * 100 : 0,
      revenueGrowth: metrics.length > 1 ? 
        ((metrics[0]?.revenue || 0) - (metrics[1]?.revenue || 0)) / (metrics[1]?.revenue || 1) * 100 : 0,
      satisfactionTrend: metrics.length > 1 ? 
        (metrics[0]?.satisfaction || 0) - (metrics[1]?.satisfaction || 0) : 0
    };

    return NextResponse.json({ 
      metrics,
      marketPerformance,
      trends,
      totalCount: metrics.length 
    });
  } catch (error) {
    console.error('Error fetching market launch metrics:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    const metric = await prisma.marketLaunchMetrics.create({
      data: {
        tenantId: session.user.tenantId,
        betaUsers: body.betaUsers || 0,
        activeUsers: body.activeUsers || 0,
        conversionRate: body.conversionRate || 0,
        revenue: body.revenue || 0,
        growthRate: body.growthRate || 0,
        satisfaction: body.satisfaction || 0,
        npsScore: body.npsScore || 0
      }
    });

    return NextResponse.json(metric);
  } catch (error) {
    console.error('Error creating market launch metric:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
