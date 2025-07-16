
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
    const period = url.searchParams.get('period') || '30'; // days

    if (!tenantId || !supplierId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const periodDays = parseInt(period);
    const startDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

    // Get supplier data
    const supplier = await prisma.logisticsSupplier.findUnique({
      where: { id: supplierId, tenantId },
      include: {
        quotes: {
          where: {
            createdAt: { gte: startDate }
          },
          include: {
            request: true,
            orders: true
          }
        },
        bids: {
          where: {
            submittedAt: { gte: startDate }
          },
          include: {
            tender: true
          }
        }
      }
    });

    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    // Calculate performance metrics
    const quotes = supplier.quotes || [];
    const bids = supplier.bids || [];
    
    // Quote Performance
    const quoteMetrics = {
      totalQuotes: quotes.length,
      selectedQuotes: quotes.filter(q => q.selectedForCustomer).length,
      winRate: quotes.length > 0 ? 
        quotes.filter(q => q.selectedForCustomer).length / quotes.length * 100 : 0,
      averageResponseTime: supplier.responseTime,
      averageQuoteValue: quotes.length > 0 ? 
        quotes.reduce((sum, q) => sum + q.price, 0) / quotes.length : 0,
      totalQuoteValue: quotes.reduce((sum, q) => sum + q.price, 0),
      wonQuoteValue: quotes.filter(q => q.selectedForCustomer)
        .reduce((sum, q) => sum + q.price, 0)
    };

    // Bid Performance
    const bidMetrics = {
      totalBids: bids.length,
      winningBids: bids.filter(b => b.status === 'WINNING').length,
      bidWinRate: bids.length > 0 ? 
        bids.filter(b => b.status === 'WINNING').length / bids.length * 100 : 0,
      averageBidValue: bids.length > 0 ? 
        bids.reduce((sum, b) => sum + b.proposedPrice, 0) / bids.length : 0,
      totalBidValue: bids.reduce((sum, b) => sum + b.proposedPrice, 0),
      wonBidValue: bids.filter(b => b.status === 'WINNING')
        .reduce((sum, b) => sum + b.proposedPrice, 0)
    };

    // AI Performance Scores
    const aiScores = {
      reliabilityScore: supplier.reliabilityScore,
      aiPerformanceScore: supplier.aiPerformanceScore,
      averageAiQuoteScore: quotes.length > 0 ? 
        quotes.reduce((sum, q) => sum + (q.aiOverallScore || 0), 0) / quotes.length : 0,
      averageAiBidScore: bids.length > 0 ? 
        bids.reduce((sum, b) => sum + (b.overallScore || 0), 0) / bids.length : 0
    };

    // Time-based performance trends
    const performanceTrends = await calculatePerformanceTrends(supplierId, tenantId, periodDays);

    // Competitive analysis
    const competitiveAnalysis = await calculateCompetitivePosition(supplierId, tenantId, periodDays);

    // Performance recommendations
    const recommendations = generatePerformanceRecommendations(
      quoteMetrics, 
      bidMetrics, 
      aiScores, 
      performanceTrends
    );

    return NextResponse.json({
      success: true,
      supplier: {
        id: supplier.id,
        companyName: supplier.companyName,
        supplierCode: supplier.supplierCode,
        rating: supplier.rating,
        status: supplier.status
      },
      period: {
        days: periodDays,
        startDate,
        endDate: new Date()
      },
      quoteMetrics,
      bidMetrics,
      aiScores,
      performanceTrends,
      competitiveAnalysis,
      recommendations
    });
  } catch (error) {
    console.error('Supplier performance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function calculatePerformanceTrends(supplierId: string, tenantId: string, periodDays: number) {
  const trends = [];
  const daysPerPoint = Math.max(1, Math.floor(periodDays / 10)); // 10 data points max
  
  for (let i = periodDays; i >= 0; i -= daysPerPoint) {
    const endDate = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const startDate = new Date(endDate.getTime() - daysPerPoint * 24 * 60 * 60 * 1000);
    
    const quotes = await prisma.transportQuote.findMany({
      where: {
        supplierId,
        tenantId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    });
    
    const bids = await prisma.supplierBid.findMany({
      where: {
        supplierId,
        tenantId,
        submittedAt: {
          gte: startDate,
          lte: endDate
        }
      }
    });
    
    trends.push({
      date: endDate.toISOString().split('T')[0],
      quotes: quotes.length,
      bids: bids.length,
      selectedQuotes: quotes.filter(q => q.selectedForCustomer).length,
      winningBids: bids.filter(b => b.status === 'WINNING').length,
      averageQuoteScore: quotes.length > 0 ? 
        quotes.reduce((sum, q) => sum + (q.aiOverallScore || 0), 0) / quotes.length : 0,
      averageBidScore: bids.length > 0 ? 
        bids.reduce((sum, b) => sum + (b.overallScore || 0), 0) / bids.length : 0
    });
  }
  
  return trends;
}

async function calculateCompetitivePosition(supplierId: string, tenantId: string, periodDays: number) {
  const startDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);
  
  // Get all suppliers for comparison
  const allSuppliers = await prisma.logisticsSupplier.findMany({
    where: { tenantId },
    include: {
      quotes: {
        where: {
          createdAt: { gte: startDate }
        }
      },
      bids: {
        where: {
          submittedAt: { gte: startDate }
        }
      }
    }
  });
  
  // Calculate rankings
  const supplierStats = allSuppliers.map(supplier => {
    const quotes = supplier.quotes || [];
    const bids = supplier.bids || [];
    
    return {
      id: supplier.id,
      companyName: supplier.companyName,
      rating: supplier.rating,
      reliabilityScore: supplier.reliabilityScore,
      aiPerformanceScore: supplier.aiPerformanceScore,
      quotesCount: quotes.length,
      bidsCount: bids.length,
      quoteWinRate: quotes.length > 0 ? 
        quotes.filter(q => q.selectedForCustomer).length / quotes.length * 100 : 0,
      bidWinRate: bids.length > 0 ? 
        bids.filter(b => b.status === 'WINNING').length / bids.length * 100 : 0,
      averageQuoteScore: quotes.length > 0 ? 
        quotes.reduce((sum, q) => sum + (q.aiOverallScore || 0), 0) / quotes.length : 0
    };
  });
  
  // Find current supplier position
  const currentSupplier = supplierStats.find(s => s.id === supplierId);
  
  // Rankings
  const ratingRank = supplierStats.sort((a, b) => b.rating - a.rating)
    .findIndex(s => s.id === supplierId) + 1;
  
  const quoteWinRateRank = supplierStats.sort((a, b) => b.quoteWinRate - a.quoteWinRate)
    .findIndex(s => s.id === supplierId) + 1;
  
  const aiScoreRank = supplierStats.sort((a, b) => b.averageQuoteScore - a.averageQuoteScore)
    .findIndex(s => s.id === supplierId) + 1;
  
  return {
    totalSuppliers: supplierStats.length,
    rankings: {
      overall: ratingRank,
      quoteWinRate: quoteWinRateRank,
      aiScore: aiScoreRank
    },
    benchmarks: {
      averageRating: supplierStats.reduce((sum, s) => sum + s.rating, 0) / supplierStats.length,
      averageQuoteWinRate: supplierStats.reduce((sum, s) => sum + s.quoteWinRate, 0) / supplierStats.length,
      averageAiScore: supplierStats.reduce((sum, s) => sum + s.averageQuoteScore, 0) / supplierStats.length,
      topPerformer: supplierStats.sort((a, b) => b.rating - a.rating)[0]
    },
    currentSupplier
  };
}

function generatePerformanceRecommendations(quoteMetrics: any, bidMetrics: any, aiScores: any, trends: any) {
  const recommendations = [];
  
  // Quote Win Rate Analysis
  if (quoteMetrics.winRate < 20) {
    recommendations.push({
      type: 'CRITICAL',
      category: 'QUOTE_PERFORMANCE',
      title: 'Improve Quote Win Rate',
      description: `Your quote win rate is ${quoteMetrics.winRate.toFixed(1)}%, which is below industry average. Consider reviewing your pricing strategy and service offerings.`,
      actionItems: [
        'Analyze winning competitor quotes',
        'Optimize pricing strategy',
        'Improve service level offerings',
        'Enhance quote presentation'
      ]
    });
  }
  
  // Response Time Analysis
  if (quoteMetrics.averageResponseTime > 8) {
    recommendations.push({
      type: 'WARNING',
      category: 'RESPONSE_TIME',
      title: 'Reduce Response Time',
      description: `Your average response time is ${quoteMetrics.averageResponseTime.toFixed(1)} hours. Faster responses typically lead to higher win rates.`,
      actionItems: [
        'Set up quote response alerts',
        'Streamline internal approval process',
        'Use automated quote generation tools',
        'Assign dedicated quote response team'
      ]
    });
  }
  
  // AI Score Analysis
  if (aiScores.averageAiQuoteScore < 70) {
    recommendations.push({
      type: 'IMPROVEMENT',
      category: 'AI_OPTIMIZATION',
      title: 'Optimize AI Performance Score',
      description: `Your AI performance score is ${aiScores.averageAiQuoteScore.toFixed(1)}. Improving this score can increase your visibility in AI-driven selections.`,
      actionItems: [
        'Focus on competitive pricing',
        'Improve service reliability metrics',
        'Enhance technical proposal quality',
        'Maintain consistent performance'
      ]
    });
  }
  
  // Trend Analysis
  if (trends.length > 5) {
    const recentTrends = trends.slice(-5);
    const quoteTrend = recentTrends[recentTrends.length - 1].quotes - recentTrends[0].quotes;
    
    if (quoteTrend < 0) {
      recommendations.push({
        type: 'WARNING',
        category: 'MARKET_SHARE',
        title: 'Declining Quote Volume',
        description: 'Your quote volume has been declining. Consider expanding your service offerings or improving your market presence.',
        actionItems: [
          'Review market positioning',
          'Expand service capabilities',
          'Improve customer relationships',
          'Enhance marketing efforts'
        ]
      });
    }
  }
  
  return recommendations;
}
