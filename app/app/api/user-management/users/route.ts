
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// GET /api/user-management/users - Get all users with enhanced permissions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const roleFilter = searchParams.get('role') || '';
    const statusFilter = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (statusFilter) {
      where.isActive = statusFilter === 'active';
    }

    // Get users with their roles and permissions
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
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
              menuPermission: true,
              permission: true
            }
          },
          userEnhancedRoles: {
            include: {
              enhancedRole: true
            }
          },
          employee: true
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/user-management/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      email, 
      firstName, 
      lastName, 
      roleIds = [], 
      departmentRestrictions = [],
      tempPassword 
    } = body;

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: tempPassword ? await require('bcryptjs').hash(tempPassword, 10) : undefined,
        tenantId: session.user.tenantId
      }
    });

    // Assign roles
    if (roleIds.length > 0) {
      await prisma.userRole.createMany({
        data: roleIds.map((roleId: string) => ({
          userId: user.id,
          roleId,
          assignedBy: session.user.id
        }))
      });
    }

    return NextResponse.json({ 
      user, 
      message: 'User created successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
