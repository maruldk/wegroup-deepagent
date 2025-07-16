
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

export const dynamic = "force-dynamic";

const updateTenantSchema = z.object({
  name: z.string().min(1).optional(),
  displayName: z.string().optional(),
  shortName: z.string().optional(),
  description: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.object({}).optional(),
  planType: z.enum(['DEMO', 'BASIC', 'PRO', 'ENTERPRISE', 'CUSTOM']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'TRIAL', 'ARCHIVED', 'PENDING_SETUP']).optional(),
  brandColor: z.string().optional(),
  brandLogo: z.string().optional(),
  brandIcon: z.string().optional(),
  settings: z.object({}).optional()
});

// GET /api/tenants/[tenantId] - Get tenant details
export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = params.tenantId;

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        owner: {
          select: { id: true, email: true, firstName: true, lastName: true }
        },
        managers: {
          include: {
            user: {
              select: { id: true, email: true, firstName: true, lastName: true }
            }
          }
        },
        users: {
          select: { 
            id: true, 
            email: true, 
            firstName: true, 
            lastName: true,
            isActive: true,
            lastLoginAt: true
          }
        },
        activities: {
          orderBy: { performedAt: 'desc' },
          take: 10,
          include: {
            user: {
              select: { email: true, firstName: true, lastName: true }
            }
          }
        },
        analytics: {
          where: { periodType: 'DAILY' },
          orderBy: { periodStart: 'desc' },
          take: 30
        },
        billingRecords: {
          orderBy: { billingPeriodStart: 'desc' },
          take: 12
        },
        supportTickets: {
          where: { status: { in: ['OPEN', 'IN_PROGRESS'] } },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        customization: true,
        modules: true,
        _count: {
          select: {
            users: true,
            activities: true,
            supportTickets: true,
            billingRecords: true
          }
        }
      }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Calculate additional metrics
    const activeUsers = tenant.users?.filter(u => u.isActive)?.length || 0;
    const recentLogins = tenant.users?.filter(u => 
      u.lastLoginAt && u.lastLoginAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    )?.length || 0;

    const latestAnalytics = tenant.analytics?.[0];
    const openTickets = tenant.supportTickets?.length || 0;

    const tenantWithMetrics = {
      ...tenant,
      metrics: {
        totalUsers: tenant._count.users,
        activeUsers,
        recentLogins,
        totalActivities: tenant._count.activities,
        openSupportTickets: openTickets,
        totalSupportTickets: tenant._count.supportTickets,
        totalBillingRecords: tenant._count.billingRecords,
        healthScore: latestAnalytics?.aiHealthScore || 100,
        utilizationRate: latestAnalytics?.systemUtilization || 0,
        securityScore: latestAnalytics?.securityScore || 80,
        complianceScore: latestAnalytics?.complianceScore || 90
      }
    };

    return NextResponse.json(tenantWithMetrics);

  } catch (error) {
    console.error('Error fetching tenant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/tenants/[tenantId] - Update tenant
export async function PUT(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = params.tenantId;
    const body = await request.json();
    const validatedData = updateTenantSchema.parse(body);

    // Check if tenant exists and user has permission
    const existingTenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        managers: {
          where: { userId: session.user.id }
        }
      }
    });

    if (!existingTenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Check permissions
    const isOwner = existingTenant.ownerId === session.user.id;
    const isManager = existingTenant.managers.length > 0;

    if (!isOwner && !isManager) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Update tenant
    const updatedTenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        ...validatedData,
        updatedAt: new Date()
      },
      include: {
        owner: {
          select: { id: true, email: true, firstName: true, lastName: true }
        },
        _count: {
          select: { users: true, activities: true }
        }
      }
    });

    // Log update activity
    await prisma.tenantActivity.create({
      data: {
        tenantId: tenantId,
        userId: session.user.id,
        activityType: 'SYSTEM_CONFIG',
        description: `Mandant '${updatedTenant.name}' wurde aktualisiert`,
        metadata: {
          action: 'tenant_updated',
          changes: validatedData
        }
      }
    });

    return NextResponse.json(updatedTenant);

  } catch (error) {
    console.error('Error updating tenant:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ungültige Eingabedaten', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/tenants/[tenantId] - Delete tenant
export async function DELETE(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = params.tenantId;

    // Check if tenant exists and user is owner
    const existingTenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        _count: { select: { users: true } }
      }
    });

    if (!existingTenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Only owner can delete tenant
    if (existingTenant.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Only tenant owner can delete tenant' }, { status: 403 });
    }

    // Check if tenant has users (safety check)
    if (existingTenant._count.users > 1) {
      return NextResponse.json(
        { error: 'Cannot delete tenant with active users. Please remove all users first.' },
        { status: 400 }
      );
    }

    // Archive instead of hard delete for audit purposes
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        status: 'ARCHIVED',
        isActive: false,
        updatedAt: new Date()
      }
    });

    // Log deletion activity
    await prisma.tenantActivity.create({
      data: {
        tenantId: tenantId,
        userId: session.user.id,
        activityType: 'SYSTEM_CONFIG',
        description: `Mandant '${existingTenant.name}' wurde archiviert`,
        metadata: {
          action: 'tenant_archived',
          reason: 'deleted_by_owner'
        }
      }
    });

    return NextResponse.json({ message: 'Tenant archived successfully' });

  } catch (error) {
    console.error('Error deleting tenant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
