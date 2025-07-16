
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

export const dynamic = "force-dynamic";

// Tenant Creation Schema
const createTenantSchema = z.object({
  name: z.string().min(1),
  displayName: z.string().optional(),
  shortName: z.string().optional(),
  domain: z.string().min(1),
  subdomain: z.string().optional(),
  description: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.object({}).optional(),
  planType: z.enum(['DEMO', 'BASIC', 'PRO', 'ENTERPRISE', 'CUSTOM']).default('DEMO'),
  brandColor: z.string().optional(),
  brandLogo: z.string().optional(),
  brandIcon: z.string().optional()
});

// GET /api/tenants - List all tenants with analytics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const planType = searchParams.get('planType') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
        { domain: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    if (planType) {
      where.planType = planType;
    }

    // Get tenants with related data
    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        where,
        include: {
          users: {
            select: { id: true, isActive: true }
          },
          activities: {
            where: {
              performedAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
              }
            },
            select: { id: true }
          },
          analytics: {
            where: {
              periodType: 'DAILY',
              periodStart: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
              }
            },
            orderBy: { periodStart: 'desc' },
            take: 1
          },
          _count: {
            select: {
              users: true,
              activities: true,
              supportTickets: true
            }
          }
        },
        orderBy: [
          { lastActivityAt: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.tenant.count({ where })
    ]);

    // Calculate additional metrics
    const tenantsWithMetrics = tenants.map(tenant => {
      const activeUsers = tenant.users?.filter(u => u.isActive)?.length || 0;
      const recentActivity = tenant.activities?.length || 0;
      const latestAnalytics = tenant.analytics?.[0];

      return {
        ...tenant,
        metrics: {
          totalUsers: tenant._count.users,
          activeUsers,
          recentActivity,
          totalActivities: tenant._count.activities,
          supportTickets: tenant._count.supportTickets,
          healthScore: latestAnalytics?.aiHealthScore || 100,
          utilizationRate: latestAnalytics?.systemUtilization || 0,
          lastActivityAt: tenant.lastActivityAt
        }
      };
    });

    return NextResponse.json({
      tenants: tenantsWithMetrics,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching tenants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/tenants - Create new tenant
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createTenantSchema.parse(body);

    // Check if domain already exists
    const existingTenant = await prisma.tenant.findUnique({
      where: { domain: validatedData.domain }
    });

    if (existingTenant) {
      return NextResponse.json(
        { error: 'Domain bereits vergeben' },
        { status: 400 }
      );
    }

    // Create tenant with default settings
    const tenant = await prisma.tenant.create({
      data: {
        ...validatedData,
        ownerId: session.user.id,
        status: 'ACTIVE',
        isActive: true,
        userCount: 0,
        activityLevel: 0,
        healthScore: 100.0,
        utilizationRate: 0.0,
        securityScore: 80.0,
        settings: {
          modules: ['USER_MANAGEMENT', 'TENANT_MANAGEMENT'],
          features: {
            aiEnabled: true,
            analyticsEnabled: true,
            billingEnabled: validatedData.planType !== 'DEMO'
          }
        }
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

    // Create default tenant manager role for owner
    await prisma.tenantManager.create({
      data: {
        tenantId: tenant.id,
        userId: session.user.id,
        role: 'OWNER',
        permissions: ['ALL'],
        assignedBy: session.user.id
      }
    });

    // Create initial tenant customization
    await prisma.tenantCustomization.create({
      data: {
        tenantId: tenant.id,
        brandName: validatedData.displayName || validatedData.name,
        primaryColor: validatedData.brandColor || '#3B82F6',
        logoUrl: validatedData.brandLogo,
        darkModeEnabled: true
      }
    });

    // Log tenant creation activity
    await prisma.tenantActivity.create({
      data: {
        tenantId: tenant.id,
        userId: session.user.id,
        activityType: 'SYSTEM_CONFIG',
        description: `Mandant '${tenant.name}' wurde erstellt`,
        metadata: {
          action: 'tenant_created',
          planType: tenant.planType,
          domain: tenant.domain
        }
      }
    });

    return NextResponse.json(tenant, { status: 201 });

  } catch (error) {
    console.error('Error creating tenant:', error);
    
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
