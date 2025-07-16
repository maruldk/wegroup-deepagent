
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
    const days = parseInt(searchParams.get('days') || '7');

    const metrics = await prisma.finalSystemMetrics.findMany({
      where: {
        tenantId: session.user.tenantId,
        createdAt: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    // Calculate current system status
    const latestMetric = metrics[0];
    const systemStatus = {
      autonomyLevel: latestMetric?.autonomyLevel || 99.9,
      uptime: latestMetric?.uptime || 99.9,
      status: latestMetric?.status || "OPERATIONAL",
      performance: {
        responseTime: latestMetric?.responseTime || 0,
        throughput: latestMetric?.throughput || 0,
        cpuUsage: latestMetric?.cpuUsage || 0,
        memoryUsage: latestMetric?.memoryUsage || 0,
        networkLatency: latestMetric?.networkLatency || 0
      }
    };

    return NextResponse.json({ 
      metrics,
      systemStatus,
      totalCount: metrics.length 
    });
  } catch (error) {
    console.error('Error fetching final system metrics:', error);
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
    
    const metric = await prisma.finalSystemMetrics.create({
      data: {
        tenantId: session.user.tenantId,
        autonomyLevel: body.autonomyLevel || 99.9,
        uptime: body.uptime || 99.9,
        throughput: body.throughput || 0,
        responseTime: body.responseTime || 0,
        cpuUsage: body.cpuUsage || 0,
        memoryUsage: body.memoryUsage || 0,
        networkLatency: body.networkLatency || 0,
        status: body.status || "OPERATIONAL"
      }
    });

    return NextResponse.json(metric);
  } catch (error) {
    console.error('Error creating final system metric:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
