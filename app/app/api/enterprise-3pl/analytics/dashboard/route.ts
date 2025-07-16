
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const timeRange = searchParams.get('timeRange') || '30d';

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant-ID ist erforderlich' }, { status: 400 });
    }

    // Zeitbereich berechnen
    const timeRangeMap = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '365d': 365
    };

    const days = timeRangeMap[timeRange as keyof typeof timeRangeMap] || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Mock dashboard data
    const transportRequests: any[] = [
      { id: '1', status: 'PENDING', createdAt: new Date(), quotes: [], orders: [] },
      { id: '2', status: 'ACTIVE', createdAt: new Date(), quotes: [], orders: [] },
      { id: '3', status: 'COMPLETED', createdAt: new Date(), quotes: [], orders: [] }
    ];

    const transportOrders: any[] = [
      { id: '1', status: 'PROCESSING', createdAt: new Date() },
      { id: '2', status: 'COMPLETED', createdAt: new Date() }
    ];

    const shipments: any[] = [
      { id: '1', currentStatus: 'IN_TRANSIT', damageReported: false, createdAt: new Date() },
      { id: '2', currentStatus: 'DELIVERED', damageReported: false, createdAt: new Date() }
    ];

    const carriers: any[] = [
      { 
        id: '1', 
        carrierName: 'DHL Express', 
        isActive: true, 
        reliabilityScore: 95, 
        costEfficiency: 88, 
        onTimeDelivery: 92 
      },
      { 
        id: '2', 
        carrierName: 'UPS Worldwide', 
        isActive: true, 
        reliabilityScore: 89, 
        costEfficiency: 85, 
        onTimeDelivery: 87 
      }
    ];

    const complianceDocuments: any[] = [
      { id: '1', status: 'VALID', createdAt: new Date() },
      { id: '2', status: 'EXPIRED', createdAt: new Date() }
    ];

    const workflows: any[] = [
      { id: '1', instances: [] }
    ];

    const recentActivity: any[] = [
      { 
        id: '1', 
        createdAt: new Date(), 
        creator: { firstName: 'John', lastName: 'Doe' } 
      }
    ];

    // KPI-Berechnungen
    const kpis = {
      totalRequests: transportRequests.length,
      totalOrders: transportOrders.length,
      totalShipments: shipments.length,
      activeCarriers: carriers.filter(c => c.isActive).length,
      
      // Conversion Rate
      conversionRate: transportRequests.length > 0 
        ? Math.round((transportOrders.length / transportRequests.length) * 100) 
        : 0,
      
      // Durchschnittliche Bearbeitungszeit
      avgProcessingTime: calculateAvgProcessingTime(transportRequests),
      
      // On-Time Delivery Rate
      onTimeDeliveryRate: calculateOnTimeDeliveryRate(shipments),
      
      // Compliance Score
      complianceScore: calculateComplianceScore(complianceDocuments),
      
      // Automation Level
      automationLevel: calculateAutomationLevel(workflows),
      
      // Kosten-Effizienz
      costEfficiency: calculateCostEfficiency(transportOrders),
      
      // Carrier Performance
      carrierPerformance: calculateCarrierPerformance(carriers),
      
      // Trend-Daten
      trends: calculateTrends(transportRequests, transportOrders, shipments, startDate)
    };

    // Status-Verteilung
    const statusDistribution = {
      requests: getStatusDistribution(transportRequests, 'status'),
      orders: getStatusDistribution(transportOrders, 'status'),
      shipments: getStatusDistribution(shipments, 'currentStatus'),
      compliance: getStatusDistribution(complianceDocuments, 'status')
    };

    // Top Performer
    const topPerformers = {
      carriers: carriers
        .sort((a: any, b: any) => (b.reliabilityScore || 0) - (a.reliabilityScore || 0))
        .slice(0, 5)
        .map((carrier: any) => ({
          name: carrier.carrierName,
          score: carrier.reliabilityScore || 0,
          efficiency: carrier.costEfficiency || 0,
          onTime: carrier.onTimeDelivery || 0
        })),
      routes: await getTopRoutes(transportRequests, 5),
      services: await getTopServices(transportRequests, 5)
    };

    // Risiko-Analyse
    const riskAnalysis = {
      highRiskShipments: shipments.filter((s: any) => s.damageReported ?? false).length,
      expiredDocuments: complianceDocuments.filter((d: any) => d.status === 'EXPIRED').length,
      delayedOrders: transportOrders.filter((o: any) => o.status === 'PROCESSING' && 
        new Date(o.createdAt).getTime() < Date.now() - 24 * 60 * 60 * 1000).length,
      inactiveCarriers: carriers.filter((c: any) => !c.isActive).length
    };

    // Geografische Verteilung
    const geoDistribution = calculateGeoDistribution(transportRequests);

    return NextResponse.json({
      success: true,
      data: {
        kpis,
        statusDistribution,
        topPerformers,
        riskAnalysis,
        geoDistribution,
        recentActivity: recentActivity.slice(0, 10),
        timeRange: {
          from: startDate.toISOString(),
          to: new Date().toISOString(),
          days
        }
      },
      message: 'Enterprise 3PL Analytics Dashboard erfolgreich geladen'
    });

  } catch (error) {
    console.error('Fehler beim Laden des Analytics Dashboards:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler beim Laden des Analytics Dashboards' 
    }, { status: 500 });
  }
}

