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
    const mockNeuralProfiles = [
      {
        id: 'np_1',
        tenantId,
        customerId: 'customer_1',
        customerType: 'ENTERPRISE',
        personalityVector: [0.8, 0.6, 0.9, 0.7],
        behaviorVector: [0.85, 0.72, 0.91],
        neuralScore: 0.92,
        createdAt: new Date()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockNeuralProfiles
    });

  } catch (error) {
    console.error('Error fetching neural profiles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, customerId, customerType } = body;

    if (!tenantId || !customerId || !customerType) {
      return NextResponse.json({ 
        error: 'Tenant ID, customer ID, and type are required' 
      }, { status: 400 });
    }

    // TEMPORARY: Mock response - to be replaced after checkpoint
    const neuralProfile = {
      id: `np_${Date.now()}`,
      tenantId,
      customerId,
      customerType,
      personalityVector: [0.8, 0.6, 0.9, 0.7],
      behaviorVector: [0.85, 0.72, 0.91],
      neuralScore: 0.92,
      createdAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: neuralProfile,
      message: 'Neural customer profile created successfully'
    });

  } catch (error) {
    console.error('Error creating neural profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}