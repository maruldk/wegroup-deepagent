
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Wrench
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3', '#A19AD3'];

interface LogisticsMetrics {
  totalShipments: number;
  activeShipments: number;
  deliverySuccess: string;
  inventoryItems: number;
  inventoryValue: number;
  aiAutonomy: number;
}

export function EnhancedLogisticsDashboard() {
  const [logisticsMetrics, setLogisticsMetrics] = useState<LogisticsMetrics | null>(null);
  const [routeOptimization, setRouteOptimization] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<any>(null);
  const [predictiveMaintenance, setPredictiveMaintenance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogisticsData();
  }, []);

  const fetchLogisticsData = async () => {
    try {
      setLoading(true);
      const [unifiedRes, routeRes, inventoryRes, maintenanceRes] = await Promise.all([
        fetch('/api/integration/unified-dashboard'),
        fetch('/api/logistics/route-optimization'),
        fetch('/api/logistics/inventory-management'),
        fetch('/api/logistics/predictive-maintenance')
      ]);

      if (unifiedRes.ok) {
        const unified = await unifiedRes.json();
        setLogisticsMetrics(unified.realTimeKPIs?.logistics || {
          totalShipments: 156,
          activeShipments: 23,
          deliverySuccess: '96.8',
          inventoryItems: 342,
          inventoryValue: 125000,
          aiAutonomy: 88
        });
      }

      if (routeRes.ok) {
        const route = await routeRes.json();
        setRouteOptimization(route);
      }

      if (inventoryRes.ok) {
        const inventory = await inventoryRes.json();
        setInventoryData(inventory);
      }

      if (maintenanceRes.ok) {
        const maintenance = await maintenanceRes.json();
        setPredictiveMaintenance(maintenance);
      }
    } catch (error) {
      console.error('Error fetching logistics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deliveryPerformanceData = [
    { month: 'Jan', onTime: 94, delayed: 6, efficiency: 87 },
    { month: 'Feb', onTime: 96, delayed: 4, efficiency: 89 },
    { month: 'Mar', onTime: 95, delayed: 5, efficiency: 91 },
    { month: 'Apr', onTime: 97, delayed: 3, efficiency: 93 },
    { month: 'Mai', onTime: 98, delayed: 2, efficiency: 95 },
    { month: 'Jun', onTime: 97, delayed: 3, efficiency: 94 }
  ];

  const inventoryStatusData = [
    { name: 'Optimal', value: 65, color: '#80D8C3' },
    { name: 'Niedrig', value: 25, color: '#FF9149' },
    { name: 'Überbestand', value: 8, color: '#FF9898' },
    { name: 'Kritisch', value: 2, color: '#FF6363' }
  ];

  const routeOptimizationData = [
    { route: 'Route A', original: 125, optimized: 89, savings: 36 },
    { route: 'Route B', original: 98, optimized: 76, savings: 22 },
    { route: 'Route C', original: 156, optimized: 118, savings: 38 },
    { route: 'Route D', original: 87, optimized: 69, savings: 18 }
  ];

  const maintenanceData = [
    { equipment: 'Fahrzeug 001', health: 92, nextMaintenance: '2024-02-15', urgency: 'LOW' },
    { equipment: 'Fahrzeug 002', health: 78, nextMaintenance: '2024-02-08', urgency: 'MEDIUM' },
    { equipment: 'Lager-Roboter 1', health: 65, nextMaintenance: '2024-02-05', urgency: 'HIGH' },
    { equipment: 'Fahrzeug 003', health: 88, nextMaintenance: '2024-02-20', urgency: 'LOW' }
  ];

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* AI Autonomy Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Logistikmanagement</h1>
          <p className="text-muted-foreground">KI-gestützte Lieferketten-Optimierung mit 88% Autonomie</p>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-500" />
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            88% KI-Autonomie
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Real-time Tracking
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamte Sendungen</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logisticsMetrics?.totalShipments || 0}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +18% vs. letzter Monat
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktive Sendungen</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logisticsMetrics?.activeShipments || 0}</div>
              <p className="text-xs text-muted-foreground">
                Real-time Tracking aktiv
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Liefererfolg</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logisticsMetrics?.deliverySuccess || 0}%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +2.4% Verbesserung
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lagerbestand</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logisticsMetrics?.inventoryItems || 0}</div>
              <p className="text-xs text-muted-foreground">
                €{logisticsMetrics?.inventoryValue?.toLocaleString() || '0'} Wert
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Überblick</TabsTrigger>
          <TabsTrigger value="routing">Route-Optimierung</TabsTrigger>
          <TabsTrigger value="inventory">Lagerbestand</TabsTrigger>
          <TabsTrigger value="maintenance">Wartung</TabsTrigger>
          <TabsTrigger value="analytics">KI-Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Delivery Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Lieferleistung & Effizienz
                </CardTitle>
                <CardDescription>
                  Entwicklung der Lieferzuverlässigkeit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={deliveryPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="onTime" 
                      stroke="#60B5FF" 
                      strokeWidth={2}
                      name="Pünktlich %"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke="#80D8C3" 
                      strokeWidth={2}
                      name="Effizienz %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Inventory Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Lagerbestand-Status
                </CardTitle>
                <CardDescription>
                  Verteilung der Lagerbestandslevel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={inventoryStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }: {name: string, value: number}) => `${name}: ${value}%`}
                    >
                      {inventoryStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Route Optimization Overview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Route className="h-5 w-5 mr-2" />
                  Route-Optimierung Übersicht
                </CardTitle>
                <CardDescription>
                  KI-optimierte Routen mit Einsparungen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={routeOptimizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="route" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(value) => `${value} km`} />
                    <Bar dataKey="original" fill="#FF9149" name="Original" />
                    <Bar dataKey="optimized" fill="#60B5FF" name="Optimiert" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="routing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Route Optimization Results */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-blue-500" />
                  KI-Route-Optimierung
                </CardTitle>
                <CardDescription>
                  Automatische Routenplanung mit CO2-Reduktion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {routeOptimizationData.map((route, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{route.route}</h4>
                          <p className="text-sm text-muted-foreground">
                            {route.original}km → {route.optimized}km
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          -{route.savings}km gespart
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Distanz-Reduktion</span>
                          <span className="text-green-600">{Math.round((route.savings / route.original) * 100)}%</span>
                        </div>
                        <Progress value={(route.savings / route.original) * 100} className="h-1" />
                        <div className="flex justify-between text-sm">
                          <span>CO2-Einsparung</span>
                          <span className="text-blue-600">{(route.savings * 0.12).toFixed(1)} kg</span>
                        </div>
                        <Progress value={(route.savings / route.original) * 100} className="h-1" />
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <MapPin className="h-3 w-3 mr-1" />
                          Route anzeigen
                        </Button>
                        <Button size="sm" variant="outline">
                          Implementieren
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Routing Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Optimierungsstatistiken</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Durchschnittliche Einsparung</span>
                    <span className="text-sm font-medium">28.5%</span>
                  </div>
                  <Progress value={28.5} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">CO2-Reduktion</span>
                    <span className="text-sm font-medium">-35%</span>
                  </div>
                  <Progress value={35} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Kostenersparnis</span>
                    <span className="text-sm font-medium">€1,250/Monat</span>
                  </div>
                  <Progress value={75} />
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    📍 89% der Routen automatisch optimiert
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ⚡ 4.2 Sekunden durchschnittliche Berechnungszeit
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Route Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-500" />
                Echtzeit-Routenüberwachung
              </CardTitle>
              <CardDescription>
                Live-Tracking und dynamische Anpassungen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { title: "Aktive Fahrten", value: "23", icon: Truck, color: "blue" },
                  { title: "Verspätungen", value: "2", icon: Clock, color: "orange" },
                  { title: "Umgeleitete Routen", value: "5", icon: Route, color: "purple" },
                  { title: "Durchschnittliche Verzögerung", value: "8min", icon: AlertTriangle, color: "red" }
                ].map((stat, index) => (
                  <div key={index} className={`p-4 bg-${stat.color}-50 rounded-lg border border-${stat.color}-200`}>
                    <div className="flex items-center justify-between">
                      <stat.icon className={`h-8 w-8 text-${stat.color}-500`} />
                      <div className="text-right">
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inventory Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Bestandslevel
                </CardTitle>
                <CardDescription>
                  KI-optimierte Lagerbestände
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { item: "Elektronik", current: 150, optimal: 120, status: "hoch" },
                    { item: "Bürobedarf", current: 89, optimal: 95, status: "niedrig" },
                    { item: "Software", current: 45, optimal: 50, status: "optimal" },
                    { item: "Hardware", current: 78, optimal: 80, status: "optimal" }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.item}</span>
                        <Badge variant={
                          item.status === "hoch" ? "destructive" : 
                          item.status === "niedrig" ? "secondary" : "default"
                        }>
                          {item.current}/{item.optimal}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Aktuell: {item.current}</span>
                          <span>Optimal: {item.optimal}</span>
                        </div>
                        <Progress value={(item.current / item.optimal) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Demand Forecasting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-blue-500" />
                  Nachfrageprognose
                </CardTitle>
                <CardDescription>
                  KI-basierte Bedarfsvorhersage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={[
                    { month: 'Jan', predicted: 120, actual: 115 },
                    { month: 'Feb', predicted: 135, actual: 132 },
                    { month: 'Mar', predicted: 125, actual: 128 },
                    { month: 'Apr', predicted: 140, actual: 138 },
                    { month: 'Mai', predicted: 155, actual: 152 },
                    { month: 'Jun', predicted: 165, actual: null }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#60B5FF" 
                      fill="#60B5FF"
                      fillOpacity={0.3}
                      name="Tatsächlich"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#80D8C3" 
                      fill="#80D8C3"
                      fillOpacity={0.3}
                      strokeDasharray="5 5"
                      name="Prognose"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Automated Reordering */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  Automatische Nachbestellung
                </CardTitle>
                <CardDescription>
                  KI-gesteuerte Beschaffungsempfehlungen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      item: "Laptop Dell XPS",
                      sku: "SKU-001",
                      currentStock: 12,
                      reorderPoint: 15,
                      recommendedQuantity: 25,
                      urgency: "HIGH",
                      supplier: "Tech Solutions GmbH",
                      estimatedCost: "€12,500"
                    },
                    {
                      item: "Office Chairs",
                      sku: "SKU-045",
                      currentStock: 8,
                      reorderPoint: 10,
                      recommendedQuantity: 20,
                      urgency: "MEDIUM",
                      supplier: "Office Furniture AG",
                      estimatedCost: "€3,200"
                    },
                    {
                      item: "Drucker Toner",
                      sku: "SKU-089",
                      currentStock: 5,
                      reorderPoint: 8,
                      recommendedQuantity: 50,
                      urgency: "LOW",
                      supplier: "Supplies Direct",
                      estimatedCost: "€890"
                    }
                  ].map((order, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{order.item}</h4>
                          <p className="text-sm text-muted-foreground">{order.sku}</p>
                        </div>
                        <Badge variant={
                          order.urgency === "HIGH" ? "destructive" : 
                          order.urgency === "MEDIUM" ? "secondary" : "default"
                        }>
                          {order.urgency}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Bestand:</span>
                          <span>{order.currentStock} / {order.reorderPoint}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Empfehlung:</span>
                          <span className="font-medium">{order.recommendedQuantity} Stück</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kosten:</span>
                          <span className="font-medium">{order.estimatedCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lieferant:</span>
                          <span className="text-blue-600">{order.supplier}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Bestellen
                        </Button>
                        <Button size="sm" variant="ghost">
                          Anpassen
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Predictive Maintenance Overview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="h-5 w-5 mr-2 text-blue-500" />
                  Predictive Maintenance
                </CardTitle>
                <CardDescription>
                  KI-basierte Wartungsvorhersage für Equipment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceData.map((equipment, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{equipment.equipment}</h4>
                          <p className="text-sm text-muted-foreground">
                            Nächste Wartung: {equipment.nextMaintenance}
                          </p>
                        </div>
                        <Badge variant={
                          equipment.urgency === "HIGH" ? "destructive" : 
                          equipment.urgency === "MEDIUM" ? "secondary" : "default"
                        }>
                          {equipment.urgency}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Zustand</span>
                          <span className={`font-medium ${
                            equipment.health > 80 ? 'text-green-600' : 
                            equipment.health > 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {equipment.health}%
                          </span>
                        </div>
                        <Progress value={equipment.health} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Letzte Wartung: vor 45 Tagen</span>
                          <span>Ausfallrisiko: {100 - equipment.health}%</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3 mr-1" />
                          Wartung planen
                        </Button>
                        <Button size="sm" variant="ghost">
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Wartungsstatistiken</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">98.5%</div>
                  <p className="text-sm text-muted-foreground">Equipment-Verfügbarkeit</p>
                  <Progress value={98.5} />
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">15</div>
                  <p className="text-sm text-muted-foreground">Vermiedene Ausfälle</p>
                  <Progress value={75} />
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">€45K</div>
                  <p className="text-sm text-muted-foreground">Kosteneinsparung</p>
                  <Progress value={85} />
                </div>
                <div className="pt-4 border-t text-sm text-muted-foreground">
                  <p>🔧 Nächste Wartung in 3 Tagen</p>
                  <p>⚡ 92% Vorhersagegenauigkeit</p>
                  <p>💰 35% weniger Wartungskosten</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Maintenance Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-500" />
                KI-Wartungsinsights
              </CardTitle>
              <CardDescription>
                Automatisierte Wartungsempfehlungen und Optimierungen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-600">Optimierte Wartungszyklen</h4>
                  <p className="text-sm text-muted-foreground">
                    KI hat Wartungsintervalle um 25% optimiert und Ausfallzeiten reduziert
                  </p>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm">Effizienzsteigerung: 25%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-green-600">Kosteneinsparungen</h4>
                  <p className="text-sm text-muted-foreground">
                    Predictive Analytics haben Notfallreparaturen um 60% reduziert
                  </p>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm">€45,000 eingespart</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-600">Zustandsüberwachung</h4>
                  <p className="text-sm text-muted-foreground">
                    Kontinuierliche Sensordatenanalyse für proaktive Wartung
                  </p>
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-purple-500" />
                    <span className="text-sm">24/7 Monitoring aktiv</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* AI Analytics Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-500" />
                KI-Logistik-Analytics
              </CardTitle>
              <CardDescription>
                88% KI-Autonomie in Logistikprozessen erreicht
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">89%</div>
                  <p className="text-sm text-muted-foreground">Route-Optimierung</p>
                  <Progress value={89} />
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">91%</div>
                  <p className="text-sm text-muted-foreground">Bestandsvorhersage</p>
                  <Progress value={91} />
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">85%</div>
                  <p className="text-sm text-muted-foreground">Wartungsoptimierung</p>
                  <Progress value={85} />
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-orange-600">88%</div>
                  <p className="text-sm text-muted-foreground">Gesamtautonomie</p>
                  <Progress value={88} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Improvements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Leistungsverbesserungen</CardTitle>
                <CardDescription>
                  Messbare KI-Optimierungsergebnisse
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { metric: "Lieferzeiten", improvement: "-35%", value: "Durchschnittlich 2.8 Tage weniger" },
                  { metric: "Transportkosten", improvement: "-28%", value: "€8,500 monatliche Einsparung" },
                  { metric: "CO2-Emissionen", improvement: "-32%", value: "1.2 Tonnen weniger pro Monat" },
                  { metric: "Lagerkosten", improvement: "-22%", value: "Optimale Bestandsführung" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{item.metric}</p>
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                    </div>
                    <div className="text-center mr-4">
                      <p className={`text-lg font-bold ${item.improvement.startsWith('-') ? 'text-green-600' : 'text-blue-600'}`}>
                        {item.improvement}
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI & Kosteneinsparungen</CardTitle>
                <CardDescription>
                  Wirtschaftliche Auswirkungen der KI-Optimierung
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">€185K</p>
                    <p className="text-sm text-muted-foreground">Jährliche Einsparung</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">280%</p>
                    <p className="text-sm text-muted-foreground">ROI in 18 Monaten</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600">65%</p>
                    <p className="text-sm text-muted-foreground">Weniger manuelle Planung</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-orange-600">96%</p>
                    <p className="text-sm text-muted-foreground">Vorhersagegenauigkeit</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Nächste Optimierungsschritte</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Drone-Delivery-Integration</span>
                      <Badge variant="outline">Q2 2024</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>IoT-Sensor-Netzwerk</span>
                      <Badge variant="outline">Q3 2024</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Blockchain-Tracking</span>
                      <Badge variant="outline">Q4 2024</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                KI-Logistik-Insights
              </CardTitle>
              <CardDescription>
                Aktuelle KI-Empfehlungen und Optimierungspotentiale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Implementierung eines Hub-and-Spoke-Modells könnte Transportkosten um weitere 15% reduzieren",
                  "Predictive Analytics zeigen erhöhten Bedarf für Elektronik-Komponenten in Q1 2024",
                  "Wartungsintervalle für Fahrzeug-001 und Fahrzeug-003 können um 2 Wochen verlängert werden",
                  "Route-Optimierung für Donnerstag-Lieferungen zeigt Potential für 12% Zeiteinsparung"
                ].map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Brain className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                    <p className="text-sm flex-1">{insight}</p>
                    <Button size="sm" variant="ghost">
                      Umsetzen
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

