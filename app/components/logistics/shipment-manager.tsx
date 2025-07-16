
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Package, 
  Search, 
  Plus, 
  MapPin,
  Calendar,
  Truck,
  Clock,
  AlertTriangle,
  CheckCircle,
  Route,
  Target,
  Brain,
  Leaf,
  Eye
} from 'lucide-react'

interface Shipment {
  id: string
  trackingNumber: string
  carrierName?: string
  status: string
  originAddress?: any
  destinationAddress?: any
  estimatedDeliveryDate?: string
  actualDeliveryDate?: string
  weight?: number
  priority: string
  customerReference?: string
  optimizedCarrierSuggestion?: string
  predictedDelayInHours?: number
  routeEfficiencyScore?: number
  co2FootprintEstimate?: number
  deliveryProbabilityScore?: number
  createdAt: string
  trackingEvents?: Array<{
    eventType: string
    timestamp: string
    description?: string
    location?: any
  }>
}

const statusLabels: { [key: string]: string } = {
  'REGISTERED': 'Registriert',
  'PICKED_UP': 'Abgeholt',
  'IN_TRANSIT': 'Unterwegs',
  'OUT_FOR_DELIVERY': 'Zur Zustellung',
  'DELIVERED': 'Zugestellt',
  'EXCEPTION': 'Ausnahme',
  'CANCELLED': 'Storniert',
  'RETURNED': 'Retourniert'
}

const statusColors: { [key: string]: string } = {
  'REGISTERED': 'bg-blue-100 text-blue-800',
  'PICKED_UP': 'bg-yellow-100 text-yellow-800',
  'IN_TRANSIT': 'bg-purple-100 text-purple-800',
  'OUT_FOR_DELIVERY': 'bg-orange-100 text-orange-800',
  'DELIVERED': 'bg-green-100 text-green-800',
  'EXCEPTION': 'bg-red-100 text-red-800',
  'CANCELLED': 'bg-gray-100 text-gray-800',
  'RETURNED': 'bg-amber-100 text-amber-800'
}

const priorityLabels: { [key: string]: string } = {
  'LOW': 'Niedrig',
  'STANDARD': 'Standard',
  'HIGH': 'Hoch',
  'URGENT': 'Dringend',
  'CRITICAL': 'Kritisch'
}

const priorityColors: { [key: string]: string } = {
  'LOW': 'bg-gray-100 text-gray-800',
  'STANDARD': 'bg-blue-100 text-blue-800',
  'HIGH': 'bg-yellow-100 text-yellow-800',
  'URGENT': 'bg-orange-100 text-orange-800',
  'CRITICAL': 'bg-red-100 text-red-800'
}

