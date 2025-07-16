
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3,
  TrendingUp,
  Users,
  Euro,
  Truck,
  Brain,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Share,
  Mail,
  Eye,
  Settings
} from 'lucide-react'

interface Report {
  id: string
  name: string
  description: string
  type: 'executive' | 'financial' | 'operational' | 'hr' | 'logistics' | 'ai_analytics'
  modules: string[]
  lastGenerated: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'on_demand'
  status: 'ready' | 'generating' | 'scheduled' | 'error'
  size: string
  format: 'pdf' | 'excel' | 'powerpoint' | 'dashboard'
  recipients: string[]
  insights: string[]
  kpis: ReportKPI[]
}

interface ReportKPI {
  name: string
  value: string
  trend: 'up' | 'down' | 'stable'
  change: string
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: string
  modules: string[]
  estimatedTime: string
  insights: number
}

export function AdvancedReportingEngine() {
  const [reports, setReports] = useState<Report[]>([])
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedModule, setSelectedModule] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReportingData()
  }, [])

  const loadReportingData = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setReports([
        {
          id: '1',
          name: 'Executive Dashboard Q1 2024',
          description: 'Comprehensive business performance overview for executive leadership',
          type: 'executive',
          modules: ['HR', 'Finance', 'Logistics', 'AI-Engine'],
          lastGenerated: '2024-01-15T09:00:00',
          frequency: 'weekly',
          status: 'ready',
          size: '2.4 MB',
          format: 'pdf',
          recipients: ['ceo@wegroup.de', 'cfo@wegroup.de'],
          insights: [
            '15% Effizienzsteigerung in Finance',
            'HR KI-Autonomie erreicht 90%',
            'Logistics Kosteneinsparung: €45K'
          ],
          kpis: [
            { name: 'Revenue Growth', value: '12.5%', trend: 'up', change: '+2.3%' },
            { name: 'Operational Efficiency', value: '89.7%', trend: 'up', change: '+5.2%' },
            { name: 'Employee Satisfaction', value: '8.4/10', trend: 'stable', change: '0%' },
            { name: 'AI Autonomy', value: '89.7%', trend: 'up', change: '+12.1%' }
          ]
        },
        {
          id: '2',
          name: 'Financial Performance Analysis',
          description: 'Detailed financial metrics and forecasting analysis',
          type: 'financial',
          modules: ['Finance'],
          lastGenerated: '2024-01-14T16:30:00',
          frequency: 'monthly',
          status: 'ready',
          size: '1.8 MB',
          format: 'excel',
          recipients: ['cfo@wegroup.de', 'finance-team@wegroup.de'],
          insights: [
            'Q1 Revenue forecast: €2.4M (+18%)',
            'Cash flow optimization achieved',
            'Budget efficiency improved by 23%'
          ],
          kpis: [
            { name: 'Revenue', value: '€2.1M', trend: 'up', change: '+18%' },
            { name: 'Profit Margin', value: '24.3%', trend: 'up', change: '+3.1%' },
            { name: 'Cash Flow', value: '€385K', trend: 'up', change: '+12%' }
          ]
        },
        {
          id: '3',
          name: 'HR Analytics Deep Dive',
          description: 'Comprehensive human resources performance and AI insights',
          type: 'hr',
          modules: ['HR'],
          lastGenerated: '2024-01-13T14:15:00',
          frequency: 'weekly',
          status: 'generating',
          size: '1.2 MB',
          format: 'powerpoint',
          recipients: ['hr@wegroup.de'],
          insights: [
            'Recruiting efficiency up 45%',
            'Employee retention at 94%',
            'AI-powered performance tracking'
          ],
          kpis: [
            { name: 'Recruitment Time', value: '18 days', trend: 'down', change: '-45%' },
            { name: 'Employee Retention', value: '94%', trend: 'up', change: '+2%' },
            { name: 'Performance Score', value: '87/100', trend: 'up', change: '+5%' }
          ]
        },
        {
          id: '4',
          name: 'Logistics Optimization Report',
          description: 'Supply chain performance and route optimization analysis',
          type: 'logistics',
          modules: ['Logistics'],
          lastGenerated: '2024-01-12T11:45:00',
          frequency: 'weekly',
          status: 'ready',
          size: '3.1 MB',
          format: 'dashboard',
          recipients: ['logistics@wegroup.de'],
          insights: [
            'Route optimization: 28% efficiency gain',
            'Inventory turnover improved 35%',
            'Supply chain resilience strengthened'
          ],
          kpis: [
            { name: 'Delivery Efficiency', value: '96.2%', trend: 'up', change: '+4.1%' },
            { name: 'Cost per Delivery', value: '€12.50', trend: 'down', change: '-18%' },
            { name: 'Inventory Turnover', value: '4.2x', trend: 'up', change: '+35%' }
          ]
        },
        {
          id: '5',
          name: 'AI Performance Analytics',
          description: 'AI model performance, decision accuracy, and automation metrics',
          type: 'ai_analytics',
          modules: ['AI-Engine', 'HR', 'Finance', 'Logistics'],
          lastGenerated: '2024-01-11T08:30:00',
          frequency: 'daily',
          status: 'scheduled',
          size: '956 KB',
          format: 'pdf',
          recipients: ['ai-team@wegroup.de', 'cto@wegroup.de'],
          insights: [
            'Overall AI accuracy: 94.8%',
            'Decision automation rate: 89.7%',
            'Cost savings: €125K annually'
          ],
          kpis: [
            { name: 'AI Accuracy', value: '94.8%', trend: 'up', change: '+2.1%' },
            { name: 'Automation Rate', value: '89.7%', trend: 'up', change: '+15.3%' },
            { name: 'Cost Savings', value: '€125K', trend: 'up', change: '+42%' }
          ]
        }
      ])

      setTemplates([
        {
          id: 't1',
          name: 'Executive Summary',
          description: 'High-level business overview for C-level executives',
          category: 'Executive',
          modules: ['HR', 'Finance', 'Logistics', 'AI-Engine'],
          estimatedTime: '5 min',
          insights: 8
        },
        {
          id: 't2',
          name: 'Financial Deep Dive',
          description: 'Comprehensive financial analysis with forecasting',
          category: 'Finance',
          modules: ['Finance'],
          estimatedTime: '8 min',
          insights: 12
        },
        {
          id: 't3',
          name: 'HR Performance Review',
          description: 'Employee performance and recruitment analytics',
          category: 'HR',
          modules: ['HR'],
          estimatedTime: '6 min',
          insights: 10
        },
        {
          id: 't4',
          name: 'Supply Chain Optimization',
          description: 'Logistics efficiency and cost optimization report',
          category: 'Logistics',
          modules: ['Logistics'],
          estimatedTime: '7 min',
          insights: 9
        },
        {
          id: 't5',
          name: 'AI Model Performance',
          description: 'AI accuracy, automation rates, and impact analysis',
          category: 'AI & Analytics',
          modules: ['AI-Engine'],
          estimatedTime: '4 min',
          insights: 15
        },
        {
          id: 't6',
          name: 'Cross-Module Analytics',
          description: 'Integrated analysis across all business modules',
          category: 'Analytics',
          modules: ['HR', 'Finance', 'Logistics', 'AI-Engine'],
          estimatedTime: '12 min',
          insights: 20
        }
      ])
      setLoading(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      ready: 'bg-green-100 text-green-700',
      generating: 'bg-blue-100 text-blue-700',
      scheduled: 'bg-yellow-100 text-yellow-700',
      error: 'bg-red-100 text-red-700'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'generating':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
      case 'scheduled':
        return <Calendar className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <CheckCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-500" />
      case 'down':
        return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'executive':
        return <BarChart3 className="w-4 h-4 text-purple-500" />
      case 'financial':
        return <Euro className="w-4 h-4 text-green-500" />
      case 'hr':
        return <Users className="w-4 h-4 text-blue-500" />
      case 'logistics':
        return <Truck className="w-4 h-4 text-orange-500" />
      case 'ai_analytics':
        return <Brain className="w-4 h-4 text-indigo-500" />
      default:
        return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || report.type === selectedCategory
    const matchesModule = selectedModule === 'all' || report.modules.includes(selectedModule)
    return matchesSearch && matchesCategory && matchesModule
  })

  const totalReports = reports.length
  const readyReports = reports.filter(r => r.status === 'ready').length
  const scheduledReports = reports.filter(r => r.status === 'scheduled').length
  const automatedReports = reports.filter(r => r.frequency !== 'on_demand').length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Reporting</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Reporting Engine</h1>
          <p className="text-gray-600 mt-1">KI-gestützte Berichtsgenerierung mit intelligenten Insights</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Neuer Bericht
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gesamt-Berichte</p>
                <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
                <p className="text-xs text-blue-600">Alle Kategorien</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bereit</p>
                <p className="text-2xl font-bold text-green-600">{readyReports}</p>
                <p className="text-xs text-green-600">Zum Download</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Geplant</p>
                <p className="text-2xl font-bold text-yellow-600">{scheduledReports}</p>
                <p className="text-xs text-yellow-600">Automatisch</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Automatisiert</p>
                <p className="text-2xl font-bold text-purple-600">{automatedReports}</p>
                <p className="text-xs text-purple-600">KI-generiert</p>
              </div>
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Aktuelle Berichte</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="automation">Automatisierung</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Berichte durchsuchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Kategorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Kategorien</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="logistics">Logistics</SelectItem>
                      <SelectItem value="ai_analytics">AI Analytics</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedModule} onValueChange={setSelectedModule}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Modul" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Logistics">Logistics</SelectItem>
                      <SelectItem value="AI-Engine">AI-Engine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(report.type)}
                          <h3 className="font-semibold text-gray-900">{report.name}</h3>
                        </div>
                        <Badge className={getStatusColor(report.status)}>
                          {getStatusIcon(report.status)}
                          <span className="ml-1">
                            {report.status === 'ready' && 'Bereit'}
                            {report.status === 'generating' && 'Generierung...'}
                            {report.status === 'scheduled' && 'Geplant'}
                            {report.status === 'error' && 'Fehler'}
                          </span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {report.format.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {report.frequency === 'daily' && 'Täglich'}
                          {report.frequency === 'weekly' && 'Wöchentlich'}
                          {report.frequency === 'monthly' && 'Monatlich'}
                          {report.frequency === 'quarterly' && 'Quartalsweise'}
                          {report.frequency === 'on_demand' && 'On-Demand'}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{report.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Module: </span>
                          <span className="font-medium">{report.modules.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Größe: </span>
                          <span className="font-medium">{report.size}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Erstellt: </span>
                          <span className="font-medium">
                            {new Date(report.lastGenerated).toLocaleString('de-DE')}
                          </span>
                        </div>
                      </div>

                      {/* Key Insights */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Key Insights</h4>
                        <div className="space-y-1">
                          {report.insights.slice(0, 3).map((insight, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span className="text-gray-700">{insight}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* KPIs */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {report.kpis.slice(0, 4).map((kpi, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-600">{kpi.name}</span>
                              {getTrendIcon(kpi.trend)}
                            </div>
                            <div className="text-lg font-bold text-gray-900">{kpi.value}</div>
                            <div className="text-xs text-gray-600">{kpi.change}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      {report.status === 'ready' && (
                        <>
                          <Button size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Vorschau
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share className="w-4 h-4 mr-1" />
                            Teilen
                          </Button>
                        </>
                      )}
                      {report.status === 'generating' && (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <p className="text-xs text-gray-600">Generierung...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Kategorie:</span>
                          <Badge variant="outline" className="text-xs">{template.category}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Module:</span>
                          <span className="font-medium">{template.modules.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Geschätzte Zeit:</span>
                          <span className="font-medium">{template.estimatedTime}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Insights:</span>
                          <span className="font-medium text-blue-600">{template.insights}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Template verwenden
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Performance</CardTitle>
                <CardDescription>Nutzung und Generierungszeiten</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Durchschnittliche Generierungszeit</span>
                  <span className="font-bold">6.2 min</span>
                </div>
                <Progress value={62} />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Automatisierungsgrad</span>
                  <span className="font-bold">78%</span>
                </div>
                <Progress value={78} />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">User Satisfaction</span>
                  <span className="font-bold">9.2/10</span>
                </div>
                <Progress value={92} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Beliebteste Report-Typen</CardTitle>
                <CardDescription>Nach Nutzungsfrequenz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Executive Reports</span>
                    </div>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Euro className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Financial Analytics</span>
                    </div>
                    <span className="font-medium">28%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm">AI Performance</span>
                    </div>
                    <span className="font-medium">18%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">HR Analytics</span>
                    </div>
                    <span className="font-medium">9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Zeitgesteuerte Reports</h3>
                    <p className="text-sm text-gray-600">Automatische Generierung nach Zeitplan</p>
                    <p className="text-xs text-blue-600 mt-1">12 aktive Zeitpläne</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Brain className="w-8 h-8 text-purple-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">KI-gesteuerte Insights</h3>
                    <p className="text-sm text-gray-600">Automatische Anomalie-Erkennung</p>
                    <p className="text-xs text-purple-600 mt-1">94.8% Genauigkeit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Mail className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Auto-Verteilung</h3>
                    <p className="text-sm text-gray-600">Automatischer E-Mail-Versand</p>
                    <p className="text-xs text-green-600 mt-1">24 aktive Verteiler</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
