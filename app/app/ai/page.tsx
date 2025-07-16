
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Zap, TrendingUp, Target, Lightbulb, Settings, Play, Pause, BarChart3, Users, Sparkles } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AIAgent {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'training' | 'error'
  accuracy: number
  module: string
  tasksCompleted: number
  autonomyLevel: number
  lastAction: string
  performance: {
    efficiency: number
    reliability: number
    learning: number
  }
}

interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: string
  action: string
  isActive: boolean
  successRate: number
  timeSaved: number
  module: string
}

interface AIInsight {
  id: string
  type: 'optimization' | 'prediction' | 'anomaly' | 'recommendation'
  title: string
  description: string
  confidence: number
  impact: 'low' | 'medium' | 'high' | 'critical'
  module: string
  actionable: boolean
  estimatedValue?: number
}

interface ModelPerformance {
  id: string
  modelName: string
  version: string
  accuracy: number
  latency: number
  throughput: number
  lastUpdated: string
  status: 'optimal' | 'degraded' | 'critical'
}

export default function AIPage() {
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([])
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [modelPerformance, setModelPerformance] = useState<ModelPerformance[]>([])
  const [isAIEnabled, setIsAIEnabled] = useState(true)
  const [autonomyLevel, setAutonomyLevel] = useState(85)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAIData()
  }, [])

  const loadAIData = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setAgents([
        {
          id: "1",
          name: "Sales Intelligence Agent",
          description: "Automatische Deal-Prognosen und Verkaufsoptimierung",
          status: "active",
          accuracy: 94,
          module: "WeSell",
          tasksCompleted: 1247,
          autonomyLevel: 90,
          lastAction: "Deal-Wahrscheinlichkeit für TechCorp auf 95% aktualisiert",
          performance: {
            efficiency: 92,
            reliability: 96,
            learning: 88
          }
        },
        {
          id: "2",
          name: "Content Creation AI",
          description: "Intelligente Inhaltserstellung und Optimierung",
          status: "active",
          accuracy: 89,
          module: "WeCreate",
          tasksCompleted: 567,
          autonomyLevel: 85,
          lastAction: "Blog-Artikel für Produktlaunch generiert",
          performance: {
            efficiency: 94,
            reliability: 87,
            learning: 91
          }
        },
        {
          id: "3",
          name: "HR Analytics Engine",
          description: "Personalplanung und Mitarbeiter-Insights",
          status: "active",
          accuracy: 87,
          module: "HR",
          tasksCompleted: 234,
          autonomyLevel: 80,
          lastAction: "Optimale Recruiting-Strategie für Q2 vorgeschlagen",
          performance: {
            efficiency: 85,
            reliability: 89,
            learning: 92
          }
        },
        {
          id: "4",
          name: "Logistics Optimizer",
          description: "Supply Chain Optimierung und Bestandsmanagement",
          status: "training",
          accuracy: 82,
          module: "Logistics",
          tasksCompleted: 189,
          autonomyLevel: 75,
          lastAction: "Neue Bestellalgorithmen werden trainiert",
          performance: {
            efficiency: 88,
            reliability: 84,
            learning: 95
          }
        },
        {
          id: "5",
          name: "Financial Forecaster",
          description: "Automatische Finanzprognosen und Risikobewertung",
          status: "active",
          accuracy: 91,
          module: "Finance",
          tasksCompleted: 445,
          autonomyLevel: 88,
          lastAction: "Q1 Budget-Prognose mit 95% Genauigkeit erstellt",
          performance: {
            efficiency: 91,
            reliability: 93,
            learning: 86
          }
        }
      ])

      setAutomationRules([
        {
          id: "1",
          name: "Auto Deal Scoring",
          description: "Automatische Bewertung und Priorisierung neuer Leads",
          trigger: "Neuer Lead erstellt",
          action: "Deal Score berechnen und zuweisen",
          isActive: true,
          successRate: 94,
          timeSaved: 120,
          module: "WeSell"
        },
        {
          id: "2",
          name: "Content SEO Optimization",
          description: "Automatische SEO-Optimierung für generierten Content",
          trigger: "Content erstellt",
          action: "SEO-Keywords und Meta-Tags hinzufügen",
          isActive: true,
          successRate: 87,
          timeSaved: 45,
          module: "WeCreate"
        },
        {
          id: "3",
          name: "Smart Inventory Reorder",
          description: "Intelligente Nachbestellung bei niedrigen Beständen",
          trigger: "Lagerbestand unter Mindestmenge",
          action: "Optimale Bestellmenge berechnen und bestellen",
          isActive: true,
          successRate: 96,
          timeSaved: 200,
          module: "Logistics"
        },
        {
          id: "4",
          name: "Expense Categorization",
          description: "Automatische Kategorisierung von Ausgaben",
          trigger: "Neue Ausgabe eingegeben",
          action: "Kategorie und Kostenstelle zuweisen",
          isActive: true,
          successRate: 92,
          timeSaved: 30,
          module: "Finance"
        }
      ])

      setInsights([
        {
          id: "1",
          type: "optimization",
          title: "Vertriebsprozess-Optimierung",
          description: "KI hat eine 23% Effizienzsteigerung im Sales-Funnel durch optimierte Lead-Qualifizierung identifiziert.",
          confidence: 92,
          impact: "high",
          module: "WeSell",
          actionable: true,
          estimatedValue: 145000
        },
        {
          id: "2",
          type: "prediction",
          title: "Content Performance Vorhersage",
          description: "Basierend auf Engagement-Patterns wird der nächste Blog-Post 40% mehr Traffic generieren.",
          confidence: 87,
          impact: "medium",
          module: "WeCreate",
          actionable: true,
          estimatedValue: 25000
        },
        {
          id: "3",
          type: "anomaly",
          title: "Ungewöhnliche Ausgaben-Muster",
          description: "Anomalie in IT-Ausgaben erkannt - 35% über historischem Durchschnitt.",
          confidence: 94,
          impact: "medium",
          module: "Finance",
          actionable: true
        },
        {
          id: "4",
          type: "recommendation",
          title: "Optimaler Hiring-Zeitpunkt",
          description: "Datenanalyse zeigt 60% höhere Erfolgsrate für neue Stellenausschreibungen im Februar.",
          confidence: 83,
          impact: "high",
          module: "HR",
          actionable: true,
          estimatedValue: 50000
        }
      ])

      setModelPerformance([
        {
          id: "1",
          modelName: "Sales Prediction Model",
          version: "v2.4.1",
          accuracy: 94.2,
          latency: 120,
          throughput: 450,
          lastUpdated: "2024-01-15T08:30:00",
          status: "optimal"
        },
        {
          id: "2",
          modelName: "Content Generation Model",
          version: "v1.8.3",
          accuracy: 89.7,
          latency: 2400,
          throughput: 85,
          lastUpdated: "2024-01-14T16:20:00",
          status: "optimal"
        },
        {
          id: "3",
          modelName: "Logistics Optimization",
          version: "v3.1.0",
          accuracy: 87.3,
          latency: 890,
          throughput: 200,
          lastUpdated: "2024-01-13T12:45:00",
          status: "degraded"
        }
      ])

      setLoading(false)
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      paused: "secondary",
      training: "outline",
      error: "destructive"
    } as const
    
    const labels = {
      active: "Aktiv",
      paused: "Pausiert",
      training: "Training",
      error: "Fehler"
    }
    
    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <TrendingUp className="w-5 h-5 text-green-500" />
      case 'prediction': return <Target className="w-5 h-5 text-blue-500" />
      case 'anomaly': return <Zap className="w-5 h-5 text-red-500" />
      case 'recommendation': return <Lightbulb className="w-5 h-5 text-yellow-500" />
      default: return <Brain className="w-5 h-5 text-purple-500" />
    }
  }

  const totalTasksCompleted = agents.reduce((sum, agent) => sum + agent.tasksCompleted, 0)
  const avgAccuracy = Math.round(agents.reduce((sum, agent) => sum + agent.accuracy, 0) / agents.length)
  const activeAgents = agents.filter(a => a.status === 'active').length
  const totalTimeSaved = automationRules.reduce((sum, rule) => sum + rule.timeSaved, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">KI-Zentrale</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">KI-Zentrale</h1>
          <p className="text-gray-600 mt-1">Zentrale Steuerung und Überwachung aller KI-Systeme</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="ai-master-switch">KI-System</Label>
            <Switch
              id="ai-master-switch"
              checked={isAIEnabled}
              onCheckedChange={setIsAIEnabled}
            />
            <Badge variant={isAIEnabled ? "default" : "secondary"}>
              {isAIEnabled ? "Aktiv" : "Deaktiviert"}
            </Badge>
          </div>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Konfiguration
          </Button>
        </div>
      </div>

      {/* AI System Status */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">KI-Autonomie Level</h3>
              <p className="text-sm text-gray-600">Aktueller Automatisierungsgrad des Systems</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">{autonomyLevel}%</div>
              <Progress value={autonomyLevel} className="w-32 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktive Agenten</p>
                <p className="text-2xl font-bold text-gray-900">{activeAgents}</p>
                <p className="text-xs text-green-600">von {agents.length} total</p>
              </div>
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasks erledigt</p>
                <p className="text-2xl font-bold text-blue-600">{totalTasksCompleted.toLocaleString()}</p>
                <p className="text-xs text-blue-600">Heute: +127</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ø Genauigkeit</p>
                <p className="text-2xl font-bold text-green-600">{avgAccuracy}%</p>
                <Progress value={avgAccuracy} className="mt-2" />
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Zeit gespart</p>
                <p className="text-2xl font-bold text-orange-600">{totalTimeSaved}h</p>
                <p className="text-xs text-orange-600">Diesen Monat</p>
              </div>
              <Zap className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical AI Insights */}
      {insights.filter(i => i.impact === 'critical' || i.impact === 'high').length > 0 && (
        <Alert className="border-purple-200 bg-purple-50">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            <strong>Neue KI-Erkenntnisse verfügbar!</strong> {insights.filter(i => i.impact === 'critical' || i.impact === 'high').length} hochwertige Optimierungsvorschläge warten auf Ihre Aufmerksamkeit.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents">KI-Agenten</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="models">Modelle</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4">
            {agents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                          {getStatusBadge(agent.status)}
                          <Badge variant="outline" className="text-xs">{agent.module}</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{agent.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Genauigkeit: </span>
                            <span className="font-medium">{agent.accuracy}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Tasks: </span>
                            <span className="font-medium">{agent.tasksCompleted.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Autonomie: </span>
                            <span className="font-medium">{agent.autonomyLevel}%</span>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Letzte Aktion:</span> {agent.lastAction}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="grid grid-cols-1 gap-2 mb-4">
                        <div>
                          <div className="text-xs text-gray-500">Effizienz</div>
                          <Progress value={agent.performance.efficiency} className="w-24" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Zuverlässigkeit</div>
                          <Progress value={agent.performance.reliability} className="w-24" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Lernfortschritt</div>
                          <Progress value={agent.performance.learning} className="w-24" />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          {agent.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button size="sm">
                          Konfigurieren
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <div className="grid gap-4">
            {automationRules.map((rule) => (
              <Card key={rule.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                        <Badge variant={rule.isActive ? "default" : "secondary"}>
                          {rule.isActive ? "Aktiv" : "Inaktiv"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{rule.module}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{rule.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Trigger: </span>
                          <span className="font-medium">{rule.trigger}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Aktion: </span>
                          <span className="font-medium">{rule.action}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <div className="text-gray-500">Erfolgsrate</div>
                          <div className="font-bold text-green-600">{rule.successRate}%</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Zeit gespart</div>
                          <div className="font-bold text-blue-600">{rule.timeSaved}h</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={(checked) => {
                            // Update rule status
                          }}
                        />
                        <Button variant="outline" size="sm">
                          Bearbeiten
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {insights.map((insight) => (
              <Card key={insight.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant={insight.impact === 'critical' ? 'destructive' : insight.impact === 'high' ? 'default' : insight.impact === 'medium' ? 'secondary' : 'outline'}>
                            {insight.impact === 'critical' ? 'Kritisch' : insight.impact === 'high' ? 'Hoch' : insight.impact === 'medium' ? 'Mittel' : 'Niedrig'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {insight.confidence}% Vertrauen
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">{insight.module}</Badge>
                          <Badge variant="outline" className="text-xs">
                            {insight.type === 'optimization' && '🔧 Optimierung'}
                            {insight.type === 'prediction' && '🔮 Vorhersage'}
                            {insight.type === 'anomaly' && '⚠️ Anomalie'}
                            {insight.type === 'recommendation' && '💡 Empfehlung'}
                          </Badge>
                          {insight.estimatedValue && (
                            <Badge variant="default" className="text-xs">
                              €{insight.estimatedValue.toLocaleString()} Potenzial
                            </Badge>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {insight.actionable && (
                            <Button variant="outline" size="sm">
                              Umsetzen
                            </Button>
                          )}
                          <Button size="sm">
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid gap-4">
            {modelPerformance.map((model) => (
              <Card key={model.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{model.modelName}</h3>
                        <p className="text-sm text-gray-600">Version {model.version}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={model.status === 'optimal' ? 'default' : model.status === 'degraded' ? 'secondary' : 'destructive'}>
                            {model.status === 'optimal' ? 'Optimal' : model.status === 'degraded' ? 'Degradiert' : 'Kritisch'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Update: {new Date(model.lastUpdated).toLocaleDateString('de-DE')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Genauigkeit</div>
                          <div className="font-bold text-green-600">{model.accuracy}%</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Latenz</div>
                          <div className="font-bold text-blue-600">{model.latency}ms</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Durchsatz</div>
                          <div className="font-bold text-purple-600">{model.throughput}/min</div>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-2">
                        <Button variant="outline" size="sm">
                          Monitoring
                        </Button>
                        <Button size="sm">
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
