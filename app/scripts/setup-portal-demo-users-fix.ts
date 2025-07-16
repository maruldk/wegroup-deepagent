
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function setupPortalDemoUsers() {
  console.log('🔧 Portal-Demo-User-Setup wird gestartet...')

  try {
    // Demo-User-Definitionen
    const portalDemoUsers = [
      {
        id: 'customer-demo',
        name: 'Anna Schmidt',
        email: 'customer.demo@wegroup.com',
        role: 'customer',
        company: 'Beispiel-Kunde GmbH',
        tenantName: 'WeGroup Demo',
        password: 'demo123',
        avatar: 'https://cdn.abacus.ai/images/c3fd76c3-b844-4e69-b455-711dbdf01043.png'
      },
      {
        id: 'supplier-demo',
        name: 'Thomas Müller',
        email: 'supplier.demo@wegroup.com',
        role: 'supplier',
        company: 'Lieferant Solutions GmbH',
        tenantName: 'WeGroup Demo',
        password: 'demo123',
        avatar: 'https://cdn.abacus.ai/images/c8412680-e25d-45e8-8aed-cb744132bfe8.png'
      }
    ]

    for (const demoUser of portalDemoUsers) {
      console.log(`\n📝 Verarbeite ${demoUser.name} (${demoUser.email})...`)

      // 1. Finde oder erstelle den Tenant
      let tenant = await prisma.tenant.findFirst({
        where: { name: demoUser.tenantName }
      })

      if (!tenant) {
        console.log(`📁 Erstelle Tenant: ${demoUser.tenantName}`)
        tenant = await prisma.tenant.create({
          data: {
            name: demoUser.tenantName,
            domain: `${demoUser.tenantName.toLowerCase().replace(/[^a-z0-9]/g, '')}.demo`,
            subdomain: demoUser.tenantName.toLowerCase().replace(/[^a-z0-9]/g, ''),
            settings: {
              theme: 'blue',
              features: ['hr', 'finance', 'logistics', 'customer-portal', 'supplier-portal']
            }
          }
        })
      }

      console.log(`✅ Tenant gefunden/erstellt: ${tenant.name} (ID: ${tenant.id})`)

      // 2. Finde oder erstelle die Rolle
      let role = await prisma.role.findFirst({
        where: {
          name: demoUser.role,
          tenantId: tenant.id
        }
      })

      if (!role) {
        console.log(`🔐 Erstelle Rolle: ${demoUser.role}`)
        const permissions = demoUser.role === 'customer' 
          ? ['view_orders', 'create_requests', 'view_quotes']
          : ['view_rfqs', 'submit_quotes', 'manage_orders']

        role = await prisma.role.create({
          data: {
            name: demoUser.role,
            description: `${demoUser.role} Portal User`,
            permissions: JSON.stringify(permissions),
            isSystem: false,
            tenantId: tenant.id
          }
        })
      }

      console.log(`✅ Rolle gefunden/erstellt: ${role.name} (ID: ${role.id})`)

      // 3. Finde oder erstelle den User
      let user = await prisma.user.findUnique({
        where: { email: demoUser.email },
        include: {
          userRoles: {
            include: { role: true }
          }
        }
      })

      const hashedPassword = await bcrypt.hash(demoUser.password, 12)

      if (!user) {
        console.log(`👤 Erstelle User: ${demoUser.name}`)
        user = await prisma.user.create({
          data: {
            email: demoUser.email,
            password: hashedPassword,
            firstName: demoUser.name.split(' ')[0],
            lastName: demoUser.name.split(' ').slice(1).join(' '),
            image: demoUser.avatar,
            tenantId: tenant.id,
            isActive: true
          },
          include: {
            userRoles: {
              include: { role: true }
            }
          }
        })
      } else {
        console.log(`👤 User existiert bereits: ${demoUser.name}`)
        // Aktualisiere Passwort und Avatar falls nötig
        await prisma.user.update({
          where: { id: user.id },
          data: {
            password: hashedPassword,
            image: demoUser.avatar,
            tenantId: tenant.id
          }
        })
      }

      console.log(`✅ User gefunden/erstellt: ${user.firstName} ${user.lastName} (ID: ${user.id})`)

      // 4. Stelle sicher, dass User die richtige Rolle hat
      const hasRole = user.userRoles.some(ur => ur.role.name === demoUser.role)

      if (!hasRole) {
        console.log(`🔗 Weise Rolle ${demoUser.role} zu...`)
        
        // Lösche alte Rollen für diesen User im Tenant (falls vorhanden)
        await prisma.userRole.deleteMany({
          where: {
            userId: user.id,
            role: { tenantId: tenant.id }
          }
        })

        // Füge neue Rolle hinzu
        await prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: role.id
          }
        })

        console.log(`✅ Rolle ${demoUser.role} erfolgreich zugewiesen`)
      } else {
        console.log(`✅ User hat bereits die Rolle ${demoUser.role}`)
      }

      console.log(`✨ ${demoUser.name} erfolgreich eingerichtet!`)
    }

    console.log('\n🎉 Portal-Demo-User-Setup abgeschlossen!')

    // Validierung
    console.log('\n🔍 Validierung der Portal-Demo-User...')
    for (const demoUser of portalDemoUsers) {
      const user = await prisma.user.findUnique({
        where: { email: demoUser.email },
        include: {
          tenant: true,
          userRoles: {
            include: { role: true }
          }
        }
      })

      if (user) {
        const roleNames = user.userRoles.map(ur => ur.role.name)
        console.log(`✅ ${user.firstName} ${user.lastName} - Email: ${user.email} - Rollen: ${roleNames.join(', ')} - Tenant: ${user.tenant?.name}`)
      } else {
        console.log(`❌ User ${demoUser.email} nicht gefunden!`)
      }
    }

  } catch (error) {
    console.error('❌ Fehler beim Portal-Demo-User-Setup:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Script ausführen
setupPortalDemoUsers()
  .then(() => {
    console.log('\n✨ Portal-Demo-User-Setup erfolgreich abgeschlossen!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Fehler beim Portal-Demo-User-Setup:', error)
    process.exit(1)
  })
