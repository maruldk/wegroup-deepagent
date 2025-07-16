
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  Brain, 
  FileText, 
  Shield,
  Zap,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle,
  AlertTriangle
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
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3', '#A19AD3'];

interface FinanceMetrics {
  totalRevenue: number;
  totalInvoices: number;
  pendingInvoices: number;
  cashFlow: number;
  profitMargin: number;
  aiAutonomy: number;
}

export function EnhancedFinanceDashboard() {
  const [financeMetrics, setFinanceMetrics] = useState<FinanceMetrics | null>(null);
  const [documentProcessing, setDocumentProcessing] = useState<any>(null);
  const [forecasting, setForecasting] = useState<any>(null);
  const [riskAssessment, setRiskAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const [unifiedRes, docRes, forecastRes, riskRes] = await Promise.all([
        fetch('/api/integration/unified-dashboard'),
        fetch('/api/finance/document-processing'),
        fetch('/api/finance/ai-forecasting?forecastType=REVENUE'),
        fetch('/api/finance/risk-assessment')
      ]);

      if (unifiedRes.ok) {
        const unified = await unifiedRes.json();
        setFinanceMetrics(unified.realTimeKPIs?.finance || {
          totalRevenue: 125000,
          totalInvoices: 45,
          pendingInvoices: 8,
          cashFlow: 85000,
          profitMargin: 23.5,
          aiAutonomy: 92
        });
      }

      if (docRes.ok) {
        const doc = await docRes.json();
        setDocumentProcessing(doc);
      }

      if (forecastRes.ok) {
        const forecast = await forecastRes.json();
        setForecasting(forecast);
      }

      if (riskRes.ok) {
        const risk = await riskRes.json();
        setRiskAssessment(risk);
      }
    } catch (error) {
      console.error('Error fetching finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const revenueData = [
    { month: 'Jan', revenue: 98000, forecast: 102000, expenses: 75000 },
    { month: 'Feb', revenue: 105000, forecast: 108000, expenses: 78000 },
    { month: 'Mar', revenue: 112000, forecast: 115000, expenses: 82000 },
    { month: 'Apr', revenue: 108000, forecast: 111000, expenses: 79000 },
    { month: 'Mai', revenue: 118000, forecast: 121000, expenses: 85000 },
    { month: 'Jun', revenue: 125000, forecast: 128000, expenses: 88000 }
  ];

  const cashFlowData = [
    { month: 'Jan', inflow: 120000, outflow: 85000, net: 35000 },
    { month: 'Feb', inflow: 135000, outflow: 92000, net: 43000 },
    { month: 'Mar', inflow: 142000, outflow: 98000, net: 44000 },
    { month: 'Apr', inflow: 138000, outflow: 95000, net: 43000 },
    { month: 'Mai', inflow: 148000, outflow: 102000, net: 46000 },
    { month: 'Jun', inflow: 155000, outflow: 108000, net: 47000 }
  ];

  const invoiceStatusData = [
    { name: 'Bezahlt', value: 65, color: '#80D8C3' },
    { name: 'Ausstehend', value: 25, color: '#FF9149' },
    { name: 'Überfällig', value: 8, color: '#FF9898' },
    { name: 'Storniert', value: 2, color: '#A19AD3' }
  ];

  const riskDistribution = [
    { category: 'Niedrig', count: 25, percentage: 62 },
    { category: 'Mittel', count: 12, percentage: 30 },
    { category: 'Hoch', count: 3, percentage: 8 }
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
          <h1 className="text-3xl font-bold">Finanzmanagement</h1>
          <p className="text-muted-foreground">KI-gestützte Finanzanalyse mit 92% Autonomie</p>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-500" />
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            92% KI-Autonomie
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Real-time Processing
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
              <CardTitle className="text-sm font-medium">Gesamtumsatz</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{financeMetrics?.totalRevenue?.toLocaleString() || '0'}</div>
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
              <CardTitle className="text-sm font-medium">Rechnungen</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financeMetrics?.totalInvoices || 0}</div>
              <p className="text-xs text-muted-foreground">
                {financeMetrics?.pendingInvoices || 0} ausstehend
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
              <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{financeMetrics?.cashFlow?.toLocaleString() || '0'}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                Positiver Trend
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
              <CardTitle className="text-sm font-medium">Gewinnmarge</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financeMetrics?.profitMargin || 0}%</div>
              <p className="text-xs text-muted-foreground">
                +2.8% Verbesserung
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Überblick</TabsTrigger>
          <TabsTrigger value="processing">Dokumentenverarbeitung</TabsTrigger>
          <TabsTrigger value="forecasting">KI-Prognosen</TabsTrigger>
          <TabsTrigger value="risk">Risikobewertung</TabsTrigger>
          <TabsTrigger value="automation">Automatisierung</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue vs Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Umsatz & Prognose
                </CardTitle>
                <CardDescription>
                  Tatsächlicher vs. prognostizierter Umsatz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(value) => `€${Number(value).toLocaleString()}`} />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#60B5FF" 
                      strokeWidth={2}
                      name="Tatsächlich"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="forecast" 
                      stroke="#80D8C3" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Prognose"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cash Flow Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Cash Flow Analyse
                </CardTitle>
                <CardDescription>
                  Mittelzu- und -abfluss im Zeitverlauf
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(value) => `€${Number(value).toLocaleString()}`} />
                    <Area 
                      type="monotone" 
                      dataKey="inflow" 
                      stackId="1"
                      stroke="#80D8C3" 
                      fill="#80D8C3"
                      name="Zufluss"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="outflow" 
                      stackId="2"
                      stroke="#FF9149" 
                      fill="#FF9149"
                      name="Abfluss"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Invoice Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Rechnungsstatus
                </CardTitle>
                <CardDescription>
                  Verteilung der Rechnungszustände
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={invoiceStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }: {name: string, value: number}) => `${name}: ${value}%`}
                    >
                      {invoiceStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Key Financial Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Finanz-KPIs</CardTitle>
                <CardDescription>Wichtige Finanzkennzahlen im Überblick</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">OCR-Genauigkeit</p>
                    <p className="text-sm text-muted-foreground">Dokumentenerkennung</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">95.2%</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Automatisierungsgrad</p>
                    <p className="text-sm text-muted-foreground">Prozessautomatisierung</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">92%</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium">Prognosegenauigkeit</p>
                    <p className="text-sm text-muted-foreground">Vorhersagemodell</p>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">87.8%</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="processing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Document Processing Queue */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-blue-500" />
                  KI-Dokumentenverarbeitung
                </CardTitle>
                <CardDescription>
                  Automatische OCR- und Validierungsverarbeitung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Rechnung #{2024 + index}0{index + 1}</h4>
                          <p className="text-sm text-muted-foreground">TechCorp GmbH</p>
                        </div>
                        <Badge variant={
                          index === 0 ? "default" : 
                          index === 1 ? "secondary" : "outline"
                        }>
                          {index === 0 ? "Verarbeitet" : index === 1 ? "In Bearbeitung" : "Warteschlange"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>OCR-Vertrauen</span>
                          <span className="text-green-600">{90 + Math.floor(Math.random() * 10)}%</span>
                        </div>
                        <Progress value={90 + Math.floor(Math.random() * 10)} className="h-1" />
                        <div className="flex justify-between text-sm">
                          <span>Fraud-Risiko</span>
                          <span className="text-blue-600">{Math.floor(Math.random() * 15)}%</span>
                        </div>
                        <Progress value={Math.floor(Math.random() * 15)} className="h-1" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">€{(Math.random() * 5000 + 1000).toFixed(2)}</span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Genehmigen
                          </Button>
                          <Button size="sm" variant="outline">
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Processing Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Verarbeitungsstatistiken</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Dokumente heute</span>
                    <span className="text-sm font-medium">47</span>
                  </div>
                  <Progress value={78} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Automatisch verarbeitet</span>
                    <span className="text-sm font-medium">43 (91%)</span>
                  </div>
                  <Progress value={91} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Manuelle Überprüfung</span>
                    <span className="text-sm font-medium">4 (9%)</span>
                  </div>
                  <Progress value={9} />
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    ⚡ 18.5 Stunden Bearbeitungszeit eingespart
                  </p>
                  <p className="text-sm text-muted-foreground">
                    💰 €2,850 Kostenersparnis heute
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Processing Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                KI-Verarbeitungsinsights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-green-600">Erfolgreich verarbeitet</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatische Validierung und Buchung von Routine-Rechnungen
                  </p>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm">95.2% Erfolgsrate</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-yellow-600">Anomalieerkennung</h4>
                  <p className="text-sm text-muted-foreground">
                    Ungewöhnliche Beträge oder Duplikate automatisch erkannt
                  </p>
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                    <span className="text-sm">3 Anomalien heute</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-600">Fraud-Prävention</h4>
                  <p className="text-sm text-muted-foreground">
                    KI-basierte Betrugserkennung schützt vor finanziellen Verlusten
                  </p>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm">€45K geschützt</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-blue-500" />
                  Umsatzprognose
                </CardTitle>
                <CardDescription>
                  KI-gestützte Vorhersage für die nächsten 6 Monate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Optimistisch</p>
                      <p className="text-lg font-bold text-green-600">€180K</p>
                      <p className="text-xs">Wahrscheinlichkeit: 25%</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Realistisch</p>
                      <p className="text-lg font-bold text-blue-600">€155K</p>
                      <p className="text-xs">Wahrscheinlichkeit: 50%</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Konservativ</p>
                      <p className="text-lg font-bold text-orange-600">€135K</p>
                      <p className="text-xs">Wahrscheinlichkeit: 25%</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Einflussfaktoren</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Saisonale Muster</span>
                        <span className="text-green-600">+15% Q4</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Markttrends</span>
                        <span className="text-blue-600">+8% Digital</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kundenbindung</span>
                        <span className="text-purple-600">92% Retention</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cash Flow Forecast */}
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Prognose</CardTitle>
                <CardDescription>
                  Liquiditätsprognose mit 89% Genauigkeit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(value) => `€${Number(value).toLocaleString()}`} />
                    <Area 
                      type="monotone" 
                      dataKey="net" 
                      stroke="#60B5FF" 
                      fill="#60B5FF"
                      fillOpacity={0.3}
                      name="Netto Cash Flow"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Prognostizierter Netto-Cash-Flow: <span className="font-medium text-green-600">€52K</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Expense Predictions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Ausgabenvorhersage</CardTitle>
                <CardDescription>
                  KI-Analyse der erwarteten Kosten nach Kategorien
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { category: 'Personal', amount: 85000, trend: '+5%', color: 'blue' },
                    { category: 'IT & Software', amount: 12000, trend: '+12%', color: 'green' },
                    { category: 'Marketing', amount: 18000, trend: '-8%', color: 'purple' },
                    { category: 'Operativ', amount: 25000, trend: '+3%', color: 'orange' }
                  ].map((expense, index) => (
                    <div key={index} className={`p-4 bg-${expense.color}-50 rounded-lg`}>
                      <h4 className="font-medium text-sm">{expense.category}</h4>
                      <p className="text-xl font-bold mt-1">€{expense.amount.toLocaleString()}</p>
                      <p className={`text-xs mt-1 ${expense.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
                        {expense.trend} vs. letzter Monat
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risk Assessment Overview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-500" />
                  Risikobewertung
                </CardTitle>
                <CardDescription>
                  KI-gestützte Finanzrisikoanalyse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskDistribution.map((risk, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{risk.category} Risiko</span>
                        <Badge variant={
                          risk.category === 'Hoch' ? 'destructive' : 
                          risk.category === 'Mittel' ? 'secondary' : 'default'
                        }>
                          {risk.count} Entitäten
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={risk.percentage} className="flex-1" />
                        <span className="text-sm font-medium">{risk.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                  Aktive Warnungen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-red-800">Fraud-Verdacht</p>
                      <p className="text-sm text-red-600">Unusual transaction pattern</p>
                    </div>
                    <Badge variant="destructive">Hoch</Badge>
                  </div>
                  <Button size="sm" variant="outline" className="mt-2">
                    Untersuchen
                  </Button>
                </div>
                
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-yellow-800">Liquiditätswarnung</p>
                      <p className="text-sm text-yellow-600">Cash flow below threshold</p>
                    </div>
                    <Badge variant="secondary">Mittel</Badge>
                  </div>
                  <Button size="sm" variant="outline" className="mt-2">
                    Maßnahmen
                  </Button>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-blue-800">Marktrisiko</p>
                      <p className="text-sm text-blue-600">Currency fluctuation risk</p>
                    </div>
                    <Badge variant="outline">Niedrig</Badge>
                  </div>
                  <Button size="sm" variant="outline" className="mt-2">
                    Überwachen
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Risk Mitigation */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Risiko-Minderungsstrategien</CardTitle>
                <CardDescription>
                  KI-empfohlene Maßnahmen zur Risikoreduktion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Diversifikation",
                      description: "Risikoportfolio durch Kundensegment-Diversifikation reduzieren",
                      impact: "Hoch",
                      effort: "Mittel",
                      timeline: "3 Monate"
                    },
                    {
                      title: "Hedging-Strategien",
                      description: "Währungsrisiken durch Forward-Kontrakte absichern", 
                      impact: "Mittel",
                      effort: "Niedrig",
                      timeline: "1 Monat"
                    },
                    {
                      title: "Liquiditätspuffer", 
                      description: "Erhöhung der Liquiditätsreserven um 20%",
                      impact: "Hoch",
                      effort: "Niedrig", 
                      timeline: "Sofort"
                    }
                  ].map((strategy, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <h4 className="font-medium">{strategy.title}</h4>
                      <p className="text-sm text-muted-foreground">{strategy.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Impact:</span>
                          <Badge variant="outline">{strategy.impact}</Badge>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Aufwand:</span>
                          <Badge variant="outline">{strategy.effort}</Badge>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Timeline:</span>
                          <span className="font-medium">{strategy.timeline}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Implementieren
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          {/* Automation Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                Finanz-Automatisierung
              </CardTitle>
              <CardDescription>
                92% KI-Autonomie in Finanzprozessen erreicht
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">95%</div>
                  <p className="text-sm text-muted-foreground">Automatische Rechnungsverarbeitung</p>
                  <Progress value={95} />
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">89%</div>
                  <p className="text-sm text-muted-foreground">Prognosegenauigkeit</p>
                  <Progress value={89} />
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">87%</div>
                  <p className="text-sm text-muted-foreground">Risikobewertung</p>
                  <Progress value={87} />
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-orange-600">92%</div>
                  <p className="text-sm text-muted-foreground">Gesamtautonomie</p>
                  <Progress value={92} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Automated Processes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Automatisierte Prozesse</CardTitle>
                <CardDescription>
                  Vollständig automatisierte Finanzworkflows
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    process: "Rechnungseingang & OCR",
                    automation: 95,
                    savings: "18.5h/Tag",
                    status: "active"
                  },
                  {
                    process: "Betrugserkennnung",
                    automation: 88,
                    savings: "€45K geschützt",
                    status: "active"
                  },
                  {
                    process: "Zahlungsvorhersage",
                    automation: 91,
                    savings: "85% Genauigkeit",
                    status: "active"
                  },
                  {
                    process: "Compliance-Prüfung",
                    automation: 94,
                    savings: "12h/Woche",
                    status: "active"
                  }
                ].map((process, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{process.process}</p>
                      <p className="text-sm text-muted-foreground">Ersparnis: {process.savings}</p>
                    </div>
                    <div className="text-center mr-4">
                      <p className="text-lg font-bold">{process.automation}%</p>
                      <Progress value={process.automation} className="w-16" />
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
                  Messbare Vorteile der KI-Automatisierung
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">€125K</p>
                    <p className="text-sm text-muted-foreground">Jährliche Einsparung</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">450%</p>
                    <p className="text-sm text-muted-foreground">ROI in 12 Monaten</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600">75%</p>
                    <p className="text-sm text-muted-foreground">Weniger manuelle Arbeit</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-orange-600">98%</p>
                    <p className="text-sm text-muted-foreground">Fehlerreduktion</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Nächste Automatisierungsschritte</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Automatisiertes Mahnwesen</span>
                      <Badge variant="outline">In Planung</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>KI-Budgetplanung</span>
                      <Badge variant="outline">Q1 2024</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Predictive Cash Flow</span>
                      <Badge variant="outline">Q2 2024</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
