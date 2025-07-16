
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Webhook, 
  Plus, 
  Search,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Globe,
  Zap,
  Activity,
  Settings
} from 'lucide-react'

interface WebhookConfig {
  id: string
  name: string
  url: string
  events: string[]
  status: 'active' | 'inactive' | 'error'
  lastTriggered: string
  successRate: number
  totalCalls: number
  averageResponseTime: number
  secret: string
}

const mockWebhooks: WebhookConfig[] = [
  {
    id: '1',
    name: 'Shipment Tracking Notifications',
    url: 'https://client-app.com/webhooks/shipments',
    events: ['shipment.created', 'shipment.updated', 'shipment.delivered'],
    status: 'active',
    lastTriggered: '5 minutes ago',
    successRate: 99.2,
    totalCalls: 15420,
    averageResponseTime: 245,
    secret: 'whsec_...'
  },
  {
    id: '2',
    name: 'Payment Processing Events',
    url: 'https://finance-system.com/api/webhooks',
    events: ['payment.completed', 'payment.failed', 'invoice.created'],
    status: 'active',
    lastTriggered: '2 minutes ago',
    successRate: 98.7,
    totalCalls: 8750,
    averageResponseTime: 156,
    secret: 'whsec_...'
  },
  {
    id: '3',
    name: 'Employee Onboarding',
    url: 'https://hr-portal.internal/webhooks/employees',
    events: ['employee.created', 'employee.updated'],
    status: 'active',
    lastTriggered: '1 hour ago',
    successRate: 100.0,
    totalCalls: 342,
    averageResponseTime: 89,
    secret: 'whsec_...'
  },
  {
    id: '4',
    name: 'AI Decision Alerts',
    url: 'https://monitoring.company.com/ai-events',
    events: ['ai.decision.made', 'ai.confidence.low', 'ai.error'],
    status: 'active',
    lastTriggered: '30 seconds ago',
    successRate: 97.8,
    totalCalls: 25600,
    averageResponseTime: 321,
    secret: 'whsec_...'
  },
  {
    id: '5',
    name: 'Legacy Integration',
    url: 'https://old-system.company.com/webhooks',
    events: ['order.created'],
    status: 'error',
    lastTriggered: '2 hours ago',
    successRate: 85.2,
    totalCalls: 1250,
    averageResponseTime: 1200,
    secret: 'whsec_...'
  }
]

const availableEvents = [
  'shipment.created', 'shipment.updated', 'shipment.delivered',
  'payment.completed', 'payment.failed', 'invoice.created',
  'employee.created', 'employee.updated', 'employee.deleted',
  'ai.decision.made', 'ai.confidence.low', 'ai.error',
  'order.created', 'order.updated', 'order.cancelled',
  'user.created', 'user.login', 'user.logout'
]

export default function WebhooksComponent() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(mockWebhooks)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredWebhooks = webhooks.filter(webhook => {
    const matchesSearch = webhook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         webhook.url.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || webhook.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'inactive': return <Clock className="h-4 w-4 text-gray-600" />
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />
      default: return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    }
  }

  const totalCalls = webhooks.reduce((sum, w) => sum + w.totalCalls, 0)
  const avgSuccessRate = webhooks.reduce((sum, w) => sum + w.successRate, 0) / webhooks.length

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search webhooks..."
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
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Webhook
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
                  <p className="text-sm font-medium text-gray-600">Total Webhooks</p>
                  <p className="text-2xl font-bold text-gray-900">{webhooks.length}</p>
                </div>
                <Webhook className="h-8 w-8 text-blue-600" />
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
                  <p className="text-sm font-medium text-gray-600">Active Webhooks</p>
                  <p className="text-2xl font-bold text-green-600">
                    {webhooks.filter(w => w.status === 'active').length}
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
                  <p className="text-sm font-medium text-gray-600">Total Calls</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {totalCalls.toLocaleString()}
                  </p>
                </div>
                <Send className="h-8 w-8 text-purple-600" />
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
                  <p className="text-2xl font-bold text-green-600">
                    {avgSuccessRate.toFixed(1)}%
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Webhooks List */}
      <div className="space-y-4">
        {filteredWebhooks.map((webhook, index) => (
          <motion.div
            key={webhook.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(webhook.status)}
                      <h3 className="text-lg font-semibold text-gray-900">{webhook.name}</h3>
                      <Badge className={getStatusColor(webhook.status)}>
                        {webhook.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{webhook.url}</code>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {webhook.events.map(event => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>Last Triggered: {webhook.lastTriggered}</span>
                      <span>Success Rate: {webhook.successRate}%</span>
                      <span>Total Calls: {webhook.totalCalls.toLocaleString()}</span>
                      <span>Avg Response: {webhook.averageResponseTime}ms</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Send className="h-4 w-4 mr-1" />
                      Test
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <Activity className="h-4 w-4 mr-1" />
                      Logs
                    </Button>
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
