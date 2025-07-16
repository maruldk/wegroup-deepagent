
// WeGroup Platform - Sprint 4: AI Decision Review API
// Human Review and Feedback for AI Decisions

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

export const dynamic = "force-dynamic"

const prisma = new PrismaClient()

// POST /api/ai-engine/decisions/[id]/review - Review AI Decision
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      status,
      humanFeedback,
      outcomeRating
    } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    const updatedDecision = await prisma.aIDecision.update({
      where: { id: params.id },
      data: {
        status,
        humanFeedback,
        outcomeRating,
        reviewedBy: session.user.id,
        reviewedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      decision: updatedDecision,
      message: 'AI decision reviewed successfully'
    })
  } catch (error) {
    console.error('Review AI Decision error:', error)
    return NextResponse.json(
      { error: 'Failed to review AI decision' },
      { status: 500 }
    )
  }
}
