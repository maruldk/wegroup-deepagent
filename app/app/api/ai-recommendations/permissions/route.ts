
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// GET /api/ai-recommendations/permissions - Get AI permission recommendations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const roleId = searchParams.get('roleId');
    const type = searchParams.get('type') || 'all';

    let where: any = {};
    
    if (userId) where.targetUserId = userId;
    if (roleId) where.targetRoleId = roleId;
    if (type !== 'all') where.recommendationType = type;

    const recommendations = await prisma.permissionRecommendation.findMany({
      where,
      include: {
        targetUser: true,
        targetRole: true,
        menuPermission: {
          include: {
            permission: true
          }
        }
      },
      orderBy: [
        { aiConfidenceScore: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({ recommendations });

  } catch (error) {
    console.error('Error fetching AI recommendations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/ai-recommendations/permissions/generate - Generate AI recommendations
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { targetUserId, targetRoleId, analysisType = 'comprehensive' } = body;

    // Get user or role data for analysis
    let analysisData: any = {};
    
    if (targetUserId) {
      analysisData = await prisma.user.findUnique({
        where: { id: targetUserId },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  roleMenuPermissions: {
                    include: {
                      menuPermission: true
                    }
                  }
                }
              }
            }
          },
          permissionOverrides: {
            include: {
              menuPermission: true
            }
          },
          employee: true
        }
      });
    } else if (targetRoleId) {
      analysisData = await prisma.role.findUnique({
        where: { id: targetRoleId },
        include: {
          roleMenuPermissions: {
            include: {
              menuPermission: true
            }
          },
          userRoles: {
            include: {
              user: {
                include: {
                  employee: true
                }
              }
            }
          }
        }
      });
    }

    if (!analysisData) {
      return NextResponse.json({ error: 'Target not found' }, { status: 404 });
    }

    // Generate AI recommendations using LLM
    const recommendations = await generateAIRecommendations(analysisData, {
      targetUserId,
      targetRoleId,
      analysisType,
      sessionUserId: session.user.id,
      tenantId: session.user.tenantId
    });

    return NextResponse.json({ 
      recommendations,
      analysisType,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// AI Recommendation Generation Function
async function generateAIRecommendations(analysisData: any, context: any) {
  try {
    // Prepare data for AI analysis
    const prompt = buildAnalysisPrompt(analysisData, context);
    
    // Call LLM API for intelligent analysis
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
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
            content: `You are an expert enterprise security and permission management AI. Analyze user/role permission data and provide intelligent recommendations for optimal security, compliance, and efficiency.

Your analysis should focus on:
1. Security risk assessment 
2. Principle of least privilege compliance
3. Role optimization opportunities
4. Anomaly detection in permission patterns
5. Business efficiency improvements

Provide recommendations in JSON format with confidence scores, risk assessments, and detailed justifications.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const aiResult = await response.json();
    const aiRecommendations = JSON.parse(aiResult.choices[0].message.content);

    // Process and store recommendations
    const storedRecommendations = [];
    
    for (const rec of aiRecommendations.recommendations || []) {
      const recommendation = await prisma.permissionRecommendation.create({
        data: {
          targetUserId: context.targetUserId,
          targetRoleId: context.targetRoleId,
          recommendationType: rec.type || 'SECURITY_REVIEW',
          menuPermissionId: rec.menuPermissionId,
          permissionId: rec.permissionId,
          recommendedActions: rec.actions || [],
          aiConfidenceScore: rec.confidenceScore || 0.8,
          aiJustification: rec.justification || '',
          aiModelVersion: 'gpt-4.1-mini',
          aiDataSources: rec.dataSources || [],
          securityRiskScore: rec.securityRisk || 0.0,
          complianceScore: rec.complianceScore || 0.0,
          businessImpactScore: rec.businessImpact || 0.0,
          tenantId: context.tenantId
        }
      });
      
      storedRecommendations.push(recommendation);
    }

    return {
      aiAnalysis: aiRecommendations,
      storedRecommendations,
      summary: {
        totalRecommendations: storedRecommendations.length,
        highPriorityCount: storedRecommendations.filter(r => (r.securityRiskScore || 0) > 0.7).length,
        averageConfidence: storedRecommendations.length > 0 
          ? storedRecommendations.reduce((sum, r) => sum + r.aiConfidenceScore, 0) / storedRecommendations.length 
          : 0
      }
    };

  } catch (error) {
    console.error('Error in AI recommendation generation:', error);
    throw error;
  }
}

function buildAnalysisPrompt(analysisData: any, context: any): string {
  const userInfo = context.targetUserId ? `
    User Analysis for: ${analysisData.email}
    Name: ${analysisData.firstName} ${analysisData.lastName}
    Department: ${analysisData.employee?.department || 'Unknown'}
    Position: ${analysisData.employee?.position || 'Unknown'}
    Current Roles: ${analysisData.userRoles?.map((ur: any) => ur.role.name).join(', ') || 'None'}
    Permission Overrides: ${analysisData.permissionOverrides?.length || 0}
    Account Status: ${analysisData.isActive ? 'Active' : 'Inactive'}
    Last Login: ${analysisData.lastLoginAt || 'Never'}
  ` : `
    Role Analysis for: ${analysisData.name}
    Description: ${analysisData.description || 'No description'}
    Assigned Users: ${analysisData.userRoles?.length || 0}
    Permission Count: ${analysisData.roleMenuPermissions?.length || 0}
  `;

  return `
    Analyze the following enterprise permission data and provide intelligent recommendations:

    ${userInfo}

    Analysis Type: ${context.analysisType}
    
    Current Permission Structure:
    ${JSON.stringify(analysisData, null, 2)}

    Please provide recommendations in the following JSON format:
    {
      "recommendations": [
        {
          "type": "GRANT_PERMISSION|REVOKE_PERMISSION|MODIFY_ROLE|SECURITY_REVIEW|COMPLIANCE_UPDATE|ANOMALY_DETECTION",
          "menuPermissionId": "string|null",
          "permissionId": "string|null", 
          "actions": ["read", "write", "delete", "admin"],
          "justification": "Detailed reasoning for this recommendation",
          "confidenceScore": 0.95,
          "securityRisk": 0.3,
          "complianceScore": 0.9,
          "businessImpact": 0.7,
          "priority": "HIGH|MEDIUM|LOW",
          "dataSources": ["role_analysis", "usage_patterns", "security_audit"]
        }
      ],
      "overallRiskAssessment": "Summary of security risks",
      "complianceStatus": "GDPR, SOX, HIPAA compliance assessment",
      "optimizationOpportunities": "Efficiency improvements",
      "anomaliesDetected": "Unusual permission patterns found"
    }

    Focus on actionable, specific recommendations that improve security while maintaining business efficiency.
  `;
}
