const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkDemoUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'sarah.weber@wegroup.de' },
      include: {
        userRoles: {
          include: { role: true }
        }
      }
    })
    
    if (user) {
      console.log('✅ Dr. Sarah Weber existiert in der Datenbank!')
      console.log('User ID:', user.id)
      console.log('Email:', user.email) 
      console.log('Tenant ID:', user.tenantId)
      console.log('Rollen:', user.userRoles.map(ur => ur.role.name))
    } else {
      console.log('❌ Dr. Sarah Weber wurde NICHT in der Datenbank gefunden!')
    }
  } catch (error) {
    console.error('Fehler:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkDemoUser()
