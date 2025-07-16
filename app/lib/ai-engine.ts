
// WeGroup Platform - Sprint 4: Advanced AI Engine
// Central AI Orchestration System for 75% Autonomie

import { AIModel, AIDecision, DecisionType, DecisionStatus, AIModelType, ModelStatus, ModuleType } from './types'
import { AIModelType as PrismaAIModelType, DecisionType as PrismaDecisionType } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class AIEngine {
  private static instance: AIEngine
  private models: Map<string, AIModel> = new Map()
  private orchestrators: Map<string, any> = new Map()
  
  private constructor() {
    this.initializeModels()
  }

  public static getInstance(): AIEngine {
    if (!AIEngine.instance) {
      AIEngine.instance = new AIEngine()
    }
    return AIEngine.instance
  }

  // ===== AI MODEL MANAGEMENT =====

  async initializeModels() {
    try {
      const models = await prisma.aIModel.findMany({
        where: { isActive: true, status: 'DEPLOYED' }
      })
      
      for (const model of models) {
        this.models.set(model.id, model as unknown as AIModel)
      }
      
      console.log(`AI Engine initialized with ${models.length} active models`)
    } catch (error) {
      console.error('Failed to initialize AI models:', error)
    }
  }

  async deployModel(modelId: string): Promise<boolean> {
    try {
      const model = await prisma.aIModel.findUnique({
        where: { id: modelId }
      })

      if (!model) {
        throw new Error(`Model ${modelId} not found`)
      }

      // Simulate model deployment
      await prisma.aIModel.update({
        where: { id: modelId },
        data: {
          deploymentStatus: 'DEPLOYED',
          status: 'DEPLOYED',
          lastDeployedAt: new Date()
        }
      })

      this.models.set(modelId, model as unknown as AIModel)
      console.log(`Model ${model.name} deployed successfully`)
      return true
    } catch (error) {
      console.error(`Failed to deploy model ${modelId}:`, error)
      return false
    }
  }

  // ===== AI DECISION MAKING =====

  async makeDecision(
    decisionType: DecisionType,
    context: any,
    inputData: any,
    moduleSource: string,
    tenantId: string,
    affectedEntity?: string
  ): Promise<AIDecision | null> {
    try {
      // Find the best model for this decision type
      const model = this.selectBestModel(decisionType, context)
      
      if (!model) {
        throw new Error(`No suitable model found for decision type: ${decisionType}`)
      }

      // Generate AI decision using LLM
      const decision = await this.generateDecision(model, decisionType, context, inputData)
      
      // Create decision record
      const aiDecision = await prisma.aIDecision.create({
        data: {
          modelId: model.id,
          decisionType,
          context,
          inputData,
          outputData: decision.outputData,
          confidenceScore: decision.confidenceScore,
          decisionReasoning: decision.reasoning,
          riskAssessment: decision.riskAssessment,
          status: decision.confidenceScore > 0.8 ? 'APPROVED' : 'PENDING',
          requiresHumanReview: decision.confidenceScore < 0.7,
          humanApprovalRequired: decision.riskScore > 0.5,
          tenantId,
          moduleSource,
          affectedEntity
        }
      })

      // Update model usage statistics
      await this.updateModelUsage(model.id)

      return aiDecision as unknown as AIDecision
    } catch (error) {
      console.error('AI Decision failed:', error)
      return null
    }
  }

  private selectBestModel(decisionType: DecisionType, context: any): AIModel | null {
    const relevantModels = Array.from(this.models.values()).filter(model => {
      return this.isModelSuitableForDecision(model, decisionType)
    })

    if (relevantModels.length === 0) return null

    // Select model with highest accuracy for this decision type
    return relevantModels.reduce((best, current) => 
      (current.accuracy || 0) > (best.accuracy || 0) ? current : best
    )
  }

  private isModelSuitableForDecision(model: AIModel, decisionType: DecisionType): boolean {
    const suitabilityMap: Record<string, PrismaAIModelType[]> = {
      'APPROVE_PAYMENT': [PrismaAIModelType.FRAUD_DETECTION, PrismaAIModelType.ANOMALY_DETECTION],
      'VALIDATE_INVOICE': [PrismaAIModelType.QUALITY_ASSURANCE, PrismaAIModelType.ANOMALY_DETECTION],
      'ALLOCATE_RESOURCES': [PrismaAIModelType.RESOURCE_OPTIMIZATION, PrismaAIModelType.DEMAND_FORECASTING],
      'SCHEDULE_DELIVERY': [PrismaAIModelType.RESOURCE_OPTIMIZATION, PrismaAIModelType.PERFORMANCE_FORECASTING],
      'ASSIGN_TASK': [PrismaAIModelType.RESOURCE_OPTIMIZATION, PrismaAIModelType.PERFORMANCE_FORECASTING],
      'ESCALATE_ISSUE': [PrismaAIModelType.ANOMALY_DETECTION, PrismaAIModelType.QUALITY_ASSURANCE],
      'RECOMMEND_ACTION': [PrismaAIModelType.CUSTOMER_BEHAVIOR_PREDICTION, PrismaAIModelType.CONTENT_PERSONALIZATION],
      'OPTIMIZE_ROUTE': [PrismaAIModelType.RESOURCE_OPTIMIZATION, PrismaAIModelType.PERFORMANCE_FORECASTING],
      'PREDICT_DEMAND': [PrismaAIModelType.DEMAND_FORECASTING, PrismaAIModelType.CUSTOMER_BEHAVIOR_PREDICTION],
      'CLASSIFY_DOCUMENT': [PrismaAIModelType.QUALITY_ASSURANCE, PrismaAIModelType.CONTENT_PERSONALIZATION],
      'PERSONALIZE_CONTENT': [PrismaAIModelType.CONTENT_PERSONALIZATION, PrismaAIModelType.CUSTOMER_BEHAVIOR_PREDICTION],
      'AUTOMATE_WORKFLOW': [PrismaAIModelType.PROCESS_AUTOMATION, PrismaAIModelType.RESOURCE_OPTIMIZATION]
    }

    const suitableTypes = suitabilityMap[decisionType] || []
    return suitableTypes.includes(model.modelType as PrismaAIModelType)
  }

  private async generateDecision(
    model: AIModel, 
    decisionType: DecisionType, 
    context: any, 
    inputData: any
  ): Promise<any> {
    try {
      // Use LLM API for decision generation
      const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages: [{
            role: 'user',
            content: `As an AI decision system for ${decisionType}, analyze the following:
            
Context: ${JSON.stringify(context)}
Input Data: ${JSON.stringify(inputData)}
Model Type: ${model.modelType}

Provide a decision with the following JSON structure:
{
  "decision": "approve|reject|escalate",
  "confidenceScore": 0.85,
  "reasoning": "Clear explanation of the decision",
  "riskScore": 0.2,
  "riskAssessment": {
    "factors": ["factor1", "factor2"],
    "mitigation": "mitigation strategy"
  },
  "outputData": {
    "recommendation": "specific action",
    "priority": "high|medium|low",
    "timeline": "immediate|24h|week"
  }
}

Respond with raw JSON only.`
          }],
          response_format: { type: "json_object" },
          max_tokens: 1000
        })
      })

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.statusText}`)
      }

      const result = await response.json()
      const decisionData = JSON.parse(result.choices[0].message.content)

      return {
        outputData: decisionData.outputData,
        confidenceScore: decisionData.confidenceScore,
        reasoning: decisionData.reasoning,
        riskAssessment: decisionData.riskAssessment,
        riskScore: decisionData.riskScore
      }
    } catch (error) {
      console.error('LLM decision generation failed:', error)
      // Fallback to basic decision
      return {
        outputData: { recommendation: 'escalate_to_human', priority: 'high' },
        confidenceScore: 0.5,
        reasoning: 'Automated fallback due to processing error',
        riskAssessment: { factors: ['processing_error'], mitigation: 'human_review' },
        riskScore: 0.8
      }
    }
  }

  private async updateModelUsage(modelId: string): Promise<void> {
    try {
      await prisma.aIModel.update({
        where: { id: modelId },
        data: {
          predictionCount: { increment: 1 },
          lastUsedAt: new Date()
        }
      })
    } catch (error) {
      console.error('Failed to update model usage:', error)
    }
  }

  // ===== CROSS-MODULE ORCHESTRATION =====

  async orchestrateModules(
    triggerModule: ModuleType,
    event: any,
    tenantId: string
  ): Promise<any> {
    try {
      // Find relevant orchestrators
      const orchestrators = await prisma.aIOrchestrator.findMany({
        where: {
          isActive: true,
          tenantId,
          enabledModules: { has: triggerModule }
        }
      })

      const results = []

      for (const orchestrator of orchestrators) {
        const result = await this.executeOrchestration(orchestrator, event, tenantId)
        results.push(result)
      }

      return {
        success: true,
        orchestrations: results.length,
        results
      }
    } catch (error) {
      console.error('Module orchestration failed:', error)
      return { success: false, error: (error as Error).message }
    }
  }

  private async executeOrchestration(orchestrator: any, event: any, tenantId: string): Promise<any> {
    try {
      const executionId = this.generateExecutionId()
      
      // Create execution record
      const execution = await prisma.aIOrchestrationExecution.create({
        data: {
          orchestratorId: orchestrator.id,
          executionId,
          triggerEvent: event,
          inputContext: { timestamp: new Date(), tenantId },
          status: 'RUNNING',
          tenantId
        }
      })

      // Execute orchestration logic using LLM
      const orchestrationResult = await this.processOrchestrationWithLLM(orchestrator, event)

      // Update execution with results
      await prisma.aIOrchestrationExecution.update({
        where: { id: execution.id },
        data: {
          status: 'COMPLETED',
          outputResults: orchestrationResult,
          completedAt: new Date(),
          executionTime: Date.now() - execution.startedAt.getTime()
        }
      })

      return {
        executionId,
        orchestratorName: orchestrator.name,
        success: true,
        result: orchestrationResult
      }
    } catch (error) {
      console.error('Orchestration execution failed:', error)
      return {
        orchestratorName: orchestrator.name,
        success: false,
        error: (error as Error).message
      }
    }
  }

  private async processOrchestrationWithLLM(orchestrator: any, event: any): Promise<any> {
    try {
      const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages: [{
            role: 'user',
            content: `As an AI orchestrator "${orchestrator.name}", process the following event:

