
// WeGroup Platform - Sprint 7: Global Deployment API
// Enterprise-Grade Multi-Region Deployment Management

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GlobalDeploymentManager } from '@/lib/sprint7-global-deployment';

const deploymentManager = GlobalDeploymentManager.getInstance();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const regionCode = searchParams.get('region');
    const action = searchParams.get('action');

    if (action === 'metrics') {
      const metrics = await deploymentManager.getRegionalMetrics();
      return NextResponse.json({
        success: true,
        data: {
          metrics,
          timestamp: new Date().toISOString(),
          total_regions: metrics.length,
          active_regions: metrics.filter((m: any) => m.isActive).length
        }
      });
    }

    if (action === 'regions') {
      await deploymentManager.initializeRegions();
      return NextResponse.json({
        success: true,
        message: 'Global regions initialized successfully',
        timestamp: new Date().toISOString()
      });
    }

    // Default: Return deployment status
    const metrics = await deploymentManager.getRegionalMetrics();
    return NextResponse.json({
      success: true,
      data: {
        deployment_status: 'operational',
        regions: metrics,
        global_health: 'excellent',
        autonomy_level: '95%',
        ai_optimization: 'active'
      }
    });

  } catch (error: any) {
    console.error('Global deployment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, deploymentName, deploymentType, regionCode, version, configuration } = body;

    if (action === 'deploy') {
      const deployment = await deploymentManager.deployToRegion(
        deploymentName,
        deploymentType,
        regionCode,
        version,
        configuration
      );

      if (!deployment) {
        return NextResponse.json({ error: 'Failed to initiate deployment' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        data: {
          deployment_id: deployment.id,
          status: deployment.status,
          region: regionCode,
          estimated_completion: '5-10 minutes',
          ai_optimized: true
        },
        message: 'Deployment initiated successfully'
      });
    }

    if (action === 'assign_tenant') {
      const { tenantId, isPrimary } = body;
      await deploymentManager.assignTenantToRegion(tenantId, regionCode, isPrimary);

      return NextResponse.json({
        success: true,
        message: `Tenant ${tenantId} assigned to region ${regionCode}`,
        data: {
          tenant_id: tenantId,
          region: regionCode,
          primary: isPrimary,
          timestamp: new Date().toISOString()
        }
      });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });

  } catch (error: any) {
    console.error('Global deployment POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
