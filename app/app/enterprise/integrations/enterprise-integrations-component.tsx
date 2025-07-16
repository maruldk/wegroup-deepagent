
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  Puzzle, 
  Plus, 
  Search, 
  Filter,
  Settings,
  RefreshCw,
  Calendar,
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Activity,
  TrendingUp,
  Globe,
  Database,
  Webhook,
  Eye,
  Edit,
  Play,
  Pause,
  RotateCw
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts'

interface Integration {
  id: string
  name: string
  description: string
  type: 'api' | 'webhook' | 'database' | 'file_sync' | 'messaging'
  status: 'active' | 'inactive' | 'error' | 'pending'
  tenantName: string
  provider: string
  lastSync: string
  syncFrequency: string
  recordsSync: number
  successRate: number
  avgLatency: number
  dataFlow: 'inbound' | 'outbound' | 'bidirectional'
  configuredBy: string
  createdAt: string
}

interface Webhook {
  id: string
  name: string
  url: string
  events: string[]
  status: 'active' | 'inactive' | 'failed'
  tenantName: string
  lastTrigger: string
  totalDeliveries: number
  successfulDeliveries: number
  avgResponseTime: number
  retryCount: number
}

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Salesforce CRM Sync',
    description: 'Bidirectional sync of customer data and opportunities',
    type: 'api',
    status: 'active',
    tenantName: 'Acme Corporation',
    provider: 'Salesforce',
    lastSync: '2024-01-07 10:30:00',
    syncFrequency: 'Every 15 minutes',
    recordsSync: 15420,
    successRate: 98.7,
    avgLatency: 245,
    dataFlow: 'bidirectional',
    configuredBy: 'john.smith@acme.com',
    createdAt: '2023-08-15'
  },
  {
    id: '2',
    name: 'SAP ERP Integration',
    description: 'Real-time inventory and order management sync',
    type: 'api',
    status: 'active',
    tenantName: 'Global Logistics Ltd',
    provider: 'SAP',
    lastSync: '2024-01-07 10:25:00',
    syncFrequency: 'Real-time',
    recordsSync: 45670,
    successRate: 94.2,
    avgLatency: 567,
    dataFlow: 'inbound',
    configuredBy: 'mike.chen@globallogistics.com',
    createdAt: '2023-05-20'
  },
  {
    id: '3',
    name: 'Shopify Store Connection',
    description: 'E-commerce order and product data synchronization',
    type: 'webhook',
    status: 'active',
    tenantName: 'RetailChain Plus',
    provider: 'Shopify',
    lastSync: '2024-01-07 10:28:00',
    syncFrequency: 'Event-driven',
    recordsSync: 23890,
    successRate: 99.1,
    avgLatency: 123,
    dataFlow: 'inbound',
    configuredBy: 'lisa.martinez@retailchain.com',
    createdAt: '2023-11-02'
  },
  {
    id: '4',
    name: 'AWS S3 File Sync',
    description: 'Automated backup and file synchronization',
    type: 'file_sync',
    status: 'active',
    tenantName: 'TechStart Inc',
    provider: 'Amazon AWS',
    lastSync: '2024-01-07 09:45:00',
    syncFrequency: 'Daily at 2 AM',
    recordsSync: 5670,
    successRate: 100.0,
    avgLatency: 89,
    dataFlow: 'outbound',
    configuredBy: 'sarah@techstart.com',
    createdAt: '2023-09-18'
  },
  {
    id: '5',
    name: 'QuickBooks Accounting',
    description: 'Financial data and invoice synchronization',
    type: 'api',
    status: 'error',
    tenantName: 'Manufacturing Pro',
    provider: 'Intuit QuickBooks',
    lastSync: '2024-01-06 15:30:00',
    syncFrequency: 'Every 4 hours',
    recordsSync: 8930,
    successRate: 67.8,
    avgLatency: 892,
    dataFlow: 'bidirectional',
    configuredBy: 'robert@mfgpro.com',
    createdAt: '2023-07-12'
  },
  {
    id: '6',
    name: 'Slack Notifications',
    description: 'Real-time alerts and notifications',
    type: 'messaging',
    status: 'active',
    tenantName: 'Acme Corporation',
    provider: 'Slack',
    lastSync: '2024-01-07 10:32:00',
    syncFrequency: 'Real-time',
    recordsSync: 2340,
    successRate: 96.8,
    avgLatency: 45,
    dataFlow: 'outbound',
    configuredBy: 'john.smith@acme.com',
    createdAt: '2023-12-01'
  }
]

