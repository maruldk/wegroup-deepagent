
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  Gauge, 
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Zap,
  Target,
  RefreshCw,
  Download,
  Calendar,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts'

const responseTimeData = [
  { time: '00:00', p50: 45, p90: 89, p95: 134, p99: 287 },
  { time: '00:15', p50: 52, p90: 98, p95: 145, p99: 312 },
  { time: '00:30', p50: 38, p90: 76, p95: 123, p99: 234 },
  { time: '00:45', p50: 61, p90: 112, p95: 178, p99: 398 },
  { time: '01:00', p50: 47, p90: 89, p95: 134, p99: 276 },
  { time: '01:15', p50: 55, p90: 103, p95: 156, p99: 323 },
  { time: '01:30', p50: 42, p90: 82, p95: 128, p99: 245 }
]

const throughputData = [
  { time: '00:00', requests: 1247, errors: 12, success: 1235 },
  { time: '00:15', requests: 1389, errors: 8, success: 1381 },
  { time: '00:30', requests: 1156, errors: 15, success: 1141 },
  { time: '00:45', requests: 1523, errors: 23, success: 1500 },
  { time: '01:00', requests: 1334, errors: 7, success: 1327 },
  { time: '01:15', requests: 1445, errors: 19, success: 1426 },
  { time: '01:30', requests: 1289, errors: 11, success: 1278 }
]

const endpointPerformance = [
  { endpoint: '/api/logistics/tracking', avgResponse: 45, requests: 15420, errorRate: 0.2, availability: 99.98 },
  { endpoint: '/api/finance/transactions', avgResponse: 89, requests: 12340, errorRate: 0.1, availability: 99.95 },
  { endpoint: '/api/wesell/customers', avgResponse: 123, requests: 8760, errorRate: 0.8, availability: 99.87 },
  { endpoint: '/api/wecreate/content', avgResponse: 234, requests: 6540, errorRate: 1.2, availability: 99.78 },
  { endpoint: '/api/hr/employees', avgResponse: 67, requests: 4230, errorRate: 0.3, availability: 99.92 },
  { endpoint: '/api/security/audit', avgResponse: 156, requests: 2890, errorRate: 0.5, availability: 99.89 }
]

const apdexData = [
  { service: 'API Gateway', apdex: 0.94, threshold: '100ms', color: '#16a34a' },
  { service: 'Database', apdex: 0.97, threshold: '50ms', color: '#16a34a' },
  { service: 'Cache', apdex: 0.99, threshold: '10ms', color: '#16a34a' },
  { service: 'Storage', apdex: 0.87, threshold: '200ms', color: '#ca8a04' },
  { service: 'Search', apdex: 0.91, threshold: '150ms', color: '#16a34a' },
  { service: 'Analytics', apdex: 0.83, threshold: '300ms', color: '#ca8a04' }
]

const slaMetrics = [
  { metric: 'Overall Availability', current: 99.94, target: 99.9, status: 'good' },
  { metric: 'Response Time SLA', current: 98.7, target: 95.0, status: 'good' },
  { metric: 'Error Rate SLA', current: 99.2, target: 99.0, status: 'good' },
  { metric: 'Throughput SLA', current: 94.3, target: 95.0, status: 'warning' }
]

