
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import { TrendingUp, Users, Target, FileText } from 'lucide-react'

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

interface Props {
  analytics: HRAnalytics | null
}

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3', '#A19AD3', '#72BF78', '#FFB366']

const statusLabels: { [key: string]: string } = {
  'RECEIVED': 'Eingegangen',
  'SCREENING': 'Screening',
  'INTERVIEW_SCHEDULED': 'Interview geplant',
  'INTERVIEWED': 'Interview erfolgt',
  'BACKGROUND_CHECK': 'Hintergrundprüfung',
  'OFFER_MADE': 'Angebot gemacht',
  'HIRED': 'Eingestellt',
  'REJECTED': 'Abgelehnt',
  'WITHDRAWN': 'Zurückgezogen'
}

export function HRAnalyticsCharts({ analytics }: Props) {
  if (!analytics) {
    return <div>Lade Analytics...</div>
  }

  // Prepare department data for chart
  const departmentData = analytics.departmentDistribution.map(dept => ({
    ...dept,
    displayName: dept.department === 'Unassigned' ? 'Nicht zugeordnet' : dept.department
  }))

  // Prepare application status data
  const applicationStatusData = analytics.applicationsByStatus.map(status => ({
    ...status,
    statusLabel: statusLabels[status.status] || status.status,
    fill: COLORS[Math.abs(status.status.charCodeAt(0)) % COLORS.length]
  }))

  // Mock trend data (in real app, this would come from API)
  const trendData = [
    { month: 'Jan', employees: analytics.overview.totalEmployees - 15, applications: 28 },
    { month: 'Feb', employees: analytics.overview.totalEmployees - 12, applications: 31 },
    { month: 'Mär', employees: analytics.overview.totalEmployees - 8, applications: 25 },
    { month: 'Apr', employees: analytics.overview.totalEmployees - 5, applications: 38 },
    { month: 'Mai', employees: analytics.overview.totalEmployees - 2, applications: 42 },
    { month: 'Jun', employees: analytics.overview.totalEmployees, applications: analytics.overview.totalApplications }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Department Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Mitarbeiter nach Abteilung</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="displayName" 
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip 
                formatter={(value: number) => [value, 'Mitarbeiter']}
                labelFormatter={(label) => `Abteilung: ${label}`}
              />
              <Bar dataKey="count" fill="#60B5FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Application Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-purple-600" />
            <span>Bewerbungen nach Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={applicationStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ statusLabel, percentage }) => 
                  percentage > 5 ? `${statusLabel} ${percentage}%` : ''
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {applicationStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [value, 'Bewerbungen']}
                labelFormatter={(label) => `Status: ${label}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* HR Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>HR Trends (6 Monate)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="employees" 
                stroke="#60B5FF" 
                strokeWidth={2}
                name="Mitarbeiter"
              />
              <Line 
                type="monotone" 
                dataKey="applications" 
                stroke="#FF9149" 
                strokeWidth={2}
                name="Bewerbungen"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-orange-600" />
            <span>Performance Übersicht</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Durchschnittsscore</span>
              <span className="text-2xl font-bold text-green-600">
                {analytics.performanceMetrics.averageScore.toFixed(1)}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Min Score</span>
                <span className="font-medium">{analytics.performanceMetrics.minScore}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Max Score</span>
                <span className="font-medium">{analytics.performanceMetrics.maxScore}</span>
              </div>
            </div>

            {/* Performance Distribution Visualization */}
            <div className="pt-4">
              <div className="h-32 flex items-end space-x-2">
                <div className="flex-1 bg-red-200 rounded-t" style={{height: '20%'}}>
                  <div className="text-xs text-center pt-1">0-40</div>
                </div>
                <div className="flex-1 bg-yellow-200 rounded-t" style={{height: '30%'}}>
                  <div className="text-xs text-center pt-1">41-60</div>
                </div>
                <div className="flex-1 bg-blue-200 rounded-t" style={{height: '70%'}}>
                  <div className="text-xs text-center pt-1">61-80</div>
                </div>
                <div className="flex-1 bg-green-200 rounded-t" style={{height: '85%'}}>
                  <div className="text-xs text-center pt-1">81-100</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 text-center mt-1">
                Performance Score Verteilung
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
