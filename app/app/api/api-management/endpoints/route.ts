
// WeGroup Platform - Sprint 4: API Endpoints Management
// RESTful API Endpoint Registration and Management

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

export const dynamic = "force-dynamic"

const prisma = new PrismaClient()

// GET /api/api-management/endpoints - List API Endpoints
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId') || session.user.tenantId
    const isPublic = searchParams.get('isPublic')
    const method = searchParams.get('method')

    const where: any = {}
    if (tenantId) where.tenantId = tenantId
    if (isPublic !== null) where.isPublic = isPublic === 'true'
    if (method) where.method = method

    const endpoints = await prisma.aPIEndpoint.findMany({
      where,
      include: {
        usageStats: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      endpoints,
      total: endpoints.length
    })
  } catch (error) {
    console.error('API Endpoints API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API endpoints' },
      { status: 500 }
    )
  }
}

// POST /api/api-management/endpoints - Create API Endpoint
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      path,
      method,
      description,
      isPublic,
      requiresAuth,
      rateLimitRpm,
      rateLimitRph,
      allowedOrigins,
      requiredScopes
    } = body

    if (!name || !path || !method) {
      return NextResponse.json(
        { error: 'Name, path, and method are required' },
        { status: 400 }
      )
    }

    const endpoint = await prisma.aPIEndpoint.create({
      data: {
        name,
        path,
        method,
        description,
        isPublic: isPublic || false,
        requiresAuth: requiresAuth !== false,
        rateLimitRpm: rateLimitRpm || 60,
        rateLimitRph: rateLimitRph || 1000,
        allowedOrigins: allowedOrigins || [],
        requiredScopes: requiredScopes || [],
        tenantId: session.user.tenantId,
        createdBy: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      endpoint,
      message: 'API endpoint created successfully'
    })
  } catch (error) {
    console.error('Create API Endpoint error:', error)
    return NextResponse.json(
      { error: 'Failed to create API endpoint' },
      { status: 500 }
    )
  }
}
