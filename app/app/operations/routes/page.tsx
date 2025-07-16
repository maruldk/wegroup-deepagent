
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Route, MapPin, Clock, Truck, TrendingUp, Plus, Navigation, Target } from 'lucide-react'

export default function OperationsRoutesPage() {
  const routes = [
    {
      id: 1,
      name: 'Berlin to Hamburg',
      distance: '289 km',
      duration: '3h 45m',
      status: 'active',
      driver: 'Hans Schmidt',
      vehicle: 'DE-B-1234',
      efficiency: 94,
      fuelCost: '€45.20'
    },
    {
      id: 2,
      name: 'Munich to Frankfurt',
      distance: '393 km',
      duration: '4h 20m',
      status: 'completed',
      driver: 'Anna Weber',
      vehicle: 'DE-M-5678',
      efficiency: 89,
      fuelCost: '€62.80'
    },
    {
      id: 3,
      name: 'Cologne to Stuttgart',
      distance: '435 km',
      duration: '4h 50m',
      status: 'planned',
      driver: 'Klaus Müller',
      vehicle: 'DE-K-9012',
      efficiency: 92,
      fuelCost: '€68.50'
    },
    {
      id: 4,
      name: 'Dresden to Leipzig',
      distance: '115 km',
      duration: '1h 30m',
      status: 'active',
      driver: 'Maria Fischer',
      vehicle: 'DE-DD-3456',
      efficiency: 96,
      fuelCost: '€18.90'
    }
  ]

  const stats = [
    { title: 'Active Routes', value: '28', change: '+3', icon: Route },
    { title: 'Total Distance', value: '12,547 km', change: '+8%', icon: Navigation },
    { title: 'Efficiency Rate', value: '93.2%', change: '+1.5%', icon: TrendingUp },
    { title: 'Fuel Savings', value: '€1,247', change: '+15%', icon: Target }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'planned': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return 'text-green-600'
    if (efficiency >= 90) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Route Management</h1>
          <p className="text-gray-600">Optimize and manage your delivery routes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MapPin className="w-4 h-4 mr-2" />
            Map View
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Route
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
                <span className="text-green-600">{stat.change}</span> from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Routes List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="w-5 h-5" />
            Current Routes
          </CardTitle>
          <CardDescription>
            Active and planned delivery routes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routes.map((route) => (
              <div key={route.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Route className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{route.name}</h3>
                    <p className="text-sm text-gray-600">{route.driver} • {route.vehicle}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        {route.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {route.duration}
                      </span>
                      <span>Fuel: {route.fuelCost}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getEfficiencyColor(route.efficiency)} mb-1`}>
                    {route.efficiency}%
                  </div>
                  <Badge className={getStatusColor(route.status)}>
                    {route.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">Efficiency</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Route Optimization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Route Optimization</CardTitle>
            <CardDescription>AI-powered route suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Fuel Efficiency</span>
                <Badge className="bg-green-100 text-green-800">+15%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Time Savings</span>
                <Badge className="bg-blue-100 text-blue-800">-22 min</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Distance Reduction</span>
                <Badge className="bg-purple-100 text-purple-800">-8.5 km</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Route management tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="w-4 h-4 mr-2" />
                Real-time Tracking
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                Performance Analysis
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="w-4 h-4 mr-2" />
                Route Optimization
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
