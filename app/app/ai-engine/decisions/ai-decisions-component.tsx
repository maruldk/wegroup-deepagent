
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
  Brain, 
  Plus, 
  Search, 
  Filter,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  TrendingUp,
  Eye,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Target,
  Award
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts'

interface Decision {
  id: string
  type: string
  description: string
  status: 'approved' | 'pending' | 'rejected' | 'auto-approved'
  confidence: number
  impact: 'low' | 'medium' | 'high' | 'critical'
  module: string
  timestamp: string
  processingTime: number
  humanReview: boolean
  outcome: string
  reviewedBy?: string
}

const mockDecisions: Decision[] = [
  {
    id: '1',
    type: 'Inventory Reorder',
    description: 'Auto-reorder 500 units of Product SKU-A4521 based on demand forecast',
    status: 'auto-approved',
    confidence: 94.7,
    impact: 'medium',
    module: 'Logistics',
    timestamp: '2 minutes ago',
    processingTime: 234,
    humanReview: false,
    outcome: 'Order placed successfully'
  },
  {
    id: '2',
    type: 'Credit Approval',
    description: 'Credit limit increase request for customer ID 7832 ($50,000)',
    status: 'pending',
    confidence: 78.3,
    impact: 'high',
    module: 'Finance',
    timestamp: '8 minutes ago',
    processingTime: 567,
    humanReview: true,
    outcome: 'Awaiting manual review'
  },
  {
    id: '3',
    type: 'Route Optimization',
    description: 'Reroute delivery truck #23 to avoid traffic congestion (saves 18 min)',
    status: 'approved',
    confidence: 96.2,
    impact: 'low',
    module: 'Logistics',
    timestamp: '15 minutes ago',
    processingTime: 89,
    humanReview: false,
    outcome: 'Route updated, ETA improved',
    reviewedBy: 'AI Engine'
  },
  {
    id: '4',
    type: 'Marketing Campaign',
    description: 'Launch targeted email campaign for segment "High-Value Customers"',
    status: 'approved',
    confidence: 87.9,
    impact: 'medium',
    module: 'WeSell',
    timestamp: '32 minutes ago',
    processingTime: 445,
    humanReview: true,
    outcome: 'Campaign launched to 2,341 customers',
    reviewedBy: 'Sarah Chen'
  },
  {
    id: '5',
    type: 'Fraud Detection',
    description: 'Flag transaction #TX-9834 as potentially fraudulent ($12,500)',
    status: 'approved',
    confidence: 98.4,
    impact: 'critical',
    module: 'Security',
    timestamp: '45 minutes ago',
    processingTime: 12,
    humanReview: true,
    outcome: 'Transaction blocked, investigation initiated',
    reviewedBy: 'John Martinez'
  },
  {
    id: '6',
    type: 'Content Generation',
    description: 'Auto-generate product descriptions for 15 new catalog items',
    status: 'rejected',
    confidence: 65.1,
    impact: 'low',
    module: 'WeCreate',
    timestamp: '1 hour ago',
    processingTime: 1234,
    humanReview: true,
    outcome: 'Quality below threshold, manual review required',
    reviewedBy: 'Emma Wilson'
  }
]

const decisionTrends = [
  { time: '00:00', approved: 23, pending: 5, rejected: 2, autoApproved: 45 },
  { time: '04:00', approved: 18, pending: 3, rejected: 1, autoApproved: 38 },
  { time: '08:00', approved: 42, pending: 12, rejected: 4, autoApproved: 67 },
  { time: '12:00', approved: 56, pending: 8, rejected: 3, autoApproved: 89 },
  { time: '16:00', approved: 48, pending: 15, rejected: 5, autoApproved: 72 },
  { time: '20:00', approved: 34, pending: 6, rejected: 2, autoApproved: 51 }
]

const moduleData = [
  { name: 'Logistics', decisions: 145, accuracy: 96.2, color: '#3b82f6' },
  { name: 'Finance', decisions: 98, accuracy: 94.7, color: '#10b981' },
  { name: 'WeSell', decisions: 87, accuracy: 91.3, color: '#f59e0b' },
  { name: 'Security', decisions: 234, accuracy: 98.4, color: '#ef4444' },
  { name: 'WeCreate', decisions: 56, accuracy: 88.9, color: '#8b5cf6' },
  { name: 'HR', decisions: 43, accuracy: 92.1, color: '#06b6d4' }
]

const statusColors: Record<string, string> = {
  'approved': '#22c55e',
  'pending': '#f59e0b',
  'rejected': '#ef4444',
  'auto-approved': '#3b82f6'
}

