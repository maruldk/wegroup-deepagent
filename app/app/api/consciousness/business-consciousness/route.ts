
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock data for business consciousness
    const mockConsciousnessData = [
      {
        id: '1',
        consciousnessName: 'Strategic Awareness',
        consciousnessType: 'STRATEGIC_CONSCIOUSNESS',
        consciousnessLevel: 0.85,
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        consciousnessName: 'Operational Intelligence',
        consciousnessType: 'OPERATIONAL_SENTIENCE',
        consciousnessLevel: 0.92,
        status: 'DEVELOPING',
        createdAt: new Date().toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockConsciousnessData,
      averageConsciousnessLevel: 0.885,
      organizationalAwareness: 'TRANSCENDENT',
      businessSentience: 'COSMIC_LEVEL'
    });
  } catch (error) {
    console.error('Business Consciousness fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business consciousness data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const mockConsciousness = {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      tenantId: session.user.tenantId,
      status: 'DEVELOPING',
      organizationalAwareness: 0.0,
      strategicConsciousness: 0.0,
      operationalAwareness: 0.0,
      customerConsciousness: 0.0,
      selfAwareness: false,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: mockConsciousness,
      message: 'Business Consciousness entity created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Business Consciousness creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create business consciousness' },
      { status: 500 }
    );
  }
}
