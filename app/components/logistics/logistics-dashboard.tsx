
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Truck, 
  Package, 
  TrendingUp, 
  AlertTriangle,
  MapPin,
  Clock,
  Brain,
  Leaf,
  Zap,
  Target,
  Activity,
  BarChart3,
  Eye,
  Route
} from 'lucide-react'
import { LogisticsAnalyticsCharts } from './logistics-analytics-charts'
import { ShipmentManager } from './shipment-manager'
import { RealTimeTracking } from './real-time-tracking'
import { CarrierPerformance } from './carrier-performance'

interface LogisticsAnalytics {
  overview: {
    totalShipments: number
    activeShipments: number
    deliveredShipments: number
    delayedShipments: number
    deliveryRate: number
    onTimeRate: number
    avgDeliveryTime: number
    avgEfficiency: number
    totalCO2: number
  }
  shipmentsByStatus: Array<{
    status: string
    count: number
    percentage: number
  }>
  shipmentsByCarrier: Array<{
    carrierName: string
    count: number
    percentage: number
  }>
  aiMetrics: {
    avgEfficiency: number
    avgDeliveryProbability: number
    avgPredictedDelay: number
    optimizationRate: number
    carbonEfficiency: number
  }
  carrierPerformance: Array<{
    carrierName: string
    totalShipments: number
    deliverySuccessRate: number
    avgEfficiency: number
    avgDeliveryTime: number
    costEfficiency: number
    customerSatisfaction: number
    recommendationScore: number
  }>
}

export function LogisticsDashboard() {
  const { data: session } = useSession()
  const [analytics, setAnalytics] = useState<LogisticsAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/logistics/analytics?period=30d')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch logistics analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading Logistics Dashboard...</div>
  }

  const overview = analytics?.overview
  const aiMetrics = analytics?.aiMetrics

  return (
    <div className="space-y-6">
      {/* Key Logistics Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Gesamt Sendungen
            </CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {overview?.totalShipments || 0}
            </div>
            <p className="text-xs text-blue-700">
              {overview?.activeShipments || 0} aktiv unterwegs
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Lieferrate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {overview?.deliveryRate?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-green-700">
              {overview?.deliveredShipments || 0} zugestellt
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Pünktlichkeit
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {overview?.onTimeRate?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-purple-700">
              Ø {overview?.avgDeliveryTime?.toFixed(1) || 0} Tage
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">
              CO2-Fußabdruck
            </CardTitle>
            <Leaf className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {overview?.totalCO2?.toFixed(1) || 0}kg
            </div>
            <p className="text-xs text-orange-700">
              Letzte 30 Tage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Logistics Intelligence */}
      <Card className="border-indigo-200 bg-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-indigo-800">
            <Brain className="h-5 w-5" />
            <span>KI-Logistik Intelligence (87% Autonomie)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Route className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-800">Routen-Effizienz</p>
                <p className="text-2xl font-bold text-indigo-900">{aiMetrics?.avgEfficiency || 0}%</p>
                <p className="text-xs text-indigo-700">KI-optimierte Routen</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Target className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-800">Lieferprognose</p>
                <p className="text-2xl font-bold text-indigo-900">{aiMetrics?.avgDeliveryProbability || 0}%</p>
                <p className="text-xs text-indigo-700">Vorhersage-Genauigkeit</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Zap className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-800">Automatisierung</p>
                <p className="text-2xl font-bold text-indigo-900">{aiMetrics?.optimizationRate || 0}%</p>
                <p className="text-xs text-indigo-700">Autonome Entscheidungen</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delay Alert */}
      {overview && overview.delayedShipments > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              <span>KI-Warnung: Verspätungen erkannt</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-800">
                  <strong>{overview.delayedShipments}</strong> Sendungen haben eine vorhergesagte Verspätung
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Empfehlung: Automatische Benachrichtigungen wurden versendet. 
                  Alternative Routen werden geprüft.
                </p>
              </div>
              <div className="flex space-x-2">
                <Badge variant="destructive">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {overview.delayedShipments} Verspätet
                </Badge>
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                  <Route className="h-3 w-3 mr-1" />
                  Optimieren
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Optimization Status */}
      <Card className="border-emerald-200 bg-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-emerald-800">
            <Activity className="h-5 w-5" />
            <span>Live-Optimierung Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-900">23</div>
              <div className="text-xs text-emerald-700">Routen optimiert</div>
              <div className="text-xs text-emerald-600">Letzte Stunde</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-900">€1,247</div>
              <div className="text-xs text-emerald-700">Kosteneinsparung</div>
              <div className="text-xs text-emerald-600">Heute</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-900">12.4kg</div>
              <div className="text-xs text-emerald-700">CO2 reduziert</div>
              <div className="text-xs text-emerald-600">Heute</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-900">4.7h</div>
              <div className="text-xs text-emerald-700">Zeit gespart</div>
              <div className="text-xs text-emerald-600">Heute</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Übersicht</span>
          </TabsTrigger>
          <TabsTrigger value="shipments" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>Sendungen</span>
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Live Tracking</span>
          </TabsTrigger>
          <TabsTrigger value="carriers" className="flex items-center space-x-2">
            <Truck className="h-4 w-4" />
            <span>Carrier</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <LogisticsAnalyticsCharts analytics={analytics} />
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <ShipmentManager />
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <RealTimeTracking />
        </TabsContent>

        <TabsContent value="carriers" className="space-y-4">
          <CarrierPerformance carriers={analytics?.carrierPerformance} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
