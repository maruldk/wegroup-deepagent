
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const dynamic = 'force-dynamic'

// GET /api/logistics/transport-quotes - List all transport quotes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get('requestId')
    const status = searchParams.get('status')
    const supplierId = searchParams.get('supplierId')

    const where: any = {
      tenantId: session.user.tenantId
    }

    if (requestId) where.requestId = requestId
    if (status) where.status = status
    if (supplierId) where.supplierId = supplierId

    // Mock implementation for transport quotes
    const quotes = [
      {
        id: '1',
        createdAt: new Date(),
        request: {
          requestNumber: 'REQ-2025-001',
          cargoType: 'GENERAL'
        },
        supplier: {
          companyName: 'Test Supplier',
          rating: 4.5
        }
      }
    ]

    return NextResponse.json(quotes)
  } catch (error) {
    console.error('Error fetching transport quotes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/logistics/transport-quotes - Create new transport quote
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    // Generate quote number
    const quoteNumber = await generateQuoteNumber(session.user.tenantId)
    
    // AI scoring for the quote
    const aiScores = await calculateAIScores(data)

    // Mock implementation for creating transport quote
    const quote = {
      id: Date.now().toString(),
      quoteNumber,
      requestId: data.requestId,
      supplierId: data.supplierId,
      price: data.price,
      currency: data.currency,
      validUntil: new Date(data.validUntil),
      transitTime: data.transitTime,
      serviceLevel: data.serviceLevel,
      insuranceIncluded: data.insuranceIncluded,
      trackingIncluded: data.trackingIncluded,
      supplierNotes: data.supplierNotes,
      supplierContact: data.supplierContact,
      aiScoreReliability: aiScores.reliability,
      aiScoreCost: aiScores.cost,
      aiScoreSpeed: aiScores.speed,
      aiOverallScore: aiScores.overall,
      customerMarkup: data.customerMarkup || 0,
      tenantId: session.user.tenantId,
      request: {
        requestNumber: 'REQ-2025-001',
        cargoType: 'GENERAL'
      },
      supplier: {
        companyName: 'Test Supplier',
        rating: 4.5
      }
    }

    return NextResponse.json(quote, { status: 201 })
  } catch (error) {
    console.error('Error creating transport quote:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper functions
async function generateQuoteNumber(tenantId: string): Promise<string> {
  const year = new Date().getFullYear()
  // Mock implementation for quote count
  const count = 0 // Always start with 0001
  
  return `QT-${year}-${String(count + 1).padStart(4, '0')}`
}

async function calculateAIScores(data: any): Promise<any> {
  // AI scoring logic
  const reliability = Math.min(100, Math.random() * 100 + 70) // Mock AI reliability score
  const cost = Math.max(0, 100 - (data.price / 1000) * 10) // Cost efficiency score
  const speed = Math.max(0, 100 - (data.transitTime / 24) * 5) // Speed score
  const overall = (reliability + cost + speed) / 3
  
  return {
    reliability,
    cost,
    speed,
    overall
  }
}
