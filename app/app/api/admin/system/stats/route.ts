
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

    // Get system statistics
    const [
      totalTenants,
      totalUsers,
      activeModules,
      activeTenants
    ] = await Promise.all([
      prisma.tenant.count(),
      prisma.user.count(),
      prisma.tenantModule.count({ where: { isActive: true } }),
      prisma.tenant.count({ where: { isActive: true } })
    ])

    // Calculate system health (simple heuristic)
    const systemHealth = activeTenants === totalTenants ? 'good' : 'warning'

    const stats = {
      totalTenants,
      totalUsers,
      activeModules,
      activeTenants,
      systemHealth
    }

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Error fetching system stats:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der System-Statistiken' },
      { status: 500 }
    )
  }
}
