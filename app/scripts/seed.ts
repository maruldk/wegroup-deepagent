
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { seedEnhancedRoles } from './enhanced-roles-seed'
import { seedTenantManagement } from './tenant-management-seed'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default tenant
  const defaultTenant = await prisma.tenant.upsert({
    where: { domain: 'wegroup.demo' },
    update: {},
    create: {
      name: 'WeGroup Demo',
      domain: 'wegroup.demo',
      subdomain: 'demo',
      settings: {
        theme: 'blue',
        features: ['hr', 'finance', 'logistics', 'wecreate', 'wesell']
      }
    }
  })

  console.log('✅ Created default tenant:', defaultTenant.name)

  // Create system roles
  const tenantRoles = [
    {
      name: 'tenant_admin',
      description: 'Tenant Administrator with full tenant access',
      permissions: [
        'user:read', 'user:write', 'user:delete',
        'tenant:read', 'tenant:write',
        'hr:admin', 'finance:admin', 'logistics:admin'
      ],
      isSystem: true,
      tenantId: defaultTenant.id
    },
    {
      name: 'c_level',
      description: 'C-Level Executive with high-level access',
      permissions: [
        'user:read', 'user:write',
        'hr:read', 'hr:write',
        'finance:read', 'finance:write',
        'logistics:read', 'logistics:write'
      ],
      isSystem: true,
      tenantId: defaultTenant.id
    },
    {
      name: 'manager',
      description: 'Manager with team management access',
      permissions: [
        'user:read',
        'hr:read', 'hr:write',
        'finance:read',
        'logistics:read', 'logistics:write'
      ],
      isSystem: true,
      tenantId: defaultTenant.id
    },
    {
      name: 'employee',
      description: 'Employee with basic access',
      permissions: [
        'hr:read',
        'finance:read',
        'logistics:read'
      ],
      isSystem: true,
      tenantId: defaultTenant.id
    }
  ]

  // Create super admin role separately (without tenant)
  const existingSuperAdmin = await prisma.role.findFirst({
    where: {
      name: 'super_admin',
      tenantId: null
    }
  })

  if (!existingSuperAdmin) {
    await prisma.role.create({
      data: {
        name: 'super_admin',
        description: 'Super Administrator with full system access',
        permissions: JSON.stringify(['*']),
        isSystem: true,
        tenantId: null
      }
    })
  }

  // Create tenant-specific roles
  for (const roleData of tenantRoles) {
    await prisma.role.upsert({
      where: {
        name_tenantId: {
          name: roleData.name,
          tenantId: roleData.tenantId
        }
      },
      update: {
        permissions: JSON.stringify(roleData.permissions)
      },
      create: {
        ...roleData,
        permissions: JSON.stringify(roleData.permissions)
      }
    })
  }

  console.log('✅ Created system roles')

  // Create test users
  const testUsers = [
    {
      email: 'john@doe.com',
      password: 'johndoe123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'tenant_admin'
    },
    {
      email: 'admin@wegroup.demo',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'super_admin'
    },
    {
      email: 'ceo@wegroup.demo',
      password: 'ceo123',
      firstName: 'Maria',
      lastName: 'Schmidt',
      role: 'c_level'
    },
    {
      email: 'manager@wegroup.demo',
      password: 'manager123',
      firstName: 'Thomas',
      lastName: 'Weber',
      role: 'manager'
    },
    {
      email: 'employee@wegroup.demo',
      password: 'employee123',
      firstName: 'Anna',
      lastName: 'Müller',
      role: 'employee'
    }
  ]

  for (const userData of testUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        tenantId: userData.role === 'super_admin' ? null : defaultTenant.id,
        isActive: true
      }
    })

    // Assign role
    const role = await prisma.role.findFirst({
      where: {
        name: userData.role,
        tenantId: userData.role === 'super_admin' ? null : defaultTenant.id
      }
    })

    if (role) {
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: role.id
          }
        },
        update: {},
        create: {
          userId: user.id,
          roleId: role.id
        }
      })
    }
  }

  console.log('✅ Created test users')

  // Create tenant modules
  const modules = ['HR', 'FINANCE', 'LOGISTICS', 'WECREATE', 'WESELL', 'COMPLIANCE', 'ANALYTICS']
  
  for (const moduleType of modules) {
    await prisma.tenantModule.upsert({
      where: {
        tenantId_moduleType: {
          tenantId: defaultTenant.id,
          moduleType: moduleType as any
        }
      },
      update: {},
      create: {
        tenantId: defaultTenant.id,
        moduleType: moduleType as any,
        isActive: true,
        config: {}
      }
    })
  }

  console.log('✅ Created tenant modules')

  // Create sample suppliers
  const suppliers = [
    {
      name: 'Logistics Partner GmbH',
      email: 'contact@logistics-partner.de',
      phone: '+49 30 12345678',
      rating: 4.8,
      volume: 125000.50,
      performance: 94.2,
      status: 'ACTIVE'
    },
    {
      name: 'Supply Chain Solutions',
      email: 'info@supply-chain.com', 
      phone: '+49 40 87654321',
      rating: 4.5,
      volume: 89000.25,
      performance: 91.8,
      status: 'ACTIVE'
    },
    {
      name: 'Global Freight Services',
      email: 'sales@globalfreight.net',
      phone: '+49 89 11223344',
      rating: 4.2,
      volume: 67500.75,
      performance: 88.5,
      status: 'ACTIVE'
    }
  ]

  for (const supplierData of suppliers) {
    const existingSupplier = await prisma.supplier.findFirst({
      where: { 
        email: supplierData.email,
        tenantId: defaultTenant.id
      }
    })

    if (!existingSupplier) {
      await prisma.supplier.create({
        data: {
          ...supplierData,
          tenantId: defaultTenant.id,
          address: {
            street: 'Musterstraße 123',
            city: 'Berlin',
            country: 'Deutschland',
            postalCode: '10115'
          }
        }
      })
    }
  }

  console.log('✅ Created sample suppliers')

  // Create sample shipments
  const shipments = [
    {
      trackingNumber: 'WG2024001',
      carrierName: 'DHL',
      status: 'IN_TRANSIT' as const,
      originAddress: { city: 'Hamburg', country: 'Deutschland' },
      destinationAddress: { city: 'München', country: 'Deutschland' },
      estimatedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // +2 days
      route: []
    },
    {
      trackingNumber: 'WG2024002',
      carrierName: 'UPS',
      status: 'OUT_FOR_DELIVERY' as const,
      originAddress: { city: 'Berlin', country: 'Deutschland' },
      destinationAddress: { city: 'Frankfurt', country: 'Deutschland' },
      estimatedDeliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // +1 day
      route: []
    },
    {
      trackingNumber: 'WG2024003',
      carrierName: 'DPD',
      status: 'DELIVERED' as const,
      originAddress: { city: 'Köln', country: 'Deutschland' },
      destinationAddress: { city: 'Stuttgart', country: 'Deutschland' },
      actualDeliveryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // -1 day
      route: []
    }
  ]

  for (const shipmentData of shipments) {
    await prisma.shipment.upsert({
      where: { trackingNumber: shipmentData.trackingNumber },
      update: {},
      create: {
        ...shipmentData,
        tenantId: defaultTenant.id,
        route: []
      }
    })
  }

  console.log('✅ Created sample shipments')

  // Create sample financial transactions
  const transactions = [
    {
      amount: 15750.00,
      currency: 'EUR',
      type: 'INCOME' as const,
      status: 'COMPLETED' as const,
      description: 'Kundenrechnung #2024-001',
      reference: 'INV-2024-001'
    },
    {
      amount: 8900.50,
      currency: 'EUR',
      type: 'EXPENSE' as const,
      status: 'COMPLETED' as const,
      description: 'Lieferantenrechnung - Logistik',
      reference: 'BILL-2024-045'
    },
    {
      amount: 25000.00,
      currency: 'EUR',
      type: 'INCOME' as const,
      status: 'PENDING' as const,
      description: 'Großauftrag - Q1 2024',
      reference: 'INV-2024-012'
    }
  ]

  for (const transactionData of transactions) {
    await prisma.financialTransaction.create({
      data: {
        ...transactionData,
        tenantId: defaultTenant.id,
        metadata: {}
      }
    })
  }

  console.log('✅ Created sample financial transactions')

  // Create demo users for role-based authentication simulator with corrected tenant structure
  const demoUsers = [
    // Administrators
    {
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
      description: "Vollzugriff auf alle Module und Mandanten"
    },
    {
      name: "Michael Bauer",
      email: "m.bauer@techcorp.de",
      role: "Mandanten-Administrator",
      roleCategory: "administrators",
      company: "TechCorp Solutions",
      tenant: "WFS Fleischmann Solutions",
      tenantType: "WFS Fleischmann Solutions GmbH",
      businessArea: "Technology Solutions",
      avatar: "MB",
      permissions: ["Mandanten-Administration", "Benutzer-Management", "Module-Konfiguration"],
      description: "Vollzugriff innerhalb des WFS Mandanten"
    },
    {
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
      description: "Vollzugriff innerhalb des Abundance Mandanten"
    },
    
    // C-Level
    {
      name: "Thomas Hartmann",
      email: "t.hartmann@techcorp.de",
      role: "Geschäftsführer",
      roleCategory: "clevel",
      company: "TechCorp Solutions",
      tenant: "WFS Fleischmann Solutions",
      tenantType: "WFS Fleischmann Solutions GmbH",
      businessArea: "Technology Leadership",
      avatar: "TH",
      permissions: ["Executive Dashboard", "Finanz-Reports", "Strategische Planung"],
      description: "C-Level Zugriff mit strategischen Entscheidungsrechten"
    },
    {
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
      description: "Finanzverantwortung und Budget-Kontrolle"
    },
    {
      name: "Martin Klein",
      email: "m.klein@innovatech.de",
      role: "Technischer Vorstand",
      roleCategory: "clevel",
      company: "InnovaTech AG",
      tenant: "weSTILL",
      tenantType: "weSTILL GmbH",
      businessArea: "Innovation & Technology",
      avatar: "MK",
      permissions: ["Tech-Infrastructure", "weCREATE-Module", "Innovation-Hub"],
      description: "Technische Leitung und Innovation"
    },
    
    // Management
    {
      name: "Stefanie Wagner",
      email: "s.wagner@techcorp.de",
      role: "HR-Managerin",
      roleCategory: "management",
      company: "TechCorp Solutions",
      tenant: "WFS Fleischmann Solutions",
      tenantType: "WFS Fleischmann Solutions GmbH",
      businessArea: "Human Resources",
      avatar: "SW",
      permissions: ["HR-Module", "Mitarbeiter-Management", "Recruiting"],
      description: "Personalwesen und Mitarbeiterentwicklung"
    },
    {
      name: "Andreas Müller",
      email: "a.mueller@globallogistics.de",
      role: "Abteilungsleiter Logistik",
      roleCategory: "management",
      company: "Global Logistics GmbH",
      tenant: "Abundance GH",
      tenantType: "Abundance GH",
      businessArea: "Logistics Management",
      avatar: "AM",
      permissions: ["Logistics-Module", "Team-Management", "Route-Optimization"],
      description: "Operative Führung der Logistik-Abteilung"
    },
    {
      name: "Julia Richter",
      email: "j.richter@innovatech.de",
      role: "Vertriebsleiterin",
      roleCategory: "management",
      company: "InnovaTech AG",
      tenant: "weSTILL",
      tenantType: "weSTILL GmbH",
      businessArea: "Sales Management",
      avatar: "JR",
      permissions: ["weSELL-Module", "Customer-Management", "Sales-Analytics"],
      description: "Vertriebssteuerung und Kundenbeziehungen"
    },
    
    // Operative
    {
      name: "David Schmidt",
      email: "d.schmidt@techcorp.de",
      role: "Software Entwickler",
      roleCategory: "operative",
      company: "TechCorp Solutions",
      tenant: "WFS Fleischmann Solutions",
      tenantType: "WFS Fleischmann Solutions GmbH",
      businessArea: "Software Development",
      avatar: "DS",
      permissions: ["weCREATE-Module", "Project-Access", "Time-Tracking"],
      description: "Entwicklungsarbeit und Projektbeteiligung"
    },
    {
      name: "Lisa Hoffmann",
      email: "l.hoffmann@globallogistics.de",
      role: "Logistik-Koordinatorin",
      roleCategory: "operative",
      company: "Global Logistics GmbH",
      tenant: "Abundance GH",
      tenantType: "Abundance GH",
      businessArea: "Logistics Operations",
      avatar: "LH",
      permissions: ["Shipment-Tracking", "Route-Planning", "Warehouse-Management"],
      description: "Operative Logistik-Abwicklung"
    },
    {
      name: "Robert Zimmermann",
      email: "r.zimmermann@innovatech.de",
      role: "Sales Representative",
      roleCategory: "operative",
      company: "InnovaTech AG",
      tenant: "weSTILL",
      tenantType: "weSTILL GmbH",
      businessArea: "Sales Operations",
      avatar: "RZ",
      permissions: ["Customer-Contact", "Quote-Management", "Sales-Dashboard"],
      description: "Kundenbetreuung und Verkaufsaktivitäten"
    },
    
    // Kunden - Jetzt mit korrektem eVENTURES Mandant
    {
      name: "Frank Weber",
      email: "f.weber@startup-ventures.de",
      role: "Einkaufsleiter",
      roleCategory: "kunden",
      company: "Startup Ventures GmbH",
      tenant: "eVENTURES",
      tenantType: "eVENTURES GmbH",
      businessArea: "Venture Capital",
      avatar: "FW",
      permissions: ["Kunden-Portal", "Bestellung-Management", "Support-Tickets"],
      description: "Zugriff auf Kundenportal und Investment-Services"
    },
    {
      name: "Christina Lange",
      email: "c.lange@retail-giant.de",
      role: "Procurement Manager",
      roleCategory: "kunden",
      company: "Retail Giant AG",
      tenant: "eVENTURES",
      tenantType: "eVENTURES GmbH",
      businessArea: "Retail Solutions",
      avatar: "CL",
      permissions: ["Bulk-Orders", "Contract-Management", "Price-Negotiation"],
      description: "Großkunden-Portal mit erweiterten Funktionen"
    },
    {
      name: "Marco Steinberg",
      email: "m.steinberg@healthcare-solutions.de",
      role: "Operations Director",
      roleCategory: "kunden",
      company: "Healthcare Solutions GmbH",
      tenant: "eVENTURES",
      tenantType: "eVENTURES GmbH",
      businessArea: "Healthcare Innovation",
      avatar: "MS",
      permissions: ["Specialized-Products", "Compliance-Tracking", "Quality-Reports"],
      description: "Branchenspezifisches Investment-Portal"
    },
    
    // Lieferanten - Mit präziseren Beschreibungen für Ausschreibungs-Zugriff
    {
      name: "Hans Bergmann",
      email: "h.bergmann@component-tech.de",
      role: "Account Manager",
      roleCategory: "lieferanten",
      company: "Component Tech Solutions",
      tenant: "Lieferanten-Portal",
      tenantType: "Supplier Portal",
      businessArea: "Technology Components",
      avatar: "HB",
      permissions: ["Lieferanten-Portal", "Inventory-Updates", "Delivery-Scheduling"],
      description: "Zugriff auf Lieferantenportal und Lagerverwaltung"
    },
    {
      name: "Sabine Koch",
      email: "s.koch@material-express.de",
      role: "Supply Chain Manager",
      roleCategory: "lieferanten",
      company: "Material Express GmbH",
      tenant: "Lieferanten-Portal",
      tenantType: "Supplier Portal",
      businessArea: "Material Supply",
      avatar: "SK",
      permissions: ["Bulk-Supply", "Logistics-Integration", "Quality-Control"],
      description: "Erweiterte Lieferantenintegration mit Ausschreibungs-Zugriff"
    },
    {
      name: "Oliver Neumann",
      email: "o.neumann@green-logistics.de",
      role: "Sustainability Manager",
      roleCategory: "lieferanten",
      company: "Green Logistics AG",
      tenant: "Lieferanten-Portal",
      tenantType: "Supplier Portal",
      businessArea: "Sustainable Logistics",
      avatar: "ON",
      permissions: ["Eco-Reporting", "Carbon-Tracking", "Sustainable-Supply"],
      description: "Nachhaltige Lieferkette und Umwelt-Reporting mit Ausschreibungs-Zugang"
    }
  ]

  for (const demoUser of demoUsers) {
    await prisma.demoUser.upsert({
      where: { email: demoUser.email },
      update: {
        tenant: demoUser.tenant,
        tenantType: demoUser.tenantType,
        businessArea: demoUser.businessArea,
        description: demoUser.description
      },
      create: {
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
        roleCategory: demoUser.roleCategory,
        company: demoUser.company,
        tenant: demoUser.tenant,
        tenantType: demoUser.tenantType,
        businessArea: demoUser.businessArea,
        avatar: demoUser.avatar,
        permissions: demoUser.permissions,
        description: demoUser.description,
        isActive: true,
      },
    })
  }

  console.log('✅ Created demo users for role simulator')

  // ===== SPRINT 4: ADVANCED AI ENGINE & ENTERPRISE FEATURES =====
  
  console.log('🤖 Seeding Sprint 4: AI Engine data...')
  await seedAIEngineData()
  
  console.log('🔧 Seeding Sprint 4: API Management data...')
  await seedAPIManagementData()
  
  console.log('🛡️ Seeding Sprint 4: Security data...')
  await seedSecurityData()
  
  console.log('🌍 Seeding Sprint 4: Localization data...')
  await seedLocalizationData()
  
  console.log('🏢 Seeding Sprint 4: Enterprise data...')
  await seedEnterpriseData()
  
  console.log('📊 Seeding Sprint 4: System Metrics...')
  await seedSystemMetrics()

  console.log('🎉 Sprint 4 Database seeding completed successfully!')

  // ===== TENANT MANAGEMENT SEEDING =====
  console.log('🏢 Seeding Tenant Management...')
  await seedTenantManagement()
}

// ===== SPRINT 4 SEED FUNCTIONS =====

async function seedAIEngineData() {
  try {
    // Get tenants for reference
    const tenants = await prisma.tenant.findMany()
    const demoUser = await prisma.user.findUnique({ where: { email: 'john@doe.com' } })
    
    if (!demoUser || tenants.length === 0) return

    // Create AI Models
    const aiModels = await Promise.all([
      prisma.aIModel.create({
        data: {
          name: 'Customer Behavior Predictor',
          description: 'Predicts customer purchasing behavior and churn risk',
          modelType: 'CUSTOMER_BEHAVIOR_PREDICTION',
          version: '2.1.0',
          status: 'DEPLOYED',
          deploymentStatus: 'DEPLOYED',
          accuracy: 0.94,
          precision: 0.92,
          recall: 0.89,
          f1Score: 0.905,
          confidenceThreshold: 0.75,
          predictionCount: 1247,
          averageResponseTime: 145.2,
          tenantId: tenants[0].id,
          createdBy: demoUser.id,
          tags: ['production', 'customer-analytics', 'ml'],
          lastTrainedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          lastDeployedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          lastUsedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
      }),
      prisma.aIModel.create({
        data: {
          name: 'Invoice Anomaly Detector',
          description: 'Detects fraudulent or anomalous invoice patterns',
          modelType: 'ANOMALY_DETECTION',
          version: '1.8.3',
          status: 'DEPLOYED',
          deploymentStatus: 'DEPLOYED',
          accuracy: 0.98,
          precision: 0.97,
          recall: 0.96,
          f1Score: 0.965,
          confidenceThreshold: 0.85,
          predictionCount: 856,
          averageResponseTime: 89.7,
          tenantId: tenants[0].id,
          createdBy: demoUser.id,
          tags: ['production', 'finance', 'fraud-detection'],
          lastTrainedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          lastDeployedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          lastUsedAt: new Date(Date.now() - 30 * 60 * 1000)
        }
      }),
      prisma.aIModel.create({
        data: {
          name: 'Resource Optimizer',
          description: 'Optimizes resource allocation across departments',
          modelType: 'RESOURCE_OPTIMIZATION',
          version: '3.0.1',
          status: 'DEPLOYED',
          deploymentStatus: 'DEPLOYED',
          accuracy: 0.91,
          precision: 0.88,
          recall: 0.93,
          f1Score: 0.905,
          confidenceThreshold: 0.70,
          predictionCount: 634,
          averageResponseTime: 201.3,
          tenantId: tenants[0].id,
          createdBy: demoUser.id,
          tags: ['production', 'optimization', 'hr'],
          lastTrainedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
          lastDeployedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          lastUsedAt: new Date(Date.now() - 45 * 60 * 1000)
        }
      })
    ])

    // Create AI Decisions
    const decisions = []
    for (let i = 0; i < 25; i++) {
      const model = aiModels[Math.floor(Math.random() * aiModels.length)]
      const decisionTypes = ['APPROVE_PAYMENT', 'VALIDATE_INVOICE', 'ALLOCATE_RESOURCES', 'RECOMMEND_ACTION']
      const statuses = ['EXECUTED', 'APPROVED', 'PENDING', 'UNDER_REVIEW']
      const modules = ['FINANCE', 'HR', 'LOGISTICS', 'WESELL']
      
      decisions.push(prisma.aIDecision.create({
        data: {
          modelId: model.id,
          decisionType: decisionTypes[Math.floor(Math.random() * decisionTypes.length)] as any,
          context: {
            requestId: `req_${Date.now()}_${i}`,
            timestamp: new Date(),
            priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)]
          },
          inputData: {
            amount: Math.random() * 10000,
            category: ['expense', 'revenue', 'investment'][Math.floor(Math.random() * 3)],
            department: modules[Math.floor(Math.random() * modules.length)]
          },
          outputData: {
            recommendation: ['approve', 'reject', 'review'][Math.floor(Math.random() * 3)],
            reasoning: 'AI analysis based on historical patterns and risk assessment',
            confidence: 0.5 + Math.random() * 0.4
          },
          confidenceScore: 0.5 + Math.random() * 0.4,
          decisionReasoning: 'Automated decision based on trained model parameters and current data patterns',
          status: statuses[Math.floor(Math.random() * statuses.length)] as any,
          requiresHumanReview: Math.random() > 0.7,
          humanApprovalRequired: Math.random() > 0.8,
          tenantId: tenants[0].id,
          moduleSource: modules[Math.floor(Math.random() * modules.length)],
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        }
      }))
    }
    await Promise.all(decisions)

    console.log('✅ AI Engine data seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding AI Engine data:', error)
  }
}

