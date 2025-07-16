
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
    const carrierId = searchParams.get('carrierId');
    const originZone = searchParams.get('originZone');
    const destinationZone = searchParams.get('destinationZone');
    const serviceType = searchParams.get('serviceType');
    const transportMode = searchParams.get('transportMode');
    const onlyActive = searchParams.get('onlyActive') === 'true';

    const whereClause: any = {};
    if (carrierId) whereClause.carrierId = carrierId;
    if (originZone) whereClause.originZone = { contains: originZone };
    if (destinationZone) whereClause.destinationZone = { contains: destinationZone };
    if (serviceType) whereClause.serviceType = serviceType;
    if (transportMode) whereClause.transportMode = transportMode;
    
    if (onlyActive) {
      whereClause.validFrom = { lte: new Date() };
      whereClause.validTo = { gte: new Date() };
    }

    // Mock-Daten für Carrier Rates
    const rates = [
      {
        id: '1',
        carrierId: '1',
        originZone: 'EU-DE',
        destinationZone: 'EU-FR',
        serviceType: 'EXPRESS',
        transportMode: 'ROAD',
        baseRate: 25.50,
        perKgRate: 1.20,
        perKmRate: 0.85,
        fuelSurcharge: 3.50,
        minWeight: 1,
        maxWeight: 1000,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        tenantId: whereClause.tenantId || 'default',
        carrier: {
          id: '1',
          carrierName: 'DHL Express',
          carrierCode: 'DHL',
          fullName: 'DHL Express Germany GmbH',
          country: 'DE',
          reliabilityScore: 95.5,
          costEfficiency: 88.2,
          onTimeDelivery: 96.8
        }
      },
      {
        id: '2',
        carrierId: '2',
        originZone: 'EU-DE',
        destinationZone: 'EU-FR',
        serviceType: 'STANDARD',
        transportMode: 'ROAD',
        baseRate: 18.75,
        perKgRate: 0.95,
        perKmRate: 0.65,
        fuelSurcharge: 2.25,
        minWeight: 1,
        maxWeight: 1500,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        tenantId: whereClause.tenantId || 'default',
        carrier: {
          id: '2',
          carrierName: 'UPS Premium',
          carrierCode: 'UPS',
          fullName: 'UPS Deutschland GmbH',
          country: 'DE',
          reliabilityScore: 92.3,
          costEfficiency: 91.5,
          onTimeDelivery: 94.2
        }
      }
    ].filter(rate => {
      if (whereClause.tenantId && rate.tenantId !== whereClause.tenantId) return false;
      if (whereClause.carrierId && rate.carrierId !== whereClause.carrierId) return false;
      if (whereClause.serviceType && rate.serviceType !== whereClause.serviceType) return false;
      return true;
    });

    // Berechne die beste Rate für jede Carrier-Service-Kombination
    const rateComparisons = rates.map(rate => {
      const totalCostEstimate = rate.baseRate + (rate.fuelSurcharge || 0);
      const qualityScore = (rate.carrier.reliabilityScore || 0) * 0.5 + 
                          (rate.carrier.onTimeDelivery || 0) * 0.3 + 
                          (rate.carrier.costEfficiency || 0) * 0.2;
      
      return {
        ...rate,
        totalCostEstimate,
        qualityScore: Math.round(qualityScore * 100) / 100,
        valueScore: qualityScore / totalCostEstimate * 100
      };
    });

    return NextResponse.json({
      success: true,
      data: rateComparisons,
      total: rateComparisons.length,
      message: 'Carrier-Raten erfolgreich geladen'
    });

  } catch (error) {
    console.error('Fehler beim Laden der Carrier-Raten:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler beim Laden der Carrier-Raten' 
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
      carrierId,
      originZone,
      destinationZone,
      serviceType,
      transportMode,
      baseRate,
      perKgRate,
      perKmRate,
      fuelSurcharge,
      minWeight,
      maxWeight,
      minVolume,
      maxVolume,
      validFrom,
      validTo,
      tenantId
    } = data;

    // Validierung
    if (!carrierId || !originZone || !destinationZone || !serviceType || !transportMode || 
        !baseRate || !validFrom || !validTo || !tenantId) {
      return NextResponse.json({ 
        error: 'Pflichtfelder fehlen: carrierId, originZone, destinationZone, serviceType, transportMode, baseRate, validFrom, validTo, tenantId' 
      }, { status: 400 });
    }

    // Prüfung auf überlappende Raten (Mock-Implementierung)
    const existingRate = null; // Mock: Keine überlappenden Raten

    if (existingRate) {
      return NextResponse.json({ 
        error: 'Überlappende Rate für diese Kombination existiert bereits' 
      }, { status: 409 });
    }

    // Mock-Implementierung für neue Rate
    const newRate = {
      id: Date.now().toString(),
      carrierId,
      originZone,
      destinationZone,
      serviceType,
      transportMode,
      baseRate,
      perKgRate,
      perKmRate,
      fuelSurcharge: fuelSurcharge || 0,
      minWeight,
      maxWeight,
      minVolume,
      maxVolume,
      validFrom: new Date(validFrom),
      validTo: new Date(validTo),
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
      carrier: {
        carrierName: 'Mock Carrier',
        carrierCode: 'MOCK',
        fullName: 'Mock Carrier GmbH'
      }
    };

    return NextResponse.json({
      success: true,
      data: newRate,
      message: 'Carrier-Rate erfolgreich erstellt'
    });

  } catch (error) {
    console.error('Fehler beim Erstellen der Carrier-Rate:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler beim Erstellen der Carrier-Rate' 
    }, { status: 500 });
  }
}
