
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Use the existing demo tenant
let DEMO_TENANT_ID = '';

async function getExistingTenant() {
  const existingTenant = await prisma.tenant.findFirst({
    where: {
      OR: [
        { name: { contains: 'Demo' } },
        { name: { contains: 'WeGroup' } }
      ]
    }
  });
  
  if (existingTenant) {
    DEMO_TENANT_ID = existingTenant.id;
    console.log(`✅ Using existing tenant: ${existingTenant.name} (${existingTenant.id})`);
    return existingTenant;
  }
  
  throw new Error('No suitable tenant found for demo data');
}

// Demo Service Categories and Types
const SERVICE_CATEGORIES = [
  'IT_SERVICES',
  'MARKETING_SERVICES',
  'HR_SERVICES', 
  'CONSULTING_SERVICES',
  'LOGISTICS_SERVICES',
  'FINANCE_SERVICES',
  'LEGAL_SERVICES',
  'FACILITY_SERVICES',
  'DESIGN_SERVICES',
  'MANUFACTURING_SERVICES'
] as const;

const SERVICE_TYPES = {
  IT_SERVICES: ['SOFTWARE_DEVELOPMENT', 'SYSTEM_INTEGRATION', 'IT_SUPPORT', 'CYBERSECURITY', 'CLOUD_SERVICES', 'DATA_ANALYTICS'],
  MARKETING_SERVICES: ['DIGITAL_MARKETING', 'CONTENT_CREATION', 'SEO_SEM', 'SOCIAL_MEDIA', 'BRANDING', 'EVENT_MANAGEMENT'],
  HR_SERVICES: ['RECRUITMENT', 'TRAINING', 'PAYROLL', 'HR_CONSULTING', 'PERFORMANCE_MANAGEMENT', 'EMPLOYEE_BENEFITS'],
  CONSULTING_SERVICES: ['STRATEGY_CONSULTING', 'PROCESS_OPTIMIZATION', 'CHANGE_MANAGEMENT', 'BUSINESS_ANALYSIS', 'PROJECT_MANAGEMENT', 'COMPLIANCE_CONSULTING'],
  LOGISTICS_SERVICES: ['FREIGHT_FORWARDING', 'WAREHOUSING', 'TRANSPORT', 'CUSTOMS_CLEARANCE', 'PACKAGING', 'SUPPLY_CHAIN'],
  FINANCE_SERVICES: ['ACCOUNTING', 'BOOKKEEPING', 'TAX_ADVISORY', 'FINANCIAL_PLANNING', 'AUDIT_SERVICES', 'INVESTMENT_ADVISORY'],
  LEGAL_SERVICES: ['CONTRACT_LAW', 'CORPORATE_LAW', 'IP_LAW', 'COMPLIANCE', 'LITIGATION', 'LEGAL_ADVISORY'],
  FACILITY_SERVICES: ['CLEANING', 'SECURITY', 'MAINTENANCE', 'CATERING', 'OFFICE_MANAGEMENT', 'FACILITY_PLANNING'],
  DESIGN_SERVICES: ['GRAPHIC_DESIGN', 'WEB_DESIGN', 'PRODUCT_DESIGN', 'INTERIOR_DESIGN', 'ARCHITECTURE', 'UX_UI_DESIGN'],
  MANUFACTURING_SERVICES: ['PRODUCTION', 'QUALITY_CONTROL', 'ASSEMBLY', 'PROTOTYPING', 'PACKAGING_MANUFACTURING', 'TOOLING']
} as const;

