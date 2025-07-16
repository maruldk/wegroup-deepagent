
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET /api/logistics/shipments/[id]/track - Get tracking information
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const shipment = await prisma.shipment.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.tenantId
      },
      include: {
        trackingEvents: {
          orderBy: { timestamp: 'desc' }
        }
      }
    })

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }

    return NextResponse.json(shipment)
  } catch (error) {
    console.error('Track Shipment Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/logistics/shipments/[id]/track - Add tracking event
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      eventType,
      location,
      description,
      carrierNote
    } = body

    // Verify shipment exists and belongs to tenant
    const shipment = await prisma.shipment.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.tenantId
      }
    })

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }

    // Create tracking event
    const trackingEvent = await prisma.trackingEvent.create({
      data: {
        shipmentId: params.id,
        eventType,
        location,
        timestamp: new Date(),
        description,
        carrierNote,
        tenantId: session.user.tenantId
      }
    })

    // Update shipment status if needed
    const statusUpdate: any = {}
    
    switch (eventType) {
      case 'PICKED_UP':
        statusUpdate.status = 'PICKED_UP'
        statusUpdate.pickupDate = new Date()
        break
      case 'IN_TRANSIT':
        statusUpdate.status = 'IN_TRANSIT'
        break
      case 'OUT_FOR_DELIVERY':
        statusUpdate.status = 'OUT_FOR_DELIVERY'
        break
      case 'DELIVERED':
        statusUpdate.status = 'DELIVERED'
        statusUpdate.actualDeliveryDate = new Date()
        break
      case 'EXCEPTION':
        statusUpdate.status = 'EXCEPTION'
        break
    }

    if (Object.keys(statusUpdate).length > 0) {
      await prisma.shipment.update({
        where: { id: params.id },
        data: statusUpdate
      })
    }

    // Update AI predictions based on new tracking data
    await updateAIPredictions(params.id, eventType, new Date())

    return NextResponse.json(trackingEvent, { status: 201 })
  } catch (error) {
    console.error('Add Tracking Event Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to update AI predictions based on tracking events
async function updateAIPredictions(shipmentId: string, eventType: string, eventTime: Date) {
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: { trackingEvents: { orderBy: { timestamp: 'asc' } } }
  })

  if (!shipment) return

  const updates: any = {}

  // Predict delay based on current progress
  if (shipment.estimatedDeliveryDate) {
    const timeToDelivery = shipment.estimatedDeliveryDate.getTime() - eventTime.getTime()
    const hoursToDelivery = timeToDelivery / (1000 * 60 * 60)
    
    // Simple delay prediction based on progress
    if (eventType === 'IN_TRANSIT' && hoursToDelivery < 24) {
      updates.predictedDelayInHours = Math.max(0, Math.round((24 - hoursToDelivery) * 0.3))
    } else if (eventType === 'EXCEPTION') {
      updates.predictedDelayInHours = 24 // 1 day delay for exceptions
    }
  }

  // Update delivery probability based on tracking progress
  const eventCount = shipment.trackingEvents.length + 1
  const statusProgressMap: { [key: string]: number } = {
    'REGISTERED': 20,
    'PICKED_UP': 40,
    'IN_TRANSIT': 70,
    'OUT_FOR_DELIVERY': 90,
    'DELIVERED': 100,
    'EXCEPTION': 30
  }
  
  const baseProgress = statusProgressMap[eventType] || 50
  updates.deliveryProbabilityScore = Math.min(95, baseProgress + (eventCount * 2))

  // Update route efficiency based on timing
  if (eventType === 'DELIVERED') {
    const totalTime = eventTime.getTime() - shipment.createdAt.getTime()
    const expectedTime = shipment.estimatedDeliveryDate ? 
      shipment.estimatedDeliveryDate.getTime() - shipment.createdAt.getTime() : 
      3 * 24 * 60 * 60 * 1000 // 3 days default
    
    const efficiency = Math.min(100, (expectedTime / totalTime) * 100)
    updates.routeEfficiencyScore = Math.round(efficiency * 100) / 100
  }

  if (Object.keys(updates).length > 0) {
    await prisma.shipment.update({
      where: { id: shipmentId },
      data: updates
    })
  }
}