Event: ${JSON.stringify(event)}
Orchestration Rules: ${JSON.stringify(orchestrator.orchestrationRules)}
Enabled Modules: ${JSON.stringify(orchestrator.enabledModules)}
Workflow Definition: ${JSON.stringify(orchestrator.workflowDefinition)}

Determine:
1. Which modules should be notified
2. What actions should be triggered
3. Data transformations needed
4. Priority and timing

Respond with JSON:
{
  "targetModules": ["MODULE1", "MODULE2"],
  "actions": [
    {
      "module": "MODULE1",
      "action": "UPDATE_STATUS",
      "data": {...},
      "priority": "high"
    }
  ],
  "dataTransformations": {...},
  "recommendations": ["rec1", "rec2"]
}

Respond with raw JSON only.`
          }],
          response_format: { type: "json_object" },
          max_tokens: 1500
        })
      })

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.statusText}`)
      }

      const result = await response.json()
      return JSON.parse(result.choices[0].message.content)
    } catch (error) {
      console.error('LLM orchestration processing failed:', error)
      return {
        targetModules: [],
        actions: [],
        error: 'Processing failed, manual review required'
      }
    }
  }

  // ===== PREDICTIVE ANALYTICS =====

  async generatePredictions(
    tenantId: string,
    timeframe: '24h' | '48h' | '7d' | '30d' = '48h'
  ): Promise<any> {
    try {
      const models = Array.from(this.models.values()).filter(m => 
        m.modelType === 'PERFORMANCE_FORECASTING' || 
        m.modelType === 'DEMAND_FORECASTING' ||
        m.modelType === 'CUSTOMER_BEHAVIOR_PREDICTION'
      )

      const predictions = []

      for (const model of models) {
        const prediction = await this.generateModelPrediction(model, tenantId, timeframe)
        predictions.push(prediction)
      }

      return {
        success: true,
        timeframe,
        predictions,
        generatedAt: new Date()
      }
    } catch (error) {
      console.error('Prediction generation failed:', error)
      return { success: false, error: (error as Error).message }
    }
  }

  private async generateModelPrediction(model: AIModel, tenantId: string, timeframe: string): Promise<any> {
    try {
      // Get historical data context
      const contextData = await this.getHistoricalContext(tenantId, model.modelType)

      const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages: [{
            role: 'user',
            content: `As a ${model.modelType} AI model, generate predictions for the next ${timeframe}:

Historical Context: ${JSON.stringify(contextData)}
Model Type: ${model.modelType}
Accuracy: ${model.accuracy || 'Unknown'}

Generate predictions with:
{
  "modelType": "${model.modelType}",
  "predictions": [
    {
      "metric": "metric_name",
      "currentValue": 100,
      "predictedValue": 120,
      "confidence": 0.85,
      "trend": "increasing|decreasing|stable",
      "factors": ["factor1", "factor2"]
    }
  ],
  "insights": [
    {
      "type": "opportunity|risk|trend",
      "description": "insight description",
      "impact": "high|medium|low",
      "actionItems": ["action1", "action2"]
    }
  ],
  "confidence": 0.85
}

Respond with raw JSON only.`
          }],
          response_format: { type: "json_object" },
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.statusText}`)
      }

      const result = await response.json()
      const predictionData = JSON.parse(result.choices[0].message.content)

      return {
        modelId: model.id,
        modelName: model.name,
        ...predictionData
      }
    } catch (error) {
      console.error(`Prediction failed for model ${model.id}:`, error)
      return {
        modelId: model.id,
        modelName: model.name,
        error: 'Prediction generation failed',
        confidence: 0.0
      }
    }
  }

  private async getHistoricalContext(tenantId: string, modelType: AIModelType): Promise<any> {
    try {
      // Get relevant historical data based on model type
      switch (modelType) {
        case 'CUSTOMER_BEHAVIOR_PREDICTION':
          const customers = await prisma.customer?.findMany({
            where: { tenantId },
            take: 100,
            orderBy: { createdAt: 'desc' }
          })
          return { customers: customers?.length || 0, recentActivity: 'active' }

        case 'PERFORMANCE_FORECASTING':
          const systemMetrics = await prisma.systemMetric.findMany({
            where: { tenantId },
            take: 50,
            orderBy: { timestamp: 'desc' }
          })
          return { metrics: systemMetrics.length, avgValue: 0.8 }

        case 'DEMAND_FORECASTING':
          const invoices = await prisma.invoice.findMany({
            where: { tenantId },
            take: 100,
            orderBy: { createdAt: 'desc' }
          })
          return { transactions: invoices.length, volume: 'moderate' }

        default:
          return { general: 'limited_context', timestamp: new Date() }
      }
    } catch (error) {
      console.error('Failed to get historical context:', error)
      return { error: 'context_unavailable' }
    }
  }

  // ===== UTILITY METHODS =====

  private generateExecutionId(): string {
    return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  async getModelPerformance(modelId: string): Promise<any> {
    try {
      const model = await prisma.aIModel.findUnique({
        where: { id: modelId },
        include: { 
          decisions: { take: 100, orderBy: { createdAt: 'desc' } },
          metrics: { take: 50, orderBy: { createdAt: 'desc' } }
        }
      })

      if (!model) return null

      const successfulDecisions = model.decisions.filter(d => d.status === 'EXECUTED').length
      const totalDecisions = model.decisions.length
      const successRate = totalDecisions > 0 ? successfulDecisions / totalDecisions : 0

      return {
        modelId: model.id,
        modelName: model.name,
        accuracy: model.accuracy,
        successRate,
        totalDecisions,
        avgResponseTime: model.averageResponseTime,
        lastUsed: model.lastUsedAt,
        status: model.status,
        recentMetrics: model.metrics.slice(0, 10)
      }
    } catch (error) {
      console.error('Failed to get model performance:', error)
      return null
    }
  }

  async getSystemHealth(): Promise<any> {
    try {
      const activeModels = Array.from(this.models.values()).filter(m => m.status === 'DEPLOYED').length
      const totalModels = this.models.size
      
      const recentDecisions = await prisma.aIDecision.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      })

      const successfulDecisions = recentDecisions.filter(d => d.status === 'EXECUTED').length
      const totalDecisions = recentDecisions.length
      const systemReliability = totalDecisions > 0 ? successfulDecisions / totalDecisions : 0

      return {
        status: 'healthy',
        activeModels,
        totalModels,
        systemReliability,
        decisionsLast24h: totalDecisions,
        avgConfidence: recentDecisions.reduce((sum, d) => sum + d.confidenceScore, 0) / totalDecisions || 0,
        timestamp: new Date()
      }
    } catch (error) {
      console.error('Failed to get system health:', error)
      return {
        status: 'error',
        error: (error as Error).message,
        timestamp: new Date()
      }
    }
  }
}

// Export singleton instance
export const aiEngine = AIEngine.getInstance()