// Demo Customers
const DEMO_CUSTOMERS = [
  {
    companyName: 'TechStart GmbH',
    industry: 'Technology',
    companySize: 'STARTUP',
    contactPerson: 'Sarah Mueller',
    firstName: 'Sarah',
    lastName: 'Mueller',
    email: 'sarah.mueller@techstart.de',
    phone: '+49 30 12345001',
    website: 'https://techstart.de',
    address: {
      street: 'Friedrichstr. 123',
      city: 'Berlin',
      zipCode: '10117',
      country: 'Deutschland'
    }
  },
  {
    companyName: 'Marketing Pro AG',
    industry: 'Marketing',
    companySize: 'SME',
    contactPerson: 'Thomas Weber',
    firstName: 'Thomas',
    lastName: 'Weber',
    email: 'thomas.weber@marketingpro.de',
    phone: '+49 89 23456002',
    website: 'https://marketingpro.de',
    address: {
      street: 'Maximilianstr. 45',
      city: 'München',
      zipCode: '80539',
      country: 'Deutschland'
    }
  },
  {
    companyName: 'Global Consulting',
    industry: 'Consulting',
    companySize: 'ENTERPRISE',
    contactPerson: 'Dr. Andrea Schmidt',
    firstName: 'Andrea',
    lastName: 'Schmidt',
    email: 'andrea.schmidt@globalconsulting.de',
    phone: '+49 69 34567003',
    website: 'https://globalconsulting.de',
    address: {
      street: 'Kaiserstr. 78',
      city: 'Frankfurt',
      zipCode: '60329',
      country: 'Deutschland'
    }
  },
  {
    companyName: 'LogiFlow Solutions',
    industry: 'Logistics',
    companySize: 'SME',
    contactPerson: 'Michael Hoffmann',
    firstName: 'Michael',
    lastName: 'Hoffmann',
    email: 'michael.hoffmann@logiflow.de',
    phone: '+49 40 45678004',
    website: 'https://logiflow.de',
    address: {
      street: 'Hafenstr. 12',
      city: 'Hamburg',
      zipCode: '20359',
      country: 'Deutschland'
    }
  },
  {
    companyName: 'FinanceFirst AG',
    industry: 'Finance',
    companySize: 'ENTERPRISE',
    contactPerson: 'Julia Fischer',
    firstName: 'Julia',
    lastName: 'Fischer',
    email: 'julia.fischer@financefirst.de',
    phone: '+49 211 56789005',
    website: 'https://financefirst.de',
    address: {
      street: 'Königsallee 90',
      city: 'Düsseldorf',
      zipCode: '40212',
      country: 'Deutschland'
    }
  }
];

