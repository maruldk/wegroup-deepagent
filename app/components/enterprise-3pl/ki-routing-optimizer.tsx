
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Route, 
  MapPin, 
  Brain, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Euro,
  Leaf,
  Zap,
  Target,
  Activity,
  BarChart3,
  Settings,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Navigation,
  Compass,
  Map,
  Timer,
  Fuel,
  TreePine,
  AlertTriangle,
  CheckCircle,
  X,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Share,
  Save,
  Calculator,
  Globe,
  Truck,
  Package
} from 'lucide-react';

interface KIRoutingOptimizerProps {
  tenantId: string;
}

export default function KIRoutingOptimizer({ tenantId }: KIRoutingOptimizerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [optimizations, setOptimizations] = useState<any[]>([]);
  const [activeOptimization, setActiveOptimization] = useState<any>(null);
  const [showOptimizationDialog, setShowOptimizationDialog] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [activeTab, setActiveTab] = useState('overview');

  const [optimizationRequest, setOptimizationRequest] = useState({
    origin: { address: '', lat: 0, lng: 0, city: '', country: 'DE' },
    destination: { address: '', lat: 0, lng: 0, city: '', country: 'DE' },
    waypoints: [],
    optimizationType: 'COST',
    constraints: {
      maxWeight: 0,
      maxVolume: 0,
      vehicleType: 'TRUCK',
      deliveryWindow: '',
      priority: 'NORMAL'
    }
  });

  const [optimizationResults, setOptimizationResults] = useState<any>(null);

  useEffect(() => {
    loadOptimizations();
  }, [tenantId, selectedTimeRange]);

  const loadOptimizations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/enterprise-3pl/ki-routing/optimization?tenantId=${tenantId}&limit=20`);
      const data = await response.json();
      setOptimizations(data.data?.recentOptimizations || []);
    } catch (error) {
      console.error('Fehler beim Laden der Optimierungen:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startOptimization = async () => {
    try {
      setIsOptimizing(true);
      const response = await fetch('/api/enterprise-3pl/ki-routing/optimization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...optimizationRequest, tenantId })
      });
      
      const data = await response.json();
      setOptimizationResults(data.data);
      loadOptimizations();
    } catch (error) {
      console.error('Fehler bei der Routenoptimierung:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const getOptimizationColor = (type: string) => {
    switch (type) {
      case 'COST': return 'bg-green-100 text-green-800';
      case 'TIME': return 'bg-blue-100 text-blue-800';
      case 'DISTANCE': return 'bg-purple-100 text-purple-800';
      case 'EMISSIONS': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const optimizationTypes = [
    { value: 'COST', label: 'Kostenoptimierung' },
    { value: 'TIME', label: 'Zeitoptimierung' },
    { value: 'DISTANCE', label: 'Distanzoptimierung' },
    { value: 'EMISSIONS', label: 'Emissionsoptimierung' }
  ];

  const vehicleTypes = [
    { value: 'TRUCK', label: 'LKW' },
    { value: 'VAN', label: 'Transporter' },
    { value: 'MOTORCYCLE', label: 'Motorrad' },
    { value: 'BIKE', label: 'Fahrrad' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-lg">Lade KI-Routing-Optimizer...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-600" />
              KI-Routenoptimierung
            </h1>
            <p className="text-gray-600 mt-1">
              Intelligente Routenplanung mit maschinellem Lernen
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
              <Clock className="w-4 h-4 text-gray-500" />
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="border-none bg-transparent text-sm font-medium focus:outline-none"
              >
                <option value="24h">Letzte 24h</option>
                <option value="7d">Letzte 7 Tage</option>
                <option value="30d">Letzte 30 Tage</option>
              </select>
            </div>
            
            <Dialog open={showOptimizationDialog} onOpenChange={setShowOptimizationDialog}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Neue Optimierung
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Neue Routenoptimierung</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="origin">Startpunkt</Label>
                      <Input
                        id="origin"
                        value={optimizationRequest.origin.address}
                        onChange={(e) => setOptimizationRequest({
                          ...optimizationRequest,
                          origin: { ...optimizationRequest.origin, address: e.target.value }
                        })}
                        placeholder="Startadresse eingeben"
                        className="pl-10"
                      />
                      <MapPin className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <Label htmlFor="destination">Ziel</Label>
                      <Input
                        id="destination"
                        value={optimizationRequest.destination.address}
                        onChange={(e) => setOptimizationRequest({
                          ...optimizationRequest,
                          destination: { ...optimizationRequest.destination, address: e.target.value }
                        })}
                        placeholder="Zieladresse eingeben"
                        className="pl-10"
                      />
                      <Target className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="optimizationType">Optimierungstyp</Label>
                      <Select 
                        value={optimizationRequest.optimizationType} 
                        onValueChange={(value) => setOptimizationRequest({
                          ...optimizationRequest,
                          optimizationType: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {optimizationTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="vehicleType">Fahrzeugtyp</Label>
                      <Select 
                        value={optimizationRequest.constraints.vehicleType} 
                        onValueChange={(value) => setOptimizationRequest({
                          ...optimizationRequest,
                          constraints: { ...optimizationRequest.constraints, vehicleType: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicleTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxWeight">Max. Gewicht (kg)</Label>
                      <Input
                        id="maxWeight"
                        type="number"
                        value={optimizationRequest.constraints.maxWeight}
                        onChange={(e) => setOptimizationRequest({
                          ...optimizationRequest,
                          constraints: { ...optimizationRequest.constraints, maxWeight: parseInt(e.target.value) }
                        })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxVolume">Max. Volumen (m³)</Label>
                      <Input
                        id="maxVolume"
                        type="number"
                        value={optimizationRequest.constraints.maxVolume}
                        onChange={(e) => setOptimizationRequest({
                          ...optimizationRequest,
                          constraints: { ...optimizationRequest.constraints, maxVolume: parseInt(e.target.value) }
                        })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowOptimizationDialog(false)}>
                      Abbrechen
                    </Button>
                    <Button 
                      onClick={startOptimization}
                      disabled={isOptimizing}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isOptimizing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Optimiere...
                        </>
                      ) : (
                        <>
                          <Calculator className="w-4 h-4 mr-2" />
                          Optimierung starten
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Durchgeführte Optimierungen</p>
                    <p className="text-3xl font-bold mt-1">
                      {formatNumber(optimizations.length)}
                    </p>
                  </div>
                  <div className="bg-purple-400 rounded-full p-3">
                    <Brain className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+24% vs. Vorwoche</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Distanz-Einsparung</p>
                    <p className="text-3xl font-bold mt-1">
                      {optimizations.reduce((sum, opt) => sum + (opt.distanceSaved || 0), 0).toFixed(1)}km
                    </p>
                  </div>
                  <div className="bg-green-400 rounded-full p-3">
                    <Route className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm">12.5% weniger Kilometer</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Zeit-Einsparung</p>
                    <p className="text-3xl font-bold mt-1">
                      {(optimizations.reduce((sum, opt) => sum + (opt.timeSaved || 0), 0) / 60).toFixed(1)}h
                    </p>
                  </div>
                  <div className="bg-blue-400 rounded-full p-3">
                    <Timer className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">8.3% schneller</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">CO2-Einsparung</p>
                    <p className="text-3xl font-bold mt-1">
                      {optimizations.reduce((sum, opt) => sum + (opt.co2Saved || 0), 0).toFixed(1)}kg
                    </p>
                  </div>
                  <div className="bg-emerald-400 rounded-full p-3">
                    <Leaf className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <TreePine className="w-4 h-4" />
                  <span className="text-sm">15.2% weniger CO2</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Optimization Results */}
        {optimizationResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Optimierungsergebnis
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportieren
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4 mr-2" />
                  Teilen
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setOptimizationResults(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Empfohlene Route</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Distanz</span>
                    <span className="font-bold text-blue-600">
                      {optimizationResults.recommendedRoute?.distance?.toFixed(1) || 0} km
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Fahrtzeit</span>
                    <span className="font-bold text-green-600">
                      {optimizationResults.recommendedRoute?.time?.toFixed(1) || 0} h
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Kosten</span>
                    <span className="font-bold text-purple-600">
                      €{optimizationResults.recommendedRoute?.cost?.toFixed(2) || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">CO2-Ausstoß</span>
                    <span className="font-bold text-emerald-600">
                      {optimizationResults.recommendedRoute?.carbonFootprint?.toFixed(1) || 0} kg
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Einsparungen</h3>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Distanz-Einsparung</span>
                    <span className="font-bold text-green-600">
                      {optimizationResults.savings?.distance?.toFixed(1) || 0} km
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Zeit-Einsparung</span>
                    <span className="font-bold text-blue-600">
                      {(optimizationResults.savings?.time / 60)?.toFixed(1) || 0} h
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Kosten-Einsparung</span>
                    <span className="font-bold text-purple-600">
                      €{optimizationResults.savings?.cost?.toFixed(2) || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">CO2-Einsparung</span>
                    <span className="font-bold text-emerald-600">
                      {optimizationResults.savings?.co2?.toFixed(1) || 0} kg
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-4">Alternative Routen</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {optimizationResults.alternativeRoutes?.map((route: any, index: number) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{route.name}</h4>
                        <Badge variant="outline">{index + 1}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Distanz:</span>
                          <span className="font-medium">{route.distance?.toFixed(1)} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Zeit:</span>
                          <span className="font-medium">{route.time?.toFixed(1)} h</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kosten:</span>
                          <span className="font-medium">€{route.cost?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CO2:</span>
                          <span className="font-medium">{route.co2?.toFixed(1)} kg</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white rounded-lg shadow-sm p-1">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Activity className="w-4 h-4" />
              Übersicht
            </TabsTrigger>
            <TabsTrigger 
              value="optimizations" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Brain className="w-4 h-4" />
              Optimierungen
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4" />
              Analyse
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4" />
              Einstellungen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Optimierungsleistung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Durchschnittliche Distanz-Einsparung</span>
                      <span className="text-2xl font-bold text-green-600">12.5%</span>
                    </div>
                    <Progress value={12.5} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Durchschnittliche Zeit-Einsparung</span>
                      <span className="text-2xl font-bold text-blue-600">8.3%</span>
                    </div>
                    <Progress value={8.3} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Durchschnittliche CO2-Einsparung</span>
                      <span className="text-2xl font-bold text-emerald-600">15.2%</span>
                    </div>
                    <Progress value={15.2} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Optimierungsverteilung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Kosten-Optimierung</span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-bold">45%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Zeit-Optimierung</span>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-bold">30%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Distanz-Optimierung</span>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-bold">15%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Emissions-Optimierung</span>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm font-bold">10%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  Häufige Routen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">Frankfurt → München</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">24 Optimierungen</Badge>
                      <span className="text-sm text-green-600 font-medium">-18% Distanz</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">Hamburg → Berlin</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">18 Optimierungen</Badge>
                      <span className="text-sm text-green-600 font-medium">-12% Distanz</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">Köln → Stuttgart</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">15 Optimierungen</Badge>
                      <span className="text-sm text-green-600 font-medium">-22% Distanz</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimizations" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Letzte Optimierungen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimizations.slice(0, 10).map((optimization, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Route className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {optimization.startLocation?.city || 'Unbekannt'} → {optimization.endLocation?.city || 'Unbekannt'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(optimization.createdAt).toLocaleString('de-DE')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Distanz</div>
                          <div className="font-bold text-green-600">
                            -{optimization.distanceSaved?.toFixed(1) || 0}km
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Zeit</div>
                          <div className="font-bold text-blue-600">
                            -{(optimization.timeSaved / 60)?.toFixed(1) || 0}h
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">CO2</div>
                          <div className="font-bold text-emerald-600">
                            -{optimization.co2Saved?.toFixed(1) || 0}kg
                          </div>
                        </div>
                        <Badge variant={optimization.implementationStatus === 'IMPLEMENTED' ? 'default' : 'secondary'}>
                          {optimization.implementationStatus === 'IMPLEMENTED' ? 'Umgesetzt' : 'Empfohlen'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Einsparungstrends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">€12.5K</div>
                        <div className="text-sm text-gray-600">Kosten-Einsparung</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">124h</div>
                        <div className="text-sm text-gray-600">Zeit-Einsparung</div>
                      </div>
                      <div className="text-center p-3 bg-emerald-50 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-600">1.2t</div>
                        <div className="text-sm text-gray-600">CO2-Einsparung</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    KI-Modell-Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Vorhersage-Genauigkeit</span>
                      <span className="text-2xl font-bold text-purple-600">94.2%</span>
                    </div>
                    <Progress value={94.2} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Modell-Konfidenz</span>
                      <span className="text-2xl font-bold text-blue-600">87.5%</span>
                    </div>
                    <Progress value={87.5} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Lernrate</span>
                      <span className="text-2xl font-bold text-green-600">92.1%</span>
                    </div>
                    <Progress value={92.1} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  Optimierungseinstellungen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="defaultOptimization">Standard-Optimierungstyp</Label>
                      <Select defaultValue="COST">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {optimizationTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="defaultVehicle">Standard-Fahrzeugtyp</Label>
                      <Select defaultValue="TRUCK">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicleTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxOptimizations">Max. Optimierungen pro Tag</Label>
                      <Input
                        id="maxOptimizations"
                        type="number"
                        defaultValue="100"
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="aiConfidence">Min. KI-Konfidenz (%)</Label>
                      <Input
                        id="aiConfidence"
                        type="number"
                        defaultValue="80"
                        placeholder="80"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Save className="w-4 h-4 mr-2" />
                      Einstellungen speichern
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
