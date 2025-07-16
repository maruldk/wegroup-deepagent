
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      )
    }

    const { tenantId, source, context } = await request.json()

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Mandanten-ID ist erforderlich' },
        { status: 400 }
      )
    }

    // Check if user is super admin
    const isSuperAdmin = session.user.roles?.some(role => role.name === 'super_admin')

    let tenant = null

    if (tenantId === 'all' && isSuperAdmin) {
      // Super admin switching to "all tenants" view
      tenant = {
        id: 'all',
        name: 'Alle Mandanten',
        domain: 'all.wegroup.de',
        subdomain: 'all'
      }
    } else {
      // Regular tenant selection
      tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: {
          id: true,
          name: true,
          domain: true,
          subdomain: true,
          settings: true
        }
      })

      if (!tenant) {
        return NextResponse.json(
          { error: 'Mandant nicht gefunden' },
          { status: 404 }
        )
      }

      // Verify user has access to this tenant
      if (!isSuperAdmin) {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          include: {
            userRoles: {
              include: {
                role: true
              }
            }
          }
        })

        const hasAccess = user?.tenantId === tenantId || 
                         user?.userRoles.some(ur => ur.role.tenantId === tenantId)

        if (!hasAccess) {
          return NextResponse.json(
            { error: 'Kein Zugriff auf diesen Mandanten' },
            { status: 403 }
          )
        }
      }
    }

    // AI-ENHANCED TENANT SWITCHING with analytics and learning
    
    // Update user's current and last used tenant
    if (tenantId !== 'all') {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { 
          tenantId: tenantId,
          lastUsedTenantId: tenantId,
          lastTenantSwitchAt: new Date(),
          tenantSwitchCount: {
            increment: 1
          }
        }
      })
    }

    // Log analytics for AI learning
    await logTenantSwitch(session.user.id, tenantId, source || 'manual', context)

    // Get AI-powered next recommendations after this switch
    const nextRecommendations = await getPostSwitchRecommendations(session.user.id, tenantId)

    return NextResponse.json({
      success: true,
      message: `Erfolgreich zu ${tenant.name} gewechselt`,
      tenant,
      isSuperAdmin,
      analytics: {
        switchSource: source || 'manual',
        context: context || {},
        nextRecommendations
      }
    })

  } catch (error) {
    console.error('Error switching tenant:', error)
    return NextResponse.json(
      { error: 'Fehler beim Mandanten-Wechsel' },
      { status: 500 }
    )
  }
}

async function logTenantSwitch(userId: string, tenantId: string, source: string, context: any) {
  try {
    // Create analytics record
    await prisma.tenantUsageAnalytics.create({
      data: {
        tenantId: tenantId === 'all' ? await getFirstTenantId() : tenantId,
        userId,
        sessionDuration: 0,
        actionsPerformed: 1,
        modulesAccessed: ['TENANT_SWITCH'],
        peakUsageTime: {
          hour: new Date().getHours(),
          dayOfWeek: new Date().getDay(),
          source,
          context
        },
        usageScore: source === 'ai_recommendation' ? 0.8 : 0.5,
        productivityScore: 0.5,
        engagementLevel: 'MEDIUM'
      }
    }).catch(() => {
      // Ignore analytics errors
    })

    // Update recommendation feedback if this was from AI
    if (source === 'ai_recommendation' && context?.recommendationId) {
      await prisma.userTenantRecommendation.updateMany({
        where: {
          userId,
          tenantId,
          id: context.recommendationId
        },
        data: {
          wasAccepted: true,
          lastUsed: new Date()
        }
      }).catch(() => {
        // Ignore feedback errors
      })
    }

  } catch (error) {
    console.error('Error logging tenant switch:', error)
  }
}

async function getPostSwitchRecommendations(userId: string, newTenantId: string) {
  try {
    // Get user's recent usage patterns
    const recentUsage = await prisma.tenantUsageAnalytics.findMany({
      where: {
        userId,
        date: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      include: {
        tenant: true
      },
      orderBy: { date: 'desc' },
      take: 20
    })

    // Get user roles and accessible tenants
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                tenant: true
              }
            }
          }
        }
      }
    })

    // Prepare AI prompt for next recommendations
    const aiPrompt = `
Benutzer hat gerade zu Mandant ${newTenantId} gewechselt.

RECENT USAGE PATTERNS:
${recentUsage.slice(0, 5).map(u => 
  `- ${u.tenant.name}: ${u.sessionDuration}min, Score: ${u.usageScore}`
).join('\n')}

USER ROLES:
${user?.userRoles.map(ur => `- ${ur.role.name} in ${ur.role.tenant?.name || 'Global'}`).join('\n')}

Empfehle 3 wahrscheinlich nützliche nächste Mandanten basierend auf:
1. Typische Arbeitsabläufe nach diesem Mandanten-Wechsel
2. Komplementäre Aufgaben zwischen Mandanten
3. Zeitbasierte Muster

Antworte in JSON Format:
{
  "recommendations": [
    {
      "tenantId": "id",
      "tenantName": "name", 
      "reason": "warum als nächstes sinnvoll",
      "confidence": 0.8,
      "timing": "sofort|in 30min|später heute"
    }
  ]
}
`

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
            content: 'Du bist ein KI-Assistent für intelligente Tenant-Arbeitsabläufe.'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000
      })
    })

    if (aiResponse.ok) {
      const result = await aiResponse.json()
      const recommendations = JSON.parse(result.choices[0].message.content)
      return recommendations.recommendations || []
    }

  } catch (error) {
    console.error('Error getting post-switch recommendations:', error)
  }

  return []
}

async function getFirstTenantId(): Promise<string> {
  const tenant = await prisma.tenant.findFirst({
    where: { isActive: true },
    select: { id: true }
  })
  return tenant?.id || 'unknown'
}
