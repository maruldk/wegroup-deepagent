
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface QuoteSubmission {
  requestId: string;
  supplierId: string;
  price: number;
  currency: string;
  validUntil: Date;
  transitTime: number;
  serviceLevel: string;
  insuranceIncluded: boolean;
  supplierNotes?: string;
  supplierContact?: any;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: QuoteSubmission = await request.json();
    const { requestId, supplierId, price, currency, validUntil, transitTime, serviceLevel, insuranceIncluded, supplierNotes, supplierContact } = body;

    // Verify transport request exists
    const transportRequest = await prisma.transportRequest.findUnique({
      where: { id: requestId }
    });

    if (!transportRequest) {
      return NextResponse.json({ error: 'Transport request not found' }, { status: 404 });
    }

    // Verify supplier exists and has portal access
    const supplier = await prisma.logisticsSupplier.findUnique({
      where: { id: supplierId }
    });

    if (!supplier?.portalAccess) {
      return NextResponse.json({ error: 'Portal access not granted' }, { status: 403 });
    }

    // Check if supplier already submitted a quote
    const existingQuote = await prisma.transportQuote.findFirst({
      where: {
        requestId,
        supplierId
      }
    });

    if (existingQuote) {
      return NextResponse.json({ error: 'Quote already submitted for this request' }, { status: 400 });
    }

    // Generate quote number
    const quoteNumber = `QTE-${Date.now()}-${supplierId.substring(0, 8)}`;

    // Create quote
    const quote = await prisma.transportQuote.create({
      data: {
        requestId,
        supplierId,
        quoteNumber,
        price,
        currency: currency || 'EUR',
        validUntil: new Date(validUntil),
        transitTime,
        serviceLevel,
        insuranceIncluded: insuranceIncluded || false,
        supplierNotes: supplierNotes || '',
        supplierContact: supplierContact || {},
        status: 'SUBMITTED',
        tenantId: transportRequest.tenantId
      }
    });

    // Perform AI scoring
    const aiScoring = await performAIScoring(quote, transportRequest, supplier);
    
    // Update quote with AI scores
    await prisma.transportQuote.update({
      where: { id: quote.id },
      data: {
        aiScoreReliability: aiScoring.reliabilityScore,
        aiScoreCost: aiScoring.costScore,
        aiScoreSpeed: aiScoring.speedScore,
        aiOverallScore: aiScoring.overallScore
      }
    });

    // Update supplier response time
    const responseTime = (Date.now() - new Date(transportRequest.createdAt).getTime()) / (1000 * 60 * 60); // hours
    await prisma.logisticsSupplier.update({
      where: { id: supplierId },
      data: {
        responseTime: (supplier.responseTime * 0.8) + (responseTime * 0.2) // Moving average
      }
    });

    return NextResponse.json({
      success: true,
      quoteId: quote.id,
      quoteNumber: quote.quoteNumber,
      message: 'Quote submitted successfully',
      aiScoring
    });
  } catch (error) {
    console.error('Quote submission error:', error);
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

    // Get quotes
    const quotes = await prisma.transportQuote.findMany({
      where: whereClause,
      include: {
        request: true,
        orders: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const quotesWithDetails = quotes.map(quote => {
      const isExpired = new Date() > new Date(quote.validUntil);
      const hasOrder = quote.orders.length > 0;
      
      return {
        id: quote.id,
        quoteNumber: quote.quoteNumber,
        price: quote.price,
        currency: quote.currency,
        validUntil: quote.validUntil,
        transitTime: quote.transitTime,
        serviceLevel: quote.serviceLevel,
        insuranceIncluded: quote.insuranceIncluded,
        status: quote.status,
        selectedForCustomer: quote.selectedForCustomer,
        customerMarkup: quote.customerMarkup,
        createdAt: quote.createdAt,
        isExpired,
        hasOrder,
        aiScoreReliability: quote.aiScoreReliability,
        aiScoreCost: quote.aiScoreCost,
        aiScoreSpeed: quote.aiScoreSpeed,
        aiOverallScore: quote.aiOverallScore,
        request: {
          id: quote.request.id,
          requestNumber: quote.request.requestNumber,
          requestType: quote.request.requestType,
          cargoType: quote.request.cargoType,
          pickupDate: quote.request.pickupDate,
          deliveryDate: quote.request.deliveryDate,
          status: quote.request.status
        }
      };
    });

    return NextResponse.json({
      success: true,
      quotes: quotesWithDetails,
      summary: {
        total: quotesWithDetails.length,
        pending: quotesWithDetails.filter(q => q.status === 'PENDING').length,
        submitted: quotesWithDetails.filter(q => q.status === 'SUBMITTED').length,
        selected: quotesWithDetails.filter(q => q.status === 'SELECTED').length,
        rejected: quotesWithDetails.filter(q => q.status === 'REJECTED').length,
        expired: quotesWithDetails.filter(q => q.isExpired).length,
        withOrders: quotesWithDetails.filter(q => q.hasOrder).length,
        totalValue: quotesWithDetails.reduce((sum, quote) => sum + quote.price, 0),
        averageScore: quotesWithDetails.length > 0 ? 
          quotesWithDetails.reduce((sum, quote) => sum + (quote.aiOverallScore || 0), 0) / quotesWithDetails.length : 0
      }
    });
  } catch (error) {
    console.error('Get quotes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function performAIScoring(quote: any, transportRequest: any, supplier: any) {
  // Get other quotes for this request to compare
  const otherQuotes = await prisma.transportQuote.findMany({
    where: {
      requestId: transportRequest.id,
      id: { not: quote.id }
    },
    include: {
      supplier: true
    }
  });

  const allQuotes = [quote, ...otherQuotes];
  
  // Cost Score (0-100) - Lower price = higher score
  const prices = allQuotes.map(q => q.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const costScore = maxPrice === minPrice ? 100 : 
    100 - ((quote.price - minPrice) / (maxPrice - minPrice)) * 100;
  
  // Speed Score (0-100) - Lower transit time = higher score
  const transitTimes = allQuotes.map(q => q.transitTime);
  const minTime = Math.min(...transitTimes);
  const maxTime = Math.max(...transitTimes);
  const speedScore = maxTime === minTime ? 100 : 
    100 - ((quote.transitTime - minTime) / (maxTime - minTime)) * 100;
  
  // Reliability Score (0-100) - Based on supplier performance
  const reliabilityScore = supplier.reliabilityScore * 100;
  
  // Overall Score (weighted average)
  const overallScore = (costScore * 0.4) + (speedScore * 0.3) + (reliabilityScore * 0.3);
  
  return {
    costScore,
    speedScore,
    reliabilityScore,
    overallScore
  };
}
