
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, MapPin, Clock, CheckCircle, AlertTriangle, Search, RefreshCw, Navigation, Package2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Shipment {
  id: string
  trackingNumber: string
  customerName: string
  customerAddress: string
  origin: string
  destination: string
  carrier: string
  service: string
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception'
  estimatedDelivery: string
  actualDelivery?: string
  weight: number
  dimensions: string
  value: number
  items: string[]
  events: TrackingEvent[]
}

interface TrackingEvent {
  id: string
  timestamp: string
  location: string
  status: string
  description: string
  facilityType?: 'origin' | 'hub' | 'destination'
}

interface Carrier {
  id: string
  name: string
  logo: string
  performance: {
    onTimeDelivery: number
    avgDeliveryTime: number
    customerSatisfaction: number
  }
  activeShipments: number
}

export default function TrackingPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [carriers, setCarriers] = useState<Carrier[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCarrier, setSelectedCarrier] = useState("all")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadTrackingData()
  }, [])

  const loadTrackingData = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setShipments([
        {
          id: "1",
          trackingNumber: "DHL123456789",
          customerName: "Anna Schmidt",
          customerAddress: "Hauptstraße 123, 10115 Berlin",
          origin: "Hamburg",
          destination: "Berlin",
          carrier: "DHL",
          service: "Express",
          status: "in_transit",
          estimatedDelivery: "2024-01-16T14:00:00",
          weight: 2.5,
          dimensions: "30x20x15 cm",
          value: 899.00,
          items: ["Dell Laptop XPS 13", "Laptop-Tasche"],
          events: [
            {
              id: "1",
              timestamp: "2024-01-15T08:30:00",
              location: "Hamburg",
              status: "Abgeholt",
              description: "Paket wurde vom Absender abgeholt",
              facilityType: "origin"
            },
            {
              id: "2",
              timestamp: "2024-01-15T12:45:00",
              location: "Hamburg Hub",
              status: "Im Transit",
              description: "Sortierung im Verteilzentrum",
              facilityType: "hub"
            },
            {
              id: "3",
              timestamp: "2024-01-15T18:20:00",
              location: "Hannover Hub",
              status: "Im Transit",
              description: "Zwischenstopp - Weiterleitung nach Berlin",
              facilityType: "hub"
            }
          ]
        },
        {
          id: "2",
          trackingNumber: "UPS987654321",
          customerName: "Michael Weber",
          customerAddress: "Bahnhofstraße 45, 80331 München",
          origin: "Stuttgart",
          destination: "München",
          carrier: "UPS",
          service: "Standard",
          status: "delivered",
          estimatedDelivery: "2024-01-14T16:00:00",
          actualDelivery: "2024-01-14T15:32:00",
          weight: 1.2,
          dimensions: "25x15x10 cm",
          value: 156.80,
          items: ["Büromaterialien", "Notizbücher"],
          events: [
            {
              id: "1",
              timestamp: "2024-01-13T09:15:00",
              location: "Stuttgart",
              status: "Abgeholt",
              description: "Paket wurde abgeholt",
              facilityType: "origin"
            },
            {
              id: "2",
              timestamp: "2024-01-14T07:20:00",
              location: "München Hub",
              status: "Zur Zustellung",
              description: "Aus dem Zustellfahrzeug",
              facilityType: "hub"
            },
            {
              id: "3",
              timestamp: "2024-01-14T15:32:00",
              location: "München",
              status: "Zugestellt",
              description: "Erfolgreich zugestellt an M. Weber",
              facilityType: "destination"
            }
          ]
        },
        {
          id: "3",
          trackingNumber: "FEX456789123",
          customerName: "Thomas Fischer",
          customerAddress: "Industriestraße 88, 70565 Stuttgart",
          origin: "Köln",
          destination: "Stuttgart",
          carrier: "FedEx",
          service: "Overnight",
          status: "exception",
          estimatedDelivery: "2024-01-15T10:00:00",
          weight: 5.8,
          dimensions: "45x35x25 cm",
          value: 2340.50,
          items: ["Industrielle Komponenten", "Ersatzteile"],
          events: [
            {
              id: "1",
              timestamp: "2024-01-14T16:00:00",
              location: "Köln",
              status: "Abgeholt",
              description: "Paket wurde abgeholt",
              facilityType: "origin"
            },
            {
              id: "2",
              timestamp: "2024-01-15T06:30:00",
              location: "Frankfurt Hub",
              status: "Verzögerung",
              description: "Verzögerung aufgrund von Wetterbedingungen",
              facilityType: "hub"
            }
          ]
        },
        {
          id: "4",
          trackingNumber: "DPD789123456",
          customerName: "Lisa Müller",
          customerAddress: "Gartenstraße 15, 20095 Hamburg",
          origin: "Berlin",
          destination: "Hamburg",
          carrier: "DPD",
          service: "Standard",
          status: "out_for_delivery",
          estimatedDelivery: "2024-01-16T17:00:00",
          weight: 0.8,
          dimensions: "20x15x8 cm",
          value: 45.50,
          items: ["LED Beleuchtung"],
          events: [
            {
              id: "1",
              timestamp: "2024-01-15T14:20:00",
              location: "Berlin",
              status: "Abgeholt",
              description: "Paket wurde abgeholt",
              facilityType: "origin"
            },
            {
              id: "2",
              timestamp: "2024-01-16T08:15:00",
              location: "Hamburg Hub",
              status: "Zur Zustellung",
              description: "Paket ist im Zustellfahrzeug",
              facilityType: "hub"
            }
          ]
        }
      ])

      setCarriers([
        {
          id: "1",
          name: "DHL",
          logo: "https://i.pinimg.com/originals/12/51/fd/1251fde9459c80b63f41c0ba4ff42b4d.jpg",
          performance: {
            onTimeDelivery: 94,
            avgDeliveryTime: 1.8,
            customerSatisfaction: 4.2
          },
          activeShipments: 1247
        },
        {
          id: "2",
          name: "UPS",
          logo: "https://i.pinimg.com/originals/e8/ee/94/e8ee94b257ad562fdf5eef6ea39dedc9.jpg",
          performance: {
            onTimeDelivery: 91,
            avgDeliveryTime: 2.1,
            customerSatisfaction: 4.0
          },
          activeShipments: 892
        },
        {
          id: "3",
          name: "FedEx",
          logo: "https://www.pngmart.com/files/15/Fedex-Logo-Download-PNG-Image.png",
          performance: {
            onTimeDelivery: 89,
            avgDeliveryTime: 1.9,
            customerSatisfaction: 3.9
          },
          activeShipments: 654
        },
        {
          id: "4",
          name: "DPD",
          logo: "https://brandlogos.net/wp-content/uploads/2013/01/dynamic-parcel-distribution-logo-vector.png",
          performance: {
            onTimeDelivery: 87,
            avgDeliveryTime: 2.3,
            customerSatisfaction: 3.8
          },
          activeShipments: 523
        }
      ])

      setLoading(false)
    }, 1000)
  }

  const refreshTracking = async () => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "outline",
      picked_up: "secondary",
      in_transit: "default",
      out_for_delivery: "default",
      delivered: "default",
      exception: "destructive"
    } as const
    
    const labels = {
      pending: "Ausstehend",
      picked_up: "Abgeholt",
      in_transit: "Im Transit",
      out_for_delivery: "Zur Zustellung",
      delivered: "Zugestellt",
      exception: "Problem"
    }
    
    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-gray-500" />
      case 'picked_up': return <Package2 className="w-4 h-4 text-blue-500" />
      case 'in_transit': return <Truck className="w-4 h-4 text-blue-500" />
      case 'out_for_delivery': return <Navigation className="w-4 h-4 text-green-500" />
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'exception': return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'pending': return 10
      case 'picked_up': return 30
      case 'in_transit': return 60
      case 'out_for_delivery': return 85
      case 'delivered': return 100
      case 'exception': return 40
      default: return 0
    }
  }

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || shipment.status === selectedStatus
    const matchesCarrier = selectedCarrier === "all" || shipment.carrier === selectedCarrier
    return matchesSearch && matchesStatus && matchesCarrier
  })

  const totalShipments = shipments.length
  const inTransitShipments = shipments.filter(s => s.status === 'in_transit' || s.status === 'out_for_delivery').length
  const deliveredToday = shipments.filter(s => s.status === 'delivered' && s.actualDelivery && 
    new Date(s.actualDelivery).toDateString() === new Date().toDateString()).length
  const exceptionsCount = shipments.filter(s => s.status === 'exception').length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Live Tracking</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Live Tracking</h1>
          <p className="text-gray-600 mt-1">Echtzeit-Sendungsverfolgung und Logistik-Monitoring</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={refreshTracking} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Aktualisieren...' : 'Aktualisieren'}
          </Button>
          <Button>
            <Package2 className="w-4 h-4 mr-2" />
            Neue Sendung
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktive Sendungen</p>
                <p className="text-2xl font-bold text-gray-900">{totalShipments}</p>
                <p className="text-xs text-blue-600">+5 heute</p>
              </div>
              <Package2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Im Transit</p>
                <p className="text-2xl font-bold text-blue-600">{inTransitShipments}</p>
                <p className="text-xs text-gray-500">Unterwegs</p>
              </div>
              <Truck className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Heute zugestellt</p>
                <p className="text-2xl font-bold text-green-600">{deliveredToday}</p>
                <p className="text-xs text-green-600">Erfolgreich</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Probleme</p>
                <p className="text-2xl font-bold text-red-600">{exceptionsCount}</p>
                <p className="text-xs text-red-600">Aufmerksamkeit nötig</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {exceptionsCount > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{exceptionsCount} Sendung(en) benötigen Aufmerksamkeit!</strong> Verzögerungen oder Probleme erkannt.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="tracking" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
          <TabsTrigger value="carriers">Versandpartner</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="routes">Routen</TabsTrigger>
        </TabsList>

        <TabsContent value="tracking" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tracking-Nummer oder Kunde suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="in_transit">Im Transit</SelectItem>
                <SelectItem value="out_for_delivery">Zur Zustellung</SelectItem>
                <SelectItem value="delivered">Zugestellt</SelectItem>
                <SelectItem value="exception">Probleme</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Carrier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="DHL">DHL</SelectItem>
                <SelectItem value="UPS">UPS</SelectItem>
                <SelectItem value="FedEx">FedEx</SelectItem>
                <SelectItem value="DPD">DPD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredShipments.map((shipment) => (
              <Card key={shipment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{shipment.trackingNumber}</h3>
                        {getStatusBadge(shipment.status)}
                        <Badge variant="outline" className="text-xs">{shipment.carrier}</Badge>
                        <Badge variant="outline" className="text-xs">{shipment.service}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Kunde: </span>
                          <span className="font-medium">{shipment.customerName}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Von: </span>
                          <span className="font-medium">{shipment.origin}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Nach: </span>
                          <span className="font-medium">{shipment.destination}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {shipment.items.join(', ')} • {shipment.weight}kg • {shipment.dimensions}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Fortschritt</span>
                          <span>
                            {shipment.status === 'delivered' ? 'Zugestellt' : 
                             `Erwartet: ${new Date(shipment.estimatedDelivery).toLocaleString('de-DE')}`}
                          </span>
                        </div>
                        <Progress value={getProgressValue(shipment.status)} />
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xl font-bold text-gray-900">€{shipment.value.toLocaleString()}</p>
                      {shipment.status === 'delivered' && shipment.actualDelivery && (
                        <p className="text-sm text-green-600">
                          Zugestellt: {new Date(shipment.actualDelivery).toLocaleString('de-DE')}
                        </p>
                      )}
                      <Button variant="outline" size="sm" className="mt-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>

                  {/* Tracking Events */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Tracking-Verlauf</h4>
                    <div className="space-y-2">
                      {shipment.events.slice(0, 3).map((event, index) => (
                        <div key={event.id} className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {getStatusIcon(event.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900">{event.description}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(event.timestamp).toLocaleString('de-DE')}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600">{event.location}</div>
                          </div>
                        </div>
                      ))}
                      {shipment.events.length > 3 && (
                        <Button variant="ghost" size="sm" className="w-full">
                          Alle {shipment.events.length} Events anzeigen
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="carriers" className="space-y-4">
          <div className="grid gap-4">
            {carriers.map((carrier) => (
              <Card key={carrier.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                        <span className="font-bold text-gray-600">{carrier.name}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{carrier.name}</h3>
                        <div className="grid grid-cols-3 gap-4 text-sm mt-2">
                          <div>
                            <span className="text-gray-500">Pünktlichkeit: </span>
                            <span className="font-medium">{carrier.performance.onTimeDelivery}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Ø Lieferzeit: </span>
                            <span className="font-medium">{carrier.performance.avgDeliveryTime} Tage</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Bewertung: </span>
                            <span className="font-medium">{carrier.performance.customerSatisfaction}/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{carrier.activeShipments}</div>
                      <div className="text-sm text-gray-500">Aktive Sendungen</div>
                      <div className="mt-2">
                        <Progress value={carrier.performance.onTimeDelivery} className="w-24" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Pünktliche Lieferungen</span>
                      <span>91%</span>
                    </div>
                    <Progress value={91} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Durchschnittliche Lieferzeit</span>
                      <span>2.1 Tage</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Kundenzufriedenheit</span>
                      <span>4.1/5</span>
                    </div>
                    <Progress value={82} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Volumen Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Heute</span>
                    <span className="font-bold text-blue-600">127</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Diese Woche</span>
                    <span className="font-bold text-green-600">834</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Diesen Monat</span>
                    <span className="font-bold text-purple-600">3.247</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Problembereiche</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Verspätungen</span>
                    <span className="font-bold text-yellow-600">8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Beschädigungen</span>
                    <span className="font-bold text-red-600">0.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Verluste</span>
                    <span className="font-bold text-red-600">0.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Routenoptimierung</CardTitle>
              <CardDescription>
                Intelligente Routenplanung und Optimierung
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Routenoptimierung wird vorbereitet</h3>
                <p className="text-gray-600">KI-gestützte Routenoptimierung wird in Kürze verfügbar sein</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
