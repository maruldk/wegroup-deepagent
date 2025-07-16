
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
  Building, 
  Plus, 
  Search, 
  Filter,
  Settings,
  RefreshCw,
  Calendar,
  Users,
  Database,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Cpu,
  HardDrive,
  Globe,
  Eye,
  Edit
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts'

interface Tenant {
  id: string
  name: string
  domain: string
  plan: 'starter' | 'professional' | 'enterprise' | 'custom'
  status: 'active' | 'suspended' | 'inactive' | 'trial'
  createdAt: string
  lastActivity: string
  userCount: number
  storageUsed: number
  storageLimit: number
  cpuUsage: number
  memoryUsage: number
  monthlyRevenue: number
  features: string[]
  contact: {
    name: string
    email: string
    phone: string
  }
}

const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    domain: 'acme.wegroup.app',
    plan: 'enterprise',
    status: 'active',
    createdAt: '2023-06-15',
    lastActivity: '2024-01-07 10:30:00',
    userCount: 245,
    storageUsed: 89.4,
    storageLimit: 100,
    cpuUsage: 67.2,
    memoryUsage: 78.5,
    monthlyRevenue: 4999,
    features: ['AI Engine', 'Advanced Analytics', 'API Access', 'Priority Support'],
    contact: {
      name: 'John Smith',
      email: 'john.smith@acme.com',
      phone: '+1-555-0123'
    }
  },
  {
    id: '2',
    name: 'TechStart Inc',
    domain: 'techstart.wegroup.app',
    plan: 'professional',
    status: 'active',
    createdAt: '2023-09-22',
    lastActivity: '2024-01-07 09:15:00',
    userCount: 87,
    storageUsed: 34.7,
    storageLimit: 50,
    cpuUsage: 45.8,
    memoryUsage: 52.3,
    monthlyRevenue: 1999,
    features: ['Basic AI', 'Standard Analytics', 'API Access'],
    contact: {
      name: 'Sarah Johnson',
      email: 'sarah@techstart.com',
      phone: '+1-555-0456'
    }
  },
  {
    id: '3',
    name: 'Global Logistics Ltd',
    domain: 'globallogistics.wegroup.app',
    plan: 'enterprise',
    status: 'active',
    createdAt: '2023-03-10',
    lastActivity: '2024-01-07 11:45:00',
    userCount: 512,
    storageUsed: 156.8,
    storageLimit: 200,
    cpuUsage: 89.4,
    memoryUsage: 91.2,
    monthlyRevenue: 7999,
    features: ['AI Engine', 'Advanced Analytics', 'API Access', 'Priority Support', 'Custom Integrations'],
    contact: {
      name: 'Michael Chen',
      email: 'mike.chen@globallogistics.com',
      phone: '+1-555-0789'
    }
  },
  {
    id: '4',
    name: 'StartupCo',
    domain: 'startupco.wegroup.app',
    plan: 'starter',
    status: 'trial',
    createdAt: '2024-01-01',
    lastActivity: '2024-01-07 08:30:00',
    userCount: 12,
    storageUsed: 2.3,
    storageLimit: 10,
    cpuUsage: 23.1,
    memoryUsage: 31.7,
    monthlyRevenue: 0,
    features: ['Basic Features', 'Limited Analytics'],
    contact: {
      name: 'Emma Wilson',
      email: 'emma@startupco.com',
      phone: '+1-555-0321'
    }
  },
  {
    id: '5',
    name: 'Manufacturing Pro',
    domain: 'mfgpro.wegroup.app',
    plan: 'professional',
    status: 'suspended',
    createdAt: '2023-11-05',
    lastActivity: '2024-01-05 14:20:00',
    userCount: 156,
    storageUsed: 67.9,
    storageLimit: 50,
    cpuUsage: 0,
    memoryUsage: 0,
    monthlyRevenue: 1999,
    features: ['Basic AI', 'Standard Analytics', 'API Access'],
    contact: {
      name: 'Robert Davis',
      email: 'robert@mfgpro.com',
      phone: '+1-555-0654'
    }
  },
  {
    id: '6',
    name: 'RetailChain Plus',
    domain: 'retailchain.wegroup.app',
    plan: 'custom',
    status: 'active',
    createdAt: '2023-08-18',
    lastActivity: '2024-01-07 12:00:00',
    userCount: 1247,
    storageUsed: 389.7,
    storageLimit: 500,
    cpuUsage: 94.3,
    memoryUsage: 88.9,
    monthlyRevenue: 15999,
    features: ['AI Engine', 'Advanced Analytics', 'API Access', 'Priority Support', 'Custom Integrations', 'Dedicated Resources'],
    contact: {
      name: 'Lisa Martinez',
      email: 'lisa.martinez@retailchain.com',
      phone: '+1-555-0987'
    }
  }
]

const tenantGrowth = [
  { month: 'Aug', tenants: 45, revenue: 89500 },
  { month: 'Sep', tenants: 52, revenue: 104200 },
  { month: 'Oct', tenants: 58, revenue: 116800 },
  { month: 'Nov', tenants: 61, revenue: 122100 },
  { month: 'Dec', tenants: 67, revenue: 134300 },
  { month: 'Jan', tenants: 71, revenue: 142200 }
]

const planDistribution = [
  { plan: 'Enterprise', count: 23, revenue: 184770, color: '#3b82f6' },
  { plan: 'Professional', count: 31, revenue: 61690, color: '#10b981' },
  { plan: 'Starter', count: 12, revenue: 5988, color: '#f59e0b' },
  { plan: 'Custom', count: 5, revenue: 79995, color: '#ef4444' }
]