function calculateAvgProcessingTime(requests: any[]): number {
  if (requests.length === 0) return 0;
  
  const processedRequests = requests.filter(r => r.status === 'DELIVERED');
  if (processedRequests.length === 0) return 0;
  
  const totalTime = processedRequests.reduce((sum, request) => {
    const created = new Date(request.createdAt);
    const delivered = new Date(request.updatedAt);
    return sum + (delivered.getTime() - created.getTime());
  }, 0);
  
  return Math.round(totalTime / processedRequests.length / (1000 * 60 * 60)); // in Stunden
}

function calculateOnTimeDeliveryRate(shipments: any[]): number {
  if (shipments.length === 0) return 0;
  
  const deliveredShipments = shipments.filter(s => s.currentStatus === 'DELIVERED');
  if (deliveredShipments.length === 0) return 0;
  
  const onTimeCount = deliveredShipments.filter(s => s.onTimeDelivery === true).length;
  return Math.round((onTimeCount / deliveredShipments.length) * 100);
}

function calculateComplianceScore(documents: any[]): number {
  if (documents.length === 0) return 100;
  
  const totalScore = documents.reduce((sum, doc) => sum + (doc.aiCompliance || 0), 0);
  return Math.round(totalScore / documents.length);
}

function calculateAutomationLevel(workflows: any[]): number {
  if (workflows.length === 0) return 0;
  
  const totalAutomation = workflows.reduce((sum, workflow) => sum + (workflow.automationLevel || 0), 0);
  return Math.round(totalAutomation / workflows.length);
}

function calculateCostEfficiency(orders: any[]): number {
  if (orders.length === 0) return 0;
  
  const totalMargin = orders.reduce((sum, order) => sum + (order.margin || 0), 0);
  const totalRevenue = orders.reduce((sum, order) => sum + (order.customerPrice || 0), 0);
  
  return totalRevenue > 0 ? Math.round((totalMargin / totalRevenue) * 100) : 0;
}

function calculateCarrierPerformance(carriers: any[]): number {
  if (carriers.length === 0) return 0;
  
  const totalPerformance = carriers.reduce((sum, carrier) => {
    const performance = (carrier.reliabilityScore || 0) * 0.4 +
                       (carrier.onTimeDelivery || 0) * 0.3 +
                       (carrier.costEfficiency || 0) * 0.3;
    return sum + performance;
  }, 0);
  
  return Math.round(totalPerformance / carriers.length);
}

function calculateTrends(requests: any[], orders: any[], shipments: any[], startDate: Date): any {
  const days = Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const trends = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    const dayRequests = requests.filter(r => {
      const created = new Date(r.createdAt);
      return created >= date && created < nextDate;
    });
    
    const dayOrders = orders.filter(o => {
      const created = new Date(o.createdAt);
      return created >= date && created < nextDate;
    });
    
    const dayShipments = shipments.filter(s => {
      const created = new Date(s.createdAt);
      return created >= date && created < nextDate;
    });
    
    trends.push({
      date: date.toISOString().split('T')[0],
      requests: dayRequests.length,
      orders: dayOrders.length,
      shipments: dayShipments.length,
      revenue: dayOrders.reduce((sum, o) => sum + (o.customerPrice || 0), 0)
    });
  }
  
  return trends;
}

function getStatusDistribution(items: any[], statusField: string): any {
  const distribution: { [key: string]: number } = {};
  
  items.forEach(item => {
    const status = item[statusField] || 'UNKNOWN';
    distribution[status] = (distribution[status] || 0) + 1;
  });
  
  return distribution;
}

async function getTopRoutes(requests: any[], limit: number): Promise<any[]> {
  const routeMap = new Map();
  
  requests.forEach(request => {
    const origin = request.pickupAddress?.city || 'Unbekannt';
    const destination = request.deliveryAddress?.city || 'Unbekannt';
    const routeKey = `${origin} → ${destination}`;
    
    if (!routeMap.has(routeKey)) {
      routeMap.set(routeKey, { route: routeKey, count: 0, avgCost: 0, totalCost: 0 });
    }
    
    const routeData = routeMap.get(routeKey);
    routeData.count++;
    routeData.totalCost += request.aiCostEstimate || 0;
    routeData.avgCost = routeData.totalCost / routeData.count;
  });
  
  return Array.from(routeMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

async function getTopServices(requests: any[], limit: number): Promise<any[]> {
  const serviceMap = new Map();
  
  requests.forEach(request => {
    const service = request.requestType || 'UNKNOWN';
    
    if (!serviceMap.has(service)) {
      serviceMap.set(service, { service, count: 0, revenue: 0 });
    }
    
    const serviceData = serviceMap.get(service);
    serviceData.count++;
    serviceData.revenue += request.aiCostEstimate || 0;
  });
  
  return Array.from(serviceMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function calculateGeoDistribution(requests: any[]): any {
  const countries = new Map();
  const cities = new Map();
  
  requests.forEach(request => {
    // Pickup
    const pickupCountry = request.pickupAddress?.country || 'DE';
    const pickupCity = request.pickupAddress?.city || 'Unbekannt';
    
    countries.set(pickupCountry, (countries.get(pickupCountry) || 0) + 1);
    cities.set(pickupCity, (cities.get(pickupCity) || 0) + 1);
    
    // Delivery
    const deliveryCountry = request.deliveryAddress?.country || 'DE';
    const deliveryCity = request.deliveryAddress?.city || 'Unbekannt';
    
    countries.set(deliveryCountry, (countries.get(deliveryCountry) || 0) + 1);
    cities.set(deliveryCity, (cities.get(deliveryCity) || 0) + 1);
  });
  
  return {
    countries: Array.from(countries.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    cities: Array.from(cities.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  };
}
