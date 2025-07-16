import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    // TEMPORARY: Mock response - to be replaced after checkpoint
    const mockFootprintData = [
      {
        id: 'cf_1',
        tenantId,
        trackingPeriod: 'Q4_2024',
        scope1Emissions: 850.5,
        scope2Emissions: 1250.8,
        scope3Emissions: 3420.2,
        totalEmissions: 5521.5,
        reductionTargets: { target2030: 0.5, target2050: 0.8 },
        aiOptimizedReductions: 15.3,
        carbonNeutralityDate: '2035-12-31',
        createdAt: new Date()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockFootprintData
    });

  } catch (error) {
    console.error('Error fetching carbon footprint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, trackingPeriod } = body;

    if (!tenantId || !trackingPeriod) {
      return NextResponse.json({ 
        error: 'Tenant ID and tracking period are required' 
      }, { status: 400 });
    }

    // TEMPORARY: Mock response - to be replaced after checkpoint
    const footprintTracking = {
      id: `cf_${Date.now()}`,
      tenantId,
      trackingPeriod,
      scope1Emissions: 850.5,
      scope2Emissions: 1250.8,
      scope3Emissions: 3420.2,
      totalEmissions: 5521.5,
      reductionTargets: { target2030: 0.5, target2050: 0.8 },
      aiOptimizedReductions: 15.3,
      carbonNeutralityDate: '2035-12-31',
      createdAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: footprintTracking,
      message: 'Carbon footprint tracking created successfully'
    });

  } catch (error) {
    console.error('Error creating carbon footprint tracking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}