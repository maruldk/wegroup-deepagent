
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Package, 
  Truck, 
  Clock, 
  Navigation,
  Activity,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  RotateCw,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Share,
  Bell,
  Settings,
  Map,
  Route,
  Target,
  Timer,
  Zap,
  Globe,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Phone,
  Mail,
  Building,
  User,
  Info,
  X,
  ExternalLink,
  Layers,
  Shield,
  Wifi,
  WifiOff,
  Smartphone,
  Monitor,
  Radio,
  Satellite
} from 'lucide-react';

interface RealtimeTrackingDashboardProps {
  tenantId: string;
}

export default function RealtimeTrackingDashboard({ tenantId }: RealtimeTrackingDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const [newTrackingEvent, setNewTrackingEvent] = useState({
    shipmentId: '',
    trackingNumber: '',
    eventType: 'IN_TRANSIT',
    status: 'IN_TRANSIT',
    description: '',
    location: '',
    coordinates: { lat: 0, lng: 0 },
    facility: '',
    nextExpectedEvent: '',
    estimatedArrival: ''
  });

  useEffect(() => {
    loadTrackingData();
    
    // Auto-refresh every 30 seconds
    const interval = autoRefresh ? setInterval(loadTrackingData, 30000) : null;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [tenantId, autoRefresh]);

  const loadTrackingData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/enterprise-3pl/realtime/tracking?tenantId=${tenantId}`);
      const data = await response.json();
      setTrackingData(data.data || {});
    } catch (error) {
      console.error('Fehler beim Laden der Tracking-Daten:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTrackingEvent = async () => {
    try {
      const response = await fetch('/api/enterprise-3pl/realtime/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTrackingEvent, tenantId })
      });
      
      if (response.ok) {
        loadTrackingData();
        setShowTrackingDialog(false);
        setNewTrackingEvent({
          shipmentId: '',
          trackingNumber: '',
          eventType: 'IN_TRANSIT',
          status: 'IN_TRANSIT',
          description: '',
          location: '',
          coordinates: { lat: 0, lng: 0 },
          facility: '',
          nextExpectedEvent: '',
          estimatedArrival: ''
        });
      }
    } catch (error) {
      console.error('Fehler beim Erstellen des Tracking-Events:', error);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'IN_TRANSIT': return 'bg-blue-100 text-blue-800';
      case 'OUT_FOR_DELIVERY': return 'bg-purple-100 text-purple-800';
      case 'PICKED_UP': return 'bg-yellow-100 text-yellow-800';
      case 'EXCEPTION': return 'bg-red-100 text-red-800';
      case 'CREATED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle className="w-4 h-4" />;
      case 'IN_TRANSIT': return <Truck className="w-4 h-4" />;
      case 'OUT_FOR_DELIVERY': return <Navigation className="w-4 h-4" />;
      case 'PICKED_UP': return <Package className="w-4 h-4" />;
      case 'EXCEPTION': return <AlertTriangle className="w-4 h-4" />;
      case 'CREATED': return <Play className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'NIEDRIG': return 'text-green-600';
      case 'MITTEL': return 'text-yellow-600';
      case 'HOCH': return 'text-orange-600';
      case 'KRITISCH': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const eventTypes = [
    { value: 'PICKUP', label: 'Abholung' },
    { value: 'IN_TRANSIT', label: 'Transport' },
    { value: 'OUT_FOR_DELIVERY', label: 'Zustellung' },
    { value: 'DELIVERED', label: 'Zugestellt' },
    { value: 'EXCEPTION', label: 'Ausnahme' }
  ];

  const filteredShipments = trackingData?.shipments?.filter((shipment: any) => {
    const matchesSearch = shipment.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.shipmentNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || shipment.currentStatus === filterStatus;
    return matchesSearch && matchesFilter;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-lg">Lade Echtzeit-Tracking...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <MapPin className="w-8 h-8 text-green-600" />
              Echtzeit-Sendungsverfolgung
            </h1>
            <p className="text-gray-600 mt-1">
              Verfolgen Sie alle Sendungen in Echtzeit mit präzisen Standortdaten
            </p>
          </div>
          
          <div className="flex items-center gap-3">
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
              variant="outline" 
              onClick={loadTrackingData}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Aktualisieren
            </Button>
            
            <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Tracking-Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Neues Tracking-Event hinzufügen</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="trackingNumber">Tracking-Nummer</Label>
                      <Input
                        id="trackingNumber"
                        value={newTrackingEvent.trackingNumber}
                        onChange={(e) => setNewTrackingEvent({
                          ...newTrackingEvent,
                          trackingNumber: e.target.value
                        })}
                        placeholder="Tracking-Nummer eingeben"
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventType">Event-Typ</Label>
                      <Select 
                        value={newTrackingEvent.eventType} 
                        onValueChange={(value) => setNewTrackingEvent({
                          ...newTrackingEvent,
                          eventType: value,
                          status: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Standort</Label>
                    <Input
                      id="location"
                      value={newTrackingEvent.location}
                      onChange={(e) => setNewTrackingEvent({
                        ...newTrackingEvent,
                        location: e.target.value
                      })}
                      placeholder="Aktueller Standort"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Beschreibung</Label>
                    <Input
                      id="description"
                      value={newTrackingEvent.description}
                      onChange={(e) => setNewTrackingEvent({
                        ...newTrackingEvent,
                        description: e.target.value
                      })}
                      placeholder="Event-Beschreibung"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="facility">Einrichtung</Label>
                      <Input
                        id="facility"
                        value={newTrackingEvent.facility}
                        onChange={(e) => setNewTrackingEvent({
                          ...newTrackingEvent,
                          facility: e.target.value
                        })}
                        placeholder="Verteilzentrum, Depot, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="estimatedArrival">Geschätzte Ankunft</Label>
                      <Input
                        id="estimatedArrival"
                        type="datetime-local"
                        value={newTrackingEvent.estimatedArrival}
                        onChange={(e) => setNewTrackingEvent({
                          ...newTrackingEvent,
                          estimatedArrival: e.target.value
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowTrackingDialog(false)}>
                      Abbrechen
                    </Button>
                    <Button onClick={createTrackingEvent} className="bg-green-600 hover:bg-green-700">
                      Event erstellen
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Gesamt</p>
                    <p className="text-3xl font-bold mt-1">
                      {formatNumber(trackingData?.statistics?.totalShipments || 0)}
                    </p>
                  </div>
                  <div className="bg-blue-400 rounded-full p-3">
                    <Package className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">Unterwegs</p>
                    <p className="text-3xl font-bold mt-1">
                      {formatNumber(trackingData?.statistics?.inTransit || 0)}
                    </p>
                  </div>
                  <div className="bg-yellow-400 rounded-full p-3">
                    <Truck className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Zugestellt</p>
                    <p className="text-3xl font-bold mt-1">
                      {formatNumber(trackingData?.statistics?.delivered || 0)}
                    </p>
                  </div>
                  <div className="bg-green-400 rounded-full p-3">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Verzögert</p>
                    <p className="text-3xl font-bold mt-1">
                      {formatNumber(trackingData?.statistics?.delayed || 0)}
                    </p>
                  </div>
                  <div className="bg-red-400 rounded-full p-3">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Pünktlichkeit</p>
                    <p className="text-3xl font-bold mt-1">
                      {trackingData?.statistics?.onTimeRate || 0}%
                    </p>
                  </div>
                  <div className="bg-purple-400 rounded-full p-3">
                    <Timer className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Shipment Detail Modal */}
        {selectedShipment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Sendungsdetails</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedShipment(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-3">Sendungsinformationen</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tracking-Nummer:</span>
                          <span className="font-medium">{selectedShipment.trackingNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <Badge className={getStatusColor(selectedShipment.currentStatus)}>
                            {getStatusIcon(selectedShipment.currentStatus)}
                            <span className="ml-1">{selectedShipment.currentStatus}</span>
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Gewicht:</span>
                          <span className="font-medium">{selectedShipment.weight || 0} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Volumen:</span>
                          <span className="font-medium">{selectedShipment.volume || 0} m³</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3">Aktuelle Position</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {selectedShipment.currentPosition ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-green-600" />
                              <span className="font-medium">{selectedShipment.currentPosition.location}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {selectedShipment.currentPosition.description}
                            </div>
                            <div className="text-xs text-gray-500">
                              Zuletzt aktualisiert: {new Date(selectedShipment.currentPosition.timestamp).toLocaleString('de-DE')}
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-500">Keine Positionsdaten verfügbar</div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3">Liefervorhersage</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {selectedShipment.deliveryPrediction ? (
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Ursprüngliche Schätzung:</span>
                              <span className="font-medium">
                                {selectedShipment.deliveryPrediction.originalEstimate 
                                  ? new Date(selectedShipment.deliveryPrediction.originalEstimate).toLocaleString('de-DE')
                                  : 'N/A'
                                }
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Aktuelle Vorhersage:</span>
                              <span className="font-medium">
                                {new Date(selectedShipment.deliveryPrediction.currentPrediction).toLocaleString('de-DE')}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Vertrauen:</span>
                              <span className="font-medium">
                                {(selectedShipment.deliveryPrediction.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                            {selectedShipment.deliveryPrediction.isDelayed && (
                              <div className="bg-red-50 border border-red-200 rounded p-2">
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4 text-red-600" />
                                  <span className="text-sm text-red-800">
                                    Verspätung: {selectedShipment.deliveryPrediction.delayMinutes} Minuten
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-gray-500">Keine Vorhersagedaten verfügbar</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-3">Nächste Events</h3>
                      <div className="space-y-2">
                        {selectedShipment.nextEvents?.map((event: any, index: number) => (
                          <div key={index} className="bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Navigation className="w-4 h-4 text-blue-600" />
                              <span className="font-medium">{event.event}</span>
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                              {event.description}
                            </div>
                            <div className="text-xs text-gray-500">
                              Erwartet: {new Date(event.estimatedTime).toLocaleString('de-DE')}
                            </div>
                            <div className="text-xs text-blue-600">
                              Wahrscheinlichkeit: {(event.probability * 100).toFixed(0)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3">Risikoanalyse</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {selectedShipment.riskAnalysis ? (
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Risikostufe:</span>
                              <span className={`font-medium ${getRiskColor(selectedShipment.riskAnalysis.riskLevel)}`}>
                                {selectedShipment.riskAnalysis.riskLevel}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Risikoscore:</span>
                              <span className="font-medium">{selectedShipment.riskAnalysis.riskScore}/100</span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Risikofaktoren:</span>
                              <ul className="mt-1 space-y-1">
                                {selectedShipment.riskAnalysis.riskFactors?.map((factor: string, index: number) => (
                                  <li key={index} className="text-sm text-gray-700 ml-2">
                                    • {factor}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-500">Keine Risikodaten verfügbar</div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3">Meilensteine</h3>
                      <div className="space-y-2">
                        {selectedShipment.milestones?.map((milestone: any, index: number) => (
                          <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                            <div className={`w-3 h-3 rounded-full ${
                              milestone.status === 'COMPLETED' ? 'bg-green-500' :
                              milestone.status === 'ACTIVE' ? 'bg-blue-500' :
                              'bg-gray-300'
                            }`} />
                            <span className={`font-medium ${
                              milestone.status === 'COMPLETED' ? 'text-green-700' :
                              milestone.status === 'ACTIVE' ? 'text-blue-700' :
                              'text-gray-500'
                            }`}>
                              {milestone.name}
                            </span>
                            {milestone.time && (
                              <span className="text-xs text-gray-500 ml-auto">
                                {new Date(milestone.time).toLocaleString('de-DE')}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white rounded-lg shadow-sm p-1">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Activity className="w-4 h-4" />
              Übersicht
            </TabsTrigger>
            <TabsTrigger 
              value="shipments" 
              className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Package className="w-4 h-4" />
              Sendungen
            </TabsTrigger>
            <TabsTrigger 
              value="map" 
              className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Map className="w-4 h-4" />
              Karte
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4" />
              Analyse
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Lieferzeiten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Durchschnittliche Lieferzeit</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {trackingData?.statistics?.avgDeliveryTime || 0}h
                      </span>
                    </div>
                    <Progress value={75} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pünktlichkeitsrate</span>
                      <span className="text-2xl font-bold text-green-600">
                        {trackingData?.statistics?.onTimeRate || 0}%
                      </span>
                    </div>
                    <Progress value={trackingData?.statistics?.onTimeRate || 0} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Durchschnittliche Verspätung</span>
                      <span className="text-2xl font-bold text-red-600">2.3h</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Status-Verteilung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Zugestellt</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-bold">65%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Unterwegs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-bold">25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm">Abgeholt</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-bold">8%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm">Verzögert</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-bold">2%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Aktuelle Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">Verspätung</span>
                      </div>
                      <div className="text-xs text-red-700">
                        3 Sendungen sind mehr als 2 Stunden verspätet
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <WifiOff className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Verbindung</span>
                      </div>
                      <div className="text-xs text-yellow-700">
                        2 Fahrzeuge ohne GPS-Signal
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Info className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Information</span>
                      </div>
                      <div className="text-xs text-blue-700">
                        Wartung geplant für morgen 02:00-04:00
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="shipments" className="space-y-6">
            {/* Search and Filter */}
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Sendung suchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Status</SelectItem>
                      <SelectItem value="IN_TRANSIT">Unterwegs</SelectItem>
                      <SelectItem value="DELIVERED">Zugestellt</SelectItem>
                      <SelectItem value="EXCEPTION">Verzögert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Shipments List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShipments.slice(0, 12).map((shipment: any, index: number) => (
                <motion.div
                  key={shipment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            {getStatusIcon(shipment.currentStatus)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{shipment.trackingNumber}</CardTitle>
                            <CardDescription>{shipment.shipmentNumber}</CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusColor(shipment.currentStatus)}>
                          {shipment.currentStatus}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {shipment.currentPosition?.location || 'Position unbekannt'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Erwartet: {shipment.estimatedDelivery 
                              ? new Date(shipment.estimatedDelivery).toLocaleString('de-DE')
                              : 'N/A'
                            }
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-lg font-bold text-blue-600">
                            {shipment.weight || 0}
                          </div>
                          <div className="text-xs text-gray-600">kg</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-lg font-bold text-green-600">
                            {shipment.pieces || 0}
                          </div>
                          <div className="text-xs text-gray-600">Stück</div>
                        </div>
                      </div>
                      
                      {shipment.deliveryPrediction?.isDelayed && (
                        <div className="bg-red-50 border border-red-200 rounded p-2">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="text-sm text-red-800">
                              {shipment.deliveryPrediction.delayMinutes} Min. verspätet
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedShipment(shipment)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(shipment.trackingUrl, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5 text-blue-600" />
                  Interaktive Sendungskarte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Interaktive Karte
                    </h3>
                    <p className="text-gray-500">
                      Hier würde die interaktive Karte mit allen Sendungspositionen angezeigt
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Performance-Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">+12%</div>
                        <div className="text-sm text-gray-600">Pünktlichkeit</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">-8%</div>
                        <div className="text-sm text-gray-600">Verspätungen</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">+15%</div>
                        <div className="text-sm text-gray-600">Sendungsvolumen</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">98.5%</div>
                        <div className="text-sm text-gray-600">Zustellungsrate</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-green-600" />
                    Geografische Verteilung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Deutschland</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-bold">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Europa</span>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-bold">18%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">International</span>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-bold">7%</span>
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
