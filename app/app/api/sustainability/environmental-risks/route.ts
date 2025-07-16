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
    const mockRisks = [
      {
        id: 'er_1',
        tenantId,
        riskName: 'Climate Change Impact',
        riskType: 'CLIMATE',
        riskLevel: 'MEDIUM',
        likelihoodScore: 0.65,
        impactScore: 0.80,
        overallRiskScore: 0.72,
        status: 'ACTIVE',
        createdAt: new Date()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockRisks
    });

  } catch (error) {
    console.error('Error fetching environmental risks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, riskName, riskType } = body;

    if (!tenantId || !riskName || !riskType) {
      return NextResponse.json({ 
        error: 'Tenant ID, risk name, and type are required' 
      }, { status: 400 });
    }

    // TEMPORARY: Mock response - to be replaced after checkpoint
    const environmentalRisk = {
      id: `er_${Date.now()}`,
      tenantId,
      riskName,
      riskType,
      riskLevel: 'MEDIUM',
      likelihoodScore: 0.65,
      impactScore: 0.80,
      overallRiskScore: 0.72,
      status: 'ACTIVE',
      createdAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: environmentalRisk,
      message: 'Environmental risk created successfully'
    });

  } catch (error) {
    console.error('Error creating environmental risk:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}