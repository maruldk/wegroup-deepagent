import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function fixDemoUsers() {
  console.log('🔧 Fixing demo users and roles...')
  
  try {
    // 1. Update Dr. Sarah Weber to Super Admin
    console.log('1. Making Dr. Sarah Weber a Super Admin...')
    
    // Find Sarah Weber
    const sarahUser = await prisma.user.findUnique({
      where: { email: 'sarah.weber@wegroup.de' },
      include: { userRoles: { include: { role: true } } }
    })
    
    if (sarahUser) {
      // Remove existing tenant_admin role
      await prisma.userRole.deleteMany({
        where: { userId: sarahUser.id }
      })
      
      // Find or create super_admin role
      let superAdminRole = await prisma.role.findFirst({
        where: { 
          name: 'super_admin',
          tenantId: null 
        }
      })
      
      if (!superAdminRole) {
        superAdminRole = await prisma.role.create({
          data: {
            name: 'super_admin',
            description: 'Super Administrator with full system access',
            permissions: JSON.stringify(['*']),
            isSystem: true,
            tenantId: null
          }
        })
      }
      
      // Assign super_admin role to Sarah
      await prisma.userRole.create({
        data: {
          userId: sarahUser.id,
          roleId: superAdminRole.id
        }
      })
      
      // Update Sarah's tenant to null (super admin has no tenant restriction)
      await prisma.user.update({
        where: { id: sarahUser.id },
        data: { tenantId: null }
      })
      
      console.log('✅ Dr. Sarah Weber is now Super Admin')
    }
    
    // 2. Create missing demo users that are listed in the simulator
    console.log('\n2. Creating missing demo users...')
    
    const demoUsersToCreate = [
      {
        firstName: 'Michael',
        lastName: 'Bauer', 
        email: 'm.bauer@techcorp.de',
        role: 'tenant_admin',
        tenantDomain: 'wfs-fulfillment.de'
      },
      {
        firstName: 'Angela',
        lastName: 'Fischer',
        email: 'a.fischer@globallogistics.de', 
        role: 'tenant_admin',
        tenantDomain: 'abundance.de'
      },
      {
        firstName: 'Thomas',
        lastName: 'Hartmann',
        email: 't.hartmann@techcorp.de',
        role: 'c_level',
        tenantDomain: 'wfs-fulfillment.de'
      },
      {
        firstName: 'Dr. Petra',
        lastName: 'Schneider',
        email: 'p.schneider@globallogistics.de',
        role: 'c_level', 
        tenantDomain: 'abundance.de'
      }
    ]
    
    for (const userData of demoUsersToCreate) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })
      
      if (!existingUser) {
        // Find the tenant
        const tenant = await prisma.tenant.findFirst({
          where: { 
            domain: { contains: userData.tenantDomain }
          }
        })
        
        const hashedPassword = await bcrypt.hash('demo123', 10)
        
        // Create user
        const newUser = await prisma.user.create({
          data: {
            email: userData.email,
            password: hashedPassword,
            firstName: userData.firstName,
            lastName: userData.lastName,
            tenantId: tenant?.id || null,
            isActive: true
          }
        })
        
        // Find role
        const role = await prisma.role.findFirst({
          where: {
            name: userData.role,
            tenantId: tenant?.id || null
          }
        })
        
        if (role) {
          await prisma.userRole.create({
            data: {
              userId: newUser.id,
              roleId: role.id
            }
          })
        }
        
        console.log(`✅ Created user: ${userData.firstName} ${userData.lastName} (${userData.email})`)
      } else {
        console.log(`⏭️  User already exists: ${userData.email}`)
      }
    }
    
    // 3. Update demo user simulator list to include the working admin user
    console.log('\n3. Demo user list will be updated to include functional accounts...')
    
    console.log('\n🎉 Demo users fixed successfully!')
    console.log('\n📋 WORKING DEMO ACCOUNTS:')
    console.log('=' .repeat(60))
    console.log('🔥 SUPER ADMIN:')
    console.log('   👤 Dr. Sarah Weber (sarah.weber@wegroup.de)')
    console.log('   🔑 Password: demo123')
    console.log('   ⚡ Role: Super-Administrator')
    console.log('')
    console.log('🔧 TENANT ADMINS:')
    console.log('   👤 John Doe (john@doe.com)')
    console.log('   🔑 Password: johndoe123')
    console.log('   ⚡ Role: Tenant Administrator')
    console.log('')
    console.log('   👤 Admin User (admin@wegroup.demo)')
    console.log('   🔑 Password: admin123')
    console.log('   ⚡ Role: Super Admin (Legacy)')
    console.log('')
    console.log('👥 C-LEVEL:')
    console.log('   👤 Maria Schmidt (ceo@wegroup.demo)')
    console.log('   🔑 Password: ceo123')
    console.log('   ⚡ Role: C-Level Executive')
    console.log('')
    console.log('🧑‍💼 MANAGERS:')
    console.log('   👤 Thomas Weber (manager@wegroup.demo)')
    console.log('   🔑 Password: manager123')
    console.log('   ⚡ Role: Manager')
    console.log('')
    console.log('👷 EMPLOYEES:')
    console.log('   👤 Anna Müller (employee@wegroup.demo)')
    console.log('   🔑 Password: employee123')
    console.log('   ⚡ Role: Employee')
    
  } catch (error) {
    console.error('❌ Error fixing demo users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixDemoUsers()
