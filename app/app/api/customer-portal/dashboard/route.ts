
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

    // Verify customer exists - using ServiceCustomer from the actual schema
    const customer = await prisma.serviceCustomer.findUnique({
      where: { id: customerId, tenantId }
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Mock dashboard data for customer portal
    const mockRequests = [
      {
        id: '1',
        status: 'COMPLETED',
        serviceType: 'IT_SERVICES',
        totalValue: 5000,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        status: 'IN_PROGRESS',
        serviceType: 'MARKETING',
        totalValue: 3000,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        status: 'PENDING',
        serviceType: 'HR_SERVICES',
        totalValue: 2000,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Calculate metrics
    const metrics = {
      // Request Metrics
      totalRequests: mockRequests.length,
      pendingRequests: mockRequests.filter((r: any) => r.status === 'PENDING').length,
      inProgressRequests: mockRequests.filter((r: any) => r.status === 'IN_PROGRESS').length,
      completedRequests: mockRequests.filter((r: any) => r.status === 'COMPLETED').length,
      
      // Financial Metrics
      totalOrderValue: mockRequests.reduce((sum: number, req: any) => sum + req.totalValue, 0),
      averageOrderValue: mockRequests.length > 0 ? 
        mockRequests.reduce((sum: number, req: any) => sum + req.totalValue, 0) / mockRequests.length : 0,
      totalSavings: 1500,
      
      // Service Categories
      serviceBreakdown: {
        IT_SERVICES: mockRequests.filter((r: any) => r.serviceType === 'IT_SERVICES').length,
        MARKETING: mockRequests.filter((r: any) => r.serviceType === 'MARKETING').length,
        HR_SERVICES: mockRequests.filter((r: any) => r.serviceType === 'HR_SERVICES').length
      }
    };

    // Recent activity mock data
    const recentActivity = [
      {
        id: '1',
        type: 'REQUEST_SUBMITTED',
        description: 'New IT services request submitted',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'QUOTE_RECEIVED',
        description: 'Marketing quote received from supplier',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        type: 'ORDER_COMPLETED',
        description: 'HR services order completed successfully',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        customer: {
          id: customer.id,
          name: customer.email || 'Customer',
          email: customer.email,
          phone: customer.phone
        },
        metrics,
        recentRequests: mockRequests,
        recentActivity,
        dashboardStats: {
          activeServices: 3,
          totalSpent: 10000,
          avgResponseTime: '4.2 hours',
          satisfactionRating: 4.8
        }
      }
    });
  } catch (error) {
    console.error('Customer Portal Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
