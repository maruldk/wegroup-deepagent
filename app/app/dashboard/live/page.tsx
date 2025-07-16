
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, TrendingUp, Users, DollarSign, Package, AlertTriangle, Zap, Brain, Eye, RefreshCw } from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LiveMetric {
  id: string
  name: string
  value: number | string
  change: number
  trend: 'up' | 'down' | 'stable'
  unit: string
  category: 'sales' | 'hr' | 'logistics' | 'finance' | 'system'
  lastUpdated: string
  critical?: boolean
}

interface SystemAlert {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: string
  module: string
  resolved: boolean
}

interface RealTimeEvent {
  id: string
  type: 'user_action' | 'system_event' | 'business_event'
  description: string
  user?: string
  module: string
  timestamp: string
  impact: 'low' | 'medium' | 'high'
}

interface PredictiveInsight {
  id: string
  title: string
  description: string
  prediction: string
  confidence: number
  timeframe: string
  category: string
  actionable: boolean
}

export default function LiveDashboardPage() {
  const [metrics, setMetrics] = useState<LiveMetric[]>([])
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
  const [events, setEvents] = useState<RealTimeEvent[]>([])
  const [insights, setInsights] = useState<PredictiveInsight[]>([])
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLiveData()
    
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        loadLiveData()
        setLastRefresh(new Date())
      }, 30000) // Refresh every 30 seconds
      
      return () => clearInterval(interval)
    }
  }, [isAutoRefresh])

  const loadLiveData = async () => {
    setLoading(true)
    // Simulate real-time API calls
    setTimeout(() => {
      setMetrics([
        {
          id: "1",
          name: "Aktive Benutzer",
          value: 247,
          change: 12,
          trend: "up",
          unit: "users",
          category: "system",
          lastUpdated: new Date().toISOString()
        },
        {
          id: "2",
          name: "Täglicher Umsatz",
          value: "€125,450",
          change: 8.5,
          trend: "up",
          unit: "currency",
          category: "sales",
          lastUpdated: new Date().toISOString()
        },
        {
          id: "3",
          name: "Offene Deals",
          value: 34,
          change: -2,
          trend: "down",
          unit: "deals",
          category: "sales",
          lastUpdated: new Date().toISOString()
        },
        {
          id: "4",
          name: "Neue Mitarbeiter",
          value: 5,
          change: 0,
          trend: "stable",
          unit: "employees",
          category: "hr",
          lastUpdated: new Date().toISOString()
        },
        {
          id: "5",
          name: "Lagerbestände",
          value: "89%",
          change: -3.2,
          trend: "down",
          unit: "percentage",
          category: "logistics",
          lastUpdated: new Date().toISOString()
        },
        {
          id: "6",
          name: "System-Performance",
          value: "99.2%",
          change: 0.1,
          trend: "up",
          unit: "percentage",
          category: "system",
          lastUpdated: new Date().toISOString(),
          critical: false
        }
      ])

      setAlerts([
        {
          id: "1",
          type: "warning",
          title: "Niedrige Lagerbestände",
          message: "Mehrere Artikel erreichen Mindestbestand. Nachbestellung empfohlen.",
          timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min ago
          module: "Logistics",
          resolved: false
        },
        {
          id: "2",
          type: "info",
          title: "Hohe Benutzeraktivität",
          message: "Überdurchschnittliche Nutzung in den WeCreate Modulen erkannt.",
          timestamp: new Date(Date.now() - 900000).toISOString(), // 15 min ago
          module: "Analytics",
          resolved: false
        },
        {
          id: "3",
          type: "success",
          title: "Backup erfolgreich",
          message: "Nächtliches Datenbank-Backup erfolgreich abgeschlossen.",
          timestamp: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
          module: "System",
          resolved: true
        }
      ])

      setEvents([
        {
          id: "1",
          type: "business_event",
          description: "Neuer Deal erstellt: WeGroup Enterprise License - €250k",
          user: "Thomas Fischer",
          module: "WeSell",
          timestamp: new Date(Date.now() - 120000).toISOString(), // 2 min ago
          impact: "high"
        },
        {
          id: "2",
          type: "user_action",
          description: "KI-Content generiert: Blog Post über Digital Transformation",
          user: "Anna Schmidt",
          module: "WeCreate",
          timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min ago
          impact: "medium"
        },
        {
          id: "3",
          type: "system_event",
          description: "Automatische Bestandsoptimierung durchgeführt",
          module: "Logistics",
          timestamp: new Date(Date.now() - 600000).toISOString(), // 10 min ago
          impact: "medium"
        },
        {
          id: "4",
          type: "user_action",
          description: "Neue Compliance-Regel konfiguriert",
          user: "Michael Weber",
          module: "Finance",
          timestamp: new Date(Date.now() - 900000).toISOString(), // 15 min ago
          impact: "low"
        }
      ])

      setInsights([
        {
          id: "1",
          title: "Umsatzprognose übersteigt Erwartungen",
          description: "Basierend auf aktuellen Trends wird das Q1-Ziel mit 107% Wahrscheinlichkeit erreicht.",
          prediction: "Q1 Umsatz: €3.2M (7% über Plan)",
          confidence: 94,
          timeframe: "Nächste 45 Tage",
          category: "Sales",
          actionable: true
        },
        {
          id: "2",
          title: "Optimaler Zeitpunkt für Recruiting",
          description: "KI-Analyse zeigt erhöhte Erfolgswahrscheinlichkeit für neue Stellenausschreibungen.",
          prediction: "30% höhere Bewerbungsqualität in den nächsten 2 Wochen",
          confidence: 87,
          timeframe: "Nächste 14 Tage",
          category: "HR",
          actionable: true
        },
        {
          id: "3",
          title: "Lageroptimierung empfohlen",
          description: "Predictive Analytics identifiziert Potenzial für 15% Kosteneinsparung.",
          prediction: "€45k Einsparung durch optimierte Bestellzyklen",
          confidence: 82,
          timeframe: "Nächste 60 Tage",
          category: "Logistics",
          actionable: true
        }
      ])

      setLoading(false)
    }, 1000)
  }

  const getMetricTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'success': return <Activity className="w-4 h-4 text-green-500" />
      default: return <Activity className="w-4 h-4 text-blue-500" />
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'business_event': return <DollarSign className="w-4 h-4 text-green-500" />
      case 'user_action': return <Users className="w-4 h-4 text-blue-500" />
      case 'system_event': return <Zap className="w-4 h-4 text-purple-500" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  // Sample real-time chart data
  const realtimeData = [
    { time: '14:50', users: 235, sales: 15420, performance: 99.1 },
    { time: '14:55', users: 242, sales: 16890, performance: 99.3 },
    { time: '15:00', users: 247, sales: 18250, performance: 99.2 },
    { time: '15:05', users: 251, sales: 19680, performance: 98.9 },
    { time: '15:10', users: 245, sales: 21340, performance: 99.1 },
    { time: '15:15', users: 247, sales: 22750, performance: 99.2 }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Live Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-gray-900">Live Dashboard</h1>
          <p className="text-gray-600 mt-1">Echtzeit-Überwachung und KI-gestützte Insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={isAutoRefresh ? "default" : "outline"} className="text-xs">
            {isAutoRefresh ? "🟢 Live" : "⏸️ Pausiert"}
          </Badge>
          <span className="text-xs text-gray-500">
            Letztes Update: {lastRefresh.toLocaleTimeString('de-DE')}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
          >
            {isAutoRefresh ? "Pausieren" : "Fortsetzen"}
          </Button>
          <Button variant="outline" size="sm" onClick={loadLiveData}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Aktualisieren
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {alerts.filter(a => a.type === 'error' || (a.type === 'warning' && !a.resolved)).length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Aufmerksamkeit erforderlich!</strong> {alerts.filter(a => a.type === 'error' || (a.type === 'warning' && !a.resolved)).length} aktive Warnungen.
          </AlertDescription>
        </Alert>
      )}

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.id} className={`hover:shadow-md transition-shadow ${metric.critical ? 'border-red-200' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getMetricTrendIcon(metric.trend)}
                    <span className={`text-xs font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs mb-2">
                    {metric.category === 'sales' && '💰 Sales'}
                    {metric.category === 'hr' && '👥 HR'}
                    {metric.category === 'logistics' && '📦 Logistics'}
                    {metric.category === 'finance' && '💼 Finance'}
                    {metric.category === 'system' && '⚙️ System'}
                  </Badge>
                  <div className="text-xs text-gray-500">
                    {new Date(metric.lastUpdated).toLocaleTimeString('de-DE')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Live Performance</span>
            </CardTitle>
            <CardDescription>Echtzeit-Systemmetriken der letzten 30 Minuten</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Metriken', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                />
                <Tooltip />
                <Area type="monotone" dataKey="users" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="performance" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>KI-Prediction Score</span>
            </CardTitle>
            <CardDescription>Aggregierte Vorhersagegenauigkeit aller Module</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">92%</div>
                <div className="text-sm text-gray-600">Durchschnittliche Genauigkeit</div>
                <Progress value={92} className="mt-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900">Sales Predictions</div>
                  <div className="text-green-600">94% Genauigkeit</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">HR Forecasts</div>
                  <div className="text-blue-600">89% Genauigkeit</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Logistics Optimization</div>
                  <div className="text-orange-600">91% Genauigkeit</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Financial Planning</div>
                  <div className="text-purple-600">95% Genauigkeit</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Live Events</TabsTrigger>
          <TabsTrigger value="alerts">System Alerts</TabsTrigger>
          <TabsTrigger value="insights">KI-Insights</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Echtzeit-Ereignisse</span>
              </CardTitle>
              <CardDescription>Live-Stream aller Systemereignisse und Benutzeraktivitäten</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getEventIcon(event.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{event.description}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant={event.impact === 'high' ? 'default' : event.impact === 'medium' ? 'secondary' : 'outline'}>
                            {event.impact === 'high' ? 'Hoch' : event.impact === 'medium' ? 'Mittel' : 'Niedrig'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(event.timestamp).toLocaleTimeString('de-DE')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{event.module}</Badge>
                        {event.user && (
                          <span className="text-xs text-gray-600">von {event.user}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className={`hover:shadow-md transition-shadow ${
                alert.type === 'error' ? 'border-red-200' : 
                alert.type === 'warning' ? 'border-yellow-200' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant={alert.resolved ? 'default' : 'destructive'}>
                            {alert.resolved ? 'Gelöst' : 'Aktiv'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">{alert.module}</Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{alert.message}</p>
                      <div className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleString('de-DE')}
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
                    <Brain className="w-6 h-6 text-purple-500 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant={insight.actionable ? 'default' : 'outline'}>
                            {insight.actionable ? 'Umsetzbar' : 'Informativ'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {insight.confidence}% Vertrauen
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{insight.description}</p>
                      <div className="p-3 bg-purple-50 rounded-lg mb-3">
                        <p className="text-sm font-medium text-purple-900">{insight.prediction}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">{insight.category}</Badge>
                          <span className="text-xs text-gray-500">{insight.timeframe}</span>
                        </div>
                        {insight.actionable && (
                          <Button variant="outline" size="sm">
                            Aktion erstellen
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">CPU Usage</p>
                    <p className="text-2xl font-bold text-gray-900">23%</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
                <Progress value={23} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Memory</p>
                    <p className="text-2xl font-bold text-gray-900">67%</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-500" />
                </div>
                <Progress value={67} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Network</p>
                    <p className="text-2xl font-bold text-gray-900">45%</p>
                  </div>
                  <Zap className="w-8 h-8 text-purple-500" />
                </div>
                <Progress value={45} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Storage</p>
                    <p className="text-2xl font-bold text-gray-900">34%</p>
                  </div>
                  <Package className="w-8 h-8 text-orange-500" />
                </div>
                <Progress value={34} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
