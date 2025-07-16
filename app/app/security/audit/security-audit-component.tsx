
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Shield, 
  Search, 
  Filter,
  Download,
  RefreshCw,
  Calendar,
  User,
  Lock,
  Unlock,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Activity,
  Globe,
  Database
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts'

interface AuditEvent {
  id: string
  timestamp: string
  eventType: 'login' | 'logout' | 'access' | 'permission' | 'data' | 'system'
  severity: 'low' | 'medium' | 'high' | 'critical'
  user: string
  action: string
  resource: string
  ip: string
  userAgent: string
  status: 'success' | 'failed' | 'blocked'
  details: string
}

const mockAuditEvents: AuditEvent[] = [
  {
    id: '1',
    timestamp: '2024-01-07 10:30:45',
    eventType: 'login',
    severity: 'medium',
    user: 'john.martinez@wegroup.com',
    action: 'Failed login attempt',
    resource: '/auth/login',
    ip: '203.0.113.78',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    status: 'failed',
    details: 'Invalid credentials - 3rd attempt in 5 minutes'
  },
  {
    id: '2',
    timestamp: '2024-01-07 10:28:23',
    eventType: 'permission',
    severity: 'high',
    user: 'admin@wegroup.com',
    action: 'Permission granted',
    resource: 'finance.transactions.view',
    ip: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    status: 'success',
    details: 'Admin granted view access to financial transactions for user sarah.chen@wegroup.com'
  },
  {
    id: '3',
    timestamp: '2024-01-07 10:25:11',
    eventType: 'data',
    severity: 'critical',
    user: 'system',
    action: 'Data export',
    resource: 'customer_database',
    ip: '192.168.1.15',
    userAgent: 'API Client v2.1',
    status: 'success',
    details: 'Bulk customer data export (2,341 records) initiated by emma.wilson@wegroup.com'
  },
  {
    id: '4',
    timestamp: '2024-01-07 10:22:56',
    eventType: 'access',
    severity: 'medium',
    user: 'mike.johnson@wegroup.com',
    action: 'Unauthorized access attempt',
    resource: '/api/admin/users',
    ip: '203.0.113.45',
    userAgent: 'curl/7.68.0',
    status: 'blocked',
    details: 'User attempted to access admin endpoint without sufficient privileges'
  },
  {
    id: '5',
    timestamp: '2024-01-07 10:20:33',
    eventType: 'system',
    severity: 'low',
    user: 'system',
    action: 'Password policy updated',
    resource: 'security_settings',
    ip: '192.168.1.10',
    userAgent: 'Admin Panel',
    status: 'success',
    details: 'Password minimum length increased from 8 to 12 characters'
  },
  {
    id: '6',
    timestamp: '2024-01-07 10:18:17',
    eventType: 'login',
    severity: 'low',
    user: 'sarah.chen@wegroup.com',
    action: 'Successful login',
    resource: '/auth/login',
    ip: '192.168.1.25',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    status: 'success',
    details: 'User logged in successfully using two-factor authentication'
  }
]

const activityTrends = [
  { time: '10:15', logins: 23, failures: 3, permissions: 2, dataAccess: 8 },
  { time: '10:20', logins: 18, failures: 1, permissions: 1, dataAccess: 12 },
  { time: '10:25', logins: 31, failures: 5, permissions: 4, dataAccess: 15 },
  { time: '10:30', logins: 27, failures: 2, permissions: 3, dataAccess: 9 }
]

const eventTypeData = [
  { type: 'Login/Logout', count: 145, color: '#3b82f6' },
  { type: 'Data Access', count: 89, color: '#10b981' },
  { type: 'Permission Changes', count: 34, color: '#f59e0b' },
  { type: 'System Events', count: 56, color: '#ef4444' },
  { type: 'Failed Attempts', count: 23, color: '#8b5cf6' }
]

const userActivityData = [
  { user: 'admin@wegroup.com', events: 34, risk: 'low' },
  { user: 'john.martinez@wegroup.com', events: 28, risk: 'medium' },
  { user: 'sarah.chen@wegroup.com', events: 23, risk: 'low' },
  { user: 'emma.wilson@wegroup.com', events: 19, risk: 'low' },
  { user: 'mike.johnson@wegroup.com', events: 15, risk: 'high' },
  { user: 'system', events: 67, risk: 'low' }
]

const severityColors: Record<string, string> = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#dc2626'
}

const statusColors: Record<string, string> = {
  success: '#10b981',
  failed: '#ef4444',
  blocked: '#f59e0b'
}

