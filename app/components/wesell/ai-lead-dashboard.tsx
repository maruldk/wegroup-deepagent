
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Brain, 
  TrendingUp, 
  TrendingDown,
  Target, 
  Users, 
  Phone,
  Mail,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Star,
  Zap,
  Search,
  Filter,
  RefreshCw,
  ArrowRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface Lead {
  id: string
  customer: {
    companyName: string
    firstName: string
    lastName: string
    email: string
    customerTier: string
  }
  leadSource: string
  status: string
  aiQualificationScore: number
  aiConversionProbability: number
  aiPriorityScore: number
  aiRecommendedActions: any[]
  aiNextContactDate: string
  updatedAt: string
}

interface LeadInsights {
  scoringFactors: any
  riskFactors: string[]
  engagementStrategy: string
  insights: string[]
  confidenceLevel: number
}

export default function AILeadDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [scoring, setScoringLeadId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [minScore, setMinScore] = useState(0)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [leadInsights, setLeadInsights] = useState<LeadInsights | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [minScore])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/wesell/ai-lead-scoring?limit=50&minScore=${minScore}`)
      const data = await response.json()

      if (data.success) {
        setLeads(data.data)
      } else {
        toast.error('Failed to fetch leads')
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
      toast.error('Failed to fetch leads')
    } finally {
      setLoading(false)
    }
  }

  const scoreLeadWithAI = async (leadId: string, forceRecalculation = false) => {
    setScoringLeadId(leadId)
    try {
      const response = await fetch('/api/wesell/ai-lead-scoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, forceRecalculation })
      })

      const data = await response.json()

      if (data.success) {
        // Update lead in the list
        setLeads(prev => prev.map(lead => 
          lead.id === leadId 
            ? {
                ...lead,
                aiQualificationScore: data.data.aiQualificationScore,
                aiConversionProbability: data.data.aiConversionProbability,
                aiPriorityScore: data.data.aiPriorityScore,
                aiRecommendedActions: data.data.aiRecommendedActions,
                aiNextContactDate: data.data.aiNextContactDate
              }
            : lead
        ))

        setLeadInsights(data.data.aiInsights)
        toast.success(data.data.cached ? 'AI scoring retrieved' : 'AI scoring completed!')
      } else {
        toast.error(data.error || 'Failed to score lead')
      }
    } catch (error) {
      console.error('Error scoring lead:', error)
      toast.error('Failed to score lead')
    } finally {
      setScoringLeadId(null)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, text: 'Hot Lead' }
    if (score >= 60) return { variant: 'secondary' as const, text: 'Warm Lead' }
    if (score >= 40) return { variant: 'outline' as const, text: 'Cold Lead' }
    return { variant: 'destructive' as const, text: 'Low Priority' }
  }

  const getPriorityIcon = (score: number) => {
    if (score >= 0.8) return <AlertCircle className="w-4 h-4 text-red-500" />
    if (score >= 0.6) return <Clock className="w-4 h-4 text-yellow-500" />
    return <CheckCircle className="w-4 h-4 text-gray-400" />
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchTerm || 
      lead.customer.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <AILeadDashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Lead Intelligence</h2>
          <p className="text-gray-600">AI-powered lead scoring and prioritization</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchLeads}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="CONTACTED">Contacted</SelectItem>
                <SelectItem value="QUALIFIED">Qualified</SelectItem>
                <SelectItem value="PROPOSAL_SENT">Proposal Sent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={minScore.toString()} onValueChange={(value) => setMinScore(parseInt(value))}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Scores</SelectItem>
                <SelectItem value="40">Score 40+</SelectItem>
                <SelectItem value="60">Score 60+</SelectItem>
                <SelectItem value="80">Score 80+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">High Priority Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredLeads.filter(l => l.aiPriorityScore >= 0.8).length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Priority score 80%+</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Hot Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredLeads.filter(l => l.aiQualificationScore >= 80).length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Qualification score 80+</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {filteredLeads.length > 0 
                ? Math.round(filteredLeads.reduce((acc, l) => acc + (l.aiConversionProbability * 100), 0) / filteredLeads.length)
                : 0}%
            </div>
            <p className="text-xs text-gray-600 mt-1">AI predicted</p>
          </CardContent>
        </Card>
      </div>

      {/* Leads List */}
      <div className="grid gap-4">
        {filteredLeads.map((lead, index) => {
          const scoreBadge = getScoreBadge(lead.aiQualificationScore || 0)
          
          return (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer" 
                    onClick={() => setSelectedLead(lead)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {lead.customer.companyName || `${lead.customer.firstName} ${lead.customer.lastName}`}
                        </h3>
                        <Badge {...scoreBadge}>
                          {scoreBadge.text}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {lead.status}
                        </Badge>
                        {getPriorityIcon(lead.aiPriorityScore || 0)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>{lead.customer.email}</span>
                        <span>Source: {lead.leadSource}</span>
                        <span>Tier: {lead.customer.customerTier}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-gray-500">Qualification Score</div>
                          <div className={`text-lg font-bold ${getScoreColor(lead.aiQualificationScore || 0)}`}>
                            {lead.aiQualificationScore || 0}
                          </div>
                          <Progress value={lead.aiQualificationScore || 0} className="h-1 mt-1" />
                        </div>
                        
                        <div>
                          <div className="text-xs text-gray-500">Conversion Probability</div>
                          <div className="text-lg font-bold text-blue-600">
                            {Math.round((lead.aiConversionProbability || 0) * 100)}%
                          </div>
                          <Progress value={(lead.aiConversionProbability || 0) * 100} className="h-1 mt-1" />
                        </div>
                        
                        <div>
                          <div className="text-xs text-gray-500">Priority Score</div>
                          <div className="text-lg font-bold text-purple-600">
                            {Math.round((lead.aiPriorityScore || 0) * 100)}%
                          </div>
                          <Progress value={(lead.aiPriorityScore || 0) * 100} className="h-1 mt-1" />
                        </div>
                      </div>

                      {lead.aiRecommendedActions && lead.aiRecommendedActions.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs font-medium text-gray-700 mb-1">AI Recommendations:</div>
                          <div className="flex flex-wrap gap-1">
                            {lead.aiRecommendedActions.slice(0, 2).map((action: any, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                {typeof action === 'string' ? action : action.action}
                              </Badge>
                            ))}
                            {lead.aiRecommendedActions.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{lead.aiRecommendedActions.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {lead.aiNextContactDate && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          Next contact: {new Date(lead.aiNextContactDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          scoreLeadWithAI(lead.id, true)
                        }}
                        disabled={scoring === lead.id}
                      >
                        {scoring === lead.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Brain className="w-4 h-4" />
                        )}
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {filteredLeads.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-600">Try adjusting your filters or adding new leads</p>
          </CardContent>
        </Card>
      )}

      {/* Lead Details Modal/Sidebar could be added here */}
      {selectedLead && leadInsights && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              AI Insights for {selectedLead.customer.companyName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Scoring Factors</h4>
                <div className="space-y-2">
                  {leadInsights.scoringFactors && Object.entries(leadInsights.scoringFactors).map(([factor, score]) => (
                    <div key={factor} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{factor.replace(/([A-Z])/g, ' $1')}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(score as number) * 100} className="w-20 h-2" />
                        <span className="text-sm font-medium w-8">{Math.round((score as number) * 100)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Risk Factors</h4>
                <ul className="space-y-1">
                  {leadInsights.riskFactors?.map((risk, i) => (
                    <li key={i} className="flex items-center text-sm text-red-600">
                      <AlertCircle className="w-3 h-3 mr-2" />
                      {risk}
                    </li>
                  ))}
                </ul>

                <h4 className="font-medium mb-3 mt-4">Key Insights</h4>
                <ul className="space-y-1">
                  {leadInsights.insights?.map((insight, i) => (
                    <li key={i} className="flex items-center text-sm text-blue-600">
                      <Zap className="w-3 h-3 mr-2" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function AILeadDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mt-2 animate-pulse"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-16 bg-gray-200 rounded"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
