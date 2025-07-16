
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Warehouse, TrendingUp, AlertTriangle, CheckCircle, Search, QrCode, Plus, BarChart3, ArrowUpDown } from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Cell } from "recharts"
import { Progress } from "@/components/ui/progress"

interface InventoryItem {
  id: string
  sku: string
  name: string
  category: string
  location: string
  currentStock: number
  minStock: number
  maxStock: number
  reorderPoint: number
  unitCost: number
  totalValue: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstocked'
  lastMovement: string
  supplier: string
}

interface WarehouseLocation {
  id: string
  name: string
  type: 'shelf' | 'rack' | 'floor' | 'cold_storage'
  zone: string
  capacity: number
  occupied: number
  temperature?: number
  humidity?: number
}

interface StockMovement {
  id: string
  itemId: string
  itemName: string
  type: 'inbound' | 'outbound' | 'transfer' | 'adjustment'
  quantity: number
  from?: string
  to?: string
  reference: string
  timestamp: string
  user: string
}

export default function WarehousingPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [locations, setLocations] = useState<WarehouseLocation[]>([])
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWarehouseData()
  }, [])

  const loadWarehouseData = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setInventory([
        {
          id: "1",
          sku: "LAP-DEL-XPS15",
          name: "Dell XPS 15 Laptop",
          category: "IT Equipment",
          location: "A-01-03",
          currentStock: 25,
          minStock: 10,
          maxStock: 50,
          reorderPoint: 15,
          unitCost: 1899.00,
          totalValue: 47475.00,
          status: "in_stock",
          lastMovement: "2024-01-15",
          supplier: "TechSupply GmbH"
        },
        {
          id: "2",
          sku: "PEN-BIC-BLU",
          name: "BIC Kugelschreiber Blau (100er Pack)",
          category: "Office Supplies",
          location: "B-02-15",
          currentStock: 8,
          minStock: 12,
          maxStock: 100,
          reorderPoint: 20,
          unitCost: 15.50,
          totalValue: 124.00,
          status: "low_stock",
          lastMovement: "2024-01-14",
          supplier: "OfficeMax Solutions"
        },
        {
          id: "3",
          sku: "PART-IND-A789",
          name: "Industrielle Komponente A789",
          category: "Manufacturing",
          location: "C-03-08",
          currentStock: 0,
          minStock: 5,
          maxStock: 25,
          reorderPoint: 8,
          unitCost: 156.80,
          totalValue: 0,
          status: "out_of_stock",
          lastMovement: "2024-01-10",
          supplier: "Industrial Parts Ltd"
        },
        {
          id: "4",
          sku: "LED-GRN-48W",
          name: "LED Panel 48W Grün",
          category: "Facilities",
          location: "D-01-12",
          currentStock: 125,
          minStock: 20,
          maxStock: 80,
          reorderPoint: 30,
          unitCost: 45.50,
          totalValue: 5687.50,
          status: "overstocked",
          lastMovement: "2024-01-12",
          supplier: "Green Energy Systems"
        }
      ])

      setLocations([
        {
          id: "1",
          name: "A-01-03",
          type: "shelf",
          zone: "Zone A",
          capacity: 100,
          occupied: 75,
          temperature: 22,
          humidity: 45
        },
        {
          id: "2",
          name: "B-02-15",
          type: "rack",
          zone: "Zone B",
          capacity: 200,
          occupied: 120,
          temperature: 21,
          humidity: 42
        },
        {
          id: "3",
          name: "C-03-08",
          type: "floor",
          zone: "Zone C",
          capacity: 50,
          occupied: 15,
          temperature: 20,
          humidity: 50
        },
        {
          id: "4",
          name: "COLD-01",
          type: "cold_storage",
          zone: "Kühlzone",
          capacity: 75,
          occupied: 45,
          temperature: 4,
          humidity: 65
        }
      ])

      setMovements([
        {
          id: "1",
          itemId: "1",
          itemName: "Dell XPS 15 Laptop",
          type: "inbound",
          quantity: 10,
          to: "A-01-03",
          reference: "PO-2024-001",
          timestamp: "2024-01-15T10:30:00",
          user: "Max Weber"
        },
        {
          id: "2",
          itemId: "2",
          itemName: "BIC Kugelschreiber Blau",
          type: "outbound",
          quantity: -5,
          from: "B-02-15",
          reference: "REQ-HR-2024-003",
          timestamp: "2024-01-14T14:20:00",
          user: "Lisa Müller"
        },
        {
          id: "3",
          itemId: "3",
          itemName: "Industrielle Komponente A789",
          type: "outbound",
          quantity: -12,
          from: "C-03-08",
          reference: "PROD-2024-007",
          timestamp: "2024-01-13T09:15:00",
          user: "Thomas Fischer"
        }
      ])

      setLoading(false)
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      in_stock: "default",
      low_stock: "secondary",
      out_of_stock: "destructive",
      overstocked: "outline"
    } as const
    
    const labels = {
      in_stock: "Verfügbar",
      low_stock: "Niedrig",
      out_of_stock: "Ausverkauft",
      overstocked: "Überbestand"
    }
    
    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'inbound': return <span className="text-green-500">↗</span>
      case 'outbound': return <span className="text-red-500">↘</span>
      case 'transfer': return <span className="text-blue-500">↔</span>
      case 'adjustment': return <span className="text-purple-500">⟳</span>
      default: return <span className="text-gray-500">•</span>
    }
  }

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Sample chart data
  const stockLevelsData = [
    { month: 'Aug', inStock: 1250, outStock: 45, lowStock: 78 },
    { month: 'Sep', inStock: 1320, outStock: 32, lowStock: 65 },
    { month: 'Okt', inStock: 1280, outStock: 28, lowStock: 71 },
    { month: 'Nov', inStock: 1395, outStock: 35, lowStock: 82 },
    { month: 'Dez', inStock: 1450, outStock: 22, lowStock: 59 },
    { month: 'Jan', inStock: 1520, outStock: 18, lowStock: 67 }
  ]

  const categoryDistribution = [
    { name: 'IT Equipment', value: 45, color: '#3B82F6' },
    { name: 'Office Supplies', value: 30, color: '#10B981' },
    { name: 'Manufacturing', value: 15, color: '#F59E0B' },
    { name: 'Facilities', value: 10, color: '#EF4444' }
  ]

  const totalItems = inventory.length
  const lowStockItems = inventory.filter(i => i.status === 'low_stock').length
  const outOfStockItems = inventory.filter(i => i.status === 'out_of_stock').length
  const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0)
  const warehouseUtilization = Math.round(locations.reduce((sum, loc) => sum + (loc.occupied / loc.capacity), 0) / locations.length * 100)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Lagerverwaltung</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Lagerverwaltung</h1>
          <p className="text-gray-600 mt-1">Bestandsführung und Warehouse Management</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <QrCode className="w-4 h-4 mr-2" />
            Scan
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Artikel hinzufügen
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gesamtartikel</p>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                <p className="text-xs text-green-600">+12 diese Woche</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Niedrige Bestände</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
                <p className="text-xs text-yellow-600">Nachbestellung nötig</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nicht verfügbar</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockItems}</p>
                <p className="text-xs text-red-600">Dringend bestellen</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lagerwert</p>
                <p className="text-2xl font-bold text-green-600">€{totalValue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Gesamtbestand</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Lagerauslastung</CardTitle>
          <CardDescription>Kapazitätsübersicht nach Lagerbereichen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {locations.map((location) => (
              <div key={location.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{location.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {location.type === 'shelf' && 'Regal'}
                    {location.type === 'rack' && 'Gestell'}
                    {location.type === 'floor' && 'Boden'}
                    {location.type === 'cold_storage' && 'Kühlzone'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Auslastung</span>
                    <span>{Math.round((location.occupied / location.capacity) * 100)}%</span>
                  </div>
                  <Progress value={(location.occupied / location.capacity) * 100} />
                  <div className="text-xs text-gray-500">
                    {location.occupied} / {location.capacity} Einheiten
                  </div>
                  {location.temperature && (
                    <div className="text-xs text-gray-500">
                      🌡️ {location.temperature}°C | 💧 {location.humidity}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bestandsentwicklung</CardTitle>
            <CardDescription>Monatliche Entwicklung der Lagerbestände</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stockLevelsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Anzahl', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                />
                <Tooltip />
                <Line type="monotone" dataKey="inStock" stroke="#10B981" strokeWidth={3} name="Verfügbar" />
                <Line type="monotone" dataKey="lowStock" stroke="#F59E0B" strokeWidth={2} name="Niedrig" />
                <Line type="monotone" dataKey="outStock" stroke="#EF4444" strokeWidth={2} name="Ausverkauft" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kategorieverteilung</CardTitle>
            <CardDescription>Bestandsverteilung nach Produktkategorien</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <PieChart dataKey="value" data={categoryDistribution} cx="50%" cy="50%" outerRadius={80}>
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </PieChart>
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryDistribution.map((category) => (
                <div key={category.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                  <span className="text-sm text-gray-600">{category.name}: {category.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Bestand</TabsTrigger>
          <TabsTrigger value="movements">Bewegungen</TabsTrigger>
          <TabsTrigger value="locations">Lagerplätze</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Artikel durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Kategorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                <SelectItem value="Office Supplies">Büromaterial</SelectItem>
                <SelectItem value="Manufacturing">Produktion</SelectItem>
                <SelectItem value="Facilities">Facilities</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="in_stock">Verfügbar</SelectItem>
                <SelectItem value="low_stock">Niedrig</SelectItem>
                <SelectItem value="out_of_stock">Ausverkauft</SelectItem>
                <SelectItem value="overstocked">Überbestand</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredInventory.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        {getStatusBadge(item.status)}
                        <Badge variant="outline" className="text-xs">{item.sku}</Badge>
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Lagerplatz: </span>
                          <span className="font-medium">{item.location}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Bestand: </span>
                          <span className="font-medium">{item.currentStock} Stück</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Min./Max.: </span>
                          <span className="font-medium">{item.minStock}/{item.maxStock}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Lieferant: </span>
                          <span className="font-medium">{item.supplier}</span>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Bestandslevel</span>
                          <span>{item.currentStock}/{item.maxStock}</span>
                        </div>
                        <Progress value={(item.currentStock / item.maxStock) * 100} />
                      </div>
                      <div className="text-sm text-gray-500">
                        Letzte Bewegung: {new Date(item.lastMovement).toLocaleDateString('de-DE')}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xl font-bold text-gray-900">€{item.totalValue.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">€{item.unitCost.toLocaleString()} / Stück</p>
                      <div className="flex space-x-2 mt-2">
                        <Button variant="outline" size="sm">
                          <ArrowUpDown className="w-4 h-4 mr-1" />
                          Bewegen
                        </Button>
                        <Button size="sm">
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <div className="grid gap-4">
            {movements.map((movement) => (
              <Card key={movement.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                        {getMovementIcon(movement.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{movement.itemName}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Badge variant="outline" className="text-xs">
                            {movement.type === 'inbound' && 'Eingang'}
                            {movement.type === 'outbound' && 'Ausgang'}
                            {movement.type === 'transfer' && 'Transfer'}
                            {movement.type === 'adjustment' && 'Korrektur'}
                          </Badge>
                          <span>Menge: {Math.abs(movement.quantity)}</span>
                          {movement.from && <span>Von: {movement.from}</span>}
                          {movement.to && <span>Nach: {movement.to}</span>}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Referenz: {movement.reference} | {movement.user} | {new Date(movement.timestamp).toLocaleString('de-DE')}
                        </div>
                      </div>
                    </div>
                    <div className={`text-right ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <p className="text-lg font-bold">
                        {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <Card key={location.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{location.name}</h3>
                      <p className="text-sm text-gray-600">{location.zone}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {location.type === 'shelf' && '📚 Regal'}
                      {location.type === 'rack' && '🏗️ Gestell'}
                      {location.type === 'floor' && '📦 Boden'}
                      {location.type === 'cold_storage' && '❄️ Kühlzone'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Auslastung</span>
                        <span>{Math.round((location.occupied / location.capacity) * 100)}%</span>
                      </div>
                      <Progress value={(location.occupied / location.capacity) * 100} />
                      <div className="text-xs text-gray-500 mt-1">
                        {location.occupied} / {location.capacity} Einheiten
                      </div>
                    </div>
                    
                    {location.temperature && (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Temperatur:</span>
                          <div className="font-medium">{location.temperature}°C</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Feuchtigkeit:</span>
                          <div className="font-medium">{location.humidity}%</div>
                        </div>
                      </div>
                    )}
                    
                    <Button variant="outline" className="w-full">
                      <Warehouse className="w-4 h-4 mr-2" />
                      Verwalten
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Bestandsbericht</h3>
                    <p className="text-sm text-gray-600">Aktueller Lagerbestand nach Kategorien</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Bewegungshistorie</h3>
                    <p className="text-sm text-gray-600">Detaillierte Ein- und Ausgangsbuchungen</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-8 h-8 text-orange-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Nachbestellung</h3>
                    <p className="text-sm text-gray-600">Artikel unter Mindestbestand</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
