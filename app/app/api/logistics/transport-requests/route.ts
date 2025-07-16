
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const dynamic = 'force-dynamic'

// GET /api/logistics/transport-requests - List all transport requests
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const requestType = searchParams.get('requestType')
    const priority = searchParams.get('priority')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {
      tenantId: session.user.tenantId
    }

    if (status) where.status = status
    if (requestType) where.requestType = requestType
    if (priority) where.priority = priority

    // Mock implementation for transport requests
    const requests = [
      {
        id: '1',
        requestType: 'PICKUP',
        status: 'PENDING',
        priority: 'HIGH',
        createdAt: new Date(),
        creator: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        assignee: { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
        quotes: [],
        orders: [],
        trackingEvents: []
      }
    ]
    const total = 1

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching transport requests:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/logistics/transport-requests - Create new transport request
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    // Generate automatic request number
    const requestNumber = await generateRequestNumber(data.requestType, session.user.tenantId)
    
    // Create transport request with AI cost estimation
    const aiCostEstimate = await calculateAICostEstimate(data)
    const aiRecommendedSuppliers = await getAIRecommendedSuppliers(data)
    const aiRiskAssessment = await performAIRiskAssessment(data)

    // Mock implementation since transportRequest table doesn't exist
    const transportRequest = {
      id: `req-${Date.now()}`,
      requestNumber,
      requestType: data.requestType,
      requestSource: data.requestSource,
      customerRef: data.customerRef,
      priority: data.priority,
      cargoType: data.cargoType,
      cargoWeight: data.cargoWeight,
      cargoVolume: data.cargoVolume,
      cargoValue: data.cargoValue,
      isDangerous: data.isDangerous,
      dangerousClass: data.dangerousClass,
      pickupAddress: data.pickupAddress,
      deliveryAddress: data.deliveryAddress,
      pickupDate: new Date(data.pickupDate),
      deliveryDate: new Date(data.deliveryDate),
      flexibleTiming: data.flexibleTiming,
      specialInstructions: data.specialInstructions,
      temperatureControlled: data.temperatureControlled,
      requiresInsurance: data.requiresInsurance,
      aiCostEstimate,
      aiRecommendedSuppliers,
      aiRiskAssessment,
      tenantId: session.user.tenantId,
      createdBy: session.user.id,
      assignedTo: data.assignedTo,
      creator: { firstName: 'Mock', lastName: 'User', email: 'mock@example.com' },
      assignee: { firstName: 'Mock', lastName: 'Assignee', email: 'assignee@example.com' },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Auto-send to suppliers if enabled
    if (data.autoSendToSuppliers) {
      await sendToSuppliers(transportRequest.id, aiRecommendedSuppliers)
    }

    return NextResponse.json(transportRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating transport request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper functions
async function generateRequestNumber(requestType: string, tenantId: string): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = requestType === 'ROAD' ? 'road' : 
                requestType === 'AIR' ? 'air' :
                requestType === 'SEA' ? 'sea' : 'imp'
  
  // Mock implementation since transportRequest table doesn't exist
  const count = Math.floor(Math.random() * 100) + 1
  
  return `${prefix}-${year}-${String(count + 1).padStart(4, '0')}`
}

async function calculateAICostEstimate(data: any): Promise<number> {
  // AI cost estimation logic
  const baseRate = 2.5 // €/km
  const distance = 500 // Mock distance calculation
  const weightMultiplier = data.cargoWeight ? Math.log(data.cargoWeight) * 0.1 : 1
  const urgencyMultiplier = data.priority === 'URGENT' ? 1.5 : 1
  const dangerousMultiplier = data.isDangerous ? 1.3 : 1
  
  return baseRate * distance * weightMultiplier * urgencyMultiplier * dangerousMultiplier
}

async function getAIRecommendedSuppliers(data: any): Promise<any[]> {
  // AI supplier recommendation logic
  const suppliers = await prisma.logisticsSupplier.findMany({
    where: {
      status: 'ACTIVE'
      // Note: transportTypes field doesn't exist in LogisticsSupplier schema
    },
    orderBy: { performanceScore: 'desc' },
    take: 5
  })
  
  return suppliers.map(s => ({
    id: s.id,
    name: s.companyName,
    score: s.performanceScore || 0,
    rating: (s as any).rating || 4.5
  }))
}

async function performAIRiskAssessment(data: any): Promise<any> {
  // AI risk assessment logic
  const riskFactors = {
    distance: data.distance > 1000 ? 'high' : 'low',
    cargo: data.isDangerous ? 'high' : 'medium',
    timing: data.priority === 'URGENT' ? 'high' : 'low',
    weather: 'medium', // Mock weather risk
    route: 'low' // Mock route risk
  }
  
  const overallRisk = Object.values(riskFactors).includes('high') ? 'high' :
                     Object.values(riskFactors).includes('medium') ? 'medium' : 'low'
  
  return {
    overallRisk,
    riskFactors,
    mitigation: overallRisk === 'high' ? ['Extra insurance', 'Backup suppliers'] : []
  }
}

async function sendToSuppliers(requestId: string, suppliers: any[]): Promise<void> {
  // Auto-send to suppliers logic
  console.log(`Sending request ${requestId} to suppliers:`, suppliers)
  // Implementation for email/API sending to suppliers
}
