
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
import { motion } from 'framer-motion';
import { 
  Truck, 
  Plus, 
  Settings, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
  MapPin,
  Clock,
  Euro,
  Star,
  Globe,
  Zap,
  Shield,
  BarChart3,
  Activity,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  Eye,
  X
} from 'lucide-react';

interface MultiCarrierManagerProps {
  tenantId: string;
}

export default function MultiCarrierManager({ tenantId }: MultiCarrierManagerProps) {
  const [carriers, setCarriers] = useState<any[]>([]);
  const [rates, setRates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [showCarrierDialog, setShowCarrierDialog] = useState(false);
  const [showRateDialog, setShowRateDialog] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('carriers');

  const [newCarrier, setNewCarrier] = useState({
    carrierName: '',
    carrierCode: '',
    fullName: '',
    country: 'DE',
    apiEndpoint: '',
    apiKey: '',
    serviceTypes: [],
    transportModes: [],
    coverageAreas: [],
    specialServices: []
  });

  const [newRate, setNewRate] = useState({
    carrierId: '',
    originZone: '',
    destinationZone: '',
    serviceType: '',
    transportMode: 'ROAD',
    baseRate: 0,
    perKgRate: 0,
    perKmRate: 0,
    fuelSurcharge: 0,
    minWeight: 0,
    maxWeight: 0,
    minVolume: 0,
    maxVolume: 0,
    validFrom: '',
    validTo: ''
  });

  useEffect(() => {
    loadCarriers();
    loadRates();
  }, [tenantId]);

  const loadCarriers = async () => {
    try {
      const response = await fetch(`/api/enterprise-3pl/multi-carrier/integration?tenantId=${tenantId}`);
      const data = await response.json();
      setCarriers(data.data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Carrier:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRates = async () => {
    try {
      const response = await fetch(`/api/enterprise-3pl/multi-carrier/rates?tenantId=${tenantId}&onlyActive=true`);
      const data = await response.json();
      setRates(data.data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Raten:', error);
    }
  };

  const createCarrier = async () => {
    try {
      const response = await fetch('/api/enterprise-3pl/multi-carrier/integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCarrier, tenantId })
      });
      
      if (response.ok) {
        loadCarriers();
        setShowCarrierDialog(false);
        setNewCarrier({
          carrierName: '',
          carrierCode: '',
          fullName: '',
          country: 'DE',
          apiEndpoint: '',
          apiKey: '',
          serviceTypes: [],
          transportModes: [],
          coverageAreas: [],
          specialServices: []
        });
      }
    } catch (error) {
      console.error('Fehler beim Erstellen des Carriers:', error);
    }
  };

  const createRate = async () => {
    try {
      const response = await fetch('/api/enterprise-3pl/multi-carrier/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newRate, tenantId })
      });
      
      if (response.ok) {
        loadRates();
        setShowRateDialog(false);
        setNewRate({
          carrierId: '',
          originZone: '',
          destinationZone: '',
          serviceType: '',
          transportMode: 'ROAD',
          baseRate: 0,
          perKgRate: 0,
          perKmRate: 0,
          fuelSurcharge: 0,
          minWeight: 0,
          maxWeight: 0,
          minVolume: 0,
          maxVolume: 0,
          validFrom: '',
          validTo: ''
        });
      }
    } catch (error) {
      console.error('Fehler beim Erstellen der Rate:', error);
    }
  };

  const updateCarrierStatus = async (carrierId: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/enterprise-3pl/multi-carrier/integration', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: carrierId, isActive })
      });
      
      if (response.ok) {
        loadCarriers();
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Carrier-Status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'INACTIVE': return 'bg-red-500';
      case 'PENDING': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredCarriers = carriers.filter(carrier => {
    const matchesSearch = carrier.carrierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         carrier.carrierCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && carrier.isActive) ||
                         (filterActive === 'inactive' && !carrier.isActive);
    return matchesSearch && matchesFilter;
  });

  const serviceTypes = ['Express', 'Standard', 'Economy', 'Same Day', 'Next Day'];
  const transportModes = ['ROAD', 'RAIL', 'AIR', 'SEA', 'MULTIMODAL'];
  const countries = ['DE', 'AT', 'CH', 'FR', 'NL', 'BE', 'IT', 'ES', 'PL', 'CZ'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-lg">Lade Multi-Carrier-Manager...</span>
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
              Multi-Carrier-Management
            </h1>
            <p className="text-gray-600 mt-1">
              Verwalten Sie alle Ihre Carrier-Integrationen zentral
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportieren
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Importieren
            </Button>
            <Dialog open={showCarrierDialog} onOpenChange={setShowCarrierDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Neuer Carrier
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Neuen Carrier hinzufügen</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="carrierName">Carrier Name</Label>
                      <Input
                        id="carrierName"
                        value={newCarrier.carrierName}
                        onChange={(e) => setNewCarrier({...newCarrier, carrierName: e.target.value})}
                        placeholder="z.B. DHL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="carrierCode">Carrier Code</Label>
                      <Input
                        id="carrierCode"
                        value={newCarrier.carrierCode}
                        onChange={(e) => setNewCarrier({...newCarrier, carrierCode: e.target.value})}
                        placeholder="z.B. DHL_DE"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="fullName">Vollständiger Name</Label>
                    <Input
                      id="fullName"
                      value={newCarrier.fullName}
                      onChange={(e) => setNewCarrier({...newCarrier, fullName: e.target.value})}
                      placeholder="z.B. DHL Express Germany GmbH"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="country">Land</Label>
                    <Select value={newCarrier.country} onValueChange={(value) => setNewCarrier({...newCarrier, country: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="apiEndpoint">API Endpoint</Label>
                      <Input
                        id="apiEndpoint"
                        value={newCarrier.apiEndpoint}
                        onChange={(e) => setNewCarrier({...newCarrier, apiEndpoint: e.target.value})}
                        placeholder="https://api.carrier.com/v1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="apiKey">API Key</Label>
                      <Input
                        id="apiKey"
                        type="password"
                        value={newCarrier.apiKey}
                        onChange={(e) => setNewCarrier({...newCarrier, apiKey: e.target.value})}
                        placeholder="API-Schlüssel"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowCarrierDialog(false)}>
                      Abbrechen
                    </Button>
                    <Button onClick={createCarrier} className="bg-blue-600 hover:bg-blue-700">
                      Carrier erstellen
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Aktive Carrier</p>
                    <p className="text-3xl font-bold mt-1">
                      {carriers.filter(c => c.isActive).length}
                    </p>
                  </div>
                  <div className="bg-blue-400 rounded-full p-3">
                    <Truck className="w-6 h-6" />
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
                    <p className="text-green-100 text-sm font-medium">API-Integrationen</p>
                    <p className="text-3xl font-bold mt-1">
                      {carriers.filter(c => c.isApiEnabled).length}
                    </p>
                  </div>
                  <div className="bg-green-400 rounded-full p-3">
                    <Zap className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Aktive Raten</p>
                    <p className="text-3xl font-bold mt-1">
                      {rates.length}
                    </p>
                  </div>
                  <div className="bg-purple-400 rounded-full p-3">
                    <Euro className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Abgedeckte Länder</p>
                    <p className="text-3xl font-bold mt-1">
                      {Array.from(new Set(carriers.map(c => c.country))).length}
                    </p>
                  </div>
                  <div className="bg-orange-400 rounded-full p-3">
                    <Globe className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white rounded-lg shadow-sm p-1">
            <TabsTrigger 
              value="carriers" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Truck className="w-4 h-4" />
              Carrier-Übersicht
            </TabsTrigger>
            <TabsTrigger 
              value="rates" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Euro className="w-4 h-4" />
              Raten-Management
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4" />
              Performance-Analyse
            </TabsTrigger>
          </TabsList>

          <TabsContent value="carriers" className="space-y-6">
            {/* Search and Filter */}
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Carrier suchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterActive} onValueChange={setFilterActive}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Carrier</SelectItem>
                      <SelectItem value="active">Nur Aktive</SelectItem>
                      <SelectItem value="inactive">Nur Inaktive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Carrier Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCarriers.map((carrier, index) => (
                <motion.div
                  key={carrier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Truck className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{carrier.carrierName}</CardTitle>
                            <CardDescription>{carrier.carrierCode}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={carrier.isActive ? "default" : "secondary"}>
                            {carrier.isActive ? 'Aktiv' : 'Inaktiv'}
                          </Badge>
                          {carrier.isApiEnabled && (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              API
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Zuverlässigkeit</p>
                          <div className="flex items-center gap-2">
                            <div className={`text-lg font-bold ${getPerformanceColor(carrier.reliabilityScore || 0)}`}>
                              {carrier.reliabilityScore?.toFixed(1) || 0}%
                            </div>
                            <div className="flex items-center">
                              {Array.from({length: 5}).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 ${i < Math.floor((carrier.reliabilityScore || 0) / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Pünktlichkeit</p>
                          <div className={`text-lg font-bold ${getPerformanceColor(carrier.onTimeDelivery || 0)}`}>
                            {carrier.onTimeDelivery?.toFixed(1) || 0}%
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Abgedeckte Länder</p>
                        <div className="flex flex-wrap gap-1">
                          {carrier.coverageAreas?.slice(0, 3).map((area: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                          {carrier.coverageAreas?.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{carrier.coverageAreas.length - 3} weitere
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Performance</p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="font-bold text-blue-600">
                              {carrier.totalShipments || 0}
                            </div>
                            <div className="text-gray-600">Sendungen</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="font-bold text-green-600">
                              {carrier.performanceScore?.toFixed(1) || 0}%
                            </div>
                            <div className="text-gray-600">Erfolg</div>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <div className="font-bold text-purple-600">
                              {carrier.avgTransitTime?.toFixed(1) || 0}h
                            </div>
                            <div className="text-gray-600">Transit</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedCarrier(carrier)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateCarrierStatus(carrier.id, !carrier.isActive)}
                          className={carrier.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                        >
                          {carrier.isActive ? 'Deaktivieren' : 'Aktivieren'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rates" className="space-y-6">
            {/* Rate Management Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Raten-Management</h2>
                <p className="text-gray-600">Verwalten Sie alle Carrier-Raten zentral</p>
              </div>
              <Dialog open={showRateDialog} onOpenChange={setShowRateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Neue Rate
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Neue Rate hinzufügen</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ratCarrierId">Carrier</Label>
                      <Select value={newRate.carrierId} onValueChange={(value) => setNewRate({...newRate, carrierId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Carrier auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {carriers.map(carrier => (
                            <SelectItem key={carrier.id} value={carrier.id}>
                              {carrier.carrierName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="originZone">Ursprungszone</Label>
                        <Input
                          id="originZone"
                          value={newRate.originZone}
                          onChange={(e) => setNewRate({...newRate, originZone: e.target.value})}
                          placeholder="z.B. DE-NRW"
                        />
                      </div>
                      <div>
                        <Label htmlFor="destinationZone">Zielzone</Label>
                        <Input
                          id="destinationZone"
                          value={newRate.destinationZone}
                          onChange={(e) => setNewRate({...newRate, destinationZone: e.target.value})}
                          placeholder="z.B. DE-BY"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="serviceType">Service-Typ</Label>
                        <Select value={newRate.serviceType} onValueChange={(value) => setNewRate({...newRate, serviceType: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Service-Typ auswählen" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="rateTransportMode">Transport-Modus</Label>
                        <Select value={newRate.transportMode} onValueChange={(value) => setNewRate({...newRate, transportMode: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {transportModes.map(mode => (
                              <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="baseRate">Grundrate (€)</Label>
                        <Input
                          id="baseRate"
                          type="number"
                          value={newRate.baseRate}
                          onChange={(e) => setNewRate({...newRate, baseRate: parseFloat(e.target.value)})}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="perKgRate">Rate pro kg (€)</Label>
                        <Input
                          id="perKgRate"
                          type="number"
                          value={newRate.perKgRate}
                          onChange={(e) => setNewRate({...newRate, perKgRate: parseFloat(e.target.value)})}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="perKmRate">Rate pro km (€)</Label>
                        <Input
                          id="perKmRate"
                          type="number"
                          value={newRate.perKmRate}
                          onChange={(e) => setNewRate({...newRate, perKmRate: parseFloat(e.target.value)})}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="validFrom">Gültig ab</Label>
                        <Input
                          id="validFrom"
                          type="date"
                          value={newRate.validFrom}
                          onChange={(e) => setNewRate({...newRate, validFrom: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="validTo">Gültig bis</Label>
                        <Input
                          id="validTo"
                          type="date"
                          value={newRate.validTo}
                          onChange={(e) => setNewRate({...newRate, validTo: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowRateDialog(false)}>
                        Abbrechen
                      </Button>
                      <Button onClick={createRate} className="bg-blue-600 hover:bg-blue-700">
                        Rate erstellen
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Rates Table */}
            <Card className="shadow-lg">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Carrier
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Route
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grundrate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gültigkeitsdauer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aktionen
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {rates.map((rate, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Truck className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {rate.carrier?.carrierName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {rate.carrier?.carrierCode}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {rate.originZone} → {rate.destinationZone}
                            </div>
                            <div className="text-sm text-gray-500">
                              {rate.transportMode}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline">{rate.serviceType}</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              €{rate.baseRate.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">
                              + €{rate.perKgRate?.toFixed(2) || 0}/kg
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(rate.validFrom).toLocaleDateString('de-DE')}
                            </div>
                            <div className="text-sm text-gray-500">
                              bis {new Date(rate.validTo).toLocaleDateString('de-DE')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Carrier Performance Ranking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {carriers.slice(0, 5).map((carrier, index) => (
                      <div key={carrier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-medium">{carrier.carrierName}</div>
                            <div className="text-sm text-gray-600">{carrier.carrierCode}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${getPerformanceColor(carrier.performanceScore || 0)}`}>
                            {carrier.performanceScore?.toFixed(1) || 0}%
                          </div>
                          <div className="text-sm text-gray-600">
                            {carrier.totalShipments || 0} Sendungen
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Carrier-Metriken
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {carriers.reduce((sum, c) => sum + (c.reliabilityScore || 0), 0) / carriers.length || 0}%
                        </div>
                        <p className="text-sm text-gray-600">Durchschnittliche Zuverlässigkeit</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {carriers.reduce((sum, c) => sum + (c.onTimeDelivery || 0), 0) / carriers.length || 0}%
                        </div>
                        <p className="text-sm text-gray-600">Durchschnittliche Pünktlichkeit</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {carriers.reduce((sum, c) => sum + (c.avgTransitTime || 0), 0) / carriers.length || 0}h
                        </div>
                        <p className="text-sm text-gray-600">Durchschnittliche Transitzeit</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {carriers.reduce((sum, c) => sum + (c.damageRate || 0), 0) / carriers.length || 0}%
                        </div>
                        <p className="text-sm text-gray-600">Durchschnittliche Schadensrate</p>
                      </div>
                    </div>
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
