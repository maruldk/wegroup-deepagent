
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Activity, 
  Brain, 
  AlertTriangle,
  Target,
  Zap,
  Eye,
  RefreshCw,
  Plus,
  Settings,
  Download,
  Filter
} from 'lucide-react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

// Import recharts directly since we're using 'use client'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface KPIData {
  id: string
  name: string
  currentValue: number
  targetValue: number
  unit: string
  trend: number
  trendPercentage: number
  category: string
  aiInsights: string[]
}

interface DashboardData {
  kpis: KPIData[]
  crossModuleMetrics: any[]
  aiInsights: any[]
  realtimeMetrics: any[]
}

export default function AdvancedAnalyticsDashboard() {
  const [data, setData] = useState<DashboardData>({
    kpis: [],
    crossModuleMetrics: [],
    aiInsights: [],
    realtimeMetrics: []
  })
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')
  const [selectedModule, setSelectedModule] = useState('all')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [selectedTimeframe, selectedModule])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch KPIs
      const kpiResponse = await fetch(`/api/analytics/kpis?category=${selectedModule}&timeframe=${selectedTimeframe}`)
      const kpiData = await kpiResponse.json()

      // Generate AI insights
      const insightsResponse = await fetch('/api/analytics/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataType: 'dashboard',
          timeframe: selectedTimeframe,
          modules: selectedModule === 'all' ? ['WECREATE', 'WESELL', 'HR', 'FINANCE', 'LOGISTICS'] : [selectedModule.toUpperCase()]
        })
      })
      const insightsData = await insightsResponse.json()

      setData({
        kpis: kpiData.data || [],
        crossModuleMetrics: generateMockCrossModuleData(),
        aiInsights: insightsData.data?.insights || [],
        realtimeMetrics: generateMockRealtimeData()
      })
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set fallback data
      setData({
        kpis: generateMockKPIs(),
        crossModuleMetrics: generateMockCrossModuleData(),
        aiInsights: generateMockInsights(),
        realtimeMetrics: generateMockRealtimeData()
      })
      setLoading(false)
    }
  }

  const generateMockKPIs = (): KPIData[] => [
    {
      id: '1',
      name: 'Revenue Growth',
      currentValue: 23.5,
      targetValue: 25,
      unit: '%',
      trend: 2.3,
      trendPercentage: 10.8,
      category: 'FINANCIAL',
      aiInsights: ['Strong Q4 performance', 'Enterprise segment driving growth']
    },
    {
      id: '2',
      name: 'Customer Satisfaction',
      currentValue: 4.8,
      targetValue: 4.5,
      unit: '/5',
      trend: 0.2,
      trendPercentage: 4.3,
      category: 'CUSTOMER',
      aiInsights: ['Improved support response times', 'Feature releases well received']
    },
    {
      id: '3',
      name: 'Lead Conversion Rate',
      currentValue: 24.5,
      targetValue: 20,
      unit: '%',
      trend: 3.2,
      trendPercentage: 15.0,
      category: 'SALES',
      aiInsights: ['AI lead scoring improving quality', 'Better qualification process']
    },
    {
      id: '4',
      name: 'Content Creation Efficiency',
      currentValue: 87,
      targetValue: 80,
      unit: '%',
      trend: 5,
      trendPercentage: 6.1,
      category: 'CREATIVE',
      aiInsights: ['AI tools reducing creation time', 'Template usage increasing']
    }
  ]

  const generateMockCrossModuleData = () => [
    { module: 'WeCreate', efficiency: 87, aiAutonomy: 80, userSatisfaction: 4.6 },
    { module: 'WeSell', efficiency: 92, aiAutonomy: 85, userSatisfaction: 4.8 },
    { module: 'HR', efficiency: 78, aiAutonomy: 75, userSatisfaction: 4.3 },
    { module: 'Finance', efficiency: 95, aiAutonomy: 88, userSatisfaction: 4.7 },
    { module: 'Logistics', efficiency: 89, aiAutonomy: 82, userSatisfaction: 4.5 }
  ]

  const generateMockInsights = () => [
    {
      category: 'performance',
      title: 'WeSell Module Exceeding Targets',
      description: 'Lead conversion rates have improved by 35% with AI-enhanced scoring',
      confidence: 0.94,
      impact: 'high',
      actionable: true,
      recommendedActions: ['Scale AI scoring to all leads', 'Expand to other regions']
    },
    {
      category: 'trend',
      title: 'WeCreate AI Usage Trending Up',
      description: 'Content generation with AI tools has increased 40% this month',
      confidence: 0.89,
      impact: 'medium',
      actionable: true,
      recommendedActions: ['Add more AI templates', 'Provide user training']
    }
  ]

  const generateMockRealtimeData = () => [
    { time: '09:00', activeUsers: 45, apiCalls: 230, systemLoad: 23 },
    { time: '10:00', activeUsers: 67, apiCalls: 340, systemLoad: 34 },
    { time: '11:00', activeUsers: 89, apiCalls: 450, systemLoad: 45 },
    { time: '12:00', activeUsers: 93, apiCalls: 520, systemLoad: 52 },
    { time: '13:00', activeUsers: 76, apiCalls: 380, systemLoad: 38 },
    { time: '14:00', activeUsers: 82, apiCalls: 410, systemLoad: 41 }
  ]

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
  }

  const getKPIStatusColor = (current: number, target: number) => {
    const percentage = (current / target) * 100
    if (percentage >= 100) return 'text-green-600'
    if (percentage >= 90) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'performance': return <Target className="w-4 h-4" />
      case 'trend': return <TrendingUp className="w-4 h-4" />
      case 'anomaly': return <AlertTriangle className="w-4 h-4" />
      case 'recommendation': return <Brain className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  if (loading) {
    return <AdvancedAnalyticsSkeleton />
  }

  const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3']

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600 mt-2">Cross-module business intelligence with AI insights</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedModule} onValueChange={setSelectedModule}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              <SelectItem value="wecreate">WeCreate</SelectItem>
              <SelectItem value="wesell">WeSell</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="logistics">Logistics</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.kpis.map((kpi, index) => (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {kpi.name}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {kpi.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl font-bold ${getKPIStatusColor(kpi.currentValue, kpi.targetValue)}`}>
                    {kpi.currentValue}{kpi.unit}
                  </span>
                  <div className="flex items-center text-sm">
                    {kpi.trend > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={kpi.trend > 0 ? 'text-green-600' : 'text-red-600'}>
                      {Math.abs(kpi.trendPercentage)}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Target: {kpi.targetValue}{kpi.unit}</span>
                    <span>{Math.round((kpi.currentValue / kpi.targetValue) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(kpi.currentValue / kpi.targetValue) * 100} 
                    className="h-2"
                  />
                </div>

                {kpi.aiInsights.length > 0 && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                    <div className="flex items-center text-xs text-blue-700 font-medium mb-1">
                      <Brain className="w-3 h-3 mr-1" />
                      AI Insights
                    </div>
                    <ul className="text-xs text-blue-600 space-y-1">
                      {kpi.aiInsights.slice(0, 2).map((insight, i) => (
                        <li key={i}>• {insight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Cross-Module</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Monthly revenue growth across all modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { month: 'Jan', revenue: 145000, target: 140000 },
                      { month: 'Feb', revenue: 152000, target: 145000 },
                      { month: 'Mar', revenue: 168000, target: 150000 },
                      { month: 'Apr', revenue: 175000, target: 155000 },
                      { month: 'May', revenue: 189000, target: 160000 },
                      { month: 'Jun', revenue: 195000, target: 165000 }
                    ]}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#60B5FF" strokeWidth={3} />
                      <Line type="monotone" dataKey="target" stroke="#FF9149" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Customer Acquisition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  Customer Acquisition
                </CardTitle>
                <CardDescription>New customers by channel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { channel: 'Organic', customers: 45 },
                      { channel: 'Paid Ads', customers: 32 },
                      { channel: 'Referral', customers: 28 },
                      { channel: 'Social', customers: 18 },
                      { channel: 'Direct', customers: 25 }
                    ]}>
                      <XAxis dataKey="channel" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="customers" fill="#60B5FF" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Module Performance Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Module Performance</CardTitle>
                <CardDescription>Efficiency and AI autonomy by module</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.crossModuleMetrics}>
                      <XAxis dataKey="module" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="efficiency" fill="#60B5FF" />
                      <Bar dataKey="aiAutonomy" fill="#FF9149" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* AI Autonomy Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>AI Autonomy Levels</CardTitle>
                <CardDescription>Distribution across modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.crossModuleMetrics}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="aiAutonomy"
                        nameKey="module"
                      >
                        {data.crossModuleMetrics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6">
            {data.aiInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                          {getInsightIcon(insight.category)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={insight.impact === 'high' ? 'default' : 'secondary'}>
                              {insight.impact} impact
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {Math.round(insight.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                      </div>
                      {insight.actionable && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Actionable
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{insight.description}</p>
                    {insight.recommendedActions && insight.recommendedActions.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Recommended Actions:</h4>
                        <ul className="space-y-1">
                          {insight.recommendedActions.map((action: string, i: number) => (
                            <li key={i} className="flex items-center text-sm text-gray-600">
                              <Zap className="w-3 h-3 mr-2 text-blue-500" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-purple-600" />
                  Real-time Activity
                </CardTitle>
                <CardDescription>Live system metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.realtimeMetrics}>
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="activeUsers" stroke="#60B5FF" strokeWidth={2} />
                      <Line type="monotone" dataKey="apiCalls" stroke="#FF9149" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current system status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">CPU Usage</span>
                  <span className="text-sm text-gray-600">23%</span>
                </div>
                <Progress value={23} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Memory Usage</span>
                  <span className="text-sm text-gray-600">67%</span>
                </div>
                <Progress value={67} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Database Load</span>
                  <span className="text-sm text-gray-600">41%</span>
                </div>
                <Progress value={41} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">API Response Time</span>
                  <span className="text-sm text-green-600">145ms</span>
                </div>
                <Progress value={85} className="h-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AdvancedAnalyticsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mt-2 animate-pulse"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
  )
}
