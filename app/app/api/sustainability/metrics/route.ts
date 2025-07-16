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
    const mockMetrics = [
      {
        id: 'sm_1',
        tenantId,
        metricCategory: 'ENERGY',
        metricName: 'Total Energy Consumption',
        metricValue: 2500.5,
        metricUnit: 'kWh',
        targetValue: 2200.0,
        performanceScore: 0.88,
        createdAt: new Date()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockMetrics
    });

  } catch (error) {
    console.error('Error fetching sustainability metrics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, metricCategory, metricName } = body;

    if (!tenantId || !metricCategory || !metricName) {
      return NextResponse.json({ 
        error: 'Tenant ID, metric category, and name are required' 
      }, { status: 400 });
    }

    // TEMPORARY: Mock response - to be replaced after checkpoint
    const sustainabilityMetric = {
      id: `sm_${Date.now()}`,
      tenantId,
      metricCategory,
      metricName,
      metricValue: 2500.5,
      metricUnit: 'kWh',
      targetValue: 2200.0,
      performanceScore: 0.88,
      createdAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: sustainabilityMetric,
      message: 'Sustainability metric created successfully'
    });

  } catch (error) {
    console.error('Error creating sustainability metric:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}