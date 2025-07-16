
import { prisma } from '../lib/db'
import bcrypt from 'bcryptjs'

async function setupPortalDemoUsers() {
  console.log('=== SETTING UP PORTAL DEMO USERS ===')
  
  try {
    // 1. Create customer role if it doesn't exist
    let customerRole = await prisma.role.findFirst({
      where: { name: 'customer' }
    })
    
    if (!customerRole) {
      customerRole = await prisma.role.create({
        data: {
          name: 'customer',
          description: 'Customer Portal User - Access to customer portal and order management',
          permissions: ['CUSTOMER_PORTAL_ACCESS', 'VIEW_ORDERS', 'CREATE_REQUESTS', 'VIEW_QUOTES'],
          isSystem: false,
          tenantId: null // Global role
        }
      })
      console.log('✅ Customer role created:', customerRole.id)
    } else {
      console.log('✅ Customer role exists:', customerRole.id)
    }
    
    // 2. Create supplier role if it doesn't exist
    let supplierRole = await prisma.role.findFirst({
      where: { name: 'supplier' }
    })
    
    if (!supplierRole) {
      supplierRole = await prisma.role.create({
        data: {
          name: 'supplier',
          description: 'Supplier Portal User - Access to supplier portal and RFQ management',
          permissions: ['SUPPLIER_PORTAL_ACCESS', 'VIEW_RFQS', 'SUBMIT_QUOTES', 'MANAGE_ORDERS'],
          isSystem: false,
          tenantId: null // Global role
        }
      })
      console.log('✅ Supplier role created:', supplierRole.id)
    } else {
      console.log('✅ Supplier role exists:', supplierRole.id)
    }
    
    // 3. Get customer demo user
    const customerDemo = await prisma.user.findUnique({
      where: { email: 'customer.demo@wegroup.com' },
      include: { userRoles: true }
    })
    
    if (customerDemo) {
      // Remove existing roles
      await prisma.userRole.deleteMany({
        where: { userId: customerDemo.id }
      })
      
      // Assign customer role
      await prisma.userRole.create({
        data: {
          userId: customerDemo.id,
          roleId: customerRole.id
        }
      })
      
      // Update user profile
      await prisma.user.update({
        where: { id: customerDemo.id },
        data: {
          firstName: 'Anna',
          lastName: 'Schmidt',
          image: '/avatars/anna-schmidt.jpg'
        }
      })
      
      console.log('✅ Customer demo user updated with customer role')
    }
    
    // 4. Get supplier demo user
    const supplierDemo = await prisma.user.findUnique({
      where: { email: 'supplier.demo@wegroup.com' },
      include: { userRoles: true }
    })
    
    if (supplierDemo) {
      // Remove existing roles
      await prisma.userRole.deleteMany({
        where: { userId: supplierDemo.id }
      })
      
      // Assign supplier role
      await prisma.userRole.create({
        data: {
          userId: supplierDemo.id,
          roleId: supplierRole.id
        }
      })
      
      // Update user profile
      await prisma.user.update({
        where: { id: supplierDemo.id },
        data: {
          firstName: 'Thomas',
          lastName: 'Müller',
          image: '/avatars/thomas-mueller.jpg'
        }
      })
      
      console.log('✅ Supplier demo user updated with supplier role')
    }
    
    // 5. Verify setup
    console.log('\n=== VERIFICATION ===')
    
    const customerVerify = await prisma.user.findUnique({
      where: { email: 'customer.demo@wegroup.com' },
      include: { 
        userRoles: { include: { role: true } },
        tenant: true
      }
    })
    
    console.log('Customer Demo User:', customerVerify ? {
      id: customerVerify.id,
      email: customerVerify.email,
      name: `${customerVerify.firstName} ${customerVerify.lastName}`,
      roles: customerVerify.userRoles.map(ur => ur.role.name),
      tenant: customerVerify.tenant?.name
    } : 'NOT FOUND')
    
    const supplierVerify = await prisma.user.findUnique({
      where: { email: 'supplier.demo@wegroup.com' },
      include: { 
        userRoles: { include: { role: true } },
        tenant: true
      }
    })
    
    console.log('Supplier Demo User:', supplierVerify ? {
      id: supplierVerify.id,
      email: supplierVerify.email,
      name: `${supplierVerify.firstName} ${supplierVerify.lastName}`,
      roles: supplierVerify.userRoles.map(ur => ur.role.name),
      tenant: supplierVerify.tenant?.name
    } : 'NOT FOUND')
    
    console.log('\n✅ Portal demo users setup completed!')
    
  } catch (error) {
    console.error('❌ Error setting up portal demo users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupPortalDemoUsers().catch(console.error)
