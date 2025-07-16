
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface BidSubmission {
  tenderId: string;
  supplierId: string;
  proposedPrice: number;
  currency: string;
  proposedTerms: any;
  technicalProposal: string;
  complianceChecklist: any;
  documents: any[];
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: BidSubmission = await request.json();
    const { tenderId, supplierId, proposedPrice, currency, proposedTerms, technicalProposal, complianceChecklist, documents } = body;

    // Verify tender exists and is active
    const tender = await prisma.tenderRequest.findUnique({
      where: { id: tenderId },
      include: {
        suppliers: true
      }
    });

    if (!tender) {
      return NextResponse.json({ error: 'Tender not found' }, { status: 404 });
    }

    if (tender.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Tender is not active' }, { status: 400 });
    }

    if (tender.bidDeadline && new Date() > new Date(tender.bidDeadline)) {
      return NextResponse.json({ error: 'Bid deadline has passed' }, { status: 400 });
    }

    // Verify supplier is invited to this tender
    const isInvited = tender.suppliers.some(supplier => supplier.id === supplierId);
    if (!isInvited) {
      return NextResponse.json({ error: 'Supplier not invited to this tender' }, { status: 403 });
    }

    // Check if supplier already submitted a bid
    const existingBid = await prisma.supplierBid.findFirst({
      where: {
        tenderId,
        supplierId
      }
    });

    if (existingBid) {
      return NextResponse.json({ error: 'Bid already submitted for this tender' }, { status: 400 });
    }

    // Generate bid number
    const bidNumber = `BID-${Date.now()}-${supplierId.substring(0, 8)}`;

    // Create bid
    const bid = await prisma.supplierBid.create({
      data: {
        tenderId,
        supplierId,
        bidNumber,
        proposedPrice,
        currency: currency || 'EUR',
        proposedTerms: proposedTerms || {},
        technicalProposal,
        complianceChecklist: complianceChecklist || {},
        documents: documents || [],
        status: 'SUBMITTED',
        tenantId: tender.tenantId,
        // AI evaluation will be done asynchronously
        aiComplianceScore: 0,
        aiRiskAssessment: {}
      }
    });

    // Perform AI evaluation
    const aiEvaluation = await performAIEvaluation(bid, tender);
    
    // Update bid with AI scores
    await prisma.supplierBid.update({
      where: { id: bid.id },
      data: {
        aiComplianceScore: aiEvaluation.complianceScore,
        aiRiskAssessment: aiEvaluation.riskAssessment,
        technicalScore: aiEvaluation.technicalScore,
        priceScore: aiEvaluation.priceScore
      }
    });

    return NextResponse.json({
      success: true,
      bidId: bid.id,
      bidNumber: bid.bidNumber,
      message: 'Bid submitted successfully',
      aiEvaluation
    });
  } catch (error) {
    console.error('Bid submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    // Build where clause
    const whereClause: any = {
      tenantId,
      supplierId
    };

    if (status !== 'ALL') {
      whereClause.status = status;
    }

    // Get bids
    const bids = await prisma.supplierBid.findMany({
      where: whereClause,
      include: {
        tender: true
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });

    const bidsWithDetails = bids.map(bid => ({
      id: bid.id,
      bidNumber: bid.bidNumber,
      proposedPrice: bid.proposedPrice,
      currency: bid.currency,
      status: bid.status,
      submittedAt: bid.submittedAt,
      technicalScore: bid.technicalScore,
      priceScore: bid.priceScore,
      overallScore: bid.overallScore,
      aiComplianceScore: bid.aiComplianceScore,
      tender: {
        id: bid.tender.id,
        tenderNumber: bid.tender.tenderNumber,
        title: bid.tender.title,
        bidDeadline: bid.tender.bidDeadline,
        estimatedValue: bid.tender.estimatedValue,
        status: bid.tender.status
      }
    }));

    return NextResponse.json({
      success: true,
      bids: bidsWithDetails,
      summary: {
        total: bidsWithDetails.length,
        submitted: bidsWithDetails.filter(b => b.status === 'SUBMITTED').length,
        underReview: bidsWithDetails.filter(b => b.status === 'UNDER_REVIEW').length,
        winning: bidsWithDetails.filter(b => b.status === 'WINNING').length,
        rejected: bidsWithDetails.filter(b => b.status === 'REJECTED').length,
        totalValue: bidsWithDetails.reduce((sum, bid) => sum + bid.proposedPrice, 0),
        averageScore: bidsWithDetails.length > 0 ? 
          bidsWithDetails.reduce((sum, bid) => sum + (bid.overallScore || 0), 0) / bidsWithDetails.length : 0
      }
    });
  } catch (error) {
    console.error('Get bids error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function performAIEvaluation(bid: any, tender: any) {
  // Simulate AI evaluation logic
  const requirements = tender.requirements || {};
  
  // Compliance Score (0-100)
  const complianceScore = Math.min(100, Math.max(0, 
    70 + Math.random() * 30 // Base score 70-100
  ));
  
  // Technical Score (0-100)
  const technicalScore = Math.min(100, Math.max(0,
    60 + Math.random() * 40 // Base score 60-100
  ));
  
  // Price Score (0-100) - Lower price = higher score
  const estimatedValue = tender.estimatedValue || bid.proposedPrice;
  const priceScore = Math.min(100, Math.max(0,
    100 - ((bid.proposedPrice - estimatedValue) / estimatedValue) * 100
  ));
  
  // Risk Assessment
  const riskAssessment = {
    financialRisk: bid.proposedPrice > estimatedValue * 1.2 ? 'HIGH' : 
                   bid.proposedPrice > estimatedValue * 1.1 ? 'MEDIUM' : 'LOW',
    technicalRisk: technicalScore < 70 ? 'HIGH' : 
                   technicalScore < 85 ? 'MEDIUM' : 'LOW',
    complianceRisk: complianceScore < 80 ? 'HIGH' : 
                    complianceScore < 90 ? 'MEDIUM' : 'LOW',
    overallRisk: 'MEDIUM',
    confidence: 0.8 + Math.random() * 0.2
  };
  
  return {
    complianceScore,
    technicalScore,
    priceScore,
    riskAssessment
  };
}
