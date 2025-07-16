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
    const mockPipelines = [
      {
        id: 'pipeline_1',
        tenantId,
        pipelineName: 'Quantum-AI Innovation Pipeline',
        description: 'Advanced quantum-enhanced innovation pipeline',
        status: 'ACTIVE',
        aiOrchestrationLevel: 0.98,
        createdAt: new Date()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockPipelines
    });

  } catch (error) {
    console.error('Error fetching pipelines:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, pipelineName, description } = body;

    if (!tenantId || !pipelineName) {
      return NextResponse.json({ 
        error: 'Tenant ID and pipeline name are required' 
      }, { status: 400 });
    }

    // TEMPORARY: Mock response - to be replaced after checkpoint
    const pipeline = {
      id: `pipeline_${Date.now()}`,
      tenantId,
      pipelineName,
      description,
      status: 'ACTIVE',
      aiOrchestrationLevel: 0.98,
      createdAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: pipeline,
      message: 'Innovation pipeline created successfully'
    });

  } catch (error) {
    console.error('Error creating pipeline:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}