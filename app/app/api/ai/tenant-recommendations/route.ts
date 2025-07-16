
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

    // Get user's tenant access and usage patterns
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        tenant: true,
        lastUsedTenant: true,
        userRoles: {
          include: {
            role: {
              include: {
                tenant: true
              }
            }
          }
        },
        tenantUsageAnalytics: {
          take: 50,
          orderBy: { date: 'desc' },
          include: {
            tenant: true
          }
        },
        tenantRecommendations: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
            }
          },
          include: {
            tenant: true
          },
          orderBy: { score: 'desc' }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      )
    }

    // Prepare AI analysis request
    const aiPrompt = generateTenantRecommendationPrompt(user)
    
    // Call AI API for intelligent recommendations
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
            content: `Du bist ein KI-Assistent für intelligente Tenant-Empfehlungen in einem Multi-Tenant-System. 
            Analysiere Benutzerverhalten, Rollen, Nutzungsmuster und zeitliche Präferenzen um optimale Tenant-Empfehlungen zu geben.
            Antworte in JSON Format mit strukturierten Empfehlungen.`
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
      throw new Error('AI recommendation service unavailable')
    }

    const aiResult = await aiResponse.json()
    const recommendations = JSON.parse(aiResult.choices[0].message.content)

    // Store AI recommendations in database for learning
    await storeRecommendations(user.id, recommendations)

    // Return enriched recommendations
    return NextResponse.json({
      success: true,
      recommendations: recommendations.tenantRecommendations || [],
      insights: recommendations.insights || {},
      userContext: {
        tenant: user.tenant?.name || 'Kein Mandant',
        lastUsedTenant: user.lastUsedTenant?.name || 'Keiner',
        totalTenants: user.userRoles.length,
        isSuperAdmin: user.userRoles.some(ur => ur.role.name === 'super_admin')
      }
    })

  } catch (error) {
    console.error('Error getting tenant recommendations:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Empfehlungen' },
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

    const { tenantId, feedback, wasUseful } = await request.json()

    // Update recommendation feedback for AI learning
    await prisma.userTenantRecommendation.updateMany({
      where: {
        userId: session.user.id,
        tenantId: tenantId
      },
      data: {
        wasAccepted: feedback === 'accepted',
        wasUseful: wasUseful,
        lastUsed: feedback === 'accepted' ? new Date() : undefined
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error updating recommendation feedback:', error)
    return NextResponse.json({ error: 'Fehler beim Speichern des Feedbacks' }, { status: 500 })
  }
}

function generateTenantRecommendationPrompt(user: any): string {
  const currentTime = new Date()
  const hour = currentTime.getHours()
  const dayOfWeek = currentTime.getDay()
  
  return `
Analysiere folgende Benutzerinformationen für intelligente Tenant-Empfehlungen:

BENUTZER-KONTEXT:
- Benutzer ID: ${user.id}
- Name: ${user.firstName} ${user.lastName}
- E-Mail: ${user.email}
- Aktueller Mandant: ${user.tenant?.name || 'Keiner'}
- Letzter genutzter Mandant: ${user.lastUsedTenant?.name || 'Keiner'}
- Aktuelle Zeit: ${hour}:00 Uhr, ${getDayName(dayOfWeek)}

ROLLEN UND BERECHTIGUNGEN:
${user.userRoles.map((ur: any) => `- ${ur.role.name} in ${ur.role.tenant?.name || 'Global'}`).join('\n')}

NUTZUNGSMUSTER (letzte 50 Sessions):
${user.tenantUsageAnalytics.slice(0, 10).map((ua: any) => 
  `- ${ua.tenant.name}: ${ua.sessionDuration}min, Score: ${ua.usageScore}, Level: ${ua.engagementLevel}`
).join('\n')}

BISHERIGE EMPFEHLUNGEN:
${user.tenantRecommendations.map((tr: any) => 
  `- ${tr.tenant.name}: Score ${tr.score}, Grund: ${tr.reason}, Akzeptiert: ${tr.wasAccepted}`
).join('\n')}

ANALYSIERE:
1. Zeitbasierte Muster (arbeitet User eher morgens mit bestimmten Mandanten?)
2. Rollenbasierte Präferenzen (welche Mandanten passen zur aktuellen Rolle?)
3. Produktivitätsmuster (wo ist User am produktivsten?)
4. Kollaborationsmuster (mit welchen Teams arbeitet User zusammen?)

Antworte in diesem JSON Format:
{
  "tenantRecommendations": [
    {
      "tenantId": "tenant-id",
      "tenantName": "Mandanten Name",
      "score": 0.85,
      "reason": "Begründung der Empfehlung",
      "type": "USAGE_BASED|ROLE_BASED|TIME_BASED|COLLABORATIVE",
      "context": "Zusätzlicher Kontext",
      "priority": "HIGH|MEDIUM|LOW"
    }
  ],
  "insights": {
    "primaryWorkPattern": "Haupt-Arbeitsmuster",
    "peakProductivityTime": "Beste Arbeitszeit",
    "preferredTenants": ["liste", "bevorzugter", "mandanten"],
    "improvementSuggestions": ["verbesserungsvorschläge"]
  }
}
`
}

function getDayName(day: number): string {
  const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
  return days[day]
}

async function storeRecommendations(userId: string, recommendations: any) {
  try {
    const tenantRecs = recommendations.tenantRecommendations || []
    
    for (const rec of tenantRecs) {
      await prisma.userTenantRecommendation.upsert({
        where: {
          userId_tenantId_recommendationType: {
            userId,
            tenantId: rec.tenantId,
            recommendationType: rec.type || 'AI_SUGGESTED'
          }
        },
        update: {
          score: rec.score,
          reason: rec.reason,
          context: {
            priority: rec.priority,
            additionalContext: rec.context,
            generatedAt: new Date().toISOString()
          },
          modelVersion: 'ai-rec-v1.0',
          confidenceLevel: rec.score
        },
        create: {
          userId,
          tenantId: rec.tenantId,
          recommendationType: rec.type || 'AI_SUGGESTED',
          score: rec.score,
          reason: rec.reason,
          context: {
            priority: rec.priority,
            additionalContext: rec.context,
            generatedAt: new Date().toISOString()
          },
          modelVersion: 'ai-rec-v1.0',
          confidenceLevel: rec.score
        }
      })
    }
  } catch (error) {
    console.error('Error storing recommendations:', error)
  }
}
