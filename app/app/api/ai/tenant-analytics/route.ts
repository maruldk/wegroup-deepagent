
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '7d' // 1d, 7d, 30d, 90d
    const tenantId = searchParams.get('tenantId')

    // Calculate date range
    const now = new Date()
    const daysBack = timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)

    // Get user's tenant analytics
    const analytics = await prisma.tenantUsageAnalytics.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate
        },
        ...(tenantId && { tenantId })
      },
      include: {
        tenant: true
      },
      orderBy: { date: 'desc' }
    })

    // Prepare AI analysis
    const analyticsData = prepareAnalyticsData(analytics, timeframe)
    const aiPrompt = generateAnalyticsPrompt(analyticsData, session.user)

    // Call AI for pattern analysis
    const aiResponse = await fetch('https://apps.abacus.ai/v1/chat/completions', {
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
            content: `Du bist ein KI-Analyst für Tenant-Nutzungsmuster. Analysiere Benutzerdaten und erkenne Muster, 
            Trends und Optimierungsmöglichkeiten. Gib strukturierte Insights und Empfehlungen.`
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000
      })
    })

    if (!aiResponse.ok) {
      throw new Error('AI analytics service unavailable')
    }

    const aiResult = await aiResponse.json()
    const insights = JSON.parse(aiResult.choices[0].message.content)

    return NextResponse.json({
      success: true,
      timeframe,
      analytics: analyticsData,
      insights: insights,
      metadata: {
        totalSessions: analytics.length,
        dateRange: { start: startDate, end: now },
        tenantsAnalyzed: [...new Set(analytics.map(a => a.tenantId))].length
      }
    })

  } catch (error) {
    console.error('Error getting tenant analytics:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Analytics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const { tenantId, sessionData } = await request.json()

    // Create new analytics record
    await prisma.tenantUsageAnalytics.create({
      data: {
        tenantId,
        userId: session.user.id,
        sessionDuration: sessionData.duration || 0,
        actionsPerformed: sessionData.actions || 0,
        modulesAccessed: sessionData.modules || [],
        peakUsageTime: {
          hour: new Date().getHours(),
          dayOfWeek: new Date().getDay()
        },
        deviceType: sessionData.deviceType || 'unknown',
        location: sessionData.location || null,
        userAgent: sessionData.userAgent || null,
        usageScore: calculateUsageScore(sessionData),
        productivityScore: calculateProductivityScore(sessionData),
        engagementLevel: calculateEngagementLevel(sessionData)
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error creating analytics record:', error)
    return NextResponse.json({ error: 'Fehler beim Speichern der Analytics' }, { status: 500 })
  }
}

function prepareAnalyticsData(analytics: any[], timeframe: string) {
  const groupedByTenant = analytics.reduce((acc, record) => {
    const tenantName = record.tenant.name
    if (!acc[tenantName]) {
      acc[tenantName] = []
    }
    acc[tenantName].push(record)
    return acc
  }, {})

  const summary = Object.entries(groupedByTenant).map(([tenantName, records]) => {
    const typedRecords = records as any[]
    const totalSessions = typedRecords.length
    const totalDuration = typedRecords.reduce((sum, r) => sum + r.sessionDuration, 0)
    const avgUsageScore = typedRecords.reduce((sum, r) => sum + r.usageScore, 0) / totalSessions
    const avgProductivityScore = typedRecords.reduce((sum, r) => sum + r.productivityScore, 0) / totalSessions

    return {
      tenantName,
      totalSessions,
      totalDuration,
      avgSessionDuration: totalDuration / totalSessions,
      avgUsageScore,
      avgProductivityScore,
      engagementDistribution: calculateEngagementDistribution(typedRecords),
      timePattern: calculateTimePattern(typedRecords),
      recentTrend: calculateTrend(typedRecords)
    }
  })

  return {
    timeframe,
    summary,
    totalRecords: analytics.length,
    dateRange: {
      start: analytics[analytics.length - 1]?.date,
      end: analytics[0]?.date
    }
  }
}

function generateAnalyticsPrompt(analyticsData: any, user: any): string {
  return `
Analysiere die Tenant-Nutzungsmuster des Benutzers:

BENUTZER: ${user.firstName} ${user.lastName} (${user.email})
ZEITRAUM: ${analyticsData.timeframe}
GESAMTE SESSIONS: ${analyticsData.totalRecords}

TENANT-ÜBERSICHT:
${analyticsData.summary.map((s: any) => `
- ${s.tenantName}:
  * Sessions: ${s.totalSessions}
  * Gesamtdauer: ${s.totalDuration} Minuten
  * Ø Session-Dauer: ${s.avgSessionDuration.toFixed(1)} Minuten
  * Ø Usage-Score: ${s.avgUsageScore.toFixed(2)}
  * Ø Produktivitäts-Score: ${s.avgProductivityScore.toFixed(2)}
  * Engagement: ${JSON.stringify(s.engagementDistribution)}
  * Zeitumuster: ${JSON.stringify(s.timePattern)}
  * Trend: ${s.recentTrend}
`).join('\n')}

ANALYSIERE:
1. Produktivitätsmuster (wann und wo ist User am produktivsten?)
2. Zeitliche Präferenzen (bevorzugte Arbeitszeiten pro Tenant)
3. Engagement-Trends (welche Tenants sind am engaging?)
4. Optimierungspotential (wo kann User effizienter arbeiten?)
5. Anomalien oder ungewöhnliche Muster

Antworte in diesem JSON Format:
{
  "productivityInsights": {
    "mostProductiveTenant": "tenant-name",
    "bestWorkingHours": "zeitraum",
    "productivityTrend": "INCREASING|STABLE|DECREASING",
    "recommendedFocus": "empfehlung"
  },
  "usagePatterns": {
    "primaryWorkflow": "hauptarbeitsfluss",
    "timePreferences": ["morgend", "nachmittag"],
    "engagementPattern": "muster",
    "switchingBehavior": "wechselverhalten"
  },
  "optimizationSuggestions": [
    {
      "area": "bereich",
      "suggestion": "vorschlag",
      "expectedImpact": "erwartete-auswirkung",
      "priority": "HIGH|MEDIUM|LOW"
    }
  ],
  "anomalies": [
    {
      "type": "anomalie-typ",
      "description": "beschreibung",
      "impact": "auswirkung"
    }
  ],
  "futureRecommendations": [
    {
      "timeframe": "zeitraum",
      "recommendation": "empfehlung",
      "reasoning": "begründung"
    }
  ]
}
`
}

function calculateUsageScore(sessionData: any): number {
  const baseScore = Math.min(sessionData.duration / 60, 1) // Normalize duration to 1 hour max
  const actionScore = Math.min(sessionData.actions / 50, 1) // Normalize actions to 50 max
  return (baseScore + actionScore) / 2
}

function calculateProductivityScore(sessionData: any): number {
  if (!sessionData.duration || sessionData.duration === 0) return 0
  const actionsPerMinute = sessionData.actions / sessionData.duration
  return Math.min(actionsPerMinute / 2, 1) // Normalize to 2 actions per minute max
}

function calculateEngagementLevel(sessionData: any): 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH' {
  const score = calculateUsageScore(sessionData)
  if (score >= 0.8) return 'VERY_HIGH'
  if (score >= 0.6) return 'HIGH'
  if (score >= 0.3) return 'MEDIUM'
  return 'LOW'
}

function calculateEngagementDistribution(records: any[]) {
  const distribution = { LOW: 0, MEDIUM: 0, HIGH: 0, VERY_HIGH: 0 }
  records.forEach(r => {
    const level = r.engagementLevel as keyof typeof distribution
    if (level && distribution.hasOwnProperty(level)) {
      distribution[level]++
    }
  })
  return distribution
}

function calculateTimePattern(records: any[]) {
  const hourPattern = new Array(24).fill(0)
  records.forEach(r => {
    if (r.peakUsageTime?.hour !== undefined) {
      hourPattern[r.peakUsageTime.hour]++
    }
  })
  return hourPattern
}

function calculateTrend(records: any[]): string {
  if (records.length < 3) return 'INSUFFICIENT_DATA'
  
  const recent = records.slice(0, Math.floor(records.length / 3))
  const older = records.slice(-Math.floor(records.length / 3))
  
  const recentAvg = recent.reduce((sum, r) => sum + r.usageScore, 0) / recent.length
  const olderAvg = older.reduce((sum, r) => sum + r.usageScore, 0) / older.length
  
  const change = (recentAvg - olderAvg) / olderAvg
  
  if (change > 0.1) return 'INCREASING'
  if (change < -0.1) return 'DECREASING'
  return 'STABLE'
}
