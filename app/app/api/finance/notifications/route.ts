
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Send notification
export async function POST(request: NextRequest) {
  try {
    const { 
      invoiceId, 
      tenantId, 
      notificationType, 
      recipientId, 
      recipientEmail, 
      recipientRole, 
      subject, 
      message, 
      priority = 'NORMAL',
      deliveryChannel = 'EMAIL'
    } = await request.json();

    if (!invoiceId || !tenantId || !notificationType || !recipientId || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create notification record
    const notification = await prisma.invoiceNotification.create({
      data: {
        invoiceId,
        tenantId,
        notificationType,
        recipientId,
        recipientEmail,
        recipientRole,
        subject,
        message,
        priority,
        deliveryChannel,
        deliveryStatus: 'PENDING'
      }
    });

    // Simulate sending notification (in real implementation, this would integrate with email service)
    try {
      // Here you would integrate with your email service provider
      // For now, we'll just mark it as sent
      await prisma.invoiceNotification.update({
        where: { id: notification.id },
        data: {
          deliveryStatus: 'SENT',
          sentAt: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        notification: {
          ...notification,
          deliveryStatus: 'SENT',
          sentAt: new Date()
        }
      });

    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      
      await prisma.invoiceNotification.update({
        where: { id: notification.id },
        data: {
          deliveryStatus: 'FAILED'
        }
      });

      return NextResponse.json({
        success: false,
        notification,
        error: 'Email delivery failed'
      });
    }

  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ error: 'Notification failed' }, { status: 500 });
  }
}

// Get notifications for a user or invoice
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('invoiceId');
    const recipientId = searchParams.get('recipientId');
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    }

    const where: any = { tenantId };
    
    if (invoiceId) {
      where.invoiceId = invoiceId;
    }
    
    if (recipientId) {
      where.recipientId = recipientId;
    }

    const notifications = await prisma.invoiceNotification.findMany({
      where,
      include: {
        invoice: {
          select: {
            invoiceNumber: true,
            vendorName: true,
            totalAmount: true,
            processingStatus: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json(notifications);

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// Mark notification as read
export async function PUT(request: NextRequest) {
  try {
    const { notificationId } = await request.json();

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
    }

    const notification = await prisma.invoiceNotification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      notification
    });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ error: 'Failed to mark notification as read' }, { status: 500 });
  }
}
