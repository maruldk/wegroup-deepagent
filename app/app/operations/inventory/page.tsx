
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, AlertTriangle, TrendingUp, TrendingDown, Plus, Search, Filter } from 'lucide-react'

export default function OperationsInventoryPage() {
  const inventory = [
    {
      id: 1,
      name: 'Office Supplies',
      sku: 'OFF-001',
      category: 'Supplies',
      quantity: 150,
      lowStockThreshold: 50,
      status: 'in_stock',
      value: '€2,450',
      location: 'Warehouse A'
    },
    {
      id: 2,
      name: 'Laptop Computers',
      sku: 'LAP-002',
      category: 'Electronics',
      quantity: 25,
      lowStockThreshold: 30,
      status: 'low_stock',
      value: '€45,000',
      location: 'Warehouse B'
    },
    {
      id: 3,
      name: 'Safety Equipment',
      sku: 'SAF-003',
      category: 'Safety',
      quantity: 5,
      lowStockThreshold: 20,
      status: 'critical',
      value: '€1,200',
      location: 'Warehouse A'
    },
    {
      id: 4,
      name: 'Printer Paper',
      sku: 'PAP-004',
      category: 'Supplies',
      quantity: 200,
      lowStockThreshold: 100,
      status: 'in_stock',
      value: '€800',
      location: 'Warehouse C'
    }
  ]

  const stats = [
    { title: 'Total Items', value: '1,247', change: '+12%', icon: Package },
    { title: 'Low Stock Alerts', value: '23', change: '+5', icon: AlertTriangle },
    { title: 'Inventory Value', value: '€128,450', change: '+8%', icon: TrendingUp },
    { title: 'Categories', value: '18', change: '+2', icon: Filter }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800'
      case 'low_stock': return 'bg-yellow-100 text-yellow-800'
      case 'critical': return 'bg-red-100 text-red-800'
      case 'out_of_stock': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_stock': return 'In Stock'
      case 'low_stock': return 'Low Stock'
      case 'critical': return 'Critical'
      case 'out_of_stock': return 'Out of Stock'
      default: return 'Unknown'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track and manage your inventory levels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inventory List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Inventory Items
          </CardTitle>
          <CardDescription>
            Current inventory levels and stock status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-600 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">SKU: {item.sku} • {item.category}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span>Location: {item.location}</span>
                      <span>•</span>
                      <span>Value: {item.value}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900 mb-1">
                    {item.quantity}
                  </div>
                  <Badge className={getStatusColor(item.status)}>
                    {getStatusText(item.status)}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    Min: {item.lowStockThreshold}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <h3 className="font-semibold">Low Stock Alerts</h3>
                <p className="text-sm text-gray-600">View items that need restocking</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold">Inventory Reports</h3>
                <p className="text-sm text-gray-600">Generate inventory analytics</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Stock Movements</h3>
                <p className="text-sm text-gray-600">Track inventory transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
