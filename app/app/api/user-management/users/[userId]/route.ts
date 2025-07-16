
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// GET /api/user-management/users/[userId] - Get specific user
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true
          }
        },
        permissionOverrides: {
          include: {
            menuPermission: true,
            permission: true
          }
        },
        employee: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/user-management/users/[userId] - Update user
export async function PATCH(
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
    const { 
      firstName, 
      lastName, 
      email, 
      isActive, 
      department, 
      position,
      password 
    } = body;

    // Start transaction
    await prisma.$transaction(async (tx) => {
      // Update user basic information
      const updateData: any = {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(email !== undefined && { email }),
        ...(isActive !== undefined && { isActive })
      };

      // Hash password if provided
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      await tx.user.update({
        where: { id: userId },
        data: updateData
      });

      // Update employee information if provided
      if (department !== undefined || position !== undefined) {
        // First check if employee record exists
        const existingEmployee = await tx.employee.findUnique({
          where: { userId }
        });

        if (existingEmployee) {
          // Update existing employee
          await tx.employee.update({
            where: { userId },
            data: {
              ...(department !== undefined && { department }),
              ...(position !== undefined && { position })
            }
          });
        } else {
          // Create new employee record only if we have the user data
          const userData = await tx.user.findUnique({
            where: { id: userId },
            select: { firstName: true, lastName: true, email: true }
          });

          if (userData) {
            await tx.employee.create({
              data: {
                employeeId: `EMP-${userId.substring(0, 8)}`,
                userId,
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email,
                department: department || null,
                position: position || null,
                tenantId: session.user.tenantId || ''
              }
            });
          }
        }
      }
    });

    return NextResponse.json({ 
      message: 'User updated successfully' 
    });

  } catch (error) {
    console.error('Error updating user:', error);
    
    // Check for unique constraint violations
    if (error instanceof Error && error.message.includes('email')) {
      return NextResponse.json({ 
        error: 'Email address is already in use' 
      }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/user-management/users/[userId] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = params;

    // Soft delete by deactivating the user
    await prisma.user.update({
      where: { id: userId },
      data: { 
        isActive: false,
        email: `deleted_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@deleted.local`
      }
    });

    return NextResponse.json({ 
      message: 'User deactivated successfully' 
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
