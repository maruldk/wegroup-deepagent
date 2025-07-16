
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
  Download,
  RefreshCw,
  Calendar,
  Clock,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  Zap,
  Shield,
  Activity,
  Target,
  TrendingUp,
  Bell
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts'

interface SecurityIncident {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed'
  category: 'malware' | 'phishing' | 'data_breach' | 'unauthorized_access' | 'ddos' | 'insider_threat'
  assignedTo: string
  reporter: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  impact: string
  affectedSystems: string[]
  responseTime: number // minutes
  resolutionTime?: number // hours
}

const mockIncidents: SecurityIncident[] = [
  {
    id: '1',
    title: 'Suspicious login attempts detected',
    description: 'Multiple failed login attempts from unknown IP addresses targeting admin accounts',
    severity: 'high',
    status: 'investigating',
    category: 'unauthorized_access',
    assignedTo: 'security-team@wegroup.com',
    reporter: 'system-monitor',
    createdAt: '2024-01-07 09:45:00',
    updatedAt: '2024-01-07 10:15:00',
    impact: 'Potential compromise of admin accounts',
    affectedSystems: ['Auth Service', 'Admin Panel'],
    responseTime: 15
  },
  {
    id: '2',
    title: 'Phishing email campaign detected',
    description: 'Employees received suspicious emails attempting to steal credentials',
    severity: 'medium',
    status: 'contained',
    category: 'phishing',
    assignedTo: 'john.martinez@wegroup.com',
    reporter: 'sarah.chen@wegroup.com',
    createdAt: '2024-01-07 08:30:00',
    updatedAt: '2024-01-07 09:45:00',
    impact: '15 employees potentially affected',
    affectedSystems: ['Email System', 'User Accounts'],
    responseTime: 30,
    resolutionTime: 2.5
  },
  {
    id: '3',
    title: 'Malware detected on workstation',
    description: 'Endpoint protection detected malware on employee workstation',
    severity: 'medium',
    status: 'resolved',
    category: 'malware',
    assignedTo: 'mike.johnson@wegroup.com',
    reporter: 'endpoint-protection',
    createdAt: '2024-01-06 16:20:00',
    updatedAt: '2024-01-07 09:30:00',
    resolvedAt: '2024-01-07 09:30:00',
    impact: 'One workstation compromised',
    affectedSystems: ['Employee Workstation', 'Network Segment'],
    responseTime: 10,
    resolutionTime: 17.2
  },
  {
    id: '4',
    title: 'Data exfiltration attempt blocked',
    description: 'Unusual data transfer patterns detected and blocked by DLP system',
    severity: 'critical',
    status: 'open',
    category: 'data_breach',
    assignedTo: 'security-team@wegroup.com',
    reporter: 'dlp-system',
    createdAt: '2024-01-07 11:15:00',
    updatedAt: '2024-01-07 11:15:00',
    impact: 'Attempted unauthorized data access',
    affectedSystems: ['Database', 'File Server', 'DLP System'],
    responseTime: 5
  },
  {
    id: '5',
    title: 'DDoS attack mitigated',
    description: 'Distributed denial of service attack detected and mitigated',
    severity: 'high',
    status: 'closed',
    category: 'ddos',
    assignedTo: 'network-team@wegroup.com',
    reporter: 'waf-system',
    createdAt: '2024-01-06 14:00:00',
    updatedAt: '2024-01-06 18:30:00',
    resolvedAt: '2024-01-06 18:30:00',
    impact: 'Temporary service degradation',
    affectedSystems: ['Web Application', 'Load Balancer', 'CDN'],
    responseTime: 8,
    resolutionTime: 4.5
  },
  {
    id: '6',
    title: 'Unauthorized file access detected',
    description: 'Employee accessed files outside their authorized scope',
    severity: 'low',
    status: 'investigating',
    category: 'insider_threat',
    assignedTo: 'hr-security@wegroup.com',
    reporter: 'file-access-monitor',
    createdAt: '2024-01-07 10:00:00',
    updatedAt: '2024-01-07 10:30:00',
    impact: 'Potential policy violation',
    affectedSystems: ['File Server', 'Access Control'],
    responseTime: 20
  }
]

const incidentTrends = [
  { week: 'Week 1', open: 8, resolved: 12, critical: 2 },
  { week: 'Week 2', open: 6, resolved: 10, critical: 1 },
  { week: 'Week 3', open: 11, resolved: 8, critical: 3 },
  { week: 'Week 4', open: 9, resolved: 15, critical: 2 }
]

const severityData = [
  { severity: 'Critical', count: 8, color: '#dc2626' },
  { severity: 'High', count: 15, color: '#ea580c' },
  { severity: 'Medium', count: 23, color: '#ca8a04' },
  { severity: 'Low', count: 12, color: '#65a30d' }
]

const categoryData = [
  { category: 'Unauthorized Access', count: 18, color: '#3b82f6' },
  { category: 'Phishing', count: 12, color: '#10b981' },
  { category: 'Malware', count: 15, color: '#f59e0b' },
  { category: 'Data Breach', count: 6, color: '#ef4444' },
  { category: 'DDoS', count: 4, color: '#8b5cf6' },
  { category: 'Insider Threat', count: 3, color: '#06b6d4' }
]

const responseMetrics = [
  { metric: 'Mean Time to Response', value: '18', unit: 'minutes', trend: 'down' },
  { metric: 'Mean Time to Resolution', value: '8.4', unit: 'hours', trend: 'down' },
  { metric: 'First Response SLA', value: '94.2', unit: '%', trend: 'up' },
  { metric: 'Resolution SLA', value: '89.7', unit: '%', trend: 'up' }
]

