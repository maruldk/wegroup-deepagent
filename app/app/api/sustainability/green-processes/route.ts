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
    const mockProcesses = [
      {
        id: 'gp_1',
        tenantId,
        processName: 'AI-Optimized Energy Management',
        processType: 'ENERGY_OPTIMIZATION',
        status: 'ACTIVE',
        efficiencyGain: 25.5,
        carbonReduction: 18.2,
        costSavings: 125000,
        createdAt: new Date()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockProcesses
    });

  } catch (error) {
    console.error('Error fetching green processes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, processName, processType } = body;

    if (!tenantId || !processName || !processType) {
      return NextResponse.json({ 
        error: 'Tenant ID, process name, and type are required' 
      }, { status: 400 });
    }

    // TEMPORARY: Mock response - to be replaced after checkpoint
    const greenProcess = {
      id: `gp_${Date.now()}`,
      tenantId,
      processName,
      processType,
      status: 'ACTIVE',
      efficiencyGain: 25.5,
      carbonReduction: 18.2,
      costSavings: 125000,
      createdAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: greenProcess,
      message: 'Green process created successfully'
    });

  } catch (error) {
    console.error('Error creating green process:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}