
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Package, TrendingUp, Clock, CheckCircle, AlertTriangle, Search, Filter, Plus, Download } from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PurchaseOrder {
  id: string
  orderNumber: string
  supplier: string
  description: string
  category: string
  quantity: number
  unitPrice: number
  totalAmount: number
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'delivered' | 'cancelled'
  requestedBy: string
  createdAt: string
  expectedDelivery: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

interface Supplier {
  id: string
  name: string
  category: string
  rating: number
  contactPerson: string
  email: string
  phone: string
  deliveryTime: number
  reliability: number
  totalOrders: number
  avgOrderValue: number
}

interface ProcurementAnalytics {
  totalSpend: number
  orderCount: number
  avgOrderValue: number
  topCategory: string
  savingsThisMonth: number
}

export default function ProcurementPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [analytics, setAnalytics] = useState<ProcurementAnalytics | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProcurementData()
  }, [])

  const loadProcurementData = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setPurchaseOrders([
        {
          id: "1",
          orderNumber: "PO-2024-001",
          supplier: "TechSupply GmbH",
          description: "Laptops Dell XPS 15 (10 Stück)",
          category: "IT Equipment",
          quantity: 10,
          unitPrice: 1899.00,
          totalAmount: 18990.00,
          status: "approved",
          requestedBy: "Anna Schmidt",
          createdAt: "2024-01-15",
          expectedDelivery: "2024-01-25",
          priority: "high"
        },
        {
          id: "2",
          orderNumber: "PO-2024-002",
          supplier: "OfficeMax Solutions",
          description: "Büromaterialien Q1 2024",
          category: "Office Supplies",
          quantity: 1,
          unitPrice: 2450.00,
          totalAmount: 2450.00,
          status: "delivered",
          requestedBy: "Michael Weber",
          createdAt: "2024-01-12",
          expectedDelivery: "2024-01-20",
          priority: "medium"
        },
        {
          id: "3",
          orderNumber: "PO-2024-003",
          supplier: "Industrial Parts Ltd",
          description: "Ersatzteile Produktionslinie A",
          category: "Manufacturing",
          quantity: 25,
          unitPrice: 156.80,
          totalAmount: 3920.00,
          status: "pending",
          requestedBy: "Thomas Fischer",
          createdAt: "2024-01-14",
          expectedDelivery: "2024-02-05",
          priority: "urgent"
        },
        {
          id: "4",
          orderNumber: "PO-2024-004",
          supplier: "Green Energy Systems",
          description: "LED Beleuchtung Bürogebäude",
          category: "Facilities",
          quantity: 120,
          unitPrice: 45.50,
          totalAmount: 5460.00,
          status: "ordered",
          requestedBy: "Lisa Müller",
          createdAt: "2024-01-10",
          expectedDelivery: "2024-01-30",
          priority: "low"
        }
      ])

      setSuppliers([
        {
          id: "1",
          name: "TechSupply GmbH",
          category: "IT Equipment",
          rating: 4.8,
          contactPerson: "Marcus Weber",
          email: "marcus.weber@techsupply.de",
          phone: "+49 30 123456",
          deliveryTime: 7,
          reliability: 96,
          totalOrders: 156,
          avgOrderValue: 12500
        },
        {
          id: "2",
          name: "OfficeMax Solutions",
          category: "Office Supplies",
          rating: 4.5,
          contactPerson: "Sandra Klein",
          email: "s.klein@officemax.de",
          phone: "+49 89 987654",
          deliveryTime: 3,
          reliability: 92,
          totalOrders: 89,
          avgOrderValue: 850
        },
        {
          id: "3",
          name: "Industrial Parts Ltd",
          category: "Manufacturing",
          rating: 4.2,
          contactPerson: "James Wilson",
          email: "j.wilson@industrialparts.com",
          phone: "+44 20 555123",
          deliveryTime: 14,
          reliability: 88,
          totalOrders: 234,
          avgOrderValue: 5600
        }
      ])

      setAnalytics({
        totalSpend: 450000,
        orderCount: 127,
        avgOrderValue: 3543,
        topCategory: "IT Equipment",
        savingsThisMonth: 15600
      })

      setLoading(false)
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "outline",
      pending: "secondary", 
      approved: "default",
      ordered: "default",
      delivered: "default",
      cancelled: "destructive"
    } as const
    
    const labels = {
      draft: "Entwurf",
      pending: "Ausstehend",
      approved: "Genehmigt",
      ordered: "Bestellt",
      delivered: "Geliefert",
      cancelled: "Storniert"
    }
    
    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "outline",
      medium: "secondary",
      high: "default", 
      urgent: "destructive"
    } as const
    
    const labels = {
      low: "Niedrig",
      medium: "Mittel",
      high: "Hoch",
      urgent: "Dringend"
    }
    
    return <Badge variant={variants[priority as keyof typeof variants]}>{labels[priority as keyof typeof labels]}</Badge>
  }

  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || order.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Sample chart data
  const spendingData = [
    { month: 'Aug', spending: 42000, orders: 18, savings: 2100 },
    { month: 'Sep', spending: 38000, orders: 22, savings: 2800 },
    { month: 'Okt', spending: 45000, orders: 19, savings: 1900 },
    { month: 'Nov', spending: 52000, orders: 25, savings: 3200 },
    { month: 'Dez', spending: 48000, orders: 21, savings: 2400 },
    { month: 'Jan', spending: 51000, orders: 28, savings: 3100 }
  ]

  const categorySpending = [
    { category: 'IT Equipment', amount: 125000, color: '#3B82F6' },
    { category: 'Office Supplies', amount: 35000, color: '#10B981' },
    { category: 'Manufacturing', amount: 89000, color: '#F59E0B' },
    { category: 'Facilities', amount: 42000, color: '#EF4444' },
    { category: 'Marketing', amount: 28000, color: '#8B5CF6' }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Beschaffung</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Beschaffung</h1>
          <p className="text-gray-600 mt-1">Einkauf, Lieferanten und Bestellverwaltung</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Neue Bestellung
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gesamtausgaben</p>
                <p className="text-2xl font-bold text-gray-900">€{analytics?.totalSpend.toLocaleString()}</p>
                <p className="text-xs text-green-600">+8% zum Vormonat</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bestellungen</p>
                <p className="text-2xl font-bold text-green-600">{analytics?.orderCount}</p>
                <p className="text-xs text-gray-500">Diesen Monat</p>
              </div>
              <Package className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ø Bestellwert</p>
                <p className="text-2xl font-bold text-purple-600">€{analytics?.avgOrderValue.toLocaleString()}</p>
                <p className="text-xs text-purple-600">+12% Effizienz</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Einsparungen</p>
                <p className="text-2xl font-bold text-orange-600">€{analytics?.savingsThisMonth.toLocaleString()}</p>
                <p className="text-xs text-orange-600">Diesen Monat</p>
              </div>
              <CheckCircle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ausgaben-Entwicklung</CardTitle>
            <CardDescription>Monatliche Ausgaben und Einsparungen</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={spendingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Betrag (€)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                />
                <Tooltip formatter={(value) => [`€${value?.toLocaleString()}`, '']} />
                <Bar dataKey="spending" fill="#3B82F6" name="Ausgaben" />
                <Bar dataKey="savings" fill="#10B981" name="Einsparungen" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ausgaben nach Kategorien</CardTitle>
            <CardDescription>Verteilung der Beschaffungskosten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categorySpending.map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: category.color }}></div>
                    <span className="font-medium text-gray-900">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">€{category.amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      {Math.round((category.amount / categorySpending.reduce((sum, c) => sum + c.amount, 0)) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Bestellungen</TabsTrigger>
          <TabsTrigger value="suppliers">Lieferanten</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="contracts">Verträge</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Bestellungen durchsuchen..."
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
                <SelectItem value="pending">Ausstehend</SelectItem>
                <SelectItem value="approved">Genehmigt</SelectItem>
                <SelectItem value="ordered">Bestellt</SelectItem>
                <SelectItem value="delivered">Geliefert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                        {getStatusBadge(order.status)}
                        {getPriorityBadge(order.priority)}
                        <Badge variant="outline" className="text-xs">{order.category}</Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{order.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Lieferant: </span>
                          <span className="font-medium">{order.supplier}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Menge: </span>
                          <span className="font-medium">{order.quantity} Stück</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Lieferung: </span>
                          <span className="font-medium">{new Date(order.expectedDelivery).toLocaleDateString('de-DE')}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Angefordert von {order.requestedBy} am {new Date(order.createdAt).toLocaleDateString('de-DE')}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xl font-bold text-gray-900">€{order.totalAmount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">€{order.unitPrice.toLocaleString()} / Stück</p>
                      <div className="flex space-x-2 mt-2">
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                        <Button size="sm">
                          Bearbeiten
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="grid gap-4">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>
                          {supplier.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                        <p className="text-sm text-gray-600">{supplier.category}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm font-medium">{supplier.rating}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {supplier.reliability}% Zuverlässigkeit
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {supplier.deliveryTime} Tage Lieferzeit
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                        <div>
                          <span className="text-gray-500">Bestellungen: </span>
                          <span className="font-medium">{supplier.totalOrders}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Ø Wert: </span>
                          <span className="font-medium">€{supplier.avgOrderValue.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Kontakt
                        </Button>
                        <Button size="sm">
                          Bestellen
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Beschaffungseffizienz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Durchlaufzeit</span>
                      <span>7.2 Tage</span>
                    </div>
                    <Progress value={78} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Lieferantentreue</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Kosteneinsparung</span>
                      <span>12%</span>
                    </div>
                    <Progress value={12} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Lieferanten</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suppliers.slice(0, 3).map((supplier, index) => (
                    <div key={supplier.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">{supplier.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">€{supplier.avgOrderValue.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monatstrends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Neue Lieferanten</span>
                    <span className="font-bold text-green-600">+3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Verhandlungen</span>
                    <span className="font-bold text-blue-600">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Verträge erneuert</span>
                    <span className="font-bold text-purple-600">5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vertragsmanagement</CardTitle>
              <CardDescription>
                Übersicht über Lieferantenverträge und Rahmenvereinbarungen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Vertragsmanagement wird vorbereitet</h3>
                <p className="text-gray-600">Umfassendes Vertragsmanagement-System wird in Kürze verfügbar sein</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
