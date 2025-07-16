
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Truck, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  BarChart3,
  PieChart,
  Target,
  Lightbulb
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
  PieChart as RechartsPieChart,
  Cell
} from 'recharts';

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3', '#A19AD3'];

interface UnifiedKPIs {
  hr: any;
  finance: any;
  logistics: any;
}

interface CrossModuleInsights {
  hrFinanceCorrelation: any;
  financeLogisticsCorrelation: any;
  hrLogisticsCorrelation: any;
}

export function UnifiedDashboard() {
  const [unifiedKPIs, setUnifiedKPIs] = useState<UnifiedKPIs | null>(null);
  const [enterpriseHealth, setEnterpriseHealth] = useState<any>(null);
  const [crossModuleInsights, setCrossModuleInsights] = useState<CrossModuleInsights | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [operationalAlerts, setOperationalAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnifiedData();
  }, []);

  const fetchUnifiedData = async () => {
    try {
      setLoading(true);
      const [unifiedRes, crossModuleRes] = await Promise.all([
        fetch('/api/integration/unified-dashboard'),
        fetch('/api/integration/cross-module-analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            analysisType: 'COMPREHENSIVE',
            modules: ['HR', 'FINANCE', 'LOGISTICS'],
            timeframe: 'Last Quarter'
          })
        })
      ]);

      if (unifiedRes.ok) {
        const unified = await unifiedRes.json();
        setUnifiedKPIs(unified.realTimeKPIs);
        setEnterpriseHealth(unified.enterpriseHealth);
        setOperationalAlerts(unified.operationalAlerts || []);
        setAiRecommendations(unified.aiRecommendations || []);
      }

      if (crossModuleRes.ok) {
        const crossModule = await crossModuleRes.json();
        setCrossModuleInsights(crossModule.analysis?.crossModuleCorrelations);
      }
    } catch (error) {
      console.error('Error fetching unified data:', error);
      // Set fallback data
      setUnifiedKPIs({
        hr: { totalEmployees: 25, averagePerformance: 78.2, highPerformers: 8, atRiskEmployees: 3, retentionRate: '87.5', aiAutonomy: 90 },
        finance: { totalRevenue: 125000, totalInvoices: 45, pendingInvoices: 8, cashFlow: 85000, profitMargin: 23.5, aiAutonomy: 92 },
        logistics: { totalShipments: 156, activeShipments: 23, deliverySuccess: '96.8', inventoryItems: 342, inventoryValue: 125000, aiAutonomy: 88 }
      });
      setEnterpriseHealth({ overall: 89.7, financial: 92, operational: 88, human: 90, trend: 'IMPROVING' });
      setOperationalAlerts([
        { type: 'HR_RISK', severity: 'MEDIUM', message: '3 employees at high churn risk', action: 'Review retention strategies', module: 'HR' },
        { type: 'FINANCE_PROCESS', severity: 'LOW', message: '8 invoices pending payment', action: 'Accelerate collection process', module: 'FINANCE' }
      ]);
      setAiRecommendations([
        { priority: 'HIGH', module: 'HR', recommendation: 'Implement retention program for at-risk employees', expectedImpact: '25% reduction in churn', timeframe: '2 weeks' },
        { priority: 'MEDIUM', module: 'FINANCE', recommendation: 'Automate invoice follow-up process', expectedImpact: '30% faster collections', timeframe: '1 week' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const enterpriseMetricsData = [
    { month: 'Jan', revenue: 98000, employees: 22, shipments: 120, efficiency: 82 },
    { month: 'Feb', revenue: 105000, employees: 23, shipments: 135, efficiency: 85 },
    { month: 'Mar', revenue: 112000, employees: 24, shipments: 142, efficiency: 87 },
    { month: 'Apr', revenue: 108000, employees: 24, shipments: 138, efficiency: 89 },
    { month: 'Mai', revenue: 118000, employees: 25, shipments: 148, efficiency: 91 },
    { month: 'Jun', revenue: 125000, employees: 25, shipments: 156, efficiency: 94 }
  ];

  const aiAutonomyData = [
    { module: 'HR', autonomy: unifiedKPIs?.hr?.aiAutonomy || 90, target: 90 },
    { module: 'Finance', autonomy: unifiedKPIs?.finance?.aiAutonomy || 92, target: 92 },
    { module: 'Logistics', autonomy: unifiedKPIs?.logistics?.aiAutonomy || 88, target: 88 },
    { module: 'Overall', autonomy: enterpriseHealth?.overall || 89.7, target: 85 }
  ];

  const crossModuleMetrics = [
    { correlation: 'HR ↔ Finance', value: 0.87, description: 'Employee performance vs revenue correlation' },
    { correlation: 'Finance ↔ Logistics', value: 0.91, description: 'Revenue vs shipment volume correlation' },
    { correlation: 'HR ↔ Logistics', value: 0.69, description: 'Employee performance vs delivery quality' }
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
      {/* Enterprise AI Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enterprise AI Dashboard</h1>
          <p className="text-muted-foreground">Unified Business Intelligence mit {enterpriseHealth?.overall?.toFixed(1)}% KI-Autonomie</p>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-500" />
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {enterpriseHealth?.overall?.toFixed(1)}% Gesamtautonomie
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Cross-Module Analytics
          </Badge>
        </div>
      </div>

      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamtumsatz</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{unifiedKPIs?.finance?.totalRevenue?.toLocaleString() || '0'}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12.5% vs. letzter Monat
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
              <CardTitle className="text-sm font-medium">Mitarbeiter</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unifiedKPIs?.hr?.totalEmployees || 0}</div>
              <p className="text-xs text-muted-foreground">
                Performance: {unifiedKPIs?.hr?.averagePerformance || 0}/100
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
              <CardTitle className="text-sm font-medium">Sendungen</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unifiedKPIs?.logistics?.totalShipments || 0}</div>
              <p className="text-xs text-muted-foreground">
                {unifiedKPIs?.logistics?.deliverySuccess || 0}% Erfolgsrate
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
              <CardTitle className="text-sm font-medium">KI-Effizienz</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enterpriseHealth?.overall?.toFixed(1) || 0}%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                {enterpriseHealth?.trend || 'STABLE'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warnungen</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{operationalAlerts?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Benötigen Aufmerksamkeit
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Executive Overview</TabsTrigger>
          <TabsTrigger value="modules">Module Performance</TabsTrigger>
          <TabsTrigger value="correlations">Cross-Module Insights</TabsTrigger>
          <TabsTrigger value="recommendations">KI-Empfehlungen</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enterprise Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Enterprise Performance Trends
                </CardTitle>
                <CardDescription>
                  Unified metrics across all business modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={enterpriseMetricsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'revenue') return [`€${Number(value).toLocaleString()}`, 'Revenue'];
                        if (name === 'employees') return [value, 'Employees'];
                        if (name === 'shipments') return [value, 'Shipments'];
                        if (name === 'efficiency') return [`${value}%`, 'AI Efficiency'];
                        return [value, name];
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke="#60B5FF" 
                      strokeWidth={3}
                      name="efficiency"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* AI Autonomy by Module */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-blue-500" />
                  KI-Autonomie nach Modulen
                </CardTitle>
                <CardDescription>
                  Zielerreichung der KI-Automatisierung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiAutonomyData.map((module, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{module.module}</span>
                        <Badge variant={module.autonomy >= module.target ? "default" : "secondary"}>
                          {module.autonomy}% / {module.target}%
                        </Badge>
                      </div>
                      <Progress value={module.autonomy} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Aktuell: {module.autonomy}%</span>
                        <span>Ziel: {module.target}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Health Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Enterprise Health Score
                </CardTitle>
                <CardDescription>
                  Gesamtbewertung der Unternehmensleistung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold text-blue-600">{enterpriseHealth?.overall?.toFixed(1) || 0}</div>
                  <p className="text-lg text-muted-foreground">von 100</p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">{enterpriseHealth?.financial || 0}</p>
                      <p className="text-sm text-muted-foreground">Financial</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{enterpriseHealth?.operational || 0}</p>
                      <p className="text-sm text-muted-foreground">Operational</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{enterpriseHealth?.human || 0}</p>
                      <p className="text-sm text-muted-foreground">Human Capital</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Operational Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                  Operative Warnungen
                </CardTitle>
                <CardDescription>
                  Aktive Systemwarnungen und Handlungsempfehlungen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {operationalAlerts?.length > 0 ? operationalAlerts.map((alert, index) => (
                  <div key={index} className={`p-3 border rounded-lg ${
                    alert.severity === 'HIGH' ? 'bg-red-50 border-red-200' :
                    alert.severity === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">{alert.module}</p>
                      </div>
                      <Badge variant={
                        alert.severity === 'HIGH' ? 'destructive' : 
                        alert.severity === 'MEDIUM' ? 'secondary' : 'default'
                      }>
                        {alert.severity}
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline" className="mt-2">
                      {alert.action}
                    </Button>
                  </div>
                )) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p>Alle Systeme funktionieren optimal</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* HR Module Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  HR Module
                </CardTitle>
                <CardDescription>
                  {unifiedKPIs?.hr?.aiAutonomy || 90}% KI-Autonomie erreicht
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Mitarbeiter</p>
                    <p className="text-sm text-muted-foreground">Aktive Beschäftigte</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{unifiedKPIs?.hr?.totalEmployees || 0}</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Performance</p>
                    <p className="text-sm text-muted-foreground">Durchschnittswert</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{unifiedKPIs?.hr?.averagePerformance || 0}</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium">Top Performer</p>
                    <p className="text-sm text-muted-foreground">Score &gt;85</p>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{unifiedKPIs?.hr?.highPerformers || 0}</div>
                </div>
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    HR Dashboard öffnen
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Finance Module Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Finance Module
                </CardTitle>
                <CardDescription>
                  {unifiedKPIs?.finance?.aiAutonomy || 92}% KI-Autonomie erreicht
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Umsatz</p>
                    <p className="text-sm text-muted-foreground">Monatlich</p>
                  </div>
                  <div className="text-xl font-bold text-green-600">€{unifiedKPIs?.finance?.totalRevenue?.toLocaleString() || '0'}</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Rechnungen</p>
                    <p className="text-sm text-muted-foreground">Gesamt verarbeitet</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{unifiedKPIs?.finance?.totalInvoices || 0}</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium">Gewinnmarge</p>
                    <p className="text-sm text-muted-foreground">Aktueller Monat</p>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">{unifiedKPIs?.finance?.profitMargin || 0}%</div>
                </div>
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    Finance Dashboard öffnen
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Logistics Module Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Logistics Module
                </CardTitle>
                <CardDescription>
                  {unifiedKPIs?.logistics?.aiAutonomy || 88}% KI-Autonomie erreicht
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Sendungen</p>
                    <p className="text-sm text-muted-foreground">Monatlich</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{unifiedKPIs?.logistics?.totalShipments || 0}</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Liefererfolg</p>
                    <p className="text-sm text-muted-foreground">Erfolgsrate</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{unifiedKPIs?.logistics?.deliverySuccess || 0}%</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium">Lagerbestand</p>
                    <p className="text-sm text-muted-foreground">Artikel</p>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{unifiedKPIs?.logistics?.inventoryItems || 0}</div>
                </div>
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    Logistics Dashboard öffnen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="correlations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-500" />
                Cross-Module KI-Analytics
              </CardTitle>
              <CardDescription>
                Integrierte Geschäftsintelligenz über alle Module hinweg
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">87%</div>
                  <p className="text-sm text-muted-foreground">HR-Finance Korrelation</p>
                  <Progress value={87} />
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">91%</div>
                  <p className="text-sm text-muted-foreground">Finance-Logistics Korrelation</p>
                  <Progress value={91} />
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">69%</div>
                  <p className="text-sm text-muted-foreground">HR-Logistics Korrelation</p>
                  <Progress value={69} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aiRecommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                        {recommendation.module} Empfehlung
                      </CardTitle>
                      <Badge variant={
                        recommendation.priority === 'HIGH' ? 'destructive' : 
                        recommendation.priority === 'MEDIUM' ? 'secondary' : 'default'
                      }>
                        {recommendation.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{recommendation.recommendation}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Impact: {recommendation.expectedImpact}</span>
                      <Button size="sm" variant="outline">
                        Implementieren
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
