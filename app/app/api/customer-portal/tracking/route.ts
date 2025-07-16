
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
    const orderId = searchParams.get('orderId');

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

    // Mock tracking data
    const mockTrackingEvents = [
      {
        id: '1',
        orderId: orderId || 'ORD-001',
        eventType: 'ORDER_CREATED',
        title: 'Service Order Created',
        description: 'Your service order has been created and is being processed',
        status: 'COMPLETED',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'System',
        details: {
          serviceType: 'IT_SERVICES',
          estimatedCompletion: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        id: '2',
        orderId: orderId || 'ORD-001',
        eventType: 'SUPPLIER_ASSIGNED',
        title: 'Supplier Assigned',
        description: 'TechCorp Solutions has been assigned to your service request',
        status: 'COMPLETED',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Assignment Center',
        details: {
          supplierName: 'TechCorp Solutions',
          supplierContact: 'project@techcorp.com'
        }
      },
      {
        id: '3',
        orderId: orderId || 'ORD-001',
        eventType: 'WORK_STARTED',
        title: 'Work in Progress',
        description: 'Service delivery has begun',
        status: 'COMPLETED',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Supplier Facility',
        details: {
          progress: '25%',
          nextMilestone: 'Requirements Analysis Complete'
        }
      },
      {
        id: '4',
        orderId: orderId || 'ORD-001',
        eventType: 'MILESTONE_REACHED',
        title: 'Milestone: Requirements Analysis',
        description: 'Requirements analysis phase completed successfully',
        status: 'COMPLETED',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Project Management',
        details: {
          progress: '50%',
          nextMilestone: 'Development Phase'
        }
      },
      {
        id: '5',
        orderId: orderId || 'ORD-001',
        eventType: 'IN_PROGRESS',
        title: 'Development Phase',
        description: 'Development work is currently in progress',
        status: 'IN_PROGRESS',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Development Team',
        details: {
          progress: '75%',
          estimatedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    ];

    const mockOrderSummary = {
      orderId: orderId || 'ORD-001',
      serviceType: 'IT_SERVICES',
      title: 'Website Development Project',
      supplierName: 'TechCorp Solutions',
      orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedCompletion: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
      currentStatus: 'IN_PROGRESS',
      progress: 75,
      totalValue: 5000,
      currency: 'EUR'
    };

    return NextResponse.json({
      success: true,
      data: {
        orderSummary: mockOrderSummary,
        trackingEvents: mockTrackingEvents,
        currentProgress: {
          percentage: 75,
          currentPhase: 'Development',
          nextMilestone: 'Testing & Quality Assurance',
          estimatedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        contactInfo: {
          supplierContact: 'project@techcorp.com',
          projectManager: 'John Smith',
          supportPhone: '+49 123 456 7890'
        }
      }
    });
  } catch (error) {
    console.error('Customer Portal Tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracking information' },
      { status: 500 }
    );
  }
}
