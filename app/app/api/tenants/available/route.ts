
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

    let tenants: any[] = []

    if (isSuperAdmin) {
      // Super admin can access all tenants
      tenants = await prisma.tenant.findMany({
        select: {
          id: true,
          name: true,
          domain: true,
          subdomain: true,
          settings: true
        },
        orderBy: {
          name: 'asc'
        }
      })
    } else {
      // Regular user can only access their assigned tenant(s)
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          tenant: true,
          userRoles: {
            include: {
              role: {
                include: {
                  tenant: true
                }
              }
            }
          }
        }
      })

      if (user) {
        const tenantIds = new Set<string>()
        
        // Add user's primary tenant
        if (user.tenantId) {
          tenantIds.add(user.tenantId)
        }

        // Add tenants from user roles
        user.userRoles.forEach(userRole => {
          if (userRole.role.tenantId) {
            tenantIds.add(userRole.role.tenantId)
          }
        })

        tenants = await prisma.tenant.findMany({
          where: {
            id: {
              in: Array.from(tenantIds)
            }
          },
          select: {
            id: true,
            name: true,
            domain: true,
            subdomain: true,
            settings: true
          },
          orderBy: {
            name: 'asc'
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      tenants,
      isSuperAdmin
    })

  } catch (error) {
    console.error('Error loading available tenants:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Mandanten' },
      { status: 500 }
    )
  }
}
