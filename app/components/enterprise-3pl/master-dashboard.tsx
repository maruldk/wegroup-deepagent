
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Package, 
  TrendingUp, 
  Brain, 
  MapPin, 
  AlertTriangle,
  Clock,
  Zap,
  BarChart3,
  Activity,
  Settings,
  CheckCircle,
  Route,
  Users,
  Building,
  ShoppingCart,
  FileText,
  Search,
  Bell,
  Filter,
  RefreshCw,
  Globe,
  Shield,
  Leaf,
  Target,
  Layers
} from 'lucide-react';

interface Enterprise3PLMasterDashboardProps {
  tenantId: string;
}

export default function Enterprise3PLMasterDashboard({ tenantId }: Enterprise3PLMasterDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, [tenantId, selectedTimeRange]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Parallel laden aller Dashboard-Daten
      const [analyticsResponse, trackingResponse, performanceResponse] = await Promise.all([
        fetch(`/api/enterprise-3pl/analytics/dashboard?tenantId=${tenantId}&timeRange=${selectedTimeRange}`),
        fetch(`/api/enterprise-3pl/realtime/tracking?tenantId=${tenantId}`),
        fetch(`/api/enterprise-3pl/performance/monitoring?tenantId=${tenantId}&type=overview&timeRange=${selectedTimeRange}`)
      ]);

      const [analyticsData, trackingData, performanceData] = await Promise.all([
        analyticsResponse.json(),
        trackingResponse.json(),
        performanceResponse.json()
      ]);

      setDashboardData({
        analytics: analyticsData.data || {},
        tracking: trackingData.data || {},
        performance: performanceData.data?.metrics || {}
      });

      setAlerts(performanceData.data?.alerts || []);
    } catch (error) {
      console.error('Fehler beim Laden der Dashboard-Daten:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-500';
      case 'IN_TRANSIT': return 'bg-blue-500';
      case 'PENDING': return 'bg-yellow-500';
      case 'EXCEPTION': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-lg">Lade Enterprise 3PL Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Truck className="w-8 h-8 text-blue-600" />
              Enterprise 3PL Command Center
            </h1>
            <p className="text-gray-600 mt-1">
              Vollständige Kontrolle über Ihre Logistikoperationen
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
              <Clock className="w-4 h-4 text-gray-500" />
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="border-none bg-transparent text-sm font-medium focus:outline-none"
              >
                <option value="1h">Letzte Stunde</option>
                <option value="24h">Letzte 24h</option>
                <option value="7d">Letzte 7 Tage</option>
                <option value="30d">Letzte 30 Tage</option>
              </select>
            </div>
            
            <Button 
              onClick={loadDashboardData}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Aktualisieren
            </Button>
          </div>
        </motion.div>

        {/* Alert-Banner */}
        {alerts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-red-200 p-4 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-red-800">Aktive Warnungen</h3>
              <Badge variant="destructive">{alerts.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {alerts.slice(0, 3).map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getAlertColor(alert.level)}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{alert.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {alert.level}
                    </Badge>
                  </div>
                  <p className="text-xs mt-1 opacity-80">{alert.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Transportanfragen</p>
                    <p className="text-3xl font-bold mt-1">
                      {formatNumber(dashboardData?.analytics?.kpis?.totalRequests || 0)}
                    </p>
                  </div>
                  <div className="bg-blue-400 rounded-full p-3">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+12% vs. Vorperiode</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Pünktlichkeitsrate</p>
                    <p className="text-3xl font-bold mt-1">
                      {dashboardData?.analytics?.kpis?.onTimeDeliveryRate || 0}%
                    </p>
                  </div>
                  <div className="bg-green-400 rounded-full p-3">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Über Zielwert</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">KI-Automatisierung</p>
                    <p className="text-3xl font-bold mt-1">
                      {dashboardData?.analytics?.kpis?.automationLevel || 0}%
                    </p>
                  </div>
                  <div className="bg-purple-400 rounded-full p-3">
                    <Brain className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">88% Effizienz</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Kosteneffizienz</p>
                    <p className="text-3xl font-bold mt-1">
                      {dashboardData?.analytics?.kpis?.costEfficiency || 0}%
                    </p>
                  </div>
                  <div className="bg-orange-400 rounded-full p-3">
                    <Target className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm">€2.3M Einsparungen</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white rounded-lg shadow-sm p-1">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Activity className="w-4 h-4" />
              Übersicht
            </TabsTrigger>
            <TabsTrigger 
              value="carriers" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Truck className="w-4 h-4" />
              Carrier
            </TabsTrigger>
            <TabsTrigger 
              value="routing" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Route className="w-4 h-4" />
              Routing
            </TabsTrigger>
            <TabsTrigger 
              value="tracking" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <MapPin className="w-4 h-4" />
              Tracking
            </TabsTrigger>
            <TabsTrigger 
              value="compliance" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Shield className="w-4 h-4" />
              Compliance
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Operational Performance */}
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Betriebsleistung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Konvertierungsrate</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {dashboardData?.analytics?.kpis?.conversionRate || 0}%
                      </span>
                    </div>
                    <Progress value={dashboardData?.analytics?.kpis?.conversionRate || 0} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Durchschnittliche Bearbeitungszeit</span>
                      <span className="text-2xl font-bold text-green-600">
                        {dashboardData?.analytics?.kpis?.avgProcessingTime || 0}h
                      </span>
                    </div>
                    <Progress value={75} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Carrier-Zuverlässigkeit</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {dashboardData?.analytics?.kpis?.carrierPerformance || 0}%
                      </span>
                    </div>
                    <Progress value={dashboardData?.analytics?.kpis?.carrierPerformance || 0} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-600" />
                    System-Gesundheit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">System-Uptime</span>
                      <span className="text-2xl font-bold text-green-600">99.9%</span>
                    </div>
                    <Progress value={99.9} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">API-Antwortzeit</span>
                      <span className="text-2xl font-bold text-blue-600">127ms</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Durchsatz</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {dashboardData?.performance?.throughput || 0}/h
                      </span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  Letzte Aktivitäten
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData?.analytics?.recentActivity?.slice(0, 5).map((activity: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Transport-Anfrage {activity.requestNumber}
                        </p>
                        <p className="text-xs text-gray-600">
                          {activity.creator?.firstName} {activity.creator?.lastName} • 
                          {new Date(activity.createdAt).toLocaleString('de-DE')}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="carriers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    Aktive Carrier
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {dashboardData?.analytics?.kpis?.activeCarriers || 0}
                    </div>
                    <p className="text-sm text-gray-600">von {dashboardData?.analytics?.kpis?.activeCarriers || 0} registriert</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Top Performer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData?.analytics?.topPerformers?.carriers?.slice(0, 3).map((carrier: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{carrier.name}</span>
                        <Badge variant="secondary">{carrier.score}%</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Risikoanalyse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Verspätete Sendungen</span>
                      <span className="text-lg font-bold text-orange-600">
                        {dashboardData?.analytics?.riskAnalysis?.delayedOrders || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Hochrisiko-Sendungen</span>
                      <span className="text-lg font-bold text-red-600">
                        {dashboardData?.analytics?.riskAnalysis?.highRiskShipments || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Inaktive Carrier</span>
                      <span className="text-lg font-bold text-gray-600">
                        {dashboardData?.analytics?.riskAnalysis?.inactiveCarriers || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="routing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Route className="w-5 h-5 text-blue-600" />
                    Routenoptimierung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Eingesparte Distanz</span>
                      <span className="text-2xl font-bold text-green-600">12.5%</span>
                    </div>
                    <Progress value={12.5} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Zeitersparnis</span>
                      <span className="text-2xl font-bold text-blue-600">8.3%</span>
                    </div>
                    <Progress value={8.3} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">CO2-Einsparung</span>
                      <span className="text-2xl font-bold text-purple-600">15.2%</span>
                    </div>
                    <Progress value={15.2} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-green-600" />
                    Top Routen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData?.analytics?.topPerformers?.routes?.slice(0, 5).map((route: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{route.route}</span>
                        <Badge variant="outline">{route.count} Fahrten</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Sendungsübersicht
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Gesamt</span>
                      <span className="text-lg font-bold">
                        {dashboardData?.tracking?.statistics?.totalShipments || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Unterwegs</span>
                      <span className="text-lg font-bold text-blue-600">
                        {dashboardData?.tracking?.statistics?.inTransit || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Zugestellt</span>
                      <span className="text-lg font-bold text-green-600">
                        {dashboardData?.tracking?.statistics?.delivered || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Verzögert</span>
                      <span className="text-lg font-bold text-red-600">
                        {dashboardData?.tracking?.statistics?.delayed || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    Lieferzeiten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Durchschnitt</span>
                      <span className="text-lg font-bold text-blue-600">
                        {dashboardData?.tracking?.statistics?.avgDeliveryTime || 0}h
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pünktlichkeit</span>
                      <span className="text-lg font-bold text-green-600">
                        {dashboardData?.tracking?.statistics?.onTimeRate || 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    Geografische Verteilung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData?.analytics?.geoDistribution?.countries?.slice(0, 5).map((country: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{country.country}</span>
                        <Badge variant="outline">{country.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Compliance Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {dashboardData?.analytics?.kpis?.complianceScore || 0}%
                    </div>
                    <p className="text-sm text-gray-600">Gesamt-Compliance</p>
                    <Progress value={dashboardData?.analytics?.kpis?.complianceScore || 0} className="h-2 mt-3" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Dokumente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Genehmigt</span>
                      <span className="text-lg font-bold text-green-600">
                        {dashboardData?.analytics?.statusDistribution?.compliance?.APPROVED || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ausstehend</span>
                      <span className="text-lg font-bold text-yellow-600">
                        {dashboardData?.analytics?.statusDistribution?.compliance?.PENDING || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Abgelaufen</span>
                      <span className="text-lg font-bold text-red-600">
                        {dashboardData?.analytics?.statusDistribution?.compliance?.EXPIRED || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Risikobewertung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Abgelaufene Dokumente</span>
                      <span className="text-lg font-bold text-red-600">
                        {dashboardData?.analytics?.riskAnalysis?.expiredDocuments || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mittleres Risiko</span>
                      <span className="text-lg font-bold text-yellow-600">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Niedriges Risiko</span>
                      <span className="text-lg font-bold text-green-600">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Trend-Analyse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {dashboardData?.analytics?.trends?.slice(-1)[0]?.requests || 0}
                        </div>
                        <p className="text-sm text-gray-600">Tägliche Anfragen</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          €{formatNumber(dashboardData?.analytics?.trends?.slice(-1)[0]?.revenue || 0)}
                        </div>
                        <p className="text-sm text-gray-600">Täglicher Umsatz</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    Nachhaltigkeit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">CO2-Einsparung</span>
                      <span className="text-2xl font-bold text-green-600">15.2%</span>
                    </div>
                    <Progress value={15.2} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Grüne Routen</span>
                      <span className="text-2xl font-bold text-blue-600">23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Nachhaltige Carrier</span>
                      <span className="text-2xl font-bold text-purple-600">67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
