
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

// POST /api/tenants/ai-recommendations - Get AI recommendations for tenant management
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tenantId, analysisType = 'comprehensive' } = body;

    let tenant: any = null;
    let tenants: any[] = [];

    if (tenantId) {
      // Single tenant analysis
      tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: {
          users: { select: { id: true, isActive: true, lastLoginAt: true } },
          activities: {
            where: {
              performedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            }
          },
          analytics: {
            where: { periodType: 'DAILY' },
            orderBy: { periodStart: 'desc' },
            take: 30
          },
          billingRecords: {
            orderBy: { billingPeriodStart: 'desc' },
            take: 6
          },
          supportTickets: {
            where: { status: { in: ['OPEN', 'IN_PROGRESS'] } }
          }
        }
      });

      if (!tenant) {
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
      }
    } else {
      // Multi-tenant analysis
      tenants = await prisma.tenant.findMany({
        where: { status: 'ACTIVE' },
        include: {
          users: { select: { id: true, isActive: true } },
          activities: {
            where: {
              performedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            }
          },
          analytics: {
            where: { periodType: 'DAILY' },
            orderBy: { periodStart: 'desc' },
            take: 7
          }
        }
      });
    }

    // Prepare data for AI analysis
    const analysisData = tenant ? {
      tenant: {
        id: tenant.id,
        name: tenant.name,
        planType: tenant.planType,
        status: tenant.status,
        createdAt: tenant.createdAt,
        userCount: tenant.users?.length || 0,
        activeUsers: tenant.users?.filter((u: any) => u.isActive)?.length || 0,
        recentActivity: tenant.activities?.length || 0,
        healthScore: tenant.healthScore,
        utilizationRate: tenant.utilizationRate,
        securityScore: tenant.securityScore
      },
      analytics: tenant.analytics?.slice(0, 10),
      supportTickets: tenant.supportTickets?.length || 0,
      billing: tenant.billingRecords?.[0]
    } : {
      tenants: tenants.map(t => ({
        id: t.id,
        name: t.name,
        planType: t.planType,
        status: t.status,
        userCount: t.users?.length || 0,
        activeUsers: t.users?.filter((u: any) => u.isActive)?.length || 0,
        recentActivity: t.activities?.length || 0,
        healthScore: t.healthScore,
        utilizationRate: t.utilizationRate
      }))
    };

    // Call LLM API for AI analysis
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [{
          role: 'user',
          content: `Als Experte für Mandantenmanagement und Business Intelligence, analysiere die folgenden Tenant-Daten und gib strukturierte Empfehlungen:

ANALYSEDATEN:
${JSON.stringify(analysisData, null, 2)}

ANALYSE-TYP: ${analysisType}

Bitte analysiere und gib Empfehlungen in folgendem JSON-Format zurück:

{
  "summary": {
    "overallScore": 0-100,
    "keyInsights": ["Insight 1", "Insight 2"],
    "criticalIssues": ["Issue 1", "Issue 2"]
  },
  "recommendations": [
    {
      "category": "Performance|Security|Cost|Growth|User Experience",
      "priority": "HIGH|MEDIUM|LOW",
      "title": "Kurzer Titel",
      "description": "Detaillierte Beschreibung",
      "impact": "Erwartete Auswirkung",
      "implementation": "Umsetzungsschritte",
      "timeframe": "Zeitrahmen",
      "riskLevel": "LOW|MEDIUM|HIGH"
    }
  ],
  "metrics": {
    "userEngagement": 0-100,
    "systemHealth": 0-100,
    "securityPosture": 0-100,
    "costEfficiency": 0-100,
    "growthPotential": 0-100
  },
  "predictions": {
    "userGrowth": "Prognose für Nutzerwachstum",
    "resourceNeeds": "Ressourcenbedarf",
    "planUpgrade": "Plan-Upgrade Empfehlung"
  },
  "alerts": [
    {
      "type": "WARNING|ERROR|INFO",
      "message": "Alert-Nachricht",
      "action": "Empfohlene Aktion"
    }
  ]
}

Fokus auf deutsche Mandanten-Management-Best-Practices, DSGVO-Compliance und Business-Intelligence.`
        }],
        response_format: { type: "json_object" },
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiStream = response.body;
    if (!aiStream) {
      throw new Error('No response stream from AI API');
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          let buffer = '';
          const reader = aiStream.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  // Parse complete JSON response
                  try {
                    const aiRecommendations = JSON.parse(buffer);
                    
                    // Store recommendations in database for future reference
                    if (tenant) {
                      await prisma.tenantAnalytics.create({
                        data: {
                          tenantId: tenant.id,
                          periodType: 'AI_ANALYSIS',
                          periodStart: new Date(),
                          periodEnd: new Date(),
                          aiRecommendations: aiRecommendations.recommendations || [],
                          aiHealthScore: aiRecommendations.metrics?.systemHealth || tenant.healthScore,
                          aiGrowthPrediction: 0.0, // Will be calculated from predictions
                          aiRiskAssessment: aiRecommendations.summary?.overallScore ? 
                            100 - aiRecommendations.summary.overallScore : 20.0
                        }
                      });
                    }

                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                      type: 'complete',
                      data: aiRecommendations 
                    })}\n\n`));
                    
                  } catch (parseError) {
                    console.error('Error parsing AI response:', parseError);
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                      type: 'error',
                      error: 'Failed to parse AI response' 
                    })}\n\n`));
                  }
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  controller.close();
                  return;
                }
                
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    buffer += parsed.content;
                  }
                } catch (e) {
                  // Skip invalid JSON chunks
                }
              }
            }
          }
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      }
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
