
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

// Synchronisierte Demo Users - EXAKT gleiche Daten wie im Frontend
const demoUsers: Record<string, any> = {
  // PORTAL USERS
  "customer-demo": {
    id: "customer-demo",
    name: "Anna Schmidt",
    email: "customer.demo@wegroup.com",
    role: "Kunde",
    roleCategory: "portals",
    company: "Beispiel-Kunde GmbH",
    tenant: "WeGroup Demo",
    tenantType: "Customer Portal",
    businessArea: "Kundenportal",
    avatar: "AS",
    permissions: ["Aufträge anzeigen", "Anfragen erstellen", "Angebote einsehen"],
    description: "Demo-Zugang zum Kundenportal",
    demoPassword: "demo123",
    portalType: "customer"
  },
  "supplier-demo": {
    id: "supplier-demo",
    name: "Thomas Müller",
    email: "supplier.demo@wegroup.com",
    role: "Lieferant",
    roleCategory: "portals",
    company: "Lieferant Solutions GmbH",
    tenant: "WeGroup Demo",
    tenantType: "Supplier Portal",
    businessArea: "Lieferantenportal",
    avatar: "TM",
    permissions: ["RFQs anzeigen", "Angebote abgeben", "Aufträge verwalten"],
    description: "Demo-Zugang zum Lieferantenportal",
    demoPassword: "demo123",
    portalType: "supplier"
  },
  // ADMINISTRATORS
  "super-admin-1": {
    id: "super-admin-1",
    name: "Dr. Sarah Weber",
    email: "sarah.weber@wegroup.de",
    role: "Super-Administrator",
    roleCategory: "administrators",
    company: "WeGroup Central",
    tenant: "Alle Mandanten",
    tenantType: "WeGROUP GmbH",
    businessArea: "System Administration",
    avatar: "SW",
    permissions: ["Alle Rechte", "Mandanten-übergreifend", "System-Administration"],
    description: "Vollzugriff auf alle Module und Mandanten",
    demoPassword: "demo123"
  },
  "legacy-super-admin": {
    id: "legacy-super-admin",
    name: "Admin User",
    email: "admin@wegroup.demo",
    role: "Super-Administrator (Legacy)",
    roleCategory: "administrators",
    company: "WeGroup Demo",
    tenant: "System-Level",
    tenantType: "System Administrator",
    businessArea: "System Administration",
    avatar: "AD",
    permissions: ["System-Administration", "Alle Rechte", "Legacy-Support"],
    description: "Legacy Super-Admin mit vollem Systemzugriff",
    demoPassword: "admin123"
  },
  "tenant-admin-1": {
    id: "tenant-admin-1", 
    name: "John Doe",
    email: "john@doe.com",
    role: "Mandanten-Administrator",
    roleCategory: "administrators",
    company: "WeGroup Demo",
    tenant: "WeGroup Demo",
    tenantType: "WeGroup Demo Tenant",
    businessArea: "Demo Administration",
    avatar: "JD",
    permissions: ["Mandanten-Administration", "Benutzer-Management", "Demo-Funktionen"],
    description: "Haupttest-Account mit Mandanten-Administration",
    demoPassword: "johndoe123"
  },
  "tenant-admin-2": {
    id: "tenant-admin-2", 
    name: "Michael Bauer",
    email: "m.bauer@techcorp.de",
    role: "Mandanten-Administrator",
    roleCategory: "administrators",
    company: "TechCorp Solutions",
    tenant: "WFS Fulfillment Solutions",
    tenantType: "WFS Fulfillment Solutions GmbH",
    businessArea: "Technology Solutions",
    avatar: "MB",
    permissions: ["Mandanten-Administration", "Benutzer-Management", "Module-Konfiguration"],
    description: "Vollzugriff innerhalb des WFS Mandanten",
    demoPassword: "demo123"
  },
  "tenant-admin-3": {
    id: "tenant-admin-3",
    name: "Angela Fischer",
    email: "a.fischer@globallogistics.de", 
    role: "Mandanten-Administrator",
    roleCategory: "administrators",
    company: "Global Logistics GmbH",
    tenant: "Abundance GH",
    tenantType: "Abundance GH",
    businessArea: "Logistics & Holdings",
    avatar: "AF",
    permissions: ["Mandanten-Administration", "Benutzer-Management", "Logistics-Module"],
    description: "Vollzugriff innerhalb des Abundance Mandanten",
    demoPassword: "demo123"
  },
  // C-LEVEL
  "ceo-1": {
    id: "ceo-1",
    name: "Maria Schmidt",
    email: "ceo@wegroup.demo",
    role: "Geschäftsführer",
    roleCategory: "clevel",
    company: "WeGroup Demo",
    tenant: "WeGroup Demo",
    tenantType: "WeGroup Demo Tenant",
    businessArea: "Executive Leadership",
    avatar: "MS",
    permissions: ["Executive Dashboard", "Finanz-Reports", "Strategische Planung"],
    description: "C-Level Zugriff mit strategischen Entscheidungsrechten",
    demoPassword: "ceo123"
  },
  "ceo-2": {
    id: "ceo-2",
    name: "Thomas Hartmann",
    email: "t.hartmann@techcorp.de",
    role: "Geschäftsführer",
    roleCategory: "clevel",
    company: "TechCorp Solutions",
    tenant: "WFS Fulfillment Solutions",
    tenantType: "WFS Fulfillment Solutions GmbH",
    businessArea: "Technology Leadership",
    avatar: "TH",
    permissions: ["Executive Dashboard", "Finanz-Reports", "Strategische Planung"],
    description: "C-Level Zugriff mit strategischen Entscheidungsrechten",
    demoPassword: "demo123"
  },
  "cfo-1": {
    id: "cfo-1",
    name: "Dr. Petra Schneider",
    email: "p.schneider@globallogistics.de",
    role: "Finanzvorstand",
    roleCategory: "clevel",
    company: "Global Logistics GmbH", 
    tenant: "Abundance GH",
    tenantType: "Abundance GH",
    businessArea: "Finance & Investment",
    avatar: "PS",
    permissions: ["Finance-Module", "Budget-Planning", "Cost-Center Management"],
    description: "Finanzverantwortung und Budget-Kontrolle",
    demoPassword: "demo123"
  },
  // MANAGEMENT
  "manager-1": {
    id: "manager-1",
    name: "Thomas Weber",
    email: "manager@wegroup.demo",
    role: "Abteilungsleiter",
    roleCategory: "management",
    company: "WeGroup Demo",
    tenant: "WeGroup Demo",
    tenantType: "WeGroup Demo Tenant",
    businessArea: "Team Management",
    avatar: "TW",
    permissions: ["Team-Management", "Projekt-Verwaltung", "Reporting"],
    description: "Management-Zugriff mit Team-Führungsrechten",
    demoPassword: "manager123"
  },
  "hr-manager-1": {
    id: "hr-manager-1",
    name: "Klaus Zimmermann",
    email: "admin@wfs-fulfillment.de",
    role: "Administrator",
    roleCategory: "management",
    company: "WFS Fulfillment Solutions",
    tenant: "WFS Fulfillment Solutions",
    tenantType: "WFS Fulfillment Solutions GmbH",
    businessArea: "Administration",
    avatar: "KZ",
    permissions: ["Administration", "Benutzer-Verwaltung", "System-Konfiguration"],
    description: "Vollzugriff auf WFS Fulfillment Solutions",
    demoPassword: "demo123"
  },
  "dept-manager-1": {
    id: "dept-manager-1",
    name: "Maria Schmidt",
    email: "admin@abundance.de",
    role: "Administrator",
    roleCategory: "management",
    company: "Abundance",
    tenant: "Abundance",
    tenantType: "Abundance GH",
    businessArea: "Administration",
    avatar: "MS",
    permissions: ["Administration", "Benutzer-Verwaltung", "Logistics-Module"],
    description: "Vollzugriff auf Abundance Mandant",
    demoPassword: "demo123"
  },
  // OPERATIVE
  "employee-1": {
    id: "employee-1",
    name: "Anna Müller",
    email: "employee@wegroup.demo",
    role: "Mitarbeiterin",
    roleCategory: "operative",
    company: "WeGroup Demo",
    tenant: "WeGroup Demo",
    tenantType: "WeGroup Demo Tenant",
    businessArea: "General Operations",
    avatar: "AM",
    permissions: ["Basis-Module", "Zeiterfassung", "Self-Service"],
    description: "Standard Mitarbeiter-Zugriff",
    demoPassword: "employee123"
  },
  "employee-2": {
    id: "employee-2",
    name: "Sandra Koch",
    email: "operations@wfs-fulfillment.de",
    role: "Operations Spezialist",
    roleCategory: "operative",
    company: "WFS Fulfillment Solutions",
    tenant: "WFS Fulfillment Solutions",
    tenantType: "WFS Fulfillment Solutions GmbH",
    businessArea: "Operations",
    avatar: "SK",
    permissions: ["Operations-Dashboard", "Auftragsbearbeitung", "Reporting"],
    description: "Operative Tätigkeit im WFS Fulfillment",
    demoPassword: "demo123"
  },
  "employee-3": {
    id: "employee-3",
    name: "Michael Wagner",
    email: "logistics@wfs-fulfillment.de",
    role: "Logistik-Spezialist", 
    roleCategory: "operative",
    company: "WFS Fulfillment Solutions",
    tenant: "WFS Fulfillment Solutions",
    tenantType: "WFS Fulfillment Solutions GmbH",
    businessArea: "Logistics",
    avatar: "MW",
    permissions: ["Logistik-Dashboard", "Sendungsverfolgung", "Lagerverwaltung"],
    description: "Spezialisierte Logistik-Funktionen",
    demoPassword: "demo123"
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== Demo-Login API aufgerufen ===')
    const { demoUserId } = await request.json()
    console.log('Demo User ID:', demoUserId)

    if (!demoUserId) {
      return NextResponse.json(
        { error: 'Demo-User ID ist erforderlich' },
        { status: 400 }
      )
    }

    // Finde Demo-User aus hardcoded Daten
    const demoUser = demoUsers[demoUserId]
    console.log('Demo User gefunden:', !!demoUser)

    if (!demoUser) {
      console.log('Demo User nicht gefunden für ID:', demoUserId)
      return NextResponse.json(
        { error: 'Demo-User nicht gefunden' },
        { status: 404 }
      )
    }

    console.log('Demo User:', { name: demoUser.name, email: demoUser.email })

    // Prüfe ob realer User mit dieser Email existiert
    let realUser = await prisma.user.findUnique({
      where: { email: demoUser.email },
      include: {
        tenant: true,
        userRoles: {
          include: {
            role: true
          }
        }
      }
    })

    console.log('Real User bereits vorhanden:', !!realUser)

    // Falls kein realer User existiert, erstelle einen für die Demo
    if (!realUser) {
      console.log('Erstelle neuen Demo-User...')
      
      // Finde oder erstelle passenden Tenant
      let tenant = await prisma.tenant.findFirst({
        where: { 
          OR: [
            { name: { contains: demoUser.tenantType } },
            { name: demoUser.tenantType }
          ]
        }
      })

      if (!tenant) {
        console.log('Erstelle neuen Tenant:', demoUser.tenantType)
        // Erstelle Demo-Tenant falls nicht vorhanden
        tenant = await prisma.tenant.create({
          data: {
            name: demoUser.tenantType,
            domain: `${demoUser.tenantType.toLowerCase().replace(/[^a-z0-9]/g, '')}.demo`,
            subdomain: demoUser.tenantType.toLowerCase().replace(/[^a-z0-9]/g, ''),
            settings: {
              theme: 'blue',
              features: ['hr', 'finance', 'logistics', 'wecreate', 'wesell']
            }
          }
        })
      }

      console.log('Tenant ID:', tenant.id)

      // Erstelle Demo-User als echten User
      const hashedPassword = await bcrypt.hash(demoUser.demoPassword, 10)
      
      realUser = await prisma.user.create({
        data: {
          email: demoUser.email,
          password: hashedPassword,
          firstName: demoUser.name.split(' ')[0],
          lastName: demoUser.name.split(' ').slice(1).join(' '),
          tenantId: tenant.id,
          isActive: true
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

      console.log('User erstellt:', realUser.id)

      // Erstelle passende Rolle falls nicht vorhanden
      const roleName = demoUser.roleCategory === 'portals' ? demoUser.portalType :
                      demoUser.roleCategory === 'administrators' ? 'tenant_admin' :
                      demoUser.roleCategory === 'clevel' ? 'c_level' :
                      demoUser.roleCategory === 'management' ? 'manager' : 'employee'

      let role = await prisma.role.findFirst({
        where: {
          name: roleName,
          tenantId: tenant.id
        }
      })

      if (!role) {
        console.log('Erstelle neue Rolle:', roleName)
        role = await prisma.role.create({
          data: {
            name: roleName,
            description: `${demoUser.role} Role`,
            permissions: JSON.stringify(demoUser.permissions),
            isSystem: false,
            tenantId: tenant.id
          }
        })
      }

      // Zuweise Rolle zum User
      await prisma.userRole.create({
        data: {
          userId: realUser.id,
          roleId: role.id
        }
      })

      console.log('Rolle zugewiesen')

      // Aktualisiere den User mit den Rollen
      realUser = await prisma.user.findUnique({
        where: { id: realUser.id },
        include: {
          tenant: true,
          userRoles: {
            include: {
              role: true
            }
          }
        }
      })
    }

    // Aktualisiere Last Login
    await prisma.user.update({
      where: { id: realUser!.id },
      data: { lastLoginAt: new Date() }
    })

    console.log('Login aktualisiert für User:', realUser!.email)

    // Erstelle Session-ähnliche Antwort für Frontend
    const sessionUser = {
      id: realUser!.id,
      email: realUser!.email,
      firstName: realUser!.firstName,
      lastName: realUser!.lastName,
      image: realUser!.image,
      tenantId: realUser!.tenantId,
      tenant: realUser!.tenant,
      roles: realUser!.userRoles.map(ur => ur.role),
      isDemoUser: true,
      demoUserData: {
        role: demoUser.role,
        company: demoUser.company,
        tenant: demoUser.tenant,
        tenantType: demoUser.tenantType,
        businessArea: demoUser.businessArea,
        avatar: demoUser.avatar,
        permissions: demoUser.permissions,
        description: demoUser.description
      }
    }

    console.log('=== Demo-Login erfolgreich ===')

    // Bestimme die richtige Weiterleitung basierend auf dem User-Typ
    const getRedirectUrl = (demoUser: any) => {
      if (demoUser.roleCategory === 'portals') {
        if (demoUser.portalType === 'customer') {
          return '/customer-portal'
        }
        if (demoUser.portalType === 'supplier') {
          return '/supplier-portal'
        }
      }
      return '/dashboard'
    }

    const redirectUrl = getRedirectUrl(demoUser)
    console.log('Weiterleitung zu:', redirectUrl)

    return NextResponse.json({
      success: true,
      message: `Erfolgreich als ${demoUser.name} (${demoUser.role}) angemeldet`,
      user: sessionUser,
      redirectUrl
    })

  } catch (error) {
    console.error('Demo-Login Error:', error)
    return NextResponse.json(
      { error: 'Fehler beim Demo-Login' },
      { status: 500 }
    )
  }
}
