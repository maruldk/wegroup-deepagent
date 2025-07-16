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
    const mockAnalyses = [
      {
        id: 'analysis_1',
        tenantId,
        analysisName: 'Quantum-AI Market Analysis',
        analysisType: 'MARKET_POSITIONING',
        aiCompetitiveThreat: 0.25,
        competitiveAdvantage: 'Quantum-AI Convergence Leadership',
        marketPosition: 'Strong',
        createdAt: new Date()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockAnalyses
    });

  } catch (error) {
    console.error('Error fetching competitive analysis:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, analysisName, analysisType } = body;

    if (!tenantId || !analysisName || !analysisType) {
      return NextResponse.json({ 
        error: 'Tenant ID, analysis name, and analysis type are required' 
      }, { status: 400 });
    }

    // TEMPORARY: Mock response - to be replaced after checkpoint
    const analysis = {
      id: `analysis_${Date.now()}`,
      tenantId,
      analysisName,
      analysisType,
      aiCompetitiveThreat: 0.25,
      competitiveAdvantage: 'Quantum-AI Convergence Leadership',
      marketPosition: 'Strong',
      createdAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: analysis,
      message: 'Competitive analysis created successfully',
      aiCompetitiveInsights: {
        marketPosition: 'Strong differentiator with quantum-AI advantage',
        competitiveThreat: 'Low - first-mover advantage',
        recommendations: ['Accelerate quantum-AI development', 'Expand market reach']
      }
    });

  } catch (error) {
    console.error('Error creating competitive analysis:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}