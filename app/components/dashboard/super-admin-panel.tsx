
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Crown, Users, Building, Server, Shield, Activity, AlertTriangle, CheckCircle, Zap, Settings } from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PlatformMetric {
  id: string
  name: string
  value: number | string
  change: number
  trend: 'up' | 'down' | 'stable'
  category: 'users' | 'revenue' | 'performance' | 'security'
  critical?: boolean
}

interface TenantOverview {
  id: string
  name: string
  domain: string
  userCount: number
  status: 'active' | 'inactive' | 'suspended'
  lastActivity: string
  plan: 'starter' | 'professional' | 'enterprise'
  monthlyRevenue: number
  storageUsed: number
  storageLimit: number
}

interface SystemAlert {
  id: string
  type: 'security' | 'performance' | 'maintenance' | 'billing'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  timestamp: string
  tenantId?: string
  resolved: boolean
}

interface GlobalInsight {
  id: string
  type: 'optimization' | 'growth' | 'risk' | 'trend'
  title: string
  description: string
  impact: string
  confidence: number
  actionable: boolean
}

export default function SuperAdminPanel() {
  const [metrics, setMetrics] = useState<PlatformMetric[]>([])
  const [tenants, setTenants] = useState<TenantOverview[]>([])
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
  const [insights, setInsights] = useState<GlobalInsight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSuperAdminData()
  }, [])

  const loadSuperAdminData = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setMetrics([
        {
          id: "1",
          name: "Gesamt Benutzer",
          value: 1247,
          change: 8.5,
          trend: "up",
          category: "users"
        },
        {
          id: "2",
          name: "Aktive Mandanten",
          value: 47,
          change: 12,
          trend: "up",
          category: "users"
        },
        {
          id: "3",
          name: "Monatsumsatz",
          value: "€285,450",
          change: 15.3,
          trend: "up",
          category: "revenue"
        },
        {
          id: "4",
          name: "System-Verfügbarkeit",
          value: "99.97%",
          change: 0.02,
          trend: "up",
          category: "performance"
        },
        {
          id: "5",
          name: "Sicherheitsvorfälle",
          value: 0,
          change: -100,
          trend: "down",
          category: "security"
        },
        {
          id: "6",
          name: "Durchschn. Antwortzeit",
          value: "1.2ms",
          change: -5.8,
          trend: "down",
          category: "performance"
        }
      ])

      setTenants([
        {
          id: "1",
          name: "WeGroup Internal",
          domain: "internal.wegroup.com",
          userCount: 45,
          status: "active",
          lastActivity: "2024-01-15T09:30:00",
          plan: "enterprise",
          monthlyRevenue: 15000,
          storageUsed: 2.8,
          storageLimit: 10
        },
        {
          id: "2",
          name: "TechCorp Industries",
          domain: "techcorp.wegroup.com",
          userCount: 234,
          status: "active",
          lastActivity: "2024-01-15T11:45:00",
          plan: "enterprise",
          monthlyRevenue: 45000,
          storageUsed: 8.9,
          storageLimit: 20
        },
        {
          id: "3",
          name: "StartupX GmbH",
          domain: "startupx.wegroup.com",
          userCount: 28,
          status: "active",
          lastActivity: "2024-01-15T08:20:00",
          plan: "professional",
          monthlyRevenue: 5000,
          storageUsed: 1.2,
          storageLimit: 5
        },
        {
          id: "4",
          name: "RetailMax AG",
          domain: "retailmax.wegroup.com",
          userCount: 156,
          status: "active",
          lastActivity: "2024-01-14T16:10:00",
          plan: "enterprise",
          monthlyRevenue: 28000,
          storageUsed: 6.4,
          storageLimit: 15
        },
        {
          id: "5",
          name: "TestClient Corp",
          domain: "test.wegroup.com",
          userCount: 12,
          status: "suspended",
          lastActivity: "2024-01-10T14:30:00",
          plan: "starter",
          monthlyRevenue: 500,
          storageUsed: 0.5,
          storageLimit: 2
        }
      ])

      setAlerts([
        {
          id: "1",
          type: "performance",
          severity: "medium",
          title: "Erhöhte Datenbanklatenz",
          description: "Mehrere Mandanten melden langsamere Antwortzeiten in der TechCorp-Region",
          timestamp: "2024-01-15T10:30:00",
          tenantId: "2",
          resolved: false
        },
        {
          id: "2",
          type: "security",
          severity: "high",
          title: "Ungewöhnliche Login-Aktivität",
          description: "Multiple Login-Versuche aus verschiedenen Ländern für TestClient Corp",
          timestamp: "2024-01-15T09:15:00",
          tenantId: "5",
          resolved: false
        },
        {
          id: "3",
          type: "billing",
          severity: "low",
          title: "Storage-Limit erreicht",
          description: "RetailMax AG hat 95% des Storage-Limits erreicht",
          timestamp: "2024-01-14T18:45:00",
          tenantId: "4",
          resolved: true
        }
      ])

      setInsights([
        {
          id: "1",
          type: "growth",
          title: "Starkes Wachstum im Enterprise-Segment",
          description: "Enterprise-Kunden zeigen 23% höhere Retention-Rate und 45% mehr Feature-Nutzung",
          impact: "€125k zusätzlicher ARR in Q2 möglich",
          confidence: 87,
          actionable: true
        },
        {
          id: "2",
          type: "optimization",
          title: "KI-Modell Performance-Optimierung",
          description: "Globale KI-Modelle können durch Caching-Strategien um 30% beschleunigt werden",
          impact: "Verbesserung der Benutzererfahrung für alle Mandanten",
          confidence: 94,
          actionable: true
        },
        {
          id: "3",
          type: "risk",
          title: "Potenzielle Churn-Risiken identifiziert",
          description: "3 Mandanten zeigen reduzierte Aktivitätsmuster, die auf Churn-Risiko hindeuten",
          impact: "€15k monatlicher Umsatz gefährdet",
          confidence: 78,
          actionable: true
        }
      ])

      setLoading(false)
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      suspended: "destructive"
    } as const
    
    const labels = {
      active: "Aktiv",
      inactive: "Inaktiv",
      suspended: "Gesperrt"
    }
    
    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const getPlanBadge = (plan: string) => {
    const variants = {
      starter: "outline",
      professional: "secondary",
      enterprise: "default"
    } as const
    
    const labels = {
      starter: "Starter",
      professional: "Professional",
      enterprise: "Enterprise"
    }
    
    return <Badge variant={variants[plan as keyof typeof variants]}>{labels[plan as keyof typeof labels]}</Badge>
  }

  const getAlertIcon = (type: string, severity: string) => {
    const baseClasses = "w-4 h-4"
    const colors = {
      critical: "text-red-500",
      high: "text-orange-500", 
      medium: "text-yellow-500",
      low: "text-blue-500"
    }
    
    switch (type) {
      case 'security': return <Shield className={`${baseClasses} ${colors[severity as keyof typeof colors]}`} />
      case 'performance': return <Activity className={`${baseClasses} ${colors[severity as keyof typeof colors]}`} />
      case 'maintenance': return <Settings className={`${baseClasses} ${colors[severity as keyof typeof colors]}`} />
      default: return <AlertTriangle className={`${baseClasses} ${colors[severity as keyof typeof colors]}`} />
    }
  }

  // Sample chart data
  const platformGrowthData = [
    { month: 'Aug', users: 920, tenants: 38, revenue: 185000 },
    { month: 'Sep', users: 1045, tenants: 42, revenue: 220000 },
    { month: 'Okt', users: 1156, tenants: 44, revenue: 245000 },
    { month: 'Nov', users: 1201, tenants: 46, revenue: 265000 },
    { month: 'Dez', users: 1198, tenants: 47, revenue: 270000 },
    { month: 'Jan', users: 1247, tenants: 47, revenue: 285450 }
  ]

  const tenantDistribution = [
    { plan: 'Starter', count: 18, revenue: 9000 },
    { plan: 'Professional', count: 22, revenue: 110000 },
    { plan: 'Enterprise', count: 7, revenue: 166450 }
  ]

  const totalRevenue = tenants.reduce((sum, tenant) => sum + tenant.monthlyRevenue, 0)
  const activeAlerts = alerts.filter(a => !a.resolved).length
  const avgUtilization = Math.round(tenants.reduce((sum, t) => sum + (t.storageUsed / t.storageLimit), 0) / tenants.length * 100)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Crown className="w-8 h-8 text-purple-500" />
          <h2 className="text-2xl font-bold text-gray-900">Super Admin Panel</h2>
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
        <div className="flex items-center space-x-3">
          <Crown className="w-8 h-8 text-purple-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Super Admin Panel</h2>
            <p className="text-gray-600">Globale Plattform-Überwachung und -Verwaltung</p>
          </div>
        </div>
        <Badge variant="default" className="bg-purple-600">
          Super Administrator
        </Badge>
      </div>

      {/* Critical Alerts */}
      {activeAlerts > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{activeAlerts} aktive Systemwarnungen!</strong> Plattformweite Aufmerksamkeit erforderlich.
          </AlertDescription>
        </Alert>
      )}

      {/* Platform Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.id} className={metric.critical ? 'border-red-200' : ''}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {metric.trend === 'up' ? (
                      <Activity className="w-3 h-3 text-green-500" />
                    ) : metric.trend === 'down' ? (
                      <Activity className="w-3 h-3 text-red-500 rotate-180" />
                    ) : (
                      <Activity className="w-3 h-3 text-gray-500" />
                    )}
                    <span className={`text-xs font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    {metric.category === 'users' && '👥 Users'}
                    {metric.category === 'revenue' && '💰 Revenue'}
                    {metric.category === 'performance' && '⚡ Performance'}
                    {metric.category === 'security' && '🔒 Security'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Platform Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Plattform-Wachstum</CardTitle>
          <CardDescription>Monatliche Entwicklung von Benutzern, Mandanten und Umsatz</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={platformGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tickLine={false}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                tickLine={false}
                tick={{ fontSize: 10 }}
                label={{ value: 'Anzahl', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
              />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={3} name="Benutzer" />
              <Line type="monotone" dataKey="tenants" stroke="#10B981" strokeWidth={3} name="Mandanten" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs defaultValue="tenants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tenants">Mandanten</TabsTrigger>
          <TabsTrigger value="alerts">System Alerts</TabsTrigger>
          <TabsTrigger value="insights">Global Insights</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="space-y-4">
          <div className="grid gap-4">
            {tenants.map((tenant) => (
              <Card key={tenant.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{tenant.name}</h3>
                          {getStatusBadge(tenant.status)}
                          {getPlanBadge(tenant.plan)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{tenant.domain}</p>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Benutzer: </span>
                            <span className="font-medium">{tenant.userCount}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Umsatz: </span>
                            <span className="font-medium">€{tenant.monthlyRevenue.toLocaleString()}/Monat</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Storage: </span>
                            <span className="font-medium">{tenant.storageUsed}GB / {tenant.storageLimit}GB</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Letzte Aktivität: </span>
                            <span className="font-medium">{new Date(tenant.lastActivity).toLocaleDateString('de-DE')}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Storage-Nutzung</span>
                            <span>{Math.round((tenant.storageUsed / tenant.storageLimit) * 100)}%</span>
                          </div>
                          <Progress value={(tenant.storageUsed / tenant.storageLimit) * 100} />
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Users className="w-4 h-4 mr-1" />
                        Verwalten
                      </Button>
                      <Button size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className={`hover:shadow-md transition-shadow ${
                alert.severity === 'critical' ? 'border-red-200' : 
                alert.severity === 'high' ? 'border-orange-200' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type, alert.severity)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant={alert.resolved ? 'default' : 'destructive'}>
                            {alert.resolved ? 'Gelöst' : 'Aktiv'}
                          </Badge>
                          <Badge variant={alert.severity === 'critical' ? 'destructive' : alert.severity === 'high' ? 'default' : 'secondary'}>
                            {alert.severity === 'critical' ? 'Kritisch' : 
                             alert.severity === 'high' ? 'Hoch' : 
                             alert.severity === 'medium' ? 'Mittel' : 'Niedrig'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{alert.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{new Date(alert.timestamp).toLocaleString('de-DE')}</span>
                          {alert.tenantId && (
                            <>
                              <span>•</span>
                              <span>Mandant: {tenants.find(t => t.id === alert.tenantId)?.name}</span>
                            </>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {!alert.resolved && (
                            <Button variant="outline" size="sm">
                              Lösen
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

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {insights.map((insight) => (
              <Card key={insight.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Zap className="w-6 h-6 text-purple-500 mt-1" />
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
                        <p className="text-sm font-medium text-purple-900">{insight.impact}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {insight.type === 'optimization' && '🔧 Optimierung'}
                          {insight.type === 'growth' && '📈 Wachstum'}
                          {insight.type === 'risk' && '⚠️ Risiko'}
                          {insight.type === 'trend' && '📊 Trend'}
                        </Badge>
                        {insight.actionable && (
                          <Button variant="outline" size="sm">
                            Aktion planen
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

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan-Verteilung</CardTitle>
                <CardDescription>Umsatz und Anzahl nach Tarifen</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tenantDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="plan" 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Umsatz (€)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <Tooltip formatter={(value) => [`€${value?.toLocaleString()}`, '']} />
                    <Bar dataKey="revenue" fill="#8B5CF6" name="Umsatz" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plattform-Metriken</CardTitle>
                <CardDescription>Aktuelle Systemstatistiken</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{totalRevenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Monatsumsatz (€)</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{avgUtilization}%</div>
                    <div className="text-sm text-gray-600">Ø Storage-Nutzung</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">99.97%</div>
                    <div className="text-sm text-gray-600">Verfügbarkeit</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">1.2ms</div>
                    <div className="text-sm text-gray-600">Ø Antwortzeit</div>
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
