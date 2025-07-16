
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface OptimizationRequest {
  tenantId: string;
  requestId: string;
  optimizationType: 'cost' | 'speed' | 'reliability' | 'carbon' | 'comprehensive';
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: OptimizationRequest = await request.json();
    const { tenantId, requestId, optimizationType } = body;

    // Mock-Daten für Demo (da transportRequest Tabelle nicht existiert)
    const transportRequest = {
      id: requestId,
      tenantId,
      status: 'PENDING',
      quotes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (!transportRequest) {
      return NextResponse.json({ error: 'Transport request not found' }, { status: 404 });
    }

    let optimizationResult;
    
    switch (optimizationType) {
      case 'cost':
        optimizationResult = await optimizeForCost(transportRequest);
        break;
      case 'speed':
        optimizationResult = await optimizeForSpeed(transportRequest);
        break;
      case 'reliability':
        optimizationResult = await optimizeForReliability(transportRequest);
        break;
      case 'carbon':
        optimizationResult = await optimizeForCarbon(transportRequest);
        break;
      case 'comprehensive':
        optimizationResult = await optimizeComprehensive(transportRequest);
        break;
      default:
        return NextResponse.json({ error: 'Invalid optimization type' }, { status: 400 });
    }

    // Mock-Update für Demo (da transportRequest Tabelle nicht existiert)
    // In einer echten Implementierung würde hier die Transport Request aktualisiert

    return NextResponse.json({
      success: true,
      optimizationType,
      result: optimizationResult
    });
  } catch (error) {
    console.error('AI optimization error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function optimizeForCost(transportRequest: any) {
  const quotes = transportRequest.quotes || [];
  
  // Sort by price
  const sortedQuotes = quotes.sort((a: any, b: any) => a.price - b.price);
  
  // Calculate market average
  const averagePrice = quotes.reduce((sum: number, quote: any) => sum + quote.price, 0) / quotes.length;
  
  // Find cost-effective suppliers
  const costEffectiveSuppliers = sortedQuotes.slice(0, 3).map((quote: any) => ({
    supplierId: quote.supplier.id,
    supplierName: quote.supplier.companyName,
    price: quote.price,
    savings: averagePrice - quote.price,
    savingsPercentage: ((averagePrice - quote.price) / averagePrice) * 100
  }));

  return {
    estimatedCost: sortedQuotes[0]?.price || 0,
    recommendedSuppliers: costEffectiveSuppliers,
    riskAssessment: {
      costRisk: 'LOW',
      marketPosition: sortedQuotes[0]?.price < averagePrice ? 'BELOW_MARKET' : 'ABOVE_MARKET',
      confidence: 0.9
    },
    insights: {
      marketAverage: averagePrice,
      bestPrice: sortedQuotes[0]?.price || 0,
      potentialSavings: Math.max(0, averagePrice - (sortedQuotes[0]?.price || 0))
    }
  };
}

async function optimizeForSpeed(transportRequest: any) {
  const quotes = transportRequest.quotes || [];
  
  // Sort by transit time
  const sortedQuotes = quotes.sort((a: any, b: any) => a.transitTime - b.transitTime);
  
  // Calculate average transit time
  const averageTransitTime = quotes.reduce((sum: number, quote: any) => sum + quote.transitTime, 0) / quotes.length;
  
  const fastestSuppliers = sortedQuotes.slice(0, 3).map((quote: any) => ({
    supplierId: quote.supplier.id,
    supplierName: quote.supplier.companyName,
    transitTime: quote.transitTime,
    price: quote.price,
    timeSaved: averageTransitTime - quote.transitTime
  }));

  return {
    estimatedCost: sortedQuotes[0]?.price || 0,
    recommendedSuppliers: fastestSuppliers,
    riskAssessment: {
      deliveryRisk: 'LOW',
      speedAdvantage: sortedQuotes[0]?.transitTime < averageTransitTime ? 'FASTER' : 'STANDARD',
      confidence: 0.85
    },
    insights: {
      averageTransitTime,
      fastestTime: sortedQuotes[0]?.transitTime || 0,
      timeSavings: Math.max(0, averageTransitTime - (sortedQuotes[0]?.transitTime || 0))
    }
  };
}

async function optimizeForReliability(transportRequest: any) {
  const quotes = transportRequest.quotes || [];
  
  // Sort by reliability score
  const sortedQuotes = quotes.sort((a: any, b: any) => b.supplier.reliabilityScore - a.supplier.reliabilityScore);
  
  const reliableSuppliers = sortedQuotes.slice(0, 3).map((quote: any) => ({
    supplierId: quote.supplier.id,
    supplierName: quote.supplier.companyName,
    reliabilityScore: quote.supplier.reliabilityScore,
    price: quote.price,
    transitTime: quote.transitTime,
    rating: quote.supplier.rating
  }));

  return {
    estimatedCost: sortedQuotes[0]?.price || 0,
    recommendedSuppliers: reliableSuppliers,
    riskAssessment: {
      reliabilityRisk: 'LOW',
      supplierQuality: 'HIGH',
      confidence: 0.95
    },
    insights: {
      topReliabilityScore: sortedQuotes[0]?.supplier.reliabilityScore || 0,
      averageRating: quotes.reduce((sum: number, quote: any) => sum + quote.supplier.rating, 0) / quotes.length
    }
  };
}

async function optimizeForCarbon(transportRequest: any) {
  const quotes = transportRequest.quotes || [];
  
  // Simulate carbon footprint calculation
  const quotesWithCarbon = quotes.map((quote: any) => ({
    ...quote,
    carbonFootprint: calculateCarbonFootprint(quote, transportRequest)
  }));
  
  // Sort by carbon footprint
  const sortedQuotes = quotesWithCarbon.sort((a: any, b: any) => a.carbonFootprint - b.carbonFootprint);
  
  const ecoFriendlySuppliers = sortedQuotes.slice(0, 3).map((quote: any) => ({
    supplierId: quote.supplier.id,
    supplierName: quote.supplier.companyName,
    carbonFootprint: quote.carbonFootprint,
    price: quote.price,
    transitTime: quote.transitTime,
    ecoScore: 100 - (quote.carbonFootprint / 10) // Simplified eco score
  }));

  return {
    estimatedCost: sortedQuotes[0]?.price || 0,
    recommendedSuppliers: ecoFriendlySuppliers,
    riskAssessment: {
      environmentalRisk: 'LOW',
      carbonImpact: 'MINIMAL',
      confidence: 0.8
    },
    insights: {
      lowestCarbonFootprint: sortedQuotes[0]?.carbonFootprint || 0,
      averageCarbonFootprint: quotesWithCarbon.reduce((sum: number, quote: any) => sum + quote.carbonFootprint, 0) / quotesWithCarbon.length
    }
  };
}

async function optimizeComprehensive(transportRequest: any) {
  const quotes = transportRequest.quotes || [];
  
  // Calculate comprehensive score for each quote
  const quotesWithScores = quotes.map((quote: any) => {
    const priceScore = calculatePriceScore(quote, quotes);
    const speedScore = calculateSpeedScore(quote, quotes);
    const reliabilityScore = quote.supplier.reliabilityScore * 100;
    const carbonScore = 100 - calculateCarbonFootprint(quote, transportRequest);
    
    const comprehensiveScore = 
      (priceScore * 0.3) + 
      (speedScore * 0.25) + 
      (reliabilityScore * 0.3) + 
      (carbonScore * 0.15);
    
    return {
      ...quote,
      priceScore,
      speedScore,
      reliabilityScore,
      carbonScore,
      comprehensiveScore
    };
  });
  
  // Sort by comprehensive score
  const sortedQuotes = quotesWithScores.sort((a: any, b: any) => b.comprehensiveScore - a.comprehensiveScore);
  
  const optimizedSuppliers = sortedQuotes.slice(0, 3).map((quote: any) => ({
    supplierId: quote.supplier.id,
    supplierName: quote.supplier.companyName,
    comprehensiveScore: quote.comprehensiveScore,
    price: quote.price,
    transitTime: quote.transitTime,
    reliability: quote.supplier.reliabilityScore,
    breakdown: {
      priceScore: quote.priceScore,
      speedScore: quote.speedScore,
      reliabilityScore: quote.reliabilityScore,
      carbonScore: quote.carbonScore
    }
  }));

  return {
    estimatedCost: sortedQuotes[0]?.price || 0,
    recommendedSuppliers: optimizedSuppliers,
    riskAssessment: {
      overallRisk: 'LOW',
      balancedChoice: 'OPTIMAL',
      confidence: 0.92
    },
    insights: {
      bestComprehensiveScore: sortedQuotes[0]?.comprehensiveScore || 0,
      optimizationFactors: ['price', 'speed', 'reliability', 'carbon']
    }
  };
}

function calculatePriceScore(quote: any, allQuotes: any[]): number {
  const maxPrice = Math.max(...allQuotes.map(q => q.price));
  const minPrice = Math.min(...allQuotes.map(q => q.price));
  
  if (maxPrice === minPrice) return 100;
  
  return 100 - ((quote.price - minPrice) / (maxPrice - minPrice)) * 100;
}

function calculateSpeedScore(quote: any, allQuotes: any[]): number {
  const maxTime = Math.max(...allQuotes.map(q => q.transitTime));
  const minTime = Math.min(...allQuotes.map(q => q.transitTime));
  
  if (maxTime === minTime) return 100;
  
  return 100 - ((quote.transitTime - minTime) / (maxTime - minTime)) * 100;
}

function calculateCarbonFootprint(quote: any, transportRequest: any): number {
  // Simplified carbon footprint calculation
  const baseEmission = transportRequest.cargoWeight * 0.1; // kg CO2 per kg cargo
  const distanceMultiplier = 1.5; // Simplified distance factor
  const transportTypeMultiplier = getTransportTypeMultiplier(transportRequest.requestType);
  
  return baseEmission * distanceMultiplier * transportTypeMultiplier;
}

function getTransportTypeMultiplier(transportType: string): number {
  switch (transportType) {
    case 'ROAD': return 1.0;
    case 'RAIL': return 0.6;
    case 'SEA': return 0.3;
    case 'AIR': return 2.5;
    default: return 1.0;
  }
}
