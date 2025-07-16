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
    const mockProcessors = [
      {
        id: 'qp_1',
        tenantId,
        name: 'Quantum Processor Alpha',
        processorType: 'SUPERCONDUCTING',
        qubits: 32,
        fidelity: 0.995,
        coherenceTime: 120,
        status: 'AVAILABLE',
        aiPerformanceScore: 0.92,
        aiOptimizationLevel: 0.88,
        createdAt: new Date()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockProcessors
    });

  } catch (error) {
    console.error('Error fetching quantum processors:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, name, processorType, qubits } = body;

    if (!tenantId || !name || !processorType || !qubits) {
      return NextResponse.json({ 
        error: 'Tenant ID, name, processor type, and qubits are required' 
      }, { status: 400 });
    }

    // TEMPORARY: Mock response - to be replaced after checkpoint
    const processor = {
      id: `qp_${Date.now()}`,
      tenantId,
      name,
      processorType,
      qubits,
      fidelity: 0.995,
      coherenceTime: 120,
      status: 'AVAILABLE',
      aiPerformanceScore: 0.92,
      aiOptimizationLevel: 0.88,
      createdAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: processor,
      message: 'Quantum processor created successfully'
    });

  } catch (error) {
    console.error('Error creating quantum processor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}