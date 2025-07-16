
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedEnhancedRoles() {
  console.log('🔄 Seeding Enhanced Roles...');

  // Define hierarchical roles based on mockup (Level 5-100)
  const enhancedRolesData = [
    {
      name: 'Guest User',
      description: 'Basic access for external users and visitors',
      category: 'EXTERNAL' as const,
      level: 'BASIC' as const,
      hierarchyLevel: 5,
      levelColor: '#6B7280',
      levelBadge: 'Level 5',
      permissionCount: 5,
      userCount: 0,
      isSystem: false,
      isTemplate: false,
      isAutoAssignable: true,
      requiresApproval: false,
      complianceLevel: 'LOW',
      aiRecommendationScore: 0.8,
      aiRiskAssessment: 0.1,
      aiSecurityScore: 0.9,
      departmentRestrictions: [],
      maxUsers: null
    },
    {
      name: 'Entry Level Employee',
      description: 'Standard access for new employees and interns',
      category: 'OPERATIONAL' as const,
      level: 'BASIC' as const,
      hierarchyLevel: 10,
      levelColor: '#16A34A',
      levelBadge: 'Level 10',
      permissionCount: 12,
      userCount: 2,
      isSystem: false,
      isTemplate: true,
      isAutoAssignable: true,
      requiresApproval: false,
      complianceLevel: 'STANDARD',
      aiRecommendationScore: 0.85,
      aiRiskAssessment: 0.15,
      aiSecurityScore: 0.85,
      departmentRestrictions: ['Human Resources', 'Operations'],
      maxUsers: 50
    },
    {
      name: 'Project Coordinator',
      description: 'Coordination access for project management tasks',
      category: 'OPERATIONAL' as const,
      level: 'STANDARD' as const,
      hierarchyLevel: 20,
      levelColor: '#16A34A',
      levelBadge: 'Level 20',
      permissionCount: 8,
      userCount: 0,
      isSystem: false,
      isTemplate: false,
      isAutoAssignable: false,
      requiresApproval: true,
      complianceLevel: 'STANDARD',
      aiRecommendationScore: 0.75,
      aiRiskAssessment: 0.25,
      aiSecurityScore: 0.8,
      departmentRestrictions: ['Operations', 'IT'],
      maxUsers: 20
    },
    {
      name: 'Team Lead',
      description: 'Leadership access for team management and oversight',
      category: 'MANAGEMENT' as const,
      level: 'ADVANCED' as const,
      hierarchyLevel: 30,
      levelColor: '#16A34A',
      levelBadge: 'Level 30',
      permissionCount: 9,
      userCount: 1,
      isSystem: false,
      isTemplate: true,
      isAutoAssignable: false,
      requiresApproval: true,
      complianceLevel: 'HIGH',
      aiRecommendationScore: 0.7,
      aiRiskAssessment: 0.3,
      aiSecurityScore: 0.75,
      departmentRestrictions: [],
      maxUsers: 15
    },
    {
      name: 'Department Manager',
      description: 'Full departmental access with budget and personnel control',
      category: 'MANAGEMENT' as const,
      level: 'EXPERT' as const,
      hierarchyLevel: 50,
      levelColor: '#2563EB',
      levelBadge: 'Level 50',
      permissionCount: 22,
      userCount: 1,
      isSystem: false,
      isTemplate: false,
      isAutoAssignable: false,
      requiresApproval: true,
      complianceLevel: 'HIGH',
      aiRecommendationScore: 0.65,
      aiRiskAssessment: 0.4,
      aiSecurityScore: 0.7,
      departmentRestrictions: [],
      maxUsers: 10
    },
    {
      name: 'Security Administrator',
      description: 'High-level security and compliance management access',
      category: 'TECHNICAL' as const,
      level: 'EXPERT' as const,
      hierarchyLevel: 85,
      levelColor: '#EA580C',
      levelBadge: 'Level 85',
      permissionCount: 15,
      userCount: 1,
      isSystem: false,
      isTemplate: false,
      isAutoAssignable: false,
      requiresApproval: true,
      complianceLevel: 'CRITICAL',
      aiRecommendationScore: 0.5,
      aiRiskAssessment: 0.8,
      aiSecurityScore: 0.6,
      departmentRestrictions: ['IT', 'Security'],
      maxUsers: 3
    },
    {
      name: 'System Administrator',
      description: 'Critical system access for infrastructure management',
      category: 'TECHNICAL' as const,
      level: 'ADMIN' as const,
      hierarchyLevel: 90,
      levelColor: '#DC2626',
      levelBadge: 'Level 90',
      permissionCount: 24,
      userCount: 1,
      isSystem: true,
      isTemplate: false,
      isAutoAssignable: false,
      requiresApproval: true,
      complianceLevel: 'CRITICAL',
      aiRecommendationScore: 0.4,
      aiRiskAssessment: 0.9,
      aiSecurityScore: 0.5,
      departmentRestrictions: ['IT'],
      maxUsers: 2
    },
    {
      name: 'Super Administrator',
      description: 'Ultimate system access with all privileges and controls',
      category: 'EXECUTIVE' as const,
      level: 'SUPER_ADMIN' as const,
      hierarchyLevel: 100,
      levelColor: '#DC2626',
      levelBadge: 'Level 100',
      permissionCount: 27,
      userCount: 2,
      isSystem: true,
      isTemplate: false,
      isAutoAssignable: false,
      requiresApproval: true,
      complianceLevel: 'CRITICAL',
      aiRecommendationScore: 0.3,
      aiRiskAssessment: 1.0,
      aiSecurityScore: 0.4,
      departmentRestrictions: [],
      maxUsers: 1
    }
  ];

  // Create Enhanced Roles
  const createdRoles = [];
  for (const roleData of enhancedRolesData) {
    try {
      const existingRole = await prisma.enhancedRole.findFirst({
        where: { name: roleData.name }
      });

      if (!existingRole) {
        const role = await prisma.enhancedRole.create({
          data: {
            ...roleData,
            createdBy: 'system-seed',
            aiOptimizedPermissions: [],
            aiUsagePattern: {},
            aiPerformanceMetrics: {},
            departmentRestrictions: roleData.departmentRestrictions
          }
        });
        createdRoles.push(role);
        console.log(`✅ Created Enhanced Role: ${role.name} (Level ${role.hierarchyLevel})`);
      } else {
        console.log(`⏭️  Enhanced Role already exists: ${roleData.name}`);
      }
    } catch (error) {
      console.error(`❌ Error creating Enhanced Role ${roleData.name}:`, error);
    }
  }

  // Create Role Hierarchy (inheritance relationships)
  try {
    // Set up inheritance: Entry Level -> Team Lead -> Department Manager
    const entryLevel = await prisma.enhancedRole.findFirst({ where: { name: 'Entry Level Employee' } });
    const teamLead = await prisma.enhancedRole.findFirst({ where: { name: 'Team Lead' } });
    const deptManager = await prisma.enhancedRole.findFirst({ where: { name: 'Department Manager' } });

    if (teamLead && entryLevel) {
      await prisma.enhancedRole.update({
        where: { id: teamLead.id },
        data: { inheritFromRoleId: entryLevel.id }
      });
      console.log('✅ Set inheritance: Team Lead -> Entry Level Employee');
    }

    if (deptManager && teamLead) {
      await prisma.enhancedRole.update({
        where: { id: deptManager.id },
        data: { inheritFromRoleId: teamLead.id }
      });
      console.log('✅ Set inheritance: Department Manager -> Team Lead');
    }
  } catch (error) {
    console.error('❌ Error setting role inheritance:', error);
  }

  // Create sample Role Performance Metrics
  for (const role of createdRoles) {
    try {
      const periodStart = new Date();
      periodStart.setMonth(periodStart.getMonth() - 1);
      const periodEnd = new Date();

      await prisma.rolePerformanceMetrics.create({
        data: {
          roleId: role.id,
          totalUsers: role.userCount,
          activeUsers: Math.floor(role.userCount * 0.8),
          avgSessionDuration: Math.random() * 120 + 30, // 30-150 minutes
          permissionUtilization: Math.random() * 0.8 + 0.2, // 20-100%
          loginFrequency: Math.random() * 10 + 1, // 1-11 per week
          taskCompletionRate: Math.random() * 0.4 + 0.6, // 60-100%
          errorRate: Math.random() * 0.1, // 0-10%
          aiPerformanceScore: role.aiSecurityScore,
          aiOptimizationTips: [
            'Consider reviewing unused permissions',
            'Monitor login patterns for anomalies',
            'Evaluate role assignment frequency'
          ],
          aiPredictedGrowth: Math.random() * 0.2 + 0.05, // 5-25% growth
          complianceViolations: Math.floor(Math.random() * 3),
          securityIncidents: Math.floor(Math.random() * 2),
          auditFindings: Math.floor(Math.random() * 5),
          tenantId: 'default',
          periodStart,
          periodEnd
        }
      });
      console.log(`✅ Created performance metrics for: ${role.name}`);
    } catch (error) {
      console.error(`❌ Error creating metrics for ${role.name}:`, error);
    }
  }

  // Assign users to roles (if users exist)
  try {
    const users = await prisma.user.findMany({ take: 10 });
    if (users.length > 0) {
      const roles = await prisma.enhancedRole.findMany();
      
      for (const role of roles.slice(0, 5)) { // Assign to first 5 roles
        const usersToAssign = users.slice(0, Math.min(role.userCount, users.length));
        
        for (const user of usersToAssign) {
          try {
            await prisma.userEnhancedRole.upsert({
              where: {
                userId_enhancedRoleId: {
                  userId: user.id,
                  enhancedRoleId: role.id
                }
              },
              update: {},
              create: {
                userId: user.id,
                enhancedRoleId: role.id,
                isActive: true,
                assignmentReason: 'Initial system setup',
                aiRecommendationScore: Math.random() * 0.5 + 0.5, // 50-100%
                aiPerformanceScore: Math.random() * 0.4 + 0.6, // 60-100%
                aiSuitabilityScore: Math.random() * 0.3 + 0.7, // 70-100%
                assignedBy: 'system-seed'
              }
            });
          } catch (assignError) {
            console.log(`⚠️ User ${user.email} already assigned to ${role.name}`);
          }
        }
        console.log(`✅ Assigned ${usersToAssign.length} users to: ${role.name}`);
      }
    }
  } catch (error) {
    console.error('❌ Error assigning users to enhanced roles:', error);
  }

  console.log('✨ Enhanced Roles seeding completed!');
}

export { seedEnhancedRoles };

// Run standalone if called directly
if (require.main === module) {
  seedEnhancedRoles()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