const mockWebhooks: Webhook[] = [
  {
    id: 'WH-001',
    name: 'Order Created Notification',
    url: 'https://acme.com/webhooks/orders',
    events: ['order.created', 'order.updated'],
    status: 'active',
    tenantName: 'Acme Corporation',
    lastTrigger: '2024-01-07 10:15:00',
    totalDeliveries: 1567,
    successfulDeliveries: 1542,
    avgResponseTime: 145,
    retryCount: 3
  },
  {
    id: 'WH-002',
    name: 'Inventory Alert System',
    url: 'https://globallogistics.com/api/inventory',
    events: ['inventory.low', 'inventory.out_of_stock'],
    status: 'active',
    tenantName: 'Global Logistics Ltd',
    lastTrigger: '2024-01-07 09:45:00',
    totalDeliveries: 892,
    successfulDeliveries: 876,
    avgResponseTime: 234,
    retryCount: 2
  },
  {
    id: 'WH-003',
    name: 'Payment Processing',
    url: 'https://retailchain.com/payment/webhook',
    events: ['payment.completed', 'payment.failed'],
    status: 'failed',
    tenantName: 'RetailChain Plus',
    lastTrigger: '2024-01-07 08:30:00',
    totalDeliveries: 445,
    successfulDeliveries: 398,
    avgResponseTime: 567,
    retryCount: 5
  }
]

const integrationTrends = [
  { month: 'Aug', active: 45, total: 52, dataVol: 890000 },
  { month: 'Sep', active: 52, total: 58, dataVol: 1020000 },
  { month: 'Oct', active: 58, total: 65, dataVol: 1180000 },
  { month: 'Nov', active: 61, total: 68, dataVol: 1290000 },
  { month: 'Dec', active: 67, total: 72, dataVol: 1450000 },
  { month: 'Jan', active: 71, total: 76, dataVol: 1520000 }
]

const typeDistribution = [
  { type: 'API', count: 28, color: '#3b82f6' },
  { type: 'Webhook', count: 15, color: '#10b981' },
  { type: 'Database', count: 12, color: '#f59e0b' },
  { type: 'File Sync', count: 8, color: '#ef4444' },
  { type: 'Messaging', count: 13, color: '#8b5cf6' }
]

const performanceData = [
  { hour: '00:00', requests: 234, latency: 145, errors: 2 },
  { hour: '06:00', requests: 567, latency: 123, errors: 1 },
  { hour: '12:00', requests: 890, latency: 178, errors: 5 },
  { hour: '18:00', requests: 678, latency: 156, errors: 3 },
  { hour: '23:59', requests: 445, latency: 134, errors: 1 }
]

const statusColors: Record<string, string> = {
  active: '#16a34a',
  inactive: '#6b7280',
  error: '#ef4444',
  pending: '#ca8a04',
  failed: '#ef4444'
}

const typeIcons: Record<string, React.ElementType> = {
  api: Globe,
  webhook: Webhook,
  database: Database,
  file_sync: RotateCw,
  messaging: Zap
}