// Demo Suppliers
const DEMO_SUPPLIERS = [
  {
    companyName: 'DevExperts Ltd',
    businessType: 'CORPORATION',
    categories: ['IT_SERVICES'],
    serviceTypes: ['SOFTWARE_DEVELOPMENT'],
    contactPerson: 'Alex Johnson',
    email: 'alex.johnson@devexperts.com',
    phone: '+49 30 98765001',
    website: 'https://devexperts.com',
    linkedIn: 'https://linkedin.com/company/devexperts',
    experience: 8,
    teamSize: 25,
    certifications: ['ISO 27001', 'AWS Certified', 'Scrum Master'],
    technologies: ['React', 'Node.js', 'AWS', 'Docker', 'Kubernetes'],
    portfolio: [
      { name: 'E-Commerce Platform', description: 'Full-stack e-commerce solution', url: 'https://example.com' }
    ]
  },
  {
    companyName: 'Creative Design Studio',
    businessType: 'AGENCY',
    categories: ['MARKETING_SERVICES'],
    serviceTypes: ['DIGITAL_MARKETING', 'BRANDING'],
    contactPerson: 'Maria Rodriguez',
    email: 'maria@creativedesign.de',
    phone: '+49 89 87654002',
    website: 'https://creativedesign.de',
    linkedIn: 'https://linkedin.com/company/creative-design',
    experience: 6,
    teamSize: 15,
    certifications: ['Google Ads Certified', 'Adobe Certified Expert'],
    tools: ['Adobe Creative Suite', 'Figma', 'Sketch', 'Google Analytics'],
    portfolio: [
      { name: 'Brand Identity Campaign', description: 'Complete rebranding for tech startup', url: 'https://example.com' }
    ]
  },
  {
    companyName: 'HR Solutions Pro',
    businessType: 'CORPORATION',
    categories: ['HR_SERVICES'],
    serviceTypes: ['RECRUITMENT'],
    contactPerson: 'Robert Chen',
    email: 'robert.chen@hrsolutions.de',
    phone: '+49 69 76543003',
    website: 'https://hrsolutions.de',
    experience: 12,
    teamSize: 30,
    certifications: ['SHRM Certified', 'CIPD Qualified'],
    specializations: ['Executive Search', 'Leadership Development', 'Organizational Change']
  },
  {
    companyName: 'Express Logistics GmbH',
    businessType: 'CORPORATION',
    categories: ['TRANSPORT_LOGISTICS'],
    serviceTypes: ['FREIGHT_FORWARDING'],
    contactPerson: 'Hans Mueller',
    email: 'hans.mueller@expresslogistics.de',
    phone: '+49 40 65432004',
    website: 'https://expresslogistics.de',
    experience: 15,
    teamSize: 120,
    certifications: ['ISO 9001', 'AEO Certified'],
    geographicalCoverage: ['Deutschland', 'Europa', 'Weltweit']
  },
  {
    companyName: 'Legal Advisors Network',
    businessType: 'AGENCY',
    categories: ['LEGAL_SERVICES'],
    serviceTypes: ['CONTRACT_LAW'],
    contactPerson: 'Dr. Sophie Wagner',
    email: 'sophie.wagner@legaladvisors.de',
    phone: '+49 211 54321005',
    website: 'https://legaladvisors.de',
    experience: 20,
    teamSize: 45,
    certifications: ['Fachanwalt für Handels- und Gesellschaftsrecht'],
    specializations: ['M&A', 'Corporate Compliance', 'International Business Law']
  },
  {
    companyName: 'Finance Consulting Partners',
    businessType: 'AGENCY',
    categories: ['FINANCIAL_SERVICES'],
    serviceTypes: ['ACCOUNTING'],
    contactPerson: 'Peter Zimmermann',
    email: 'peter.zimmermann@financeconsulting.de',
    phone: '+49 30 43210006',
    website: 'https://financeconsulting.de',
    experience: 18,
    teamSize: 35,
    certifications: ['Steuerberater', 'Wirtschaftsprüfer'],
    specializations: ['Tax Optimization', 'Financial Due Diligence', 'CFO Services']
  }
];

// Demo Users for different portal types
const DEMO_USERS = [
  {
    email: 'customer.demo@wegroup.com',
    password: 'customer123',
    firstName: 'Customer',
    lastName: 'Demo',
    role: 'CUSTOMER'
  },
  {
    email: 'supplier.demo@wegroup.com', 
    password: 'supplier123',
    firstName: 'Supplier',
    lastName: 'Demo',
    role: 'SUPPLIER'
  },
  {
    email: 'internal.demo@wegroup.com',
    password: 'internal123',
    firstName: 'Internal',
    lastName: 'Demo',
    role: 'INTERNAL'
  },
  {
    email: 'admin.demo@wegroup.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'Demo',
    role: 'ADMIN'
  }
];

