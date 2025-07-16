
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // 'week', 'month', 'quarter', 'year'
    const analyticsType = searchParams.get('type') || 'overview' // 'overview', 'sales', 'customers', 'forecasting'

    const tenantId = session.user.tenantId || 'default'

    // Calculate date ranges based on period
    const now = new Date()
    let startDate: Date
    let previousPeriodStart: Date

    switch (period) {
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
        previousPeriodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14)
        break
      case 'quarter':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
        previousPeriodStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 - 3, 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        previousPeriodStart = new Date(now.getFullYear() - 1, 0, 1)
        break
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    }

    if (analyticsType === 'overview') {
      // Overview Analytics
      const [
        totalCustomers,
        activeLeads,
        openOpportunities,
        closedWonOpportunities,
        totalRevenue,
        avgDealSize,
        conversionMetrics,
        topCustomers
      ] = await Promise.all([
        // Total customers
        prisma.customer.count({
          where: { tenantId, isActive: true }
        }),
        
        // Active leads
        prisma.lead.count({
          where: { 
            tenantId, 
            status: { in: ['NEW', 'CONTACTED', 'QUALIFIED'] }
          }
        }),
        
        // Open opportunities
        prisma.salesOpportunity.count({
          where: { 
            tenantId, 
            isActive: true,
            stage: { in: ['DISCOVERY', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION'] }
          }
        }),
        
        // Closed won opportunities (current period)
        prisma.salesOpportunity.count({
          where: { 
            tenantId, 
            stage: 'CLOSED_WON',
            actualCloseDate: { gte: startDate }
          }
        }),
        
        // Total revenue (current period)
        prisma.salesOrder.aggregate({
          where: { 
            tenantId,
            orderDate: { gte: startDate }
          },
          _sum: { totalAmount: true }
        }),
        
        // Average deal size
        prisma.salesOpportunity.aggregate({
          where: { 
            tenantId,
            stage: 'CLOSED_WON',
            actualCloseDate: { gte: startDate }
          },
          _avg: { estimatedValue: true }
        }),
        
        // Conversion metrics
        Promise.all([
          prisma.lead.count({
            where: { tenantId, createdAt: { gte: startDate } }
          }),
          prisma.lead.count({
            where: { 
              tenantId, 
              status: 'CONVERTED',
              convertedAt: { gte: startDate }
            }
          }),
          prisma.salesOpportunity.count({
            where: { tenantId, createdAt: { gte: startDate } }
          }),
          prisma.salesOpportunity.count({
            where: { 
              tenantId, 
              stage: 'CLOSED_WON',
              actualCloseDate: { gte: startDate }
            }
          })
        ]),
        
        // Top customers by value
        prisma.customer.findMany({
          where: { tenantId },
          select: {
            id: true,
            companyName: true,
            firstName: true,
            lastName: true,
            totalOrderValue: true,
            customerTier: true,
            aiLifetimeValue: true
          },
          orderBy: { totalOrderValue: 'desc' },
          take: 5
        })
      ])

      const [totalLeads, convertedLeads, totalOpps, closedOpps] = conversionMetrics

      return NextResponse.json({
        period,
        overview: {
          totalCustomers,
          activeLeads,
          openOpportunities,
          closedWonOpportunities,
          totalRevenue: totalRevenue._sum.totalAmount || 0,
          avgDealSize: avgDealSize._avg.estimatedValue || 0,
          leadConversionRate: totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0,
          opportunityWinRate: totalOpps > 0 ? (closedOpps / totalOpps) * 100 : 0
        },
        topCustomers
      })
    }

    if (analyticsType === 'sales') {
      // Sales Performance Analytics
      const salesData = await Promise.all([
        // Sales by stage
        prisma.salesOpportunity.groupBy({
          by: ['stage'],
          where: { tenantId, isActive: true },
          _count: { stage: true },
          _sum: { estimatedValue: true }
        }),
        
        // Monthly sales trend
        prisma.$queryRaw`
          SELECT 
            DATE_TRUNC('month', "actualCloseDate") as month,
            COUNT(*) as deals_count,
            SUM("estimatedValue") as total_value
          FROM "sales_opportunities" 
          WHERE "tenantId" = ${tenantId} 
            AND "stage" = 'CLOSED_WON'
            AND "actualCloseDate" >= ${new Date(now.getFullYear() - 1, now.getMonth(), 1)}
          GROUP BY DATE_TRUNC('month', "actualCloseDate")
          ORDER BY month
        `,
        
        // AI performance insights
        prisma.salesOpportunity.aggregate({
          where: { tenantId, isActive: true },
          _avg: {
            aiCloseProbability: true,
            probability: true
          }
        }),
        
        // Lead source analysis
        prisma.lead.groupBy({
          by: ['leadSource'],
          where: { 
            tenantId,
            createdAt: { gte: startDate }
          },
          _count: { leadSource: true }
        })
      ])

      return NextResponse.json({
        period,
        salesPerformance: {
          opportunitiesByStage: salesData[0],
          salesTrend: salesData[1],
          aiInsights: salesData[2],
          leadSources: salesData[3]
        }
      })
    }

    if (analyticsType === 'forecasting') {
      // Sales Forecasting with AI
      try {
        // Get current pipeline data
        const pipelineData = await prisma.salesOpportunity.findMany({
          where: {
            tenantId,
            isActive: true,
            stage: { in: ['DISCOVERY', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION'] }
          },
          include: {
            customer: {
              select: {
                customerTier: true,
                aiLifetimeValue: true,
                totalOrderValue: true
              }
            }
          }
        })

        // Historical performance data
        const historicalData = await prisma.salesOpportunity.findMany({
          where: {
            tenantId,
            stage: 'CLOSED_WON',
            actualCloseDate: { gte: new Date(now.getFullYear() - 1, now.getMonth(), 1) }
          },
          select: {
            estimatedValue: true,
            actualCloseDate: true,
            aiCloseProbability: true,
            probability: true
          }
        })

        // AI-powered forecasting
        const forecastPrompt = `Analyze sales pipeline and generate forecasts:

CURRENT PIPELINE:
${pipelineData.map(opp => `
- ${opp.opportunityName}: €${opp.estimatedValue || 0} (${opp.stage}, ${opp.aiCloseProbability}% AI probability)
`).join('')}

HISTORICAL PERFORMANCE (Last 12 months):
- Total Deals Closed: ${historicalData.length}
- Average Deal Size: €${historicalData.reduce((sum, deal) => sum + (Number(deal.estimatedValue) || 0), 0) / historicalData.length || 0}
- AI Accuracy: ${historicalData.length > 0 ? historicalData.filter(deal => Math.abs((deal.aiCloseProbability || 0) - 100) < 20).length / historicalData.length * 100 : 0}%

Generate forecasts for next 3 months with confidence levels.`

        const forecastResponse = await fetch('https://apps.abacus.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4.1-mini',
            messages: [
              {
                role: 'system',
                content: 'You are a sales forecasting expert. Analyze pipeline data and generate monthly forecasts. Return JSON with months, predictedRevenue, dealCount, confidenceLevel for each month.'
              },
              {
                role: 'user',
                content: forecastPrompt
              }
            ],
            response_format: { type: "json_object" },
            max_tokens: 1000
          })
        })

        let aiForecast = null
        if (forecastResponse.ok) {
          const forecast = await forecastResponse.json()
          const content = forecast.choices?.[0]?.message?.content
          if (content) {
            aiForecast = JSON.parse(content)
          }
        }

        return NextResponse.json({
          period,
          forecasting: {
            currentPipeline: {
              totalValue: pipelineData.reduce((sum, opp) => sum + (Number(opp.estimatedValue) || 0), 0),
              dealCount: pipelineData.length,
              avgProbability: pipelineData.reduce((sum, opp) => sum + (opp.aiCloseProbability || 0), 0) / pipelineData.length || 0
            },
            historicalPerformance: {
              totalDeals: historicalData.length,
              avgDealSize: historicalData.reduce((sum, deal) => sum + (Number(deal.estimatedValue) || 0), 0) / historicalData.length || 0
            },
            aiForecast: aiForecast || {
              forecast: [
                { month: 'Next Month', predictedRevenue: 0, dealCount: 0, confidenceLevel: 0 }
              ]
            }
          }
        })
      } catch (error) {
        console.error('Forecasting error:', error)
        return NextResponse.json({
          period,
          forecasting: {
            error: 'Forecasting temporarily unavailable',
            currentPipeline: { totalValue: 0, dealCount: 0, avgProbability: 0 },
            historicalPerformance: { totalDeals: 0, avgDealSize: 0 },
            aiForecast: null
          }
        })
      }
    }

    // Default fallback
    return NextResponse.json({ 
      error: 'Invalid analytics type',
      availableTypes: ['overview', 'sales', 'customers', 'forecasting']
    }, { status: 400 })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
