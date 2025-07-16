
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const data = await request.json();
    const {
      origin,
      destination,
      waypoints,
      optimizationType,
      constraints,
      tenantId,
      requestId
    } = data;

    // Validierung
    if (!origin || !destination || !tenantId) {
      return NextResponse.json({ 
        error: 'Pflichtfelder fehlen: origin, destination, tenantId' 
      }, { status: 400 });
    }

    // KI-basierte Routenoptimierung simulieren
    const optimizationResults = await performAIRouteOptimization({
      origin,
      destination,
      waypoints: waypoints || [],
      optimizationType: optimizationType || 'COST',
      constraints: constraints || {},
      tenantId
    });

    // Verfügbare Carrier für die Route laden (Mock-Daten)
    const availableCarriers = [
      {
        id: '1',
        name: 'DHL Express',
        isActive: true,
        tenantId,
        coverageAreas: ['EU', 'DE']
      },
      {
        id: '2', 
        name: 'UPS Premium',
        isActive: true,
        tenantId,
        coverageAreas: ['EU', 'US']
      }
    ].filter(carrier => carrier.tenantId === tenantId);
    
    // Mock-Filter für Abdeckungsgebiete
    const filteredCarriers = availableCarriers.filter(carrier => {
      const originCountry = origin.country || 'DE';
      const destinationCountry = destination.country || 'DE';
      return carrier.coverageAreas.includes(originCountry) || 
             carrier.coverageAreas.includes(destinationCountry);
    });

    // Multi-Modal Transport-Analyse
    const transportOptions = await analyzeTransportModes(
      origin,
      destination,
      availableCarriers,
      optimizationResults
    );

    // Speichere die Optimierung (verwende existierendes RouteOptimization Model)
    const routeOptimization = await prisma.routeOptimization.create({
      data: {
        startLocation: origin,
        endLocation: destination,
        waypoints: waypoints || [],
        originalDistance: optimizationResults.originalDistance,
        optimizedDistance: optimizationResults.optimizedDistance,
        distanceSaved: optimizationResults.distanceSaved,
        originalTime: optimizationResults.originalTime,
        optimizedTime: optimizationResults.optimizedTime,
        timeSaved: optimizationResults.timeSaved,
        trafficConditions: optimizationResults.trafficConditions,
        weatherImpact: optimizationResults.weatherImpact,
        vehicleConstraints: constraints || {},
        costFactors: optimizationResults.costFactors,
        co2Original: optimizationResults.co2Original,
        co2Optimized: optimizationResults.co2Optimized,
        co2Saved: optimizationResults.co2Saved,
        implementationStatus: 'RECOMMENDED',
        tenantId
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        optimizationId: routeOptimization.id,
        recommendedRoute: {
          route: optimizationResults.route,
          distance: optimizationResults.optimizedDistance,
          time: optimizationResults.optimizedTime,
          cost: optimizationResults.estimatedCost,
          carbonFootprint: optimizationResults.co2Optimized
        },
        alternativeRoutes: optimizationResults.alternativeRoutes,
        transportOptions: transportOptions,
        savings: {
          distance: optimizationResults.distanceSaved,
          time: optimizationResults.timeSaved,
          cost: optimizationResults.costSaved,
          co2: optimizationResults.co2Saved
        },
        optimization: {
          efficiency: optimizationResults.efficiency,
          trafficFactor: optimizationResults.trafficFactor,
          weatherImpact: optimizationResults.weatherImpact
        }
      },
      message: 'KI-Routenoptimierung erfolgreich durchgeführt'
    });

  } catch (error) {
    console.error('Fehler bei der KI-Routenoptimierung:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler bei der KI-Routenoptimierung' 
    }, { status: 500 });
  }
}

async function performAIRouteOptimization(params: any) {
  const { origin, destination, waypoints, optimizationType, constraints } = params;
  
  // Simuliere KI-basierte Routenoptimierung
  const baseDistance = calculateDistance(origin, destination);
  const baseTime = baseDistance * 1.5; // Simuliere Fahrtzeit
  
  // Optimierung basierend auf verschiedenen Faktoren
  const trafficFactor = Math.random() * 0.3 + 0.8; // 0.8 - 1.1
  const weatherFactor = Math.random() * 0.2 + 0.9; // 0.9 - 1.1
  
  const optimizedDistance = baseDistance * trafficFactor;
  const optimizedTime = baseTime * trafficFactor * weatherFactor;
  
  const originalCost = baseDistance * 0.5; // €0.50 pro km
  const optimizedCost = optimizedDistance * 0.45; // Optimierte Rate
  
  const co2Factor = 0.12; // kg CO2 pro km
  const co2Original = baseDistance * co2Factor;
  const co2Optimized = optimizedDistance * co2Factor;
  
  return {
    route: generateRoute(origin, destination, waypoints),
    originalDistance: baseDistance,
    optimizedDistance: optimizedDistance,
    distanceSaved: baseDistance - optimizedDistance,
    originalTime: baseTime,
    optimizedTime: optimizedTime,
    timeSaved: baseTime - optimizedTime,
    estimatedCost: optimizedCost,
    costSaved: originalCost - optimizedCost,
    co2Original: co2Original,
    co2Optimized: co2Optimized,
    co2Saved: co2Original - co2Optimized,
    efficiency: ((baseDistance - optimizedDistance) / baseDistance) * 100,
    trafficFactor: trafficFactor,
    weatherImpact: weatherFactor - 1,
    trafficConditions: generateTrafficConditions(),
    weatherConditions: generateWeatherImpact(),
    costFactors: generateCostFactors(),
    alternativeRoutes: generateAlternativeRoutes(origin, destination)
  };
}

