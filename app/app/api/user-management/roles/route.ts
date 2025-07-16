
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// GET /api/user-management/roles - Get all available roles
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const roles = await prisma.role.findMany({
      include: {
        roleMenuPermissions: {
          include: {
            menuPermission: true
          }
        },
        userRoles: {
          select: {
            userId: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    // Add user count to each role
    const rolesWithCounts = roles.map(role => ({
      ...role,
      userCount: role.userRoles.length,
      permissionCount: role.roleMenuPermissions.length
    }));

    return NextResponse.json({
      roles: rolesWithCounts
    });

  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/user-management/roles - Create new role
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, permissions = [] } = body;

    if (!name) {
      return NextResponse.json({ error: 'Role name is required' }, { status: 400 });
    }

    // Create role with permissions
    const role = await prisma.$transaction(async (tx) => {
      // Create the role
      const newRole = await tx.role.create({
        data: {
          name,
          description,
          tenantId: session.user.tenantId || ''
        }
      });

      // Add permissions if provided
      if (permissions.length > 0) {
        await tx.roleMenuPermission.createMany({
          data: permissions.map((perm: any) => ({
            roleId: newRole.id,
            menuPermissionId: perm.menuPermissionId,
            allowedActions: perm.allowedActions || [],
            deniedActions: perm.deniedActions || [],
            tenantId: session.user.tenantId || ''
          }))
        });
      }

      return newRole;
    });

    return NextResponse.json({ 
      role,
      message: 'Role created successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating role:', error);
    
    if (error instanceof Error && error.message.includes('name')) {
      return NextResponse.json({ 
        error: 'Role name already exists' 
      }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
