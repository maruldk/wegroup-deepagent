
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Get email monitoring data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const timeRange = searchParams.get('timeRange') || '24h';

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    }

    // Calculate time range
    const timeRangeMap = {
      '1h': 1,
      '24h': 24,
      '7d': 24 * 7,
      '30d': 24 * 30
    };

    const hoursBack = timeRangeMap[timeRange as keyof typeof timeRangeMap] || 24;
    const startTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

    // Get email processing statistics
    const emailStats = await prisma.emailInvoice.groupBy({
      by: ['processingStatus'],
      where: {
        tenantId,
        receivedAt: {
          gte: startTime
        }
      },
      _count: {
        processingStatus: true
      }
    });

    // Get classification statistics
    const classificationStats = await prisma.emailClassification.groupBy({
      by: ['documentType', 'confidenceLevel'],
      where: {
        tenantId,
        createdAt: {
          gte: startTime
        }
      },
      _count: {
        documentType: true
      }
    });

    // Get recent email invoices
    const recentEmails = await prisma.emailInvoice.findMany({
      where: {
        tenantId,
        receivedAt: {
          gte: startTime
        }
      },
      include: {
        emailConfig: {
          select: {
            emailAddress: true,
            displayName: true
          }
        },
        classification: {
          select: {
            documentType: true,
            confidence: true,
            confidenceLevel: true,
            processingRecommendation: true,
            priority: true
          }
        },
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            processingStatus: true
          }
        }
      },
      orderBy: { receivedAt: 'desc' },
      take: 20
    });

    // Get processing performance metrics
    const processingLogs = await prisma.emailProcessingLog.findMany({
      where: {
        tenantId,
        startTime: {
          gte: startTime
        }
      },
      select: {
        processingStep: true,
        processingStatus: true,
        processingDuration: true,
        aiConfidence: true,
        aiProcessingTime: true
      }
    });

    // Calculate performance metrics with safe defaults
    const avgProcessingTime = processingLogs.length > 0 
      ? processingLogs.reduce((sum, log) => sum + (log.processingDuration || 0), 0) / processingLogs.length 
      : 0;
    const avgAiConfidence = processingLogs.length > 0 
      ? processingLogs.reduce((sum, log) => sum + (log.aiConfidence || 0), 0) / processingLogs.length 
      : 0;
    const avgAiProcessingTime = processingLogs.length > 0 
      ? processingLogs.reduce((sum, log) => sum + (log.aiProcessingTime || 0), 0) / processingLogs.length 
      : 0;

    // Get hourly processing trends
    const hourlyTrends = await prisma.$queryRaw`
      SELECT 
        date_trunc('hour', "receivedAt") as hour,
        COUNT(*) as total_emails,
        COUNT(CASE WHEN "isInvoice" = true THEN 1 END) as invoices,
        AVG("invoiceConfidence") as avg_confidence
      FROM "email_invoices"
      WHERE "tenantId" = ${tenantId}
        AND "receivedAt" >= ${startTime}
      GROUP BY date_trunc('hour', "receivedAt")
      ORDER BY hour ASC
    `;

    // Get email configuration health
    const emailConfigs = await prisma.tenantEmailConfig.findMany({
      where: { tenantId },
      select: {
        id: true,
        emailAddress: true,
        displayName: true,
        connectionStatus: true,
        lastTestDate: true,
        lastTestResult: true,
        isActive: true,
        _count: {
          select: {
            emailInvoices: true
          }
        }
      }
    });

    return NextResponse.json({
      stats: {
        processing: emailStats.reduce((acc, stat) => {
          acc[stat.processingStatus] = stat._count.processingStatus;
          return acc;
        }, {} as Record<string, number>),
        classification: classificationStats.reduce((acc, stat) => {
          const key = `${stat.documentType}_${stat.confidenceLevel}`;
          acc[key] = stat._count.documentType;
          return acc;
        }, {} as Record<string, number>),
        performance: {
          avgProcessingTime: Math.round((avgProcessingTime || 0) * 100) / 100,
          avgAiConfidence: Math.round((avgAiConfidence || 0) * 100) / 100,
          avgAiProcessingTime: Math.round((avgAiProcessingTime || 0) * 100) / 100,
          totalEmails: recentEmails?.length || 0,
          invoicesDetected: recentEmails?.filter(e => e.isInvoice)?.length || 0,
          avgConfidence: recentEmails?.length > 0 
            ? Math.round((recentEmails.reduce((sum, e) => sum + (e.invoiceConfidence || 0), 0) / recentEmails.length) * 100) / 100
            : 0
        }
      },
      recentEmails,
      hourlyTrends,
      emailConfigs,
      timeRange
    });

  } catch (error) {
    console.error('Error fetching email monitoring data:', error);
    return NextResponse.json({ error: 'Failed to fetch email monitoring data' }, { status: 500 });
  }
}

// Real-time email monitoring endpoint
export async function POST(request: NextRequest) {
  try {
    const { tenantId, action, data } = await request.json();

    if (!tenantId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    switch (action) {
      case 'start_monitoring':
        // Start real-time email monitoring for a tenant
        // In a real implementation, this would start a background process
        return NextResponse.json({
          success: true,
          message: 'Email monitoring started',
          monitoringId: `monitor_${tenantId}_${Date.now()}`
        });

      case 'stop_monitoring':
        // Stop real-time email monitoring
        return NextResponse.json({
          success: true,
          message: 'Email monitoring stopped'
        });

      case 'get_alerts':
        // Get current alerts for the tenant
        const alerts = await prisma.emailProcessingLog.findMany({
          where: {
            tenantId,
            processingStatus: 'FAILED',
            startTime: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
            }
          },
          include: {
            emailConfig: {
              select: {
                emailAddress: true,
                displayName: true
              }
            }
          },
          orderBy: { startTime: 'desc' },
          take: 10
        });

        return NextResponse.json({
          alerts,
          alertCount: alerts.length
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in email monitoring action:', error);
    return NextResponse.json({ error: 'Failed to execute monitoring action' }, { status: 500 });
  }
}
