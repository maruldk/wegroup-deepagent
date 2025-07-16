
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET /api/finance/transactions - List financial transactions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {
      tenantId: session.user.tenantId
    }

    if (type) {
      where.type = type
    }

    if (status) {
      where.status = status
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    const [transactions, total] = await Promise.all([
      prisma.financialTransaction.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.financialTransaction.count({ where })
    ])

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Finance Transactions API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/finance/transactions - Create transaction
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      amount,
      currency = 'EUR',
      type,
      description,
      reference,
      glAccount,
      invoiceId
    } = body

    const transaction = await prisma.financialTransaction.create({
      data: {
        amount: parseFloat(amount),
        currency,
        type,
        description,
        reference,
        glAccount,
        invoiceId,
        status: 'PENDING',
        tenantId: session.user.tenantId,
        // Initialize KI fields
        confidenceScore: 0.0,
        fraudRiskScore: 0.0
      }
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Create Transaction Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
