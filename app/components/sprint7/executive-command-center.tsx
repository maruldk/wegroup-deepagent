
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Brain, 
  Globe, 
  Zap, 
  Shield, 
  TrendingUp, 
  Activity, 
  Users, 
  DollarSign, 
  Target, 
  Cpu, 
  Gauge, 
  BarChart3,
  LineChart,
  PieChart,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  Rocket,
  Eye,
  Command
} from 'lucide-react'
import { ResponsiveContainer, LineChart as RechartsLine, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart as RechartsPie, Cell } from 'recharts'
import { motion } from 'framer-motion'

interface ExecutiveMetrics {
  autonomyScore: number
  totalDecisions: number
  implementedDecisions: number
  activeInsights: number
  healingActions: number
  systemHealth: string
  globalDeployments: number
  partnerRevenue: number
  apiCalls: number
  predictionAccuracy: number
}

interface RealtimeData {
  timestamp: string
  autonomy: number
  decisions: number
  revenue: number
  health: number
}

const ExecutiveCommandCenter = () => {
  const [metrics, setMetrics] = useState<ExecutiveMetrics>({
    autonomyScore: 95.2,
    totalDecisions: 1247,
    implementedDecisions: 1186,
    activeInsights: 34,
    healingActions: 156,
    systemHealth: 'OPTIMAL',
    globalDeployments: 8,
    partnerRevenue: 45680.50,
    apiCalls: 892465,
    predictionAccuracy: 87.3
  })

  const [realtimeData, setRealtimeData] = useState<RealtimeData[]>([
    { timestamp: '14:00', autonomy: 94.8, decisions: 45, revenue: 1250, health: 98.2 },
    { timestamp: '14:15', autonomy: 95.1, decisions: 52, revenue: 1380, health: 98.8 },
    { timestamp: '14:30', autonomy: 95.2, decisions: 48, revenue: 1420, health: 97.9 },
    { timestamp: '14:45', autonomy: 95.3, decisions: 61, revenue: 1560, health: 99.1 },
    { timestamp: '15:00', autonomy: 95.2, decisions: 55, revenue: 1680, health: 98.6 }
  ])

  const [activeDecisions, setActiveDecisions] = useState([
    {
      id: '1',
      type: 'SCALING',
      confidence: 0.94,
      status: 'EXECUTING',
      description: 'Auto-scale EU region due to 45% traffic increase',
      impact: 'HIGH',
      eta: '2 min'
    },
    {
      id: '2', 
      type: 'PRICING',
      confidence: 0.89,
      status: 'PENDING',
      description: 'Optimize API pricing for partner ecosystem',
      impact: 'MEDIUM',
      eta: '5 min'
    },
    {
      id: '3',
      type: 'SECURITY_RESPONSE',
      confidence: 0.96,
      status: 'EXECUTED',
      description: 'Mitigate detected anomaly in authentication system',
      impact: 'CRITICAL',
      eta: 'Complete'
    }
  ])

  const [globalRegions] = useState([
    { name: 'EU-West', status: 'OPTIMAL', deployments: 3, tenants: 45, latency: 89 },
    { name: 'US-East', status: 'OPTIMAL', deployments: 2, tenants: 67, latency: 112 },
    { name: 'APAC-SE', status: 'WARNING', deployments: 2, tenants: 23, latency: 156 },
    { name: 'US-West', status: 'OPTIMAL', deployments: 1, tenants: 34, latency: 98 }
  ])

  const [predictiveInsights] = useState([
    {
      type: 'REVENUE_PREDICTION',
      prediction: '+18.5% next 72h',
      confidence: 0.84,
      impact: 'HIGH',
      actions: ['Scale marketing', 'Prepare infrastructure']
    },
    {
      type: 'CHURN_RISK',
      prediction: '3 high-value clients at risk',
      confidence: 0.91,
      impact: 'CRITICAL',
      actions: ['Account manager intervention', 'Feature enhancement']
    },
    {
      type: 'PERFORMANCE_FORECAST',
      prediction: 'Peak load expected 16:00 CET',
      confidence: 0.88,
      impact: 'MEDIUM',
      actions: ['Pre-scale systems', 'Alert operations team']
    }
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        autonomyScore: 95.0 + Math.random() * 0.5,
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 100),
        partnerRevenue: prev.partnerRevenue + Math.random() * 50
      }))

      // Update real-time chart data
      const now = new Date()
      const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
      
      setRealtimeData(prev => {
        const newData = [...prev.slice(-4), {
          timestamp: timeString,
          autonomy: 95.0 + Math.random() * 0.5,
          decisions: Math.floor(Math.random() * 20) + 40,
          revenue: Math.floor(Math.random() * 500) + 1200,
          health: 97 + Math.random() * 3
        }]
        return newData
      })
    }, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const autonomyColor = metrics.autonomyScore >= 95 ? '#10B981' : metrics.autonomyScore >= 90 ? '#F59E0B' : '#EF4444'

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl text-white">
            <Command className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Executive Command Center</h1>
            <p className="text-gray-600">Sprint 7 - Market Readiness & Advanced Integration • 95% KI-Autonomie</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live System
          </Badge>
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            95% Autonomous
          </Badge>
        </div>
      </motion.div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-700">KI-Autonomie</CardTitle>
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{metrics.autonomyScore.toFixed(1)}%</div>
              <div className="flex items-center mt-2">
                <Progress value={metrics.autonomyScore} className="flex-1 mr-2" />
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-xs text-blue-600 mt-1">+2.3% from Sprint 6</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-emerald-700">Autonomous Decisions</CardTitle>
                <Zap className="w-5 h-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">{metrics.implementedDecisions.toLocaleString()}</div>
              <p className="text-xs text-emerald-600">
                {metrics.totalDecisions.toLocaleString()} total • {((metrics.implementedDecisions / metrics.totalDecisions) * 100).toFixed(1)}% success
              </p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-xs text-emerald-600">3 executing now</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-700">Global Deployments</CardTitle>
                <Globe className="w-5 h-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{metrics.globalDeployments}</div>
              <p className="text-xs text-purple-600">4 regions • 169 tenants</p>
              <div className="flex items-center mt-2">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-xs text-purple-600">All systems operational</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-amber-700">API Revenue</CardTitle>
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900">€{(metrics.partnerRevenue / 1000).toFixed(1)}k</div>
              <p className="text-xs text-amber-600">{metrics.apiCalls.toLocaleString()} API calls</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-xs text-amber-600">+15.7% today</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-red-50 to-pink-100 border-red-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-red-700">System Health</CardTitle>
                <Shield className="w-5 h-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900">{metrics.predictionAccuracy.toFixed(1)}%</div>
              <p className="text-xs text-red-600">Prediction accuracy</p>
              <div className="flex items-center mt-2">
                <Activity className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-xs text-red-600">{metrics.healingActions} auto-heals</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="realtime" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="realtime" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Real-time</span>
          </TabsTrigger>
          <TabsTrigger value="decisions" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Decisions</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Insights</span>
          </TabsTrigger>
          <TabsTrigger value="global" className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Global</span>
          </TabsTrigger>
          <TabsTrigger value="partners" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Partners</span>
          </TabsTrigger>
        </TabsList>

        {/* Real-time Monitoring */}
        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gauge className="w-5 h-5 text-blue-600" />
                    <span>Autonomy Performance</span>
                  </CardTitle>
                  <CardDescription>Real-time KI-Autonomie tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLine data={realtimeData}>
                      <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
                      <YAxis domain={[90, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value: any) => [`${value}%`, 'Autonomy']}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="autonomy" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                      />
                    </RechartsLine>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                    <span>Decision Velocity</span>
                  </CardTitle>
                  <CardDescription>Autonomous decisions per 15-min window</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={realtimeData}>
                      <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value: any) => [`${value}`, 'Decisions']}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Bar dataKey="decisions" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>Live System Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">99.98%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.98%' }}></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">89ms</div>
                    <div className="text-sm text-gray-600">Avg Response</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-sm text-gray-600">AI Models Active</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">€1.2k</div>
                    <div className="text-sm text-gray-600">Revenue/Hour</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Autonomous Decisions */}
        <TabsContent value="decisions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeDecisions.map((decision, index) => (
              <motion.div 
                key={decision.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-white/80 backdrop-blur-sm ${
                  decision.impact === 'CRITICAL' ? 'border-red-300' :
                  decision.impact === 'HIGH' ? 'border-orange-300' : 'border-blue-300'
                }`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={
                        decision.status === 'EXECUTING' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        decision.status === 'EXECUTED' ? 'bg-green-50 text-green-700 border-green-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }>
                        {decision.status}
                      </Badge>
                      <Badge variant={decision.impact === 'CRITICAL' ? 'destructive' : 'secondary'}>
                        {decision.impact}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{decision.type.replace('_', ' ')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{decision.description}</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">AI Confidence</span>
                        <span className="text-sm text-blue-600">{(decision.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={decision.confidence * 100} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">ETA</span>
                        <span className="font-medium">{decision.eta}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Predictive Insights */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {predictiveInsights.map((insight, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{insight.type.replace('_', ' ')}</CardTitle>
                      <Badge variant={insight.impact === 'CRITICAL' ? 'destructive' : 'secondary'}>
                        {insight.impact}
                      </Badge>
                    </div>
                    <CardDescription>72h Prediction</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="font-medium text-blue-900">{insight.prediction}</div>
                        <div className="text-sm text-blue-600">Confidence: {(insight.confidence * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">Recommended Actions:</div>
                        <ul className="space-y-1">
                          {insight.actions.map((action, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center">
                              <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Global Deployments */}
        <TabsContent value="global" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {globalRegions.map((region, index) => (
              <motion.div 
                key={region.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-white/80 backdrop-blur-sm ${
                  region.status === 'OPTIMAL' ? 'border-green-300' : 'border-amber-300'
                }`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{region.name}</CardTitle>
                      <Badge variant={region.status === 'OPTIMAL' ? 'default' : 'secondary'} className={
                        region.status === 'OPTIMAL' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }>
                        {region.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Deployments</span>
                        <span className="font-medium">{region.deployments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tenants</span>
                        <span className="font-medium">{region.tenants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Latency</span>
                        <span className={`font-medium ${region.latency < 100 ? 'text-green-600' : region.latency < 150 ? 'text-amber-600' : 'text-red-600'}`}>
                          {region.latency}ms
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Partner Ecosystem */}
        <TabsContent value="partners" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Partner Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Active Partners</span>
                    <span className="font-bold text-2xl">47</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>API Integrations</span>
                    <span className="font-bold text-2xl">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Revenue Share</span>
                    <span className="font-bold text-2xl">€15.2k</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Success Rate</span>
                    <span className="font-bold text-2xl text-green-600">98.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span>API Monetization</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total APIs</span>
                    <span className="font-bold text-2xl">52</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Monthly Calls</span>
                    <span className="font-bold text-2xl">2.1M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Revenue/Month</span>
                    <span className="font-bold text-2xl">€48.6k</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Growth Rate</span>
                    <span className="font-bold text-2xl text-blue-600">+23%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200"
      >
        <div className="flex items-center space-x-4">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            All Systems Operational
          </Badge>
          <span className="text-sm text-gray-600">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Rocket className="w-4 h-4 mr-2" />
            Deploy Global
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default ExecutiveCommandCenter
