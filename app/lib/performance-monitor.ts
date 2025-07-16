
// WeGroup Platform - Sprint 4: Performance Monitoring & System Health
// Real-time Metrics Collection & Alert Management

import { PrismaClient } from '@prisma/client'
import { MetricType, AlertSeverity, AlertOperator } from './types'
import { eventSystem } from './event-system'

const prisma = new PrismaClient()

export interface PerformanceMetric {
  name: string
  value: number
  type: MetricType
  unit?: string
  component?: string
  tags?: Record<string, any>
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metricsBuffer: PerformanceMetric[] = []
  private alertRules: Map<string, any> = new Map()
  private isCollecting = false

  private constructor() {
    this.startMetricsCollection()
    this.loadAlertRules()
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // ===== METRICS COLLECTION =====

  async recordMetric(
    tenantId: string | null,
    metric: PerformanceMetric
  ): Promise<void> {
    try {
      await prisma.systemMetric.create({
        data: {
          metricName: metric.name,
          metricType: metric.type,
          value: metric.value,
          unit: metric.unit,
          component: metric.component,
          tags: metric.tags || {},
          tenantId
        }
      })

      // Check for alert triggers
      await this.checkAlertRules(tenantId, metric)
    } catch (error) {
      console.error('Failed to record metric:', error)
    }
  }

  async recordApiMetrics(
    endpoint: string,
    method: string,
    responseTime: number,
    statusCode: number,
    tenantId?: string
  ): Promise<void> {
    const metrics: PerformanceMetric[] = [
      {
        name: 'api_response_time',
        value: responseTime,
        type: MetricType.TIMER,
        unit: 'ms',
        component: 'api',
        tags: { endpoint, method, statusCode: statusCode.toString() }
      },
      {
        name: 'api_request_count',
        value: 1,
        type: MetricType.COUNTER,
        component: 'api',
        tags: { endpoint, method, statusCode: statusCode.toString() }
      }
    ]

    if (statusCode >= 400) {
      metrics.push({
        name: 'api_error_count',
        value: 1,
        type: MetricType.COUNTER,
        component: 'api',
        tags: { endpoint, method, statusCode: statusCode.toString() }
      })
    }

    for (const metric of metrics) {
      await this.recordMetric(tenantId || null, metric)
    }
  }

  async recordSystemMetrics(): Promise<void> {
    try {
      const metrics: PerformanceMetric[] = [
        {
          name: 'system_cpu_usage',
          value: await this.getCpuUsage(),
          type: MetricType.GAUGE,
          unit: 'percent',
          component: 'system'
        },
        {
          name: 'system_memory_usage',
          value: await this.getMemoryUsage(),
          type: MetricType.GAUGE,
          unit: 'percent',
          component: 'system'
        },
        {
          name: 'system_uptime',
          value: process.uptime(),
          type: MetricType.GAUGE,
          unit: 'seconds',
          component: 'system'
        }
      ]

      for (const metric of metrics) {
        await this.recordMetric(null, metric)
      }
    } catch (error) {
      console.error('Failed to record system metrics:', error)
    }
  }

  // ===== SYSTEM METRICS HELPERS =====

  private async getCpuUsage(): Promise<number> {
    // Simplified CPU usage calculation
    const startUsage = process.cpuUsage()
    await new Promise(resolve => setTimeout(resolve, 100))
    const endUsage = process.cpuUsage(startUsage)
    
    const totalUsage = endUsage.user + endUsage.system
    return Math.min((totalUsage / 100000), 100) // Convert to percentage, cap at 100%
  }

  private async getMemoryUsage(): Promise<number> {
    const memUsage = process.memoryUsage()
    const totalMemory = memUsage.heapTotal + memUsage.external
    const usedMemory = memUsage.heapUsed
    return (usedMemory / totalMemory) * 100
  }

  // ===== ALERT MANAGEMENT =====

  private async loadAlertRules(): Promise<void> {
    try {
      const rules = await prisma.alertRule.findMany({
        where: { isActive: true }
      })

      for (const rule of rules) {
        this.alertRules.set(rule.id, rule)
      }

      console.log(`Loaded ${rules.length} alert rules`)
    } catch (error) {
      console.error('Failed to load alert rules:', error)
    }
  }

  private async checkAlertRules(tenantId: string | null, metric: PerformanceMetric): Promise<void> {
    for (const [ruleId, rule] of this.alertRules) {
      if (this.shouldEvaluateRule(rule, metric, tenantId)) {
        await this.evaluateAlertRule(rule, metric)
      }
    }
  }

  private shouldEvaluateRule(rule: any, metric: PerformanceMetric, tenantId: string | null): boolean {
    // Check if rule applies to this tenant
    if (rule.tenantId && rule.tenantId !== tenantId) {
      return false
    }

    // Check if rule applies to this metric
    const query = rule.metricQuery.toLowerCase()
    const metricName = metric.name.toLowerCase()
    
    return query.includes(metricName) || query.includes(metric.component || '')
  }

  private async evaluateAlertRule(rule: any, metric: PerformanceMetric): Promise<void> {
    try {
      const shouldTrigger = this.evaluateThreshold(metric.value, rule.threshold, rule.operator)

      if (shouldTrigger) {
        // Check cooldown period
        const lastTriggered = rule.lastTriggeredAt ? new Date(rule.lastTriggeredAt).getTime() : 0
        const cooldownExpired = Date.now() - lastTriggered > (rule.cooldownPeriod * 1000)

        if (cooldownExpired) {
          await this.triggerAlert(rule, metric)
        }
      }
    } catch (error) {
      console.error(`Failed to evaluate alert rule ${rule.id}:`, error)
    }
  }

  private evaluateThreshold(value: number, threshold: number, operator: AlertOperator): boolean {
    switch (operator) {
      case 'GREATER_THAN':
        return value > threshold
      case 'LESS_THAN':
        return value < threshold
      case 'EQUALS':
        return Math.abs(value - threshold) < 0.001
      case 'NOT_EQUALS':
        return Math.abs(value - threshold) >= 0.001
      case 'GREATER_THAN_OR_EQUAL':
        return value >= threshold
      case 'LESS_THAN_OR_EQUAL':
        return value <= threshold
      default:
        return false
    }
  }

  private async triggerAlert(rule: any, metric: PerformanceMetric): Promise<void> {
    try {
      // Create alert incident
      const incident = await prisma.alertIncident.create({
        data: {
          alertRuleId: rule.id,
          title: `${rule.name} Alert Triggered`,
          description: `Metric ${metric.name} value ${metric.value} ${rule.operator} threshold ${rule.threshold}`,
          severity: rule.severity,
          triggerValue: metric.value,
          thresholdValue: rule.threshold,
          metricContext: {
            metric: metric.name,
            component: metric.component,
            tags: metric.tags
          },
          tenantId: rule.tenantId
        }
      })

      // Update alert rule
      await prisma.alertRule.update({
        where: { id: rule.id },
        data: {
          lastTriggeredAt: new Date(),
          triggerCount: { increment: 1 }
        }
      })

      // Publish alert event
      await eventSystem.publishPerformanceAlert(
        rule.name,
        rule.severity,
        {
          incidentId: incident.id,
          metric: metric.name,
          value: metric.value,
          threshold: rule.threshold,
          component: metric.component
        },
        rule.tenantId || 'system'
      )

      console.log(`Alert triggered: ${rule.name} (${rule.severity})`)
    } catch (error) {
      console.error('Failed to trigger alert:', error)
    }
  }

  // ===== METRICS COLLECTION AUTOMATION =====

  private startMetricsCollection(): void {
    // Collect system metrics every 30 seconds
    setInterval(async () => {
      if (!this.isCollecting) {
        this.isCollecting = true
        await this.recordSystemMetrics()
        this.isCollecting = false
      }
    }, 30000)

    console.log('Performance monitoring started')
  }

  // ===== API ENDPOINTS SUPPORT =====

  async getMetrics(
    tenantId: string | null,
    metricName?: string,
    timeframe: '1h' | '24h' | '7d' = '24h',
    limit = 100
  ): Promise<any> {
    try {
      const timeframeMs = {
        '1h': 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000
      }

      const since = new Date(Date.now() - timeframeMs[timeframe])

      const where: any = {
        timestamp: { gte: since }
      }

      if (tenantId) {
        where.tenantId = tenantId
      }

      if (metricName) {
        where.metricName = metricName
      }

      const metrics = await prisma.systemMetric.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: limit
      })

      return {
        metrics,
        timeframe,
        total: metrics.length,
        generatedAt: new Date()
      }
    } catch (error) {
      console.error('Failed to get metrics:', error)
      return { error: (error as Error).message }
    }
  }

  async getAlerts(tenantId: string | null, status?: string): Promise<any> {
    try {
      const where: any = {}

      if (tenantId) {
        where.tenantId = tenantId
      }

      if (status) {
        where.status = status
      }

      const incidents = await prisma.alertIncident.findMany({
        where,
        include: {
          alertRule: {
            select: {
              name: true,
              description: true,
              severity: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      })

      return {
        incidents,
        total: incidents.length,
        generatedAt: new Date()
      }
    } catch (error) {
      console.error('Failed to get alerts:', error)
      return { error: (error as Error).message }
    }
  }

  async getDashboardMetrics(tenantId: string | null): Promise<any> {
    try {
      const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000)
      
      // Get recent metrics
      const recentMetrics = await prisma.systemMetric.findMany({
        where: {
          tenantId,
          timestamp: { gte: last24h }
        },
        orderBy: { timestamp: 'desc' },
        take: 100
      })

      // Get active alerts
      const activeAlerts = await prisma.alertIncident.findMany({
        where: {
          tenantId,
          status: { in: ['OPEN', 'ACKNOWLEDGED'] }
        }
      })

      // Calculate aggregated metrics
      const apiMetrics = recentMetrics.filter(m => m.component === 'api')
      const systemMetrics = recentMetrics.filter(m => m.component === 'system')

      const avgResponseTime = apiMetrics
        .filter(m => m.metricName === 'api_response_time')
        .reduce((sum, m) => sum + m.value, 0) / apiMetrics.length || 0

      const errorRate = this.calculateErrorRate(apiMetrics)
      const systemUptime = this.calculateUptime()

      return {
        responseTime: Math.round(avgResponseTime),
        errorRate: Math.round(errorRate * 100) / 100,
        uptime: Math.round(systemUptime * 100) / 100,
        activeAlerts: activeAlerts.length,
        criticalAlerts: activeAlerts.filter(a => a.severity === 'CRITICAL').length,
        totalMetrics: recentMetrics.length,
        lastUpdated: new Date()
      }
    } catch (error) {
      console.error('Failed to get dashboard metrics:', error)
      return {
        responseTime: 0,
        errorRate: 0,
        uptime: 0,
        activeAlerts: 0,
        criticalAlerts: 0,
        error: (error as Error).message
      }
    }
  }

  private calculateErrorRate(apiMetrics: any[]): number {
    const totalRequests = apiMetrics.filter(m => m.metricName === 'api_request_count').length
    const errorRequests = apiMetrics.filter(m => m.metricName === 'api_error_count').length
    return totalRequests > 0 ? errorRequests / totalRequests : 0
  }

  private calculateUptime(): number {
    const uptimeSeconds = process.uptime()
    const uptimeHours = uptimeSeconds / 3600
    return Math.min(uptimeHours / 24 * 100, 100) // Convert to percentage, max 100%
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance()
