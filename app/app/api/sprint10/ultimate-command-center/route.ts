
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

    // Get comprehensive system overview
    const [systemMetrics, deployments, marketMetrics] = await Promise.all([
      prisma.finalSystemMetrics.findFirst({
        where: { tenantId: session.user.tenantId },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.productionDeployment.findMany({
        where: { tenantId: session.user.tenantId },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.marketLaunchMetrics.findFirst({
        where: { tenantId: session.user.tenantId },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    // Calculate overall system health
    const systemHealth = {
      autonomyLevel: systemMetrics?.autonomyLevel || 99.9,
      uptime: systemMetrics?.uptime || 99.9,
      status: systemMetrics?.status || "OPERATIONAL",
      overallScore: calculateOverallScore(systemMetrics, deployments, marketMetrics)
    };

    // Global metrics overview
    const globalMetrics = {
      totalUsers: marketMetrics?.activeUsers || 0,
      revenue: marketMetrics?.revenue || 0,
      deployments: deployments.length,
      activeDeployments: deployments.filter(d => d.status === 'DEPLOYED').length,
      responseTime: systemMetrics?.responseTime || 0,
      throughput: systemMetrics?.throughput || 0
    };

    // Real-time alerts (simulated)
    const alerts = generateSystemAlerts(systemMetrics, deployments);

    return NextResponse.json({
      systemHealth,
      globalMetrics,
      alerts,
      recentDeployments: deployments,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching ultimate command center data:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function calculateOverallScore(systemMetrics: any, deployments: any[], marketMetrics: any): number {
  let score = 0;
  let factors = 0;

  if (systemMetrics) {
    score += systemMetrics.autonomyLevel;
    score += systemMetrics.uptime;
    factors += 2;
  }

  if (deployments.length > 0) {
    const deploymentScore = deployments.filter(d => d.status === 'DEPLOYED').length / deployments.length * 100;
    score += deploymentScore;
    factors += 1;
  }

  if (marketMetrics) {
    score += marketMetrics.satisfaction;
    factors += 1;
  }

  return factors > 0 ? score / factors : 95.0;
}

function generateSystemAlerts(systemMetrics: any, deployments: any[]): any[] {
  const alerts = [];

  if (systemMetrics?.autonomyLevel < 99.0) {
    alerts.push({
      type: 'WARNING',
      message: 'AI Autonomy Level below 99%',
      severity: 'MEDIUM',
      timestamp: new Date().toISOString()
    });
  }

  if (systemMetrics?.uptime < 99.5) {
    alerts.push({
      type: 'CRITICAL',
      message: 'System Uptime below 99.5%',
      severity: 'HIGH',
      timestamp: new Date().toISOString()
    });
  }

  const failedDeployments = deployments.filter(d => d.status === 'FAILED');
  if (failedDeployments.length > 0) {
    alerts.push({
      type: 'ERROR',
      message: `${failedDeployments.length} failed deployments detected`,
      severity: 'HIGH',
      timestamp: new Date().toISOString()
    });
  }

  return alerts;
}
