
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET /api/hr/employees/[id] - Get employee by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const employee = await prisma.employee.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.tenantId
      },
      include: {
        user: {
          select: { id: true, email: true, image: true }
        },
        manager: {
          select: { id: true, firstName: true, lastName: true }
        },
        subordinates: {
          select: { id: true, firstName: true, lastName: true, position: true }
        },
        performanceReviews: {
          orderBy: { reviewDate: 'desc' },
          take: 5
        }
      }
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    return NextResponse.json(employee)
  } catch (error) {
    console.error('Get Employee Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/hr/employees/[id] - Update employee
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const updateData: any = { ...body }

    // Handle date fields
    if (updateData.hireDate) {
      updateData.hireDate = new Date(updateData.hireDate)
    }
    if (updateData.salary) {
      updateData.salary = parseFloat(updateData.salary)
    }

    const employee = await prisma.employee.update({
      where: {
        id: params.id,
        tenantId: session.user.tenantId
      },
      data: updateData,
      include: {
        manager: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    })

    return NextResponse.json(employee)
  } catch (error) {
    console.error('Update Employee Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/hr/employees/[id] - Delete employee (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.employee.update({
      where: {
        id: params.id,
        tenantId: session.user.tenantId
      },
      data: {
        isActive: false,
        employmentStatus: 'TERMINATED'
      }
    })

    return NextResponse.json({ message: 'Employee deleted successfully' })
  } catch (error) {
    console.error('Delete Employee Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
