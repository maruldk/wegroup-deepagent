
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Settings,
  Eye,
  TrendingUp,
  Users,
  Mail,
  MessageSquare,
  Phone
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts'

interface Alert {
  id: string
  name: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'resolved' | 'acknowledged' | 'silenced'
  metric: string
  threshold: number
  currentValue: number
  triggered: string
  lastNotified: string
  acknowledgedBy?: string
  escalationLevel: number
  notificationChannels: string[]
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    name: 'High CPU Usage',
    description: 'CPU usage exceeded 85% for more than 5 minutes',
    severity: 'high',
    status: 'active',
    metric: 'cpu_usage_percent',
    threshold: 85,
    currentValue: 92.4,
    triggered: '3 minutes ago',
    lastNotified: '1 minute ago',
    escalationLevel: 1,
    notificationChannels: ['email', 'slack', 'pagerduty']
  },
  {
    id: '2',
    name: 'Database Connection Pool Full',
    description: 'All database connections are in use',
    severity: 'critical',
    status: 'acknowledged',
    metric: 'db_connections_used',
    threshold: 95,
    currentValue: 100,
    triggered: '12 minutes ago',
    lastNotified: '5 minutes ago',
    acknowledgedBy: 'John Martinez',
    escalationLevel: 2,
    notificationChannels: ['email', 'slack', 'sms', 'pagerduty']
  },
  {
    id: '3',
    name: 'Disk Space Warning',
    description: 'Root filesystem usage above 80%',
    severity: 'medium',
    status: 'active',
    metric: 'disk_usage_percent',
    threshold: 80,
    currentValue: 83.7,
    triggered: '25 minutes ago',
    lastNotified: '20 minutes ago',
    escalationLevel: 0,
    notificationChannels: ['email', 'slack']
  },
  {
    id: '4',
    name: 'API Response Time High',
    description: 'Average API response time exceeded 500ms',
    severity: 'medium',
    status: 'resolved',
    metric: 'api_response_time_ms',
    threshold: 500,
    currentValue: 234,
    triggered: '1 hour ago',
    lastNotified: '45 minutes ago',
    escalationLevel: 0,
    notificationChannels: ['email']
  },
  {
    id: '5',
    name: 'Memory Usage Critical',
    description: 'Available memory below 10%',
    severity: 'critical',
    status: 'silenced',
    metric: 'memory_available_percent',
    threshold: 10,
    currentValue: 7.2,
    triggered: '2 hours ago',
    lastNotified: '1 hour ago',
    escalationLevel: 3,
    notificationChannels: ['email', 'slack', 'sms', 'pagerduty']
  },
  {
    id: '6',
    name: 'Failed Login Attempts',
    description: 'Suspicious login activity detected',
    severity: 'high',
    status: 'active',
    metric: 'failed_logins_per_minute',
    threshold: 10,
    currentValue: 24,
    triggered: '8 minutes ago',
    lastNotified: '3 minutes ago',
    escalationLevel: 1,
    notificationChannels: ['email', 'slack', 'security-team']
  }
]

const alertTrends = [
  { time: '00:00', triggered: 3, resolved: 5, acknowledged: 2 },
  { time: '04:00', triggered: 1, resolved: 3, acknowledged: 1 },
  { time: '08:00', triggered: 7, resolved: 4, acknowledged: 3 },
  { time: '12:00', triggered: 5, resolved: 8, acknowledged: 2 },
  { time: '16:00', triggered: 9, resolved: 6, acknowledged: 4 },
  { time: '20:00', triggered: 4, resolved: 7, acknowledged: 1 }
]

const severityData = [
  { name: 'Critical', count: 2, color: '#dc2626' },
  { name: 'High', count: 3, color: '#ea580c' },
  { name: 'Medium', count: 8, color: '#ca8a04' },
  { name: 'Low', count: 5, color: '#65a30d' }
]

const notificationChannels = [
  { name: 'Email', type: 'email', enabled: true, icon: Mail },
  { name: 'Slack', type: 'slack', enabled: true, icon: MessageSquare },
  { name: 'SMS', type: 'sms', enabled: true, icon: Phone },
  { name: 'PagerDuty', type: 'pagerduty', enabled: false, icon: Bell }
]

const severityColors: Record<string, string> = {
  low: '#65a30d',
  medium: '#ca8a04',
  high: '#ea580c',
  critical: '#dc2626'
}

