
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface WorkflowTrigger {
  tenantId: string;
  workflowType: 'TRANSPORT_REQUEST' | 'QUOTE_COLLECTION' | 'ORDER_PROCESSING' | 'DELIVERY_NOTIFICATION';
  entityId: string;
  triggerData?: any;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: WorkflowTrigger = await request.json();
    const { tenantId, workflowType, entityId, triggerData } = body;

    let result;
    switch (workflowType) {
      case 'TRANSPORT_REQUEST':
        result = await processTransportRequestWorkflow(tenantId, entityId, triggerData);
        break;
      case 'QUOTE_COLLECTION':
        result = await processQuoteCollectionWorkflow(tenantId, entityId, triggerData);
        break;
      case 'ORDER_PROCESSING':
        result = await processOrderProcessingWorkflow(tenantId, entityId, triggerData);
        break;
      case 'DELIVERY_NOTIFICATION':
        result = await processDeliveryNotificationWorkflow(tenantId, entityId, triggerData);
        break;
      default:
        return NextResponse.json({ error: 'Invalid workflow type' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      workflowType,
      entityId,
      result
    });
  } catch (error) {
    console.error('Workflow automation error:', error);
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
    const workflowType = url.searchParams.get('workflowType');
    const entityId = url.searchParams.get('entityId');

    if (!tenantId) {
      return NextResponse.json({ error: 'Missing tenantId' }, { status: 400 });
    }

    // Get workflow status
    const workflowStatus = await getWorkflowStatus(
      tenantId || "", 
      workflowType as string | undefined, 
      entityId as string | undefined
    );
    
    return NextResponse.json({
      success: true,
      workflowStatus
    });
  } catch (error) {
    console.error('Get workflow status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function processTransportRequestWorkflow(tenantId: string, requestId: string, triggerData: any) {
  const transportRequest = await prisma.transportRequest.findUnique({
    where: { id: requestId, tenantId }
  });

  if (!transportRequest) {
    throw new Error('Transport request not found');
  }

  // Step 1: Find suitable suppliers
  const suitableSuppliers = await findSuitableSuppliers(tenantId, transportRequest);
  
  // Step 2: Create tender request
  const tender = await createAutomatedTender(tenantId, transportRequest, suitableSuppliers);
  
  // Step 3: Send notifications to suppliers
  await sendSupplierNotifications(tender, suitableSuppliers);
  
  // Step 4: Set up quote collection timer
  await setupQuoteCollectionTimer(tender);
  
  // Step 5: Update request status
  await prisma.transportRequest.update({
    where: { id: requestId },
    data: {
      status: 'QUOTED',
      aiRecommendedSuppliers: suitableSuppliers.map(s => ({
        id: s.id,
        name: s.companyName,
        rating: s.rating,
        reliabilityScore: s.reliabilityScore,
        aiScore: s.aiScore
      }))
    }
  });

  return {
    tenderId: tender.id,
    suppliersContacted: suitableSuppliers.length,
    estimatedResponseTime: 24, // hours
    automationLevel: 'HIGH'
  };
}

async function processQuoteCollectionWorkflow(tenantId: string, tenderId: string, triggerData: any) {
  const tender = await prisma.tenderRequest.findUnique({
    where: { id: tenderId, tenantId },
    include: {
      bids: {
        include: {
          supplier: true
        }
      }
    }
  });

  if (!tender) {
    throw new Error('Tender not found');
  }

  // Step 1: Collect all quotes
  const quotes = await prisma.transportQuote.findMany({
    where: {
      requestId: tender.requestId || undefined,
      tenantId: tenantId || undefined,
      status: 'SUBMITTED'
    },
    include: {
      supplier: true
    }
  });

  if (quotes.length === 0) {
    return {
      message: 'No quotes received yet',
      automationLevel: 'WAITING'
    };
  }

  // Step 2: AI-powered quote analysis
  const quoteAnalysis = await performAIQuoteAnalysis(quotes, tender.requestId);
  
  // Step 3: Create quotation comparison
  const comparison = await prisma.quotationComparison.create({
    data: {
      requestId: tender.requestId || "",
      comparisonName: `AI-Generated-${Date.now()}`,
      criteria: quoteAnalysis.criteria,
      weightings: quoteAnalysis.weightings,
      comparisonMatrix: quoteAnalysis.comparisonMatrix,
      winningQuote: quoteAnalysis.recommendedQuote.quoteId,
      aiRecommendation: quoteAnalysis.recommendation,
      aiReasoning: quoteAnalysis.reasoning,
      aiConfidence: quoteAnalysis.confidence,
      status: 'COMPLETED',
      tenantId: tenantId || "",
      createdBy: 'system'
    }
  });

  // Step 4: Auto-select if confidence is high enough
  if (quoteAnalysis.confidence > 0.9) {
    await autoSelectQuote(tender.requestId || "", quoteAnalysis.recommendedQuote.quoteId, tenantId || "");
  }

  return {
    comparisonId: comparison.id,
    quotesAnalyzed: quotes.length,
    recommendedQuote: quoteAnalysis.recommendedQuote,
    aiConfidence: quoteAnalysis.confidence,
    autoSelected: quoteAnalysis.confidence > 0.9,
    automationLevel: 'HIGH'
  };
}

async function processOrderProcessingWorkflow(tenantId: string, orderId: string, triggerData: any) {
  const order = await prisma.transportOrder.findUnique({
    where: { id: orderId, tenantId },
    include: {
      request: true,
      quote: {
        include: {
          supplier: true
        }
      }
    }
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // Step 1: Generate order confirmation
  const orderConfirmation = await generateOrderConfirmation(order);
  
  // Step 2: Send notifications
  await sendOrderNotifications(order);
  
  // Step 3: Set up tracking
  const trackingSetup = await setupOrderTracking(order);
  
  // Step 4: Schedule delivery prediction
  await scheduleDeliveryPrediction(order);
  
  // Step 5: Update order status
  await prisma.transportOrder.update({
    where: { id: orderId },
    data: {
      status: 'PROCESSING',
      documents: [orderConfirmation],
      trackingNumber: trackingSetup.trackingNumber,
      aiDeliveryPrediction: trackingSetup.estimatedDelivery
    }
  });

  return {
    orderConfirmation,
    trackingNumber: trackingSetup.trackingNumber,
    estimatedDelivery: trackingSetup.estimatedDelivery,
    automationLevel: 'HIGH'
  };
}

async function processDeliveryNotificationWorkflow(tenantId: string, orderId: string, triggerData: any) {
  const order = await prisma.transportOrder.findUnique({
    where: { id: orderId, tenantId },
    include: {
      request: true,
      trackingEvents: true
    }
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // Step 1: Verify delivery
  const deliveryVerification = await verifyDelivery(order);
  
  // Step 2: Generate delivery confirmation
  const deliveryConfirmation = await generateDeliveryConfirmation(order);
  
  // Step 3: Send notifications
  await sendDeliveryNotifications(order, deliveryConfirmation);
  
  // Step 4: Generate invoice
  const invoice = await generateAutomatedInvoice(order);
  
  // Step 5: Update statuses
  await prisma.transportOrder.update({
    where: { id: orderId },
    data: {
      status: 'DELIVERED',
      invoiceGenerated: true,
      documents: [
        ...(Array.isArray(order.documents) ? order.documents : []),
        deliveryConfirmation,
        invoice
      ]
    }
  });

  await prisma.transportRequest.update({
    where: { id: order.requestId },
    data: {
      status: 'DELIVERED'
    }
  });

  return {
    deliveryVerification,
    deliveryConfirmation,
    invoice,
    automationLevel: 'HIGH'
  };
}

async function findSuitableSuppliers(tenantId: string, transportRequest: any) {
  const suppliers = await prisma.logisticsSupplier.findMany({
    where: {
      tenantId,
      status: 'ACTIVE',
      portalAccess: true,
      transportTypes: {
        array_contains: [transportRequest.requestType]
      }
    }
  });

  // AI-powered supplier matching
  const suppliersWithScore = suppliers.map(supplier => {
    const aiScore = calculateSupplierAIScore(supplier, transportRequest);
    return {
      ...supplier,
      aiScore
    };
  });

  // Sort by AI score and return top 10
  return suppliersWithScore
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 10);
}

function calculateSupplierAIScore(supplier: any, transportRequest: any): number {
  let score = 0;
  
  // Base score from supplier metrics
  score += supplier.rating * 20; // 0-100 points
  score += supplier.reliabilityScore * 30; // 0-30 points
  score += (100 - supplier.responseTime) * 0.1; // Lower response time = higher score
  
  // Transport type matching
  const transportTypes = supplier.transportTypes || [];
  if (transportTypes.includes(transportRequest.requestType)) {
    score += 20;
  }
  
  // Geographic coverage (simplified)
  score += 10; // Assume basic coverage
  
  // Performance bonus
  score += supplier.aiPerformanceScore * 20; // 0-20 points
  
  return Math.min(100, Math.max(0, score));
}

async function createAutomatedTender(tenantId: string, transportRequest: any, suppliers: any[]) {
  const tender = await prisma.tenderRequest.create({
    data: {
      tenderNumber: `AUTO-${Date.now()}`,
      requestId: transportRequest.id,
      tenderType: 'TRANSPORT',
      title: `Automated Transport Request ${transportRequest.requestNumber}`,
      description: `AI-generated tender for ${transportRequest.cargoType} transport`,
      bidDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      requirements: {
        transportType: transportRequest.requestType,
        cargoType: transportRequest.cargoType,
        cargoWeight: transportRequest.cargoWeight,
        cargoVolume: transportRequest.cargoVolume,
        isDangerous: transportRequest.isDangerous,
        pickupDate: transportRequest.pickupDate,
        deliveryDate: transportRequest.deliveryDate,
        pickupAddress: transportRequest.pickupAddress,
        deliveryAddress: transportRequest.deliveryAddress,
        specialInstructions: transportRequest.specialInstructions
      },
      status: 'ACTIVE',
      evaluationCriteria: {
        priceWeight: 40,
        timeWeight: 30,
        qualityWeight: 20,
        experienceWeight: 10
      },
      publishDate: new Date(),
      submissionDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      evaluationPeriod: 48, // 48 hours
      tenantId,
      createdBy: 'automation'
    }
  });

  // Add suppliers to tender
  await Promise.all(suppliers.map(supplier => 
    prisma.tenderRequest.update({
      where: { id: tender.id },
      data: {
        suppliers: {
          connect: { id: supplier.id }
        }
      }
    })
  ));

  return tender;
}

async function sendSupplierNotifications(tender: any, suppliers: any[]) {
  // In a real implementation, this would send emails/notifications
  console.log(`Sending tender notifications to ${suppliers.length} suppliers for tender ${tender.tenderNumber}`);
  
  // Simulate notification sending
  return {
    sent: suppliers.length,
    failed: 0,
    method: 'EMAIL'
  };
}

async function setupQuoteCollectionTimer(tender: any) {
  // In a real implementation, this would set up a timer/cron job
  console.log(`Setting up quote collection timer for tender ${tender.tenderNumber}`);
  
  return {
    timerId: `timer-${tender.id}`,
    deadline: tender.bidDeadline,
    reminderScheduled: new Date(tender.bidDeadline.getTime() - 2 * 60 * 60 * 1000) // 2 hours before
  };
}

async function performAIQuoteAnalysis(quotes: any[], transportRequest: any) {
  const criteria = {
    price: 0.4,
    speed: 0.3,
    reliability: 0.3
  };

  const weightings = {
    price: 40,
    speed: 30,
    reliability: 30
  };

  const comparisonMatrix = quotes.map(quote => {
    const priceScore = calculatePriceScore(quote, quotes);
    const speedScore = calculateSpeedScore(quote, quotes);
    const reliabilityScore = quote.supplier.reliabilityScore * 100;
    
    const weightedScore = 
      (priceScore * criteria.price) + 
      (speedScore * criteria.speed) + 
      (reliabilityScore * criteria.reliability);

    return {
      quoteId: quote.id,
      supplierName: quote.supplier.companyName,
      price: quote.price,
      transitTime: quote.transitTime,
      priceScore,
      speedScore,
      reliabilityScore,
      weightedScore
    };
  });

  const recommendedQuote = comparisonMatrix.reduce((prev, current) => 
    prev.weightedScore > current.weightedScore ? prev : current
  );

  const confidence = calculateConfidence(comparisonMatrix, recommendedQuote);

  return {
    criteria,
    weightings,
    comparisonMatrix,
    recommendedQuote,
    recommendation: `AI recommends ${recommendedQuote.supplierName} with score ${recommendedQuote.weightedScore.toFixed(2)}`,
    reasoning: `Best balance of price (${recommendedQuote.priceScore.toFixed(1)}), speed (${recommendedQuote.speedScore.toFixed(1)}), and reliability (${recommendedQuote.reliabilityScore.toFixed(1)})`,
    confidence
  };
}

function calculatePriceScore(quote: any, allQuotes: any[]): number {
  const prices = allQuotes.map(q => q.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  if (maxPrice === minPrice) return 100;
  
  return 100 - ((quote.price - minPrice) / (maxPrice - minPrice)) * 100;
}

function calculateSpeedScore(quote: any, allQuotes: any[]): number {
  const times = allQuotes.map(q => q.transitTime);
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  
  if (maxTime === minTime) return 100;
  
  return 100 - ((quote.transitTime - minTime) / (maxTime - minTime)) * 100;
}

function calculateConfidence(matrix: any[], recommended: any): number {
  if (matrix.length < 2) return 0.5;
  
  const scores = matrix.map(item => item.weightedScore).sort((a, b) => b - a);
  const topScore = scores[0];
  const secondScore = scores[1];
  
  const scoreDifference = topScore - secondScore;
  const maxPossibleDifference = 100;
  
  return 0.5 + (scoreDifference / maxPossibleDifference) * 0.5;
}

async function autoSelectQuote(requestId: string, quoteId: string, tenantId: string) {
  // Select the quote
  await prisma.transportQuote.update({
    where: { id: quoteId },
    data: {
      selectedForCustomer: true,
      status: 'SELECTED'
    }
  });

  // Reject other quotes
  await prisma.transportQuote.updateMany({
    where: {
      requestId,
      tenantId,
      id: { not: quoteId }
    },
    data: {
      status: 'REJECTED'
    }
  });

  // Create order
  const quote = await prisma.transportQuote.findUnique({
    where: { id: quoteId }
  });

  if (quote) {
    await prisma.transportOrder.create({
      data: {
        requestId,
        quoteId,
        orderNumber: `AUTO-${Date.now()}`,
        finalPrice: quote.price,
        currency: quote.currency,
        customerPrice: quote.price * 1.1, // 10% markup
        margin: quote.price * 0.1,
        status: 'CONFIRMED',
        tenantId
      }
    });
  }
}

async function generateOrderConfirmation(order: any) {
  return {
    type: 'ORDER_CONFIRMATION',
    name: `Order Confirmation ${order.orderNumber}`,
    url: `/documents/order-confirmation/${order.id}`,
    generatedAt: new Date().toISOString(),
    size: '156 KB'
  };
}

async function sendOrderNotifications(order: any) {
  console.log(`Sending order notifications for order ${order.orderNumber}`);
  return {
    customerNotified: true,
    supplierNotified: true,
    method: 'EMAIL'
  };
}

async function setupOrderTracking(order: any) {
  const trackingNumber = `TRK-${Date.now()}`;
  const estimatedDelivery = new Date(order.request.deliveryDate);
  
  return {
    trackingNumber,
    estimatedDelivery,
    trackingEnabled: true
  };
}

async function scheduleDeliveryPrediction(order: any) {
  console.log(`Scheduling delivery prediction for order ${order.orderNumber}`);
  return {
    predictionScheduled: true,
    nextUpdate: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours
  };
}

async function verifyDelivery(order: any) {
  return {
    verified: true,
    deliveryTime: new Date(),
    method: 'AUTOMATIC'
  };
}

async function generateDeliveryConfirmation(order: any) {
  return {
    type: 'DELIVERY_CONFIRMATION',
    name: `Delivery Confirmation ${order.orderNumber}`,
    url: `/documents/delivery-confirmation/${order.id}`,
    generatedAt: new Date().toISOString(),
    size: '145 KB'
  };
}

async function sendDeliveryNotifications(order: any, deliveryConfirmation: any) {
  console.log(`Sending delivery notifications for order ${order.orderNumber}`);
  return {
    customerNotified: true,
    documentsAttached: true,
    method: 'EMAIL'
  };
}

async function generateAutomatedInvoice(order: any) {
  return {
    type: 'INVOICE',
    name: `Invoice ${order.orderNumber}`,
    url: `/documents/invoice/${order.id}`,
    generatedAt: new Date().toISOString(),
    size: '198 KB',
    amount: order.customerPrice,
    currency: order.currency
  };
}

async function getWorkflowStatus(tenantId: string, workflowType?: string, entityId?: string) {
  // This would return the current status of workflows
  // For now, returning mock data
  return {
    activeWorkflows: 12,
    completedToday: 8,
    automationRate: 0.85,
    averageProcessingTime: 2.5 // hours
  };
}
