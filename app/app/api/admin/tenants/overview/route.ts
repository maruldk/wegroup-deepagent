
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      )
    }

    // Check if user is super admin
    const isSuperAdmin = session.user.roles?.some(role => role.name === 'super_admin')

    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: 'Super-Admin-Berechtigung erforderlich' },
        { status: 403 }
      )
    }

    // Get all tenants with user counts and module information
    const tenants = await prisma.tenant.findMany({
      include: {
        users: {
          select: { id: true }
        },
        modules: {
          where: { isActive: true },
          select: { moduleType: true }
        },
        _count: {
          select: {
            users: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const tenantOverviews = tenants.map(tenant => ({
      id: tenant.id,
      name: tenant.name,
      userCount: tenant._count.users,
      activeModules: tenant.modules.map(m => m.moduleType),
      status: tenant.isActive ? 'active' : 'inactive',
      lastActivity: tenant.updatedAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      tenants: tenantOverviews
    })

  } catch (error) {
    console.error('Error fetching tenant overview:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Mandanten-Übersicht' },
      { status: 500 }
    )
  }
}
