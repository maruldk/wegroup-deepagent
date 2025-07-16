
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

    // Mock data for interplanetary business
    const mockBusinesses = [
      {
        id: '1',
        businessName: 'Cosmic Commerce Solutions',
        businessType: 'COSMIC_COMMERCE',
        status: 'ACTIVE',
        universalReach: 0.75,
        interplanetaryRevenue: 1000000,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        businessName: 'Universal Technology Exchange',
        businessType: 'TECHNOLOGY_EXCHANGE',
        status: 'PLANNING',
        universalReach: 0.45,
        interplanetaryRevenue: 500000,
        createdAt: new Date().toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockBusinesses,
      interplanetaryReach: 'UNIVERSAL',
      cosmicCommerce: 'ACTIVE'
    });
  } catch (error) {
    console.error('Interplanetary Business fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interplanetary businesses' },
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

    const mockBusiness = {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      tenantId: session.user.tenantId,
      status: 'PLANNING',
      universalReach: 0.0,
      interplanetaryRevenue: 0.0,
      cosmicMarketShare: 0.0,
      universalBrandValue: 0.0,
      cosmicIntelligence: 0.0,
      universalInsights: [],
      interplanetaryData: {},
      cosmicTrends: [],
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: mockBusiness,
      message: 'Interplanetary business venture initiated'
    }, { status: 201 });
  } catch (error) {
    console.error('Interplanetary Business creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create interplanetary business' },
      { status: 500 }
    );
  }
}
