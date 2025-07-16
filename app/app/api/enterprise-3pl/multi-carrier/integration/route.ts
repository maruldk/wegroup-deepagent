
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
    const isActive = searchParams.get('active') === 'true';

    const whereClause: any = {};
    if (tenantId) whereClause.tenantId = tenantId;
    if (isActive !== undefined) whereClause.isActive = isActive;

    // Mock-Daten für Carrier Integration
    const carriers = [
      {
        id: '1',
        name: 'DHL Express',
        isActive: true,
        tenantId: tenantId || 'default',
        priority: 1,
        reliabilityScore: 95,
        carrierRates: []
      },
      {
        id: '2',
        name: 'UPS Premium', 
        isActive: true,
        tenantId: tenantId || 'default',
        priority: 2,
        reliabilityScore: 92,
        carrierRates: []
      }
    ].filter(carrier => 
      (!tenantId || carrier.tenantId === tenantId) &&
      (isActive === undefined || carrier.isActive === isActive)
    );

    const carrierStats = await Promise.all(
      carriers.map(async (carrier: any) => {
        // Mock-Statistiken
        const totalShipments = Math.floor(Math.random() * 1000) + 100;

        // Mock-Daten für gelieferte Sendungen
        const deliveredShipments = Math.floor(totalShipments * 0.85);

        const performanceScore = totalShipments > 0 
          ? (deliveredShipments / totalShipments) * 100 
          : 0;

        return {
          ...carrier,
          totalShipments,
          deliveredShipments,
          performanceScore: Math.round(performanceScore * 100) / 100
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: carrierStats,
      total: carrierStats.length,
      message: 'Carrier-Integrationen erfolgreich geladen'
    });

  } catch (error) {
    console.error('Fehler beim Laden der Carrier-Integrationen:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler beim Laden der Carrier-Integrationen' 
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
      carrierName,
      carrierCode,
      fullName,
      country,
      apiEndpoint,
      apiKey,
      serviceTypes,
      transportModes,
      coverageAreas,
      specialServices,
      tenantId
    } = data;

    // Validierung
    if (!carrierName || !carrierCode || !fullName || !country || !tenantId) {
      return NextResponse.json({ 
        error: 'Pflichtfelder fehlen: carrierName, carrierCode, fullName, country, tenantId' 
      }, { status: 400 });
    }

    // Prüfung auf Duplikate (Mock-Implementierung)
    const existingCarrier = null; // Mock: Keine Duplikate

    if (existingCarrier) {
      return NextResponse.json({ 
        error: 'Carrier mit diesem Code oder Namen existiert bereits' 
      }, { status: 409 });
    }

    // Mock-Implementierung für neuen Carrier
    const newCarrier = {
      id: Date.now().toString(),
      carrierName,
      carrierCode,
      fullName,
      country,
      apiEndpoint,
      apiKey,
      serviceTypes: serviceTypes || [],
      transportModes: transportModes || [],
      coverageAreas: coverageAreas || [],
      specialServices: specialServices || [],
      tenantId,
      isActive: true,
      isApiEnabled: !!apiEndpoint && !!apiKey,
      priority: 1,
      onTimeDelivery: 0.0,
      damageRate: 0.0,
      avgTransitTime: 0.0,
      reliabilityScore: 0.0,
      costEfficiency: 0.0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: newCarrier,
      message: 'Carrier-Integration erfolgreich erstellt'
    });

  } catch (error) {
    console.error('Fehler beim Erstellen der Carrier-Integration:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler beim Erstellen der Carrier-Integration' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: 'Carrier-ID fehlt' }, { status: 400 });
    }

    // Mock-Implementierung für Update
    const updatedCarrier = {
      id,
      ...updateData,
      isApiEnabled: !!updateData.apiEndpoint && !!updateData.apiKey,
      updatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: updatedCarrier,
      message: 'Carrier-Integration erfolgreich aktualisiert'
    });

  } catch (error) {
    console.error('Fehler beim Aktualisieren der Carrier-Integration:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler beim Aktualisieren der Carrier-Integration' 
    }, { status: 500 });
  }
}
