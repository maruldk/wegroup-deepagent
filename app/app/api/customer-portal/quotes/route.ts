
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = session.user.tenantId;
    const customerId = searchParams.get('customerId');

    if (!tenantId || !customerId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Verify customer exists
    const customer = await prisma.serviceCustomer.findUnique({
      where: { id: customerId, tenantId }
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Mock quotes data
    const mockQuotes = [
      {
        id: '1',
        serviceType: 'IT_SERVICES',
        title: 'Website Development Quote',
        description: 'Complete website redesign and development',
        supplierName: 'TechCorp Solutions',
        totalPrice: 5000,
        currency: 'EUR',
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'PENDING',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        serviceType: 'MARKETING',
        title: 'Digital Marketing Campaign',
        description: 'Social media and SEO marketing package',
        supplierName: 'Marketing Pro',
        totalPrice: 3000,
        currency: 'EUR',
        validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'APPROVED',
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        serviceType: 'HR_SERVICES',
        title: 'Recruitment Services',
        description: 'Full-service recruitment for 3 positions',
        supplierName: 'HR Excellence',
        totalPrice: 2000,
        currency: 'EUR',
        validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'UNDER_REVIEW',
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        quotes: mockQuotes,
        totalQuotes: mockQuotes.length,
        pendingQuotes: mockQuotes.filter((quote: any) => quote.status === 'PENDING').length,
        approvedQuotes: mockQuotes.filter((quote: any) => quote.status === 'APPROVED').length,
        underReviewQuotes: mockQuotes.filter((quote: any) => quote.status === 'UNDER_REVIEW').length,
        totalValue: mockQuotes.reduce((sum: number, quote: any) => sum + quote.totalPrice, 0)
      }
    });
  } catch (error) {
    console.error('Customer Portal Quotes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
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

    const { searchParams } = new URL(request.url);
    const tenantId = session.user.tenantId;
    const customerId = searchParams.get('customerId');

    if (!tenantId || !customerId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const body = await request.json();

    // Mock quote approval/rejection
    const mockResponse = {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      status: body.action === 'approve' ? 'APPROVED' : 'REJECTED',
      processedAt: new Date().toISOString(),
      processedBy: session.user.id
    };

    return NextResponse.json({
      success: true,
      data: mockResponse,
      message: `Quote ${body.action === 'approve' ? 'approved' : 'rejected'} successfully`
    });
  } catch (error) {
    console.error('Customer Portal Quote Action error:', error);
    return NextResponse.json(
      { error: 'Failed to process quote action' },
      { status: 500 }
    );
  }
}
