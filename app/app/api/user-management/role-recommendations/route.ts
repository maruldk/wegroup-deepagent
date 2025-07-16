
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      analysisType, 
      targetRoleId, 
      targetUserId, 
      userProfile,
      organizationContext 
    } = body;

    let aiPrompt = '';
    let analysisData = {};

    switch (analysisType) {
      case 'ROLE_OPTIMIZATION':
        aiPrompt = await buildRoleOptimizationPrompt(targetRoleId);
        analysisData = await getRoleAnalysisData(targetRoleId);
        break;
      
      case 'USER_ROLE_RECOMMENDATION':
        aiPrompt = await buildUserRoleRecommendationPrompt(targetUserId, userProfile);
        analysisData = await getUserAnalysisData(targetUserId);
        break;
      
      case 'PERMISSION_ANALYSIS':
        aiPrompt = await buildPermissionAnalysisPrompt(targetRoleId);
        analysisData = await getPermissionAnalysisData(targetRoleId);
        break;
      
      case 'SECURITY_ASSESSMENT':
        aiPrompt = await buildSecurityAssessmentPrompt(targetRoleId);
        analysisData = await getSecurityAnalysisData(targetRoleId);
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid analysis type' }, { status: 400 });
    }

    // Call AI API for recommendations
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
            content: `You are an expert AI system for role management and permission optimization. 
            Provide detailed, actionable recommendations for role management based on the analysis data provided.
            Respond in JSON format with the following structure:
            {
              "recommendations": [
                {
                  "type": "OPTIMIZATION|SECURITY|COMPLIANCE|ASSIGNMENT",
                  "priority": "HIGH|MEDIUM|LOW",
                  "title": "Short title",
                  "description": "Detailed explanation",
                  "actionItems": ["action1", "action2"],
                  "riskLevel": 0.0-1.0,
                  "impactScore": 0.0-1.0,
                  "confidenceScore": 0.0-1.0
                }
              ],
              "overallAssessment": {
                "securityScore": 0.0-1.0,
                "optimizationScore": 0.0-1.0,
                "complianceScore": 0.0-1.0,
                "summary": "Overall assessment summary"
              },
              "metrics": {
                "analyzedPermissions": number,
                "riskFactorsFound": number,
                "optimizationOpportunities": number
              }
            }`
          },
          {
            role: 'user',
            content: `${aiPrompt}\n\nAnalysis Data: ${JSON.stringify(analysisData, null, 2)}`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 3000,
        temperature: 0.3
      })
    });

    if (!aiResponse.ok) {
      console.error('AI API Error:', await aiResponse.text());
      return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 });
    }

    const aiResult = await aiResponse.json();
    const recommendations = JSON.parse(aiResult.choices[0].message.content);

    // Store recommendations in database
    const storedRecommendations = await Promise.all(
      recommendations.recommendations.map(async (rec: any) => {
        return await prisma.permissionRecommendation.create({
          data: {
            targetRoleId,
            targetUserId,
            recommendationType: rec.type,
            aiJustification: rec.description,
            aiConfidenceScore: rec.confidenceScore || 0.0,
            securityRiskScore: rec.riskLevel || 0.0,
            businessImpactScore: rec.impactScore || 0.0,
            aiModelVersion: 'gpt-4.1-mini',
            aiDataSources: [analysisType],
            recommendedActions: rec.actionItems || [],
            tenantId: 'default' // Adjust based on your tenant logic
          }
        });
      })
    );

    return NextResponse.json({
      success: true,
      analysisType,
      recommendations: recommendations.recommendations,
      overallAssessment: recommendations.overallAssessment,
      metrics: recommendations.metrics,
      storedRecommendationIds: storedRecommendations.map(r => r.id)
    });

  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetRoleId = searchParams.get('roleId');
    const targetUserId = searchParams.get('userId');
    const status = searchParams.get('status') || 'PENDING';
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {
      status: status as any,
      ...(targetRoleId && { targetRoleId }),
      ...(targetUserId && { targetUserId })
    };

    const recommendations = await prisma.permissionRecommendation.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      include: {
        targetRole: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        targetUser: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      recommendations
    });

  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

// Helper functions for building AI prompts
async function buildRoleOptimizationPrompt(roleId: string): Promise<string> {
  return `Analyze the role with ID ${roleId} for optimization opportunities. 
  Focus on permission efficiency, user assignment patterns, and security implications.
  Identify redundant permissions, unused access rights, and potential security risks.`;
}

async function buildUserRoleRecommendationPrompt(userId: string, userProfile: any): Promise<string> {
  return `Recommend the most suitable roles for user ${userId} based on their profile:
  Department: ${userProfile?.department || 'Unknown'}
  Position: ${userProfile?.position || 'Unknown'}
  Experience Level: ${userProfile?.experienceLevel || 'Unknown'}
  Current Responsibilities: ${userProfile?.responsibilities || 'Unknown'}
  
  Consider role hierarchy, permission requirements, and organizational best practices.`;
}

async function buildPermissionAnalysisPrompt(roleId: string): Promise<string> {
  return `Analyze the permission structure for role ${roleId}.
  Evaluate permission granularity, inheritance patterns, and potential conflicts.
  Suggest improvements for permission organization and security.`;
}

async function buildSecurityAssessmentPrompt(roleId: string): Promise<string> {
  return `Conduct a comprehensive security assessment for role ${roleId}.
  Identify potential security vulnerabilities, excessive privileges, and compliance issues.
  Provide recommendations for strengthening role-based security.`;
}

// Helper functions for gathering analysis data
async function getRoleAnalysisData(roleId: string) {
  const role = await prisma.enhancedRole.findUnique({
    where: { id: roleId },
    include: {
      userEnhancedRoles: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              lastLoginAt: true,
              employee: {
                select: {
                  department: true,
                  position: true
                }
              }
            }
          }
        }
      }
    }
  });

  return {
    role,
    userCount: role?.userEnhancedRoles.length || 0,
    activeUsers: role?.userEnhancedRoles.filter(ur => ur.isActive).length || 0,
    departments: [...new Set(role?.userEnhancedRoles.map(ur => ur.user.employee?.department).filter(Boolean))],
    lastActivity: role?.userEnhancedRoles.reduce((latest, ur) => {
      const lastLogin = ur.user.lastLoginAt;
      return lastLogin && (!latest || lastLogin > latest) ? lastLogin : latest;
    }, null as Date | null)
  };
}

async function getUserAnalysisData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      employee: true,
      userEnhancedRoles: {
        include: {
          enhancedRole: {
            select: {
              id: true,
              name: true,
              hierarchyLevel: true,
              category: true
            }
          }
        }
      }
    }
  });

  return {
    user,
    currentRoles: user?.userEnhancedRoles?.map(ur => ur.enhancedRole) || [],
    department: user?.employee?.department,
    position: user?.employee?.position,
    lastLogin: user?.lastLoginAt
  };
}

async function getPermissionAnalysisData(roleId: string) {
  // This would gather comprehensive permission data for analysis
  return {
    roleId,
    timestamp: new Date().toISOString()
  };
}

async function getSecurityAnalysisData(roleId: string) {
  // This would gather security-related data for analysis
  return {
    roleId,
    timestamp: new Date().toISOString()
  };
}
