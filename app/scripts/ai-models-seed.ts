
// WeGroup Platform - AI Models Seed Script
// Populate database with sample AI models for demonstration

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleAIModels = [
  {
    name: "GPT-4.1 Mini",
    description: "OpenAI's fast and intelligent small model for lightweight tasks",
    modelType: "TEXT_GENERATION" as any,
    version: "1.0.0",
    status: "DEPLOYED" as any,
    modelSource: "OPENAI" as any,
    isOpenSource: false,
    licenseType: "Commercial",
    provider: "OpenAI",
    apiEndpoint: "https://api.openai.com/v1/chat/completions",
    apiKeyRequired: true,
    costPerRequest: 0.0025,
    costPerToken: 0.00015,
    primaryPurpose: "Text Generation and Analysis",
    useCases: ["chat", "completion", "analysis", "summarization"],
    supportedLanguages: ["en", "de", "fr", "es", "it"],
    accuracy: 0.92,
    precision: 0.89,
    recall: 0.91,
    f1Score: 0.90,
    riskLevel: "MEDIUM" as any,
    auditRequired: true,
    approvalRequired: true,
    securityCompliance: {
      encryption: true,
      gdprCompliant: true,
      auditLogs: true
    }
  },
  {
    name: "Llama 3.1 8B",
    description: "Meta's open-source large language model optimized for efficiency",
    modelType: "TEXT_GENERATION" as any,
    version: "3.1.0",
    status: "DEPLOYED" as any,
    modelSource: "META" as any,
    isOpenSource: true,
    licenseType: "Apache-2.0",
    provider: "Meta",
    apiEndpoint: "https://api.together.xyz/v1/chat/completions",
    apiKeyRequired: true,
    costPerRequest: 0.0008,
    costPerToken: 0.00002,
    primaryPurpose: "General Text Generation",
    useCases: ["chat", "completion", "creative writing"],
    supportedLanguages: ["en", "de", "fr", "es"],
    accuracy: 0.87,
    precision: 0.85,
    recall: 0.88,
    f1Score: 0.86,
    riskLevel: "LOW" as any,
    auditRequired: false,
    approvalRequired: false,
    securityCompliance: {
      openSource: true,
      communityAudited: true
    }
  },
  {
    name: "Claude 3.5 Sonnet",
    description: "Anthropic's advanced AI model for complex reasoning and analysis",
    modelType: "TEXT_GENERATION" as any,
    version: "3.5.0",
    status: "READY" as any,
    modelSource: "ANTHROPIC" as any,
    isOpenSource: false,
    licenseType: "Commercial",
    provider: "Anthropic",
    apiEndpoint: "https://api.anthropic.com/v1/messages",
    apiKeyRequired: true,
    costPerRequest: 0.0035,
    costPerToken: 0.0003,
    primaryPurpose: "Advanced Reasoning and Analysis",
    useCases: ["analysis", "reasoning", "research", "coding"],
    supportedLanguages: ["en", "de", "fr", "es", "ja"],
    accuracy: 0.94,
    precision: 0.93,
    recall: 0.95,
    f1Score: 0.94,
    riskLevel: "MEDIUM" as any,
    auditRequired: true,
    approvalRequired: true,
    securityCompliance: {
      encryption: true,
      constitutionalAI: true,
      harmlessness: true
    }
  },
  {
    name: "Code Llama 34B",
    description: "Meta's specialized code generation model",
    modelType: "CODE_GENERATION" as any,
    version: "1.0.0",
    status: "DEPLOYED" as any,
    modelSource: "META" as any,
    isOpenSource: true,
    licenseType: "Apache-2.0",
    provider: "Meta",
    apiEndpoint: "https://api.together.xyz/v1/completions",
    apiKeyRequired: true,
    costPerRequest: 0.0012,
    costPerToken: 0.00004,
    primaryPurpose: "Code Generation and Analysis",
    useCases: ["code_generation", "code_review", "debugging"],
    supportedLanguages: ["python", "javascript", "java", "cpp", "go"],
    accuracy: 0.89,
    precision: 0.87,
    recall: 0.90,
    f1Score: 0.88,
    riskLevel: "LOW" as any,
    auditRequired: false,
    approvalRequired: false,
    securityCompliance: {
      openSource: true,
      codeAnalysis: true
    }
  },
  {
    name: "DALL-E 3",
    description: "OpenAI's advanced image generation model",
    modelType: "IMAGE_GENERATION" as any,
    version: "3.0.0",
    status: "PENDING_APPROVAL" as any,
    modelSource: "OPENAI" as any,
    isOpenSource: false,
    licenseType: "Commercial",
    provider: "OpenAI",
    apiEndpoint: "https://api.openai.com/v1/images/generations",
    apiKeyRequired: true,
    costPerRequest: 0.04,
    costPerToken: null,
    primaryPurpose: "Image Generation",
    useCases: ["image_generation", "creative_design", "marketing"],
    supportedLanguages: ["en"],
    accuracy: 0.91,
    precision: 0.88,
    recall: 0.93,
    f1Score: 0.90,
    riskLevel: "HIGH" as any,
    auditRequired: true,
    approvalRequired: true,
    securityCompliance: {
      contentFiltering: true,
      copyrightProtection: true,
      biasDetection: true
    }
  },
  {
    name: "Mistral 7B Instruct",
    description: "Mistral AI's efficient instruction-following model",
    modelType: "TEXT_GENERATION" as any,
    version: "0.3.0",
    status: "DEPLOYED" as any,
    modelSource: "OPEN_SOURCE" as any,
    isOpenSource: true,
    licenseType: "Apache-2.0",
    provider: "Mistral AI",
    apiEndpoint: "https://api.mistral.ai/v1/chat/completions",
    apiKeyRequired: true,
    costPerRequest: 0.0007,
    costPerToken: 0.000025,
    primaryPurpose: "Instruction Following",
    useCases: ["instruction_following", "task_automation", "assistance"],
    supportedLanguages: ["en", "fr", "de", "es"],
    accuracy: 0.86,
    precision: 0.84,
    recall: 0.87,
    f1Score: 0.85,
    riskLevel: "LOW" as any,
    auditRequired: false,
    approvalRequired: false,
    securityCompliance: {
      openSource: true,
      europeanModel: true
    }
  }
]

