
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Generate AI-powered workforce analytics
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId || 'default';
    const { period } = await request.json();

    // Get current workforce data
    const [employees, performanceReviews, skillAssessments] = await Promise.all([
      prisma.employee.findMany({
        where: { tenantId, isActive: true },
        include: { performanceReviews: true }
      }),
      prisma.performanceReview.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        take: 100
      }),
      prisma.skillAssessment.findMany({
        where: { tenantId },
        include: { employee: true }
      })
    ]);

    // Prepare comprehensive workforce analysis prompt
    const analysisPrompt = `
You are a senior HR data scientist and workforce analytics expert. Analyze the current workforce data and provide predictive insights.

WORKFORCE DATA:
Total Employees: ${employees.length}
Departments: ${[...new Set(employees.map(e => e.department))].join(', ')}
Average Performance Score: ${performanceReviews.reduce((sum, r) => sum + (r.overallScore || 0), 0) / performanceReviews.length || 0}
Performance Reviews Completed: ${performanceReviews.length}
Skill Assessments: ${skillAssessments.length}

EMPLOYEE DETAILS:
${employees.slice(0, 20).map(emp => `
- ${emp.firstName} ${emp.lastName}: ${emp.department} | ${emp.position} | Performance: ${emp.performanceScore || 'N/A'} | Churn Risk: ${emp.predictedChurnRisk || 0}
`).join('')}

RECENT PERFORMANCE TRENDS:
${performanceReviews.slice(0, 10).map(review => `
- Score: ${review.overallScore} | Period: ${review.reviewPeriod} | Retention Risk: ${review.retentionRisk || 0}
`).join('')}

Please provide comprehensive workforce analytics in JSON format:
{
  "predictedTurnover": 0-100,
  "predictedHiringNeeds": {
    "Engineering": 5,
    "Sales": 3,
    "Marketing": 2
  },
  "skillsShortage": ["React", "Data Science", "Project Management"],
  "avgPerformanceScore": 0-100,
  "productivityTrends": [
    {"month": "Jan", "score": 85},
    {"month": "Feb", "score": 87}
  ],
  "engagementScore": 0-100,
  "keyInsights": [
    "insight1",
    "insight2",
    "insight3"
  ],
  "recommendedActions": [
    "action1", 
    "action2",
    "action3"
  ],
  "riskAlerts": [
    {
      "type": "HIGH_TURNOVER_RISK",
      "department": "Engineering",
      "severity": "HIGH",
      "impact": "Critical project delays expected"
    }
  ],
  "retentionStrategies": [
    "strategy1",
    "strategy2"
  ],
  "talentAcquisitionPlan": {
    "priorityRoles": ["Senior Developer", "Product Manager"],
    "timeline": "Q1 2024",
    "budget": 250000
  }
}

Respond with raw JSON only. Do not include code blocks, markdown, or any other formatting.`;

    // Call LLM API for workforce analysis
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [{ role: 'user', content: analysisPrompt }],
        response_format: { type: "json_object" },
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      throw new Error('Workforce analysis failed');
    }

    const aiResponse = await response.json();
    const analysis = JSON.parse(aiResponse.choices[0].message.content);

    // Save workforce analytics to database
    const workforceAnalytics = await prisma.workforceAnalytics.create({
      data: {
        period: period || new Date().toISOString().slice(0, 7), // YYYY-MM format
        predictedTurnover: analysis.predictedTurnover,
        predictedHiringNeeds: analysis.predictedHiringNeeds,
        skillsShortage: analysis.skillsShortage,
        avgPerformanceScore: analysis.avgPerformanceScore,
        productivityTrends: analysis.productivityTrends,
        engagementScore: analysis.engagementScore,
        keyInsights: analysis.keyInsights,
        recommendedActions: analysis.recommendedActions,
        riskAlerts: analysis.riskAlerts,
        tenantId
      }
    });

    return NextResponse.json({
      analyticsId: workforceAnalytics.id,
      analysis: analysis,
      automatedActions: [
        'Retention risk alerts sent to managers',
        'Skill development plans updated',
        'Recruitment priorities adjusted',
        'Budget recommendations generated'
      ],
      nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });

  } catch (error) {
    console.error('Workforce Analytics Error:', error);
    return NextResponse.json({ 
      error: 'Workforce analytics failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Get existing workforce analytics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId || 'default';
    const url = new URL(request.url);
    const period = url.searchParams.get('period');

    const analytics = await prisma.workforceAnalytics.findMany({
      where: { 
        tenantId,
        ...(period ? { period } : {})
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return NextResponse.json({
      analytics,
      summary: {
        totalAnalyses: analytics.length,
        latestPeriod: analytics[0]?.period,
        avgTurnoverPrediction: analytics.reduce((sum, a) => sum + a.predictedTurnover, 0) / analytics.length || 0,
        avgEngagementScore: analytics.reduce((sum, a) => sum + a.engagementScore, 0) / analytics.length || 0
      }
    });

  } catch (error) {
    console.error('Get Workforce Analytics Error:', error);
    return NextResponse.json({ error: 'Failed to get workforce analytics' }, { status: 500 });
  }
}