const resourceUsage = [
  { resource: 'CPU', usage: 67.8, limit: 100, color: '#3b82f6' },
  { resource: 'Memory', usage: 73.2, limit: 100, color: '#10b981' },
  { resource: 'Storage', usage: 85.4, limit: 100, color: '#f59e0b' },
  { resource: 'Bandwidth', usage: 45.6, limit: 100, color: '#ef4444' }
]

const statusColors: Record<string, string> = {
  active: '#16a34a',
  suspended: '#ca8a04',
  inactive: '#6b7280',
  trial: '#3b82f6'
}

const planColors: Record<string, string> = {
  starter: '#6b7280',
  professional: '#3b82f6',
  enterprise: '#16a34a',
  custom: '#8b5cf6'
}

export default function TenantManagementComponent() {
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants)
  const [searchTerm, setSearchTerm] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.domain.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlan = planFilter === 'all' || tenant.plan === planFilter
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter
    return matchesSearch && matchesPlan && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'suspended': return <AlertTriangle className="h-4 w-4" />
      case 'inactive': return <XCircle className="h-4 w-4" />
      case 'trial': return <Activity className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const totalTenants = tenants.length
  const activeTenants = tenants.filter(t => t.status === 'active').length
  const totalUsers = tenants.reduce((sum, t) => sum + t.userCount, 0)
  const totalRevenue = tenants.reduce((sum, t) => sum + t.monthlyRevenue, 0)

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-4">
          <Button className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            Add Tenant
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
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
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Tenants</p>
                  <p className="text-2xl font-bold text-blue-900">{totalTenants}</p>
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
                  <p className="text-sm font-medium text-green-600">Active Tenants</p>
                  <p className="text-2xl font-bold text-green-900">{activeTenants}</p>
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
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600">Total Users</p>
                  <p className="text-2xl font-bold text-purple-900">{totalUsers.toLocaleString()}</p>
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
                  <p className="text-sm font-medium text-orange-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-orange-900">${totalRevenue.toLocaleString()}</p>
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
                Growth Trends
              </CardTitle>
              <CardDescription>
                Tenant and revenue growth over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tenantGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Month', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <YAxis 
                      yAxisId="left"
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Tenants', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        fontSize: 11
                      }} 
                    />
                    <Line yAxisId="left" type="monotone" dataKey="tenants" stroke="#3b82f6" strokeWidth={2} name="Tenants" />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue ($)" />
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
                <Building className="h-5 w-5" />
                Plan Distribution
              </CardTitle>
              <CardDescription>
                Tenants by subscription plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {planDistribution.map((entry, index) => (
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
                {planDistribution.map((item) => (
                  <div key={item.plan} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.plan}</span>
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
                <Cpu className="h-5 w-5" />
                Resource Usage
              </CardTitle>
              <CardDescription>
                Overall platform resource utilization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {resourceUsage.map((resource, index) => (
                  <div key={resource.resource} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">{resource.resource}</span>
                      <span className="text-gray-500">{resource.usage.toFixed(1)}%</span>
                    </div>
                    <Progress value={resource.usage} className="h-3" />
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Capacity Planning</h4>
                <div className="text-sm text-gray-600">
                  <p>• CPU: Approaching 70% threshold</p>
                  <p>• Memory: Normal utilization</p>
                  <p>• Storage: Consider expansion soon</p>
                  <p>• Bandwidth: Well within limits</p>
                </div>
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
            placeholder="Search tenants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
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
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tenants List */}
      <div className="space-y-4">
        {filteredTenants.map((tenant, index) => (
          <motion.div
            key={tenant.id}
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
                      <h3 className="text-lg font-semibold">{tenant.name}</h3>
                      <Badge 
                        variant="outline" 
                        style={{ color: planColors[tenant.plan], borderColor: planColors[tenant.plan] }}
                      >
                        {tenant.plan.toUpperCase()}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1"
                        style={{ color: statusColors[tenant.status], borderColor: statusColors[tenant.status] }}
                      >
                        {getStatusIcon(tenant.status)}
                        {tenant.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{tenant.domain}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tenant.features.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {tenant.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{tenant.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Manage
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-500 mb-1">Users</p>
                    <p className="font-medium">{tenant.userCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Storage</p>
                    <p className="font-medium">{tenant.storageUsed.toFixed(1)}GB / {tenant.storageLimit}GB</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">CPU Usage</p>
                    <p className="font-medium">{tenant.cpuUsage.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Memory</p>
                    <p className="font-medium">{tenant.memoryUsage.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Revenue</p>
                    <p className="font-medium">${tenant.monthlyRevenue.toLocaleString()}/mo</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Last Activity</p>
                    <p className="font-medium">{new Date(tenant.lastActivity).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Storage Usage</p>
                    <Progress value={(tenant.storageUsed / tenant.storageLimit) * 100} className="h-2" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Resource Usage</p>
                    <Progress value={Math.max(tenant.cpuUsage, tenant.memoryUsage)} className="h-2" />
                  </div>
                </div>

                <div className="pt-3 border-t mt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Primary Contact:</span>
                    <span className="font-medium">{tenant.contact.name} ({tenant.contact.email})</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <Card className="p-12 text-center">
          <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tenants found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Tenant
          </Button>
        </Card>
      )}
    </div>
  )
}
