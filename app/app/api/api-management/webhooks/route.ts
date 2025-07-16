
// WeGroup Platform - Sprint 4: Webhook Management API
// Webhook Registration and Delivery Management

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

export const dynamic = "force-dynamic"

const prisma = new PrismaClient()

// GET /api/api-management/webhooks - List Webhooks
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId') || session.user.tenantId || ''

    const webhooks = await prisma.webhookEndpoint.findMany({
      where: { tenantId },
      include: {
        deliveries: {
          take: 10,
          orderBy: { scheduledAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      webhooks,
      total: webhooks.length
    })
  } catch (error) {
    console.error('Webhooks API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch webhooks' },
      { status: 500 }
    )
  }
}

// POST /api/api-management/webhooks - Create Webhook
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      url,
      events,
      secret,
      retryPolicy,
      timeoutMs,
      filterRules
    } = body

    if (!name || !url || !events?.length) {
      return NextResponse.json(
        { error: 'Name, URL, and events are required' },
        { status: 400 }
      )
    }

    const webhook = await prisma.webhookEndpoint.create({
      data: {
        name,
        url,
        events,
        secret,
        retryPolicy: retryPolicy || {},
        timeoutMs: timeoutMs || 30000,
        filterRules: filterRules || [],
        tenantId: session.user.tenantId || '',
        createdBy: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      webhook,
      message: 'Webhook created successfully'
    })
  } catch (error) {
    console.error('Create Webhook error:', error)
    return NextResponse.json(
      { error: 'Failed to create webhook' },
      { status: 500 }
    )
  }
}
