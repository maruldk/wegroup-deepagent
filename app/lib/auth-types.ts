
import { DefaultSession } from "next-auth"
import { Tenant, Role } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      tenantId: string | null
      tenant: Tenant | null
      roles: Role[]
      firstName: string | null
      lastName: string | null
    } & DefaultSession["user"]
  }

  interface User {
    tenantId: string | null
    tenant: Tenant | null
    roles: Role[]
    firstName: string | null
    lastName: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tenantId: string | null
    tenant: Tenant | null
    roles: Role[]
    firstName: string | null
    lastName: string | null
  }
}
