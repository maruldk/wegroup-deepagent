
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Package, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Search,
  Filter,
  RefreshCw,
  Zap,
  Clock
} from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Area, AreaChart } from 'recharts'

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
  lastMovement: string
  movementType: 'in' | 'out' | 'adjustment'
  supplier: string
  leadTime: number
  turnoverRate: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock'
  aiOptimizedLevels?: {
    suggestedMin: number
    suggestedMax: number
    confidenceScore: number
  }
}

interface InventoryMovement {
  date: string
  type: 'inbound' | 'outbound' | 'adjustment'
  quantity: number
  value: number
  reason: string
}

export function InventoryDashboard() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInventoryData()
  }, [])

  const loadInventoryData = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setInventoryItems([
        {
          id: '1',
          sku: 'LAP-XPS-001',
          name: 'Dell XPS 13 Laptop',
          category: 'Electronics',
          location: 'Warehouse A, Shelf B-12',
          currentStock: 25,
          minStock: 10,
          maxStock: 50,
          reorderPoint: 15,
          unitCost: 1200,
          totalValue: 30000,
          lastMovement: '2024-01-14T10:30:00',
          movementType: 'out',
          supplier: 'Dell Technologies',
          leadTime: 7,
          turnoverRate: 4.2,
          status: 'in_stock',
          aiOptimizedLevels: {
            suggestedMin: 12,
            suggestedMax: 45,
            confidenceScore: 94
          }
        },
        {
          id: '2',
          sku: 'OFF-CHA-002',
          name: 'Ergonomic Office Chair',
          category: 'Furniture',
          location: 'Warehouse B, Section C',
          currentStock: 8,
          minStock: 12,
          maxStock: 30,
          reorderPoint: 15,
          unitCost: 350,
          totalValue: 2800,
          lastMovement: '2024-01-15T14:20:00',
          movementType: 'out',
          supplier: 'Herman Miller',
          leadTime: 14,
          turnoverRate: 2.8,
          status: 'low_stock',
          aiOptimizedLevels: {
            suggestedMin: 15,
            suggestedMax: 35,
            confidenceScore: 87
          }
        },
        {
          id: '3',
          sku: 'STA-PEN-003',
          name: 'Premium Ballpoint Pens (Pack of 12)',
          category: 'Office Supplies',
          location: 'Warehouse A, Shelf A-5',
          currentStock: 0,
          minStock: 20,
          maxStock: 100,
          reorderPoint: 30,
          unitCost: 15,
          totalValue: 0,
          lastMovement: '2024-01-12T09:15:00',
          movementType: 'out',
          supplier: 'Staples Inc.',
          leadTime: 3,
          turnoverRate: 8.5,
          status: 'out_of_stock',
          aiOptimizedLevels: {
            suggestedMin: 25,
            suggestedMax: 120,
            confidenceScore: 91
          }
        },
        {
          id: '4',
          sku: 'SRV-RAC-004',
          name: 'Server Rack 42U',
          category: 'IT Infrastructure',
          location: 'Warehouse C, IT Section',
          currentStock: 15,
          minStock: 3,
          maxStock: 8,
          reorderPoint: 5,
          unitCost: 2500,
          totalValue: 37500,
          lastMovement: '2024-01-10T16:45:00',
          movementType: 'in',
          supplier: 'APC by Schneider Electric',
          leadTime: 21,
          turnoverRate: 1.2,
          status: 'overstock',
          aiOptimizedLevels: {
            suggestedMin: 4,
            suggestedMax: 10,
            confidenceScore: 89
          }
        },
        {
          id: '5',
          sku: 'MKT-BAN-005',
          name: 'Marketing Banner Roll-up',
          category: 'Marketing Materials',
          location: 'Warehouse A, Marketing Section',
          currentStock: 22,
          minStock: 10,
          maxStock: 25,
          reorderPoint: 12,
          unitCost: 120,
          totalValue: 2640,
          lastMovement: '2024-01-13T11:00:00',
          movementType: 'in',
          supplier: 'Print Solutions GmbH',
          leadTime: 5,
          turnoverRate: 3.6,
          status: 'in_stock',
          aiOptimizedLevels: {
            suggestedMin: 8,
            suggestedMax: 20,
            confidenceScore: 92
          }
        }
      ])
      setLoading(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      in_stock: 'bg-green-100 text-green-700',
      low_stock: 'bg-yellow-100 text-yellow-700',
      out_of_stock: 'bg-red-100 text-red-700',
      overstock: 'bg-blue-100 text-blue-700'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'low_stock':
        return <TrendingDown className="w-4 h-4 text-yellow-500" />
      case 'out_of_stock':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'overstock':
        return <TrendingUp className="w-4 h-4 text-blue-500" />
      default:
        return <Package className="w-4 h-4 text-gray-500" />
    }
  }

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = ['all', ...Array.from(new Set(inventoryItems.map(item => item.category)))]

  const inventoryTrends = [
    { month: 'Aug', value: 485000, turnover: 3.2, stockouts: 2 },
    { month: 'Sep', value: 512000, turnover: 3.8, stockouts: 1 },
    { month: 'Okt', value: 498000, turnover: 3.5, stockouts: 3 },
    { month: 'Nov', value: 535000, turnover: 4.1, stockouts: 1 },
    { month: 'Dez', value: 520000, turnover: 3.9, stockouts: 2 },
    { month: 'Jan', value: 545000, turnover: 4.2, stockouts: 1 }
  ]

  const categoryDistribution = [
    { name: 'Electronics', value: 67500, percentage: 62.1, color: '#60B5FF' },
    { name: 'Furniture', value: 2800, percentage: 2.6, color: '#FF9149' },
    { name: 'Office Supplies', value: 0, percentage: 0, color: '#FF9898' },
    { name: 'IT Infrastructure', value: 37500, percentage: 34.5, color: '#80D8C3' },
    { name: 'Marketing Materials', value: 2640, percentage: 2.4, color: '#A19AD3' }
  ]

  const totalValue = inventoryItems.reduce((acc, item) => acc + item.totalValue, 0)
  const totalItems = inventoryItems.length
  const lowStockItems = inventoryItems.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock').length
  const avgTurnover = Math.round((inventoryItems.reduce((acc, item) => acc + item.turnoverRate, 0) / inventoryItems.length) * 10) / 10

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Lager-Management</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">KI-Lager-Management</h1>
          <p className="text-gray-600 mt-1">Intelligente Bestandsoptimierung mit 96% Genauigkeit</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Aktualisieren
          </Button>
          <Button>
            <Zap className="w-4 h-4 mr-2" />
            KI-Optimierung
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lagerwert</p>
                <p className="text-2xl font-bold text-gray-900">€{totalValue.toLocaleString()}</p>
                <p className="text-xs text-blue-600">Gesamtbestand</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Artikel</p>
                <p className="text-2xl font-bold text-purple-600">{totalItems}</p>
                <p className="text-xs text-purple-600">Verschiedene SKUs</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Niedrige Bestände</p>
                <p className="text-2xl font-bold text-orange-600">{lowStockItems}</p>
                <p className="text-xs text-orange-600">Aufmerksamkeit nötig</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ø Umschlag</p>
                <p className="text-2xl font-bold text-green-600">{avgTurnover}x</p>
                <p className="text-xs text-green-600">Pro Jahr</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Lager-Performance & Trends</CardTitle>
          <CardDescription>Bestandswert, Umschlag und Stockouts über Zeit</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={inventoryTrends}>
              <XAxis 
                dataKey="month" 
                tickLine={false}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                yAxisId="left"
                tickLine={false}
                tick={{ fontSize: 10 }}
                label={{ value: 'Wert (€)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tickLine={false}
                tick={{ fontSize: 10 }}
                label={{ value: 'Umschlag', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fontSize: 11 } }}
              />
              <Tooltip />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="value" 
                stroke="#60B5FF" 
                fill="#60B5FF" 
                fillOpacity={0.3}
                name="Bestandswert"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="turnover" 
                stroke="#80D8C3" 
                strokeWidth={2}
                name="Umschlagshäufigkeit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Bestandsliste</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="optimization">KI-Optimierung</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Nach Artikel oder SKU suchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Kategorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat === 'all' ? 'Alle Kategorien' : cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle</SelectItem>
                      <SelectItem value="in_stock">Auf Lager</SelectItem>
                      <SelectItem value="low_stock">Niedrig</SelectItem>
                      <SelectItem value="out_of_stock">Ausverkauft</SelectItem>
                      <SelectItem value="overstock">Überbestand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusIcon(item.status)}
                          <span className="ml-1">
                            {item.status === 'in_stock' && 'Auf Lager'}
                            {item.status === 'low_stock' && 'Niedrig'}
                            {item.status === 'out_of_stock' && 'Ausverkauft'}
                            {item.status === 'overstock' && 'Überbestand'}
                          </span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          SKU: {item.sku}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Bestand: </span>
                          <span className="font-medium">{item.currentStock} Stück</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Min/Max: </span>
                          <span className="font-medium">{item.minStock}/{item.maxStock}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Stückkosten: </span>
                          <span className="font-medium">€{item.unitCost.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Gesamtwert: </span>
                          <span className="font-medium">€{item.totalValue.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Standort: </span>
                          <span className="font-medium">{item.location}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Lieferant: </span>
                          <span className="font-medium">{item.supplier}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Lieferzeit: </span>
                          <span className="font-medium">{item.leadTime} Tage</span>
                        </div>
                      </div>

                      {/* Stock Level Progress */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Bestandslevel</span>
                          <span>{Math.round((item.currentStock / item.maxStock) * 100)}% von Max</span>
                        </div>
                        <Progress value={(item.currentStock / item.maxStock) * 100} />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Min: {item.minStock}</span>
                          <span>Reorder: {item.reorderPoint}</span>
                          <span>Max: {item.maxStock}</span>
                        </div>
                      </div>

                      {/* AI Optimization Suggestions */}
                      {item.aiOptimizedLevels && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Zap className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium text-blue-900">KI-Optimierungsempfehlung</span>
                            <Badge variant="outline" className="text-xs">
                              {item.aiOptimizedLevels.confidenceScore}% Vertrauen
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-xs text-blue-800">
                            <div>
                              <span>Empfohlenes Min: </span>
                              <span className="font-medium">{item.aiOptimizedLevels.suggestedMin}</span>
                            </div>
                            <div>
                              <span>Empfohlenes Max: </span>
                              <span className="font-medium">{item.aiOptimizedLevels.suggestedMax}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">{item.turnoverRate}x/Jahr</span>
                      </div>
                      <div className="flex items-center space-x-1 mb-3 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Letzte Bewegung: {new Date(item.lastMovement).toLocaleDateString('de-DE')}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                        <Button size="sm">
                          Bestellung
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Kategorie-Verteilung</CardTitle>
                <CardDescription>Lagerwert nach Kategorie</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.percentage}%`}
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `€${Number(value).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Umschlagshäufigkeit</CardTitle>
                <CardDescription>Inventory Turnover nach Kategorie</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { category: 'Office Supplies', turnover: 8.5 },
                    { category: 'Electronics', turnover: 4.2 },
                    { category: 'Marketing', turnover: 3.6 },
                    { category: 'Furniture', turnover: 2.8 },
                    { category: 'IT Infrastructure', turnover: 1.2 }
                  ]}>
                    <XAxis 
                      dataKey="category" 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Umschlag/Jahr', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <Tooltip />
                    <Bar dataKey="turnover" fill="#60B5FF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>KI-Optimierungs-Performance</CardTitle>
                <CardDescription>Verbesserungen durch maschinelles Lernen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bestandsgenauigkeit</span>
                  <span className="font-bold">96.8%</span>
                </div>
                <Progress value={96.8} />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Stockout-Reduktion</span>
                  <span className="font-bold">-73%</span>
                </div>
                <Progress value={73} />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lagerkosteneinsparung</span>
                  <span className="font-bold">-28%</span>
                </div>
                <Progress value={28} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automatische Bestellvorschläge</CardTitle>
                <CardDescription>KI-generierte Procurement-Empfehlungen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Premium Ballpoint Pens sofort bestellen</p>
                      <p className="text-xs text-gray-600">Empfohlene Menge: 150 Stück</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <TrendingDown className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Ergonomic Office Chair nachbestellen</p>
                      <p className="text-xs text-gray-600">Empfohlene Menge: 20 Stück in 5 Tagen</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Server Rack Bestand reduzieren</p>
                      <p className="text-xs text-gray-600">5 Einheiten verkaufen oder umverteilen</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Zap className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Demand Forecasting</h3>
                    <p className="text-sm text-gray-600">30-Tage Nachfrageprognose</p>
                    <p className="text-xs text-blue-600 mt-1">94.2% Genauigkeit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Saisonale Anpassung</h3>
                    <p className="text-sm text-gray-600">Automatische Bestände für Q2</p>
                    <p className="text-xs text-green-600 mt-1">15% Kosteneinsparung</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-8 h-8 text-orange-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Risk Monitoring</h3>
                    <p className="text-sm text-gray-600">Lieferrisiko-Überwachung</p>
                    <p className="text-xs text-orange-600 mt-1">3 kritische Lieferanten</p>
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
