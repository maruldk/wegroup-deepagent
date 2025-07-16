
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download, Calendar, Filter, BarChart3, PieChart, TrendingUp, Users } from 'lucide-react'

export default function AnalyticsReportsPage() {
  const reports = [
    {
      id: 1,
      title: 'Monthly Performance Report',
      type: 'Performance',
      date: '2024-01-15',
      status: 'ready',
      size: '2.4 MB',
      format: 'PDF'
    },
    {
      id: 2,
      title: 'Financial Analytics Q1 2024',
      type: 'Financial',
      date: '2024-01-10',
      status: 'generating',
      size: '1.8 MB',
      format: 'Excel'
    },
    {
      id: 3,
      title: 'HR Metrics Dashboard',
      type: 'HR',
      date: '2024-01-08',
      status: 'ready',
      size: '3.2 MB',
      format: 'PDF'
    },
    {
      id: 4,
      title: 'Logistics Efficiency Analysis',
      type: 'Logistics',
      date: '2024-01-05',
      status: 'ready',
      size: '4.1 MB',
      format: 'PDF'
    }
  ]

  const reportTypes = [
    { name: 'Performance', count: 12, icon: TrendingUp },
    { name: 'Financial', count: 8, icon: BarChart3 },
    { name: 'HR', count: 6, icon: Users },
    { name: 'Logistics', count: 9, icon: PieChart }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800'
      case 'generating': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Reports</h1>
          <p className="text-gray-600">Generate and manage your business reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((type, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{type.name} Reports</CardTitle>
              <type.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{type.count}</div>
              <p className="text-xs text-muted-foreground">Available reports</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Reports
          </CardTitle>
          <CardDescription>
            Your latest generated reports and analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-600 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-600">{report.type} • {report.format} • {report.size}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      Generated on {report.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                  {report.status === 'ready' && (
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Performance Dashboard</h3>
                <p className="text-sm text-gray-600">View real-time performance metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <PieChart className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold">Custom Reports</h3>
                <p className="text-sm text-gray-600">Create custom analytics reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="font-semibold">Scheduled Reports</h3>
                <p className="text-sm text-gray-600">Set up automated reporting</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