const statusColors: Record<string, string> = {
  active: '#dc2626',
  acknowledged: '#ca8a04',
  resolved: '#16a34a',
  silenced: '#6b7280'
}

export default function AlertManagementComponent() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter
    return matchesSearch && matchesSeverity && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle className="h-4 w-4" />
      case 'acknowledged': return <Clock className="h-4 w-4" />
      case 'resolved': return <CheckCircle className="h-4 w-4" />
      case 'silenced': return <Pause className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-3 w-3" />
      case 'slack': return <MessageSquare className="h-3 w-3" />
      case 'sms': return <Phone className="h-3 w-3" />
      case 'pagerduty': return <Bell className="h-3 w-3" />
      default: return <Bell className="h-3 w-3" />
    }
  }

  const totalAlerts = alerts.length
  const activeAlerts = alerts.filter(a => a.status === 'active').length
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length
  const resolvedToday = alerts.filter(a => a.status === 'resolved').length

  return (
    <div className="space-y-6">
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
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Alerts</p>
                  <p className="text-2xl font-bold text-blue-900">{totalAlerts}</p>
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
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-500 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600">Active</p>
                  <p className="text-2xl font-bold text-red-900">{activeAlerts}</p>
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
                  <XCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-600">Critical</p>
                  <p className="text-2xl font-bold text-orange-900">{criticalAlerts}</p>
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
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Resolved Today</p>
                  <p className="text-2xl font-bold text-green-900">{resolvedToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Alert Trends
              </CardTitle>
              <CardDescription>
                Alert activity over the last 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={alertTrends}>
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
                      label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        fontSize: 11
                      }} 
                    />
                    <Line type="monotone" dataKey="triggered" stroke="#dc2626" strokeWidth={2} name="Triggered" />
                    <Line type="monotone" dataKey="acknowledged" stroke="#ca8a04" strokeWidth={2} name="Acknowledged" />
                    <Line type="monotone" dataKey="resolved" stroke="#16a34a" strokeWidth={2} name="Resolved" />
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
                <AlertTriangle className="h-5 w-5" />
                Severity Distribution
              </CardTitle>
              <CardDescription>
                Current alerts by severity level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {severityData.map((entry, index) => (
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
                {severityData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Notification Channels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Notification Channels
            </CardTitle>
            <CardDescription>
              Configure alert notification channels and escalation policies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {notificationChannels.map((channel) => (
                <div key={channel.type} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <channel.icon className="h-5 w-5" />
                      <span className="font-medium">{channel.name}</span>
                    </div>
                    <Badge variant={channel.enabled ? "default" : "secondary"}>
                      {channel.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="acknowledged">Acknowledged</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="silenced">Silenced</SelectItem>
          </SelectContent>
        </Select>
        <Button className="whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.05 }}
            whileHover={{ scale: 1.01 }}
          >
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{alert.name}</h3>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1"
                        style={{ color: severityColors[alert.severity], borderColor: severityColors[alert.severity] }}
                      >
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1"
                        style={{ color: statusColors[alert.status], borderColor: statusColors[alert.status] }}
                      >
                        {getStatusIcon(alert.status)}
                        {alert.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{alert.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {alert.notificationChannels.map((channel) => (
                        <Badge key={channel} variant="secondary" className="flex items-center gap-1 text-xs">
                          {getChannelIcon(channel)}
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    {alert.status === 'active' && (
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Acknowledge
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Current Value</p>
                    <p className="font-medium">{alert.currentValue}{alert.metric.includes('percent') ? '%' : alert.metric.includes('ms') ? 'ms' : ''}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Threshold</p>
                    <p className="font-medium">{alert.threshold}{alert.metric.includes('percent') ? '%' : alert.metric.includes('ms') ? 'ms' : ''}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Triggered</p>
                    <p className="font-medium">{alert.triggered}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Last Notified</p>
                    <p className="font-medium">{alert.lastNotified}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Escalation Level</p>
                    <p className="font-medium">Level {alert.escalationLevel}</p>
                  </div>
                </div>

                {alert.acknowledgedBy && (
                  <div className="mt-3 pt-3 border-t text-sm">
                    <span className="text-gray-500">Acknowledged by: </span>
                    <span className="font-medium">{alert.acknowledgedBy}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <Card className="p-12 text-center">
          <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Alert
          </Button>
        </Card>
      )}
    </div>
  )
}
