
// WeGroup Platform - AI Model Discovery Interface
// Intelligent Model Research & Recommendations

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  Search, 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Clock,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Star,
  Loader2,
  Brain,
  BarChart3
} from 'lucide-react'

interface DiscoveryRequest {
  discoveryType: string
  searchCriteria: {
    useCases: string[]
    preferredProvider?: string
    budgetLimit?: number
    performanceRequirement?: string
  }
  targetUseCases: string[]
}

interface FoundModel {
  name: string
  provider: string
  modelType: string
  description: string
  isOpenSource: boolean
  licenseType: string
  apiEndpoint: string
  primaryPurpose: string
  useCases: string[]
  supportedLanguages: string[]
  costPerToken: number
  accuracy: number
  latency: number
  riskLevel: string
  securityFeatures: string[]
  lastUpdated: string
}

interface ModelRecommendation {
  modelId: string
  rank: number
  reasoning: string
  pros: string[]
  cons: string[]
  fitScore: number
  implementationEffort: string
  expectedROI: string
}

export default function ModelDiscoveryInterface() {
  const [isDiscovering, setIsDiscovering] = useState(false)
  const [discoveryProgress, setDiscoveryProgress] = useState(0)
  const [discoveryResults, setDiscoveryResults] = useState<any>(null)
  const [searchCriteria, setSearchCriteria] = useState<DiscoveryRequest>({
    discoveryType: 'AUTOMATED_SEARCH',
    searchCriteria: {
      useCases: [],
      budgetLimit: 1000,
      performanceRequirement: 'high'
    },
    targetUseCases: []
  })
  const [recentDiscoveries, setRecentDiscoveries] = useState<any[]>([])

  useEffect(() => {
    fetchRecentDiscoveries()
  }, [])

  const fetchRecentDiscoveries = async () => {
    try {
      const response = await fetch('/api/ai-engine/admin/discovery')
      const data = await response.json()
      
      if (data.success) {
        setRecentDiscoveries(data.discoveries || [])
      }
    } catch (error) {
      console.error('Failed to fetch discoveries:', error)
    }
  }

  const startDiscovery = async () => {
    setIsDiscovering(true)
    setDiscoveryProgress(0)
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setDiscoveryProgress(prev => {
          const newProgress = prev + 10
          if (newProgress >= 90) {
            clearInterval(progressInterval)
          }
          return Math.min(newProgress, 90)
        })
      }, 500)

      const response = await fetch('/api/ai-engine/admin/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchCriteria)
      })

      const data = await response.json()
      
      clearInterval(progressInterval)
      setDiscoveryProgress(100)
      
      if (data.success) {
        setDiscoveryResults(data.discovery.results)
        await fetchRecentDiscoveries()
      }
    } catch (error) {
      console.error('Discovery failed:', error)
    } finally {
      setIsDiscovering(false)
      setTimeout(() => setDiscoveryProgress(0), 2000)
    }
  }

  const getModelSourceColor = (isOpenSource: boolean) => {
    return isOpenSource 
      ? 'bg-green-100 text-green-800' 
      : 'bg-blue-100 text-blue-800'
  }

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getFitScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600'
    if (score >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Model Discovery</h1>
          <p className="text-gray-600 mt-2">
            Intelligent research and recommendations for optimal AI models
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Discovery Configuration */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Discovery Configuration
              </CardTitle>
              <CardDescription>Configure your model search parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Discovery Type</label>
                <Select 
                  value={searchCriteria.discoveryType} 
                  onValueChange={(value) => setSearchCriteria(prev => ({ 
                    ...prev, 
                    discoveryType: value 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUTOMATED_SEARCH">Automated Search</SelectItem>
                    <SelectItem value="PERFORMANCE_UPGRADE">Performance Upgrade</SelectItem>
                    <SelectItem value="COST_OPTIMIZATION">Cost Optimization</SelectItem>
                    <SelectItem value="COMPETITIVE_ANALYSIS">Competitive Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Target Use Cases</label>
                <Textarea
                  placeholder="e.g., text generation, code analysis, customer support..."
                  value={searchCriteria.targetUseCases.join(', ')}
                  onChange={(e) => setSearchCriteria(prev => ({
                    ...prev,
                    targetUseCases: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Budget Limit (USD/month)</label>
                <Input
                  type="number"
                  value={searchCriteria.searchCriteria.budgetLimit}
                  onChange={(e) => setSearchCriteria(prev => ({
                    ...prev,
                    searchCriteria: {
                      ...prev.searchCriteria,
                      budgetLimit: parseInt(e.target.value) || 0
                    }
                  }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Performance Requirement</label>
                <Select
                  value={searchCriteria.searchCriteria.performanceRequirement}
                  onValueChange={(value) => setSearchCriteria(prev => ({
                    ...prev,
                    searchCriteria: {
                      ...prev.searchCriteria,
                      performanceRequirement: value
                    }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="high">High Performance</SelectItem>
                    <SelectItem value="enterprise">Enterprise Grade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={startDiscovery} 
                disabled={isDiscovering}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isDiscovering ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Discovering...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Start Discovery
                  </>
                )}
              </Button>

              {isDiscovering && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{discoveryProgress}%</span>
                  </div>
                  <Progress value={discoveryProgress} />
                  <p className="text-xs text-gray-600">
                    Searching models, analyzing performance, comparing costs...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Discovery Results */}
        <div className="lg:col-span-2">
          {discoveryResults ? (
            <div className="space-y-6">
              {/* Analysis Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Discovery Analysis
                  </CardTitle>
                  <CardDescription>Summary of search results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {discoveryResults.analysis?.totalModelsFound || 0}
                      </div>
                      <div className="text-sm text-gray-600">Models Found</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {discoveryResults.analysis?.openSourceCount || 0}
                      </div>
                      <div className="text-sm text-gray-600">Open Source</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {((discoveryResults.analysis?.avgAccuracy || 0) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Avg Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        ${(discoveryResults.analysis?.avgCostPerToken || 0).toFixed(4)}
                      </div>
                      <div className="text-sm text-gray-600">Avg Cost/Token</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Top Recommendations
                  </CardTitle>
                  <CardDescription>Best matches for your requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {discoveryResults.recommendations?.slice(0, 3).map((rec: ModelRecommendation, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">#{rec.rank}</Badge>
                              <span className="font-medium">{rec.modelId}</span>
                              <Badge className={`${getFitScoreColor(rec.fitScore)} bg-transparent border-current`}>
                                {(rec.fitScore * 100).toFixed(0)}% fit
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{rec.reasoning}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-green-600">Pros:</span>
                            <ul className="mt-1 space-y-1">
                              {rec.pros?.slice(0, 2).map((pro: string, i: number) => (
                                <li key={i} className="text-gray-600">• {pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="font-medium text-red-600">Cons:</span>
                            <ul className="mt-1 space-y-1">
                              {rec.cons?.slice(0, 2).map((con: string, i: number) => (
                                <li key={i} className="text-gray-600">• {con}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="font-medium">Implementation:</span>
                            <p className="mt-1 text-gray-600">{rec.implementationEffort} effort</p>
                            <p className="text-gray-600">ROI: {rec.expectedROI}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Found Models */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Discovered Models
                  </CardTitle>
                  <CardDescription>Complete list of found models</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {discoveryResults.foundModels?.map((model: FoundModel, index: number) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{model.name}</h4>
                            <p className="text-sm text-gray-600">{model.provider}</p>
                          </div>
                          <Badge className={getModelSourceColor(model.isOpenSource)}>
                            {model.isOpenSource ? 'Open Source' : 'Commercial'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-700">{model.description}</p>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Accuracy:</span>
                            <span className="font-medium">{(model.accuracy * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cost/Token:</span>
                            <span className="font-medium">${model.costPerToken?.toFixed(6)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Latency:</span>
                            <span className="font-medium">{model.latency}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Risk Level:</span>
                            <Badge className={getRiskColor(model.riskLevel)}>
                              {model.riskLevel}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Details
                          </Button>
                          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                            Register
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start Model Discovery</h3>
                <p className="text-gray-600 text-center">
                  Configure your search parameters and click "Start Discovery" to find the best AI models for your use case.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recent Discoveries */}
      {recentDiscoveries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Discoveries
            </CardTitle>
            <CardDescription>Previous discovery sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDiscoveries.slice(0, 5).map((discovery) => (
                <div key={discovery.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{discovery.discoveryType.replace(/_/g, ' ')}</div>
                    <div className="text-sm text-gray-600">
                      {discovery.targetUseCases?.join(', ') || 'No specific use cases'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={discovery.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {discovery.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(discovery.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
