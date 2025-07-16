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
    const mockBusinessModels = [
      {
        id: 'bm_1',
        tenantId,
        modelName: 'Quantum-AI Business Model',
        modelType: 'PLATFORM',
        targetMarket: 'Enterprise',
        projectedRevenue: { year1: 1000000, year2: 5000000, year3: 15000000 },
        aiRevenueOptimization: 0.95,
        createdAt: new Date()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockBusinessModels
    });

  } catch (error) {
    console.error('Error fetching business models:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, modelName, modelType } = body;

    if (!tenantId || !modelName || !modelType) {
      return NextResponse.json({ 
        error: 'Tenant ID, model name, and type are required' 
      }, { status: 400 });
    }

    // TEMPORARY: Mock response - to be replaced after checkpoint
    const businessModel = {
      id: `bm_${Date.now()}`,
      tenantId,
      modelName,
      modelType,
      targetMarket: 'Enterprise',
      projectedRevenue: { year1: 1000000, year2: 5000000, year3: 15000000 },
      aiRevenueOptimization: 0.95,
      createdAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: businessModel,
      message: 'Business model created successfully'
    });

  } catch (error) {
    console.error('Error creating business model:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}