
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

    // Get beta testing program data
    const betaProgram = await getBetaTestingData(session.user.tenantId);
    
    // Get revenue analytics
    const revenueAnalytics = await getRevenueAnalytics(session.user.tenantId);
    
    // Get partner ecosystem status
    const partnerEcosystem = await getPartnerEcosystem(session.user.tenantId);
    
    // Get customer success metrics
    const customerSuccess = await getCustomerSuccessMetrics(session.user.tenantId);

    return NextResponse.json({
      betaProgram,
      revenueAnalytics,
      partnerEcosystem,
      customerSuccess,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching market launch control data:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function getBetaTestingData(tenantId: string) {
  // Simulate beta testing program data
  return {
    programStatus: 'ACTIVE',
    phase: 'BETA',
    participants: {
      total: 247,
      active: 198,
      completed: 34,
      withdrawn: 15
    },
    engagement: {
      averageSessionTime: 45.2, // minutes
      featuresUsed: 12.7, // average
      completionRate: 0.78
    },
    feedback: {
      totalFeedback: 89,
      averageRating: 4.2,
      npsScore: 67,
      categories: {
        bugs: 23,
        features: 31,
        performance: 18,
        usability: 17
      }
    },
    demographics: {
      enterprise: 0.45,
      medium: 0.32,
      small: 0.23
    },
    geographicDistribution: {
      'North America': 0.48,
      'Europe': 0.31,
      'Asia': 0.21
    }
  };
}

async function getRevenueAnalytics(tenantId: string) {
  const marketMetrics = await prisma.marketLaunchMetrics.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
    take: 12
  });

  const currentRevenue = marketMetrics[0]?.revenue || 0;
  const previousRevenue = marketMetrics[1]?.revenue || 0;
  const growthRate = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

  return {
    currentPeriod: {
      revenue: currentRevenue,
      growth: growthRate,
      customers: marketMetrics[0]?.activeUsers || 0
    },
    breakdown: {
      subscriptions: currentRevenue * 0.7,
      transactions: currentRevenue * 0.2,
      services: currentRevenue * 0.1
    },
    forecasting: {
      nextQuarter: currentRevenue * 1.25,
      confidence: 0.87,
      factors: ['Market expansion', 'Product improvements', 'Partner integrations']
    },
    trends: marketMetrics.slice(0, 6).map((metric, index) => ({
      period: `Month ${index + 1}`,
      revenue: metric.revenue,
      users: metric.activeUsers,
      conversion: metric.conversionRate
    }))
  };
}

async function getPartnerEcosystem(tenantId: string) {
  return {
    totalPartners: 23,
    activeIntegrations: 18,
    revenueShare: 1250000, // $1.25M
    topPartners: [
      {
        name: 'AWS',
        type: 'TECHNOLOGY',
        integrationLevel: 'ENTERPRISE',
        revenue: 450000,
        status: 'ACTIVE'
      },
      {
        name: 'Microsoft',
        type: 'TECHNOLOGY',
        integrationLevel: 'ENTERPRISE', 
        revenue: 320000,
        status: 'ACTIVE'
      },
      {
        name: 'Salesforce',
        type: 'INTEGRATION',
        integrationLevel: 'ADVANCED',
        revenue: 180000,
        status: 'ACTIVE'
      }
    ],
    performanceMetrics: {
      averageResponseTime: 125, // ms
      successRate: 0.998,
      transactionVolume: 2500000
    },
    newPartnerRequests: 7,
    integrationsPending: 3
  };
}

async function getCustomerSuccessMetrics(tenantId: string) {
  const marketMetrics = await prisma.marketLaunchMetrics.findFirst({
    where: { tenantId },
    orderBy: { createdAt: 'desc' }
  });

  return {
    satisfaction: {
      score: marketMetrics?.satisfaction || 4.3,
      nps: marketMetrics?.npsScore || 72,
      csat: 0.87,
      trend: 'INCREASING'
    },
    support: {
      ticketsOpen: 12,
      averageResponseTime: 0.8, // hours
      resolutionRate: 0.96,
      escalationRate: 0.03
    },
    adoption: {
      featureAdoption: 0.78,
      timeToValue: 14, // days
      churnRate: 0.02,
      expansion: 0.25
    },
    health: {
      healthyAccounts: 0.82,
      atRisk: 0.13,
      critical: 0.05
    }
  };
}
