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
    const mockValidations = [
      {
        id: 'val_1',
        tenantId,
        validationName: 'Quantum-AI Validation',
        validationType: 'MARKET_TESTING',
        status: 'COMPLETED',
        validationScore: 0.92,
        aiConfidenceLevel: 0.95,
        createdAt: new Date()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockValidations,
      metrics: {
        totalValidations: 1,
        completedValidations: 1,
        aiEnhancedValidations: 1,
        avgValidationScore: 0.92,
        avgConfidenceLevel: 0.95
      }
    });

  } catch (error) {
    console.error('Error fetching validations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, validationName, validationType } = body;

    if (!tenantId || !validationName || !validationType) {
      return NextResponse.json({ 
        error: 'Tenant ID, validation name, and type are required' 
      }, { status: 400 });
    }

    // TEMPORARY: Mock response - to be replaced after checkpoint
    const validation = {
      id: `val_${Date.now()}`,
      tenantId,
      validationName,
      validationType,
      status: 'PLANNED',
      validationScore: 0.92,
      aiConfidenceLevel: 0.95,
      createdAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: validation,
      message: 'Innovation validation created successfully'
    });

  } catch (error) {
    console.error('Error creating validation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}