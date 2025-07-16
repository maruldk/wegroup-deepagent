import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Seeding enhanced Sprint 5 data...');

    // Create test tenant
    const tenant = await prisma.tenant.upsert({
      where: { domain: 'wegroup-test.com' },
      update: {},
      create: {
        name: 'WeGroup Test Enterprise',
        domain: 'wegroup-test.com',
        subdomain: 'wegroup-test',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
        settings: {
          language: 'de',
          currency: 'EUR',
          timezone: 'Europe/Berlin',
          aiAutonomyLevel: 89.7
        },
        isActive: true
      }
    });

    // Create enhanced employee records with AI predictions
    const departments = ['Engineering', 'Sales', 'Marketing', 'Finance', 'Logistics', 'HR'];
    const employees = [];

    for (let i = 0; i < 25; i++) {
      const employee = await prisma.employee.create({
        data: {
          employeeId: `EMP${String(i + 1).padStart(3, '0')}`,
          firstName: `Employee${i + 1}`,
          lastName: `Testuser`,
          email: `employee${i + 1}@wegroup-test.com`,
          phone: `+49 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000000) + 1000000}`,
          department: departments[i % departments.length],
          position: ['Junior', 'Senior', 'Lead', 'Manager'][Math.floor(Math.random() * 4)] + ' ' + 
                   ['Developer', 'Analyst', 'Specialist', 'Coordinator'][Math.floor(Math.random() * 4)],
          hireDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 3),
          employmentStatus: 'ACTIVE',
          salary: Math.floor(Math.random() * 80000) + 40000,
          performanceScore: Math.floor(Math.random() * 40) + 60,
          predictedChurnRisk: Math.random() * 0.8,
          skillsMatrix: {
            technical: Math.floor(Math.random() * 40) + 60,
            communication: Math.floor(Math.random() * 40) + 60,
            leadership: Math.floor(Math.random() * 40) + 60,
            problemSolving: Math.floor(Math.random() * 40) + 60
          },
          suggestedLearningPaths: [
            'Advanced technical training',
            'Leadership development',
            'Communication skills'
          ].slice(0, Math.floor(Math.random() * 3) + 1),
          tenantId: tenant.id
        }
      });
      employees.push(employee);
    }

    // Create enhanced invoices with AI processing
    const vendors = ['TechCorp GmbH', 'Office Solutions AG', 'Digital Services Ltd', 'Cloud Provider Inc'];
    for (let i = 0; i < 30; i++) {
      await prisma.invoice.create({
        data: {
          invoiceNumber: `INV-2024-${String(i + 1).padStart(4, '0')}`,
          vendorName: vendors[Math.floor(Math.random() * vendors.length)],
          vendorEmail: `billing@vendor${i % vendors.length + 1}.com`,
          invoiceDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
          totalAmount: Math.floor(Math.random() * 10000) + 500,
          currency: 'EUR',
          processingStatus: ['RECEIVED', 'OCR_COMPLETED', 'VALIDATED', 'APPROVED'][Math.floor(Math.random() * 4)] as any,
          documentUrl: `uploads/invoices/invoice_${i + 1}.pdf`,
          documentHash: `hash_${Date.now()}_${i}`,
          ocrConfidenceScore: Math.random() * 0.3 + 0.7,
          extractedData: {
            lineItems: [
              { description: 'Professional Services', amount: Math.floor(Math.random() * 5000) + 1000 },
              { description: 'Software License', amount: Math.floor(Math.random() * 2000) + 500 }
            ]
          },
          isDuplicate: Math.random() < 0.05,
          predictedGlAccount: ['4000', '5000', '6000'][Math.floor(Math.random() * 3)],
          aiValidationScore: Math.random() * 0.3 + 0.7,
          paymentStatus: ['PENDING', 'PAID', 'OVERDUE'][Math.floor(Math.random() * 3)] as any,
          paymentForecastDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
          approvalStatus: ['PENDING', 'APPROVED', 'NEEDS_REVIEW'][Math.floor(Math.random() * 3)] as any,
          tenantId: tenant.id
        }
      });
    }

    // Create inventory items with AI optimization
    const categories = ['Electronics', 'Office Supplies', 'Software', 'Hardware'];
    for (let i = 0; i < 20; i++) {
      await prisma.inventoryItem.create({
        data: {
          sku: `SKU-${String(i + 1).padStart(4, '0')}`,
          name: `Product ${i + 1}`,
          description: `High-quality product ${i + 1} for business operations`,
          category: categories[Math.floor(Math.random() * categories.length)],
          currentStock: Math.floor(Math.random() * 500) + 50,
          minimumStock: Math.floor(Math.random() * 50) + 10,
          maximumStock: Math.floor(Math.random() * 500) + 200,
          reorderPoint: Math.floor(Math.random() * 100) + 25,
          unitCost: Math.floor(Math.random() * 200) + 20,
          demandForecast: [
            { month: 'Jan', demand: Math.floor(Math.random() * 100) + 50 },
            { month: 'Feb', demand: Math.floor(Math.random() * 100) + 50 },
            { month: 'Mar', demand: Math.floor(Math.random() * 100) + 50 }
          ],
          optimalStockLevel: Math.floor(Math.random() * 200) + 100,
          predictedRunoutDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000),
          autoReorderEnabled: Math.random() < 0.6,
          carryingCost: Math.floor(Math.random() * 50) + 10,
          orderingCost: Math.floor(Math.random() * 100) + 25,
          turnoverRate: Math.random() * 10 + 2,
          stockoutFrequency: Math.random() * 0.2,
          excessStockRisk: Math.random() * 0.3,
          tenantId: tenant.id
        }
      });
    }

    console.log('✅ Enhanced Sprint 5 seed data created successfully!');
    console.log(`
📊 SPRINT 5 DATA SUMMARY:
👥 HR Module:
   - ${employees.length} employees with AI performance predictions

💰 Finance Module:
   - 30 invoices with AI OCR processing

🚚 Logistics Module:
   - 20 inventory items with demand forecasting

🎯 Test Account: john@doe.com / johndoe123
    `);

  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });