
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Specific tenant data from mockup
const MOCKUP_TENANTS = [
  {
    name: 'Abundance',
    displayName: 'Abundance GmbH',
    shortName: 'abundance',
    domain: 'abundance.abacusai.app',
    subdomain: 'abundance',
    description: 'Innovative Unternehmensberatung für nachhaltige Geschäftsmodelle',
    industry: 'Beratung',
    website: 'https://www.abundance.de',
    email: 'kontakt@abundance.de',
    phone: '+49 69 12345678',
    planType: 'DEMO',
    status: 'ACTIVE',
    brandColor: '#8B5CF6',
    userCount: 2,
    activityLevel: 0,
    healthScore: 95.0,
    utilizationRate: 45.0,
    securityScore: 88.0,
    users: [
      { email: 'admin@abundance.de', firstName: 'Maria', lastName: 'Schmidt', role: 'ADMIN' },
      { email: 'manager@abundance.de', firstName: 'Thomas', lastName: 'Weber', role: 'MANAGER' }
    ]
  },
  {
    name: 'DePanCon',
    displayName: 'DePanCon GmbH',
    shortName: 'depancon',
    domain: 'depancon.abacusai.app',
    subdomain: 'depancon',
    description: 'Spezialist für Pannenhilfe und Fahrzeugdienstleistungen',
    industry: 'Automotive',
    website: 'https://www.depancon.de',
    email: 'info@depancon.de',
    phone: '+49 40 98765432',
    planType: 'DEMO',
    status: 'ACTIVE',
    brandColor: '#EF4444',
    userCount: 2,
    activityLevel: 0,
    healthScore: 92.0,
    utilizationRate: 38.0,
    securityScore: 85.0,
    users: [
      { email: 'admin@depancon.de', firstName: 'Frank', lastName: 'Mueller', role: 'ADMIN' },
      { email: 'service@depancon.de', firstName: 'Anna', lastName: 'Becker', role: 'USER' }
    ]
  },
  {
    name: 'WFS Fulfillment Solutions',
    displayName: 'WFS Fulfillment Solutions GmbH',
    shortName: 'wfs-fulfillment',
    domain: 'wfs-fulfillment.abacusai.app',
    subdomain: 'wfs',
    description: 'Professionelle Fulfillment- und Logistiklösungen für E-Commerce',
    industry: 'Logistik',
    website: 'https://www.wfs-fulfillment.de',
    email: 'kontakt@wfs-fulfillment.de',
    phone: '+49 221 55667788',
    planType: 'DEMO',
    status: 'ACTIVE',
    brandColor: '#10B981',
    userCount: 5,
    activityLevel: 1,
    healthScore: 97.0,
    utilizationRate: 78.0,
    securityScore: 92.0,
    users: [
      { email: 'admin@wfs-fulfillment.de', firstName: 'Klaus', lastName: 'Zimmermann', role: 'ADMIN' },
      { email: 'operations@wfs-fulfillment.de', firstName: 'Sandra', lastName: 'Koch', role: 'MANAGER' },
      { email: 'logistics@wfs-fulfillment.de', firstName: 'Michael', lastName: 'Wagner', role: 'USER' },
      { email: 'warehouse@wfs-fulfillment.de', firstName: 'Julia', lastName: 'Fischer', role: 'USER' },
      { email: 'support@wfs-fulfillment.de', firstName: 'Peter', lastName: 'Richter', role: 'USER' }
    ]
  },
  {
    name: 'Wetzlar Industry Solutions',
    displayName: 'Wetzlar Industry Solutions GmbH',
    shortName: 'wetzlar-industry',
    domain: 'wetzlar-industry.abacusai.app',
    subdomain: 'wetzlar',
    description: 'Industrielle Automatisierungs- und Digitalisierungslösungen',
    industry: 'Fertigung',
    website: 'https://www.wetzlar-industry.de',
    email: 'info@wetzlar-industry.de',
    phone: '+49 6441 123456',
    planType: 'DEMO',
    status: 'ACTIVE',
    brandColor: '#F59E0B',
    userCount: 4,
    activityLevel: 1,
    healthScore: 89.0,
    utilizationRate: 65.0,
    securityScore: 87.0,
    users: [
      { email: 'admin@wetzlar-industry.de', firstName: 'Ingrid', lastName: 'Hoffmann', role: 'ADMIN' },
      { email: 'engineering@wetzlar-industry.de', firstName: 'Robert', lastName: 'Klein', role: 'MANAGER' },
      { email: 'production@wetzlar-industry.de', firstName: 'Christina', lastName: 'Wolf', role: 'USER' },
      { email: 'quality@wetzlar-industry.de', firstName: 'Andreas', lastName: 'Neumann', role: 'USER' }
    ]
  },
  {
    name: 'weCREATE',
    displayName: 'weCREATE GmbH',
    shortName: 'wecreate',
    domain: 'wecreate.abacusai.app',
    subdomain: 'wecreate',
    description: 'Kreative Digitalagentur für Content Creation und Marketing',
    industry: 'Technologie',
    website: 'https://www.wecreate.de',
    email: 'hello@wecreate.de',
    phone: '+49 89 11223344',
    planType: 'DEMO',
    status: 'ACTIVE',
    brandColor: '#EC4899',
    userCount: 3,
    activityLevel: 0,
    healthScore: 94.0,
    utilizationRate: 72.0,
    securityScore: 90.0,
    users: [
      { email: 'admin@wecreate.de', firstName: 'Lisa', lastName: 'Schulz', role: 'ADMIN' },
      { email: 'creative@wecreate.de', firstName: 'David', lastName: 'Meyer', role: 'MANAGER' },
      { email: 'content@wecreate.de', firstName: 'Sarah', lastName: 'Braun', role: 'USER' }
    ]
  },
  {
    name: 'weGROUP',
    displayName: 'weGROUP GmbH',
    shortName: 'wegroup',
    domain: 'wegroup.abacusai.app',
    subdomain: 'wegroup',
    description: 'Führende KI-Plattform für Enterprise Business Intelligence',
    industry: 'Technologie',
    website: 'https://www.wegroup.de',
    email: 'kontakt@wegroup.de',
    phone: '+49 30 98765432',
    planType: 'DEMO',
    status: 'ACTIVE',
    brandColor: '#3B82F6',
    userCount: 8,
    activityLevel: 18,
    healthScore: 98.0,
    utilizationRate: 95.0,
    securityScore: 95.0,
    users: [
      { email: 'admin@wegroup.de', firstName: 'Alexander', lastName: 'Huber', role: 'SUPER_ADMIN' },
      { email: 'ceo@wegroup.de', firstName: 'Sabine', lastName: 'Lehmann', role: 'ADMIN' },
      { email: 'cto@wegroup.de', firstName: 'Marcus', lastName: 'Schmitt', role: 'ADMIN' },
      { email: 'product@wegroup.de', firstName: 'Nina', lastName: 'Fuchs', role: 'MANAGER' },
      { email: 'dev@wegroup.de', firstName: 'Sebastian', lastName: 'Werner', role: 'MANAGER' },
      { email: 'ai@wegroup.de', firstName: 'Melanie', lastName: 'Vogt', role: 'MANAGER' },
      { email: 'sales@wegroup.de', firstName: 'Oliver', lastName: 'Kurz', role: 'USER' },
      { email: 'support@wegroup.de', firstName: 'Jennifer', lastName: 'Lang', role: 'USER' }
    ]
  },
  {
    name: 'weSELL',
    displayName: 'weSELL GmbH',
    shortName: 'wesell',
    domain: 'wesell.abacusai.app',
    subdomain: 'wesell',
    description: 'E-Commerce-Plattform und Verkaufsoptimierung',
    industry: 'Einzelhandel',
    website: 'https://www.wesell.de',
    email: 'info@wesell.de',
    phone: '+49 711 445566',
    planType: 'DEMO',
    status: 'ACTIVE',
    brandColor: '#14B8A6',
    userCount: 3,
    activityLevel: 1,
    healthScore: 91.0,
    utilizationRate: 68.0,
    securityScore: 89.0,
    users: [
      { email: 'admin@wesell.de', firstName: 'Stefan', lastName: 'Gross', role: 'ADMIN' },
      { email: 'sales@wesell.de', firstName: 'Katharina', lastName: 'Sommer', role: 'MANAGER' },
      { email: 'support@wesell.de', firstName: 'Tim', lastName: 'Hartmann', role: 'USER' }
    ]
  },
  {
    name: 'weVENTURES',
    displayName: 'weVENTURES GmbH',
    shortName: 'weventures',
    domain: 'weventures.abacusai.app',
    subdomain: 'weventures',
    description: 'Venture Capital und Startup-Inkubator für Tech-Unternehmen',
    industry: 'Finanzdienstleistungen',
    website: 'https://www.weventures.de',
    email: 'partners@weventures.de',
    phone: '+49 69 778899',
    planType: 'DEMO',
    status: 'ACTIVE',
    brandColor: '#6B7280',
    userCount: 6,
    activityLevel: 1,
    healthScore: 96.0,
    utilizationRate: 82.0,
    securityScore: 93.0,
    users: [
      { email: 'admin@weventures.de', firstName: 'Dr. Martin', lastName: 'Keller', role: 'ADMIN' },
      { email: 'partners@weventures.de', firstName: 'Claudia', lastName: 'Berger', role: 'MANAGER' },
      { email: 'analyst@weventures.de', firstName: 'Florian', lastName: 'Roth', role: 'MANAGER' },
      { email: 'legal@weventures.de', firstName: 'Petra', lastName: 'Jung', role: 'USER' },
      { email: 'finance@weventures.de', firstName: 'Markus', lastName: 'Stein', role: 'USER' },
      { email: 'research@weventures.de', firstName: 'Laura', lastName: 'Mayer', role: 'USER' }
    ]
  }
];

