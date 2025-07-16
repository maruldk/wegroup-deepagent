
// WeGroup Platform - AI Model Registry Dashboard
// Enhanced Model Management Interface

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Brain, 
  Search, 
  Plus, 
  Settings, 
  TrendingUp, 
  DollarSign,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  Cpu,
  Zap,
  BarChart3
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface AIModel {
  id: string
  name: string
  description: string
  modelType: string
  version: string
  status: string
  modelSource: string
  isOpenSource: boolean
  provider: string
  primaryPurpose: string
  accuracy: number
  costPerRequest: number
  riskLevel: string
  totalCost: number
  predictionCount: number
  needsApproval: boolean
  lastTestScore: number
  createdAt: string
}

export default function ModelRegistryDashboard() {
  const [models, setModels] = useState<AIModel[]>([])
  const [filteredModels, setFilteredModels] = useState<AIModel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchModels()
  }, [])

  useEffect(() => {
    filterModels()
  }, [models, searchTerm, sourceFilter, statusFilter])

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/ai-engine/admin/models')
      const data = await response.json()
      
      if (data.success) {
        setModels(data.models || [])
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch models:', error)
      setLoading(false)
    }
  }

  const filterModels = () => {
    let filtered = [...models]

    if (searchTerm) {
      filtered = filtered.filter(model => 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.provider?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(model => model.modelSource === sourceFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(model => model.status === statusFilter)
    }

    setFilteredModels(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'deployed':
        return 'bg-green-100 text-green-800'
      case 'ready':
        return 'bg-blue-100 text-blue-800'
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800'
      case 'training':
        return 'bg-purple-100 text-purple-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'critical':
        return 'bg-red-200 text-red-900'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const modelStats = {
    total: models.length,
    deployed: models.filter(m => m.status === 'DEPLOYED').length,
    openSource: models.filter(m => m.isOpenSource).length,
    commercial: models.filter(m => !m.isOpenSource).length,
    needingApproval: models.filter(m => m.needsApproval).length,
    avgAccuracy: models.length > 0 ? models.reduce((sum, m) => sum + (m.accuracy || 0), 0) / models.length : 0
  }

  const sourceDistribution = [
    { name: 'Open Source', value: modelStats.openSource, color: '#60B5FF' },
    { name: 'Commercial', value: modelStats.commercial, color: '#FF9149' },
  ]

  const performanceData = models.slice(0, 10).map(model => ({
    name: model.name.substring(0, 15) + '...',
    accuracy: (model.accuracy || 0) * 100,
    testScore: (model.lastTestScore || 0) * 100,
    cost: model.costPerRequest || 0
  }))

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Model Registry</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive model management and administration
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Register Model
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Models</CardTitle>
            <Brain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modelStats.total}</div>
            <p className="text-xs text-gray-600">{modelStats.deployed} deployed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(modelStats.avgAccuracy * 100).toFixed(1)}%</div>
            <p className="text-xs text-gray-600">across all models</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modelStats.needingApproval}</div>
            <p className="text-xs text-gray-600">require review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Source</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modelStats.openSource}</div>
            <p className="text-xs text-gray-600">of {modelStats.total} models</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="models" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="models">Model Registry</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="discovery">Discovery</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search models, providers, descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="OPEN_SOURCE">Open Source</SelectItem>
                <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                <SelectItem value="INTERNAL">Internal</SelectItem>
                <SelectItem value="HUGGING_FACE">Hugging Face</SelectItem>
                <SelectItem value="OPENAI">OpenAI</SelectItem>
                <SelectItem value="ANTHROPIC">Anthropic</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="DEPLOYED">Deployed</SelectItem>
                <SelectItem value="READY">Ready</SelectItem>
                <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                <SelectItem value="TRAINING">Training</SelectItem>
                <SelectItem value="ERROR">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model) => (
              <Card key={model.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <CardDescription>{model.primaryPurpose}</CardDescription>
                    </div>
                    {model.needsApproval && (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status</span>
                      <Badge className={getStatusColor(model.status)}>
                        {model.status}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Source</span>
                      <Badge variant="outline">
                        {model.isOpenSource ? 'Open Source' : 'Commercial'}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Provider</span>
                      <span className="font-medium">{model.provider || 'Internal'}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Accuracy</span>
                      <span className="font-medium">{((model.accuracy || 0) * 100).toFixed(1)}%</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Risk Level</span>
                      <Badge className={getRiskColor(model.riskLevel)}>
                        {model.riskLevel}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Predictions</span>
                      <span className="font-medium">{model.predictionCount || 0}</span>
                    </div>

                    <div className="pt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-3 w-3 mr-1" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        Test
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredModels.length === 0 && (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No models found</h3>
              <p className="text-gray-600">Try adjusting your filters or register a new model.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model Source Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Model Source Distribution
                </CardTitle>
                <CardDescription>Open source vs commercial models</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sourceDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {sourceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Model Performance
                </CardTitle>
                <CardDescription>Accuracy and test scores comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={60}
                      interval={0}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="accuracy" fill="#60B5FF" name="Accuracy %" />
                    <Bar dataKey="testScore" fill="#FF9149" name="Test Score %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Pending Approvals
              </CardTitle>
              <CardDescription>Models requiring super-admin review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {models.filter(m => m.needsApproval).map((model) => (
                  <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{model.name}</div>
                      <div className="text-sm text-gray-600">
                        {model.modelType} • {model.provider} • Risk: {model.riskLevel}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getRiskColor(model.riskLevel)}>
                        {model.riskLevel} Risk
                      </Badge>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
                
                {models.filter(m => m.needsApproval).length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">All models approved</h3>
                    <p className="text-gray-600">No pending approvals at this time.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discovery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Model Discovery
              </CardTitle>
              <CardDescription>Find and evaluate new AI models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Zap className="h-4 w-4 mr-2" />
                  Start Automated Discovery
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Upgrade
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <DollarSign className="h-5 w-5" />
                    Cost Optimization
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <ExternalLink className="h-5 w-5" />
                    Competitive Analysis
                  </Button>
                </div>
                
                <div className="text-center py-8 text-gray-600">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p>Click "Start Automated Discovery" to begin searching for new models</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
