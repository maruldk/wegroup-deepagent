
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeAnalytics = searchParams.get('includeAnalytics') === 'true';
    const includeMetrics = searchParams.get('includeMetrics') === 'true';
    const sortBy = searchParams.get('sortBy') || 'hierarchyLevel';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const filterLevel = searchParams.get('level');
    const filterCategory = searchParams.get('category');

    // Build where clause
    const where: any = {
      isVisible: true,
      ...(filterLevel && { hierarchyLevel: parseInt(filterLevel) }),
      ...(filterCategory && { category: filterCategory })
    };

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const enhancedRoles = await prisma.enhancedRole.findMany({
      where,
      orderBy,
      include: {
        userEnhancedRoles: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                isActive: true
              }
            }
          }
        },
        inheritFromRole: {
          select: {
            id: true,
            name: true,
            hierarchyLevel: true
          }
        },
        childRoles: {
          select: {
            id: true,
            name: true,
            hierarchyLevel: true
          }
        },
        ...(includeAnalytics && {
          roleTemplateUsages: true
        })
      }
    });

    // Calculate dynamic counts and AI insights
    const enhancedRolesWithCounts = await Promise.all(
      enhancedRoles.map(async (role) => {
        const actualUserCount = role.userEnhancedRoles.filter(ur => ur.isActive).length;
        
        // Update cached counts if different
        if (actualUserCount !== role.userCount) {
          await prisma.enhancedRole.update({
            where: { id: role.id },
            data: { userCount: actualUserCount }
          });
        }

        return {
          ...role,
          userCount: actualUserCount,
          effectiveLevel: role.hierarchyLevel,
          aiInsights: {
            optimizationScore: role.aiRecommendationScore,
            riskLevel: role.aiRiskAssessment,
            securityScore: role.aiSecurityScore,
            usagePattern: role.aiUsagePattern
          }
        };
      })
    );

    const stats = {
      totalRoles: enhancedRoles.length,
      systemRoles: enhancedRoles.filter(r => r.isSystem).length,
      customRoles: enhancedRoles.filter(r => !r.isSystem).length,
      templateRoles: enhancedRoles.filter(r => r.isTemplate).length,
      totalUsers: enhancedRoles.reduce((sum, role) => sum + role.userCount, 0),
      avgHierarchyLevel: enhancedRoles.reduce((sum, role) => sum + role.hierarchyLevel, 0) / enhancedRoles.length,
      highRiskRoles: enhancedRoles.filter(r => (r.aiRiskAssessment || 0) > 0.7).length
    };

    return NextResponse.json({
      success: true,
      roles: enhancedRolesWithCounts,
      stats,
      filters: {
        levels: [...new Set(enhancedRoles.map(r => r.hierarchyLevel))].sort((a, b) => b - a),
        categories: [...new Set(enhancedRoles.map(r => r.category))]
      }
    });

  } catch (error) {
    console.error('Error fetching enhanced roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      category,
      level,
      hierarchyLevel,
      levelColor,
      departmentRestrictions,
      maxUsers,
      isAutoAssignable,
      requiresApproval,
      isTemplate,
      inheritFromRoleId,
      permissions
    } = body;

    // Validate required fields
    if (!name || hierarchyLevel < 5 || hierarchyLevel > 100) {
      return NextResponse.json(
        { error: 'Invalid role data. Name required and hierarchyLevel must be 5-100' },
        { status: 400 }
      );
    }

    // Check for duplicate names
    const existingRole = await prisma.enhancedRole.findFirst({
      where: {
        name,
        tenantId: null // Adjust based on your tenant logic
      }
    });

    if (existingRole) {
      return NextResponse.json(
        { error: 'Role name already exists' },
        { status: 409 }
      );
    }

    // Generate level badge and color based on hierarchy
    const levelBadge = `Level ${hierarchyLevel}`;
    const generatedLevelColor = levelColor || getLevelColor(hierarchyLevel);

    const newRole = await prisma.enhancedRole.create({
      data: {
        name,
        description,
        category: category || 'OPERATIONAL',
        level: level || 'STANDARD',
        hierarchyLevel,
        levelColor: generatedLevelColor,
        levelBadge,
        departmentRestrictions: departmentRestrictions || [],
        maxUsers,
        isAutoAssignable: isAutoAssignable || false,
        requiresApproval: requiresApproval || false,
        isTemplate: isTemplate || false,
        inheritFromRoleId,
        createdBy: session.user.id,
        aiOptimizedPermissions: permissions || [],
        permissionCount: permissions?.length || 0
      },
      include: {
        inheritFromRole: {
          select: {
            id: true,
            name: true,
            hierarchyLevel: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      role: newRole,
      message: 'Role created successfully'
    });

  } catch (error) {
    console.error('Error creating enhanced role:', error);
    return NextResponse.json(
      { error: 'Failed to create role' },
      { status: 500 }
    );
  }
}

// Helper function to determine level color based on hierarchy
function getLevelColor(level: number): string {
  if (level >= 90) return '#DC2626'; // Red - Critical
  if (level >= 75) return '#EA580C'; // Orange - High
  if (level >= 50) return '#2563EB'; // Blue - Standard
  if (level >= 25) return '#16A34A'; // Green - Basic
  return '#6B7280'; // Gray - Entry
}
