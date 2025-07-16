
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Route, 
  TrendingUp, 
  TrendingDown, 
  Truck, 
  MapPin,
  Clock,
  Fuel,
  CheckCircle,
  AlertTriangle,
  Zap,
  Target
} from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, PieChart, Pie, Cell } from 'recharts'

interface RouteOptimization {
  id: string
  routeName: string
  vehicle: string
  driver: string
  stops: number
  originalDistance: number
  optimizedDistance: number
  originalTime: number
  optimizedTime: number
  fuelSavings: number
  costSavings: number
  co2Reduction: number
  efficiency: number
  status: 'optimized' | 'pending' | 'in_progress'
  optimizationDate: string
}

interface OptimizationMetric {
  category: string
  current: number
  target: number
  improvement: number
  unit: string
}

export default function OptimizationPage() {
  const [routeOptimizations, setRouteOptimizations] = useState<RouteOptimization[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('current_week')
  const [selectedVehicleType, setSelectedVehicleType] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOptimizationData()
  }, [selectedPeriod, selectedVehicleType])

  const loadOptimizationData = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setRouteOptimizations([
        {
          id: '1',
          routeName: 'Berlin-Hamburg Route',
          vehicle: 'LKW-001',
          driver: 'Michael Schmidt',
          stops: 8,
          originalDistance: 350,
          optimizedDistance: 295,
          originalTime: 420,
          optimizedTime: 342,
          fuelSavings: 45.50,
          costSavings: 125.80,
          co2Reduction: 18.5,
          efficiency: 84,
          status: 'optimized',
          optimizationDate: '2024-01-15T08:30:00'
        },
        {
          id: '2',
          routeName: 'München-Stuttgart Circuit',
          vehicle: 'VAN-003',
          driver: 'Anna Weber',
          stops: 12,
          originalDistance: 180,
          optimizedDistance: 158,
          originalTime: 300,
          optimizedTime: 265,
          fuelSavings: 22.30,
          costSavings: 68.20,
          co2Reduction: 12.8,
          efficiency: 88,
          status: 'optimized',
          optimizationDate: '2024-01-15T09:15:00'
        },
        {
          id: '3',
          routeName: 'Frankfurt Regional',
          vehicle: 'LKW-005',
          driver: 'Thomas Koch',
          stops: 15,
          originalDistance: 220,
          optimizedDistance: 198,
          originalTime: 380,
          optimizedTime: 335,
          fuelSavings: 18.90,
          costSavings: 52.40,
          co2Reduction: 9.2,
          efficiency: 82,
          status: 'optimized',
          optimizationDate: '2024-01-14T16:45:00'
        },
        {
          id: '4',
          routeName: 'Köln-Düsseldorf Express',
          vehicle: 'VAN-007',
          driver: 'Lisa Müller',
          stops: 6,
          originalDistance: 85,
          optimizedDistance: 78,
          originalTime: 120,
          optimizedTime: 108,
          fuelSavings: 8.70,
          costSavings: 28.50,
          co2Reduction: 4.1,
          efficiency: 91,
          status: 'in_progress',
          optimizationDate: '2024-01-15T11:20:00'
        }
      ])
      setLoading(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      optimized: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      in_progress: 'bg-blue-100 text-blue-700'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimized':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'in_progress':
        return <Zap className="w-4 h-4 text-blue-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const optimizationMetrics: OptimizationMetric[] = [
    { category: 'Durchschnittliche Routeneffizienz', current: 86, target: 90, improvement: 4, unit: '%' },
    { category: 'Kraftstoffeinsparung', current: 24.2, target: 30, improvement: 5.8, unit: '%' },
    { category: 'Zeitreduzierung', current: 18.5, target: 25, improvement: 6.5, unit: '%' },
    { category: 'CO2-Reduktion', current: 15.8, target: 20, improvement: 4.2, unit: '%' }
  ]

  const weeklyOptimizations = [
    { week: 'KW 50', routes: 45, savings: 1250, efficiency: 82 },
    { week: 'KW 51', routes: 52, savings: 1480, efficiency: 84 },
    { week: 'KW 52', routes: 38, savings: 980, efficiency: 81 },
    { week: 'KW 1', routes: 48, savings: 1380, efficiency: 86 },
    { week: 'KW 2', routes: 55, savings: 1620, efficiency: 88 }
  ]

  const optimizationImpacts = [
    { name: 'Kraftstoff-Einsparung', value: 2850, percentage: 35.2, color: '#60B5FF' },
    { name: 'Zeit-Ersparnis', value: 1890, percentage: 23.3, color: '#FF9149' },
    { name: 'CO2-Reduktion', value: 1650, percentage: 20.4, color: '#80D8C3' },
    { name: 'Wartungskosten', value: 1120, percentage: 13.8, color: '#A19AD3' },
    { name: 'Sonstige', value: 590, percentage: 7.3, color: '#FF90BB' }
  ]

  const totalSavings = routeOptimizations.reduce((acc, route) => acc + route.costSavings, 0)
  const totalDistance = routeOptimizations.reduce((acc, route) => acc + route.optimizedDistance, 0)
  const avgEfficiency = Math.round(routeOptimizations.reduce((acc, route) => acc + route.efficiency, 0) / routeOptimizations.length)
  const totalCO2Reduction = routeOptimizations.reduce((acc, route) => acc + route.co2Reduction, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Routen-Optimierung</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">KI-Routen-Optimierung</h1>
          <p className="text-gray-600 mt-1">Intelligente Routenplanung mit 28% Kosteneinsparung</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Zeitraum wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_week">Aktuelle Woche</SelectItem>
              <SelectItem value="last_week">Letzte Woche</SelectItem>
              <SelectItem value="current_month">Aktueller Monat</SelectItem>
              <SelectItem value="last_month">Letzter Monat</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Zap className="w-4 h-4 mr-2" />
            Routen optimieren
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Kosteneinsparung</p>
                <p className="text-2xl font-bold text-green-600">€{totalSavings.toFixed(2)}</p>
                <p className="text-xs text-green-600">Diese Woche</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ø Effizienz</p>
                <p className="text-2xl font-bold text-blue-600">{avgEfficiency}%</p>
                <p className="text-xs text-blue-600">+4% vs. letzter Monat</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Optimierte Kilometer</p>
                <p className="text-2xl font-bold text-purple-600">{totalDistance.toLocaleString()}</p>
                <p className="text-xs text-purple-600">Diese Woche</p>
              </div>
              <Route className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CO2-Einsparung</p>
                <p className="text-2xl font-bold text-orange-600">{totalCO2Reduction.toFixed(1)}kg</p>
                <p className="text-xs text-orange-600">Diese Woche</p>
              </div>
              <Fuel className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Optimizations Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Optimierungs-Trends</CardTitle>
          <CardDescription>Wöchentliche Performance und Einsparungen</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyOptimizations}>
              <XAxis 
                dataKey="week" 
                tickLine={false}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                yAxisId="left"
                tickLine={false}
                tick={{ fontSize: 10 }}
                label={{ value: 'Einsparungen (€)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tickLine={false}
                tick={{ fontSize: 10 }}
                label={{ value: 'Effizienz (%)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fontSize: 11 } }}
              />
              <Tooltip />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="savings"
                stroke="#60B5FF"
                fill="#60B5FF"
                fillOpacity={0.3}
                name="Einsparungen (€)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="efficiency"
                stroke="#80D8C3"
                strokeWidth={2}
                name="Effizienz (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs defaultValue="routes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="routes">Optimierte Routen</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="sustainability">Nachhaltigkeit</TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-4">
          <div className="grid gap-4">
            {routeOptimizations.map((route) => (
              <Card key={route.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{route.routeName}</h3>
                        <Badge className={getStatusColor(route.status)}>
                          {getStatusIcon(route.status)}
                          <span className="ml-1">
                            {route.status === 'optimized' && 'Optimiert'}
                            {route.status === 'pending' && 'Ausstehend'}
                            {route.status === 'in_progress' && 'In Bearbeitung'}
                          </span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {route.stops} Stopps
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Fahrzeug: </span>
                          <span className="font-medium">{route.vehicle}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Fahrer: </span>
                          <span className="font-medium">{route.driver}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Distanz: </span>
                          <span className="font-medium">
                            {route.optimizedDistance}km 
                            <span className="text-green-600 text-xs ml-1">
                              (-{route.originalDistance - route.optimizedDistance}km)
                            </span>
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Zeit: </span>
                          <span className="font-medium">
                            {Math.round(route.optimizedTime / 60)}h {route.optimizedTime % 60}min
                            <span className="text-green-600 text-xs ml-1">
                              (-{Math.round((route.originalTime - route.optimizedTime) / 60)}h)
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2 mb-1">
                            <Fuel className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900">Kraftstoff-Ersparnis</span>
                          </div>
                          <p className="text-lg font-bold text-green-600">€{route.fuelSavings.toFixed(2)}</p>
                        </div>
                        
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Gesamt-Ersparnis</span>
                          </div>
                          <p className="text-lg font-bold text-blue-600">€{route.costSavings.toFixed(2)}</p>
                        </div>
                        
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2 mb-1">
                            <MapPin className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-900">CO2-Reduktion</span>
                          </div>
                          <p className="text-lg font-bold text-orange-600">{route.co2Reduction.toFixed(1)}kg</p>
                        </div>
                      </div>

                      {/* Efficiency Progress */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Routen-Effizienz</span>
                          <span className="font-medium">{route.efficiency}%</span>
                        </div>
                        <Progress value={route.efficiency} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Optimiert am</p>
                        <p className="text-sm font-medium">
                          {new Date(route.optimizationDate).toLocaleDateString('de-DE')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          Karte
                        </Button>
                        <Button size="sm">
                          Details
                        </Button>
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
                <CardTitle>Einsparungs-Kategorien</CardTitle>
                <CardDescription>Verteilung der Optimierungsgewinne</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={optimizationImpacts}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.percentage}%`}
                    >
                      {optimizationImpacts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `€${Number(value).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance-Metriken</CardTitle>
                <CardDescription>Fortschritt zu Optimierungszielen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {optimizationMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{metric.category}</span>
                      <span className="text-sm text-gray-600">
                        {metric.current}{metric.unit} / {metric.target}{metric.unit}
                      </span>
                    </div>
                    <Progress value={(metric.current / metric.target) * 100} />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Aktuell: {metric.current}{metric.unit}</span>
                      <span className="text-orange-600">
                        +{metric.improvement}{metric.unit} bis Ziel
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Zap className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">KI-Algorithmus Performance</h3>
                    <p className="text-sm text-gray-600">Optimierungsgenauigkeit: 94.8%</p>
                    <p className="text-xs text-blue-600 mt-1">+2.3% vs. letzter Monat</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Route className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Durchschnittliche Routenverbesserung</h3>
                    <p className="text-sm text-gray-600">28% Effizienzsteigerung</p>
                    <p className="text-xs text-green-600 mt-1">Über alle Routen</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Clock className="w-8 h-8 text-orange-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Optimierungszeit</h3>
                    <p className="text-sm text-gray-600">Ø 3.2 Minuten pro Route</p>
                    <p className="text-xs text-orange-600 mt-1">Real-time Berechnung</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Umwelt-Impact</CardTitle>
                <CardDescription>Ökologische Verbesserungen durch Optimierung</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">CO2-Einsparung diese Woche</span>
                  <span className="font-bold text-green-600">{totalCO2Reduction.toFixed(1)}kg</span>
                </div>
                <Progress value={75} />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Kraftstoff-Reduktion</span>
                  <span className="font-bold">24.2%</span>
                </div>
                <Progress value={24.2} />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Emissionsreduktion</span>
                  <span className="font-bold">15.8%</span>
                </div>
                <Progress value={15.8} />

                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Jährlich eingesparte CO2-Emissionen: ~2.8 Tonnen
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nachhaltigkeitsziele</CardTitle>
                <CardDescription>Fortschritt zu Umweltzielen 2024</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Target className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">25% CO2-Reduktion bis Q4</p>
                      <p className="text-xs text-gray-600">Aktuell: 15.8% erreicht</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Fuel className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">30% Kraftstoff-Einsparung</p>
                      <p className="text-xs text-gray-600">Aktuell: 24.2% erreicht</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Route className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">90% Routen-Optimierung</p>
                      <p className="text-xs text-gray-600">Aktuell: 86% erreicht</p>
                    </div>
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
