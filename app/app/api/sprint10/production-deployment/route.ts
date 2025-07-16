
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

    const deployments = await prisma.productionDeployment.findMany({
      where: {
        tenantId: session.user.tenantId
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate deployment statistics
    const stats = {
      total: deployments.length,
      active: deployments.filter(d => d.status === 'DEPLOYED').length,
      pending: deployments.filter(d => d.status === 'NOT_DEPLOYED').length,
      failed: deployments.filter(d => d.status === 'FAILED').length,
      averageResponseTime: deployments.reduce((sum, d) => sum + d.responseTime, 0) / deployments.length || 0,
      averageErrorRate: deployments.reduce((sum, d) => sum + d.errorRate, 0) / deployments.length || 0
    };

    return NextResponse.json({ 
      deployments,
      stats,
      totalCount: deployments.length 
    });
  } catch (error) {
    console.error('Error fetching production deployments:', error);
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
    
    const deployment = await prisma.productionDeployment.create({
      data: {
        tenantId: session.user.tenantId,
        version: body.version,
        environment: body.environment || 'PRODUCTION',
        region: body.region || 'us-east-1',
        status: body.status || 'NOT_DEPLOYED',
        progress: body.progress || 0,
        responseTime: body.responseTime || 0,
        errorRate: body.errorRate || 0,
        throughput: body.throughput || 0
      }
    });

    return NextResponse.json(deployment);
  } catch (error) {
    console.error('Error creating production deployment:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
