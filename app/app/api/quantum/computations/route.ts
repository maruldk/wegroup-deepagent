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
    const mockComputations = [
      {
        id: 'qc_1',
        tenantId,
        computationName: 'Quantum Computation Alpha',
        computationType: 'OPTIMIZATION',
        status: 'COMPLETED',
        qubitsUsed: 16,
        executionTime: 1250,
        quantumSpeedup: 5.7,
        createdAt: new Date()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockComputations
    });

  } catch (error) {
    console.error('Error fetching quantum computations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, computationName, computationType } = body;

    if (!tenantId || !computationName || !computationType) {
      return NextResponse.json({ 
        error: 'Tenant ID, computation name, and type are required' 
      }, { status: 400 });
    }

    // TEMPORARY: Mock response - to be replaced after checkpoint
    const computation = {
      id: `qc_${Date.now()}`,
      tenantId,
      computationName,
      computationType,
      status: 'COMPLETED',
      qubitsUsed: 16,
      executionTime: 1250,
      quantumSpeedup: 5.7,
      createdAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: computation,
      message: 'Quantum computation created successfully'
    });

  } catch (error) {
    console.error('Error creating quantum computation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}