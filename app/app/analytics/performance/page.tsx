
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, BarChart3, Target, Users, Package, Clock, Zap } from 'lucide-react'

export default function AnalyticsPerformancePage() {
  const kpis = [
    {
      title: 'Overall Performance',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Efficiency Rate',
      value: '87.5%',
      change: '+1.8%',
      trend: 'up',
      icon: Zap,
      color: 'text-blue-600'
    },
    {
      title: 'Response Time',
      value: '1.2s',
      change: '-0.3s',
      trend: 'down',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'User Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600'
    }
  ]

  const departments = [
    { name: 'HR', performance: 92, trend: 'up', change: '+3%' },
    { name: 'Finance', performance: 88, trend: 'up', change: '+1%' },
    { name: 'Logistics', performance: 95, trend: 'stable', change: '0%' },
    { name: 'IT', performance: 91, trend: 'up', change: '+2%' },
    { name: 'Marketing', performance: 85, trend: 'down', change: '-1%' }
  ]

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600">Track and analyze performance metrics across all departments</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <BarChart3 className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {kpi.change}
                </span> from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Department Performance
          </CardTitle>
          <CardDescription>
            Performance metrics by department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departments.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {dept.name.substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                    <p className="text-sm text-gray-600">Department Performance</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getPerformanceColor(dept.performance)}`}>
                    {dept.performance}%
                  </div>
                  <p className="text-xs text-gray-500">
                    <span className={dept.trend === 'up' ? 'text-green-600' : dept.trend === 'down' ? 'text-red-600' : 'text-gray-600'}>
                      {dept.change}
                    </span> vs last month
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Highest performing metrics this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Logistics Efficiency</span>
                <Badge className="bg-green-100 text-green-800">95%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Customer Satisfaction</span>
                <Badge className="bg-green-100 text-green-800">94%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Process Automation</span>
                <Badge className="bg-green-100 text-green-800">92%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Improvement Areas</CardTitle>
            <CardDescription>Metrics that need attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Marketing ROI</span>
                <Badge className="bg-yellow-100 text-yellow-800">85%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Employee Turnover</span>
                <Badge className="bg-red-100 text-red-800">12%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">System Downtime</span>
                <Badge className="bg-yellow-100 text-yellow-800">2.1%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
