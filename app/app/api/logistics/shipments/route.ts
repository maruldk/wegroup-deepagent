
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET /api/logistics/shipments - List all shipments
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const carrier = searchParams.get('carrier')
    const priority = searchParams.get('priority')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {
      tenantId: session.user.tenantId
    }

    if (status) {
      where.status = status
    }

    if (carrier) {
      where.carrierName = { contains: carrier, mode: 'insensitive' }
    }

    if (priority) {
      where.priority = priority
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        include: {
          trackingEvents: {
            orderBy: { timestamp: 'desc' },
            take: 3
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.shipment.count({ where })
    ])

    // Calculate summary statistics
    const summary = await prisma.shipment.groupBy({
      by: ['status'],
      where: { tenantId: session.user.tenantId },
      _count: true
    })

    return NextResponse.json({
      shipments,
      summary: summary.reduce((acc, item) => {
        acc[item.status] = item._count
        return acc
      }, {} as Record<string, number>),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Logistics Shipments API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/logistics/shipments - Create new shipment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      carrierName,
      originAddress,
      destinationAddress,
      weight,
      dimensions,
      priority = 'STANDARD',
      customerReference,
      customerEmail,
      customerPhone
    } = body

    // Generate tracking number
    const trackingNumber = `TRK${Date.now().toString().slice(-8)}${Math.random().toString(36).slice(-4).toUpperCase()}`

    // Calculate estimated delivery date (mock calculation)
    const estimatedDeliveryDate = new Date()
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + (priority === 'URGENT' ? 1 : priority === 'HIGH' ? 2 : 3))

    const shipment = await prisma.shipment.create({
      data: {
        trackingNumber,
        carrierName,
        status: 'REGISTERED',
        originAddress,
        destinationAddress,
        estimatedDeliveryDate,
        weight: weight ? parseFloat(weight) : null,
        dimensions,
        priority,
        customerReference,
        customerEmail,
        customerPhone,
        tenantId: session.user.tenantId,
        // Initialize KI fields with predictions
        optimizedCarrierSuggestion: await predictOptimalCarrier(originAddress, destinationAddress, priority),
        predictedDelayInHours: 0,
        routeEfficiencyScore: 85.0, // Base score
        co2FootprintEstimate: calculateCO2Estimate(weight, originAddress, destinationAddress),
        deliveryProbabilityScore: 92.0 // Base probability
      },
      include: {
        trackingEvents: true
      }
    })

    // Create initial tracking event
    await prisma.trackingEvent.create({
      data: {
        shipmentId: shipment.id,
        eventType: 'REGISTERED',
        location: originAddress,
        timestamp: new Date(),
        description: 'Sendung registriert und zur Abholung bereit',
        tenantId: session.user.tenantId
      }
    })

    return NextResponse.json(shipment, { status: 201 })
  } catch (error) {
    console.error('Create Shipment Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to predict optimal carrier
async function predictOptimalCarrier(origin: any, destination: any, priority: string): Promise<string | null> {
  // Simple rule-based prediction (in real app, this would use ML models)
  if (priority === 'URGENT' || priority === 'CRITICAL') {
    return 'DHL Express'
  } else if (priority === 'HIGH') {
    return 'UPS'
  } else {
    // Check distance/region for standard shipments
    if (origin?.country === destination?.country) {
      return 'DPD'
    } else {
      return 'FedEx'
    }
  }
}

// Helper function to calculate CO2 estimate
function calculateCO2Estimate(weight: number | null, origin: any, destination: any): number {
  const baseWeight = weight || 1
  const distance = calculateDistance(origin, destination) // Mock distance
  
  // Simple CO2 calculation (kg CO2 per kg shipment per 100km)
  const co2PerKgPer100km = 0.14
  return Math.round((baseWeight * distance / 100 * co2PerKgPer100km) * 100) / 100
}

// Mock distance calculation
function calculateDistance(origin: any, destination: any): number {
  // In real app, this would use actual geolocation APIs
  if (origin?.country !== destination?.country) {
    return 800 + Math.random() * 1200 // International: 800-2000km
  } else {
    return 100 + Math.random() * 400 // Domestic: 100-500km
  }
}