async function seedTenantManagement() {
  console.log('🚀 Starting Tenant Management seeding...');

  try {
    // Create admin user if not exists (for tenant ownership)
    const adminUser = await prisma.user.upsert({
      where: { email: 'john@doe.com' },
      update: {},
      create: {
        email: 'john@doe.com',
        password: await bcrypt.hash('johndoe123', 12),
        firstName: 'John',
        lastName: 'Doe',
        isActive: true
      }
    });

    console.log('👤 Admin user ready');

    // Create tenants with users
    for (const tenantData of MOCKUP_TENANTS) {
      console.log(`🏢 Creating tenant: ${tenantData.displayName}...`);

      // Create tenant
      const tenant = await prisma.tenant.create({
        data: {
          name: tenantData.name,
          displayName: tenantData.displayName,
          shortName: tenantData.shortName,
          domain: tenantData.domain,
          subdomain: tenantData.subdomain,
          description: tenantData.description,
          industry: tenantData.industry,
          website: tenantData.website,
          email: tenantData.email,
          phone: tenantData.phone,
          planType: tenantData.planType as any,
          status: tenantData.status as any,
          brandColor: tenantData.brandColor,
          userCount: tenantData.userCount,
          activityLevel: tenantData.activityLevel,
          healthScore: tenantData.healthScore,
          utilizationRate: tenantData.utilizationRate,
          securityScore: tenantData.securityScore,
          ownerId: adminUser.id,
          lastActivityAt: tenantData.activityLevel > 0 ? new Date() : undefined,
          settings: {
            modules: ['USER_MANAGEMENT', 'TENANT_MANAGEMENT', 'AI_ENGINE'],
            features: {
              aiEnabled: true,
              analyticsEnabled: true,
              billingEnabled: false // Demo plans have no billing
            }
          }
        }
      });

      // Create tenant users
      for (const userData of tenantData.users) {
        const user = await prisma.user.create({
          data: {
            email: userData.email,
            password: await bcrypt.hash('demo123', 12),
            firstName: userData.firstName,
            lastName: userData.lastName,
            isActive: true,
            tenantId: tenant.id,
            lastLoginAt: tenantData.activityLevel > 0 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined
          }
        });

        // Create tenant manager relationship
        await prisma.tenantManager.create({
          data: {
            tenantId: tenant.id,
            userId: user.id,
            role: userData.role === 'ADMIN' || userData.role === 'SUPER_ADMIN' ? 'ADMIN' : 
                  userData.role === 'MANAGER' ? 'MANAGER' : 'VIEWER',
            permissions: userData.role === 'ADMIN' || userData.role === 'SUPER_ADMIN' ? ['ALL'] : 
                        userData.role === 'MANAGER' ? ['READ', 'write'] : ['read'],
            assignedBy: adminUser.id
          }
        });
      }

      // Create tenant activities if needed
      if (tenantData.activityLevel > 0) {
        const activities = [];
        for (let i = 0; i < tenantData.activityLevel; i++) {
          activities.push({
            tenantId: tenant.id,
            userId: tenantData.users[Math.floor(Math.random() * tenantData.users.length)].email,
            activityType: ['USER_LOGIN', 'MODULE_ACCESS', 'SYSTEM_CONFIG', 'DATA_EXPORT'][Math.floor(Math.random() * 4)] as any,
            description: [
              'Benutzer hat sich angemeldet',
              'Modul wurde aufgerufen',
              'Systemkonfiguration geändert',
              'Daten exportiert'
            ][Math.floor(Math.random() * 4)],
            performedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
            metadata: {
              source: 'tenant_seed',
              automated: true
            }
          });
        }

        // Get user IDs for activities
        const tenantUsers = await prisma.user.findMany({
          where: { tenantId: tenant.id },
          select: { id: true }
        });

        for (const activity of activities) {
          await prisma.tenantActivity.create({
            data: {
              ...activity,
              userId: tenantUsers[Math.floor(Math.random() * tenantUsers.length)].id
            }
          });
        }
      }

      // Create tenant analytics
      await prisma.tenantAnalytics.create({
        data: {
          tenantId: tenant.id,
          periodType: 'DAILY',
          periodStart: new Date(Date.now() - 24 * 60 * 60 * 1000),
          periodEnd: new Date(),
          totalUsers: tenantData.userCount,
          activeUsers: Math.floor(tenantData.userCount * 0.8),
          totalActivities: tenantData.activityLevel,
          dailyActiveUsers: Math.floor(tenantData.userCount * 0.6),
          weeklyActiveUsers: Math.floor(tenantData.userCount * 0.9),
          monthlyActiveUsers: tenantData.userCount,
          avgSessionDuration: 45.0 + Math.random() * 30,
          avgActivitiesPerUser: tenantData.activityLevel / Math.max(tenantData.userCount, 1),
          systemUtilization: tenantData.utilizationRate,
          aiHealthScore: tenantData.healthScore,
          aiGrowthPrediction: Math.random() * 20 + 5,
          aiRiskAssessment: 100 - tenantData.healthScore,
          securityScore: tenantData.securityScore,
          complianceScore: 90.0 + Math.random() * 10,
          aiRecommendations: [
            `Optimierung der Benutzeraktivität für ${tenantData.displayName}`,
            'Sicherheitsrichtlinien aktualisieren',
            'Performance-Monitoring erweitern'
          ]
        }
      });

      // Create tenant customization
      await prisma.tenantCustomization.create({
        data: {
          tenantId: tenant.id,
          brandName: tenantData.displayName,
          primaryColor: tenantData.brandColor,
          logoUrl: null,
          darkModeEnabled: true,
          customTheme: {
            theme: 'professional',
            layout: 'standard'
          }
        }
      });

      console.log(`✅ Tenant ${tenantData.displayName} created with ${tenantData.userCount} users and ${tenantData.activityLevel} activities`);
    }

    console.log('🎉 Tenant Management seeding completed successfully!');
    console.log(`📊 Created ${MOCKUP_TENANTS.length} tenants with ${MOCKUP_TENANTS.reduce((acc, t) => acc + t.userCount, 0)} total users`);

  } catch (error) {
    console.error('❌ Error during tenant seeding:', error);
    throw error;
  }
}

export { seedTenantManagement };
