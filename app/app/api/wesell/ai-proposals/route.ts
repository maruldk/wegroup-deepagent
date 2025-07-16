
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma as db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { opportunityId, proposalType, requirements, budget, timeline } = body
    const userId = session.user.id

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { tenant: true }
    })

    if (!user?.tenant) {
      return NextResponse.json({ error: 'No tenant selected' }, { status: 400 })
    }

    const tenantId = user.tenant.id

    // Get opportunity details
    const opportunity = await db.salesOpportunity.findFirst({
      where: { id: opportunityId, tenantId },
      include: {
        customer: true,
        proposals: {
          orderBy: { createdAt: 'desc' },
          take: 3
        }
      }
    })

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
    }

    // Prepare AI prompt for proposal generation
    const proposalPrompt = `
Generate a comprehensive business proposal for the following opportunity:

CUSTOMER INFORMATION:
- Company: ${opportunity.customer.companyName || 'N/A'}
- Industry: ${opportunity.customer.industry || 'General'}
- Company Size: ${opportunity.customer.companySize || 'Unknown'}
- Customer Type: ${opportunity.customer.customerType}

OPPORTUNITY DETAILS:
- Name: ${opportunity.opportunityName}
- Description: ${opportunity.description || 'Standard proposal'}
- Stage: ${opportunity.stage}
- Estimated Value: €${opportunity.estimatedValue?.toString() || 'TBD'}
- Close Date: ${opportunity.estimatedCloseDate?.toDateString() || 'TBD'}

PROPOSAL REQUIREMENTS:
- Type: ${proposalType}
- Requirements: ${requirements}
- Budget Range: ${budget || 'To be discussed'}
- Timeline: ${timeline || 'Standard delivery'}

CONTEXT:
- Previous proposals: ${opportunity.proposals.length}
- AI Risk Factors: ${JSON.stringify(opportunity.aiRiskFactors || [])}
- AI Recommendations: ${JSON.stringify(opportunity.aiRecommendations || [])}

Please generate a professional proposal including:

1. Executive Summary
2. Understanding of Requirements
3. Proposed Solution
4. Implementation Plan
5. Timeline and Milestones
6. Investment Details
7. Why Choose Us
8. Next Steps

Respond in JSON format:
{
  "title": "Proposal title",
  "executiveSummary": "Brief overview and value proposition",
  "requirementsUnderstanding": "Demonstration of requirement comprehension",
  "proposedSolution": {
    "overview": "Solution overview",
    "keyFeatures": ["feature1", "feature2", "feature3"],
    "benefits": ["benefit1", "benefit2", "benefit3"]
  },
  "implementationPlan": {
    "phases": [
      {
        "name": "Phase name",
        "duration": "Duration",
        "deliverables": ["deliverable1", "deliverable2"]
      }
    ]
  },
  "timeline": {
    "totalDuration": "Total project duration",
    "keyMilestones": [
      {
        "milestone": "Milestone name",
        "date": "Target date"
      }
    ]
  },
  "investment": {
    "totalValue": "Total investment",
    "breakdown": [
      {
        "item": "Item description",
        "value": "Value"
      }
    ],
    "paymentTerms": "Payment terms"
  },
  "whyChooseUs": ["reason1", "reason2", "reason3"],
  "nextSteps": ["step1", "step2", "step3"],
  "confidenceScore": 0.0-1.0,
  "riskFactors": ["risk1", "risk2"],
  "successProbability": 0.0-1.0
}
`

    // Call AI API
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'user',
            content: proposalPrompt
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 3000
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate proposal')
    }

    const aiResponse = await response.json()
    const proposalData = JSON.parse(aiResponse.choices[0].message.content)

    // Generate unique proposal number
    const proposalCount = await db.salesProposal.count({
      where: { tenantId }
    })
    const proposalNumber = `PROP-${new Date().getFullYear()}-${String(proposalCount + 1).padStart(4, '0')}`

    // Create proposal in database
    const proposal = await db.salesProposal.create({
      data: {
        opportunityId,
        proposalNumber,
        title: proposalData.title,
        description: proposalData.executiveSummary,
        aiGeneratedContent: true,
        aiPrompt: requirements,
        aiConfidenceScore: proposalData.confidenceScore || 0.8,
        aiPersonalizationScore: 0.9,
        proposalData: proposalData,
        status: 'DRAFT',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        tenantId,
        createdBy: userId
      },
      include: {
        opportunity: {
          include: {
            customer: true
          }
        }
      }
    })

    // Update opportunity with AI insights
    await db.salesOpportunity.update({
      where: { id: opportunityId },
      data: {
        aiCloseProbability: proposalData.successProbability || 0.7,
        aiRiskFactors: proposalData.riskFactors || [],
        aiRecommendations: proposalData.nextSteps || []
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        proposal,
        aiInsights: {
          confidenceScore: proposalData.confidenceScore,
          successProbability: proposalData.successProbability,
          riskFactors: proposalData.riskFactors,
          recommendedActions: proposalData.nextSteps
        },
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error generating AI proposal:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate proposal',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