async function seedAPIManagementData() {
  try {
    const tenants = await prisma.tenant.findMany()
    const demoUser = await prisma.user.findUnique({ where: { email: 'john@doe.com' } })
    
    if (!demoUser || tenants.length === 0) return

    // Create API Endpoints
    await Promise.all([
      prisma.aPIEndpoint.create({
        data: {
          name: 'Users API',
          path: '/api/users',
          method: 'GET',
          description: 'Retrieve user information and profiles',
          isPublic: false,
          requiresAuth: true,
          rateLimitRpm: 100,
          rateLimitRph: 2000,
          averageResponseTime: 145.2,
          successRate: 0.998,
          totalRequests: 15647,
          errorCount: 32,
          allowedOrigins: ['https://app.wegroup.com'],
          requiredScopes: ['read:users'],
          tenantId: tenants[0].id,
          createdBy: demoUser.id
        }
      }),
      prisma.aPIEndpoint.create({
        data: {
          name: 'Invoice Processing API',
          path: '/api/finance/invoices',
          method: 'POST',
          description: 'Process and validate incoming invoices',
          isPublic: false,
          requiresAuth: true,
          rateLimitRpm: 50,
          rateLimitRph: 1000,
          averageResponseTime: 892.7,
          successRate: 0.994,
          totalRequests: 3421,
          errorCount: 21,
          requiredScopes: ['write:invoices', 'read:finance'],
          tenantId: tenants[0].id,
          createdBy: demoUser.id
        }
      })
    ])

    // Create Webhook Endpoints
    await Promise.all([
      prisma.webhookEndpoint.create({
        data: {
          name: 'Invoice Processing Webhook',
          url: 'https://external-system.example.com/webhooks/invoices',
          events: ['INVOICE_GENERATED', 'INVOICE_PAID'],
          secret: 'webhook_secret_invoice_123',
          isActive: true,
          deliveryCount: 234,
          failureCount: 3,
          averageResponseTime: 456.2,
          lastDeliveryAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          tenantId: tenants[0].id,
          createdBy: demoUser.id
        }
      })
    ])

    console.log('✅ API Management data seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding API Management data:', error)
  }
}

