
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// GET /api/user-management/users/[userId]/permissions - Get user's effective permissions
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = params;

    // Get user with all permission-related data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                roleMenuPermissions: {
                  include: {
                    menuPermission: {
                      include: {
                        permission: true,
                        parentMenu: true,
                        childMenus: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        permissionOverrides: {
          include: {
            menuPermission: {
              include: {
                permission: true
              }
            },
            permission: true
          }
        },
        userEnhancedRoles: {
          include: {
            enhancedRole: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate effective permissions
    const effectivePermissions = calculateEffectivePermissions(user);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      effectivePermissions,
      rolePermissions: user.userRoles.map(ur => ({
        role: ur.role,
        permissions: ur.role.roleMenuPermissions
      })),
      permissionOverrides: user.permissionOverrides,
      enhancedRoles: user.userEnhancedRoles
    });

  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/user-management/users/[userId]/permissions - Update user permissions
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = params;
    const body = await request.json();
    const { overrides, roleUpdates, reason } = body;

    // Start transaction
    await prisma.$transaction(async (tx) => {
      // Update role assignments if provided
      if (roleUpdates) {
        // Remove existing roles
        await tx.userRole.deleteMany({
          where: { userId }
        });

        // Add new roles
        if (roleUpdates.length > 0) {
          await tx.userRole.createMany({
            data: roleUpdates.map((roleId: string) => ({
              userId,
              roleId,
              assignedBy: session.user.id || 'system'
            }))
          });
        }
      }

      // Handle permission overrides
      if (overrides) {
        // Remove existing overrides
        await tx.userPermissionOverride.deleteMany({
          where: { userId }
        });

        // Add new overrides
        if (overrides.length > 0) {
          await tx.userPermissionOverride.createMany({
            data: overrides.map((override: any) => ({
              userId,
              menuPermissionId: override.menuPermissionId,
              permissionId: override.permissionId,
              overrideType: override.type,
              allowedActions: override.allowedActions || [],
              deniedActions: override.deniedActions || [],
              reason: reason || override.reason,
              expiresAt: override.expiresAt ? new Date(override.expiresAt) : null,
              requiresApproval: override.requiresApproval || false,
              tenantId: session.user.tenantId || '',
              createdBy: session.user.id || 'system'
            }))
          });
        }
      }

      // Log the changes
      await tx.permissionAuditLog.create({
        data: {
          entityType: 'USER',
          entityId: userId,
          action: 'MODIFIED',
          permissionDetails: { overrides, roleUpdates },
          reason,
          tenantId: session.user.tenantId || '',
          performedBy: session.user.id || 'system'
        }
      });
    });

    return NextResponse.json({ 
      message: 'User permissions updated successfully' 
    });

  } catch (error) {
    console.error('Error updating user permissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to calculate effective permissions
function calculateEffectivePermissions(user: any) {
  const effectivePermissions = new Map();

  // Start with role-based permissions
  user.userRoles.forEach((userRole: any) => {
    userRole.role.roleMenuPermissions.forEach((roleMenuPerm: any) => {
      const menuKey = roleMenuPerm.menuPermission.menuKey;
      const actions = roleMenuPerm.allowedActions || [];
      
      if (!effectivePermissions.has(menuKey)) {
        effectivePermissions.set(menuKey, {
          menuPermission: roleMenuPerm.menuPermission,
          allowedActions: new Set(),
          deniedActions: new Set(),
          source: 'role',
          roleName: userRole.role.name
        });
      }
      
      actions.forEach((action: string) => {
        effectivePermissions.get(menuKey).allowedActions.add(action);
      });
    });
  });

  // Apply user-specific overrides
  user.permissionOverrides.forEach((override: any) => {
    if (!override.isEnabled) return;

    const menuKey = override.menuPermission?.menuKey;
    if (!menuKey) return;

    if (!effectivePermissions.has(menuKey)) {
      effectivePermissions.set(menuKey, {
        menuPermission: override.menuPermission,
        allowedActions: new Set(),
        deniedActions: new Set(),
        source: 'override'
      });
    }

    const perm = effectivePermissions.get(menuKey);

    switch (override.overrideType) {
      case 'GRANT_ADDITIONAL':
        (override.allowedActions || []).forEach((action: string) => {
          perm.allowedActions.add(action);
        });
        break;
      case 'REVOKE_EXISTING':
        (override.deniedActions || []).forEach((action: string) => {
          perm.allowedActions.delete(action);
          perm.deniedActions.add(action);
        });
        break;
      case 'MODIFY_EXISTING':
        perm.allowedActions.clear();
        (override.allowedActions || []).forEach((action: string) => {
          perm.allowedActions.add(action);
        });
        break;
    }

    perm.hasOverride = true;
    perm.overrideReason = override.reason;
  });

  // Convert Sets back to arrays for JSON serialization
  const result: any = {};
  effectivePermissions.forEach((value, key) => {
    result[key] = {
      ...value,
      allowedActions: Array.from(value.allowedActions),
      deniedActions: Array.from(value.deniedActions)
    };
  });

  return result;
}
