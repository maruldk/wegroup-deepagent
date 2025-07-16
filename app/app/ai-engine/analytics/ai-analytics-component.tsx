
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
  Activity,
  Zap,
  Clock,
  DollarSign,
  Target,
  Cpu,
  Download,
  RefreshCw,
  Calendar,
  Users,
  Gauge
} from 'lucide-react'
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
  Cell,
  AreaChart,
  Area,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

const performanceData = [
  { date: '2024-01-01', accuracy: 91.2, latency: 145, requests: 2341, cost: 234.56, revenue: 4567.89 },
  { date: '2024-01-02', accuracy: 92.8, latency: 132, requests: 2587, cost: 267.43, revenue: 5123.45 },
  { date: '2024-01-03', accuracy: 94.1, latency: 128, requests: 2834, cost: 289.12, revenue: 5689.23 },
  { date: '2024-01-04', accuracy: 93.7, latency: 134, requests: 2956, cost: 312.78, revenue: 5934.67 },
  { date: '2024-01-05', accuracy: 95.3, latency: 119, requests: 3142, cost: 334.89, revenue: 6287.34 },
  { date: '2024-01-06', accuracy: 94.9, latency: 123, requests: 3287, cost: 356.23, revenue: 6598.12 },
  { date: '2024-01-07', accuracy: 96.2, latency: 115, requests: 3456, cost: 378.45, revenue: 6912.89 }
]

const modelComparison = [
  { model: 'LogisticsOptimizer', accuracy: 94.7, usage: 8420, efficiency: 91.2, roi: 385 },
  { model: 'DemandForecaster', accuracy: 91.3, usage: 5630, efficiency: 88.7, roi: 267 },
  { model: 'FraudDetector', accuracy: 96.8, usage: 12340, efficiency: 94.5, roi: 512 },
  { model: 'ContentGenerator', accuracy: 89.1, usage: 3210, efficiency: 85.3, roi: 189 },
  { model: 'CustomerSegmentor', accuracy: 88.4, usage: 1850, efficiency: 82.1, roi: 134 }
]

const usageByModule = [
  { name: 'Logistics', requests: 15420, color: '#3b82f6' },
  { name: 'Finance', requests: 12340, color: '#10b981' },
  { name: 'Security', requests: 8760, color: '#ef4444' },
  { name: 'WeSell', requests: 6890, color: '#f59e0b' },
  { name: 'WeCreate', requests: 4230, color: '#8b5cf6' },
  { name: 'HR', requests: 2150, color: '#06b6d4' }
]

const costBreakdown = [
  { category: 'Compute', amount: 1245.67, percentage: 42.3, color: '#3b82f6' },
  { category: 'Storage', amount: 567.89, percentage: 19.3, color: '#10b981' },
  { category: 'API Calls', amount: 892.34, percentage: 30.4, color: '#f59e0b' },
  { category: 'Training', amount: 234.56, percentage: 8.0, color: '#ef4444' }
]

const radarData = [
  { metric: 'Accuracy', value: 94.2, fullMark: 100 },
  { metric: 'Speed', value: 87.5, fullMark: 100 },
  { metric: 'Efficiency', value: 91.8, fullMark: 100 },
  { metric: 'Reliability', value: 96.3, fullMark: 100 },
  { metric: 'Scalability', value: 89.7, fullMark: 100 },
  { metric: 'Cost Effectiveness', value: 85.4, fullMark: 100 }
]

export default function AIAnalyticsComponent() {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('all')

  const totalRequests = usageByModule.reduce((sum, module) => sum + module.requests, 0)
  const totalCost = costBreakdown.reduce((sum, item) => sum + item.amount, 0)
  const totalRevenue = performanceData.reduce((sum, item) => sum + item.revenue, 0)
  const avgAccuracy = performanceData.reduce((sum, item) => sum + item.accuracy, 0) / performanceData.length
  const avgLatency = performanceData.reduce((sum, item) => sum + item.latency, 0) / performanceData.length

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
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-40">
              <BarChart3 className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Metrics</SelectItem>
              <SelectItem value="accuracy">Accuracy</SelectItem>
              <SelectItem value="latency">Latency</SelectItem>
              <SelectItem value="usage">Usage</SelectItem>
              <SelectItem value="cost">Cost</SelectItem>
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Requests</p>
                  <p className="text-2xl font-bold text-blue-900">{totalRequests.toLocaleString()}</p>
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
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Avg Accuracy</p>
                  <p className="text-2xl font-bold text-green-900">{avgAccuracy.toFixed(1)}%</p>
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
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-600">Avg Latency</p>
                  <p className="text-2xl font-bold text-orange-900">{avgLatency.toFixed(0)}ms</p>
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
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-500 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600">Total Cost</p>
                  <p className="text-2xl font-bold text-red-900">${totalCost.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600">ROI</p>
                  <p className="text-2xl font-bold text-purple-900">{((totalRevenue / totalCost - 1) * 100).toFixed(0)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="xl:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Trends
              </CardTitle>
              <CardDescription>
                AI model performance metrics over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      label={{ value: 'Date', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <YAxis 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Value', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        fontSize: 11
                      }} 
                    />
                    <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2} name="Accuracy %" />
                    <Line type="monotone" dataKey="latency" stroke="#ef4444" strokeWidth={2} name="Latency (ms)" />
                    <Line type="monotone" dataKey="requests" stroke="#10b981" strokeWidth={2} name="Requests" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Overall Performance
              </CardTitle>
              <CardDescription>
                Multi-dimensional performance radar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fontSize: 10 }}
                    />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        fontSize: 11
                      }} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usage by Module
              </CardTitle>
              <CardDescription>
                Request distribution across platform modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageByModule}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Module', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
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
                    <Bar dataKey="requests" name="Requests">
                      {usageByModule.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Cost Breakdown
              </CardTitle>
              <CardDescription>
                AI infrastructure cost distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="amount"
                    >
                      {costBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        fontSize: 11
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {costBreakdown.map((item) => (
                  <div key={item.category} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">${item.amount.toFixed(2)}</span>
                      <span className="text-gray-500 ml-2">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Model Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Model Performance Comparison
            </CardTitle>
            <CardDescription>
              Detailed performance metrics for each AI model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Model</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Accuracy</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Daily Usage</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Efficiency</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">ROI</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {modelComparison.map((model, index) => (
                    <tr key={model.model} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{model.model}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${model.accuracy}%` }}
                            />
                          </div>
                          <span className="font-medium">{model.accuracy}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {model.usage.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${model.efficiency}%` }}
                            />
                          </div>
                          <span className="font-medium">{model.efficiency}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {model.roi}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Active
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