async function seedSecurityData() {
  try {
    const tenants = await prisma.tenant.findMany()
    const demoUser = await prisma.user.findUnique({ where: { email: 'john@doe.com' } })
    
    if (!demoUser || tenants.length === 0) return

    // Create Security Audit Logs
    const auditLogs = []
    const eventTypes = ['LOGIN_SUCCESS', 'LOGIN_FAILURE', 'DATA_ACCESS', 'DATA_MODIFICATION', 'API_ACCESS']
    const severities = ['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
    
    for (let i = 0; i < 20; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)] as any
      const severity = severities[Math.floor(Math.random() * severities.length)] as any
      
      auditLogs.push(prisma.securityAuditLog.create({
        data: {
          eventType,
          severity,
          description: `Security event: ${eventType.toLowerCase().replace(/_/g, ' ')}`,
          details: {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            requestId: `req_${Date.now()}_${i}`,
            sessionDuration: Math.random() * 3600
          },
          userId: Math.random() > 0.3 ? demoUser.id : undefined,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          resourceType: ['User', 'Invoice', 'API'][Math.floor(Math.random() * 3)],
          action: ['CREATE', 'READ', 'UPDATE', 'DELETE'][Math.floor(Math.random() * 4)],
          riskScore: Math.random(),
          tenantId: tenants[0].id,
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        }
      }))
    }
    await Promise.all(auditLogs)

    // Create Compliance Records
    await Promise.all([
      prisma.complianceRecord.create({
        data: {
          complianceType: 'GDPR_DATA_ACCESS',
          status: 'COMPLETED',
          description: 'User requested access to their personal data under GDPR Article 15',
          processedBy: demoUser.id,
          processedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          tenantId: tenants[0].id,
          createdBy: demoUser.id
        }
      })
    ])

    console.log('✅ Security data seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding Security data:', error)
  }
}

