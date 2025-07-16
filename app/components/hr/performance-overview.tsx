
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Brain
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'

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
  performanceMetrics: {
    averageScore: number
    minScore: number
    maxScore: number
  }
}

interface PerformanceData {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  department?: string
  performanceScore?: number
  predictedChurnRisk?: number
  lastReviewDate?: string
  nextReviewDue?: string
  trend: 'up' | 'down' | 'stable'
}

interface Props {
  analytics: HRAnalytics | null
}

export function PerformanceOverview({ analytics }: Props) {
  const [topPerformers, setTopPerformers] = useState<PerformanceData[]>([])
  const [atRiskEmployees, setAtRiskEmployees] = useState<PerformanceData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in real app, this would come from API
    generateMockPerformanceData()
  }, [])

  const generateMockPerformanceData = () => {
    // Mock top performers
    const mockTopPerformers: PerformanceData[] = [
      {
        id: '1',
        employeeId: 'EMP001',
        firstName: 'Anna',
        lastName: 'Schmidt',
        department: 'Engineering',
        performanceScore: 95,
        predictedChurnRisk: 0.1,
        lastReviewDate: '2024-06-01',
        nextReviewDue: '2024-12-01',
        trend: 'up'
      },
      {
        id: '2',
        employeeId: 'EMP002',
        firstName: 'Marcus',
        lastName: 'Weber',
        department: 'Sales',
        performanceScore: 92,
        predictedChurnRisk: 0.15,
        lastReviewDate: '2024-05-15',
        nextReviewDue: '2024-11-15',
        trend: 'stable'
      },
      {
        id: '3',
        employeeId: 'EMP003',
        firstName: 'Lisa',
        lastName: 'Müller',
        department: 'Marketing',
        performanceScore: 88,
        predictedChurnRisk: 0.2,
        lastReviewDate: '2024-06-10',
        nextReviewDue: '2024-12-10',
        trend: 'up'
      }
    ]

    // Mock at-risk employees
    const mockAtRiskEmployees: PerformanceData[] = [
      {
        id: '4',
        employeeId: 'EMP004',
        firstName: 'Thomas',
        lastName: 'Wagner',
        department: 'Engineering',
        performanceScore: 45,
        predictedChurnRisk: 0.85,
        lastReviewDate: '2024-04-20',
        nextReviewDue: '2024-10-20',
        trend: 'down'
      },
      {
        id: '5',
        employeeId: 'EMP005',
        firstName: 'Sarah',
        lastName: 'Fischer',
        department: 'Support',
        performanceScore: 52,
        predictedChurnRisk: 0.78,
        lastReviewDate: '2024-05-05',
        nextReviewDue: '2024-11-05',
        trend: 'down'
      }
    ]

    setTopPerformers(mockTopPerformers)
    setAtRiskEmployees(mockAtRiskEmployees)
    setLoading(false)
  }

  // Mock performance trend data
  const performanceTrendData = [
    { month: 'Jan', avgScore: 72, topPerformers: 15, atRisk: 8 },
    { month: 'Feb', avgScore: 74, topPerformers: 18, atRisk: 6 },
    { month: 'Mär', avgScore: 76, topPerformers: 20, atRisk: 5 },
    { month: 'Apr', avgScore: 75, topPerformers: 22, atRisk: 7 },
    { month: 'Mai', avgScore: 78, topPerformers: 25, atRisk: 4 },
    { month: 'Jun', avgScore: analytics?.performanceMetrics?.averageScore || 80, topPerformers: 28, atRisk: 3 }
  ]

  const getPerformanceColor = (score?: number) => {
    if (!score) return 'text-gray-500'
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPerformanceBadge = (score?: number) => {
    if (!score) return null
    
    if (score >= 80) {
      return <Badge className="bg-green-100 text-green-800">Exzellent</Badge>
    } else if (score >= 60) {
      return <Badge className="bg-blue-100 text-blue-800">Gut</Badge>
    } else if (score >= 40) {
      return <Badge className="bg-yellow-100 text-yellow-800">Verbesserungsbedarf</Badge>
    } else {
      return <Badge variant="destructive">Kritisch</Badge>
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Target className="h-4 w-4 text-blue-600" />
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading Performance Overview...</div>
  }

  return (
    <div className="space-y-6">
      {/* Performance Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Top Performer
            </CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {topPerformers.length}
            </div>
            <p className="text-xs text-green-700">
              Mitarbeiter mit 80%+ Score
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Durchschnitt
            </CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {analytics?.performanceMetrics?.averageScore?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-blue-700">
              Performance Score
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">
              Risiko Mitarbeiter
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {atRiskEmployees.length}
            </div>
            <p className="text-xs text-red-700">
              Benötigen Aufmerksamkeit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Performance Trends (6 Monate)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="avgScore" 
                stroke="#60B5FF" 
                strokeWidth={3}
                name="Durchschnitt %"
              />
              <Line 
                type="monotone" 
                dataKey="topPerformers" 
                stroke="#72BF78" 
                strokeWidth={2}
                name="Top Performer"
              />
              <Line 
                type="monotone" 
                dataKey="atRisk" 
                stroke="#FF6363" 
                strokeWidth={2}
                name="Risiko Mitarbeiter"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-green-600" />
              <span>Top Performer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((employee) => (
                <div key={employee.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${employee.firstName}+${employee.lastName}`} />
                    <AvatarFallback>
                      {employee.firstName[0]}{employee.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {employee.firstName} {employee.lastName}
                      </p>
                      {getTrendIcon(employee.trend)}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">{employee.department}</span>
                      <Badge variant="outline" className="text-xs">
                        {employee.employeeId}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getPerformanceColor(employee.performanceScore)}`}>
                      {employee.performanceScore}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Fluktuation: {((employee.predictedChurnRisk || 0) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* At-Risk Employees */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Risiko Mitarbeiter</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {atRiskEmployees.map((employee) => (
                <div key={employee.id} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${employee.firstName}+${employee.lastName}`} />
                    <AvatarFallback>
                      {employee.firstName[0]}{employee.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {employee.firstName} {employee.lastName}
                      </p>
                      {getTrendIcon(employee.trend)}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">{employee.department}</span>
                      {getPerformanceBadge(employee.performanceScore)}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getPerformanceColor(employee.performanceScore)}`}>
                      {employee.performanceScore}%
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {((employee.predictedChurnRisk || 0) * 100).toFixed(0)}% Risiko
                    </Badge>
                  </div>
                </div>
              ))}
              
              {atRiskEmployees.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-500">Keine Risiko-Mitarbeiter erkannt</p>
                  <p className="text-sm text-gray-400 mt-1">Alle Mitarbeiter zeigen stabile Performance</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Performance Insights */}
      <Card className="border-indigo-200 bg-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-indigo-800">
            <Brain className="h-5 w-5" />
            <span>KI Performance Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-800">
                  Performance Trend: Positiv
                </p>
                <p className="text-sm text-indigo-700">
                  Die Durchschnittsperformance ist in den letzten 3 Monaten um 8% gestiegen. 
                  Besonders stark ist das Engineering Team.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Target className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-800">
                  Empfehlung: Fokus auf Training
                </p>
                <p className="text-sm text-indigo-700">
                  2 Mitarbeiter zeigen Verbesserungspotential. Empfohlene Maßnahme: 
                  Gezielte Schulungen und Mentoring-Programme.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Users className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-800">
                  Team Balance: Gut
                </p>
                <p className="text-sm text-indigo-700">
                  Die Performance-Verteilung ist ausgewogen. 
                  Keine überlasteten Teams erkannt.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