export default function PerformanceAnalyticsComponent() {
  const [timeRange, setTimeRange] = useState('1h')
  const [serviceFilter, setServiceFilter] = useState('all')

  const getSLAStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 border-green-600'
      case 'warning': return 'text-yellow-600 border-yellow-600'
      case 'critical': return 'text-red-600 border-red-600'
      default: return 'text-gray-600 border-gray-600'
    }
  }

  const getSLAStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'critical': return <XCircle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const avgResponseTime = responseTimeData.reduce((sum, item) => sum + item.p50, 0) / responseTimeData.length
  const totalRequests = throughputData.reduce((sum, item) => sum + item.requests, 0)
  const totalErrors = throughputData.reduce((sum, item) => sum + item.errors, 0)
  const errorRate = (totalErrors / totalRequests) * 100
  const avgApdex = apdexData.reduce((sum, item) => sum + item.apdex, 0) / apdexData.length

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15m">Last 15 min</SelectItem>
              <SelectItem value="1h">Last 1 hour</SelectItem>
              <SelectItem value="6h">Last 6 hours</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-40">
              <BarChart3 className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="api">API Gateway</SelectItem>
              <SelectItem value="database">Database</SelectItem>
              <SelectItem value="cache">Cache</SelectItem>
              <SelectItem value="storage">Storage</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Avg Response</p>
                  <p className="text-2xl font-bold text-blue-900">{avgResponseTime.toFixed(0)}ms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Throughput</p>
                  <p className="text-2xl font-bold text-green-900">{totalRequests.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-500 rounded-lg">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600">Error Rate</p>
                  <p className="text-2xl font-bold text-red-900">{errorRate.toFixed(2)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600">Avg Apdex</p>
                  <p className="text-2xl font-bold text-purple-900">{avgApdex.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Response Time Percentiles
              </CardTitle>
              <CardDescription>
                Response time distribution across different percentiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="time" 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Time', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <YAxis 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        fontSize: 11
                      }} 
                    />
                    <Line type="monotone" dataKey="p50" stroke="#10b981" strokeWidth={2} name="P50 (median)" />
                    <Line type="monotone" dataKey="p90" stroke="#3b82f6" strokeWidth={2} name="P90" />
                    <Line type="monotone" dataKey="p95" stroke="#f59e0b" strokeWidth={2} name="P95" />
                    <Line type="monotone" dataKey="p99" stroke="#ef4444" strokeWidth={2} name="P99" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Throughput & Errors
              </CardTitle>
              <CardDescription>
                Request volume and error distribution over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={throughputData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="time" 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Time', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <YAxis 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Requests', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        fontSize: 11
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="success" 
                      stackId="1"
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                      name="Successful"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="errors" 
                      stackId="1"
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.8}
                      name="Errors"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Apdex Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Application Performance Index (Apdex)
            </CardTitle>
            <CardDescription>
              User satisfaction scores based on response time thresholds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apdexData.map((service, index) => (
                <div key={service.service} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{service.service}</h4>
                    <Badge variant="outline" style={{ color: service.color, borderColor: service.color }}>
                      {service.apdex.toFixed(2)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Progress value={service.apdex * 100} className="h-3" />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Threshold: {service.threshold}</span>
                      <span>{(service.apdex * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* SLA Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              SLA Performance
            </CardTitle>
            <CardDescription>
              Service Level Agreement metrics and compliance status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {slaMetrics.map((metric, index) => (
                <div key={metric.metric} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{metric.metric}</h4>
                    <Badge 
                      variant="outline" 
                      className={`flex items-center gap-1 ${getSLAStatusColor(metric.status)}`}
                    >
                      {getSLAStatusIcon(metric.status)}
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Current:</span>
                      <span className="font-semibold">{metric.current}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Target:</span>
                      <span className="font-semibold">{metric.target}%</span>
                    </div>
                    <Progress 
                      value={(metric.current / metric.target) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Endpoint Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Endpoint Performance
            </CardTitle>
            <CardDescription>
              Detailed performance metrics for individual API endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Endpoint</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Avg Response</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Requests</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Error Rate</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Availability</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {endpointPerformance.map((endpoint, index) => (
                    <tr key={endpoint.endpoint} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-sm">{endpoint.endpoint}</div>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {endpoint.avgResponse}ms
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {endpoint.requests.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={endpoint.errorRate < 0.5 ? "outline" : "destructive"}>
                          {endpoint.errorRate}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {endpoint.availability}%
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={endpoint.availability > 99.9 ? "default" : "secondary"}>
                          {endpoint.availability > 99.9 ? "Healthy" : "Warning"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
