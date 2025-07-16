
// WeGroup Platform - Sprint 4: API Management Dashboard Component
// RESTful API Management and Integration Analytics

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Globe, 
  Link, 
  Webhook, 
  PieChart,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  Code,
  Settings
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts'

interface APIStats {
  totalEndpoints: number
  activeEndpoints: number
  totalRequests: number
  avgResponseTime: number
  successRate: number
  errorRate: number
  webhooks: number
  activeWebhooks: number
}

interface APIEndpoint {
  id: string
  name: string
  path: string
  method: string
  isPublic: boolean
  totalRequests: number
  avgResponseTime: number
  successRate: number
}

interface Webhook {
  id: string
  name: string
  url: string
  events: string[]
  deliveryCount: number
  failureCount: number
  isActive: boolean
}

export default function APIManagementDashboard() {
  const [stats, setStats] = useState<APIStats>({
    totalEndpoints: 0,
    activeEndpoints: 0,
    totalRequests: 0,
    avgResponseTime: 0,
    successRate: 0,
    errorRate: 0,
    webhooks: 0,
    activeWebhooks: 0
  })
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([])
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAPIManagementData()
  }, [])

  const fetchAPIManagementData = async () => {
    try {
      // Fetch API endpoints
      const endpointsResponse = await fetch('/api/api-management/endpoints')
      const endpointsData = await endpointsResponse.json()

      // Fetch webhooks
      const webhooksResponse = await fetch('/api/api-management/webhooks')
      const webhooksData = await webhooksResponse.json()

      if (endpointsData.success) {
        const endpointsList = endpointsData.endpoints || []
        setEndpoints(endpointsList.slice(0, 10))
        
        const totalRequests = endpointsList.reduce((sum: number, ep: any) => sum + (ep.totalRequests || 0), 0)
        const avgResponseTime = endpointsList.reduce((sum: number, ep: any) => sum + (ep.averageResponseTime || 0), 0) / endpointsList.length || 0
        const avgSuccessRate = endpointsList.reduce((sum: number, ep: any) => sum + (ep.successRate || 0), 0) / endpointsList.length || 0

        setStats(prev => ({
          ...prev,
          totalEndpoints: endpointsList.length,
          activeEndpoints: endpointsList.filter((ep: any) => ep.isActive).length,
          totalRequests,
          avgResponseTime: Math.round(avgResponseTime),
          successRate: Math.round(avgSuccessRate * 100),
          errorRate: Math.round((1 - avgSuccessRate) * 100)
        }))
      }

      if (webhooksData.success) {
        const webhooksList = webhooksData.webhooks || []
        setWebhooks(webhooksList.slice(0, 8))
        
        setStats(prev => ({
          ...prev,
          webhooks: webhooksList.length,
          activeWebhooks: webhooksList.filter((wh: any) => wh.isActive).length
        }))
      }

      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch API management data:', error)
      setLoading(false)
    }
  }

  // Sample data for charts
  const apiUsageData = [
    { time: '00:00', requests: 145, responseTime: 120 },
    { time: '04:00', requests: 89, responseTime: 98 },
    { time: '08:00', requests: 234, responseTime: 145 },
    { time: '12:00', requests: 456, responseTime: 167 },
    { time: '16:00', requests: 378, responseTime: 134 },
    { time: '20:00', requests: 267, responseTime: 112 }
  ]

  const methodDistribution = [
    { name: 'GET', value: 45, color: '#60B5FF' },
    { name: 'POST', value: 30, color: '#FF9149' },
    { name: 'PUT', value: 15, color: '#80D8C3' },
    { name: 'DELETE', value: 10, color: '#FF9898' }
  ]

  const statusCodeData = [
    { code: '200', count: 1245, color: '#80D8C3' },
    { code: '201', count: 456, color: '#60B5FF' },
    { code: '400', count: 78, color: '#FF9149' },
    { code: '401', count: 23, color: '#FF9898' },
    { code: '404', count: 45, color: '#A19AD3' },
    { code: '500', count: 12, color: '#FF6363' }
  ]

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-blue-100 text-blue-800'
      case 'POST': return 'bg-green-100 text-green-800'
      case 'PUT': return 'bg-yellow-100 text-yellow-800'
      case 'PATCH': return 'bg-orange-100 text-orange-800'
      case 'DELETE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEndpointStatus = (successRate: number) => {
    if (successRate >= 0.99) return { icon: CheckCircle, color: 'text-green-500', label: 'Excellent' }
    if (successRate >= 0.95) return { icon: CheckCircle, color: 'text-blue-500', label: 'Good' }
    if (successRate >= 0.90) return { icon: AlertTriangle, color: 'text-yellow-500', label: 'Warning' }
    return { icon: AlertTriangle, color: 'text-red-500', label: 'Critical' }
  }

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
      {/* API Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Endpoints</CardTitle>
            <Link className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEndpoints}</div>
            <p className="text-xs text-gray-600">{stats.activeEndpoints} active</p>
            <Progress value={(stats.activeEndpoints / stats.totalEndpoints) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-gray-600">{stats.avgResponseTime}ms avg response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.successRate}%</div>
            <p className="text-xs text-gray-600">{stats.errorRate}% error rate</p>
            <Progress value={stats.successRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Webhooks</CardTitle>
            <Webhook className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.webhooks}</div>
            <p className="text-xs text-gray-600">{stats.activeWebhooks} active</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Usage Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  API Usage Trends
                </CardTitle>
                <CardDescription>Request volume and response times over 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={apiUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="requests" stroke="#60B5FF" strokeWidth={2} name="Requests" />
                    <Line type="monotone" dataKey="responseTime" stroke="#FF9149" strokeWidth={2} name="Response Time (ms)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* HTTP Methods Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  HTTP Methods Distribution
                </CardTitle>
                <CardDescription>API usage by HTTP method</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={methodDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {methodDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                API Endpoints
              </CardTitle>
              <CardDescription>Manage and monitor your API endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {endpoints.map((endpoint) => {
                  const status = getEndpointStatus(endpoint.successRate || 0)
                  return (
                    <div key={endpoint.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getMethodColor(endpoint.method)}>
                            {endpoint.method}
                          </Badge>
                          <span className="font-medium">{endpoint.path}</span>
                          {endpoint.isPublic && (
                            <Badge variant="outline">Public</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{endpoint.name}</div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <div className="text-sm font-medium">{endpoint.totalRequests}</div>
                          <div className="text-xs text-gray-500">requests</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{endpoint.avgResponseTime}ms</div>
                          <div className="text-xs text-gray-500">avg time</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <status.icon className={`h-4 w-4 ${status.color}`} />
                          <span className="text-xs">{status.label}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhook Endpoints
              </CardTitle>
              <CardDescription>Manage webhook deliveries and configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{webhook.name}</span>
                        <Badge variant={webhook.isActive ? "default" : "secondary"}>
                          {webhook.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">{webhook.url}</div>
                      <div className="text-xs text-gray-500">
                        Events: {webhook.events.join(', ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="text-sm font-medium">{webhook.deliveryCount}</div>
                        <div className="text-xs text-gray-500">delivered</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-red-600">{webhook.failureCount}</div>
                        <div className="text-xs text-gray-500">failed</div>
                      </div>
                      <div className="text-sm">
                        {webhook.deliveryCount > 0 ? 
                          Math.round((webhook.deliveryCount / (webhook.deliveryCount + webhook.failureCount)) * 100) : 0
                        }% success
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Codes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Response Status Codes
                </CardTitle>
                <CardDescription>Distribution of HTTP status codes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusCodeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="code" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#60B5FF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>API management operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Link className="h-4 w-4 mr-2" />
                  Create New Endpoint
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Webhook className="h-4 w-4 mr-2" />
                  Add Webhook
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Code className="h-4 w-4 mr-2" />
                  Generate API Documentation
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Rate Limiting
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  View API Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
