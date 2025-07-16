
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  MapPin, 
  Search, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Truck,
  Package,
  Route,
  Calendar,
  Activity,
  Eye,
  RefreshCw
} from 'lucide-react'

interface TrackingData {
  shipment: {
    id: string
    trackingNumber: string
    carrierName: string
    status: string
    originAddress: any
    destinationAddress: any
    estimatedDeliveryDate: string
    progress: number
  }
  events: Array<{
    id: string
    eventType: string
    timestamp: string
    location: any
    description: string
    carrierNote?: string
  }>
}

const mockTrackingData: TrackingData[] = [
  {
    shipment: {
      id: '1',
      trackingNumber: 'TRK12345678',
      carrierName: 'DHL Express',
      status: 'IN_TRANSIT',
      originAddress: { city: 'Hamburg', country: 'Deutschland' },
      destinationAddress: { city: 'München', country: 'Deutschland' },
      estimatedDeliveryDate: '2024-07-14T14:00:00Z',
      progress: 65
    },
    events: [
      {
        id: '1',
        eventType: 'REGISTERED',
        timestamp: '2024-07-12T08:00:00Z',
        location: { city: 'Hamburg', country: 'Deutschland' },
        description: 'Sendung bei DHL registriert'
      },
      {
        id: '2',
        eventType: 'PICKED_UP',
        timestamp: '2024-07-12T14:30:00Z',
        location: { city: 'Hamburg', country: 'Deutschland' },
        description: 'Paket von Absender abgeholt'
      },
      {
        id: '3',
        eventType: 'IN_TRANSIT',
        timestamp: '2024-07-13T09:15:00Z',
        location: { city: 'Hannover', country: 'Deutschland' },
        description: 'Paket im Transportzentrum Hannover',
        carrierNote: 'Sortierung für Weiterleitung nach München'
      },
      {
        id: '4',
        eventType: 'IN_TRANSIT',
        timestamp: '2024-07-13T16:45:00Z',
        location: { city: 'Nürnberg', country: 'Deutschland' },
        description: 'Paket passiert Verteilzentrum Nürnberg'
      }
    ]
  },
  {
    shipment: {
      id: '2',
      trackingNumber: 'TRK87654321',
      carrierName: 'UPS',
      status: 'OUT_FOR_DELIVERY',
      originAddress: { city: 'Berlin', country: 'Deutschland' },
      destinationAddress: { city: 'Köln', country: 'Deutschland' },
      estimatedDeliveryDate: '2024-07-13T16:00:00Z',
      progress: 90
    },
    events: [
      {
        id: '1',
        eventType: 'REGISTERED',
        timestamp: '2024-07-11T10:00:00Z',
        location: { city: 'Berlin', country: 'Deutschland' },
        description: 'Sendung bei UPS registriert'
      },
      {
        id: '2',
        eventType: 'PICKED_UP',
        timestamp: '2024-07-11T16:00:00Z',
        location: { city: 'Berlin', country: 'Deutschland' },
        description: 'Paket abgeholt'
      },
      {
        id: '3',
        eventType: 'IN_TRANSIT',
        timestamp: '2024-07-12T08:30:00Z',
        location: { city: 'Dortmund', country: 'Deutschland' },
        description: 'Paket in Dortmund Hub'
      },
      {
        id: '4',
        eventType: 'OUT_FOR_DELIVERY',
        timestamp: '2024-07-13T07:00:00Z',
        location: { city: 'Köln', country: 'Deutschland' },
        description: 'Paket zur Zustellung bereit'
      }
    ]
  }
]

const statusLabels: { [key: string]: string } = {
  'REGISTERED': 'Registriert',
  'PICKED_UP': 'Abgeholt',
  'IN_TRANSIT': 'Unterwegs',
  'OUT_FOR_DELIVERY': 'Zur Zustellung',
  'DELIVERED': 'Zugestellt',
  'EXCEPTION': 'Ausnahme'
}

const statusColors: { [key: string]: string } = {
  'REGISTERED': 'bg-blue-100 text-blue-800',
  'PICKED_UP': 'bg-yellow-100 text-yellow-800',
  'IN_TRANSIT': 'bg-purple-100 text-purple-800',
  'OUT_FOR_DELIVERY': 'bg-orange-100 text-orange-800',
  'DELIVERED': 'bg-green-100 text-green-800',
  'EXCEPTION': 'bg-red-100 text-red-800'
}

