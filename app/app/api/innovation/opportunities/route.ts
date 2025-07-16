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
    const mockOpportunities = [
      {
        id: 'opp_1',
        tenantId,
        opportunityName: 'Quantum-AI Market Expansion',
        opportunityType: 'MARKET_EXPANSION',
        aiOpportunityScore: 0.92,
        revenueOpportunity: 5000000,
        strategicAlignment: 0.88,
        aiRecommendedAction: 'Immediate implementation',
        createdAt: new Date()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockOpportunities
    });

  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, opportunityName, opportunityType } = body;

    if (!tenantId || !opportunityName || !opportunityType) {
      return NextResponse.json({ 
        error: 'Tenant ID, opportunity name, and type are required' 
      }, { status: 400 });
    }

    // TEMPORARY: Mock response - to be replaced after checkpoint
    const opportunity = {
      id: `opp_${Date.now()}`,
      tenantId,
      opportunityName,
      opportunityType,
      aiOpportunityScore: 0.92,
      revenueOpportunity: 5000000,
      strategicAlignment: 0.88,
      aiRecommendedAction: 'Immediate implementation',
      createdAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: opportunity,
      message: 'Innovation opportunity created successfully'
    });

  } catch (error) {
    console.error('Error creating opportunity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}