export function ShipmentManager() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [carrierFilter, setCarrierFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchShipments()
  }, [page, statusFilter, carrierFilter, priorityFilter])

  const fetchShipments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })
      
      if (statusFilter) params.append('status', statusFilter)
      if (carrierFilter) params.append('carrier', carrierFilter)
      if (priorityFilter) params.append('priority', priorityFilter)

      const response = await fetch(`/api/logistics/shipments?${params}`)
      if (response.ok) {
        const data = await response.json()
        setShipments(data.shipments)
        setTotal(data.pagination.total)
      }
    } catch (error) {
      console.error('Failed to fetch shipments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredShipments = shipments.filter(shipment => {
    if (!searchTerm) return true
    return shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
           shipment.customerReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           shipment.carrierName?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const getDelayBadge = (delayHours?: number) => {
    if (!delayHours || delayHours === 0) return null
    
    if (delayHours >= 24) {
      return (
        <Badge variant="destructive" className="text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          +{Math.round(delayHours / 24)}d
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
          <Clock className="h-3 w-3 mr-1" />
          +{delayHours}h
        </Badge>
      )
    }
  }

  const getEfficiencyBadge = (score?: number) => {
    if (!score) return null
    
    if (score >= 90) {
      return (
        <Badge className="bg-green-100 text-green-800 text-xs">
          <Target className="h-3 w-3 mr-1" />
          Optimal ({score.toFixed(0)}%)
        </Badge>
      )
    } else if (score >= 75) {
      return (
        <Badge className="bg-blue-100 text-blue-800 text-xs">
          <Route className="h-3 w-3 mr-1" />
          Gut ({score.toFixed(0)}%)
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-orange-100 text-orange-800 text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Suboptimal ({score.toFixed(0)}%)
        </Badge>
      )
    }
  }

  const formatAddress = (address: any) => {
    if (!address) return 'Unbekannt'
    if (typeof address === 'string') return address
    
    const parts = []
    if (address.city) parts.push(address.city)
    if (address.country) parts.push(address.country)
    return parts.join(', ') || 'Unbekannt'
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Sendungsverwaltung</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Brain className="h-3 w-3 mr-1" />
                KI-optimiert
              </Badge>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Neue Sendung
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Suche nach Tracking-Nr., Referenz oder Carrier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="REGISTERED">Registriert</SelectItem>
                <SelectItem value="IN_TRANSIT">Unterwegs</SelectItem>
                <SelectItem value="OUT_FOR_DELIVERY">Zur Zustellung</SelectItem>
                <SelectItem value="DELIVERED">Zugestellt</SelectItem>
                <SelectItem value="EXCEPTION">Ausnahme</SelectItem>
              </SelectContent>
            </Select>
            <Select value={carrierFilter} onValueChange={setCarrierFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Carrier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Carrier</SelectItem>
                <SelectItem value="DHL">DHL</SelectItem>
                <SelectItem value="UPS">UPS</SelectItem>
                <SelectItem value="FedEx">FedEx</SelectItem>
                <SelectItem value="DPD">DPD</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Priorität" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Prioritäten</SelectItem>
                <SelectItem value="CRITICAL">Kritisch</SelectItem>
                <SelectItem value="URGENT">Dringend</SelectItem>
                <SelectItem value="HIGH">Hoch</SelectItem>
                <SelectItem value="STANDARD">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Shipment List */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Lade Sendungen...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredShipments.map((shipment) => (
                <Card key={shipment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">
                            {shipment.trackingNumber}
                          </h3>
                          <Badge className={statusColors[shipment.status] || 'bg-gray-100 text-gray-800'}>
                            {statusLabels[shipment.status] || shipment.status}
                          </Badge>
                          <Badge className={priorityColors[shipment.priority] || 'bg-gray-100 text-gray-800'}>
                            {priorityLabels[shipment.priority] || shipment.priority}
                          </Badge>
                          {getDelayBadge(shipment.predictedDelayInHours)}
                          {getEfficiencyBadge(shipment.routeEfficiencyScore)}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Truck className="h-3 w-3" />
                              <span className="font-medium">
                                {shipment.carrierName || 'Kein Carrier'}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>
                                {formatAddress(shipment.originAddress)} → {formatAddress(shipment.destinationAddress)}
                              </span>
                            </div>
                            
                            {shipment.estimatedDeliveryDate && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  Erwartet: {new Date(shipment.estimatedDeliveryDate).toLocaleDateString('de-DE')}
                                </span>
                              </div>
                            )}
                            
                            {shipment.weight && (
                              <div className="flex items-center space-x-1">
                                <span>{shipment.weight}kg</span>
                              </div>
                            )}
                          </div>
                          
                          {/* AI Optimization Info */}
                          {shipment.optimizedCarrierSuggestion && (
                            <div className="bg-indigo-50 p-2 rounded text-xs">
                              <div className="flex items-center space-x-2">
                                <Brain className="h-3 w-3 text-indigo-600" />
                                <span className="text-indigo-800">
                                  KI-Empfehlung: {shipment.optimizedCarrierSuggestion}
                                </span>
                                {shipment.deliveryProbabilityScore && (
                                  <span className="text-indigo-600">
                                    (Lieferwahrscheinlichkeit: {shipment.deliveryProbabilityScore.toFixed(0)}%)
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* CO2 & Sustainability */}
                          {shipment.co2FootprintEstimate && (
                            <div className="flex items-center space-x-2 text-xs">
                              <Leaf className="h-3 w-3 text-green-600" />
                              <span className="text-green-600">
                                CO2-Fußabdruck: {shipment.co2FootprintEstimate}kg
                              </span>
                            </div>
                          )}
                          
                          {/* Latest Tracking Event */}
                          {shipment.trackingEvents && shipment.trackingEvents.length > 0 && (
                            <div className="bg-gray-50 p-2 rounded text-xs">
                              <span className="text-gray-500">Letztes Update: </span>
                              <span className="font-medium">
                                {shipment.trackingEvents[0].description || shipment.trackingEvents[0].eventType}
                              </span>
                              <span className="text-gray-500 ml-2">
                                ({new Date(shipment.trackingEvents[0].timestamp).toLocaleDateString('de-DE')})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions & Status */}
                      <div className="flex flex-col items-end space-y-2 min-w-32">
                        <div className="text-right text-xs text-gray-500">
                          {new Date(shipment.createdAt).toLocaleDateString('de-DE')}
                        </div>
                        
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MapPin className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {shipment.status === 'EXCEPTION' && (
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-xs">
                            <Route className="h-3 w-3 mr-1" />
                            Optimieren
                          </Button>
                        )}
                        
                        {shipment.status === 'DELIVERED' && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Abgeschlossen
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredShipments.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Keine Sendungen gefunden</p>
                </div>
              )}
              
              {/* Pagination */}
              {total > 10 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-gray-600">
                    Zeige {Math.min(page * 10, total)} von {total} Sendungen
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Zurück
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={page * 10 >= total}
                    >
                      Weiter
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