function calculateDistance(origin: any, destination: any): number {
  // Vereinfachte Distanzberechnung
  const lat1 = origin.lat || 50.1109;
  const lon1 = origin.lng || 8.6821;
  const lat2 = destination.lat || 52.5200;
  const lon2 = destination.lng || 13.4050;
  
  const R = 6371; // Erdradius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function generateRoute(origin: any, destination: any, waypoints: any[]): any {
  return {
    start: origin,
    end: destination,
    waypoints: waypoints,
    path: `Optimierte Route von ${origin.address} nach ${destination.address}`,
    instructions: [
      'Starten Sie an der Abholstelle',
      'Folgen Sie der optimierten Route',
      'Beachten Sie aktuelle Verkehrsbedingungen',
      'Ankunft am Zielort'
    ]
  };
}

function generateTrafficConditions(): any {
  return {
    currentTraffic: Math.random() > 0.7 ? 'HEAVY' : 'NORMAL',
    averageSpeed: Math.random() * 30 + 50,
    congestionLevel: Math.random() * 100,
    expectedDelays: Math.random() * 30
  };
}

function generateWeatherImpact(): any {
  return {
    currentWeather: ['SUNNY', 'CLOUDY', 'RAINY', 'SNOWY'][Math.floor(Math.random() * 4)],
    visibility: Math.random() * 5 + 5,
    roadConditions: ['GOOD', 'MODERATE', 'POOR'][Math.floor(Math.random() * 3)],
    impactLevel: Math.random() * 0.3
  };
}

function generateCostFactors(): any {
  return {
    fuelPrice: Math.random() * 0.5 + 1.5,
    tollCosts: Math.random() * 50,
    laborCosts: Math.random() * 100 + 100,
    vehicleCosts: Math.random() * 50 + 50
  };
}

function generateAlternativeRoutes(origin: any, destination: any): any[] {
  return [
    {
      name: 'Schnellste Route',
      distance: calculateDistance(origin, destination) * 0.95,
      time: calculateDistance(origin, destination) * 1.2,
      cost: calculateDistance(origin, destination) * 0.48,
      co2: calculateDistance(origin, destination) * 0.11
    },
    {
      name: 'Günstigste Route',
      distance: calculateDistance(origin, destination) * 1.1,
      time: calculateDistance(origin, destination) * 1.8,
      cost: calculateDistance(origin, destination) * 0.42,
      co2: calculateDistance(origin, destination) * 0.13
    },
    {
      name: 'Umweltfreundlichste Route',
      distance: calculateDistance(origin, destination) * 1.05,
      time: calculateDistance(origin, destination) * 1.6,
      cost: calculateDistance(origin, destination) * 0.46,
      co2: calculateDistance(origin, destination) * 0.09
    }
  ];
}

async function analyzeTransportModes(origin: any, destination: any, carriers: any[], optimization: any) {
  const distance = optimization.optimizedDistance;
  const baseTime = optimization.optimizedTime;
  
  const options = [];
  
  // Straßentransport
  if (carriers.some(c => c.transportModes.includes('ROAD'))) {
    options.push({
      mode: 'ROAD',
      name: 'Straßentransport',
      distance: distance,
      time: baseTime,
      cost: distance * 0.45,
      co2: distance * 0.12,
      reliability: 0.95,
      flexibility: 0.9,
      suitability: distance < 1000 ? 0.9 : 0.7
    });
  }
  
  // Schienentransport
  if (carriers.some(c => c.transportModes.includes('RAIL')) && distance > 300) {
    options.push({
      mode: 'RAIL',
      name: 'Schienentransport',
      distance: distance * 1.2,
      time: baseTime * 1.5,
      cost: distance * 0.35,
      co2: distance * 0.08,
      reliability: 0.85,
      flexibility: 0.6,
      suitability: distance > 300 ? 0.8 : 0.4
    });
  }
  
  // Lufttransport
  if (carriers.some(c => c.transportModes.includes('AIR')) && distance > 500) {
    options.push({
      mode: 'AIR',
      name: 'Lufttransport',
      distance: distance,
      time: baseTime * 0.3,
      cost: distance * 1.5,
      co2: distance * 0.5,
      reliability: 0.9,
      flexibility: 0.7,
      suitability: distance > 500 ? 0.9 : 0.3
    });
  }
  
  return options;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const limit = parseInt(searchParams.get('limit') || '10');

    const recentOptimizations = await prisma.routeOptimization.findMany({
      where: { tenantId: tenantId || undefined },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    const optimizationStats = {
      totalOptimizations: recentOptimizations.length,
      avgDistanceSaved: recentOptimizations.reduce((sum, opt) => sum + opt.distanceSaved, 0) / recentOptimizations.length,
      avgTimeSaved: recentOptimizations.reduce((sum, opt) => sum + opt.timeSaved, 0) / recentOptimizations.length,
      avgCo2Saved: recentOptimizations.reduce((sum, opt) => sum + opt.co2Saved, 0) / recentOptimizations.length,
      implementationRate: recentOptimizations.filter(opt => opt.implementationStatus === 'IMPLEMENTED').length / recentOptimizations.length
    };

    return NextResponse.json({
      success: true,
      data: {
        recentOptimizations,
        statistics: optimizationStats
      },
      message: 'Routenoptimierungs-Daten erfolgreich geladen'
    });

  } catch (error) {
    console.error('Fehler beim Laden der Routenoptimierungs-Daten:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler beim Laden der Routenoptimierungs-Daten' 
    }, { status: 500 });
  }
}