// Service Request Templates
const SERVICE_REQUEST_TEMPLATES = [
  {
    category: 'IT_SERVICES',
    serviceType: 'SOFTWARE_DEVELOPMENT',
    title: 'E-Commerce Website Entwicklung',
    description: 'Entwicklung einer modernen E-Commerce-Plattform mit React und Node.js',
    requirements: {
      technologies: ['React', 'Node.js', 'PostgreSQL'],
      features: ['Product Catalog', 'Shopping Cart', 'Payment Integration', 'User Management'],
      timeline: '3-4 Monate',
      budget_range: '25000-35000'
    },
    budget: 30000
  },
  {
    category: 'MARKETING_SERVICES',
    serviceType: 'DIGITAL_MARKETING',
    title: 'Digitale Marketing-Kampagne',
    description: 'Umfassende digitale Marketing-Strategie mit SEO, SEM und Social Media',
    requirements: {
      channels: ['Google Ads', 'Facebook', 'Instagram', 'LinkedIn'],
      duration: '6 Monate',
      target_audience: 'B2B Entscheidungsträger',
      kpis: ['Lead Generation', 'Brand Awareness', 'Conversion Rate']
    },
    budget: 15000
  },
  {
    category: 'HR_SERVICES',
    serviceType: 'RECRUITMENT',
    title: 'Senior Developer Recruitment',
    description: 'Suche und Auswahl eines Senior Full-Stack Developers',
    requirements: {
      position: 'Senior Full-Stack Developer',
      skills: ['React', 'Node.js', 'AWS', '5+ Jahre Erfahrung'],
      timeline: '6-8 Wochen',
      salary_range: '70000-90000'
    },
    budget: 8000
  },
  {
    category: 'IT_SERVICES',
    serviceType: 'SYSTEM_INTEGRATION',
    title: 'Digitale Transformation Beratung',
    description: 'Strategieberatung für die digitale Transformation des Unternehmens',
    requirements: {
      scope: ['Prozessanalyse', 'Technologie-Assessment', 'Roadmap-Entwicklung'],
      duration: '3 Monate',
      deliverables: ['Ist-Analyse', 'Transformationsplan', 'Implementation Roadmap']
    },
    budget: 25000
  },
  {
    category: 'LEGAL_SERVICES',
    serviceType: 'CONTRACT_LAW',
    title: 'Vertragsrechtliche Beratung',
    description: 'Rechtliche Prüfung und Optimierung von Kundenverträgen',
    requirements: {
      contract_types: ['Service Agreements', 'SaaS Contracts', 'Partnership Agreements'],
      languages: ['Deutsch', 'Englisch'],
      timeline: '4-6 Wochen'
    },
    budget: 12000
  }
];



async function createDemoUsers() {
  try {
    for (const userData of DEMO_USERS) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          tenantId: DEMO_TENANT_ID,
          isActive: true,
          emailVerified: new Date(),
        }
      });
    }
    console.log('✅ Demo users created/updated');
  } catch (error) {
    console.error('❌ Error creating demo users:', error);
  }
}

async function createDemoCustomers() {
  try {
    for (const customerData of DEMO_CUSTOMERS) {
      const customerNumber = `CUS-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      await prisma.serviceCustomer.create({
        data: {
          tenantId: DEMO_TENANT_ID,
          customerNumber,
          ...customerData,
          totalOrders: Math.floor(Math.random() * 10) + 1,
          totalSpent: Math.floor(Math.random() * 50000) + 10000,
          averageOrderValue: Math.floor(Math.random() * 15000) + 5000,
          satisfactionScore: (Math.random() * 1.5 + 3.5), // 3.5-5.0
          lastActivityAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
        }
      });
    }
    console.log('✅ Demo customers created');
  } catch (error) {
    console.error('❌ Error creating demo customers:', error);
  }
}

async function createDemoSuppliers() {
  try {
    for (const supplierData of DEMO_SUPPLIERS) {
      const supplierNumber = `SUP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      await prisma.serviceSupplier.create({
        data: {
          tenantId: DEMO_TENANT_ID,
          supplierNumber,
          ...supplierData,
          address: {
            street: 'Musterstr. 123',
            city: 'Berlin',
            zipCode: '10115',
            country: 'Deutschland'
          },
          status: 'VERIFIED',
          isVerified: true,
          verificationDate: new Date(),
          totalQuotes: Math.floor(Math.random() * 50) + 10,
          totalOrders: Math.floor(Math.random() * 30) + 5,
          totalRevenue: Math.floor(Math.random() * 200000) + 50000,
          averageQuoteValue: Math.floor(Math.random() * 20000) + 5000,
          winRate: Math.random() * 0.4 + 0.4, // 40-80%
          performanceScore: Math.random() * 1.5 + 3.5, // 3.5-5.0
          qualityScore: Math.random() * 1.5 + 3.5,
          reliabilityScore: Math.random() * 1.5 + 3.5,
          responseTime: Math.random() * 24 + 2, // 2-26 hours
          onTimeDeliveryRate: Math.random() * 0.3 + 0.7, // 70-100%
          customerSatisfaction: Math.random() * 1.5 + 3.5,
          currencies: ['EUR', 'USD'],
          languages: ['de', 'en'],
          geographicalCoverage: ['Deutschland', 'Europa'],
          lastActivityAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Last 7 days
        }
      });
    }
    console.log('✅ Demo suppliers created');
  } catch (error) {
    console.error('❌ Error creating demo suppliers:', error);
  }
}

