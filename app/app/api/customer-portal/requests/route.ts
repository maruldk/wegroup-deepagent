
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

    // Mock service requests data
    const mockRequests = [
      {
        id: '1',
        serviceType: 'IT_SERVICES',
        title: 'Website Development Project',
        description: 'Complete website redesign and development with modern UI/UX',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        budget: 5000,
        currency: 'EUR',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        quotesCount: 3,
        ordersCount: 1
      },
      {
        id: '2',
        serviceType: 'MARKETING',
        title: 'Digital Marketing Campaign',
        description: 'Social media marketing and SEO optimization campaign',
        priority: 'MEDIUM',
        status: 'PENDING_QUOTES',
        budget: 3000,
        currency: 'EUR',
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        quotesCount: 2,
        ordersCount: 0
      },
      {
        id: '3',
        serviceType: 'HR_SERVICES',
        title: 'Recruitment Services',
        description: 'Full-service recruitment for Senior Developer position',
        priority: 'HIGH',
        status: 'COMPLETED',
        budget: 2000,
        currency: 'EUR',
        deadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        quotesCount: 4,
        ordersCount: 1
      }
    ];

    // Calculate metrics
    const metrics = {
      totalRequests: mockRequests.length,
      pendingRequests: mockRequests.filter((r: any) => r.status === 'PENDING_QUOTES').length,
      inProgressRequests: mockRequests.filter((r: any) => r.status === 'IN_PROGRESS').length,
      completedRequests: mockRequests.filter((r: any) => r.status === 'COMPLETED').length,
      totalBudget: mockRequests.reduce((sum: number, req: any) => sum + req.budget, 0),
      averageBudget: mockRequests.length > 0 ? 
        mockRequests.reduce((sum: number, req: any) => sum + req.budget, 0) / mockRequests.length : 0
    };

    return NextResponse.json({
      success: true,
      data: {
        requests: mockRequests,
        metrics,
        summary: {
          activeRequests: mockRequests.filter((r: any) => r.status !== 'COMPLETED').length,
          urgentRequests: mockRequests.filter((r: any) => r.priority === 'HIGH').length,
          avgCompletionTime: '12 days'
        }
      }
    });
  } catch (error) {
    console.error('Customer Portal Requests error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service requests' },
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

    // Mock new service request creation
    const mockRequest = {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      customerId,
      tenantId,
      status: 'PENDING_QUOTES',
      quotesCount: 0,
      ordersCount: 0,
      createdAt: new Date().toISOString(),
      createdBy: session.user.id
    };

    return NextResponse.json({
      success: true,
      data: mockRequest,
      message: 'Service request created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Customer Portal Request Creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create service request' },
      { status: 500 }
    );
  }
}
