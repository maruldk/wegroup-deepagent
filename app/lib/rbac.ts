
import { prisma } from "@/lib/db"
import { Role, Permission } from "@prisma/client"

export type UserPermissions = {
  canRead: boolean
  canWrite: boolean
  canDelete: boolean
  canAdmin: boolean
}

export const SYSTEM_ROLES = {
  SUPER_ADMIN: "super_admin",
  TENANT_ADMIN: "tenant_admin", 
  C_LEVEL: "c_level",
  MANAGER: "manager",
  EMPLOYEE: "employee",
  CLIENT: "client",
  SUPPLIER: "supplier"
} as const

export const PERMISSIONS = {
  // User Management
  USER_READ: "user:read",
  USER_WRITE: "user:write", 
  USER_DELETE: "user:delete",
  USER_ADMIN: "user:admin",
  
  // Tenant Management
  TENANT_READ: "tenant:read",
  TENANT_WRITE: "tenant:write",
  TENANT_ADMIN: "tenant:admin",
  
  // Module Permissions
  HR_READ: "hr:read",
  HR_WRITE: "hr:write",
  HR_ADMIN: "hr:admin",
  
  FINANCE_READ: "finance:read",
  FINANCE_WRITE: "finance:write", 
  FINANCE_ADMIN: "finance:admin",
  
  LOGISTICS_READ: "logistics:read",
  LOGISTICS_WRITE: "logistics:write",
  LOGISTICS_ADMIN: "logistics:admin"
} as const

export async function createSystemRoles(tenantId: string) {
  const roles = [
    {
      name: SYSTEM_ROLES.TENANT_ADMIN,
      description: "Tenant Administrator with full tenant access",
      permissions: [
        PERMISSIONS.USER_READ, PERMISSIONS.USER_WRITE, PERMISSIONS.USER_DELETE,
        PERMISSIONS.TENANT_READ, PERMISSIONS.TENANT_WRITE,
        PERMISSIONS.HR_ADMIN, PERMISSIONS.FINANCE_ADMIN, PERMISSIONS.LOGISTICS_ADMIN
      ],
      isSystem: true,
      tenantId
    },
    {
      name: SYSTEM_ROLES.C_LEVEL,
      description: "C-Level Executive with high-level access",
      permissions: [
        PERMISSIONS.USER_READ, PERMISSIONS.USER_WRITE,
        PERMISSIONS.HR_READ, PERMISSIONS.HR_WRITE,
        PERMISSIONS.FINANCE_READ, PERMISSIONS.FINANCE_WRITE,
        PERMISSIONS.LOGISTICS_READ, PERMISSIONS.LOGISTICS_WRITE
      ],
      isSystem: true,
      tenantId
    },
    {
      name: SYSTEM_ROLES.MANAGER,
      description: "Manager with team management access",
      permissions: [
        PERMISSIONS.USER_READ,
        PERMISSIONS.HR_READ, PERMISSIONS.HR_WRITE,
        PERMISSIONS.FINANCE_READ,
        PERMISSIONS.LOGISTICS_READ, PERMISSIONS.LOGISTICS_WRITE
      ],
      isSystem: true,
      tenantId
    },
    {
      name: SYSTEM_ROLES.EMPLOYEE,
      description: "Employee with basic access",
      permissions: [
        PERMISSIONS.HR_READ,
        PERMISSIONS.FINANCE_READ,
        PERMISSIONS.LOGISTICS_READ
      ],
      isSystem: true,
      tenantId
    }
  ]

  for (const roleData of roles) {
    await prisma.role.upsert({
      where: {
        name_tenantId: {
          name: roleData.name,
          tenantId: roleData.tenantId
        }
      },
      create: {
        ...roleData,
        permissions: JSON.stringify(roleData.permissions)
      },
      update: {
        permissions: JSON.stringify(roleData.permissions)
      }
    })
  }
}

export async function hasPermission(
  userId: string, 
  permission: string,
  tenantId?: string
): Promise<boolean> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: {
      role: true
    }
  })

  for (const userRole of userRoles) {
    const rolePermissions = Array.isArray(userRole.role.permissions) 
      ? userRole.role.permissions as string[]
      : JSON.parse(userRole.role.permissions as string) as string[]
      
    if (rolePermissions.includes(permission)) {
      return true
    }
  }

  return false
}

export function getUserPermissions(roles: Role[]): UserPermissions {
  const permissions = roles.flatMap(role => {
    const rolePermissions = Array.isArray(role.permissions) 
      ? role.permissions as string[]
      : JSON.parse(role.permissions as string) as string[]
    return rolePermissions
  })
  
  return {
    canRead: permissions.some(p => p.includes(":read")),
    canWrite: permissions.some(p => p.includes(":write")),
    canDelete: permissions.some(p => p.includes(":delete")),
    canAdmin: permissions.some(p => p.includes(":admin"))
  }
}