async function seedLocalizationData() {
  try {
    const tenants = await prisma.tenant.findMany()
    
    if (tenants.length === 0) return

    // Create Locale Settings
    await Promise.all([
      prisma.localeSettings.create({
        data: {
          locale: 'en',
          displayName: 'English (United States)',
          nativeName: 'English',
          country: 'US',
          currency: 'USD',
          currencySymbol: '$',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          isRTL: false,
          isEnabled: true,
          completionPercentage: 100.0,
          aiModelSupport: true,
          speechRecognition: true,
          textToSpeech: true
        }
      }),
      prisma.localeSettings.create({
        data: {
          locale: 'de',
          displayName: 'Deutsch (Deutschland)',
          nativeName: 'Deutsch',
          country: 'DE',
          currency: 'EUR',
          currencySymbol: '€',
          dateFormat: 'DD.MM.YYYY',
          timeFormat: '24h',
          isRTL: false,
          isEnabled: true,
          completionPercentage: 95.2,
          aiModelSupport: true,
          speechRecognition: true,
          textToSpeech: true
        }
      })
    ])

    console.log('✅ Localization data seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding Localization data:', error)
  }
}

async function seedEnterpriseData() {
  try {
    const tenants = await prisma.tenant.findMany()
    
    if (tenants.length === 0) return

    // Create Tenant Customization
    await prisma.tenantCustomization.create({
      data: {
        tenantId: tenants[0].id,
        brandName: 'WeGroup Enterprise',
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        accentColor: '#60A5FA',
        darkModeEnabled: true,
        enabledFeatures: ['ai-engine', 'monitoring', 'api-management', 'security'],
        supportEmail: 'support@wegroup.com'
      }
    })

    console.log('✅ Enterprise data seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding Enterprise data:', error)
  }
}

