
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// POST /api/hr/applications/[id]/analyze - AI Analysis of job application
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get application details
    const application = await prisma.jobApplication.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.tenantId
      }
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Prepare AI analysis prompt
    const prompt = `
Analyze this job application and provide detailed insights:

Candidate: ${application.candidateName}
Position: ${application.position}
Email: ${application.candidateEmail}

Please provide a comprehensive analysis in JSON format with the following structure:
{
  "suitabilityScore": <number 0-100>,
  "skillsMatch": {
    "technical": <array of matched technical skills>,
    "soft": <array of matched soft skills>,
    "missing": <array of missing critical skills>
  },
  "personalityFit": {
    "teamwork": <score 0-100>,
    "leadership": <score 0-100>,
    "communication": <score 0-100>,
    "adaptability": <score 0-100>
  },
  "recommendation": "<detailed recommendation text>",
  "strengths": <array of key strengths>,
  "concerns": <array of potential concerns>,
  "interviewQuestions": <array of suggested interview questions>,
  "confidenceLevel": <number 0-100>
}

Base your analysis on the position requirements and provide actionable insights for the hiring manager.
`

    // Call LLM API for analysis
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error('AI analysis failed')
    }

    const aiResponse = await response.json()
    const analysis = JSON.parse(aiResponse.choices[0].message.content)

    // Update application with AI analysis
    const updatedApplication = await prisma.jobApplication.update({
      where: { id: params.id },
      data: {
        status: 'SCREENING',
        aiSuitabilityScore: analysis.suitabilityScore,
        aiSkillsMatch: analysis.skillsMatch,
        aiPersonalityFit: analysis.personalityFit,
        aiRecommendation: analysis.recommendation,
        confidenceScore: analysis.confidenceLevel,
        lastContactDate: new Date()
      },
      include: {
        assignedEmployee: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    })

    return NextResponse.json({
      application: updatedApplication,
      analysis: {
        ...analysis,
        analysisDate: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('AI Analysis Error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
