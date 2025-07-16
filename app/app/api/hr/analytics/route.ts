
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock Analytics Data für HR Dashboard
    const mockData = {
      overview: {
        totalEmployees: 1247,
        activeEmployees: 1189,
        recentHires: 23,
        retentionRate: 94.2,
        totalApplications: 156,
        pendingApplications: 24,
        applicationConversionRate: 18.5,
        churnRiskEmployees: 5
      },
      departmentDistribution: [
        { department: "Engineering", count: 342, percentage: 27.4 },
        { department: "Logistics", count: 298, percentage: 23.9 },
        { department: "Finance", count: 178, percentage: 14.3 },
        { department: "HR", count: 145, percentage: 11.6 },
        { department: "Marketing", count: 134, percentage: 10.7 },
        { department: "Operations", count: 150, percentage: 12.1 }
      ],
      performanceMetrics: {
        averageScore: 4.2,
        minScore: 2.1,
        maxScore: 5.0
      },
      applicationsByStatus: [
        { status: "In Review", count: 45, percentage: 28.8 },
        { status: "Interview", count: 32, percentage: 20.5 },
        { status: "Pending", count: 24, percentage: 15.4 },
        { status: "Hired", count: 29, percentage: 18.6 },
        { status: "Rejected", count: 26, percentage: 16.7 }
      ]
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('HR Analytics Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
