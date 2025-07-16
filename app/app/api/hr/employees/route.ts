
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET /api/hr/employees - List all employees
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {
      tenantId: session.user.tenantId
    }

    if (department) {
      where.department = department
    }

    if (status) {
      where.employmentStatus = status
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        include: {
          user: {
            select: { id: true, email: true, image: true }
          },
          manager: {
            select: { id: true, firstName: true, lastName: true }
          },
          _count: {
            select: { subordinates: true }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.employee.count({ where })
    ])

    return NextResponse.json({
      employees,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('HR Employees API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/hr/employees - Create new employee
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      department,
      position,
      positionTitle,
      managerId,
      hireDate,
      salary
    } = body

    // Generate unique employee ID
    const employeeCount = await prisma.employee.count({
      where: { tenantId: session.user.tenantId }
    })
    const employeeId = `EMP${String(employeeCount + 1).padStart(4, '0')}`

    const employee = await prisma.employee.create({
      data: {
        employeeId,
        firstName,
        lastName,
        email,
        phone,
        department,
        position,
        positionTitle,
        managerId,
        hireDate: hireDate ? new Date(hireDate) : null,
        salary: salary ? parseFloat(salary) : null,
        tenantId: session.user.tenantId,
        // Initialize KI fields with defaults
        predictedChurnRisk: 0.0,
        performanceScore: 75.0,
        suggestedLearningPaths: [],
        skillsMatrix: {}
      },
      include: {
        manager: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    })

    return NextResponse.json(employee, { status: 201 })
  } catch (error) {
    console.error('Create Employee Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
