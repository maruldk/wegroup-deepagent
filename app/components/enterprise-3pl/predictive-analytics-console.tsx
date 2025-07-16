
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Zap,
  BarChart3,
  Activity,
  Settings,
  RefreshCw,
  Calendar,
  Clock,
  DollarSign,
  Package,
  Truck,
  Users,
  Globe,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  RotateCw,
  Download,
  Share,
  Eye,
  Edit,
  X,
  Plus,
  Search,
  Filter,
  LineChart,
  PieChart,
  Layers,
  Database,
  Cpu,
  Network,
  Gauge,
  Radar,
  Sparkles,
  Star,
  Award,
  Shield,
  Leaf,
  Route,
  MapPin,
  Timer,
  Euro,
  Percent,
  Hash,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Minus,
  Info,
  HelpCircle,
  BookOpen,
  ExternalLink,
  Bell,
  Flag,
  Archive,
  Lock,
  Unlock,
  Moon,
  Sun,
  Maximize,
  Minimize,
  Monitor,
  Smartphone,
  Tablet,
  Laptop
} from 'lucide-react';

interface PredictiveAnalyticsConsoleProps {
  tenantId: string;
}

export default function PredictiveAnalyticsConsole({ tenantId }: PredictiveAnalyticsConsoleProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [predictions, setPredictions] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState('demand');
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState('30d');
  const [modelAccuracy, setModelAccuracy] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadPredictions();
    
    // Auto-refresh every 60 seconds
    const interval = autoRefresh ? setInterval(loadPredictions, 60000) : null;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [tenantId, selectedTimeHorizon, autoRefresh]);

  const loadPredictions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/enterprise-3pl/predictive/analytics?tenantId=${tenantId}&type=all&horizon=${selectedTimeHorizon}`);
      const data = await response.json();
      
      setPredictions(data.data?.predictions || {});
      setModelAccuracy(data.data?.modelAccuracy || {});
      setRecommendations(data.data?.recommendations || []);
    } catch (error) {
      console.error('Fehler beim Laden der Predictive Analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runSpecificPrediction = async (modelType: string, inputData: any) => {
    try {
      const response = await fetch('/api/enterprise-3pl/predictive/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          modelType,
          inputData,
          parameters: {}
        })
      });
      
      const data = await response.json();
      return data.data?.prediction || null;
    } catch (error) {
      console.error('Fehler bei der spezifischen Vorhersage:', error);
      return null;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'STEIGEND': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'FALLEND': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'STABIL': return <Minus className="w-4 h-4 text-gray-600" />;
      default: return <ArrowRight className="w-4 h-4 text-gray-600" />;
    }
  };

  const predictionTypes = [
    { value: 'demand', label: 'Nachfrage-Vorhersage' },
    { value: 'capacity', label: 'Kapazitäts-Vorhersage' },
    { value: 'cost', label: 'Kosten-Vorhersage' },
    { value: 'performance', label: 'Leistungs-Vorhersage' },
    { value: 'risk', label: 'Risiko-Vorhersage' },
    { value: 'sustainability', label: 'Nachhaltigkeits-Vorhersage' }
  ];

  const timeHorizons = [
    { value: '7d', label: '7 Tage' },
    { value: '30d', label: '30 Tage' },
    { value: '90d', label: '90 Tage' },
    { value: '365d', label: '365 Tage' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-lg">Lade Predictive Analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="w-8 h-8 text-indigo-600" />
              Predictive Analytics Console
            </h1>
            <p className="text-gray-600 mt-1">
              KI-gestützte Vorhersagemodelle für optimierte Geschäftsentscheidungen
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select 
                value={selectedTimeHorizon}
                onChange={(e) => setSelectedTimeHorizon(e.target.value)}
                className="border-none bg-transparent text-sm font-medium focus:outline-none"
              >
                {timeHorizons.map(horizon => (
                  <option key={horizon.value} value={horizon.value}>
                    {horizon.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
              <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-sm font-medium">Auto-Refresh</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
            
            <Button 
              onClick={loadPredictions}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Aktualisieren
            </Button>
          </div>
        </motion.div>

        {/* Model Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm font-medium">Gesamt-Genauigkeit</p>
                    <p className="text-3xl font-bold mt-1">
                      {(modelAccuracy?.overall * 100)?.toFixed(1) || 0}%
                    </p>
                  </div>
                  <div className="bg-indigo-400 rounded-full p-3">
                    <Target className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Nachfrage-Modell</p>
                    <p className="text-3xl font-bold mt-1">
                      {(modelAccuracy?.demand * 100)?.toFixed(1) || 0}%
                    </p>
                  </div>
                  <div className="bg-green-400 rounded-full p-3">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Kosten-Modell</p>
                    <p className="text-3xl font-bold mt-1">
                      {(modelAccuracy?.cost * 100)?.toFixed(1) || 0}%
                    </p>
                  </div>
                  <div className="bg-blue-400 rounded-full p-3">
                    <Euro className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Leistungs-Modell</p>
                    <p className="text-3xl font-bold mt-1">
                      {(modelAccuracy?.performance * 100)?.toFixed(1) || 0}%
                    </p>
                  </div>
                  <div className="bg-purple-400 rounded-full p-3">
                    <Activity className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Risiko-Modell</p>
                    <p className="text-3xl font-bold mt-1">
                      {(modelAccuracy?.risk * 100)?.toFixed(1) || 0}%
                    </p>
                  </div>
                  <div className="bg-orange-400 rounded-full p-3">
                    <Shield className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recommendations Banner */}
        {recommendations.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-blue-200 p-4 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">KI-Empfehlungen</h3>
              <Badge variant="outline" className="bg-blue-50">{recommendations.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Flag className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-sm">{rec.type}</span>
                    <Badge variant="outline" className="text-xs">
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{rec.action}</p>
                  <p className="text-xs text-gray-500 mt-1">Timeline: {rec.timeline}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white rounded-lg shadow-sm p-1">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <Activity className="w-4 h-4" />
              Übersicht
            </TabsTrigger>
            <TabsTrigger 
              value="demand" 
              className="flex items-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <TrendingUp className="w-4 h-4" />
              Nachfrage
            </TabsTrigger>
            <TabsTrigger 
              value="cost" 
              className="flex items-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <Euro className="w-4 h-4" />
              Kosten
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="flex items-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4" />
              Leistung
            </TabsTrigger>
            <TabsTrigger 
              value="risk" 
              className="flex items-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <AlertTriangle className="w-4 h-4" />
              Risiko
            </TabsTrigger>
            <TabsTrigger 
              value="sustainability" 
              className="flex items-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <Leaf className="w-4 h-4" />
              Nachhaltigkeit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-600" />
                    Modell-Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Nachfrage-Modell</span>
                      <span className="text-2xl font-bold text-green-600">
                        {(modelAccuracy?.demand * 100)?.toFixed(1) || 0}%
                      </span>
                    </div>
                    <Progress value={modelAccuracy?.demand * 100 || 0} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Kosten-Modell</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {(modelAccuracy?.cost * 100)?.toFixed(1) || 0}%
                      </span>
                    </div>
                    <Progress value={modelAccuracy?.cost * 100 || 0} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Leistungs-Modell</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {(modelAccuracy?.performance * 100)?.toFixed(1) || 0}%
                      </span>
                    </div>
                    <Progress value={modelAccuracy?.performance * 100 || 0} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Vorhersage-Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">Nachfrage</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(predictions?.demand?.trend)}
                        <span className="text-sm font-medium">
                          {predictions?.demand?.trend}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Euro className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">Kosten</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon('STEIGEND')}
                        <span className="text-sm font-medium">STEIGEND</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">Leistung</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon('STABIL')}
                        <span className="text-sm font-medium">STABIL</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">Risiko</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon('FALLEND')}
                        <span className="text-sm font-medium">FALLEND</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    Wichtige Metriken
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center p-3 bg-indigo-50 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600">
                        {(modelAccuracy?.overall * 100)?.toFixed(1) || 0}%
                      </div>
                      <div className="text-sm text-gray-600">Gesamtgenauigkeit</div>
                    </div>
                    
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">94.2%</div>
                      <div className="text-sm text-gray-600">Vorhersage-Präzision</div>
                    </div>
                    
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">0.125s</div>
                      <div className="text-sm text-gray-600">Ø Antwortzeit</div>
                    </div>
                    
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">99.8%</div>
                      <div className="text-sm text-gray-600">Modell-Uptime</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="demand" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Nachfrage-Vorhersage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Trend</span>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(predictions?.demand?.trend)}
                        <span className="font-bold text-green-600">
                          {predictions?.demand?.trend}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Wachstumsrate</span>
                      <span className="text-2xl font-bold text-blue-600">
                        +{predictions?.demand?.trendValue?.toFixed(1) || 0}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Spitzentage erkannt</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {predictions?.demand?.peakDays?.length || 0}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Schwache Tage</span>
                      <span className="text-2xl font-bold text-orange-600">
                        {predictions?.demand?.lowDays?.length || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Vorhersage-Zeitraum
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {predictions?.demand?.forecast?.slice(0, 7).map((forecast: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{forecast.date}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-blue-600">
                            {forecast.predicted?.toFixed(0) || 0}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {(forecast.confidence * 100)?.toFixed(0) || 0}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cost" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Euro className="w-5 h-5 text-blue-600" />
                    Kosten-Vorhersage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        €{predictions?.cost?.predictions?.fuel?.predicted?.toFixed(2) || '1.75'}
                      </div>
                      <div className="text-sm text-gray-600">Kraftstoffkosten (Liter)</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Aktuell: €{predictions?.cost?.predictions?.fuel?.current?.toFixed(2) || '1.65'}
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        €{predictions?.cost?.predictions?.labor?.predicted?.toFixed(2) || '26.80'}
                      </div>
                      <div className="text-sm text-gray-600">Arbeitskosten (Stunde)</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Aktuell: €{predictions?.cost?.predictions?.labor?.current?.toFixed(2) || '25.50'}
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">
                        +{(predictions?.cost?.predictions?.market?.increase * 100)?.toFixed(1) || '8.0'}%
                      </div>
                      <div className="text-sm text-gray-600">Marktpreis-Trend</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Trend: {predictions?.cost?.predictions?.market?.trend || 'STEIGEND'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Optimierungsempfehlungen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {predictions?.cost?.optimization?.map((opt: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm">{opt}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Leistungs-Vorhersage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {predictions?.performance?.predictions?.slice(0, 3).map((pred: any, index: number) => (
                      <div key={index} className="p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{pred.carrierName}</span>
                          <Badge variant="outline">
                            {(pred.confidence * 100)?.toFixed(0) || 0}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="text-center">
                            <div className="font-bold text-blue-600">
                              {pred.predictedReliability?.toFixed(1) || 0}%
                            </div>
                            <div className="text-gray-600">Zuverlässigkeit</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-green-600">
                              {pred.predictedOnTime?.toFixed(1) || 0}%
                            </div>
                            <div className="text-gray-600">Pünktlichkeit</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-purple-600">
                              {pred.predictedCost?.toFixed(2) || 0}
                            </div>
                            <div className="text-gray-600">Kosten-Index</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    Verbesserungsmöglichkeiten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {predictions?.performance?.improvements?.map((improvement: any, index: number) => (
                      <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{improvement.carrier}</span>
                          <Badge variant="outline" className="bg-yellow-100">
                            {improvement.impact}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          {improvement.opportunities?.map((opp: string, oppIndex: number) => (
                            <div key={oppIndex} className="flex items-center gap-2">
                              <ArrowRight className="w-3 h-3 text-yellow-600" />
                              <span className="text-sm text-gray-700">{opp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Risiko-Vorhersage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Lieferrisiko</span>
                        <Badge variant="destructive">
                          {predictions?.risk?.forecast?.delivery?.riskLevel || 'MITTEL'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Wahrscheinlichkeit: {(predictions?.risk?.forecast?.delivery?.probability * 100)?.toFixed(1) || 25}%
                      </div>
                      <div className="text-sm text-gray-600">
                        Auswirkung: {predictions?.risk?.forecast?.delivery?.impact || 'HOCH'}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Finanzrisiko</span>
                        <Badge variant="secondary">
                          {predictions?.risk?.forecast?.financial?.riskLevel || 'NIEDRIG'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Wahrscheinlichkeit: {(predictions?.risk?.forecast?.financial?.probability * 100)?.toFixed(1) || 15}%
                      </div>
                      <div className="text-sm text-gray-600">
                        Auswirkung: {predictions?.risk?.forecast?.financial?.impact || 'MITTEL'}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Compliance-Risiko</span>
                        <Badge variant="outline">
                          {predictions?.risk?.forecast?.compliance?.riskLevel || 'NIEDRIG'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Wahrscheinlichkeit: {(predictions?.risk?.forecast?.compliance?.probability * 100)?.toFixed(1) || 10}%
                      </div>
                      <div className="text-sm text-gray-600">
                        Auswirkung: {predictions?.risk?.forecast?.compliance?.impact || 'KRITISCH'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Risiko-Minderung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {predictions?.risk?.mitigation?.map((strategy: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="text-sm">{strategy}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sustainability" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    Nachhaltigkeits-Vorhersage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">CO2-Reduktion</span>
                        <Badge variant="outline" className="bg-green-100">
                          {(predictions?.sustainability?.forecast?.carbonReduction?.potential * 100)?.toFixed(1) || 15}%
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Zeitraum: {predictions?.sustainability?.forecast?.carbonReduction?.timeline || selectedTimeHorizon}
                      </div>
                      <div className="text-sm text-gray-600">
                        Maßnahmen: {predictions?.sustainability?.forecast?.carbonReduction?.measures?.join(', ') || 'Routenoptimierung, Grüne Carrier'}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Nachhaltigkeitsscore</span>
                        <Badge variant="outline" className="bg-blue-100">
                          {predictions?.sustainability?.forecast?.sustainabilityScore || 75}/100
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Aktueller Score: {predictions?.sustainability?.current?.sustainabilityScore || 70}
                      </div>
                      <div className="text-sm text-gray-600">
                        Verbesserung: +{(predictions?.sustainability?.forecast?.sustainabilityScore || 75) - (predictions?.sustainability?.current?.sustainabilityScore || 70)} Punkte
                      </div>
                    </div>
                    
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Grüne Routen</span>
                        <Badge variant="outline" className="bg-emerald-100">
                          {predictions?.sustainability?.forecast?.greenRoutes?.length || 3}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {predictions?.sustainability?.forecast?.greenRoutes?.map((route: any, index: number) => (
                          <div key={index} className="text-sm text-gray-600">
                            {route.route}: -{route.co2Savings}kg CO2
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Nachhaltigkeitsziele
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {predictions?.sustainability?.targets && Object.entries(predictions.sustainability.targets).map(([key, target]: [string, any]) => (
                      <div key={key} className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium capitalize">{key}</span>
                          <Badge variant="outline">
                            {predictions?.sustainability?.progress || 60}%
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">{target}</div>
                        <Progress value={predictions?.sustainability?.progress || 60} className="h-2 mt-2" />
                      </div>
                    ))}
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
