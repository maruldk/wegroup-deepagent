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
    const mockJourneyMaps = [
      {
        id: 'jm_1',
        tenantId,
        journeyName: 'Quantum-AI Customer Journey',
        journeyType: 'ONBOARDING',
        conversionRate: 0.85,
        revenueImpact: 2500000,
        customerLifetimeValue: 1500000,
        journeyDuration: 14,
        createdAt: new Date()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockJourneyMaps
    });

  } catch (error) {
    console.error('Error fetching journey maps:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, journeyName, journeyType } = body;

    if (!tenantId || !journeyName || !journeyType) {
      return NextResponse.json({ 
        error: 'Tenant ID, journey name, and type are required' 
      }, { status: 400 });
    }

    // TEMPORARY: Mock response - to be replaced after checkpoint
    const journeyMap = {
      id: `jm_${Date.now()}`,
      tenantId,
      journeyName,
      journeyType,
      conversionRate: 0.85,
      revenueImpact: 2500000,
      customerLifetimeValue: 1500000,
      journeyDuration: 14,
      createdAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: journeyMap,
      message: 'Customer journey map created successfully',
      aiJourneyAnalysis: {
        journeyOptimization: `AI-enhanced journey with ${(journeyMap.conversionRate * 100).toFixed(1)}% conversion rate`,
        expectedDuration: `${journeyMap.journeyDuration} days average journey time`,
        revenueProjection: `€${(journeyMap.revenueImpact / 1000000).toFixed(1)}M revenue impact potential`,
        customerValue: `€${(journeyMap.customerLifetimeValue / 1000000).toFixed(1)}M customer lifetime value`
      }
    });

  } catch (error) {
    console.error('Error creating journey map:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}