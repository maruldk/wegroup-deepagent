
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// GET /api/permission-engine/audit - Get permission audit logs
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    const action = searchParams.get('action');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (action) where.action = action;
    
    if (dateFrom || dateTo) {
      where.performedAt = {};
      if (dateFrom) where.performedAt.gte = new Date(dateFrom);
      if (dateTo) where.performedAt.lte = new Date(dateTo);
    }

    const [auditLogs, total] = await Promise.all([
      prisma.permissionAuditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { performedAt: 'desc' }
      }),
      prisma.permissionAuditLog.count({ where })
    ]);

    // Get summary statistics
    const stats = await prisma.permissionAuditLog.groupBy({
      by: ['action'],
      where: {
        performedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      _count: {
        id: true
      }
    });

    return NextResponse.json({
      auditLogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: stats.reduce((acc, stat) => {
        acc[stat.action] = stat._count.id;
        return acc;
      }, {} as Record<string, number>)
    });

  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/permission-engine/audit - Create audit log entry
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      entityType,
      entityId,
      action,
      permissionDetails,
      oldValues,
      newValues,
      reason,
      ipAddress,
      userAgent
    } = body;

    const auditLog = await prisma.permissionAuditLog.create({
      data: {
        entityType,
        entityId,
        action,
        permissionDetails: permissionDetails || {},
        oldValues: oldValues || {},
        newValues: newValues || {},
        reason,
        ipAddress,
        userAgent,
        tenantId: session.user.tenantId || '',
        performedBy: session.user.id || 'system'
      }
    });

    return NextResponse.json({ 
      auditLog, 
      message: 'Audit log created successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
