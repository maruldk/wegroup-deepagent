
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  Clock,
  Zap,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  Calendar
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const apiUsageData = [
  { name: '00:00', requests: 450, latency: 120, errors: 5 },
  { name: '04:00', requests: 280, latency: 95, errors: 2 },
  { name: '08:00', requests: 1250, latency: 145, errors: 15 },
  { name: '12:00', requests: 2100, latency: 180, errors: 25 },
  { name: '16:00', requests: 1890, latency: 165, errors: 18 },
  { name: '20:00', requests: 950, latency: 125, errors: 8 }
]

const endpointUsageData = [
  { name: '/api/logistics/tracking', value: 35, requests: 15420, color: '#60B5FF' },
  { name: '/api/ai-engine/predictions', value: 28, requests: 12340, color: '#FF9149' },
  { name: '/api/finance/transactions', value: 20, requests: 8750, color: '#FF9898' },
  { name: '/api/hr/employees', value: 10, requests: 4320, color: '#80D8C3' },
  { name: '/api/wesell/customers', value: 7, requests: 2890, color: '#A19AD3' }
]

const responseTimeData = [
  { name: 'Jan', p50: 120, p95: 280, p99: 450 },
  { name: 'Feb', p50: 115, p95: 265, p99: 420 },
  { name: 'Mar', p50: 125, p95: 290, p99: 480 },
  { name: 'Apr', p50: 118, p95: 275, p99: 440 },
  { name: 'May', p50: 122, p95: 285, p99: 465 },
  { name: 'Jun', p50: 119, p95: 270, p99: 430 }
]

const statusCodeData = [
  { name: '2xx Success', value: 95.8, color: '#22c55e' },
  { name: '4xx Client Error', value: 3.2, color: '#f59e0b' },
  { name: '5xx Server Error', value: 1.0, color: '#ef4444' }
]

export default function APIAnalyticsComponent() {
  const [timeRange, setTimeRange] = useState('24h')
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const totalRequests = apiUsageData.reduce((sum, item) => sum + item.requests, 0)
  const avgLatency = Math.round(apiUsageData.reduce((sum, item) => sum + item.latency, 0) / apiUsageData.length)
  const totalErrors = apiUsageData.reduce((sum, item) => sum + item.errors, 0)
  const errorRate = ((totalErrors / totalRequests) * 100).toFixed(2)

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-blue-600">{totalRequests.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">↗ +12.5% vs yesterday</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Latency</p>
                  <p className="text-2xl font-bold text-orange-600">{avgLatency}ms</p>
                  <p className="text-xs text-green-600 mt-1">↗ -5.2% vs yesterday</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Error Rate</p>
                  <p className="text-2xl font-bold text-red-600">{errorRate}%</p>
                  <p className="text-xs text-red-600 mt-1">↗ +0.3% vs yesterday</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">98.8%</p>
                  <p className="text-xs text-green-600 mt-1">↗ +0.2% vs yesterday</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Usage Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                API Usage Over Time
              </CardTitle>
              <CardDescription>Requests and latency patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={apiUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                  />
                  <YAxis 
                    yAxisId="requests"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    label={{ value: 'Requests', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                  />
                  <YAxis 
                    yAxisId="latency"
                    orientation="right"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    label={{ value: 'Latency (ms)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fontSize: 11 } }}
                  />
                  <Tooltip />
                  <Area yAxisId="requests" type="monotone" dataKey="requests" stroke="#60B5FF" fill="#60B5FF" fillOpacity={0.3} />
                  <Line yAxisId="latency" type="monotone" dataKey="latency" stroke="#FF9149" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Top API Endpoints
              </CardTitle>
              <CardDescription>Most frequently used endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={endpointUsageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {endpointUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value}% (${props.payload.requests} requests)`,
                      'Usage'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Response Time Percentiles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Response Time Percentiles
              </CardTitle>
              <CardDescription>Performance distribution over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                  />
                  <Tooltip />
                  <Legend 
                    verticalAlign="top"
                    wrapperStyle={{ fontSize: 11 }}
                  />
                  <Line type="monotone" dataKey="p50" stroke="#22c55e" strokeWidth={2} name="P50" />
                  <Line type="monotone" dataKey="p95" stroke="#f59e0b" strokeWidth={2} name="P95" />
                  <Line type="monotone" dataKey="p99" stroke="#ef4444" strokeWidth={2} name="P99" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Code Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                HTTP Status Distribution
              </CardTitle>
              <CardDescription>Response status code breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusCodeData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    label={{ value: 'Percentage (%)', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                  />
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Bar dataKey="value">
                    {statusCodeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* API Endpoints Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>API Endpoint Performance</CardTitle>
            <CardDescription>Detailed performance metrics for each endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {endpointUsageData.map((endpoint, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {endpoint.name}
                    </code>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>{endpoint.requests.toLocaleString()} requests</span>
                      <span>{endpoint.value}% of total traffic</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-green-100 text-green-800">
                      98.{Math.floor(Math.random() * 9)}% success
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {120 + Math.floor(Math.random() * 100)}ms avg
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