export function RealTimeTracking() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [selectedTracking, setSelectedTracking] = useState<TrackingData | null>(null)
  const [liveShipments, setLiveShipments] = useState<TrackingData[]>(mockTrackingData)
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
      // Simulate progress updates
      setLiveShipments(prev => prev.map(tracking => ({
        ...tracking,
        shipment: {
          ...tracking.shipment,
          progress: Math.min(100, tracking.shipment.progress + Math.random() * 5)
        }
      })))
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const handleTrackingSearch = async () => {
    if (!trackingNumber.trim()) return

    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const found = mockTrackingData.find(data => 
        data.shipment.trackingNumber.toLowerCase().includes(trackingNumber.toLowerCase())
      )
      
      if (found) {
        setSelectedTracking(found)
      } else {
        // Mock data for searched tracking number
        setSelectedTracking({
          shipment: {
            id: 'search',
            trackingNumber,
            carrierName: 'DPD',
            status: 'IN_TRANSIT',
            originAddress: { city: 'Frankfurt', country: 'Deutschland' },
            destinationAddress: { city: 'Stuttgart', country: 'Deutschland' },
            estimatedDeliveryDate: '2024-07-15T12:00:00Z',
            progress: 45
          },
          events: [
            {
              id: '1',
              eventType: 'REGISTERED',
              timestamp: '2024-07-12T09:00:00Z',
              location: { city: 'Frankfurt', country: 'Deutschland' },
              description: 'Sendung registriert'
            },
            {
              id: '2',
              eventType: 'IN_TRANSIT',
              timestamp: '2024-07-13T11:30:00Z',
              location: { city: 'Karlsruhe', country: 'Deutschland' },
              description: 'Paket im Verteilzentrum'
            }
          ]
        })
      }
      setLoading(false)
    }, 1000)
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'REGISTERED':
        return <Package className="h-4 w-4 text-blue-600" />
      case 'PICKED_UP':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'IN_TRANSIT':
        return <Truck className="h-4 w-4 text-purple-600" />
      case 'OUT_FOR_DELIVERY':
        return <Route className="h-4 w-4 text-orange-600" />
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'EXCEPTION':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const formatLocation = (location: any) => {
    if (!location) return 'Unbekannt'
    if (typeof location === 'string') return location
    
    const parts = []
    if (location.city) parts.push(location.city)
    if (location.country) parts.push(location.country)
    return parts.join(', ') || 'Unbekannt'
  }

  return (
    <div className="space-y-4">
      {/* Tracking Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Sendung verfolgen</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tracking-Nummer eingeben..."
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleTrackingSearch()}
              />
            </div>
            <Button 
              onClick={handleTrackingSearch}
              disabled={loading || !trackingNumber.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Verfolgen
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Live Shipments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Live Sendungen</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">
                  Update: {lastUpdate.toLocaleTimeString('de-DE')}
                </span>
                <Button size="sm" variant="outline">
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liveShipments.map((tracking) => (
                <div
                  key={tracking.shipment.id}
                  className="p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedTracking(tracking)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{tracking.shipment.trackingNumber}</h4>
                      <Badge className={statusColors[tracking.shipment.status]}>
                        {statusLabels[tracking.shipment.status]}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">{tracking.shipment.carrierName}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      {formatLocation(tracking.shipment.originAddress)} → {formatLocation(tracking.shipment.destinationAddress)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Progress value={tracking.shipment.progress} className="flex-1 mr-2" />
                      <span className="text-xs font-medium">{Math.round(tracking.shipment.progress)}%</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Erwarte Zustellung: {new Date(tracking.shipment.estimatedDeliveryDate).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Detaillierte Verfolgung</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTracking ? (
              <div className="space-y-4">
                {/* Shipment Header */}
                <div className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{selectedTracking.shipment.trackingNumber}</h3>
                    <Badge className={statusColors[selectedTracking.shipment.status]}>
                      {statusLabels[selectedTracking.shipment.status]}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Carrier:</span>
                      <div className="font-medium">{selectedTracking.shipment.carrierName}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Erwartete Lieferung:</span>
                      <div className="font-medium">
                        {new Date(selectedTracking.shipment.estimatedDeliveryDate).toLocaleDateString('de-DE')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500">Fortschritt:</span>
                      <span className="text-sm font-medium">{Math.round(selectedTracking.shipment.progress)}%</span>
                    </div>
                    <Progress value={selectedTracking.shipment.progress} className="h-2" />
                  </div>
                </div>

                {/* Route */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Von:</span>
                      <span>{formatLocation(selectedTracking.shipment.originAddress)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-red-600" />
                      <span className="font-medium">Nach:</span>
                      <span>{formatLocation(selectedTracking.shipment.destinationAddress)}</span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="font-medium mb-3">Sendungsverlauf</h4>
                  <div className="space-y-3">
                    {selectedTracking.events.map((event, index) => (
                      <div key={event.id} className="flex space-x-3">
                        <div className="flex flex-col items-center">
                          <div className="bg-white border-2 border-gray-200 rounded-full p-1">
                            {getEventIcon(event.eventType)}
                          </div>
                          {index < selectedTracking.events.length - 1 && (
                            <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">{event.description}</h5>
                            <span className="text-xs text-gray-500">
                              {new Date(event.timestamp).toLocaleDateString('de-DE')} {' '}
                              {new Date(event.timestamp).toLocaleTimeString('de-DE', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{formatLocation(event.location)}</span>
                            </div>
                          </div>
                          
                          {event.carrierNote && (
                            <div className="text-xs text-gray-500 mt-1 italic">
                              Hinweis: {event.carrierNote}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Sendung aus der Liste auswählen oder Tracking-Nummer eingeben</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
