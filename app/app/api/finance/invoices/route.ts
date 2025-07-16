
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Get invoices with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const status = searchParams.get('status');
    const vendorName = searchParams.get('vendorName');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    }

    const where: any = { tenantId };
    
    if (status) {
      where.processingStatus = status;
    }
    
    if (vendorName) {
      where.vendorName = { contains: vendorName, mode: 'insensitive' };
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          ocrResults: {
            take: 1,
            orderBy: { createdAt: 'desc' }
          },
          confidenceScores: {
            take: 1,
            orderBy: { createdAt: 'desc' }
          },
          approvalWorkflows: {
            take: 1,
            orderBy: { createdAt: 'desc' }
          },
          threeWayMatches: {
            take: 1,
            orderBy: { createdAt: 'desc' }
          },
          notifications: {
            take: 3,
            orderBy: { createdAt: 'desc' }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.invoice.count({ where })
    ]);

    // Calculate enhanced metrics
    const enhancedInvoices = invoices.map(invoice => ({
      ...invoice,
      ocrResult: invoice.ocrResults?.[0],
      confidenceScore: invoice.confidenceScores?.[0],
      approvalWorkflow: invoice.approvalWorkflows?.[0],
      threeWayMatch: invoice.threeWayMatches?.[0],
      recentNotifications: invoice.notifications,
      // Remove arrays to clean up response
      ocrResults: undefined,
      confidenceScores: undefined,
      approvalWorkflows: undefined,
      threeWayMatches: undefined,
      notifications: undefined
    }));

    return NextResponse.json({
      invoices: enhancedInvoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

// Create new invoice
export async function POST(request: NextRequest) {
  try {
    const { tenantId, invoiceData } = await request.json();

    if (!tenantId || !invoiceData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const invoice = await prisma.invoice.create({
      data: {
        tenantId,
        invoiceNumber: invoiceData.invoiceNumber || `INV-${Date.now()}`,
        vendorName: invoiceData.vendorName || '',
        vendorEmail: invoiceData.vendorEmail,
        invoiceDate: new Date(invoiceData.invoiceDate || Date.now()),
        dueDate: new Date(invoiceData.dueDate || Date.now()),
        totalAmount: invoiceData.totalAmount || 0,
        currency: invoiceData.currency || 'EUR',
        processingStatus: 'RECEIVED',
        documentUrl: invoiceData.documentUrl,
        extractedData: invoiceData.extractedData || {}
      }
    });

    return NextResponse.json({
      success: true,
      invoice
    });

  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}
