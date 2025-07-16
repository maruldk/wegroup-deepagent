
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  TrendingUp, 
  Target, 
  Brain, 
  Plus, 
  BarChart3, 
  DollarSign,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import dynamic from 'next/dynamic'
import AILeadDashboard from '@/components/wesell/ai-lead-dashboard'

// Dynamically import charts to avoid SSR issues
const Chart = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded animate-pulse" />
})

interface SalesMetrics {
  totalCustomers: number
  activeLeads: number
  openOpportunities: number
  monthlyRevenue: number
  conversionRate: number
  avgDealSize: number
  forecastAccuracy: number
  pipelineValue: number
}

interface LeadActivity {
  id: string
  customerName: string
  activityType: string
  status: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  aiScore: number
  nextAction: string
  dueDate: string
}

interface OpportunityData {
  id: string
  name: string
  customerName: string
  stage: string
  value: number
  probability: number
  aiProbability: number
  closeDate: string
}

export default function WeSellDashboard() {
  const [metrics, setMetrics] = useState<SalesMetrics>({
    totalCustomers: 0,
    activeLeads: 0,
    openOpportunities: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    avgDealSize: 0,
    forecastAccuracy: 0,
    pipelineValue: 0
  })
  const [recentActivities, setRecentActivities] = useState<LeadActivity[]>([])
  const [topOpportunities, setTopOpportunities] = useState<OpportunityData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setMetrics({
          totalCustomers: 342,
          activeLeads: 67,
          openOpportunities: 23,
          monthlyRevenue: 145000,
          conversionRate: 24.5,
          avgDealSize: 8500,
          forecastAccuracy: 94.2,
          pipelineValue: 285000
        })

        setRecentActivities([
          {
            id: '1',
            customerName: 'TechCorp Solutions',
            activityType: 'CALL',
            status: 'QUALIFIED',
            priority: 'HIGH',
            aiScore: 87,
            nextAction: 'Demo Präsentation',
            dueDate: '2024-01-15'
          },
          {
            id: '2',
            customerName: 'Marketing Plus GmbH',
            activityType: 'EMAIL',
            status: 'NEW',
            priority: 'MEDIUM',
            aiScore: 73,
            nextAction: 'Follow-up Call',
            dueDate: '2024-01-16'
          },
          {
            id: '3',
            customerName: 'InnovateTech AG',
            activityType: 'MEETING',
            status: 'NEGOTIATION',
            priority: 'HIGH',
            aiScore: 91,
            nextAction: 'Angebot erstellen',
            dueDate: '2024-01-14'
          }
        ])

        setTopOpportunities([
          {
            id: '1',
            name: 'Enterprise Software Deal',
            customerName: 'TechCorp Solutions',
            stage: 'NEGOTIATION',
            value: 45000,
            probability: 80,
            aiProbability: 87,
            closeDate: '2024-01-30'
          },
          {
            id: '2',
            name: 'Marketing Automation Suite',
            customerName: 'Marketing Plus GmbH',
            stage: 'PROPOSAL',
            value: 28000,
            probability: 65,
            aiProbability: 71,
            closeDate: '2024-02-15'
          },
          {
            id: '3',
            name: 'Digital Transformation',
            customerName: 'InnovateTech AG',
            stage: 'DISCOVERY',
            value: 75000,
            probability: 45,
            aiProbability: 52,
            closeDate: '2024-03-20'
          }
        ])
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'DISCOVERY': return 'bg-blue-100 text-blue-800'
      case 'QUALIFICATION': return 'bg-indigo-100 text-indigo-800'
      case 'PROPOSAL': return 'bg-purple-100 text-purple-800'
      case 'NEGOTIATION': return 'bg-orange-100 text-orange-800'
      case 'CLOSED_WON': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <WeSellDashboardSkeleton />
  }

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link href="/wesell/customers">
          <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Neuer Kunde
          </Button>
        </Link>
        <Link href="/wesell/sales">
          <Button variant="outline" className="border-green-200 hover:bg-green-50">
            <Target className="w-4 h-4 mr-2" />
            Opportunity erstellen
          </Button>
        </Link>
        <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
          <Brain className="w-4 h-4 mr-2" />
          KI-Angebot generieren
        </Button>
        <Button variant="outline" className="border-teal-200 hover:bg-teal-50">
          <BarChart3 className="w-4 h-4 mr-2" />
          Sales Analytics
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Sales Overview</TabsTrigger>
          <TabsTrigger value="ai-leads">AI Lead Intelligence</TabsTrigger>
          <TabsTrigger value="forecasting">Sales Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Aktive Leads
              </CardTitle>
              <Users className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{metrics.activeLeads}</div>
              <p className="text-xs text-gray-600 mt-1">
                +12 seit letzter Woche
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-teal-50 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pipeline Wert
              </CardTitle>
              <DollarSign className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">
                €{(metrics.pipelineValue / 1000).toFixed(0)}k
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {metrics.openOpportunities} offene Opportunities
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-teal-50 to-green-50 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Conversion Rate
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-700">{metrics.conversionRate}%</div>
              <p className="text-xs text-gray-600 mt-1">
                +3.2% vs. letzter Monat
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                KI Forecast Accuracy
              </CardTitle>
              <Brain className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">{metrics.forecastAccuracy}%</div>
              <p className="text-xs text-gray-600 mt-1">
                Letzte 30 Tage
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-green-600" />
                  Lead-Aktivitäten mit KI-Score
                </CardTitle>
                <Link href="/wesell/sales">
                  <Button variant="ghost" size="sm">
                    Alle anzeigen
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group p-4 rounded-lg border hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                            {activity.customerName}
                          </h3>
                          <Badge className={getPriorityColor(activity.priority)}>
                            {activity.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {activity.activityType}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Brain className="w-4 h-4 mr-1 text-purple-500" />
                            KI-Score: {activity.aiScore}%
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(activity.dueDate).toLocaleDateString('de-DE')}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-600">
                            Nächste Aktion: {activity.nextAction}
                          </span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Opportunities */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Target className="w-5 h-5 mr-2" />
                Top Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topOpportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg border bg-gradient-to-r from-blue-50 to-teal-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{opportunity.name}</h4>
                    <Badge className={getStageColor(opportunity.stage)}>
                      {opportunity.stage}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{opportunity.customerName}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Wert: €{(opportunity.value / 1000).toFixed(0)}k</span>
                      <span>KI: {opportunity.aiProbability}%</span>
                    </div>
                    <Progress 
                      value={opportunity.aiProbability} 
                      className="h-2"
                    />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* KI Performance Metrics */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-700">
                <Brain className="w-5 h-5 mr-2" />
                KI-Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Lead Qualification</span>
                  <span className="font-semibold text-purple-700">89%</span>
                </div>
                <Progress value={89} className="h-3" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Forecast Accuracy</span>
                  <span className="font-semibold text-blue-700">{metrics.forecastAccuracy}%</span>
                </div>
                <Progress value={metrics.forecastAccuracy} className="h-3" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Proposal Success</span>
                  <span className="font-semibold text-green-700">76%</span>
                </div>
                <Progress value={76} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                Monats-Übersicht
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Neue Leads</span>
                <span className="font-semibold text-green-600">+{metrics.activeLeads}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Abgeschlossene Deals</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Durchschn. Deal Size</span>
                <span className="font-semibold text-blue-600">€{(metrics.avgDealSize / 1000).toFixed(1)}k</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monats-Umsatz</span>
                <span className="font-semibold text-green-600">€{(metrics.monthlyRevenue / 1000).toFixed(0)}k</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
        </TabsContent>

        <TabsContent value="ai-leads" className="space-y-6">
          <AILeadDashboard />
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  AI Sales Forecasting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Q1 Revenue Prediction</span>
                    <span className="font-semibold text-green-700">€285k</span>
                  </div>
                  <Progress value={94} className="h-3" />
                  <div className="text-xs text-gray-500 mt-1">94% confidence</div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Pipeline Conversion</span>
                    <span className="font-semibold text-blue-700">73%</span>
                  </div>
                  <Progress value={73} className="h-3" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Deal Velocity</span>
                    <span className="font-semibold text-purple-700">18 days</span>
                  </div>
                  <Progress value={85} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  Predictive Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Best Month to Close</span>
                  <span className="font-semibold text-blue-600">March</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Top Lead Source</span>
                  <span className="font-semibold text-green-600">Referrals</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Risk Score</span>
                  <span className="font-semibold text-red-600">Low (15%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Recommended Focus</span>
                  <span className="font-semibold text-purple-600">Enterprise</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function WeSellDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-96 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="space-y-6">
          <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