const impactColors: Record<string, string> = {
  low: '#6b7280',
  medium: '#3b82f6',
  high: '#f59e0b',
  critical: '#ef4444'
}

export default function AIDecisionsComponent() {
  const [decisions, setDecisions] = useState<Decision[]>(mockDecisions)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [moduleFilter, setModuleFilter] = useState('all')
  const [impactFilter, setImpactFilter] = useState('all')

  const filteredDecisions = decisions.filter(decision => {
    const matchesSearch = decision.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         decision.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || decision.status === statusFilter
    const matchesModule = moduleFilter === 'all' || decision.module === moduleFilter
    const matchesImpact = impactFilter === 'all' || decision.impact === impactFilter
    return matchesSearch && matchesStatus && matchesModule && matchesImpact
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'auto-approved': return <Zap className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const totalDecisions = decisions.length
  const pendingDecisions = decisions.filter(d => d.status === 'pending').length
  const avgConfidence = decisions.reduce((sum, d) => sum + d.confidence, 0) / decisions.length
  const autoApprovalRate = (decisions.filter(d => d.status === 'auto-approved').length / decisions.length) * 100

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
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Decisions</p>
                  <p className="text-2xl font-bold text-blue-900">{totalDecisions}</p>
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
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-600">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-900">{pendingDecisions}</p>
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
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Avg Confidence</p>
                  <p className="text-2xl font-bold text-green-900">{avgConfidence.toFixed(1)}%</p>
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
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600">Auto-Approval Rate</p>
                  <p className="text-2xl font-bold text-purple-900">{autoApprovalRate.toFixed(1)}%</p>
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
                <TrendingUp className="h-5 w-5" />
                Decision Trends
              </CardTitle>
              <CardDescription>
                Decision volume and status distribution over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={decisionTrends}>
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
                      label={{ value: 'Decisions', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        fontSize: 11
                      }} 
                    />
                    <Line type="monotone" dataKey="approved" stroke="#22c55e" strokeWidth={2} name="Approved" />
                    <Line type="monotone" dataKey="autoApproved" stroke="#3b82f6" strokeWidth={2} name="Auto-Approved" />
                    <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} name="Pending" />
                    <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} name="Rejected" />
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
                <Award className="h-5 w-5" />
                Module Performance
              </CardTitle>
              <CardDescription>
                Decision volume and accuracy by module
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moduleData}>
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
                      label={{ value: 'Decisions', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        fontSize: 11
                      }} 
                    />
                    <Bar dataKey="decisions" name="Total Decisions">
                      {moduleData.map((entry, index) => (
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
            placeholder="Search decisions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="auto-approved">Auto-Approved</SelectItem>
          </SelectContent>
        </Select>
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            <SelectItem value="Logistics">Logistics</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="WeSell">WeSell</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
            <SelectItem value="WeCreate">WeCreate</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
          </SelectContent>
        </Select>
        <Select value={impactFilter} onValueChange={setImpactFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Impact" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Impact</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Decisions List */}
      <div className="space-y-4">
        {filteredDecisions.map((decision, index) => (
          <motion.div
            key={decision.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.05 }}
            whileHover={{ scale: 1.01 }}
          >
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{decision.type}</h3>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1"
                        style={{ color: statusColors[decision.status], borderColor: statusColors[decision.status] }}
                      >
                        {getStatusIcon(decision.status)}
                        {decision.status.replace('-', ' ')}
                      </Badge>
                      <Badge 
                        variant="outline"
                        style={{ color: impactColors[decision.impact], borderColor: impactColors[decision.impact] }}
                      >
                        {decision.impact} impact
                      </Badge>
                      <Badge variant="secondary">{decision.module}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{decision.description}</p>
                    <p className="text-sm text-gray-700">
                      <strong>Outcome:</strong> {decision.outcome}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                    {decision.status === 'pending' && (
                      <>
                        <Button size="sm" variant="outline" className="text-green-600 border-green-600">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                          <ThumbsDown className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Confidence</p>
                    <div className="flex items-center gap-2">
                      <Progress value={decision.confidence} className="h-2 flex-1" />
                      <span className="font-medium min-w-0">{decision.confidence}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Processing Time</p>
                    <p className="font-medium">{decision.processingTime}ms</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Human Review</p>
                    <p className="font-medium">{decision.humanReview ? 'Required' : 'Auto'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Timestamp</p>
                    <p className="font-medium">{decision.timestamp}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Reviewed By</p>
                    <p className="font-medium">{decision.reviewedBy || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredDecisions.length === 0 && (
        <Card className="p-12 text-center">
          <Brain className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No decisions found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
        </Card>
      )}
    </div>
  )
}
