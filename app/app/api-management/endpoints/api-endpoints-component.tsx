
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Globe, 
  Plus, 
  Search, 
  Filter,
  Activity,
  Shield,
  Clock,
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react'

interface APIEndpoint {
  id: string
  path: string
  method: string
  description: string
  status: 'active' | 'inactive' | 'deprecated'
  rateLimit: number
  lastUsed: string
  requests24h: number
  averageResponseTime: number
  successRate: number
}

const mockEndpoints: APIEndpoint[] = [
  {
    id: '1',
    path: '/api/logistics/tracking',
    method: 'GET',
    description: 'Real-time shipment tracking data',
    status: 'active',
    rateLimit: 1000,
    lastUsed: '2 minutes ago',
    requests24h: 15420,
    averageResponseTime: 145,
    successRate: 99.8
  },
  {
    id: '2', 
    path: '/api/finance/transactions',
    method: 'POST',
    description: 'Process financial transactions',
    status: 'active',
    rateLimit: 500,
    lastUsed: '5 minutes ago',
    requests24h: 8750,
    averageResponseTime: 234,
    successRate: 99.9
  },
  {
    id: '3',
    path: '/api/hr/employees',
    method: 'GET',
    description: 'Employee data management',
    status: 'active',
    rateLimit: 2000,
    lastUsed: '12 minutes ago',
    requests24h: 4320,
    averageResponseTime: 89,
    successRate: 100.0
  },
  {
    id: '4',
    path: '/api/ai-engine/predictions',
    method: 'POST',
    description: 'AI prediction and analysis',
    status: 'active',
    rateLimit: 100,
    lastUsed: '1 minute ago',
    requests24h: 25600,
    averageResponseTime: 567,
    successRate: 98.5
  },
  {
    id: '5',
    path: '/api/legacy/reports',
    method: 'GET',
    description: 'Legacy reporting system',
    status: 'deprecated',
    rateLimit: 50,
    lastUsed: '2 hours ago',
    requests24h: 150,
    averageResponseTime: 1200,
    successRate: 95.2
  }
]

export default function APIEndpointsComponent() {
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>(mockEndpoints)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')

  const filteredEndpoints = endpoints.filter(endpoint => {
    const matchesSearch = endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || endpoint.status === statusFilter
    const matchesMethod = methodFilter === 'all' || endpoint.method === methodFilter
    
    return matchesSearch && matchesStatus && matchesMethod
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'deprecated': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800'
      case 'POST': return 'bg-green-100 text-green-800'
      case 'PUT': return 'bg-yellow-100 text-yellow-800'
      case 'DELETE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSuccessIcon = (successRate: number) => {
    if (successRate >= 99) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (successRate >= 95) return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    return <XCircle className="h-4 w-4 text-red-600" />
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search endpoints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="deprecated">Deprecated</SelectItem>
            </SelectContent>
          </Select>

          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Endpoint
        </Button>
      </div>

      {/* Stats Cards */}
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
                  <p className="text-sm font-medium text-gray-600">Total Endpoints</p>
                  <p className="text-2xl font-bold text-gray-900">{endpoints.length}</p>
                </div>
                <Globe className="h-8 w-8 text-blue-600" />
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
                  <p className="text-sm font-medium text-gray-600">Active Endpoints</p>
                  <p className="text-2xl font-bold text-green-600">
                    {endpoints.filter(e => e.status === 'active').length}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
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
                  <p className="text-sm font-medium text-gray-600">24h Requests</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {endpoints.reduce((sum, e) => sum + e.requests24h, 0).toLocaleString()}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-purple-600" />
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
                  <p className="text-sm font-medium text-gray-600">Avg Response</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.round(endpoints.reduce((sum, e) => sum + e.averageResponseTime, 0) / endpoints.length)}ms
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Endpoints List */}
      <div className="space-y-4">
        {filteredEndpoints.map((endpoint, index) => (
          <motion.div
            key={endpoint.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {endpoint.path}
                      </code>
                      <Badge className={getStatusColor(endpoint.status)}>
                        {endpoint.status}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mt-2">{endpoint.description}</p>
                    
                    <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                      <span>Rate Limit: {endpoint.rateLimit}/min</span>
                      <span>Last Used: {endpoint.lastUsed}</span>
                      <span>24h Requests: {endpoint.requests24h.toLocaleString()}</span>
                      <span>Avg Response: {endpoint.averageResponseTime}ms</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {getSuccessIcon(endpoint.successRate)}
                      <span className="text-sm font-medium">{endpoint.successRate}%</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Shield className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        <Activity className="h-4 w-4 mr-1" />
                        Monitor
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
