
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  Cpu, 
  MemoryStick,
  HardDrive,
  Network,
  Activity,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Calendar,
  Server,
  Database,
  Globe,
  Zap,
  AlertTriangle,
  CheckCircle
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

const cpuData = [
  { time: '00:00', usage: 45.2, load: 1.2 },
  { time: '00:05', usage: 52.8, load: 1.5 },
  { time: '00:10', usage: 38.1, load: 0.9 },
  { time: '00:15', usage: 61.7, load: 1.8 },
  { time: '00:20', usage: 47.3, load: 1.3 },
  { time: '00:25', usage: 55.9, load: 1.6 },
  { time: '00:30', usage: 42.4, load: 1.1 }
]

const memoryData = [
  { time: '00:00', used: 6.2, available: 9.8, cached: 2.1 },
  { time: '00:05', used: 6.8, available: 9.2, cached: 2.3 },
  { time: '00:10', used: 7.1, available: 8.9, cached: 2.4 },
  { time: '00:15', used: 7.5, available: 8.5, cached: 2.6 },
  { time: '00:20', used: 7.2, available: 8.8, cached: 2.5 },
  { time: '00:25', used: 6.9, available: 9.1, cached: 2.2 },
  { time: '00:30', used: 6.5, available: 9.5, cached: 2.0 }
]

const networkData = [
  { time: '00:00', inbound: 124.5, outbound: 89.3 },
  { time: '00:05', inbound: 156.8, outbound: 103.7 },
  { time: '00:10', inbound: 98.2, outbound: 67.4 },
  { time: '00:15', inbound: 189.4, outbound: 134.8 },
  { time: '00:20', inbound: 145.6, outbound: 98.2 },
  { time: '00:25', inbound: 167.3, outbound: 112.9 },
  { time: '00:30', inbound: 134.7, outbound: 87.6 }
]

const diskData = [
  { name: '/root', used: 45.2, available: 54.8, color: '#3b82f6' },
  { name: '/var', used: 67.8, available: 32.2, color: '#ef4444' },
  { name: '/home', used: 23.4, available: 76.6, color: '#10b981' },
  { name: '/tmp', used: 12.1, available: 87.9, color: '#f59e0b' }
]

const serviceStatus = [
  { name: 'API Gateway', status: 'healthy', uptime: '99.98%', response: '45ms' },
  { name: 'Database', status: 'healthy', uptime: '99.95%', response: '12ms' },
  { name: 'Redis Cache', status: 'healthy', uptime: '99.99%', response: '3ms' },
  { name: 'File Storage', status: 'warning', uptime: '99.87%', response: '234ms' },
  { name: 'Message Queue', status: 'healthy', uptime: '99.92%', response: '18ms' },
  { name: 'Load Balancer', status: 'healthy', uptime: '99.96%', response: '8ms' }
]

const infraMetrics = [
  { metric: 'Total Servers', value: '24', trend: 'stable', icon: Server },
  { metric: 'Active Connections', value: '1,247', trend: 'up', icon: Network },
  { metric: 'Database Queries/sec', value: '3,456', trend: 'up', icon: Database },
  { metric: 'Cache Hit Rate', value: '94.7%', trend: 'up', icon: Zap }
]

