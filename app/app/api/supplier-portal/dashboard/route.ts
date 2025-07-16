
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

    if (!tenantId || !supplierId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Verify supplier exists and has portal access
    const supplier = await prisma.logisticsSupplier.findUnique({
      where: { id: supplierId, tenantId },
      include: {
        quotes: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          },
          include: {
            request: true
          }
        },
        bids: {
          where: {
            submittedAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          },
          include: {
            tender: true
          }
        },
        contracts: {
          where: {
            status: 'ACTIVE'
          }
        }
      }
    });

    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    if (!supplier.portalAccess) {
      return NextResponse.json({ error: 'Portal access not granted' }, { status: 403 });
    }

    // Get active tenders
    const activeTenders = await prisma.tenderRequest.findMany({
      where: {
        tenantId,
        status: 'ACTIVE',
        suppliers: {
          some: {
            id: supplierId
          }
        }
      },
      include: {
        bids: {
          where: {
            supplierId: supplierId
          }
        }
      }
    });

    // Calculate metrics
    const metrics = {
      // Quote Metrics
      totalQuotes: supplier.quotes.length,
      selectedQuotes: supplier.quotes.filter(q => q.selectedForCustomer).length,
      pendingQuotes: supplier.quotes.filter(q => q.status === 'PENDING').length,
      acceptedQuotes: supplier.quotes.filter(q => q.status === 'SELECTED').length,
      rejectedQuotes: supplier.quotes.filter(q => q.status === 'REJECTED').length,
      expiredQuotes: supplier.quotes.filter(q => q.status === 'EXPIRED').length,
      
      // Financial Metrics
      totalQuoteValue: supplier.quotes.reduce((sum, quote) => sum + quote.price, 0),
      averageQuoteValue: supplier.quotes.length > 0 ? 
        supplier.quotes.reduce((sum, quote) => sum + quote.price, 0) / supplier.quotes.length : 0,
      wonQuoteValue: supplier.quotes.filter(q => q.selectedForCustomer)
        .reduce((sum, quote) => sum + quote.price, 0),
      
      // Performance Metrics
      winRate: supplier.quotes.length > 0 ? 
        supplier.quotes.filter(q => q.selectedForCustomer).length / supplier.quotes.length : 0,
      averageResponseTime: supplier.responseTime,
      reliabilityScore: supplier.reliabilityScore,
      rating: supplier.rating,
      aiPerformanceScore: supplier.aiPerformanceScore,
      
      // Tender Metrics
      activeTendersCount: activeTenders.length,
      bidsSubmitted: supplier.bids.length,
      bidsWon: supplier.bids.filter(b => b.status === 'WINNING').length,
      
      // Contract Metrics
      activeContracts: supplier.contracts.length,
      contractValue: supplier.contracts.reduce((sum, contract) => sum + (contract.basePrice || 0), 0)
    };

    // Get recent activities
    const recentActivities = [
      // Recent quotes
      ...supplier.quotes.slice(0, 10).map(quote => ({
        id: quote.id,
        type: 'QUOTE',
        action: quote.status === 'SELECTED' ? 'WON' : 'SUBMITTED',
        description: `Quote for ${quote.request.requestNumber} - ${quote.status}`,
        amount: quote.price,
        timestamp: quote.createdAt
      })),
      
      // Recent bids
      ...supplier.bids.slice(0, 10).map(bid => ({
        id: bid.id,
        type: 'BID',
        action: 'SUBMITTED',
        description: `Bid for ${bid.tender.title} - ${bid.status}`,
        amount: bid.proposedPrice,
        timestamp: bid.submittedAt
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 20);

    // Get pending opportunities
    const pendingOpportunities = activeTenders.filter(tender => 
      !tender.bids.some(bid => bid.supplierId === supplierId)
    );

    return NextResponse.json({
      success: true,
      supplier: {
        id: supplier.id,
        companyName: supplier.companyName,
        supplierCode: supplier.supplierCode,
        rating: supplier.rating,
        reliabilityScore: supplier.reliabilityScore,
        aiPerformanceScore: supplier.aiPerformanceScore,
        status: supplier.status
      },
      metrics,
      recentActivities,
      pendingOpportunities: pendingOpportunities.map(tender => ({
        id: tender.id,
        title: tender.title,
        tenderNumber: tender.tenderNumber,
        bidDeadline: tender.bidDeadline,
        requirements: tender.requirements,
        estimatedValue: tender.estimatedValue,
        daysLeft: tender.bidDeadline ? Math.ceil((new Date(tender.bidDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0
      }))
    });
  } catch (error) {
    console.error('Supplier portal dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
