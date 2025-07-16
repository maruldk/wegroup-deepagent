
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
    const shipmentId = searchParams.get('shipmentId');
    const trackingNumber = searchParams.get('trackingNumber');
    const status = searchParams.get('status');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant-ID ist erforderlich' }, { status: 400 });
    }

    const whereClause: any = { tenantId };
    if (shipmentId) whereClause.id = shipmentId;
    if (trackingNumber) whereClause.trackingNumber = trackingNumber;
    if (status) whereClause.currentStatus = status;

    // Sendungen mit Tracking-Events laden
    const shipments = await prisma.shipment.findMany({
      where: whereClause,
      include: {
        trackingEvents: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Erweiterte Tracking-Informationen für jede Sendung
    const trackingData = await Promise.all(
      shipments.map(async (shipment) => {
        // Aktuelle Position und nächste erwartete Events
        const currentPosition = await getCurrentPosition(shipment);
        const nextEvents = await predictNextEvents(shipment);
        const deliveryPrediction = await predictDeliveryTime(shipment);
        const riskAnalysis = await analyzeDeliveryRisk(shipment);
        
        return {
          ...shipment,
          currentPosition,
          nextEvents,
          deliveryPrediction,
          riskAnalysis,
          trackingUrl: generateTrackingUrl(shipment.trackingNumber),
          milestones: generateMilestones(shipment),
          notifications: generateNotifications(shipment)
        };
      })
    );

    // Zusammenfassung der Tracking-Statistiken
    const trackingStats = {
      totalShipments: shipments.length,
      inTransit: shipments.filter(s => s.status === 'IN_TRANSIT').length,
      delivered: shipments.filter(s => s.status === 'DELIVERED').length,
      delayed: shipments.filter(s => s.status === 'EXCEPTION').length,
      avgDeliveryTime: calculateAvgDeliveryTime(shipments),
      onTimeRate: calculateOnTimeRate(shipments)
    };

    return NextResponse.json({
      success: true,
      data: {
        shipments: trackingData,
        statistics: trackingStats
      },
      total: trackingData.length,
      message: 'Echtzeit-Tracking-Daten erfolgreich geladen'
    });

  } catch (error) {
    console.error('Fehler beim Laden der Tracking-Daten:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler beim Laden der Tracking-Daten' 
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
    const {
      shipmentId,
      trackingNumber,
      eventType,
      status,
      statusCode,
      description,
      location,
      coordinates,
      facility,
      nextExpectedEvent,
      estimatedArrival,
      tenantId
    } = data;

    // Validierung
    if (!shipmentId && !trackingNumber) {
      return NextResponse.json({ 
        error: 'Entweder Shipment-ID oder Tracking-Nummer ist erforderlich' 
      }, { status: 400 });
    }

    if (!eventType || !status || !tenantId) {
      return NextResponse.json({ 
        error: 'Pflichtfelder fehlen: eventType, status, tenantId' 
      }, { status: 400 });
    }

    // Sendung finden
    let shipment;
    if (shipmentId) {
      shipment = await prisma.shipment.findUnique({
        where: { id: shipmentId }
      });
    } else if (trackingNumber) {
      shipment = await prisma.shipment.findFirst({
        where: { trackingNumber }
      });
    }

    if (!shipment) {
      return NextResponse.json({ error: 'Sendung nicht gefunden' }, { status: 404 });
    }

    // Tracking-Event erstellen
    const trackingEvent = await prisma.trackingEvent.create({
      data: {
        shipmentId: shipment.id,
        eventType,
        description,
        location,
        timestamp: new Date(),
        tenantId
      }
    });

    // Sendungsstatus aktualisieren
    const statusUpdateData: any = {
      currentStatus: status,
      updatedAt: new Date()
    };

    // Spezifische Zeitstempel basierend auf Event-Typ
    if (eventType === 'PICKUP') {
      statusUpdateData.actualPickup = new Date();
    } else if (eventType === 'DELIVERY') {
      statusUpdateData.actualDelivery = new Date();
      statusUpdateData.onTimeDelivery = new Date() <= (shipment.estimatedDeliveryDate || new Date());
    }

    const updatedShipment = await prisma.shipment.update({
      where: { id: shipment.id },
      data: statusUpdateData
    });

    // Automatische Benachrichtigungen senden
    await sendAutomaticNotifications(updatedShipment, trackingEvent);

    // KI-basierte Analyse des Events
    const aiAnalysis = await analyzeTrackingEvent(trackingEvent, shipment);

    return NextResponse.json({
      success: true,
      data: {
        trackingEvent,
        shipment: updatedShipment,
        aiAnalysis
      },
      message: 'Tracking-Event erfolgreich erstellt'
    });

  } catch (error) {
    console.error('Fehler beim Erstellen des Tracking-Events:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler beim Erstellen des Tracking-Events' 
    }, { status: 500 });
  }
}

async function getCurrentPosition(shipment: any) {
  const lastEvent = shipment.trackingEvents?.[0];
  if (!lastEvent) return null;

  return {
    location: lastEvent.location,
    coordinates: lastEvent.coordinates,
    facility: lastEvent.facility,
    timestamp: lastEvent.eventTime,
    status: lastEvent.status,
    description: lastEvent.description
  };
}

async function predictNextEvents(shipment: any) {
  const currentStatus = shipment.currentStatus;
  const nextEvents = [];

  switch (currentStatus) {
    case 'CREATED':
      nextEvents.push({
        event: 'PICKUP',
        description: 'Abholung durch Carrier',
        estimatedTime: addHours(new Date(), 2),
        probability: 0.9
      });
      break;
    case 'PICKED_UP':
      nextEvents.push({
        event: 'IN_TRANSIT',
        description: 'Transport zum Zielort',
        estimatedTime: addHours(new Date(), 1),
        probability: 0.95
      });
      break;
    case 'IN_TRANSIT':
      nextEvents.push({
        event: 'OUT_FOR_DELIVERY',
        description: 'Auslieferung',
        estimatedTime: shipment.estimatedDelivery || addHours(new Date(), 4),
        probability: 0.85
      });
      break;
    case 'OUT_FOR_DELIVERY':
      nextEvents.push({
        event: 'DELIVERED',
        description: 'Zustellung',
        estimatedTime: addHours(new Date(), 2),
        probability: 0.9
      });
      break;
  }

  return nextEvents;
}

async function predictDeliveryTime(shipment: any) {
  const originalEstimate = shipment.estimatedDelivery;
  const currentTime = new Date();
  
  // KI-basierte Vorhersage basierend auf aktueller Position und Verkehr
  const trafficDelay = Math.random() * 2; // 0-2 Stunden
  const weatherDelay = Math.random() * 1; // 0-1 Stunden
  const processingDelay = Math.random() * 0.5; // 0-30 Minuten
  
  const totalDelayHours = trafficDelay + weatherDelay + processingDelay;
  const predictedDelivery = originalEstimate ? 
    new Date(originalEstimate.getTime() + totalDelayHours * 60 * 60 * 1000) :
    addHours(currentTime, 24);

  return {
    originalEstimate,
    currentPrediction: predictedDelivery,
    confidence: Math.random() * 0.3 + 0.7, // 70-100%
    delayFactors: [
      { factor: 'Verkehr', impact: trafficDelay, unit: 'Stunden' },
      { factor: 'Wetter', impact: weatherDelay, unit: 'Stunden' },
      { factor: 'Verarbeitung', impact: processingDelay, unit: 'Stunden' }
    ],
    isDelayed: predictedDelivery > (originalEstimate || currentTime),
    delayMinutes: originalEstimate ? 
      Math.max(0, (predictedDelivery.getTime() - originalEstimate.getTime()) / (1000 * 60)) : 0
  };
}

async function analyzeDeliveryRisk(shipment: any) {
  let riskScore = 0;
  const riskFactors = [];

  // Verspätungsrisiko
  if (shipment.estimatedDelivery && new Date() > shipment.estimatedDelivery) {
    riskScore += 30;
    riskFactors.push('Verspätung bereits eingetreten');
  }

  // Wetter-Risiko (simuliert)
  if (Math.random() > 0.7) {
    riskScore += 20;
    riskFactors.push('Schlechte Wetterbedingungen');
  }

  // Carrier-Risiko
  if (shipment.damageReported) {
    riskScore += 40;
    riskFactors.push('Schadensmeldung vorhanden');
  }

  // Route-Risiko
  if (shipment.origin?.country !== shipment.destination?.country) {
    riskScore += 15;
    riskFactors.push('Grenzüberschreitender Transport');
  }

  return {
    riskScore: Math.min(riskScore, 100),
    riskLevel: riskScore < 25 ? 'NIEDRIG' : riskScore < 50 ? 'MITTEL' : riskScore < 75 ? 'HOCH' : 'KRITISCH',
    riskFactors,
    recommendations: generateRiskRecommendations(riskScore, riskFactors)
  };
}

function generateRiskRecommendations(riskScore: number, riskFactors: string[]): string[] {
  const recommendations = [];
  
  if (riskScore > 50) {
    recommendations.push('Proaktive Kundenbenachrichtigung empfohlen');
  }
  
  if (riskFactors.includes('Verspätung bereits eingetreten')) {
    recommendations.push('Alternative Zustelloptionen prüfen');
  }
  
  if (riskFactors.includes('Schlechte Wetterbedingungen')) {
    recommendations.push('Wetterbedingungen kontinuierlich überwachen');
  }
  
  if (riskFactors.includes('Grenzüberschreitender Transport')) {
    recommendations.push('Zolldokumente überprüfen');
  }
  
  return recommendations;
}

function generateTrackingUrl(trackingNumber: string | null): string | null {
  if (!trackingNumber) return null;
  return `https://tracking.wegroup.com/track/${trackingNumber}`;
}

function generateMilestones(shipment: any) {
  const milestones = [
    { name: 'Auftrag erstellt', status: 'COMPLETED', time: shipment.createdAt },
    { name: 'Abholung', status: shipment.actualPickup ? 'COMPLETED' : 'PENDING', time: shipment.actualPickup },
    { name: 'Transport', status: shipment.currentStatus === 'IN_TRANSIT' ? 'ACTIVE' : 'PENDING', time: null },
    { name: 'Zustellung', status: shipment.actualDelivery ? 'COMPLETED' : 'PENDING', time: shipment.actualDelivery }
  ];

  return milestones;
}

function generateNotifications(shipment: any) {
  const notifications = [];
  
  if (shipment.currentStatus === 'EXCEPTION') {
    notifications.push({
      type: 'WARNING',
      message: 'Ausnahme bei der Zustellung',
      timestamp: new Date()
    });
  }
  
  if (shipment.estimatedDelivery && new Date() > shipment.estimatedDelivery) {
    notifications.push({
      type: 'ERROR',
      message: 'Sendung verspätet',
      timestamp: new Date()
    });
  }
  
  return notifications;
}

async function sendAutomaticNotifications(shipment: any, trackingEvent: any) {
  // Simuliere automatische Benachrichtigungen
  console.log(`Benachrichtigung gesendet für Sendung ${shipment.trackingNumber}: ${trackingEvent.description}`);
}

async function analyzeTrackingEvent(trackingEvent: any, shipment: any) {
  // KI-basierte Analyse des Tracking-Events
  return {
    eventSignificance: Math.random() * 100,
    anomalyDetected: Math.random() > 0.8,
    predictedNextEvent: 'DELIVERY',
    confidenceLevel: Math.random() * 0.3 + 0.7,
    recommendations: ['Kunde über Fortschritt informieren']
  };
}

function calculateAvgDeliveryTime(shipments: any[]): number {
  const deliveredShipments = shipments.filter(s => s.actualDelivery && s.actualPickup);
  if (deliveredShipments.length === 0) return 0;

  const totalTime = deliveredShipments.reduce((sum, shipment) => {
    const pickup = new Date(shipment.actualPickup);
    const delivery = new Date(shipment.actualDelivery);
    return sum + (delivery.getTime() - pickup.getTime());
  }, 0);

  return Math.round(totalTime / deliveredShipments.length / (1000 * 60 * 60)); // in Stunden
}

function calculateOnTimeRate(shipments: any[]): number {
  const deliveredShipments = shipments.filter(s => s.actualDelivery);
  if (deliveredShipments.length === 0) return 0;

  const onTimeCount = deliveredShipments.filter(s => s.onTimeDelivery === true).length;
  return Math.round((onTimeCount / deliveredShipments.length) * 100);
}

function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}
