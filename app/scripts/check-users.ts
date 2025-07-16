import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUsers() {
  console.log('🔍 Checking existing users in database...')
  
  // Get all users
  const users = await prisma.user.findMany({
    include: {
      userRoles: {
        include: {
          role: true
        }
      },
      tenant: true
    }
  })
  
  console.log(`\n📊 Found ${users.length} users:`)
  console.log('=' .repeat(80))
  
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`)
    console.log(`   Tenant: ${user.tenant?.name || 'No Tenant'}`)
    console.log(`   Roles: ${user.userRoles.map(ur => ur.role.name).join(', ') || 'No Roles'}`)
    console.log(`   Active: ${user.isActive}`)
    console.log(`   Last Login: ${user.lastLoginAt || 'Never'}`)
    console.log('')
  })
  
  // Get all demo users
  const demoUsers = await prisma.demoUser.findMany()
  console.log(`\n📱 Found ${demoUsers.length} demo users:`)
  console.log('=' .repeat(80))
  
  demoUsers.forEach((demoUser, index) => {
    console.log(`${index + 1}. ${demoUser.name} (${demoUser.email})`)
    console.log(`   Role: ${demoUser.role}`)
    console.log(`   Company: ${demoUser.company}`)
    console.log(`   Tenant: ${demoUser.tenant}`)
    console.log('')
  })
  
  await prisma.$disconnect()
}

checkUsers().catch(console.error)
