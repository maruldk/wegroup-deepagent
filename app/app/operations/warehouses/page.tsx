
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Warehouse, MapPin, Package, Users, TrendingUp, Activity, Plus, Settings } from 'lucide-react'

export default function OperationsWarehousesPage() {
  const warehouses = [
    {
      id: 1,
      name: 'Berlin Distribution Center',
      location: 'Berlin, Germany',
      capacity: 10000,
      occupied: 8500,
      utilization: 85,
      status: 'operational',
      manager: 'Hans Schmidt',
      employees: 45,
      totalItems: 12547
    },
    {
      id: 2,
      name: 'Munich Logistics Hub',
      location: 'Munich, Germany',
      capacity: 15000,
      occupied: 12000,
      utilization: 80,
      status: 'operational',
      manager: 'Anna Weber',
      employees: 62,
      totalItems: 18293
    },
    {
      id: 3,
      name: 'Hamburg Storage Facility',
      location: 'Hamburg, Germany',
      capacity: 8000,
      occupied: 7200,
      utilization: 90,
      status: 'maintenance',
      manager: 'Klaus Müller',
      employees: 38,
      totalItems: 9876
    },
    {
      id: 4,
      name: 'Frankfurt Distribution',
      location: 'Frankfurt, Germany',
      capacity: 12000,
      occupied: 9600,
      utilization: 80,
      status: 'operational',
      manager: 'Maria Fischer',
      employees: 52,
      totalItems: 15432
    }
  ]

  const stats = [
    { title: 'Total Warehouses', value: '12', change: '+2', icon: Warehouse },
    { title: 'Total Capacity', value: '145,000 m²', change: '+8%', icon: Package },
    { title: 'Utilization Rate', value: '83.5%', change: '+1.2%', icon: TrendingUp },
    { title: 'Total Employees', value: '427', change: '+15', icon: Users }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'closed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600'
    if (utilization >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Warehouse Management</h1>
          <p className="text-gray-600">Monitor and manage your warehouse operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Warehouse
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

      {/* Warehouses List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="w-5 h-5" />
            Warehouse Overview
          </CardTitle>
          <CardDescription>
            Current status and performance of all warehouses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {warehouses.map((warehouse) => (
              <div key={warehouse.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-600 rounded-full flex items-center justify-center">
                    <Warehouse className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{warehouse.name}</h3>
                    <p className="text-sm text-gray-600">Manager: {warehouse.manager}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {warehouse.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {warehouse.employees} employees
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {warehouse.totalItems.toLocaleString()} items
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getUtilizationColor(warehouse.utilization)} mb-1`}>
                    {warehouse.utilization}%
                  </div>
                  <Badge className={getStatusColor(warehouse.status)}>
                    {warehouse.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {warehouse.occupied.toLocaleString()} / {warehouse.capacity.toLocaleString()} m²
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Warehouse Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Real-time Monitoring</h3>
                <p className="text-sm text-gray-600">Track warehouse activities live</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold">Performance Analytics</h3>
                <p className="text-sm text-gray-600">Analyze warehouse efficiency</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="font-semibold">Inventory Management</h3>
                <p className="text-sm text-gray-600">Manage stock across warehouses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