async function seedSystemMetrics() {
  try {
    const tenants = await prisma.tenant.findMany()
    const demoUser = await prisma.user.findUnique({ where: { email: 'john@doe.com' } })
    
    if (tenants.length === 0 || !demoUser) return

    // Create Alert Rule
    await prisma.alertRule.create({
      data: {
        name: 'High CPU Usage Alert',
        description: 'Alert when CPU usage exceeds 80%',
        metricQuery: 'cpu_usage',
        threshold: 80.0,
        operator: 'GREATER_THAN',
        evaluationWindow: 300,
        severity: 'WARNING',
        notificationChannels: [{ type: 'email', address: 'admin@wegroup.com' }],
        cooldownPeriod: 900,
        tenantId: tenants[0].id,
        createdBy: demoUser.id
      }
    })

    console.log('✅ System Metrics seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding System Metrics:', error)
  }
}

async function seedUserManagement() {
  console.log('🔧 Seeding User Management & Permission System...');

  try {
    // Get default tenant
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      console.log('❌ No tenant found for user management seeding');
      return;
    }

    // Create base permissions
    const permissions = [
      {
        name: 'user.management.read',
        description: 'View user management interface',
        module: 'SECURITY' as any,
        action: 'read',
        resource: 'users'
      },
      {
        name: 'user.management.write',
        description: 'Create and edit users',
        module: 'SECURITY' as any,
        action: 'write',
        resource: 'users'
      },
      {
        name: 'role.management.read',
        description: 'View role management interface',
        module: 'SECURITY' as any,
        action: 'read',
        resource: 'roles'
      },
      {
        name: 'permission.management.read',
        description: 'View permission management interface',
        module: 'SECURITY' as any,
        action: 'read',
        resource: 'permissions'
      }
    ];

    const createdPermissions = [];
    for (const permData of permissions) {
      const permission = await prisma.permission.upsert({
        where: { name: permData.name },
        update: permData,
        create: permData
      });
      createdPermissions.push(permission);
    }

    // Create menu permissions for user management
    const menuPermissions = [
      {
        menuKey: 'user-management',
        menuPath: '/user-management',
        menuTitle: 'User Management',
        module: 'SECURITY' as any,
        requiredActions: ['read'],
        aiSecurityLevel: 'HIGH',
        description: 'Main user management dashboard',
        iconName: 'Users',
        sortOrder: 1,
        permissionId: createdPermissions[0]?.id || '',
        tenantId: tenant.id
      },
      {
        menuKey: 'user-management.roles',
        menuPath: '/user-management/roles',
        menuTitle: 'Role Management',
        module: 'SECURITY' as any,
        requiredActions: ['read'],
        aiSecurityLevel: 'HIGH',
        description: 'Manage user roles and assignments',
        iconName: 'Shield',
        sortOrder: 2,
        permissionId: createdPermissions[2]?.id || '',
        tenantId: tenant.id
      },
      {
        menuKey: 'user-management.permissions',
        menuPath: '/user-management/permissions',
        menuTitle: 'Permission Management',
        module: 'SECURITY' as any,
        requiredActions: ['read', 'write'],
        aiSecurityLevel: 'CRITICAL',
        description: 'Configure granular permissions',
        iconName: 'Lock',
        sortOrder: 3,
        permissionId: createdPermissions[3]?.id || '',
        tenantId: tenant.id
      }
    ];

    for (const menuData of menuPermissions) {
      await prisma.menuPermission.upsert({
        where: { 
          menuKey_tenantId: {
            menuKey: menuData.menuKey,
            tenantId: menuData.tenantId
          }
        },
        update: menuData,
        create: menuData
      });
    }

    // Create enhanced roles
    const enhancedRoles = [
      {
        name: 'Super Administrator',
        description: 'Full system access with all permissions',
        category: 'EXECUTIVE' as any,
        level: 'SUPER_ADMIN' as any,
        aiOptimizedPermissions: ['*'],
        aiSecurityScore: 0.95,
        departmentRestrictions: [],
        isAutoAssignable: false,
        requiresApproval: true,
        tenantId: tenant.id,
        createdBy: 'system'
      },
      {
        name: 'User Administrator',
        description: 'Manage users, roles, and permissions',
        category: 'ADMINISTRATIVE' as any,
        level: 'ADMIN' as any,
        aiOptimizedPermissions: ['user.*', 'role.*', 'permission.*'],
        aiSecurityScore: 0.85,
        departmentRestrictions: [],
        isAutoAssignable: false,
        requiresApproval: true,
        tenantId: tenant.id,
        createdBy: 'system'
      }
    ];

    for (const roleData of enhancedRoles) {
      await prisma.enhancedRole.upsert({
        where: { 
          name_tenantId: {
            name: roleData.name,
            tenantId: roleData.tenantId
          }
        },
        update: roleData,
        create: roleData
      });
    }

    console.log('✅ User Management & Permission System seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding user management system:', error);
  }
}

async function runMainSeeding() {
  await main();
  await seedUserManagement();
  await seedEnhancedRoles();
  await seedTenantManagement();
}

runMainSeeding()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
