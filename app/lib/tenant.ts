
import { prisma } from "@/lib/db"
import { Tenant } from "@prisma/client"

export async function getTenantByDomain(domain: string): Promise<Tenant | null> {
  return await prisma.tenant.findFirst({
    where: {
      OR: [
        { domain },
        { subdomain: domain }
      ]
    }
  })
}

export async function createTenant(data: {
  name: string
  domain: string
  subdomain?: string
}): Promise<Tenant> {
  return await prisma.tenant.create({
    data: {
      ...data,
      settings: {},
      modules: {
        create: [
          { moduleType: "HR", isActive: true },
          { moduleType: "FINANCE", isActive: true },
          { moduleType: "LOGISTICS", isActive: true },
          { moduleType: "ANALYTICS", isActive: true }
        ]
      }
    },
    include: {
      modules: true
    }
  })
}

export async function getTenantModules(tenantId: string) {
  return await prisma.tenantModule.findMany({
    where: {
      tenantId,
      isActive: true
    }
  })
}
