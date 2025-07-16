
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  AlertTriangle,
  FileText,
  BarChart3,
  Target,
  Clock,
  Brain,
  Award
} from 'lucide-react'
import { HRAnalyticsCharts } from './hr-analytics-charts'
import { EmployeeList } from './employee-list'
import { JobApplicationsList } from './job-applications-list'
import { PerformanceOverview } from './performance-overview'

interface HRAnalytics {
  overview: {
    totalEmployees: number
    activeEmployees: number
    recentHires: number
    retentionRate: number
    totalApplications: number
    pendingApplications: number
    applicationConversionRate: number
    churnRiskEmployees: number
  }
  departmentDistribution: Array<{
    department: string
    count: number
    percentage: number
  }>
  performanceMetrics: {
    averageScore: number
    minScore: number
    maxScore: number
  }
  applicationsByStatus: Array<{
    status: string
    count: number
    percentage: number
  }>
}

export function HRDashboard() {
  const { data: session } = useSession()
  const [analytics, setAnalytics] = useState<HRAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/hr/analytics?period=30d')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch HR analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading HR Dashboard...</div>
  }

  const overview = analytics?.overview

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Mitarbeiter Gesamt
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {overview?.totalEmployees || 0}
            </div>
            <p className="text-xs text-blue-700">
              {overview?.activeEmployees || 0} aktive Mitarbeiter
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Neue Mitarbeiter
            </CardTitle>
            <UserPlus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {overview?.recentHires || 0}
            </div>
            <p className="text-xs text-green-700">
              Letzte 30 Tage
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Bewerbungen
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {overview?.totalApplications || 0}
            </div>
            <p className="text-xs text-purple-700">
              {overview?.pendingApplications || 0} ausstehend
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">
              Retention Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {overview?.retentionRate?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-orange-700">
              Mitarbeiterbindung
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Alert */}
      {overview && overview.churnRiskEmployees > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-amber-800">
              <Brain className="h-5 w-5" />
              <span>KI-Warnung: Fluktuation Risiko</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-800">
                  <strong>{overview.churnRiskEmployees}</strong> Mitarbeiter haben ein hohes Fluktuation-Risiko
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Empfehlung: Sofortige Gespräche und Retention-Maßnahmen
                </p>
              </div>
              <Badge variant="destructive" className="bg-amber-600">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Hoch
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Übersicht</span>
          </TabsTrigger>
          <TabsTrigger value="employees" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Mitarbeiter</span>
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Bewerbungen</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <HRAnalyticsCharts analytics={analytics} />
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <EmployeeList />
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <JobApplicationsList />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceOverview analytics={analytics} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
