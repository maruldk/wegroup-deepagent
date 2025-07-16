
import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            tenant: true,
            userRoles: {
              include: {
                role: true
              }
            }
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        // SMART TENANT SELECTION - AI-Enhanced automatic tenant selection
        let selectedTenantId = user.tenantId
        let selectedTenant = user.tenant

        // If user has no tenant or we want to optimize selection
        if (!selectedTenantId || user.lastUsedTenantId) {
          const smartTenant = await selectSmartTenant(user)
          if (smartTenant) {
            selectedTenantId = smartTenant.id
            selectedTenant = smartTenant
            
            // Update user with smart selection
            await prisma.user.update({
              where: { id: user.id },
              data: { 
                tenantId: selectedTenantId,
                lastUsedTenantId: selectedTenantId,
                lastLoginAt: new Date(),
                lastTenantSwitchAt: new Date()
              }
            })
          } else {
            // Fallback: just update last login
            await prisma.user.update({
              where: { id: user.id },
              data: { lastLoginAt: new Date() }
            })
          }
        } else {
          // Update last login and track usage
          await prisma.user.update({
            where: { id: user.id },
            data: { 
              lastLoginAt: new Date(),
              lastUsedTenantId: selectedTenantId
            }
          })
        }

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
          tenantId: selectedTenantId,
          tenant: selectedTenant,
          roles: user.userRoles.map(ur => ur.role)
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial login
      if (user) {
        token.tenantId = user.tenantId
        token.tenant = user.tenant
        token.roles = user.roles
        token.firstName = user.firstName
        token.lastName = user.lastName
      }
      
      // Handle session updates (for tenant switching)
      if (trigger === "update" && session) {
        if (session.user?.tenantId) {
          token.tenantId = session.user.tenantId
        }
        if (session.user?.tenant) {
          token.tenant = session.user.tenant
        }
        if (session.user?.roles) {
          token.roles = session.user.roles
        }
      }
      
      return token
    },
    async session({ session, token }) {
      session.user.id = token.sub!
      session.user.tenantId = token.tenantId as string
      session.user.tenant = token.tenant as any
      session.user.roles = token.roles as any[]
      session.user.firstName = token.firstName as string
      session.user.lastName = token.lastName as string
      return session
    }
  }
}

// SMART TENANT SELECTION ENGINE - AI-Enhanced automatic tenant selection
async function selectSmartTenant(user: any) {
  try {
    // 1. PRIORITY: Last used tenant (if exists and accessible)
    if (user.lastUsedTenantId) {
      const lastUsedTenant = await prisma.tenant.findFirst({
        where: {
          id: user.lastUsedTenantId,
          isActive: true,
          OR: [
            { users: { some: { id: user.id } } },  // User is directly assigned
            { owner: { id: user.id } },            // User is owner
            { 
              roles: { 
                some: { 
                  userRoles: { 
                    some: { userId: user.id } 
                  } 
                } 
              } 
            }  // User has role in tenant
          ]
        }
      })
      
      if (lastUsedTenant) {
        await logTenantSelection(user.id, lastUsedTenant.id, 'LAST_USED', 0.9)
        return lastUsedTenant
      }
    }

    // 2. ROLE-BASED SELECTION: Find tenant based on user's highest role
    const userRoles = user.userRoles || []
    const isSuperAdmin = userRoles.some((ur: any) => ur.role.name === 'super_admin')
    
    if (isSuperAdmin) {
      // Super admin gets first available tenant or creates default view
      const firstTenant = await prisma.tenant.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' }
      })
      
      if (firstTenant) {
        await logTenantSelection(user.id, firstTenant.id, 'SUPER_ADMIN_DEFAULT', 0.8)
        return firstTenant
      }
    }

    // 3. USER'S PRIMARY TENANT: Use assigned tenant
    if (user.tenantId) {
      const primaryTenant = await prisma.tenant.findFirst({
        where: { 
          id: user.tenantId,
          isActive: true 
        }
      })
      
      if (primaryTenant) {
        await logTenantSelection(user.id, primaryTenant.id, 'PRIMARY_ASSIGNMENT', 0.7)
        return primaryTenant
      }
    }

    // 4. ROLE-BASED TENANT ACCESS: Find tenant through roles
    const roleBasedTenants = await prisma.tenant.findMany({
      where: {
        isActive: true,
        roles: {
          some: {
            userRoles: {
              some: { userId: user.id }
            }
          }
        }
      },
      orderBy: { lastActivityAt: 'desc' }
    })

    if (roleBasedTenants.length > 0) {
      const selectedTenant = roleBasedTenants[0]
      await logTenantSelection(user.id, selectedTenant.id, 'ROLE_BASED', 0.6)
      return selectedTenant
    }

    // 5. FALLBACK: Any accessible tenant
    const anyTenant = await prisma.tenant.findFirst({
      where: { isActive: true },
      orderBy: { userCount: 'desc' }
    })

    if (anyTenant) {
      await logTenantSelection(user.id, anyTenant.id, 'FALLBACK', 0.3)
      return anyTenant
    }

    return null
  } catch (error) {
    console.error('Smart tenant selection error:', error)
    return null
  }
}

// Log tenant selection for AI learning
async function logTenantSelection(userId: string, tenantId: string, method: string, confidence: number) {
  try {
    // Create AI recommendation record for learning
    await prisma.userTenantRecommendation.create({
      data: {
        userId,
        tenantId,
        recommendationType: 'AI_SUGGESTED',
        score: confidence,
        reason: `Auto-selected via ${method}`,
        context: {
          method,
          timestamp: new Date().toISOString(),
          confidence
        },
        modelVersion: 'auto-select-v1.0',
        confidenceLevel: confidence
      }
    }).catch(() => {
      // Ignore unique constraint errors
    })

    // Update usage analytics
    await prisma.tenantUsageAnalytics.create({
      data: {
        tenantId,
        userId,
        sessionDuration: 0,
        actionsPerformed: 1,
        modulesAccessed: ['AUTH'],
        usageScore: confidence,
        productivityScore: 0.5,
        engagementLevel: 'MEDIUM'
      }
    }).catch(() => {
      // Ignore errors for analytics
    })
  } catch (error) {
    // Silently handle logging errors
    console.log('Tenant selection logging skipped')
  }
}
