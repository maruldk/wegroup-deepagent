
// WeGroup Platform - Sprint 4: AI Model Deployment API
// Deploy and Manage AI Model Deployments

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiEngine } from '../../../../../../lib/ai-engine'

export const dynamic = "force-dynamic"

// POST /api/ai-engine/models/[id]/deploy - Deploy AI Model
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const deploymentResult = await aiEngine.deployModel(params.id)

    if (deploymentResult) {
      return NextResponse.json({
        success: true,
        message: 'AI model deployed successfully',
        modelId: params.id
      })
    } else {
      return NextResponse.json(
        { error: 'Model deployment failed' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Deploy AI Model error:', error)
    return NextResponse.json(
      { error: 'Failed to deploy AI model' },
      { status: 500 }
    )
  }
}