async function createDemoServiceRequests() {
  try {
    const customers = await prisma.serviceCustomer.findMany({
      where: { tenantId: DEMO_TENANT_ID }
    });

    for (let i = 0; i < SERVICE_REQUEST_TEMPLATES.length; i++) {
      const template = SERVICE_REQUEST_TEMPLATES[i];
      const customer = customers[i % customers.length];
      const requestNumber = `SRQ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      await prisma.serviceRequest.create({
        data: {
          tenantId: DEMO_TENANT_ID,
          customerId: customer.id,
          requestNumber,
          category: template.category,
          serviceType: template.serviceType,
          title: template.title,
          description: template.description,
          requirements: template.requirements,
          budget: template.budget,
          currency: 'EUR',
          deadline: new Date(Date.now() + (Math.random() * 60 + 30) * 24 * 60 * 60 * 1000), // 30-90 days
          priority: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
          status: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'RFQ_CREATED'][Math.floor(Math.random() * 4)],
          submittedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000), // Last 14 days
          source: 'PORTAL',
        }
      });
    }
    console.log('✅ Demo service requests created');
  } catch (error) {
    console.error('❌ Error creating demo service requests:', error);
  }
}

async function createDemoRFQsAndQuotes() {
  try {
    const serviceRequests = await prisma.serviceRequest.findMany({
      where: { 
        tenantId: DEMO_TENANT_ID,
        status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'RFQ_CREATED'] }
      },
      include: { customer: true }
    });

    const suppliers = await prisma.serviceSupplier.findMany({
      where: { tenantId: DEMO_TENANT_ID }
    });

    for (const request of serviceRequests) {
      // Create RFQ
      const rfqNumber = `RFQ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      const rfq = await prisma.serviceRFQ.create({
        data: {
          tenantId: DEMO_TENANT_ID,
          serviceRequestId: request.id,
          rfqNumber,
          title: request.title,
          description: request.description,
          category: request.category,
          serviceType: request.serviceType,
          requirements: request.requirements,
          criteria: {
            price: { weight: 0.3, description: 'Preis-Leistungs-Verhältnis' },
            quality: { weight: 0.25, description: 'Qualität der Lösung' },
            timeline: { weight: 0.2, description: 'Zeitplan und Verfügbarkeit' },
            experience: { weight: 0.15, description: 'Erfahrung und Referenzen' },
            support: { weight: 0.1, description: 'Support und Wartung' }
          },
          budget: request.budget,
          currency: 'EUR',
          deadline: new Date(Date.now() + (Math.random() * 30 + 14) * 24 * 60 * 60 * 1000), // 14-44 days
          status: 'PUBLISHED',
          publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Last 7 days
          automaticEvaluation: true,
        }
      });

      // Create 2-4 quotes per RFQ
      const numQuotes = Math.floor(Math.random() * 3) + 2;
      const rfqSuppliers = suppliers
        .filter(s => s.categories.includes(request.category))
        .slice(0, numQuotes);

      for (const supplier of rfqSuppliers) {
        const quoteNumber = `QUO-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const basePrice = (request.budget || 10000) * (0.8 + Math.random() * 0.4); // ±20% of budget
        const additionalCosts = basePrice * (0.1 + Math.random() * 0.1); // 10-20% additional
        const totalPrice = basePrice + additionalCosts;

        await prisma.serviceQuote.create({
          data: {
            tenantId: DEMO_TENANT_ID,
            rfqId: rfq.id,
            supplierId: supplier.id,
            quoteNumber,
            title: `${supplier.companyName} - ${request.title}`,
            description: `Professionelle Umsetzung durch ${supplier.companyName}`,
            proposal: `Wir bieten eine umfassende Lösung für Ihre Anforderungen mit bewährten Methoden und modernen Technologien.`,
            methodology: 'Agile Entwicklung mit regelmäßigen Reviews und Feedback-Zyklen',
            deliverables: [
              'Vollständige Lösung gemäß Anforderungen',
              'Dokumentation und Schulung',
              'Support und Wartung für 6 Monate'
            ],
            basePrice,
            additionalCosts: { setup: additionalCosts * 0.6, support: additionalCosts * 0.4 },
            totalPrice,
            currency: 'EUR',
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            deliveryTime: Math.floor(Math.random() * 60) + 30, // 30-90 days
            estimatedDuration: Math.floor(Math.random() * 120) + 60, // 60-180 days
            paymentTerms: 'NET_30',
            status: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW'][Math.floor(Math.random() * 3)],
            submittedAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000), // Last 5 days
            aiScore: Math.random() * 40 + 60, // 60-100
            aiRanking: Math.floor(Math.random() * numQuotes) + 1,
          }
        });
      }

      // Update RFQ quote count
      await prisma.serviceRFQ.update({
        where: { id: rfq.id },
        data: { totalQuotes: rfqSuppliers.length }
      });
    }
    console.log('✅ Demo RFQs and quotes created');
  } catch (error) {
    console.error('❌ Error creating demo RFQs and quotes:', error);
  }
}

async function createDemoOrders() {
  try {
    const quotes = await prisma.serviceQuote.findMany({
      where: { 
        tenantId: DEMO_TENANT_ID,
        status: 'SUBMITTED' 
      },
      include: { 
        rfq: { include: { serviceRequest: { include: { customer: true } } } },
        supplier: true 
      },
      take: 5 // Create orders for first 5 submitted quotes
    });

    for (const quote of quotes) {
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      await prisma.serviceOrder.create({
        data: {
          tenantId: DEMO_TENANT_ID,
          customerId: quote.rfq.serviceRequest.customerId,
          supplierId: quote.supplierId,
          rfqId: quote.rfqId,
          quoteId: quote.id,
          orderNumber,
          category: quote.rfq.category,
          serviceType: quote.rfq.serviceType,
          title: quote.title,
          description: quote.description,
          requirements: quote.rfq.requirements,
          deliverables: quote.deliverables,
          totalAmount: quote.totalPrice,
          currency: 'EUR',
          paymentTerms: quote.paymentTerms,
          startDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000), // Next 14 days
          expectedEndDate: new Date(Date.now() + (quote.deliveryTime + Math.random() * 30) * 24 * 60 * 60 * 1000),
          status: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'][Math.floor(Math.random() * 3)],
          progress: Math.random() * 100,
          qualityScore: Math.random() * 1.5 + 3.5, // 3.5-5.0
          satisfactionScore: Math.random() * 1.5 + 3.5,
        }
      });

      // Mark quote as winning
      await prisma.serviceQuote.update({
        where: { id: quote.id },
        data: { isWinning: true }
      });
    }
    console.log('✅ Demo orders created');
  } catch (error) {
    console.error('❌ Error creating demo orders:', error);
  }
}

async function main() {
  console.log('🚀 Starting Universal Services Demo Data Seeding...\n');

  await getExistingTenant();
  await createDemoUsers();
  await createDemoCustomers();
  await createDemoSuppliers();
  await createDemoServiceRequests();
  await createDemoRFQsAndQuotes();
  await createDemoOrders();

  console.log('\n✅ Universal Services Demo Data Seeding Complete!');
  console.log('\n📊 Demo Data Summary:');
  console.log(`- Customers: ${DEMO_CUSTOMERS.length}`);
  console.log(`- Suppliers: ${DEMO_SUPPLIERS.length}`);
  console.log(`- Service Categories: ${SERVICE_CATEGORIES.length}`);
  console.log(`- Service Requests: ${SERVICE_REQUEST_TEMPLATES.length}`);
  console.log('- RFQs: Generated based on service requests');
  console.log('- Quotes: 2-4 per RFQ');
  console.log('- Orders: 5 sample orders');
  console.log('\n🔑 Demo Login Credentials:');
  console.log('Customer Portal: customer.demo@wegroup.com / customer123');
  console.log('Supplier Portal: supplier.demo@wegroup.com / supplier123');
  console.log('Internal System: internal.demo@wegroup.com / internal123');
  console.log('Admin Access: admin.demo@wegroup.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
