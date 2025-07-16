
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Create or update tenant email configuration
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { tenantId, emailAddress, displayName, domain, emailPrefix, ...config } = data;

    if (!tenantId || !emailAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if configuration already exists
    const existingConfig = await prisma.tenantEmailConfig.findFirst({
      where: {
        tenantId,
        emailAddress
      }
    });

    let emailConfig;
    if (existingConfig) {
      // Update existing configuration
      emailConfig = await prisma.tenantEmailConfig.update({
        where: { id: existingConfig.id },
        data: {
          displayName,
          domain,
          emailPrefix,
          ...config
        }
      });
    } else {
      // Create new configuration
      emailConfig = await prisma.tenantEmailConfig.create({
        data: {
          tenantId,
          emailAddress,
          displayName,
          domain,
          emailPrefix,
          ...config
        }
      });
    }

    return NextResponse.json({
      success: true,
      emailConfig
    });

  } catch (error) {
    console.error('Error creating/updating email configuration:', error);
    return NextResponse.json({ error: 'Failed to configure email settings' }, { status: 500 });
  }
}

// Get tenant email configurations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    }

    const emailConfigs = await prisma.tenantEmailConfig.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: {
            emailInvoices: true,
            emailProcessingLogs: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      emailConfigs
    });

  } catch (error) {
    console.error('Error fetching email configurations:', error);
    return NextResponse.json({ error: 'Failed to fetch email configurations' }, { status: 500 });
  }
}

// Delete email configuration
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const configId = searchParams.get('configId');
    const tenantId = searchParams.get('tenantId');

    if (!configId || !tenantId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify the configuration belongs to the tenant
    const config = await prisma.tenantEmailConfig.findFirst({
      where: {
        id: configId,
        tenantId
      }
    });

    if (!config) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    // Delete the configuration
    await prisma.tenantEmailConfig.delete({
      where: { id: configId }
    });

    return NextResponse.json({
      success: true,
      message: 'Email configuration deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting email configuration:', error);
    return NextResponse.json({ error: 'Failed to delete email configuration' }, { status: 500 });
  }
}
