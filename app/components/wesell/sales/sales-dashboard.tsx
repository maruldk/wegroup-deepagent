
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Search, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  MoreHorizontal,
  Brain,
  Zap,
  FileText,
  Users,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { CreateOpportunityForm, OpportunityStage } from '@/lib/types'

interface Opportunity {
  id: string
  opportunityName: string
  customerName: string
  customerCompany: string
  stage: string
  estimatedValue: number
  estimatedCloseDate: string
  probability: number
  aiCloseProbability: number
  aiRevenuePrediktion: number
  aiRiskFactors: string[]
  aiRecommendations: string[]
  tags: string[]
  assignedTo: string
  createdAt: string
}

interface Lead {
  id: string
  customerName: string
  companyName: string
  status: string
  aiQualificationScore: number
  aiConversionProbability: number
  aiPriorityScore: number
  aiNextContactDate: string
  lastContactDate: string
  source: string
}

export default function WeSellSales() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('opportunities')
  const [newOpportunity, setNewOpportunity] = useState<CreateOpportunityForm>({
    customerId: '',
    opportunityName: '',
    description: '',
    stage: OpportunityStage.DISCOVERY,
    estimatedValue: 0,
    estimatedCloseDate: '',
    probability: 0,
    tags: []
  })

  useEffect(() => {
    fetchData()
  }, [stageFilter])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const mockOpportunities: Opportunity[] = [
        {
          id: '1',
          opportunityName: 'Enterprise Software Suite',
          customerName: 'Max Mustermann',
          customerCompany: 'TechCorp Solutions GmbH',
          stage: 'NEGOTIATION',
          estimatedValue: 45000,
          estimatedCloseDate: '2024-01-30',
          probability: 80,
          aiCloseProbability: 87,
          aiRevenuePrediktion: 42000,
          aiRiskFactors: ['Budget-Genehmigung ausstehend', 'Konkurrenz aktiv'],
          aiRecommendations: ['Exklusiv-Rabatt anbieten', 'C-Level Meeting vereinbaren'],
          tags: ['enterprise', 'software', 'high-value'],
          assignedTo: 'Sales Rep 1',
          createdAt: '2024-01-01T10:00:00Z'
        },
        {
          id: '2',
          opportunityName: 'Marketing Automation Platform',
          customerName: 'Anna Schmidt',
          customerCompany: 'Marketing Plus GmbH',
          stage: 'PROPOSAL',
          estimatedValue: 28000,
          estimatedCloseDate: '2024-02-15',
          probability: 65,
          aiCloseProbability: 71,
          aiRevenuePrediktion: 26500,
          aiRiskFactors: ['Entscheidungsprozess verlängert'],
          aiRecommendations: ['ROI-Kalkulation bereitstellen', 'Referenzkunden vorstellen'],
          tags: ['marketing', 'automation', 'mid-market'],
          assignedTo: 'Sales Rep 2',
          createdAt: '2024-01-05T14:30:00Z'
        },
        {
          id: '3',
          opportunityName: 'Digital Transformation Initiative',
          customerName: 'Dr. Thomas Weber',
          customerCompany: 'InnovateTech AG',
          stage: 'DISCOVERY',
          estimatedValue: 75000,
          estimatedCloseDate: '2024-03-20',
          probability: 45,
          aiCloseProbability: 52,
          aiRevenuePrediktion: 68000,
          aiRiskFactors: ['Komplexe Anforderungen', 'Lange Entscheidungszyklen'],
          aiRecommendations: ['Pilotprojekt vorschlagen', 'Technische Expertise zeigen'],
          tags: ['transformation', 'enterprise', 'strategic'],
          assignedTo: 'Sales Rep 1',
          createdAt: '2024-01-08T11:15:00Z'
        }
      ]

      const mockLeads: Lead[] = [
        {
          id: '1',
          customerName: 'Sarah Müller',
          companyName: 'StartupTech GmbH',
          status: 'NEW',
          aiQualificationScore: 75,
          aiConversionProbability: 0.68,
          aiPriorityScore: 82,
          aiNextContactDate: '2024-01-15T10:00:00Z',
          lastContactDate: '2024-01-12T16:30:00Z',
          source: 'WEBSITE'
        },
        {
          id: '2',
          customerName: 'Michael Wagner',
          companyName: 'ConsultingPro AG',
          status: 'QUALIFIED',
          aiQualificationScore: 89,
          aiConversionProbability: 0.84,
          aiPriorityScore: 94,
          aiNextContactDate: '2024-01-14T14:00:00Z',
          lastContactDate: '2024-01-13T09:15:00Z',
          source: 'REFERRAL'
        },
        {
          id: '3',
          customerName: 'Lisa Hoffmann',
          companyName: 'DigitalFirst Solutions',
          status: 'CONTACTED',
          aiQualificationScore: 63,
          aiConversionProbability: 0.55,
          aiPriorityScore: 71,
          aiNextContactDate: '2024-01-16T11:30:00Z',
          lastContactDate: '2024-01-11T13:45:00Z',
          source: 'SOCIAL_MEDIA'
        }
      ]
      
      setOpportunities(mockOpportunities)
      setLeads(mockLeads)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching sales data:', error)
      setLoading(false)
    }
  }

  const handleCreateOpportunity = async () => {
    try {
      console.log('Creating opportunity:', newOpportunity)
      
      setNewOpportunity({
        customerId: '',
        opportunityName: '',
        description: '',
        stage: OpportunityStage.DISCOVERY,
        estimatedValue: 0,
        estimatedCloseDate: '',
        probability: 0,
        tags: []
      })
      setCreateDialogOpen(false)
      
      fetchData()
    } catch (error) {
      console.error('Error creating opportunity:', error)
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'DISCOVERY': return 'bg-blue-100 text-blue-800'
      case 'QUALIFICATION': return 'bg-indigo-100 text-indigo-800'
      case 'PROPOSAL': return 'bg-purple-100 text-purple-800'
      case 'NEGOTIATION': return 'bg-orange-100 text-orange-800'
      case 'CLOSED_WON': return 'bg-green-100 text-green-800'
      case 'CLOSED_LOST': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800'
      case 'CONTACTED': return 'bg-yellow-100 text-yellow-800'
      case 'QUALIFIED': return 'bg-green-100 text-green-800'
      case 'PROPOSAL_SENT': return 'bg-purple-100 text-purple-800'
      case 'CONVERTED': return 'bg-green-100 text-green-800'
      case 'LOST': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityLevel = (score: number) => {
    if (score >= 80) return { label: 'Hoch', color: 'text-red-600' }
    if (score >= 60) return { label: 'Mittel', color: 'text-yellow-600' }
    return { label: 'Niedrig', color: 'text-green-600' }
  }

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.opportunityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.customerCompany.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStage = stageFilter === 'all' || opp.stage === stageFilter
    return matchesSearch && matchesStage
  })

  const filteredLeads = leads.filter(lead => {
    return lead.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           lead.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  })

  if (loading) {
    return <SalesSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-600 mt-1">
            Intelligente Opportunities und Leads mit KI-gestützter Analyse und Forecasting
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Neue Opportunity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Neue Sales Opportunity</DialogTitle>
              <DialogDescription>
                Erstellen Sie eine neue Verkaufschance mit KI-gestützter Bewertung.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="opportunityName">Opportunity Name</Label>
                <Input
                  id="opportunityName"
                  value={newOpportunity.opportunityName}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, opportunityName: e.target.value })}
                  placeholder="Name der Verkaufschance"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={newOpportunity.description}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, description: e.target.value })}
                  placeholder="Beschreibung der Opportunity..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stage">Stage</Label>
                  <Select 
                    value={newOpportunity.stage} 
                    onValueChange={(value) => setNewOpportunity({ ...newOpportunity, stage: value as OpportunityStage })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DISCOVERY">Discovery</SelectItem>
                      <SelectItem value="QUALIFICATION">Qualification</SelectItem>
                      <SelectItem value="PROPOSAL">Proposal</SelectItem>
                      <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedValue">Geschätzter Wert (€)</Label>
                  <Input
                    id="estimatedValue"
                    type="number"
                    value={newOpportunity.estimatedValue}
                    onChange={(e) => setNewOpportunity({ ...newOpportunity, estimatedValue: parseInt(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="closeDate">Geplantes Abschlussdatum</Label>
                  <Input
                    id="closeDate"
                    type="date"
                    value={newOpportunity.estimatedCloseDate}
                    onChange={(e) => setNewOpportunity({ ...newOpportunity, estimatedCloseDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="probability">Wahrscheinlichkeit (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    min="0"
                    max="100"
                    value={newOpportunity.probability}
                    onChange={(e) => setNewOpportunity({ ...newOpportunity, probability: parseInt(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleCreateOpportunity} disabled={!newOpportunity.opportunityName}>
                Opportunity erstellen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pipeline Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pipeline Wert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              €{(opportunities.reduce((sum, opp) => sum + opp.estimatedValue, 0) / 1000).toFixed(0)}k
            </div>
            <p className="text-xs text-gray-600 mt-1">{opportunities.length} Opportunities</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">KI Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              €{(opportunities.reduce((sum, opp) => sum + opp.aiRevenuePrediktion, 0) / 1000).toFixed(0)}k
            </div>
            <p className="text-xs text-gray-600 mt-1">Predicted Revenue</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Qualified Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              {leads.filter(lead => lead.aiQualificationScore >= 70).length}
            </div>
            <p className="text-xs text-gray-600 mt-1">High-Quality Leads</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Opportunities und Leads durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Stage filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Stages</SelectItem>
            <SelectItem value="DISCOVERY">Discovery</SelectItem>
            <SelectItem value="QUALIFICATION">Qualification</SelectItem>
            <SelectItem value="PROPOSAL">Proposal</SelectItem>
            <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
            <SelectItem value="CLOSED_WON">Closed Won</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs for Opportunities and Leads */}
      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="opportunities" className="flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Opportunities ({filteredOpportunities.length})
          </TabsTrigger>
          <TabsTrigger value="leads" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Leads ({filteredLeads.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-green-600 transition-colors mb-2">
                          {opportunity.opportunityName}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {opportunity.customerCompany} • {opportunity.customerName}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stage and Value */}
                    <div className="flex items-center justify-between">
                      <Badge className={getStageColor(opportunity.stage)}>
                        {opportunity.stage}
                      </Badge>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          €{(opportunity.estimatedValue / 1000).toFixed(0)}k
                        </div>
                        <div className="text-xs text-gray-500">
                          KI: €{(opportunity.aiRevenuePrediktion / 1000).toFixed(0)}k
                        </div>
                      </div>
                    </div>

                    {/* AI Probability */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">KI Close Probability</span>
                        <span className="font-medium">{opportunity.aiCloseProbability}%</span>
                      </div>
                      <Progress value={opportunity.aiCloseProbability} className="h-2" />
                    </div>

                    {/* Close Date */}
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      Geplant: {new Date(opportunity.estimatedCloseDate).toLocaleDateString('de-DE')}
                    </div>

                    {/* AI Insights */}
                    {opportunity.aiRecommendations.length > 0 && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Brain className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-sm font-medium text-blue-800">KI-Empfehlungen:</span>
                        </div>
                        <ul className="text-sm text-blue-700 space-y-1">
                          {opportunity.aiRecommendations.slice(0, 2).map((rec, i) => (
                            <li key={i} className="flex items-start">
                              <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Risk Factors */}
                    {opportunity.aiRiskFactors.length > 0 && (
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <AlertCircle className="w-4 h-4 text-orange-600 mr-2" />
                          <span className="text-sm font-medium text-orange-800">Risikofaktoren:</span>
                        </div>
                        <ul className="text-sm text-orange-700 space-y-1">
                          {opportunity.aiRiskFactors.slice(0, 2).map((risk, i) => (
                            <li key={i} className="flex items-start">
                              <span className="w-1 h-1 bg-orange-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                        Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Zap className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <div className="space-y-4">
            {filteredLeads.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                              {lead.customerName}
                            </h3>
                            <Badge className={getLeadStatusColor(lead.status)}>
                              {lead.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{lead.companyName}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Quelle: {lead.source}</span>
                            <span>Letzter Kontakt: {new Date(lead.lastContactDate).toLocaleDateString('de-DE')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        {/* AI Qualification Score */}
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Brain className="w-4 h-4 text-purple-500 mr-1" />
                            <span className="text-sm font-medium">KI-Score</span>
                          </div>
                          <div className="text-lg font-bold text-purple-600">
                            {lead.aiQualificationScore}%
                          </div>
                        </div>

                        {/* Conversion Probability */}
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm font-medium">Conversion</span>
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            {(lead.aiConversionProbability * 100).toFixed(0)}%
                          </div>
                        </div>

                        {/* Priority */}
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Target className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">Priorität</span>
                          </div>
                          <div className={`text-lg font-bold ${getPriorityLevel(lead.aiPriorityScore).color}`}>
                            {getPriorityLevel(lead.aiPriorityScore).label}
                          </div>
                        </div>

                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Next Contact Date */}
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">
                          Nächster Kontakt: {new Date(lead.aiNextContactDate).toLocaleDateString('de-DE')} um {new Date(lead.aiNextContactDate).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SalesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex gap-4">
        <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="flex space-x-6">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="w-16 h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
