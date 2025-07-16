
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

    // Mock documents data
    const mockDocuments = [
      {
        id: '1',
        type: 'INVOICE',
        title: 'Service Invoice #INV-001',
        description: 'IT Services - Website Development',
        downloadUrl: '/api/documents/download/1',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'AVAILABLE'
      },
      {
        id: '2',
        type: 'CONTRACT',
        title: 'Service Agreement #SA-002',
        description: 'Marketing Services Contract',
        downloadUrl: '/api/documents/download/2',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'AVAILABLE'
      },
      {
        id: '3',
        type: 'REPORT',
        title: 'Project Completion Report',
        description: 'HR Services Implementation Report',
        downloadUrl: '/api/documents/download/3',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'AVAILABLE'
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        documents: mockDocuments,
        totalDocuments: mockDocuments.length,
        availableDocuments: mockDocuments.filter((doc: any) => doc.status === 'AVAILABLE').length
      }
    });
  } catch (error) {
    console.error('Customer Portal Documents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
