
// WeGroup Platform - Sprint 4: AI Engine Health API
// System Health and Performance Monitoring

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiEngine } from '../../../../lib/ai-engine'

export const dynamic = "force-dynamic"

// GET /api/ai-engine/health - Get AI Engine Health
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const health = await aiEngine.getSystemHealth()

    return NextResponse.json({
      success: true,
      health
    })
  } catch (error) {
    console.error('AI Engine Health API error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI engine health' },
      { status: 500 }
    )
  }
}