const eventTypeIcons: Record<string, React.ElementType> = {
  login: User,
  logout: User,
  access: Globe,
  permission: Lock,
  data: Database,
  system: Activity
}

export default function SecurityAuditComponent() {
  const [events, setEvents] = useState<AuditEvent[]>(mockAuditEvents)
  const [searchTerm, setSearchTerm] = useState('')
  const [eventTypeFilter, setEventTypeFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [timeRange, setTimeRange] = useState('24h')

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.resource.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = eventTypeFilter === 'all' || event.eventType === eventTypeFilter
    const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter
    return matchesSearch && matchesType && matchesSeverity && matchesStatus
  })

  const getEventIcon = (eventType: string) => {
    const IconComponent = eventTypeIcons[eventType] || Activity
    return <IconComponent className="h-4 w-4" />
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 border-green-600'
      case 'medium': return 'text-yellow-600 border-yellow-600'
      case 'high': return 'text-red-600 border-red-600'
      default: return 'text-gray-600 border-gray-600'
    }
  }

  const totalEvents = events.length
  const criticalEvents = events.filter(e => e.severity === 'critical').length
  const failedEvents = events.filter(e => e.status === 'failed').length
  const uniqueUsers = new Set(events.map(e => e.user)).size

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
              <SelectItem value="1h">Last 1 hour</SelectItem>
              <SelectItem value="6h">Last 6 hours</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
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
            Export Report
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
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Events</p>
                  <p className="text-2xl font-bold text-blue-900">{totalEvents}</p>
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
                  <p className="text-sm font-medium text-red-600">Critical Events</p>
                  <p className="text-2xl font-bold text-red-900">{criticalEvents}</p>
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
                  <p className="text-sm font-medium text-orange-600">Failed Events</p>
                  <p className="text-2xl font-bold text-orange-900">{failedEvents}</p>
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
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Active Users</p>
                  <p className="text-2xl font-bold text-green-900">{uniqueUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Security Activity Trends
              </CardTitle>
              <CardDescription>
                Security events and authentication patterns over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityTrends}>
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
                      label={{ value: 'Events', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        fontSize: 11
                      }} 
                    />
                    <Line type="monotone" dataKey="logins" stroke="#3b82f6" strokeWidth={2} name="Logins" />
                    <Line type="monotone" dataKey="failures" stroke="#ef4444" strokeWidth={2} name="Failures" />
                    <Line type="monotone" dataKey="permissions" stroke="#f59e0b" strokeWidth={2} name="Permissions" />
                    <Line type="monotone" dataKey="dataAccess" stroke="#10b981" strokeWidth={2} name="Data Access" />
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
                <Shield className="h-5 w-5" />
                Event Type Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of security events by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={eventTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {eventTypeData.map((entry, index) => (
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
                {eventTypeData.map((item) => (
                  <div key={item.type} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.type}</span>
                    </div>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* User Activity Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Activity Summary
            </CardTitle>
            <CardDescription>
              Security event summary by user with risk assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Total Events</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Risk Level</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userActivityData.map((user, index) => (
                    <tr key={user.user} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{user.user}</div>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {user.events}
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant="outline" 
                          className={getRiskColor(user.risk)}
                        >
                          {user.risk.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search audit events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
          <SelectTrigger className="w-full sm:w-32">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="login">Login</SelectItem>
            <SelectItem value="access">Access</SelectItem>
            <SelectItem value="permission">Permission</SelectItem>
            <SelectItem value="data">Data</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-full sm:w-32">
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
          <SelectTrigger className="w-full sm:w-32">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Audit Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
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
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1"
                        style={{ color: severityColors[event.severity], borderColor: severityColors[event.severity] }}
                      >
                        {getEventIcon(event.eventType)}
                        {event.eventType.toUpperCase()}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1"
                        style={{ color: severityColors[event.severity], borderColor: severityColors[event.severity] }}
                      >
                        {event.severity.toUpperCase()}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1"
                        style={{ color: statusColors[event.status], borderColor: statusColors[event.status] }}
                      >
                        {event.status.toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{event.action}</h3>
                    <p className="text-gray-600 mb-3">{event.details}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">User</p>
                        <p className="font-medium">{event.user}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Resource</p>
                        <p className="font-medium">{event.resource}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">IP Address</p>
                        <p className="font-medium">{event.ip}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Timestamp</p>
                        <p className="font-medium">{event.timestamp}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
                
                <div className="pt-3 border-t text-xs text-gray-500">
                  <span className="font-medium">User Agent:</span> {event.userAgent}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="p-12 text-center">
          <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No audit events found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </Card>
      )}
    </div>
  )
}
