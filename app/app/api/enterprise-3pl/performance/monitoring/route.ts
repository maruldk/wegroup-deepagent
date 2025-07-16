
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
    const monitoringType = searchParams.get('type') || 'overview';
    const timeRange = searchParams.get('timeRange') || '24h';

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant-ID ist erforderlich' }, { status: 400 });
    }

    // Zeitbereich definieren
    const timeRanges = {
      '1h': 1,
      '24h': 24,
      '7d': 168,
      '30d': 720
    };

    const hoursBack = timeRanges[timeRange as keyof typeof timeRanges] || 24;
    const startTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

    // Performance-Monitoring basierend auf Typ
    let monitoringData = {};

    switch (monitoringType) {
      case 'overview':
        monitoringData = await getOverviewMetrics(tenantId, startTime);
        break;
      case 'carriers':
        monitoringData = await getCarrierMetrics(tenantId, startTime);
        break;
      case 'routes':
        monitoringData = await getRouteMetrics(tenantId, startTime);
        break;
      case 'operations':
        monitoringData = await getOperationalMetrics(tenantId, startTime);
        break;
      case 'financial':
        monitoringData = await getFinancialMetrics(tenantId, startTime);
        break;
      case 'compliance':
        monitoringData = await getComplianceMetrics(tenantId, startTime);
        break;
      case 'sustainability':
        monitoringData = await getSustainabilityMetrics(tenantId, startTime);
        break;
      default:
        return NextResponse.json({ error: 'Unbekannter Monitoring-Typ' }, { status: 400 });
    }

    // Alerts und Anomalien
    const alerts = await detectAlerts(tenantId, startTime);
    const anomalies = await detectAnomalies(tenantId, startTime);

    // Performance-Trends
    const trends = await calculateTrends(tenantId, startTime, timeRange);

    return NextResponse.json({
      success: true,
      data: {
        metrics: monitoringData,
        alerts,
        anomalies,
        trends,
        timestamp: new Date().toISOString(),
        timeRange: {
          from: startTime.toISOString(),
          to: new Date().toISOString(),
          duration: timeRange
        }
      },
      message: 'Performance-Monitoring erfolgreich geladen'
    });

  } catch (error) {
    console.error('Fehler beim Performance-Monitoring:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler beim Performance-Monitoring' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const data = await request.json();
    const { tenantId, metricType, threshold, alertConfig } = data;

    if (!tenantId || !metricType || !threshold) {
      return NextResponse.json({ 
        error: 'Pflichtfelder fehlen: tenantId, metricType, threshold' 
      }, { status: 400 });
    }

    // Performance-Alert konfigurieren
    const alertRule = await createAlertRule(tenantId, metricType, threshold, alertConfig);

    return NextResponse.json({
      success: true,
      data: alertRule,
      message: 'Performance-Alert erfolgreich konfiguriert'
    });

  } catch (error) {
    console.error('Fehler beim Konfigurieren des Performance-Alerts:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler beim Konfigurieren des Performance-Alerts' 
    }, { status: 500 });
  }
}

