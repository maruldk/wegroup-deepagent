
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma as db } from '@/lib/db'
import jwt from 'jsonwebtoken'

async function validateCustomerToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('No valid token provided')
  }

  const token = authHeader.substring(7)
  const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback_secret') as any
  
  if (decoded.type !== 'customer_portal') {
    throw new Error('Invalid token type')
  }

  return decoded
}

export async function GET(request: NextRequest) {
  try {
    const tokenData = await validateCustomerToken(request)
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')

    const whereClause: any = {
      portalAccountId: tokenData.portalAccountId
    }

    if (status) {
      whereClause.status = status.toUpperCase()
    }

    if (category) {
      whereClause.category = category.toUpperCase()
    }

    const tickets = await db.customerTicket.findMany({
      where: whereClause,
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        _count: {
          select: { messages: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: tickets.map((ticket: any) => ({
        ...ticket,
        messageCount: ticket._count.messages,
        lastMessage: ticket.messages[0] || null
      }))
    })

  } catch (error) {
    console.error('Error fetching customer tickets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const tokenData = await validateCustomerToken(request)
    const body = await request.json()
    const { subject, description, category, priority } = body

    if (!subject || !description) {
      return NextResponse.json({ error: 'Subject and description required' }, { status: 400 })
    }

    // Generate ticket number
    const ticketCount = await db.customerTicket.count({
      where: { tenantId: tokenData.tenantId }
    })
    const ticketNumber = `TICKET-${new Date().getFullYear()}-${String(ticketCount + 1).padStart(6, '0')}`

    // Use AI to analyze the ticket for category and priority prediction
    const aiAnalysisPrompt = `
Analyze the following support ticket and predict the category and priority:

Subject: ${subject}
Description: ${description}
Provided Category: ${category || 'Not specified'}
Provided Priority: ${priority || 'Not specified'}

Respond in JSON format:
{
  "predictedCategory": "GENERAL|TECHNICAL_SUPPORT|BILLING|ACCOUNT|FEATURE_REQUEST|BUG_REPORT|INTEGRATION|TRAINING",
  "predictedPriority": "LOW|MEDIUM|HIGH|URGENT|CRITICAL",
  "sentimentScore": 0.0-1.0,
  "estimatedResolutionTime": "minutes",
  "confidence": 0.0-1.0,
  "resolutionSuggestion": "Brief suggestion for resolution"
}
`

    let aiPredictions: any = {}
    try {
      const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages: [{ role: 'user', content: aiAnalysisPrompt }],
          response_format: { type: 'json_object' },
          max_tokens: 500
        })
      })

      if (response.ok) {
        const aiResponse = await response.json()
        aiPredictions = JSON.parse(aiResponse.choices[0].message.content)
      }
    } catch (aiError) {
      console.error('AI analysis failed:', aiError)
    }

    // Create ticket
    const ticket = await db.customerTicket.create({
      data: {
        ticketNumber,
        portalAccountId: tokenData.portalAccountId,
        subject,
        description,
        category: category || aiPredictions.predictedCategory || 'GENERAL',
        priority: priority || aiPredictions.predictedPriority || 'MEDIUM',
        aiCategoryPrediction: aiPredictions.predictedCategory,
        aiPriorityScore: aiPredictions.confidence || 0.5,
        aiSentimentScore: aiPredictions.sentimentScore || 0.5,
        aiResolutionSuggestion: aiPredictions.resolutionSuggestion,
        aiEstimatedResolutionTime: parseInt(aiPredictions.estimatedResolutionTime) || 120,
        tenantId: tokenData.tenantId
      },
      include: {
        messages: true
      }
    })

    // Create initial message
    await db.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        message: description,
        messageType: 'CUSTOMER',
        authorName: 'Customer'
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ticket,
        aiPredictions
      }
    })

  } catch (error) {
    console.error('Error creating customer ticket:', error)
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    )
  }
}
