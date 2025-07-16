
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const tenantId = url.searchParams.get('tenantId');
    const mandantType = url.searchParams.get('mandantType') || 'ALL';

    if (!tenantId) {
      return NextResponse.json({ error: 'Missing tenantId' }, { status: 400 });
    }

    // Mock-Daten für Demo (da transportRequest Tabelle nicht existiert)
    const transportRequests: any[] = [];

    // Get suppliers metrics
    const suppliers = await prisma.logisticsSupplier.findMany({
      where: { tenantId },
      include: {
        quotes: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        }
      }
    });

    // Get customers metrics
    const customers = await prisma.logisticsCustomer.findMany({
      where: { tenantId }
    });

    // Calculate metrics
    const metrics = {
      // Transport Requests
      totalRequests: transportRequests.length,
      pendingRequests: transportRequests.filter((r: any) => r.status === 'PENDING').length,
      quotedRequests: transportRequests.filter((r: any) => r.status === 'QUOTED').length,
      orderedRequests: transportRequests.filter((r: any) => r.status === 'ORDERED').length,
      inTransitRequests: transportRequests.filter((r: any) => r.status === 'IN_TRANSIT').length,
      deliveredRequests: transportRequests.filter((r: any) => r.status === 'DELIVERED').length,
      
      // Financial Metrics
      totalQuoteValue: transportRequests.reduce((sum: any, req: any) => 
        sum + req.quotes.reduce((qSum: any, quote: any) => qSum + quote.price, 0), 0
      ),
      totalOrderValue: transportRequests.reduce((sum: any, req: any) => 
        sum + req.orders.reduce((oSum: any, order: any) => oSum + order.finalPrice, 0), 0
      ),
      averageQuoteValue: transportRequests.length > 0 ? 
        transportRequests.reduce((sum: any, req: any) => 
          sum + req.quotes.reduce((qSum: any, quote: any) => qSum + quote.price, 0), 0
        ) / transportRequests.length : 0,
      
      // Supplier Metrics
      totalSuppliers: suppliers.length,
      activeSuppliers: suppliers.filter(s => s.status === 'ACTIVE').length,
      suppliersWithPortal: suppliers.filter((s: any) => s.portalAccess).length,
      averageSupplierRating: suppliers.length > 0 ? 
        suppliers.reduce((sum: any, s: any) => sum + (s.rating || 0), 0) / suppliers.length : 0,
      
      // Customer Metrics
      totalCustomers: customers.length,
      activeCustomers: customers.filter(c => c.status === 'ACTIVE').length,
      customersWithPortal: customers.filter((c: any) => c.portalAccess).length,
      totalEndClients: customers.reduce((sum: any, c: any) => sum + (c.endClients?.length || 0), 0),
      totalBranches: customers.reduce((sum: any, c: any) => sum + (c.branches?.length || 0), 0),
      
      // Performance Metrics
      averageQuoteResponseTime: calculateAverageResponseTime(transportRequests),
      quotesToOrdersRatio: transportRequests.length > 0 ? 
        transportRequests.filter((r: any) => r.orders.length > 0).length / transportRequests.length : 0,
      onTimeDeliveryRate: calculateOnTimeDeliveryRate(transportRequests),
      
      // AI Metrics
      aiOptimizedRequests: transportRequests.filter((r: any) => r.aiCostEstimate !== null).length,
      averageAiConfidence: calculateAverageAiConfidence(transportRequests),
      
      // Workflow Metrics
      workflowAutomationRate: calculateWorkflowAutomationRate(transportRequests),
      averageProcessingTime: calculateAverageProcessingTime(transportRequests)
    };

    // Get recent activities
    const recentActivities = await getRecentActivities(tenantId);
    
    // Get trend data
    const trendData = await getTrendData(tenantId);
    
    // Get supplier performance
    const supplierPerformance = await getSupplierPerformance(tenantId);
    
    // Get transport type distribution
    const transportTypeDistribution = getTransportTypeDistribution(transportRequests);

    return NextResponse.json({
      success: true,
      metrics,
      recentActivities,
      trendData,
      supplierPerformance,
      transportTypeDistribution,
      mandantType
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateAverageResponseTime(requests: any[]): number {
  const requestsWithQuotes = requests.filter(r => r.quotes.length > 0);
  if (requestsWithQuotes.length === 0) return 0;
  
  const totalResponseTime = requestsWithQuotes.reduce((sum, req) => {
    const firstQuote = req.quotes.sort((a: any, b: any) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )[0];
    
    const responseTime = new Date(firstQuote.createdAt).getTime() - new Date(req.createdAt).getTime();
    return sum + (responseTime / (1000 * 60 * 60)); // Convert to hours
  }, 0);
  
  return totalResponseTime / requestsWithQuotes.length;
}

function calculateOnTimeDeliveryRate(requests: any[]): number {
  const deliveredRequests = requests.filter(r => r.status === 'DELIVERED');
  if (deliveredRequests.length === 0) return 0;
  
  const onTimeDeliveries = deliveredRequests.filter(req => {
    const lastTracking = req.trackingEvents.sort((a: any, b: any) => 
      new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime()
    )[0];
    
    return lastTracking && new Date(lastTracking.eventTime) <= new Date(req.deliveryDate);
  });
  
  return onTimeDeliveries.length / deliveredRequests.length;
}

function calculateAverageAiConfidence(requests: any[]): number {
  const aiOptimizedRequests = requests.filter(r => r.aiRiskAssessment && r.aiRiskAssessment.confidence);
  if (aiOptimizedRequests.length === 0) return 0;
  
  const totalConfidence = aiOptimizedRequests.reduce((sum, req) => 
    sum + (req.aiRiskAssessment.confidence || 0), 0
  );
  
  return totalConfidence / aiOptimizedRequests.length;
}

function calculateWorkflowAutomationRate(requests: any[]): number {
  if (requests.length === 0) return 0;
  
  const automatedRequests = requests.filter(r => 
    r.aiRecommendedSuppliers && r.aiRecommendedSuppliers.length > 0
  );
  
  return automatedRequests.length / requests.length;
}

function calculateAverageProcessingTime(requests: any[]): number {
  const processedRequests = requests.filter(r => r.status === 'DELIVERED');
  if (processedRequests.length === 0) return 0;
  
  const totalProcessingTime = processedRequests.reduce((sum, req) => {
    const processingTime = new Date(req.updatedAt).getTime() - new Date(req.createdAt).getTime();
    return sum + (processingTime / (1000 * 60 * 60)); // Convert to hours
  }, 0);
  
  return totalProcessingTime / processedRequests.length;
}

async function getRecentActivities(tenantId: string) {
  const activities = [];
  
  // Mock recent transport requests (da transportRequest Tabelle nicht existiert)
  const recentRequests: any[] = [];
  
  activities.push(...recentRequests.map((req: any) => ({
    id: req.id,
    type: 'TRANSPORT_REQUEST',
    action: 'CREATED',
    description: `Transport request ${req.requestNumber} created`,
    user: req.creator.firstName || req.creator.email || 'System',
    timestamp: req.createdAt
  })));
  
  // Recent quotes (mock data since transportQuote table doesn't exist)
  const recentQuotes: any[] = [];
  
  // activities.push(...recentQuotes.map(quote => ({
  //   id: quote.id,
  //   type: 'QUOTE',
  //   action: 'RECEIVED',
  //   description: `Quote received from ${quote.supplier.companyName} for ${quote.request.requestNumber}`,
  //   user: quote.supplier.companyName,
  //   timestamp: quote.createdAt
  // })));
  
  // Sort by timestamp and return recent activities
  return activities.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 20);
}

async function getTrendData(tenantId: string) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  // Use existing logisticsRFQ instead of transportRequest
  const dailyRequests = await prisma.logisticsRFQ.groupBy({
    by: ['createdAt'],
    where: {
      tenantId,
      createdAt: { gte: thirtyDaysAgo }
    },
    _count: true
  });
  
  // Process daily data
  const trendData = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayRequests = dailyRequests.filter((req: any) => 
      req.createdAt.toISOString().split('T')[0] === dateStr
    );
    
    trendData.push({
      date: dateStr,
      requests: dayRequests.length > 0 ? dayRequests[0]._count : 0,
      day: date.toLocaleDateString('de-DE', { weekday: 'short' })
    });
  }
  
  return trendData;
}

async function getSupplierPerformance(tenantId: string) {
  const suppliers = await prisma.logisticsSupplier.findMany({
    where: { tenantId },
    include: {
      quotes: {
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }
    }
  });
  
  return suppliers.map(supplier => ({
    id: supplier.id,
    name: supplier.companyName,
    rating: (supplier as any).rating || 4.5,
    reliabilityScore: supplier.reliabilityScore,
    responseTime: supplier.responseTime,
    quotesCount: supplier.quotes.length,
    averageQuoteValue: supplier.quotes.length > 0 ? 
      supplier.quotes.reduce((sum: number, quote: any) => sum + (quote.price || 0), 0) / supplier.quotes.length : 0,
    aiPerformanceScore: supplier.performanceScore || 0,
    status: supplier.status
  }));
}

function getTransportTypeDistribution(requests: any[]) {
  const distribution = requests.reduce((acc, req) => {
    acc[req.requestType] = (acc[req.requestType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(distribution).map(([type, count]) => ({
    type,
    count: count as number,
    percentage: requests.length > 0 ? ((count as number) / requests.length) * 100 : 0
  }));
}
