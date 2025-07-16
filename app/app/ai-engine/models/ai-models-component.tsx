
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
  Bot, 
  Plus, 
  Search, 
  Filter,
  Activity,
  Cpu,
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Clock,
  Download,
  Upload,
  Settings,
  Eye
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'

interface AIModel {
  id: string
  name: string
  type: string
  version: string
  status: 'deployed' | 'training' | 'testing' | 'inactive'
  accuracy: number
  lastTrained: string
  deploymentsCount: number
  requestsToday: number
  averageLatency: number
  memoryUsage: number
  description: string
}

const mockModels: AIModel[] = [
  {
    id: '1',
    name: 'LogisticsOptimizer',
    type: 'Deep Learning',
    version: 'v2.1.4',
    status: 'deployed',
    accuracy: 94.7,
    lastTrained: '3 days ago',
    deploymentsCount: 12,
    requestsToday: 8420,
    averageLatency: 89,
    memoryUsage: 2.1,
    description: 'AI model for route optimization and delivery predictions'
  },
  {
    id: '2',
    name: 'DemandForecaster',
    type: 'Time Series',
    version: 'v1.8.2',
    status: 'deployed',
    accuracy: 91.3,
    lastTrained: '1 week ago',
    deploymentsCount: 8,
    requestsToday: 5630,
    averageLatency: 156,
    memoryUsage: 1.8,
    description: 'Predicts customer demand patterns and inventory needs'
  },
  {
    id: '3',
    name: 'ContentGenerator',
    type: 'LLM',
    version: 'v3.0.1',
    status: 'training',
    accuracy: 89.1,
    lastTrained: 'Training...',
    deploymentsCount: 5,
    requestsToday: 0,
    averageLatency: 0,
    memoryUsage: 4.2,
    description: 'Advanced language model for content creation and copywriting'
  },
  {
    id: '4',
    name: 'FraudDetector',
    type: 'ML Classifier',
    version: 'v1.5.7',
    status: 'deployed',
    accuracy: 96.8,
    lastTrained: '5 days ago',
    deploymentsCount: 15,
    requestsToday: 12340,
    averageLatency: 23,
    memoryUsage: 0.9,
    description: 'Real-time fraud detection for financial transactions'
  },
  {
    id: '5',
    name: 'CustomerSegmentor',
    type: 'Clustering',
    version: 'v2.3.1',
    status: 'testing',
    accuracy: 88.4,
    lastTrained: '2 days ago',
    deploymentsCount: 3,
    requestsToday: 450,
    averageLatency: 203,
    memoryUsage: 1.4,
    description: 'Customer behavior analysis and segmentation model'
  },
  {
    id: '6',
    name: 'QualityInspector',
    type: 'Computer Vision',
    version: 'v1.9.3',
    status: 'inactive',
    accuracy: 92.6,
    lastTrained: '2 weeks ago',
    deploymentsCount: 2,
    requestsToday: 0,
    averageLatency: 0,
    memoryUsage: 0,
    description: 'Automated quality control for product inspection'
  }
]

const performanceData = [
  { time: '00:00', accuracy: 91, latency: 145, requests: 234 },
  { time: '04:00', accuracy: 93, latency: 132, requests: 186 },
  { time: '08:00', accuracy: 95, latency: 89, requests: 542 },
  { time: '12:00', accuracy: 94, latency: 156, requests: 689 },
  { time: '16:00', accuracy: 96, latency: 78, requests: 834 },
  { time: '20:00', accuracy: 94, latency: 123, requests: 456 }
]

const statusColors: Record<string, string> = {
  deployed: '#22c55e',
  training: '#3b82f6',
  testing: '#f59e0b',
  inactive: '#6b7280'
}

export default function AIModelsComponent() {
  const [models, setModels] = useState<AIModel[]>(mockModels)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null)

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || model.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed': return <CheckCircle className="h-4 w-4" />
      case 'training': return <Activity className="h-4 w-4" />
      case 'testing': return <AlertTriangle className="h-4 w-4" />
      case 'inactive': return <XCircle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const totalRequests = models.reduce((sum, model) => sum + model.requestsToday, 0)
  const avgAccuracy = models.reduce((sum, model) => sum + model.accuracy, 0) / models.length
  const deployedModels = models.filter(model => model.status === 'deployed').length

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
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Models</p>
                  <p className="text-2xl font-bold text-blue-900">{models.length}</p>
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
                  <p className="text-sm font-medium text-green-600">Deployed</p>
                  <p className="text-2xl font-bold text-green-900">{deployedModels}</p>
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
                  <p className="text-sm font-medium text-purple-600">Avg Accuracy</p>
                  <p className="text-2xl font-bold text-purple-900">{avgAccuracy.toFixed(1)}%</p>
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
                  <p className="text-sm font-medium text-orange-600">Requests Today</p>
                  <p className="text-2xl font-bold text-orange-900">{totalRequests.toLocaleString()}</p>
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
            placeholder="Search models by name or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="deployed">Deployed</SelectItem>
            <SelectItem value="training">Training</SelectItem>
            <SelectItem value="testing">Testing</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button className="whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" />
          Deploy Model
        </Button>
      </div>

      {/* Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Model Performance Overview
            </CardTitle>
            <CardDescription>
              Real-time accuracy, latency, and request metrics across all deployed models
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
                    label={{ value: 'Metrics', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      fontSize: 11
                    }} 
                  />
                  <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2} name="Accuracy %" />
                  <Line type="monotone" dataKey="latency" stroke="#ef4444" strokeWidth={2} name="Latency (ms)" />
                  <Line type="monotone" dataKey="requests" stroke="#10b981" strokeWidth={2} name="Requests" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Models List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredModels.map((model, index) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => setSelectedModel(model)}
          >
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Cpu className="h-4 w-4" />
                      {model.name}
                    </CardTitle>
                    <CardDescription>{model.description}</CardDescription>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="flex items-center gap-1"
                    style={{ color: statusColors[model.status], borderColor: statusColors[model.status] }}
                  >
                    {getStatusIcon(model.status)}
                    {model.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Type</p>
                    <p className="font-medium">{model.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Version</p>
                    <p className="font-medium">{model.version}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Accuracy</p>
                    <div className="flex items-center gap-2">
                      <Progress value={model.accuracy} className="h-2 flex-1" />
                      <span className="font-medium min-w-0">{model.accuracy}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Deployments</p>
                    <p className="font-medium">{model.deploymentsCount}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 border-t">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Requests Today</p>
                    <p className="font-semibold text-blue-600">{model.requestsToday.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Avg Latency</p>
                    <p className="font-semibold text-green-600">{model.averageLatency}ms</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Memory</p>
                    <p className="font-semibold text-purple-600">{model.memoryUsage}GB</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Settings className="h-3 w-3 mr-1" />
                    Config
                  </Button>
                  {model.status === 'deployed' && (
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <Card className="p-12 text-center">
          <Bot className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No models found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Deploy New Model
          </Button>
        </Card>
      )}
    </div>
  )
}