export async function seedAIModels() {
  console.log('🚀 Starting AI Models seeding...')

  try {
    // Clear existing AI models (optional - comment out if you want to keep existing data)
    // await prisma.aIModel.deleteMany({})

    // Create AI models
    for (const modelData of sampleAIModels) {
      const model = await prisma.aIModel.create({
        data: {
          ...modelData,
          tenantId: 'default',
          createdBy: 'system-seed',
          tags: modelData.useCases,
          predictionCount: Math.floor(Math.random() * 1000) + 100,
          averageResponseTime: Math.random() * 200 + 50,
          lastUsedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        }
      })

      // Create approval records for models that require approval
      if (modelData.approvalRequired && modelData.status === 'PENDING_APPROVAL') {
        await prisma.modelApproval.create({
          data: {
            modelId: model.id,
            requestedBy: 'system-seed',
            approvalType: 'DEPLOYMENT',
            requestReason: `Initial deployment approval required for ${model.name}`,
            riskAssessment: {
              riskLevel: modelData.riskLevel,
              assessmentDate: new Date(),
              assessedBy: 'system-seed'
            },
            tenantId: 'default'
          }
        })
      }

      // Create some sample metrics for each model
      for (let i = 0; i < 5; i++) {
        await prisma.aIModelMetric.create({
          data: {
            modelId: model.id,
            metricName: 'ACCURACY',
            metricValue: modelData.accuracy + (Math.random() - 0.5) * 0.1,
            collectedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
            tenantId: 'default'
          }
        })
      }

      console.log(`✅ Created model: ${model.name}`)
    }

    // Create sample model discoveries
    await prisma.modelDiscovery.create({
      data: {
        discoveryType: 'AUTOMATED_SEARCH',
        status: 'COMPLETED',
        searchCriteria: {
          useCases: ['text_generation', 'analysis'],
          budgetLimit: 1000,
          performanceRequirement: 'high'
        },
        targetUseCases: ['text_generation', 'content_creation'],
        foundModels: [
          {
            name: 'GPT-4 Turbo',
            provider: 'OpenAI',
            accuracy: 0.95,
            costPerToken: 0.0001
          }
        ],
        recommendations: [
          {
            modelId: 'gpt-4-turbo',
            rank: 1,
            reasoning: 'Best performance for complex text generation tasks',
            fitScore: 0.95
          }
        ],
        executedAt: new Date(),
        tenantId: 'default',
        triggeredBy: 'system-seed'
      }
    })

    console.log('🎉 AI Models seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding AI models:', error)
    throw error
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedAIModels()
    .then(() => {
      console.log('Seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Seeding failed:', error)
      process.exit(1)
    })
}