const severityColors: Record<string, string> = {
  low: '#65a30d',
  medium: '#ca8a04',
  high: '#ea580c',
  critical: '#dc2626'
}

const statusColors: Record<string, string> = {
  open: '#dc2626',
  investigating: '#ca8a04',
  contained: '#3b82f6',
  resolved: '#16a34a',
  closed: '#6b7280'
}

const categoryIcons: Record<string, React.ElementType> = {
  malware: Shield,
  phishing: Bell,
  data_breach: AlertTriangle,
  unauthorized_access: Users,
  ddos: Activity,
  insider_threat: Eye
}

export default function SecurityIncidentsComponent() {
  const [incidents, setIncidents] = useState<SecurityIncident[]>(mockIncidents)
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || incident.category === categoryFilter
    return matchesSearch && matchesSeverity && matchesStatus && matchesCategory
  })

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category] || AlertTriangle
    return <IconComponent className="h-4 w-4" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="h-4 w-4" />
      case 'investigating': return <Eye className="h-4 w-4" />
      case 'contained': return <Shield className="h-4 w-4" />
      case 'resolved': return <CheckCircle className="h-4 w-4" />
      case 'closed': return <XCircle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />
  }

  const totalIncidents = incidents.length
  const openIncidents = incidents.filter(i => i.status === 'open' || i.status === 'investigating').length
  const criticalIncidents = incidents.filter(i => i.severity === 'critical').length
  const avgResponseTime = incidents.reduce((sum, i) => sum + i.responseTime, 0) / incidents.length

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-4">
          <Button className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            Report Incident
          </Button>
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
                  <p className="text-sm font-medium text-blue-600">Total Incidents</p>
                  <p className="text-2xl font-bold text-blue-900">{totalIncidents}</p>
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
                  <p className="text-sm font-medium text-red-600">Open Incidents</p>
                  <p className="text-2xl font-bold text-red-900">{openIncidents}</p>
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
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-600">Critical</p>
                  <p className="text-2xl font-bold text-orange-900">{criticalIncidents}</p>
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
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Avg Response</p>
                  <p className="text-2xl font-bold text-green-900">{avgResponseTime.toFixed(0)}m</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Response Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {responseMetrics.map((metric, index) => (
          <motion.div
            key={metric.metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{metric.metric}</p>
                    <p className="text-2xl font-bold">{metric.value}{metric.unit}</p>
                  </div>
                  {getTrendIcon(metric.trend)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Incident Trends
              </CardTitle>
              <CardDescription>
                Weekly incident volume and resolution patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={incidentTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="week" 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Week', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
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
                    <Line type="monotone" dataKey="open" stroke="#dc2626" strokeWidth={2} name="Opened" />
                    <Line type="monotone" dataKey="resolved" stroke="#16a34a" strokeWidth={2} name="Resolved" />
                    <Line type="monotone" dataKey="critical" stroke="#ea580c" strokeWidth={2} name="Critical" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Severity Distribution
              </CardTitle>
              <CardDescription>
                Current incidents by severity level
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
                  <div key={item.severity} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.severity}</span>
                    </div>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Incident Categories
              </CardTitle>
              <CardDescription>
                Breakdown by threat type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="category" 
                      tickLine={false}
                      tick={{ fontSize: 9 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      label={{ value: 'Category', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: 11 } }}
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
                    <Bar dataKey="count" name="Incidents">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
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
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="investigating">Investigating</SelectItem>
            <SelectItem value="contained">Contained</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="malware">Malware</SelectItem>
            <SelectItem value="phishing">Phishing</SelectItem>
            <SelectItem value="data_breach">Data Breach</SelectItem>
            <SelectItem value="unauthorized_access">Unauthorized Access</SelectItem>
            <SelectItem value="ddos">DDoS</SelectItem>
            <SelectItem value="insider_threat">Insider Threat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident, index) => (
          <motion.div
            key={incident.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + index * 0.05 }}
            whileHover={{ scale: 1.01 }}
          >
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">#{incident.id} {incident.title}</h3>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1"
                        style={{ color: severityColors[incident.severity], borderColor: severityColors[incident.severity] }}
                      >
                        {incident.severity.toUpperCase()}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1"
                        style={{ color: statusColors[incident.status], borderColor: statusColors[incident.status] }}
                      >
                        {getStatusIcon(incident.status)}
                        {incident.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1"
                      >
                        {getCategoryIcon(incident.category)}
                        {incident.category.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{incident.description}</p>
                    <p className="text-sm text-gray-700 mb-3">
                      <strong>Impact:</strong> {incident.impact}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {incident.affectedSystems.map((system) => (
                        <Badge key={system} variant="secondary" className="text-xs">
                          {system}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    {(incident.status === 'open' || incident.status === 'investigating') && (
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Update
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Assigned To</p>
                    <p className="font-medium">{incident.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Reporter</p>
                    <p className="font-medium">{incident.reporter}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Response Time</p>
                    <p className="font-medium">{incident.responseTime} min</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Created</p>
                    <p className="font-medium">{new Date(incident.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Resolution Time</p>
                    <p className="font-medium">{incident.resolutionTime ? `${incident.resolutionTime}h` : 'Pending'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredIncidents.length === 0 && (
        <Card className="p-12 text-center">
          <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No incidents found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Report New Incident
          </Button>
        </Card>
      )}
    </div>
  )
}
