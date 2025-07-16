
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roleId } = params;

    const role = await prisma.enhancedRole.findUnique({
      where: { id: roleId },
      include: {
        userEnhancedRoles: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                isActive: true,
                lastLoginAt: true
              }
            }
          }
        },
        inheritFromRole: {
          select: {
            id: true,
            name: true,
            hierarchyLevel: true,
            category: true
          }
        },
        childRoles: {
          select: {
            id: true,
            name: true,
            hierarchyLevel: true,
            userCount: true
          }
        },
        roleTemplateUsages: {
          include: {
            templateRole: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Calculate additional metrics
    const activeUsers = role.userEnhancedRoles.filter(ur => ur.isActive && ur.user.isActive);
    const inheritanceChain = await getInheritanceChain(roleId);
    const effectivePermissions = await calculateEffectivePermissions(roleId);

    const enhancedRole = {
      ...role,
      metrics: {
        activeUserCount: activeUsers.length,
        totalAssignments: role.userEnhancedRoles.length,
        inheritanceDepth: inheritanceChain.length,
        effectivePermissionCount: effectivePermissions.length,
        lastActivity: activeUsers.reduce((latest, ur) => {
          const lastLogin = ur.user.lastLoginAt;
          return lastLogin && (!latest || lastLogin > latest) ? lastLogin : latest;
        }, null as Date | null)
      },
      inheritanceChain,
      effectivePermissions: effectivePermissions.slice(0, 20), // Limit for performance
      aiRecommendations: await generateAIRecommendations(roleId)
    };

    return NextResponse.json({
      success: true,
      role: enhancedRole
    });

  } catch (error) {
    console.error('Error fetching enhanced role:', error);
    return NextResponse.json(
      { error: 'Failed to fetch role' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roleId } = params;
    const body = await request.json();

    // Check if role exists and is not a system role (prevent modification)
    const existingRole = await prisma.enhancedRole.findUnique({
      where: { id: roleId }
    });

    if (!existingRole) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    if (existingRole.isSystem) {
      return NextResponse.json(
        { error: 'Cannot modify system roles' },
        { status: 403 }
      );
    }

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
      isActive,
      isVisible,
      complianceLevel,
      permissions
    } = body;

    // Validate hierarchy level if provided
    if (hierarchyLevel && (hierarchyLevel < 5 || hierarchyLevel > 100)) {
      return NextResponse.json(
        { error: 'Hierarchy level must be between 5 and 100' },
        { status: 400 }
      );
    }

    // Check for name conflicts if name is being changed
    if (name && name !== existingRole.name) {
      const nameConflict = await prisma.enhancedRole.findFirst({
        where: {
          name,
          tenantId: existingRole.tenantId,
          id: { not: roleId }
        }
      });

      if (nameConflict) {
        return NextResponse.json(
          { error: 'Role name already exists' },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (level !== undefined) updateData.level = level;
    if (hierarchyLevel !== undefined) {
      updateData.hierarchyLevel = hierarchyLevel;
      updateData.levelBadge = `Level ${hierarchyLevel}`;
      updateData.levelColor = levelColor || getLevelColor(hierarchyLevel);
    }
    if (departmentRestrictions !== undefined) updateData.departmentRestrictions = departmentRestrictions;
    if (maxUsers !== undefined) updateData.maxUsers = maxUsers;
    if (isAutoAssignable !== undefined) updateData.isAutoAssignable = isAutoAssignable;
    if (requiresApproval !== undefined) updateData.requiresApproval = requiresApproval;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isVisible !== undefined) updateData.isVisible = isVisible;
    if (complianceLevel !== undefined) updateData.complianceLevel = complianceLevel;
    if (permissions !== undefined) {
      updateData.aiOptimizedPermissions = permissions;
      updateData.permissionCount = permissions.length;
    }

    updateData.updatedAt = new Date();

    const updatedRole = await prisma.enhancedRole.update({
      where: { id: roleId },
      data: updateData,
      include: {
        userEnhancedRoles: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
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
        }
      }
    });

    // Log the change for audit
    await logRoleChange(roleId, session.user.id, 'UPDATED', updateData);

    return NextResponse.json({
      success: true,
      role: updatedRole,
      message: 'Role updated successfully'
    });

  } catch (error) {
    console.error('Error updating enhanced role:', error);
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roleId } = params;

    // Check if role exists
    const role = await prisma.enhancedRole.findUnique({
      where: { id: roleId },
      include: {
        userEnhancedRoles: true,
        childRoles: true
      }
    });

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    if (role.isSystem) {
      return NextResponse.json(
        { error: 'Cannot delete system roles' },
        { status: 403 }
      );
    }

    // Check for active assignments
    const activeAssignments = role.userEnhancedRoles.filter(ur => ur.isActive);
    if (activeAssignments.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete role with active user assignments',
          activeAssignments: activeAssignments.length
        },
        { status: 409 }
      );
    }

    // Check for child roles
    if (role.childRoles.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete role with child roles. Remove inheritance first.',
          childRoles: role.childRoles.length
        },
        { status: 409 }
      );
    }

    // Soft delete instead of hard delete for audit purposes
    await prisma.enhancedRole.update({
      where: { id: roleId },
      data: {
        isActive: false,
        isVisible: false,
        name: `${role.name}_DELETED_${Date.now()}`
      }
    });

    // Log the deletion
    await logRoleChange(roleId, session.user.id, 'DELETED', { deletedAt: new Date() });

    return NextResponse.json({
      success: true,
      message: 'Role deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting enhanced role:', error);
    return NextResponse.json(
      { error: 'Failed to delete role' },
      { status: 500 }
    );
  }
}

// Helper functions
async function getInheritanceChain(roleId: string): Promise<any[]> {
  const chain: any[] = [];
  let currentRoleId: string | null = roleId;
  
  while (currentRoleId) {
    const role: any = await prisma.enhancedRole.findUnique({
      where: { id: currentRoleId },
      select: {
        id: true,
        name: true,
        hierarchyLevel: true,
        inheritFromRoleId: true
      }
    });
    
    if (!role) break;
    chain.push(role);
    currentRoleId = role.inheritFromRoleId;
  }
  
  return chain;
}

async function calculateEffectivePermissions(roleId: string): Promise<any[]> {
  // This would implement the actual permission inheritance logic
  // For now, return a placeholder
  return [];
}

async function generateAIRecommendations(roleId: string): Promise<any[]> {
  // This would call the AI API for role-specific recommendations
  // For now, return placeholder data
  return [
    {
      type: 'OPTIMIZATION',
      message: 'Consider reducing unused permissions',
      confidence: 0.85
    },
    {
      type: 'SECURITY',
      message: 'Review high-privilege access patterns',
      confidence: 0.72
    }
  ];
}

async function logRoleChange(roleId: string, userId: string, action: string, changes: any) {
  try {
    await prisma.permissionAuditLog.create({
      data: {
        entityType: 'ROLE',
        entityId: roleId,
        action: action as any,
        permissionDetails: changes,
        performedBy: userId,
        tenantId: 'default' // Adjust based on your tenant logic
      }
    });
  } catch (error) {
    console.error('Error logging role change:', error);
  }
}

function getLevelColor(level: number): string {
  if (level >= 90) return '#DC2626'; // Red - Critical
  if (level >= 75) return '#EA580C'; // Orange - High
  if (level >= 50) return '#2563EB'; // Blue - Standard
  if (level >= 25) return '#16A34A'; // Green - Basic
  return '#6B7280'; // Gray - Entry
}
