
import { prisma } from '../lib/db'

async function checkPortalDemoUsers() {
  console.log('=== CHECKING PORTAL DEMO USERS ===')
  
  // Check customer demo user
  const customerDemo = await prisma.user.findUnique({
    where: { email: 'customer.demo@wegroup.com' },
    include: { 
      userRoles: { include: { role: true } },
      tenant: true
    }
  })
  
  console.log('Customer Demo User:', customerDemo ? {
    id: customerDemo.id,
    email: customerDemo.email,
    name: `${customerDemo.firstName} ${customerDemo.lastName}`,
    roles: customerDemo.userRoles.map(ur => ur.role.name),
    tenant: customerDemo.tenant?.name
  } : 'NOT FOUND')
  
  // Check supplier demo user
  const supplierDemo = await prisma.user.findUnique({
    where: { email: 'supplier.demo@wegroup.com' },
    include: { 
      userRoles: { include: { role: true } },
      tenant: true
    }
  })
  
  console.log('Supplier Demo User:', supplierDemo ? {
    id: supplierDemo.id,
    email: supplierDemo.email,
    name: `${supplierDemo.firstName} ${supplierDemo.lastName}`,
    roles: supplierDemo.userRoles.map(ur => ur.role.name),
    tenant: supplierDemo.tenant?.name
  } : 'NOT FOUND')
  
  // Check available roles
  const roles = await prisma.role.findMany({
    select: { id: true, name: true, description: true }
  })
  
  console.log('Available Roles:', roles)
  
  await prisma.$disconnect()
}

checkPortalDemoUsers().catch(console.error)
