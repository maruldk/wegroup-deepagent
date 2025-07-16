
// WeGroup Platform - Sprint 4: AI Orchestration Trigger API
// Trigger Cross-Module AI Orchestration

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiEngine } from '../../../../../lib/ai-engine'

export const dynamic = "force-dynamic"

// POST /api/ai-engine/orchestration/trigger - Trigger Orchestration
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      triggerModule,
      event,
      tenantId
    } = body

    if (!triggerModule || !event) {
      return NextResponse.json(
        { error: 'Trigger module and event are required' },
        { status: 400 }
      )
    }

    const result = await aiEngine.orchestrateModules(
      triggerModule,
      event,
      tenantId || session.user.tenantId || ''
    )

    return NextResponse.json({
      success: true,
      result,
      message: 'Orchestration triggered successfully'
    })
  } catch (error) {
    console.error('Trigger Orchestration error:', error)
    return NextResponse.json(
      { error: 'Failed to trigger orchestration' },
      { status: 500 }
    )
  }
}
