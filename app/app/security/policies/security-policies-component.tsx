
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { 
  Shield, 
  Plus, 
  Search, 
  Filter,
  Settings,
  RefreshCw,
  Calendar,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Key,
  Database,
  Globe,
  Activity,
  Edit
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface SecurityPolicy {
  id: string
  name: string
  category: 'access_control' | 'password' | 'data_protection' | 'network' | 'audit' | 'compliance'
  description: string
  status: 'active' | 'inactive' | 'draft'
  enforcement: 'strict' | 'moderate' | 'flexible'
  lastUpdated: string
  updatedBy: string
  violationsCount: number
  complianceRate: number
  affectedUsers: number
  settings: Record<string, any>
}

const mockPolicies: SecurityPolicy[] = [
  {
    id: '1',
    name: 'Password Complexity Policy',
    category: 'password',
    description: 'Enforces strong password requirements including length, complexity, and rotation',
    status: 'active',
    enforcement: 'strict',
    lastUpdated: '2024-01-05',
    updatedBy: 'admin@wegroup.com',
    violationsCount: 23,
    complianceRate: 94.2,
    affectedUsers: 1247,
    settings: {
      minLength: 12,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      rotationDays: 90,
      historyCount: 5
    }
  },
  {
    id: '2',
    name: 'Multi-Factor Authentication',
    category: 'access_control',
    description: 'Requires MFA for all administrative and sensitive account access',
    status: 'active',
    enforcement: 'strict',
    lastUpdated: '2024-01-03',
    updatedBy: 'security@wegroup.com',
    violationsCount: 8,
    complianceRate: 98.7,
    affectedUsers: 456,
    settings: {
      requireForAdmin: true,
      requireForSensitive: true,
      allowedMethods: ['totp', 'sms', 'hardware'],
      gracePeriorDays: 7
    }
  },
  {
    id: '3',
    name: 'Data Classification Policy',
    category: 'data_protection',
    description: 'Defines data classification levels and handling requirements',
    status: 'active',
    enforcement: 'moderate',
    lastUpdated: '2024-01-02',
    updatedBy: 'compliance@wegroup.com',
    violationsCount: 45,
    complianceRate: 87.3,
    affectedUsers: 892,
    settings: {
      classificationLevels: ['public', 'internal', 'confidential', 'restricted'],
      encryptionRequired: ['confidential', 'restricted'],
      accessLogging: true,
      dataRetentionDays: 2555
    }
  },
  {
    id: '4',
    name: 'Network Access Control',
    category: 'network',
    description: 'Controls network access based on device and user authentication',
    status: 'active',
    enforcement: 'strict',
    lastUpdated: '2023-12-28',
    updatedBy: 'network@wegroup.com',
    violationsCount: 12,
    complianceRate: 96.8,
    affectedUsers: 1247,
    settings: {
      deviceCertificateRequired: true,
      guestNetworkIsolated: true,
      vpnRequired: true,
      allowPersonalDevices: false
    }
  },
  {
    id: '5',
    name: 'Audit Logging Policy',
    category: 'audit',
    description: 'Mandatory logging of security-related events and user activities',
    status: 'active',
    enforcement: 'strict',
    lastUpdated: '2024-01-01',
    updatedBy: 'audit@wegroup.com',
    violationsCount: 3,
    complianceRate: 99.2,
    affectedUsers: 1247,
    settings: {
      logAuthentication: true,
      logDataAccess: true,
      logPrivilegeChanges: true,
      retentionYears: 7,
      realTimeMonitoring: true
    }
  },
  {
    id: '6',
    name: 'Session Management Policy',
    category: 'access_control',
    description: 'Controls user session timeouts and concurrent session limits',
    status: 'draft',
    enforcement: 'moderate',
    lastUpdated: '2024-01-06',
    updatedBy: 'security@wegroup.com',
    violationsCount: 0,
    complianceRate: 0,
    affectedUsers: 0,
    settings: {
      sessionTimeoutMinutes: 30,
      maxConcurrentSessions: 3,
      idleTimeoutMinutes: 15,
      forcedLogoutEnabled: true
    }
  }
]

const policyComplianceData = [
  { category: 'Access Control', policies: 5, compliant: 4, color: '#3b82f6' },
  { category: 'Password', policies: 3, compliant: 3, color: '#10b981' },
  { category: 'Data Protection', policies: 4, compliant: 3, color: '#f59e0b' },
  { category: 'Network', policies: 6, compliant: 5, color: '#ef4444' },
  { category: 'Audit', policies: 3, compliant: 3, color: '#8b5cf6' },
  { category: 'Compliance', policies: 2, compliant: 1, color: '#06b6d4' }
]

const violationTrends = [
  { month: 'Sep', total: 78, resolved: 71 },
  { month: 'Oct', total: 65, resolved: 59 },
  { month: 'Nov', total: 89, resolved: 82 },
  { month: 'Dec', total: 72, resolved: 68 },
  { month: 'Jan', total: 91, resolved: 85 }
]

const enforcementLevels = [
  { level: 'Strict', count: 12, color: '#dc2626' },
  { level: 'Moderate', count: 8, color: '#ca8a04' },
  { level: 'Flexible', count: 3, color: '#16a34a' }
]

const categoryIcons: Record<string, React.ElementType> = {
  access_control: Lock,
  password: Key,
  data_protection: Database,
  network: Globe,
  audit: Activity,
  compliance: Shield
}

const statusColors: Record<string, string> = {
  active: '#16a34a',
  inactive: '#6b7280',
  draft: '#ca8a04'
}

const enforcementColors: Record<string, string> = {
  strict: '#dc2626',
  moderate: '#ca8a04',
  flexible: '#16a34a'
}

export default function SecurityPoliciesComponent() {
  const [policies, setPolicies] = useState<SecurityPolicy[]>(mockPolicies)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [enforcementFilter, setEnforcementFilter] = useState('all')

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || policy.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || policy.status === statusFilter
    const matchesEnforcement = enforcementFilter === 'all' || policy.enforcement === enforcementFilter
    return matchesSearch && matchesCategory && matchesStatus && matchesEnforcement
  })

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category] || Shield
    return <IconComponent className="h-4 w-4" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'inactive': return <XCircle className="h-4 w-4" />
      case 'draft': return <Clock className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const totalPolicies = policies.length
  const activePolicies = policies.filter(p => p.status === 'active').length
  const avgCompliance = policies.reduce((sum, p) => sum + p.complianceRate, 0) / policies.length
  const totalViolations = policies.reduce((sum, p) => sum + p.violationsCount, 0)

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-4">
          <Button className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            Create Policy
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
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Policies</p>
                  <p className="text-2xl font-bold text-blue-900">{totalPolicies}</p>
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
                  <p className="text-sm font-medium text-green-600">Active Policies</p>
                  <p className="text-2xl font-bold text-green-900">{activePolicies}</p>
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
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600">Avg Compliance</p>
                  <p className="text-2xl font-bold text-purple-900">{avgCompliance.toFixed(1)}%</p>
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
                  <XCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-600">Total Violations</p>
                  <p className="text-2xl font-bold text-orange-900">{totalViolations}</p>
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
                <Activity className="h-5 w-5" />
                Policy Compliance by Category
              </CardTitle>
              <CardDescription>
                Compliance status across policy categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={policyComplianceData}>
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
                      label={{ value: 'Policies', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        fontSize: 11
                      }} 
                    />
                    <Bar dataKey="policies" name="Total" fill="#e5e7eb" />
                    <Bar dataKey="compliant" name="Compliant">
                      {policyComplianceData.map((entry, index) => (
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
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Enforcement Levels
              </CardTitle>
              <CardDescription>
                Distribution of policy enforcement settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={enforcementLevels}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {enforcementLevels.map((entry, index) => (
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
                {enforcementLevels.map((item) => (
                  <div key={item.level} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.level}</span>
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
                <XCircle className="h-5 w-5" />
                Violation Trends
              </CardTitle>
              <CardDescription>
                Monthly policy violations and resolutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={violationTrends}>
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
                    <Bar dataKey="total" name="Total Violations" fill="#ef4444" />
                    <Bar dataKey="resolved" name="Resolved" fill="#16a34a" />
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
            placeholder="Search policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="access_control">Access Control</SelectItem>
            <SelectItem value="password">Password</SelectItem>
            <SelectItem value="data_protection">Data Protection</SelectItem>
            <SelectItem value="network">Network</SelectItem>
            <SelectItem value="audit">Audit</SelectItem>
            <SelectItem value="compliance">Compliance</SelectItem>
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
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Select value={enforcementFilter} onValueChange={setEnforcementFilter}>
          <SelectTrigger className="w-full sm:w-32">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Enforcement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Enforcement</SelectItem>
            <SelectItem value="strict">Strict</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="flexible">Flexible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Policies List */}
      <div className="space-y-4">
        {filteredPolicies.map((policy, index) => (
          <motion.div
            key={policy.id}
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
                      <h3 className="text-lg font-semibold">{policy.name}</h3>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1"
                      >
                        {getCategoryIcon(policy.category)}
                        {policy.category.replace('_', ' ')}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1"
                        style={{ color: statusColors[policy.status], borderColor: statusColors[policy.status] }}
                      >
                        {getStatusIcon(policy.status)}
                        {policy.status.toUpperCase()}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        style={{ color: enforcementColors[policy.enforcement], borderColor: enforcementColors[policy.enforcement] }}
                      >
                        {policy.enforcement.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{policy.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-500 mb-1">Compliance Rate</p>
                    <p className="font-medium text-lg">{policy.complianceRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Violations</p>
                    <p className="font-medium text-lg text-red-600">{policy.violationsCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Affected Users</p>
                    <p className="font-medium">{policy.affectedUsers.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Last Updated</p>
                    <p className="font-medium">{new Date(policy.lastUpdated).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Updated By</p>
                    <p className="font-medium text-xs">{policy.updatedBy}</p>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <h4 className="font-medium mb-2">Policy Settings</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    {Object.entries(policy.settings).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-medium">
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
                           Array.isArray(value) ? value.join(', ') : 
                           value.toString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredPolicies.length === 0 && (
        <Card className="p-12 text-center">
          <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Policy
          </Button>
        </Card>
      )}
    </div>
  )
}
