
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const tenantId = url.searchParams.get('tenantId');
    const supplierId = url.searchParams.get('supplierId');
    const status = url.searchParams.get('status') || 'ALL';

    if (!tenantId || !supplierId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Verify supplier has portal access
    const supplier = await prisma.logisticsSupplier.findUnique({
      where: { id: supplierId, tenantId }
    });

    if (!supplier?.portalAccess) {
      return NextResponse.json({ error: 'Portal access not granted' }, { status: 403 });
    }

    // Build where clause
    const whereClause: any = {
      tenantId,
      suppliers: {
        some: {
          id: supplierId
        }
      }
    };

    if (status !== 'ALL') {
      whereClause.status = status;
    }

    // Get tenders
    const tenders = await prisma.tenderRequest.findMany({
      where: whereClause,
      include: {
        bids: {
          where: {
            supplierId: supplierId
          }
        },
        creator: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const tendersWithBidStatus = tenders.map(tender => {
      const supplierBid = tender.bids.find(bid => bid.supplierId === supplierId);
      const timeLeft = tender.bidDeadline ? Math.ceil((new Date(tender.bidDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
      
      return {
        id: tender.id,
        tenderNumber: tender.tenderNumber,
        title: tender.title,
        description: tender.description,
        tenderType: tender.tenderType,
        status: tender.status,
        publishedDate: tender.publishedDate,
        bidDeadline: tender.bidDeadline,
        estimatedValue: tender.estimatedValue,
        currency: tender.currency,
        requirements: tender.requirements,
        documents: tender.documents,
        timeLeft: timeLeft,
        isOverdue: timeLeft < 0,
        canBid: tender.status === 'ACTIVE' && timeLeft > 0 && !supplierBid,
        hasBid: !!supplierBid,
        bidStatus: supplierBid?.status || null,
        bidAmount: supplierBid?.proposedPrice || null,
        bidSubmittedAt: supplierBid?.submittedAt || null,
        createdBy: tender.creator?.firstName && tender.creator?.lastName ? 
                   `${tender.creator.firstName} ${tender.creator.lastName}` : 
                   tender.creator?.email || 'System'
      };
    });

    return NextResponse.json({
      success: true,
      tenders: tendersWithBidStatus,
      summary: {
        total: tendersWithBidStatus.length,
        active: tendersWithBidStatus.filter(t => t.status === 'ACTIVE').length,
        canBid: tendersWithBidStatus.filter(t => t.canBid).length,
        hasBid: tendersWithBidStatus.filter(t => t.hasBid).length,
        overdue: tendersWithBidStatus.filter(t => t.isOverdue).length
      }
    });
  } catch (error) {
    console.error('Supplier portal tenders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
