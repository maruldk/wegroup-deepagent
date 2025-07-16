
// WeGroup Platform - Sprint 4: AI Engine Dashboard Component
// Real-time AI Performance and System Overview

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Cpu, 
  GitBranch, 
  Network, 
  TrendingUp, 
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface AIEngineStats {
  activeModels: number
  totalModels: number
  decisionsToday: number
  successRate: number
  avgConfidence: number
  systemHealth: string
  autonomyLevel: number
}

interface AIModel {
  id: string
  name: string
  type: string
  status: string
  accuracy: number
  predictions: number
}

interface RecentDecision {
  id: string
  type: string
  confidence: number
  status: string
  module: string
  timestamp: Date
}

export default function AIEngineDashboard() {
  const [stats, setStats] = useState<AIEngineStats>({
    activeModels: 0,
    totalModels: 0,
    decisionsToday: 0,
    successRate: 0,
    avgConfidence: 0,
    systemHealth: 'loading',
    autonomyLevel: 0
  })
  const [models, setModels] = useState<AIModel[]>([])
  const [recentDecisions, setRecentDecisions] = useState<RecentDecision[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch AI Engine health
      const healthResponse = await fetch('/api/ai-engine/health')
      const healthData = await healthResponse.json()

      // Fetch models
      const modelsResponse = await fetch('/api/ai-engine/models')
      const modelsData = await modelsResponse.json()

      // Fetch recent decisions
      const decisionsResponse = await fetch('/api/ai-engine/decisions?limit=10')
      const decisionsData = await decisionsResponse.json()

      if (healthData.success) {
        setStats({
          activeModels: healthData.health.activeModels || 0,
          totalModels: healthData.health.totalModels || 0,
          decisionsToday: healthData.health.decisionsLast24h || 0,
          successRate: Math.round((healthData.health.systemReliability || 0) * 100),
          avgConfidence: Math.round((healthData.health.avgConfidence || 0) * 100),
          systemHealth: healthData.health.status || 'unknown',
          autonomyLevel: 75 // Sprint 4 target autonomy
        })
      }

      if (modelsData.success) {
        setModels(modelsData.models?.slice(0, 6) || [])
      }

      if (decisionsData.success) {
        setRecentDecisions(decisionsData.decisions?.slice(0, 8) || [])
      }

      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setLoading(false)
    }
  }

  const performanceData = [
    { time: '00:00', decisions: 12, accuracy: 85 },
    { time: '04:00', decisions: 8, accuracy: 88 },
    { time: '08:00', decisions: 25, accuracy: 92 },
    { time: '12:00', decisions: 35, accuracy: 89 },
    { time: '16:00', decisions: 42, accuracy: 94 },
    { time: '20:00', decisions: 28, accuracy: 91 }
  ]

  const modelTypeData = [
    { name: 'Customer Behavior', value: 30, color: '#60B5FF' },
    { name: 'Resource Optimization', value: 25, color: '#FF9149' },
    { name: 'Anomaly Detection', value: 20, color: '#FF9898' },
    { name: 'Process Automation', value: 15, color: '#80D8C3' },
    { name: 'Quality Assurance', value: 10, color: '#A19AD3' }
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'deployed':
      case 'executed':
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'training':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
      case 'failed':
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getHealthStatus = (health: string) => {
    switch (health) {
      case 'healthy':
        return { icon: CheckCircle, color: 'text-green-500', label: 'Healthy' }
      case 'warning':
        return { icon: AlertTriangle, color: 'text-yellow-500', label: 'Warning' }
      case 'error':
        return { icon: AlertTriangle, color: 'text-red-500', label: 'Critical' }
      default:
        return { icon: Clock, color: 'text-gray-500', label: 'Loading' }
    }
  }

  const healthStatus = getHealthStatus(stats.systemHealth)

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Autonomy Level</CardTitle>
            <Brain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.autonomyLevel}%</div>
            <Progress value={stats.autonomyLevel} className="mt-2" />
            <p className="text-xs text-gray-600 mt-2">Sprint 4 Target: 75%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
            <Cpu className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeModels}</div>
            <p className="text-xs text-gray-600">of {stats.totalModels} total models</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Decisions Today</CardTitle>
            <GitBranch className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.decisionsToday}</div>
            <p className="text-xs text-gray-600">{stats.successRate}% success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <healthStatus.icon className={`h-4 w-4 ${healthStatus.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthStatus.label}</div>
            <p className="text-xs text-gray-600">{stats.avgConfidence}% avg confidence</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="decisions">Decisions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  AI Decision Performance
                </CardTitle>
                <CardDescription>24-hour decision volume and accuracy</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="decisions" stroke="#60B5FF" strokeWidth={2} />
                    <Line type="monotone" dataKey="accuracy" stroke="#FF9149" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Model Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Model Type Distribution
                </CardTitle>
                <CardDescription>Active AI models by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={modelTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {modelTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model) => (
              <Card key={model.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                  <CardDescription>{model.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status</span>
                      <Badge className={getStatusColor(model.status)}>
                        {model.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Accuracy</span>
                      <span className="font-medium">{(model.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Predictions</span>
                      <span className="font-medium">{model.predictions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Recent AI Decisions
              </CardTitle>
              <CardDescription>Latest automated decisions and their outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDecisions.map((decision) => (
                  <div key={decision.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{decision.type.replace(/_/g, ' ')}</div>
                      <div className="text-sm text-gray-600">
                        {decision.module} • {decision.timestamp.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium">{(decision.confidence * 100).toFixed(0)}%</div>
                        <div className="text-xs text-gray-500">confidence</div>
                      </div>
                      <Badge className={getStatusColor(decision.status)}>
                        {decision.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Autonomy Trends
                </CardTitle>
                <CardDescription>AI autonomy progression over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Sprint 1 - Foundation</span>
                    <div className="flex items-center gap-2">
                      <Progress value={25} className="w-20" />
                      <span className="text-sm">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sprint 2 - Core Business</span>
                    <div className="flex items-center gap-2">
                      <Progress value={45} className="w-20" />
                      <span className="text-sm">45%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sprint 3 - Creative & Sales</span>
                    <div className="flex items-center gap-2">
                      <Progress value={60} className="w-20" />
                      <span className="text-sm">60%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sprint 4 - Advanced AI</span>
                    <div className="flex items-center gap-2">
                      <Progress value={75} className="w-20" />
                      <span className="text-sm font-bold text-blue-600">75%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Manage AI Engine operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Cpu className="h-4 w-4 mr-2" />
                  Deploy New Model
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Network className="h-4 w-4 mr-2" />
                  Create Orchestration
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Generate Predictions
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  View System Health
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