export default function SystemMetricsComponent() {
  const [timeRange, setTimeRange] = useState('1h')
  const [refreshInterval, setRefreshInterval] = useState('30s')
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      // Simulate real-time data updates
      console.log('Refreshing metrics...')
    }, 30000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 border-green-600'
      case 'warning': return 'text-yellow-600 border-yellow-600'
      case 'critical': return 'text-red-600 border-red-600'
      default: return 'text-gray-600 border-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'critical': return <AlertTriangle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

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
              <SelectItem value="5m">Last 5 min</SelectItem>
              <SelectItem value="15m">Last 15 min</SelectItem>
              <SelectItem value="1h">Last 1 hour</SelectItem>
              <SelectItem value="6h">Last 6 hours</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
            </SelectContent>
          </Select>
          <Select value={refreshInterval} onValueChange={setRefreshInterval}>
            <SelectTrigger className="w-32">
              <RefreshCw className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10s">10 seconds</SelectItem>
              <SelectItem value="30s">30 seconds</SelectItem>
              <SelectItem value="1m">1 minute</SelectItem>
              <SelectItem value="5m">5 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={autoRefresh ? "default" : "outline"} 
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Auto Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Infrastructure Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {infraMetrics.map((metric, index) => (
          <motion.div
            key={metric.metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <metric.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.metric}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                  </div>
                  {getTrendIcon(metric.trend)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* CPU and Memory Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                CPU Usage
              </CardTitle>
              <CardDescription>
                Real-time CPU utilization and load average
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cpuData}>
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
                      label={{ value: 'Usage %', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
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
                      dataKey="usage" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3}
                      name="CPU Usage %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-between text-sm">
                <div>
                  <span className="text-gray-500">Current: </span>
                  <span className="font-semibold">42.4%</span>
                </div>
                <div>
                  <span className="text-gray-500">Average: </span>
                  <span className="font-semibold">49.1%</span>
                </div>
                <div>
                  <span className="text-gray-500">Peak: </span>
                  <span className="font-semibold">61.7%</span>
                </div>
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
                <MemoryStick className="h-5 w-5" />
                Memory Usage
              </CardTitle>
              <CardDescription>
                RAM utilization, available memory, and cache
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={memoryData}>
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
                      label={{ value: 'Memory (GB)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        fontSize: 11
                      }} 
                    />
                    <Line type="monotone" dataKey="used" stroke="#ef4444" strokeWidth={2} name="Used (GB)" />
                    <Line type="monotone" dataKey="available" stroke="#10b981" strokeWidth={2} name="Available (GB)" />
                    <Line type="monotone" dataKey="cached" stroke="#f59e0b" strokeWidth={2} name="Cached (GB)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Used: </span>
                  <span className="font-semibold text-red-600">6.5 GB</span>
                </div>
                <div>
                  <span className="text-gray-500">Available: </span>
                  <span className="font-semibold text-green-600">9.5 GB</span>
                </div>
                <div>
                  <span className="text-gray-500">Cached: </span>
                  <span className="font-semibold text-yellow-600">2.0 GB</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Network and Disk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Network Traffic
              </CardTitle>
              <CardDescription>
                Inbound and outbound network throughput
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={networkData}>
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
                      label={{ value: 'Mbps', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
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
                      dataKey="inbound" 
                      stackId="1"
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                      name="Inbound (Mbps)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="outbound" 
                      stackId="1"
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                      name="Outbound (Mbps)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Disk Usage
              </CardTitle>
              <CardDescription>
                Filesystem usage across all mounted volumes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {diskData.map((disk, index) => (
                  <div key={disk.name} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">{disk.name}</span>
                      <span className="text-gray-500">{disk.used.toFixed(1)}% used</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-300" 
                        style={{ 
                          width: `${disk.used}%`, 
                          backgroundColor: disk.color 
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Used: {disk.used.toFixed(1)}%</span>
                      <span>Available: {disk.available.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Disk I/O</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Read IOPS: </span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Write IOPS: </span>
                    <span className="font-semibold">893</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Read MB/s: </span>
                    <span className="font-semibold">45.2</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Write MB/s: </span>
                    <span className="font-semibold">23.7</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Service Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Service Status
            </CardTitle>
            <CardDescription>
              Health status and performance metrics for core services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceStatus.map((service, index) => (
                <div key={service.name} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{service.name}</h4>
                    <Badge 
                      variant="outline" 
                      className={`flex items-center gap-1 ${getStatusColor(service.status)}`}
                    >
                      {getStatusIcon(service.status)}
                      {service.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Uptime:</span>
                      <span className="font-medium">{service.uptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response:</span>
                      <span className="font-medium">{service.response}</span>
                    </div>
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
