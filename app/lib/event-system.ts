
// WeGroup Platform - Sprint 4: Event-Driven Architecture
// Real-time Event Processing & Module Communication

import { PrismaClient } from '@prisma/client'
import { WebhookEvent } from './types'

const prisma = new PrismaClient()

export interface SystemEvent {
  id: string
  type: WebhookEvent
  source: string
  tenantId: string
  payload: any
  timestamp: Date
  priority: 'low' | 'medium' | 'high' | 'critical'
  retryCount?: number
}

export class EventSystem {
  private static instance: EventSystem
  private eventListeners: Map<WebhookEvent, ((event: SystemEvent) => Promise<void>)[]> = new Map()
  private eventQueue: SystemEvent[] = []
  private processing = false

  private constructor() {
    this.startEventProcessor()
  }

  public static getInstance(): EventSystem {
    if (!EventSystem.instance) {
      EventSystem.instance = new EventSystem()
    }
    return EventSystem.instance
  }

  // ===== EVENT PUBLISHING =====

  async publishEvent(
    type: WebhookEvent,
    source: string,
    tenantId: string,
    payload: any,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<string> {
    const event: SystemEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      source,
      tenantId,
      payload,
      timestamp: new Date(),
      priority,
      retryCount: 0
    }

    // Add to processing queue
    this.eventQueue.push(event)
    
    // Sort by priority (critical first)
    this.eventQueue.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })

    console.log(`Event published: ${type} from ${source} (priority: ${priority})`)
    return event.id
  }

  // ===== EVENT SUBSCRIPTION =====

  subscribe(eventType: WebhookEvent, handler: (event: SystemEvent) => Promise<void>): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, [])
    }
    this.eventListeners.get(eventType)!.push(handler)
    console.log(`New listener registered for event type: ${eventType}`)
  }

  // ===== EVENT PROCESSING =====

  private async startEventProcessor(): Promise<void> {
    setInterval(async () => {
      if (!this.processing && this.eventQueue.length > 0) {
        this.processing = true
        await this.processEvents()
        this.processing = false
      }
    }, 100) // Process every 100ms for real-time performance
  }

  private async processEvents(): Promise<void> {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()!
      await this.processEvent(event)
    }
  }

  private async processEvent(event: SystemEvent): Promise<void> {
    try {
      const listeners = this.eventListeners.get(event.type) || []
      
      if (listeners.length === 0) {
        console.log(`No listeners for event type: ${event.type}`)
        return
      }

      // Process event with all registered listeners
      const processingPromises = listeners.map(async (listener) => {
        try {
          await listener(event)
        } catch (error) {
          console.error(`Event listener failed for ${event.type}:`, error)
          await this.handleEventError(event, error as Error)
        }
      })

      await Promise.allSettled(processingPromises)

      // Send webhooks
      await this.sendWebhooks(event)

      console.log(`Event processed successfully: ${event.type} (${event.id})`)
    } catch (error) {
      console.error(`Event processing failed for ${event.id}:`, error)
      await this.retryEvent(event)
    }
  }

  private async handleEventError(event: SystemEvent, error: Error): Promise<void> {
    try {
      // Log the error
      console.error(`Event processing error: ${event.type} - ${(error as Error).message}`)
      
      // Could implement error tracking here
      // await this.logEventError(event, error)
    } catch (logError) {
      console.error('Failed to log event error:', logError)
    }
  }

  private async retryEvent(event: SystemEvent): Promise<void> {
    event.retryCount = (event.retryCount || 0) + 1
    
    if (event.retryCount <= 3) {
      // Add back to queue with delay
      setTimeout(() => {
        this.eventQueue.push(event)
      }, Math.pow(2, event.retryCount) * 1000) // Exponential backoff
      
      console.log(`Event ${event.id} scheduled for retry ${event.retryCount}/3`)
    } else {
      console.error(`Event ${event.id} failed after 3 retries, discarding`)
    }
  }

  // ===== WEBHOOK DELIVERY =====

  private async sendWebhooks(event: SystemEvent): Promise<void> {
    try {
      const webhooks = await prisma.webhookEndpoint.findMany({
        where: {
          tenantId: event.tenantId,
          isActive: true,
          events: { has: event.type }
        }
      })

      for (const webhook of webhooks) {
        await this.deliverWebhook(webhook, event)
      }
    } catch (error) {
      console.error('Failed to send webhooks:', error)
    }
  }

  private async deliverWebhook(webhook: any, event: SystemEvent): Promise<void> {
    try {
      const deliveryId = `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Create delivery record
      const delivery = await prisma.webhookDelivery.create({
        data: {
          webhookEndpointId: webhook.id,
          eventType: event.type,
          payload: event.payload,
          headers: {
            'Content-Type': 'application/json',
            'X-WeGroup-Event': event.type,
            'X-WeGroup-Delivery': deliveryId,
            'X-WeGroup-Timestamp': event.timestamp.toISOString()
          },
          tenantId: event.tenantId
        }
      })

      const startTime = Date.now()

      // Send webhook
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WeGroup-Event': event.type,
          'X-WeGroup-Delivery': deliveryId,
          'X-WeGroup-Timestamp': event.timestamp.toISOString(),
          ...(webhook.secret && {
            'X-WeGroup-Signature': await this.generateSignature(event.payload, webhook.secret)
          })
        },
        body: JSON.stringify({
          event: event.type,
          data: event.payload,
          timestamp: event.timestamp,
          delivery_id: deliveryId
        }),
        signal: AbortSignal.timeout(webhook.timeoutMs || 30000)
      })

      const responseTime = Date.now() - startTime

      // Update delivery record
      await prisma.webhookDelivery.update({
        where: { id: delivery.id },
        data: {
          status: response.ok ? 'DELIVERED' : 'FAILED',
          responseCode: response.status,
          responseBody: await response.text().catch(() => 'Unable to read response'),
          responseTime,
          deliveredAt: response.ok ? new Date() : undefined
        }
      })

      // Update webhook statistics
      await prisma.webhookEndpoint.update({
        where: { id: webhook.id },
        data: {
          deliveryCount: response.ok ? { increment: 1 } : undefined,
          failureCount: response.ok ? undefined : { increment: 1 },
          lastDeliveryAt: response.ok ? new Date() : undefined,
          lastFailureAt: response.ok ? undefined : new Date(),
          averageResponseTime: responseTime // Simplified average
        }
      })

      console.log(`Webhook delivered: ${webhook.url} (${response.status}) in ${responseTime}ms`)
    } catch (error) {
      console.error(`Webhook delivery failed: ${webhook.url}`, error)
      
      // Mark as failed
      try {
        await prisma.webhookDelivery.updateMany({
          where: {
            webhookEndpointId: webhook.id,
            status: 'PENDING'
          },
          data: {
            status: 'FAILED',
            responseBody: (error as Error).message
          }
        })
      } catch (updateError) {
        console.error('Failed to update delivery status:', updateError)
      }
    }
  }

  private async generateSignature(payload: any, secret: string): Promise<string> {
    const crypto = require('crypto')
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(JSON.stringify(payload))
    return `sha256=${hmac.digest('hex')}`
  }

  // ===== MODULE INTEGRATION EVENTS =====

  async publishModuleEvent(
    sourceModule: string,
    targetModule: string,
    eventType: string,
    data: any,
    tenantId: string
  ): Promise<void> {
    await this.publishEvent(
      'SYSTEM_ERROR' as WebhookEvent, // Using generic event type for module communication
      sourceModule,
      tenantId,
      {
        targetModule,
        eventType,
        data,
        crossModule: true
      },
      'medium'
    )
  }

  // ===== AI INTEGRATION =====

  async publishAIDecision(
    decisionId: string,
    decisionType: string,
    result: any,
    tenantId: string
  ): Promise<void> {
    await this.publishEvent(
      WebhookEvent.AI_DECISION_MADE,
      'ai-engine',
      tenantId,
      {
        decisionId,
        decisionType,
        result,
        timestamp: new Date()
      },
      'high'
    )
  }

  async publishPerformanceAlert(
    alertType: string,
    severity: string,
    data: any,
    tenantId: string
  ): Promise<void> {
    await this.publishEvent(
      WebhookEvent.PERFORMANCE_ALERT,
      'monitoring-system',
      tenantId,
      {
        alertType,
        severity,
        data,
        timestamp: new Date()
      },
      severity === 'critical' ? 'critical' : 'high'
    )
  }

  // ===== EVENT ANALYTICS =====

  async getEventStatistics(tenantId: string, timeframe: '1h' | '24h' | '7d' = '24h'): Promise<any> {
    try {
      const timeframeMs = {
        '1h': 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000
      }

      const since = new Date(Date.now() - timeframeMs[timeframe])

      const deliveries = await prisma.webhookDelivery.findMany({
        where: {
          tenantId,
          scheduledAt: { gte: since }
        }
      })

      const successful = deliveries.filter(d => d.status === 'DELIVERED').length
      const failed = deliveries.filter(d => d.status === 'FAILED').length
      const total = deliveries.length

      const avgResponseTime = deliveries
        .filter(d => d.responseTime)
        .reduce((sum, d) => sum + (d.responseTime || 0), 0) / deliveries.length || 0

      return {
        timeframe,
        totalEvents: total,
        successfulDeliveries: successful,
        failedDeliveries: failed,
        successRate: total > 0 ? successful / total : 0,
        averageResponseTime: avgResponseTime,
        queueLength: this.eventQueue.length,
        activeListeners: Array.from(this.eventListeners.entries()).map(([type, listeners]) => ({
          eventType: type,
          listenerCount: listeners.length
        }))
      }
    } catch (error) {
      console.error('Failed to get event statistics:', error)
      return {
        error: (error as Error).message,
        timeframe,
        timestamp: new Date()
      }
    }
  }
}

// Export singleton instance
export const eventSystem = EventSystem.getInstance()

// Initialize default event handlers
eventSystem.subscribe(WebhookEvent.USER_CREATED, async (event) => {
  console.log(`User created: ${event.payload.email} in tenant ${event.tenantId}`)
  // Could trigger welcome email, setup default preferences, etc.
})

eventSystem.subscribe(WebhookEvent.AI_DECISION_MADE, async (event) => {
  console.log(`AI Decision made: ${event.payload.decisionType} with confidence ${event.payload.result.confidence}`)
  // Could trigger notifications, logging, analytics updates, etc.
})

eventSystem.subscribe(WebhookEvent.PERFORMANCE_ALERT, async (event) => {
  console.log(`Performance alert: ${event.payload.alertType} (${event.payload.severity})`)
  // Could trigger automated scaling, notifications, incident creation, etc.
})