export default function EnterpriseIntegrationsComponent() {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations)
  const [webhooks, setWebhooks] = useState<Webhook[]>(mockWebhooks)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [tenantFilter, setTenantFilter] = useState('all')

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.provider.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || integration.type === typeFilter
    const matchesStatus = statusFilter === 'all' || integration.status === statusFilter
    const matchesTenant = tenantFilter === 'all' || integration.tenantName === tenantFilter
    return matchesSearch && matchesType && matchesStatus && matchesTenant
  })

  const getTypeIcon = (type: string) => {
    const IconComponent = typeIcons[type] || Puzzle
    return <IconComponent className="h-4 w-4" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'inactive': return <XCircle className="h-4 w-4" />
      case 'error': return <AlertTriangle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'failed': return <XCircle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const totalIntegrations = integrations.length
  const activeIntegrations = integrations.filter(i => i.status === 'active').length
  const totalRecords = integrations.reduce((sum, i) => sum + i.recordsSync, 0)
  const avgSuccessRate = integrations.reduce((sum, i) => sum + i.successRate, 0) / integrations.length

  const uniqueTenants = [...new Set(integrations.map(i => i.tenantName))]

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-4">
          <Button className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
          <Button variant="outline" className="whitespace-nowrap">
            <Webhook className="h-4 w-4 mr-2" />
            Manage Webhooks
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Global Settings
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
                  <Puzzle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Integrations</p>
                  <p className="text-2xl font-bold text-blue-900">{totalIntegrations}</p>
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
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Active</p>
                  <p className="text-2xl font-bold text-green-900">{activeIntegrations}</p>
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
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600">Records Synced</p>
                  <p className="text-2xl font-bold text-purple-900">{totalRecords.toLocaleString()}</p>
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
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-600">Avg Success Rate</p>
                  <p className="text-2xl font-bold text-orange-900">{avgSuccessRate.toFixed(1)}%</p>
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
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Integration Growth
              </CardTitle>
              <CardDescription>
                Monthly integration deployment and usage trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={integrationTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Month', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
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
                    <Line type="monotone" dataKey="active" stroke="#16a34a" strokeWidth={2} name="Active" />
                    <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} name="Total" />
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
                <Puzzle className="h-5 w-5" />
                Integration Types
              </CardTitle>
              <CardDescription>
                Distribution by integration type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {typeDistribution.map((entry, index) => (
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
                {typeDistribution.map((item) => (
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>
                Real-time integration performance data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="hour" 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Hour', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
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
                    <Bar dataKey="requests" name="Requests" fill="#3b82f6" />
                    <Bar dataKey="errors" name="Errors" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Webhooks Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Active Webhooks
            </CardTitle>
            <CardDescription>
              Real-time webhook endpoints and delivery status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {webhooks.map((webhook, index) => (
                <div key={webhook.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">{webhook.name}</h4>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1"
                        style={{ color: statusColors[webhook.status], borderColor: statusColors[webhook.status] }}
                      >
                        {getStatusIcon(webhook.status)}
                        {webhook.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {webhook.successfulDeliveries}/{webhook.totalDeliveries} delivered
                      </span>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Test
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-500">Tenant</p>
                      <p className="font-medium">{webhook.tenantName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Triggered</p>
                      <p className="font-medium">{new Date(webhook.lastTrigger).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Success Rate</p>
                      <p className="font-medium">{((webhook.successfulDeliveries / webhook.totalDeliveries) * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Avg Response</p>
                      <p className="font-medium">{webhook.avgResponseTime}ms</p>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-gray-500 mb-1">Events:</p>
                    <div className="flex flex-wrap gap-2">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="secondary" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                    <p>Endpoint: {webhook.url}</p>
                  </div>
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
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-32">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="api">API</SelectItem>
            <SelectItem value="webhook">Webhook</SelectItem>
            <SelectItem value="database">Database</SelectItem>
            <SelectItem value="file_sync">File Sync</SelectItem>
            <SelectItem value="messaging">Messaging</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-32">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tenantFilter} onValueChange={setTenantFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Tenant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tenants</SelectItem>
            {uniqueTenants.map((tenant) => (
              <SelectItem key={tenant} value={tenant}>{tenant}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Integrations List */}
      <div className="space-y-4">
        {filteredIntegrations.map((integration, index) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + index * 0.05 }}
            whileHover={{ scale: 1.01 }}
          >
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{integration.name}</h3>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1"
                      >
                        {getTypeIcon(integration.type)}
                        {integration.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1"
                        style={{ color: statusColors[integration.status], borderColor: statusColors[integration.status] }}
                      >
                        {getStatusIcon(integration.status)}
                        {integration.status.toUpperCase()}
                      </Badge>
                      <Badge variant="secondary">{integration.provider}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{integration.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>📊 {integration.recordsSync.toLocaleString()} records</span>
                      <span>🎯 {integration.successRate}% success</span>
                      <span>⚡ {integration.avgLatency}ms avg latency</span>
                      <span>🔄 {integration.dataFlow}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Sync
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Tenant</p>
                    <p className="font-medium">{integration.tenantName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Last Sync</p>
                    <p className="font-medium">{new Date(integration.lastSync).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Frequency</p>
                    <p className="font-medium">{integration.syncFrequency}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Configured By</p>
                    <p className="font-medium text-xs">{integration.configuredBy}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Created</p>
                    <p className="font-medium">{new Date(integration.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Success Rate</span>
                    <span>{integration.successRate}%</span>
                  </div>
                  <Progress value={integration.successRate} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <Card className="p-12 text-center">
          <Puzzle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Integration
          </Button>
        </Card>
      )}
    </div>
  )
}