async function getOverviewMetrics(tenantId: string, startTime: Date) {
  // Mock-Daten für Performance-Metriken
  const requests = Array.from({ length: 25 }, (_, i) => ({
    id: `req-${i}`,
    tenantId,
    status: ['PENDING', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED'][Math.floor(Math.random() * 4)],
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));

  const orders = Array.from({ length: 18 }, (_, i) => ({
    id: `order-${i}`,
    tenantId,
    status: ['PROCESSING', 'SHIPPED', 'DELIVERED'][Math.floor(Math.random() * 3)],
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));

  const shipments = Array.from({ length: 32 }, (_, i) => ({
    id: `ship-${i}`,
    tenantId,
    status: ['IN_TRANSIT', 'DELIVERED', 'DELAYED'][Math.floor(Math.random() * 3)],
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));

  const carriers = [
    { id: '1', name: 'DHL Express', tenantId, isActive: true },
    { id: '2', name: 'UPS Premium', tenantId, isActive: true },
    { id: '3', name: 'FedEx International', tenantId, isActive: false }
  ];

  // Kern-KPIs berechnen
  const metrics = {
    operational: {
      totalRequests: requests.length,
      totalOrders: orders.length,
      totalShipments: shipments.length,
      conversionRate: requests.length > 0 ? (orders.length / requests.length) * 100 : 0,
      fulfillmentRate: orders.length > 0 ? (shipments.length / orders.length) * 100 : 0
    },
    performance: {
      onTimeDelivery: calculateOnTimeDelivery(shipments),
      avgProcessingTime: calculateAvgProcessingTime(requests),
      carrierReliability: calculateCarrierReliability(carriers),
      systemUptime: calculateSystemUptime(),
      throughput: calculateThroughput(requests, startTime)
    },
    quality: {
      errorRate: calculateErrorRate(shipments),
      damageRate: calculateDamageRate(shipments),
      customerSatisfaction: calculateCustomerSatisfaction(shipments),
      complianceScore: await calculateComplianceScore(tenantId),
      accuracyRate: calculateAccuracyRate(orders)
    },
    efficiency: {
      costEfficiency: calculateCostEfficiency(orders),
      resourceUtilization: calculateResourceUtilization(carriers),
      automationLevel: await calculateAutomationLevel(tenantId),
      capacityUtilization: calculateCapacityUtilization(carriers, orders),
      wasteReduction: calculateWasteReduction(shipments)
    }
  };

  return metrics;
}

async function getCarrierMetrics(tenantId: string, startTime: Date) {
  // Mock-Daten für Carrier Metrics
  const carriers = [
    {
      id: '1',
      name: 'DHL Express',
      tenantId,
      isActive: true,
      onTimeDelivery: 96.5,
      damageRate: 0.2,
      costEfficiency: 88.3,
      carrierRates: []
    },
    {
      id: '2',
      name: 'UPS Premium',
      tenantId,
      isActive: true,
      onTimeDelivery: 94.8,
      damageRate: 0.3,
      costEfficiency: 91.2,
      carrierRates: []
    }
  ];

  const carrierMetrics = await Promise.all(
    carriers.map(async (carrier: any) => {
      // Mock-Daten für Carrier Shipments
      const carrierShipments = Array.from({ length: 15 }, (_, i) => ({
        id: `ship-${carrier.id}-${i}`,
        tenantId,
        carrierId: carrier.id,
        status: ['IN_TRANSIT', 'DELIVERED', 'DELAYED'][Math.floor(Math.random() * 3)],
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      }));

      const metrics = {
        carrierId: carrier.id,
        carrierName: carrier.carrierName,
        carrierCode: carrier.carrierCode,
        performance: {
          reliability: carrier.reliabilityScore || 0,
          onTimeDelivery: carrier.onTimeDelivery || 0,
          avgTransitTime: carrier.avgTransitTime || 0,
          damageRate: carrier.damageRate || 0,
          costEfficiency: carrier.costEfficiency || 0
        },
        volume: {
          totalShipments: carrierShipments.length,
          completedShipments: carrierShipments.filter(s => s.status === 'DELIVERED').length,
          pendingShipments: carrierShipments.filter(s => s.status !== 'DELIVERED').length,
          marketShare: calculateMarketShare(carrierShipments.length, tenantId)
        },
        financials: {
          revenue: calculateCarrierRevenue(carrierShipments),
          avgCost: calculateCarrierAvgCost(carrierShipments),
          profitMargin: calculateCarrierProfitMargin(carrierShipments),
          costPerShipment: calculateCostPerShipment(carrierShipments)
        },
        quality: {
          customerRating: calculateCarrierCustomerRating(carrierShipments),
          complaintRate: calculateCarrierComplaintRate(carrierShipments),
          responseTime: calculateCarrierResponseTime(carrier),
          slaCompliance: calculateCarrierSLACompliance(carrierShipments)
        },
        trends: {
          volumeTrend: calculateVolumeTrend(carrierShipments),
          performanceTrend: calculatePerformanceTrend(carrier),
          costTrend: calculateCostTrend(carrierShipments),
          qualityTrend: calculateQualityTrend(carrierShipments)
        }
      };

      return metrics;
    })
  );

  return {
    carriers: carrierMetrics,
    summary: {
      totalCarriers: carriers.length,
      activeCarriers: carriers.filter((c: any) => c.isActive).length,
      topPerformer: carrierMetrics.reduce((best, current) => 
        current.performance.reliability > best.performance.reliability ? current : best
      ),
      avgReliability: carrierMetrics.reduce((sum, c) => sum + c.performance.reliability, 0) / carrierMetrics.length
    }
  };
}

async function getRouteMetrics(tenantId: string, startTime: Date) {
  // Mock-Daten für Route Metrics
  const requests = Array.from({ length: 12 }, (_, i) => ({
    id: `req-${i}`,
    tenantId,
    route: `Route-${i}`,
    distance: Math.random() * 500 + 50,
    estimatedTime: Math.random() * 480 + 60,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));

  const routeAnalysis = analyzeRoutes(requests);
  const optimizations = await getRouteOptimizations(tenantId, startTime);

  return {
    routes: routeAnalysis.routes,
    corridors: routeAnalysis.corridors,
    optimizations,
    performance: {
      avgDistance: routeAnalysis.avgDistance,
      avgTime: routeAnalysis.avgTime,
      avgCost: routeAnalysis.avgCost,
      utilizationRate: routeAnalysis.utilizationRate
    },
    efficiency: {
      fuelEfficiency: calculateFuelEfficiency(requests),
      loadFactor: calculateLoadFactor(requests),
      emptyMileage: calculateEmptyMileage(requests),
      routeOptimizationSavings: calculateOptimizationSavings(optimizations)
    }
  };
}

async function getOperationalMetrics(tenantId: string, startTime: Date) {
  // Mock-Daten für Operational Metrics
  const requests = Array.from({ length: 20 }, (_, i) => ({
    id: `req-${i}`,
    tenantId,
    status: ['PENDING', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED'][Math.floor(Math.random() * 4)],
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));

  const orders = Array.from({ length: 15 }, (_, i) => ({
    id: `order-${i}`,
    tenantId,
    status: ['PROCESSING', 'SHIPPED', 'DELIVERED'][Math.floor(Math.random() * 3)],
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));

  const workflows = Array.from({ length: 8 }, (_, i) => ({
    id: `workflow-${i}`,
    tenantId,
    status: 'ACTIVE',
    instances: Array.from({ length: 3 }, (_, j) => ({
      id: `instance-${i}-${j}`,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    }))
  }));

  return {
    throughput: {
      requestsPerHour: calculateRequestsPerHour(requests, startTime),
      ordersPerHour: calculateOrdersPerHour(orders, startTime),
      peakHours: identifyPeakHours(requests),
      bottlenecks: identifyBottlenecks(requests, orders)
    },
    processing: {
      avgProcessingTime: calculateAvgProcessingTime(requests),
      queueLength: calculateQueueLength(requests),
      processingEfficiency: calculateProcessingEfficiency(requests, orders),
      automationRate: calculateAutomationRate(workflows)
    },
    resource: {
      staffUtilization: calculateStaffUtilization(tenantId),
      systemLoad: calculateSystemLoad(),
      capacityUtilization: calculateCapacityUtilization([], orders),
      resourceBottlenecks: identifyResourceBottlenecks(tenantId)
    },
    quality: {
      errorRate: calculateErrorRate([]),
      reworkRate: calculateReworkRate(requests),
      firstTimeRight: calculateFirstTimeRight(requests),
      processCompliance: calculateProcessCompliance(workflows)
    }
  };
}

async function getFinancialMetrics(tenantId: string, startTime: Date) {
  // Mock-Daten für Financial Metrics
  const orders = Array.from({ length: 18 }, (_, i) => ({
    id: `order-${i}`,
    tenantId,
    customerPrice: Math.random() * 500 + 100,
    finalPrice: Math.random() * 400 + 80,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));

  const revenue = orders.reduce((sum, order) => sum + (order.customerPrice || 0), 0);
  const costs = orders.reduce((sum, order) => sum + (order.finalPrice || 0), 0);
  const margin = revenue - costs;

  return {
    revenue: {
      total: revenue,
      average: revenue / orders.length || 0,
      growth: calculateRevenueGrowth(orders),
      breakdown: calculateRevenueBreakdown(orders)
    },
    costs: {
      total: costs,
      average: costs / orders.length || 0,
      breakdown: calculateCostBreakdown(orders),
      trends: calculateCostTrends(orders)
    },
    profitability: {
      grossMargin: revenue > 0 ? (margin / revenue) * 100 : 0,
      netProfit: margin,
      marginPerOrder: margin / orders.length || 0,
      profitTrend: calculateProfitTrend(orders)
    },
    efficiency: {
      costPerShipment: costs / orders.length || 0,
      revenuePerEmployee: calculateRevenuePerEmployee(revenue, tenantId),
      costEfficiency: calculateCostEfficiency(orders),
      roi: calculateROI(orders)
    }
  };
}

async function getComplianceMetrics(tenantId: string, startTime: Date) {
  // Mock-Daten für Compliance Metrics
  const documents = Array.from({ length: 10 }, (_, i) => ({
    id: `doc-${i}`,
    tenantId,
    status: ['APPROVED', 'PENDING', 'EXPIRED'][Math.floor(Math.random() * 3)],
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));

  return {
    overview: {
      totalDocuments: documents.length,
      approvedDocuments: documents.filter((d: any) => d.status === 'APPROVED').length,
      pendingDocuments: documents.filter((d: any) => d.status === 'PENDING').length,
      expiredDocuments: documents.filter((d: any) => d.status === 'EXPIRED').length,
      complianceScore: await calculateComplianceScore(tenantId)
    },
    risk: {
      highRiskDocuments: documents.filter((d: any) => d.aiRiskLevel === 'HIGH').length,
      criticalRiskDocuments: documents.filter((d: any) => d.aiRiskLevel === 'CRITICAL').length,
      riskDistribution: calculateRiskDistribution(documents),
      riskTrends: calculateRiskTrends(documents)
    },
    audit: {
      auditTrail: generateAuditTrail(documents),
      verificationRate: calculateVerificationRate(documents),
      auditFindings: generateAuditFindings(documents),
      correctionActions: generateCorrectionActions(documents)
    },
    regulatory: {
      regulatoryCompliance: calculateRegulatoryCompliance(documents),
      jurisdictionBreakdown: calculateJurisdictionBreakdown(documents),
      regulatoryUpdates: getRegulatorUpdates(),
      complianceGaps: identifyComplianceGaps(documents)
    }
  };
}

async function getSustainabilityMetrics(tenantId: string, startTime: Date) {
  // Mock-Daten für Sustainability Metrics
  const requests = Array.from({ length: 16 }, (_, i) => ({
    id: `req-${i}`,
    tenantId,
    estimatedCO2: Math.random() * 50 + 10,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));

  const totalCO2 = requests.reduce((sum, request) => sum + (request.estimatedCO2 || 0), 0);
  const avgCO2 = totalCO2 / requests.length || 0;

  return {
    carbon: {
      totalEmissions: totalCO2,
      avgEmissions: avgCO2,
      emissionsTrend: calculateEmissionsTrend(requests),
      carbonIntensity: calculateCarbonIntensity(requests)
    },
    efficiency: {
      fuelEfficiency: calculateFuelEfficiency(requests),
      loadOptimization: calculateLoadOptimization(requests),
      routeEfficiency: calculateRouteEfficiency(requests),
      modalSplit: calculateModalSplit(requests)
    },
    initiatives: {
      greenRoutes: identifyGreenRoutes(requests),
      sustainableCarriers: await identifySustainableCarriers(tenantId),
      carbonOffsets: calculateCarbonOffsets(requests),
      sustainabilityScore: calculateSustainabilityScore(requests)
    },
    targets: {
      emissionReduction: calculateEmissionReduction(requests),
      sustainabilityGoals: getSustainabilityGoals(tenantId),
      progress: calculateSustainabilityProgress(requests),
      benchmarks: getSustainabilityBenchmarks()
    }
  };
}

async function detectAlerts(tenantId: string, startTime: Date) {
  const alerts = [];

  // Performance-Alerts
  const shipments = await prisma.shipment.findMany({
    where: {
      tenantId,
      createdAt: { gte: startTime }
    }
  });

  const delayedShipments = shipments.filter(s => s.status === 'EXCEPTION');
  if (delayedShipments.length > 0) {
    alerts.push({
      type: 'PERFORMANCE',
      level: 'HIGH',
      title: 'Verspätete Sendungen',
      description: `${delayedShipments.length} Sendungen sind verspätet`,
      count: delayedShipments.length,
      timestamp: new Date().toISOString()
    });
  }

  // Compliance-Alerts (Mock-Implementierung)
  const expiredDocs = Math.floor(Math.random() * 3); // Mock: 0-2 expired docs

  if (expiredDocs > 0) {
    alerts.push({
      type: 'COMPLIANCE',
      level: 'CRITICAL',
      title: 'Abgelaufene Dokumente',
      description: `${expiredDocs} Compliance-Dokumente sind abgelaufen`,
      count: expiredDocs,
      timestamp: new Date().toISOString()
    });
  }

  // Kosten-Alerts (Mock-Implementierung)
  const orders = Array.from({ length: 12 }, (_, i) => ({
    id: `order-${i}`,
    tenantId,
    margin: Math.random() * 0.3,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));

  const lowMarginOrders = orders.filter(o => o.margin < 0.1);
  if (lowMarginOrders.length > orders.length * 0.3) {
    alerts.push({
      type: 'FINANCIAL',
      level: 'MEDIUM',
      title: 'Niedrige Margen',
      description: `${lowMarginOrders.length} Aufträge haben niedrige Margen`,
      count: lowMarginOrders.length,
      timestamp: new Date().toISOString()
    });
  }

  return alerts;
}

async function detectAnomalies(tenantId: string, startTime: Date) {
  const anomalies = [];

  // Volumen-Anomalien (Mock-Implementierung)
  const requests = Array.from({ length: 20 }, (_, i) => ({
    id: `req-${i}`,
    tenantId,
    volume: Math.random() * 100 + 10,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));

  const hourlyVolume = calculateHourlyVolume(requests);
  const avgVolume = hourlyVolume.reduce((sum, v) => sum + v.volume, 0) / hourlyVolume.length;
  
  hourlyVolume.forEach(volume => {
    if (volume.volume > avgVolume * 2) {
      anomalies.push({
        type: 'VOLUME_SPIKE',
        severity: 'HIGH',
        description: `Ungewöhnlich hohes Volumen: ${volume.volume} (Normal: ${avgVolume})`,
        timestamp: volume.hour,
        value: volume.volume,
        expected: avgVolume
      });
    }
  });

  // Kosten-Anomalien (Mock-Implementierung)
  const orders = Array.from({ length: 14 }, (_, i) => ({
    id: `order-${i}`,
    tenantId,
    finalPrice: Math.random() * 400 + 100,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));

  const avgCost = orders.reduce((sum, o) => sum + (o.finalPrice || 0), 0) / orders.length;
  const highCostOrders = orders.filter(o => (o.finalPrice || 0) > avgCost * 1.5);
  
  if (highCostOrders.length > 0) {
    anomalies.push({
      type: 'COST_ANOMALY',
      severity: 'MEDIUM',
      description: `${highCostOrders.length} Aufträge mit überdurchschnittlichen Kosten`,
      timestamp: new Date().toISOString(),
      value: highCostOrders.length,
      expected: 0
    });
  }

  return anomalies;
}

async function calculateTrends(tenantId: string, startTime: Date, timeRange: string) {
  // Mock-Daten für Trends
  const requests = Array.from({ length: 25 }, (_, i) => ({
    id: `req-${i}`,
    tenantId,
    value: Math.random() * 100 + 50,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));

  const timeSeriesData = generateTimeSeriesData(requests, timeRange);
  
  return {
    volume: calculateVolumeTrend(timeSeriesData),
    performance: calculatePerformanceTrend(timeSeriesData),
    cost: calculateCostTrend(timeSeriesData),
    quality: calculateQualityTrend(timeSeriesData)
  };
}

async function createAlertRule(tenantId: string, metricType: string, threshold: number, alertConfig: any) {
  // Simuliere Alert-Regel-Erstellung
  return {
    id: `alert-${Date.now()}`,
    tenantId,
    metricType,
    threshold,
    enabled: true,
    notifications: alertConfig.notifications || [],
    conditions: alertConfig.conditions || {},
    createdAt: new Date().toISOString()
  };
}

// Hilfsfunktionen für Berechnungen
function calculateOnTimeDelivery(shipments: any[]): number {
  const deliveredShipments = shipments.filter(s => s.currentStatus === 'DELIVERED');
  if (deliveredShipments.length === 0) return 0;
  
  const onTimeCount = deliveredShipments.filter(s => s.onTimeDelivery === true).length;
  return Math.round((onTimeCount / deliveredShipments.length) * 100);
}

function calculateAvgProcessingTime(requests: any[]): number {
  if (requests.length === 0) return 0;
  
  const processedRequests = requests.filter(r => r.status === 'DELIVERED');
  if (processedRequests.length === 0) return 0;
  
  const totalTime = processedRequests.reduce((sum, request) => {
    const created = new Date(request.createdAt);
    const updated = new Date(request.updatedAt);
    return sum + (updated.getTime() - created.getTime());
  }, 0);
  
  return Math.round(totalTime / processedRequests.length / (1000 * 60 * 60)); // in Stunden
}

function calculateCarrierReliability(carriers: any[]): number {
  if (carriers.length === 0) return 0;
  
  const totalReliability = carriers.reduce((sum, carrier) => sum + (carrier.reliabilityScore || 0), 0);
  return Math.round(totalReliability / carriers.length);
}

function calculateSystemUptime(): number {
  return Math.round(Math.random() * 5 + 95); // 95-100%
}

function calculateThroughput(requests: any[], startTime: Date): number {
  const hours = (new Date().getTime() - startTime.getTime()) / (1000 * 60 * 60);
  return Math.round(requests.length / hours);
}

function calculateErrorRate(shipments: any[]): number {
  if (shipments.length === 0) return 0;
  const errorCount = shipments.filter(s => s.status === 'EXCEPTION').length;
  return Math.round((errorCount / shipments.length) * 100);
}

function calculateDamageRate(shipments: any[]): number {
  if (shipments.length === 0) return 0;
  const damageCount = shipments.filter(s => s.damageReported === true).length;
  return Math.round((damageCount / shipments.length) * 100);
}

function calculateCustomerSatisfaction(shipments: any[]): number {
  if (shipments.length === 0) return 0;
  const ratings = shipments.filter(s => s.customerRating).map(s => s.customerRating);
  if (ratings.length === 0) return 0;
  
  const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  return Math.round(avgRating * 20); // Convert 5-star to 100-point scale
}

async function calculateComplianceScore(tenantId: string): Promise<number> {
  // Mock-Daten für Compliance Score
  const documents = Array.from({ length: 8 }, (_, i) => ({
    id: `doc-${i}`,
    tenantId,
    status: ['APPROVED', 'PENDING', 'EXPIRED'][Math.floor(Math.random() * 3)],
    score: Math.random() * 100
  }));
  
  if (documents.length === 0) return 100;
  
  const totalScore = documents.reduce((sum, doc) => sum + (doc.score || 0), 0);
  return Math.round(totalScore / documents.length);
}

function calculateAccuracyRate(orders: any[]): number {
  if (orders.length === 0) return 0;
  // Simuliere Genauigkeitsrate
  return Math.round(Math.random() * 10 + 90); // 90-100%
}

function calculateCostEfficiency(orders: any[]): number {
  if (orders.length === 0) return 0;
  
  const totalRevenue = orders.reduce((sum, order) => sum + (order.customerPrice || 0), 0);
  const totalCosts = orders.reduce((sum, order) => sum + (order.finalPrice || 0), 0);
  
  return totalRevenue > 0 ? Math.round(((totalRevenue - totalCosts) / totalRevenue) * 100) : 0;
}

function calculateResourceUtilization(carriers: any[]): number {
  if (carriers.length === 0) return 0;
  // Simuliere Ressourcennutzung
  return Math.round(Math.random() * 20 + 70); // 70-90%
}

async function calculateAutomationLevel(tenantId: string): Promise<number> {
  // Mock-Daten für Automation Level
  const workflows = Array.from({ length: 6 }, (_, i) => ({
    id: `workflow-${i}`,
    tenantId,
    automationLevel: Math.random() * 100
  }));
  
  if (workflows.length === 0) return 0;
  
  const totalAutomation = workflows.reduce((sum: number, workflow: any) => sum + (workflow.automationLevel || 0), 0);
  return Math.round(totalAutomation / workflows.length);
}

function calculateCapacityUtilization(carriers: any[], orders: any[]): number {
  if (carriers.length === 0) return 0;
  // Simuliere Kapazitätsnutzung
  return Math.round(Math.random() * 30 + 60); // 60-90%
}

function calculateWasteReduction(shipments: any[]): number {
  // Simuliere Abfallreduzierung
  return Math.round(Math.random() * 15 + 10); // 10-25%
}

function calculateMarketShare(shipmentCount: number, tenantId: string): number {
  // Simuliere Marktanteil
  return Math.round(Math.random() * 20 + 5); // 5-25%
}

function calculateCarrierRevenue(shipments: any[]): number {
  return shipments.reduce((sum, shipment) => sum + (shipment.customerPrice || 0), 0);
}

function calculateCarrierAvgCost(shipments: any[]): number {
  if (shipments.length === 0) return 0;
  const totalCost = shipments.reduce((sum, shipment) => sum + (shipment.finalPrice || 0), 0);
  return Math.round(totalCost / shipments.length);
}

function calculateCarrierProfitMargin(shipments: any[]): number {
  const revenue = calculateCarrierRevenue(shipments);
  const costs = shipments.reduce((sum, shipment) => sum + (shipment.finalPrice || 0), 0);
  return revenue > 0 ? Math.round(((revenue - costs) / revenue) * 100) : 0;
}

function calculateCostPerShipment(shipments: any[]): number {
  if (shipments.length === 0) return 0;
  const totalCost = shipments.reduce((sum, shipment) => sum + (shipment.finalPrice || 0), 0);
  return Math.round(totalCost / shipments.length);
}

function calculateCarrierCustomerRating(shipments: any[]): number {
  const ratings = shipments.filter(s => s.customerRating).map(s => s.customerRating);
  if (ratings.length === 0) return 0;
  
  const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  return Math.round(avgRating * 100) / 100;
}

function calculateCarrierComplaintRate(shipments: any[]): number {
  if (shipments.length === 0) return 0;
  const complaints = shipments.filter(s => s.damageReported).length;
  return Math.round((complaints / shipments.length) * 100);
}

function calculateCarrierResponseTime(carrier: any): number {
  return carrier.responseTime || Math.round(Math.random() * 4 + 2); // 2-6 Stunden
}

function calculateCarrierSLACompliance(shipments: any[]): number {
  if (shipments.length === 0) return 0;
  const compliantShipments = shipments.filter(s => s.onTimeDelivery === true).length;
  return Math.round((compliantShipments / shipments.length) * 100);
}



function calculatePerformanceTrend(data: any): string {
  return Math.random() > 0.5 ? 'STEIGEND' : 'FALLEND';
}

function calculateCostTrend(data: any): string {
  return Math.random() > 0.5 ? 'STEIGEND' : 'FALLEND';
}

function calculateQualityTrend(data: any): string {
  return Math.random() > 0.5 ? 'STEIGEND' : 'FALLEND';
}

function analyzeRoutes(requests: any[]) {
  const routes = new Map();
  
  requests.forEach(request => {
    const origin = request.pickupAddress?.city || 'Unbekannt';
    const destination = request.deliveryAddress?.city || 'Unbekannt';
    const routeKey = `${origin}-${destination}`;
    
    if (!routes.has(routeKey)) {
      routes.set(routeKey, {
        route: routeKey,
        origin,
        destination,
        count: 0,
        totalCost: 0,
        avgCost: 0,
        totalDistance: 0,
        avgDistance: 0
      });
    }
    
    const routeData = routes.get(routeKey);
    routeData.count++;
    routeData.totalCost += request.aiCostEstimate || 0;
    routeData.avgCost = routeData.totalCost / routeData.count;
  });
  
  return {
    routes: Array.from(routes.values()),
    corridors: identifyCorridors(Array.from(routes.values())),
    avgDistance: 450,
    avgTime: 6.5,
    avgCost: 120,
    utilizationRate: 78
  };
}

function identifyCorridors(routes: any[]) {
  return routes.filter(r => r.count > 5).map(r => ({
    ...r,
    type: 'MAJOR_CORRIDOR',
    potential: 'HIGH'
  }));
}

async function getRouteOptimizations(tenantId: string, startTime: Date) {
  const optimizations = await prisma.routeOptimization.findMany({
    where: {
      tenantId,
      createdAt: { gte: startTime }
    }
  });
  
  return optimizations.map(opt => ({
    id: opt.id,
    distanceSaved: opt.distanceSaved,
    timeSaved: opt.timeSaved,
    co2Saved: opt.co2Saved,
    status: opt.implementationStatus
  }));
}

// Weitere Hilfsfunktionen...
function calculateFuelEfficiency(requests: any[]): number {
  return Math.round(Math.random() * 2 + 8); // 8-10 km/l
}

function calculateLoadFactor(requests: any[]): number {
  return Math.round(Math.random() * 20 + 70); // 70-90%
}

function calculateEmptyMileage(requests: any[]): number {
  return Math.round(Math.random() * 15 + 10); // 10-25%
}

function calculateOptimizationSavings(optimizations: any[]): number {
  return optimizations.reduce((sum, opt) => sum + (opt.distanceSaved || 0), 0);
}

function calculateRequestsPerHour(requests: any[], startTime: Date): number {
  const hours = (new Date().getTime() - startTime.getTime()) / (1000 * 60 * 60);
  return Math.round(requests.length / hours);
}

function calculateOrdersPerHour(orders: any[], startTime: Date): number {
  const hours = (new Date().getTime() - startTime.getTime()) / (1000 * 60 * 60);
  return Math.round(orders.length / hours);
}

function identifyPeakHours(requests: any[]): any[] {
  const hourlyMap = new Map();
  
  requests.forEach(request => {
    const hour = new Date(request.createdAt).getHours();
    hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
  });
  
  return Array.from(hourlyMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hour, count]) => ({ hour, count }));
}

function identifyBottlenecks(requests: any[], orders: any[]): any[] {
  const bottlenecks = [];
  
  if (requests.length > orders.length * 1.5) {
    bottlenecks.push({
      type: 'PROCESSING',
      description: 'Verarbeitungsengpass bei Anfragen',
      severity: 'HIGH'
    });
  }
  
  return bottlenecks;
}

function calculateQueueLength(requests: any[]): number {
  return requests.filter(r => r.status === 'PENDING').length;
}

function calculateProcessingEfficiency(requests: any[], orders: any[]): number {
  return requests.length > 0 ? Math.round((orders.length / requests.length) * 100) : 0;
}

function calculateAutomationRate(workflows: any[]): number {
  if (workflows.length === 0) return 0;
  const totalAutomation = workflows.reduce((sum, w) => sum + (w.automationLevel || 0), 0);
  return Math.round(totalAutomation / workflows.length);
}

function calculateStaffUtilization(tenantId: string): number {
  return Math.round(Math.random() * 20 + 70); // 70-90%
}

function calculateSystemLoad(): number {
  return Math.round(Math.random() * 30 + 40); // 40-70%
}

function identifyResourceBottlenecks(tenantId: string): any[] {
  return [
    {
      resource: 'Carrier-Kapazität',
      utilization: 95,
      status: 'CRITICAL'
    }
  ];
}

function calculateReworkRate(requests: any[]): number {
  return Math.round(Math.random() * 10 + 5); // 5-15%
}

function calculateFirstTimeRight(requests: any[]): number {
  return Math.round(Math.random() * 15 + 80); // 80-95%
}

function calculateProcessCompliance(workflows: any[]): number {
  return Math.round(Math.random() * 10 + 90); // 90-100%
}

function calculateRevenueGrowth(orders: any[]): number {
  return Math.round(Math.random() * 20 + 5); // 5-25%
}

function calculateRevenueBreakdown(orders: any[]): any {
  return {
    domestic: 60,
    international: 40,
    express: 30,
    standard: 70
  };
}

function calculateCostBreakdown(orders: any[]): any {
  return {
    transport: 60,
    fuel: 25,
    labor: 10,
    other: 5
  };
}

function calculateCostTrends(orders: any[]): any {
  return {
    transport: 'STEIGEND',
    fuel: 'STEIGEND',
    labor: 'STABIL'
  };
}

function calculateProfitTrend(orders: any[]): string {
  return Math.random() > 0.5 ? 'STEIGEND' : 'FALLEND';
}

function calculateRevenuePerEmployee(revenue: number, tenantId: string): number {
  const estimatedEmployees = 25; // Simuliert
  return Math.round(revenue / estimatedEmployees);
}

function calculateROI(orders: any[]): number {
  return Math.round(Math.random() * 20 + 15); // 15-35%
}



function calculateRiskDistribution(documents: any[]): any {
  const distribution = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
  documents.forEach(doc => {
    const riskLevel = doc.aiRiskLevel || 'LOW';
    if (riskLevel in distribution) {
      distribution[riskLevel as keyof typeof distribution]++;
    }
  });
  return distribution;
}

function calculateRiskTrends(documents: any[]): string {
  return Math.random() > 0.5 ? 'STEIGEND' : 'FALLEND';
}

function generateAuditTrail(documents: any[]): any[] {
  return documents.slice(0, 5).map(doc => ({
    documentId: doc.id,
    action: 'UPDATED',
    timestamp: doc.updatedAt,
    user: 'System'
  }));
}

function calculateVerificationRate(documents: any[]): number {
  if (documents.length === 0) return 0;
  const verifiedCount = documents.filter(d => d.isVerified).length;
  return Math.round((verifiedCount / documents.length) * 100);
}

function generateAuditFindings(documents: any[]): any[] {
  return [
    {
      type: 'MISSING_DOCUMENT',
      description: 'Fehlende Exportlizenz',
      severity: 'HIGH'
    }
  ];
}

function generateCorrectionActions(documents: any[]): any[] {
  return [
    {
      action: 'Dokument nachreichen',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      responsible: 'Compliance Team'
    }
  ];
}

function calculateRegulatoryCompliance(documents: any[]): number {
  return Math.round(Math.random() * 10 + 90); // 90-100%
}

function calculateJurisdictionBreakdown(documents: any[]): any {
  return {
    EU: 60,
    US: 25,
    ASIA: 15
  };
}

function getRegulatorUpdates(): any[] {
  return [
    {
      regulation: 'DSGVO',
      update: 'Neue Richtlinien',
      date: new Date().toISOString()
    }
  ];
}

function identifyComplianceGaps(documents: any[]): any[] {
  return [
    {
      gap: 'Fehlende Zertifizierung',
      impact: 'HIGH',
      recommendation: 'Zertifizierung beantragen'
    }
  ];
}

function calculateEmissionsTrend(requests: any[]): string {
  return Math.random() > 0.5 ? 'FALLEND' : 'STEIGEND';
}

function calculateCarbonIntensity(requests: any[]): number {
  return Math.round(Math.random() * 0.5 + 0.1); // 0.1-0.6 kg CO2/km
}

function calculateLoadOptimization(requests: any[]): number {
  return Math.round(Math.random() * 20 + 70); // 70-90%
}

function calculateRouteEfficiency(requests: any[]): number {
  return Math.round(Math.random() * 15 + 80); // 80-95%
}

function calculateModalSplit(requests: any[]): any {
  return {
    road: 70,
    rail: 20,
    air: 8,
    sea: 2
  };
}

function identifyGreenRoutes(requests: any[]): any[] {
  return requests.slice(0, 3).map(r => ({
    route: `${r.pickupAddress?.city} → ${r.deliveryAddress?.city}`,
    co2Savings: Math.round(Math.random() * 20 + 10),
    feasibility: 'HIGH'
  }));
}

async function identifySustainableCarriers(tenantId: string): Promise<any[]> {
  // Mock-Daten für Sustainable Carriers
  const carriers = [
    { id: '1', carrierName: 'DHL Express', tenantId },
    { id: '2', carrierName: 'UPS Premium', tenantId },
    { id: '3', carrierName: 'FedEx International', tenantId }
  ];
  
  return carriers.map((c: any) => ({
    name: c.carrierName,
    sustainabilityScore: Math.round(Math.random() * 30 + 70),
    certification: 'ISO 14001'
  }));
}

function calculateCarbonOffsets(requests: any[]): number {
  return Math.round(Math.random() * 100 + 50); // 50-150 kg CO2
}

function calculateSustainabilityScore(requests: any[]): number {
  return Math.round(Math.random() * 20 + 70); // 70-90
}

function calculateEmissionReduction(requests: any[]): number {
  return Math.round(Math.random() * 15 + 10); // 10-25%
}

function getSustainabilityGoals(tenantId: string): any[] {
  return [
    {
      goal: 'CO2-Reduktion um 20%',
      deadline: '2025-12-31',
      progress: 60
    }
  ];
}

function calculateSustainabilityProgress(requests: any[]): number {
  return Math.round(Math.random() * 40 + 40); // 40-80%
}

function getSustainabilityBenchmarks(): any {
  return {
    industry: 0.15,
    bestPractice: 0.08,
    current: 0.12
  };
}

function calculateHourlyVolume(requests: any[]): any[] {
  const hourlyMap = new Map();
  
  requests.forEach(request => {
    const hour = new Date(request.createdAt).getHours();
    hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
  });
  
  return Array.from(hourlyMap.entries()).map(([hour, volume]) => ({
    hour: `${hour}:00`,
    volume
  }));
}

function generateTimeSeriesData(requests: any[], timeRange: string): any[] {
  const intervals = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
  const data = [];
  
  for (let i = 0; i < intervals; i++) {
    data.push({
      time: i,
      volume: Math.round(Math.random() * 50 + 10),
      cost: Math.round(Math.random() * 200 + 100),
      performance: Math.round(Math.random() * 20 + 80)
    });
  }
  
  return data;
}

function calculateVolumeTrend(timeSeriesData: any[]): any {
  const values = timeSeriesData.map(d => d.volume);
  const trend = values[values.length - 1] - values[0];
  
  return {
    direction: trend > 0 ? 'STEIGEND' : trend < 0 ? 'FALLEND' : 'STABIL',
    change: Math.abs(trend),
    changePercent: Math.round((trend / values[0]) * 100)
  };
}
