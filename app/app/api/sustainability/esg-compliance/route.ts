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
    const mockESGData = [
      {
        id: 'esg_1',
        tenantId,
        assessmentPeriod: 'Q4_2024',
        environmentalScore: 85.6,
        socialScore: 78.9,
        governanceScore: 92.3,
        overallESGScore: 85.6,
        complianceStatus: 'COMPLIANT',
        aiRiskAssessment: 0.15,
        esgRank: 'A+',
        createdAt: new Date()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockESGData,
      aggregatedMetrics: {
        avgESGScore: 85.6,
        avgRiskLevel: 0.15,
        complianceRate: 100
      }
    });

  } catch (error) {
    console.error('Error fetching ESG compliance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, assessmentPeriod } = body;

    if (!tenantId || !assessmentPeriod) {
      return NextResponse.json({ 
        error: 'Tenant ID and assessment period are required' 
      }, { status: 400 });
    }

    // TEMPORARY: Mock response - to be replaced after checkpoint
    const esgCompliance = {
      id: `esg_${Date.now()}`,
      tenantId,
      assessmentPeriod,
      environmentalScore: 85.6,
      socialScore: 78.9,
      governanceScore: 92.3,
      overallESGScore: 85.6,
      complianceStatus: 'COMPLIANT',
      aiRiskAssessment: 0.15,
      esgRank: 'A+',
      createdAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: esgCompliance,
      message: 'ESG compliance assessment created successfully'
    });

  } catch (error) {
    console.error('Error creating ESG compliance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}