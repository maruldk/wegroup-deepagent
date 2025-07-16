
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
  GitBranch, 
  Plus, 
  Search, 
  Filter,
  Activity,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  Pause,
  Square,
  Settings,
  Eye,
  RotateCw,
  TrendingUp,
  Workflow
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface Workflow {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'stopped' | 'error'
  modules: string[]
  triggerType: 'scheduled' | 'event' | 'manual'
  lastRun: string
  successRate: number
  avgExecutionTime: number
  runsToday: number
  priority: 'low' | 'medium' | 'high' | 'critical'
}

const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Supply Chain Optimization',
    description: 'Integrates demand forecasting, inventory management, and logistics AI',
    status: 'active',
    modules: ['Logistics', 'Finance', 'WeSell'],
    triggerType: 'scheduled',
    lastRun: '5 minutes ago',
    successRate: 97.8,
    avgExecutionTime: 342,
    runsToday: 48,
    priority: 'high'
  },
  {
    id: '2',
    name: 'Customer Journey Automation',
    description: 'Orchestrates customer interactions across sales, support, and fulfillment',
    status: 'active',
    modules: ['WeSell', 'WeCreate', 'HR'],
    triggerType: 'event',
    lastRun: '12 minutes ago',
    successRate: 94.2,
    avgExecutionTime: 189,
    runsToday: 127,
    priority: 'high'
  },
  {
    id: '3',
    name: 'Financial Risk Assessment',
    description: 'Combines fraud detection, credit scoring, and compliance checks',
    status: 'active',
    modules: ['Finance', 'Security'],
    triggerType: 'event',
    lastRun: '2 minutes ago',
    successRate: 99.1,
    avgExecutionTime: 78,
    runsToday: 256,
    priority: 'critical'
  },
  {
    id: '4',
    name: 'Content Generation Pipeline',
    description: 'Automates content creation, review, and publishing workflows',
    status: 'paused',
    modules: ['WeCreate', 'Security'],
    triggerType: 'manual',
    lastRun: '2 hours ago',
    successRate: 91.7,
    avgExecutionTime: 456,
    runsToday: 12,
    priority: 'medium'
  },
  {
    id: '5',
    name: 'Predictive Maintenance',
    description: 'Monitors system health and triggers preventive actions',
    status: 'active',
    modules: ['Monitoring', 'Logistics', 'Finance'],
    triggerType: 'scheduled',
    lastRun: '8 minutes ago',
    successRate: 96.4,
    avgExecutionTime: 234,
    runsToday: 36,
    priority: 'medium'
  },
  {
    id: '6',
    name: 'Employee Onboarding AI',
    description: 'Automates new hire processes across HR, security, and training',
    status: 'error',
    modules: ['HR', 'Security', 'WeCreate'],
    triggerType: 'event',
    lastRun: '45 minutes ago',
    successRate: 88.3,
    avgExecutionTime: 567,
    runsToday: 3,
    priority: 'low'
  }
]

const performanceData = [
  { time: '00:00', executions: 34, success: 97, avgTime: 245 },
  { time: '04:00', executions: 28, success: 95, avgTime: 289 },
  { time: '08:00', executions: 52, success: 98, avgTime: 203 },
  { time: '12:00', executions: 67, success: 96, avgTime: 234 },
  { time: '16:00', executions: 78, success: 97, avgTime: 198 },
  { time: '20:00', executions: 43, success: 94, avgTime: 267 }
]

const statusData = [
  { name: 'Active', value: 4, color: '#22c55e' },
  { name: 'Paused', value: 1, color: '#f59e0b' },
  { name: 'Error', value: 1, color: '#ef4444' }
]

const statusColors: Record<string, string> = {
  active: '#22c55e',
  paused: '#f59e0b',
  stopped: '#6b7280',
  error: '#ef4444'
}

const priorityColors: Record<string, string> = {
  low: '#6b7280',
  medium: '#3b82f6',
  high: '#f59e0b',
  critical: '#ef4444'
}

export default function AIOrchestrationComponent() {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || workflow.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4" />
      case 'paused': return <Pause className="h-4 w-4" />
      case 'stopped': return <Square className="h-4 w-4" />
      case 'error': return <XCircle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const totalExecutions = workflows.reduce((sum, workflow) => sum + workflow.runsToday, 0)
  const avgSuccessRate = workflows.reduce((sum, workflow) => sum + workflow.successRate, 0) / workflows.length
  const activeWorkflows = workflows.filter(workflow => workflow.status === 'active').length

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
                  <Workflow className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Workflows</p>
                  <p className="text-2xl font-bold text-blue-900">{workflows.length}</p>
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
                  <p className="text-2xl font-bold text-green-900">{activeWorkflows}</p>
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
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600">Success Rate</p>
                  <p className="text-2xl font-bold text-purple-900">{avgSuccessRate.toFixed(1)}%</p>
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
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-600">Executions Today</p>
                  <p className="text-2xl font-bold text-orange-900">{totalExecutions}</p>
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
                Execution Performance
              </CardTitle>
              <CardDescription>
                Workflow execution metrics throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
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
                    <Line type="monotone" dataKey="executions" stroke="#3b82f6" strokeWidth={2} name="Executions" />
                    <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} name="Success Rate %" />
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
                <GitBranch className="h-5 w-5" />
                Status Distribution
              </CardTitle>
              <CardDescription>
                Current workflow status breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
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
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
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
            placeholder="Search workflows..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="stopped">Stopped</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Button className="whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {filteredWorkflows.map((workflow, index) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ scale: 1.01 }}
          >
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{workflow.name}</h3>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1"
                        style={{ color: statusColors[workflow.status], borderColor: statusColors[workflow.status] }}
                      >
                        {getStatusIcon(workflow.status)}
                        {workflow.status}
                      </Badge>
                      <Badge 
                        variant="outline"
                        style={{ color: priorityColors[workflow.priority], borderColor: priorityColors[workflow.priority] }}
                      >
                        {workflow.priority}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{workflow.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {workflow.modules.map((module) => (
                        <Badge key={module} variant="secondary" className="text-xs">
                          {module}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                    {workflow.status !== 'active' && (
                      <Button size="sm" variant="outline">
                        <Play className="h-3 w-3 mr-1" />
                        Run
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Trigger Type</p>
                    <p className="font-medium capitalize">{workflow.triggerType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Last Run</p>
                    <p className="font-medium">{workflow.lastRun}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Success Rate</p>
                    <div className="flex items-center gap-2">
                      <Progress value={workflow.successRate} className="h-2 flex-1" />
                      <span className="font-medium min-w-0">{workflow.successRate}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Runs Today</p>
                    <p className="font-medium">{workflow.runsToday}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Avg Time</p>
                    <p className="font-medium">{workflow.avgExecutionTime}ms</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredWorkflows.length === 0 && (
        <Card className="p-12 text-center">
          <GitBranch className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Workflow
          </Button>
        </Card>
      )}
    </div>
  )
}
