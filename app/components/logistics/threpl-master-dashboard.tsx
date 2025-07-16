
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Truck, 
  Package, 
  TrendingUp, 
  Brain, 
  MapPin, 
  AlertTriangle,
  Clock,
  Zap,
  BarChart3,
  Activity,
  Settings,
  CheckCircle,
  Route,
  Users,
  Building,
  ShoppingCart,
  FileText,
  Search,
  Bell,
  Filter,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Award,
  Shield,
  Globe,
  Layers,
  Database,
  Cpu,
  Workflow
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from 'recharts';

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3', '#A19AD3', '#72BF78', '#FFB366'];

interface ThreePLMetrics {
  totalRequests: number;
  pendingRequests: number;
  quotedRequests: number;
  orderedRequests: number;
  inTransitRequests: number;
  deliveredRequests: number;
  totalSuppliers: number;
  activeSuppliers: number;
  totalCustomers: number;
  averageQuoteResponseTime: number;
  quotesToOrdersRatio: number;
  onTimeDeliveryRate: number;
  aiOptimizedRequests: number;
  workflowAutomationRate: number;
  totalQuoteValue: number;
  totalOrderValue: number;
  averageQuoteValue: number;
  supplierPerformance: number;
  customerSatisfaction: number;
  costSavings: number;
  revenueGrowth: number;
}

export function ThreePLMasterDashboard() {
  const [metrics, setMetrics] = useState<ThreePLMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState('wetzlar');
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [supplierPerformance, setSupplierPerformance] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [transportTypeDistribution, setTransportTypeDistribution] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedTenant]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data based on selected tenant
      const mockMetrics: ThreePLMetrics = {
        totalRequests: selectedTenant === 'wetzlar' ? 1247 : 892,
        pendingRequests: selectedTenant === 'wetzlar' ? 23 : 15,
        quotedRequests: selectedTenant === 'wetzlar' ? 89 : 67,
        orderedRequests: selectedTenant === 'wetzlar' ? 156 : 123,
        inTransitRequests: selectedTenant === 'wetzlar' ? 234 : 189,
        deliveredRequests: selectedTenant === 'wetzlar' ? 745 : 498,
        totalSuppliers: selectedTenant === 'wetzlar' ? 127 : 89,
        activeSuppliers: selectedTenant === 'wetzlar' ? 98 : 76,
        totalCustomers: selectedTenant === 'wetzlar' ? 89 : 67,
        averageQuoteResponseTime: selectedTenant === 'wetzlar' ? 4.2 : 3.8,
        quotesToOrdersRatio: selectedTenant === 'wetzlar' ? 0.76 : 0.82,
        onTimeDeliveryRate: selectedTenant === 'wetzlar' ? 0.94 : 0.91,
        aiOptimizedRequests: selectedTenant === 'wetzlar' ? 892 : 634,
        workflowAutomationRate: selectedTenant === 'wetzlar' ? 0.88 : 0.85,
        totalQuoteValue: selectedTenant === 'wetzlar' ? 2845672 : 1923456,
        totalOrderValue: selectedTenant === 'wetzlar' ? 2165432 : 1576834,
        averageQuoteValue: selectedTenant === 'wetzlar' ? 2280 : 2156,
        supplierPerformance: selectedTenant === 'wetzlar' ? 0.92 : 0.89,
        customerSatisfaction: selectedTenant === 'wetzlar' ? 0.96 : 0.93,
        costSavings: selectedTenant === 'wetzlar' ? 284567 : 192345,
        revenueGrowth: selectedTenant === 'wetzlar' ? 0.18 : 0.15
      };

      setMetrics(mockMetrics);
      
      // Mock recent activities
      setRecentActivities([
        { id: 1, type: 'TRANSPORT_REQUEST', action: 'CREATED', description: 'New transport request road-2025-0156', timestamp: '2025-01-14T10:30:00Z', user: 'Max Mustermann' },
        { id: 2, type: 'QUOTE', action: 'RECEIVED', description: 'Quote from Spedition Schmidt GmbH', timestamp: '2025-01-14T10:25:00Z', user: 'Spedition Schmidt' },
        { id: 3, type: 'ORDER', action: 'CONFIRMED', description: 'Order ORD-2025-0234 confirmed', timestamp: '2025-01-14T10:20:00Z', user: 'System' },
        { id: 4, type: 'DELIVERY', action: 'COMPLETED', description: 'Delivery completed for road-2025-0145', timestamp: '2025-01-14T10:15:00Z', user: 'Logistics Partner' },
        { id: 5, type: 'WORKFLOW', action: 'AUTOMATED', description: 'AI workflow processed 12 requests', timestamp: '2025-01-14T10:10:00Z', user: 'AI System' }
      ]);

      // Mock supplier performance
      setSupplierPerformance([
        { name: 'Spedition Schmidt', rating: 4.8, reliability: 0.95, responseTime: 2.1, quotesCount: 45 },
        { name: 'Trans Europa GmbH', rating: 4.6, reliability: 0.92, responseTime: 3.2, quotesCount: 38 },
        { name: 'Logistics Pro', rating: 4.5, reliability: 0.89, responseTime: 4.1, quotesCount: 34 },
        { name: 'Fast Freight', rating: 4.3, reliability: 0.87, responseTime: 3.8, quotesCount: 29 },
        { name: 'Cargo Express', rating: 4.1, reliability: 0.85, responseTime: 4.5, quotesCount: 27 }
      ]);

      // Mock trend data
      setTrendData([
        { date: '2025-01-07', requests: 45, orders: 34, revenue: 89500 },
        { date: '2025-01-08', requests: 52, orders: 41, revenue: 102300 },
        { date: '2025-01-09', requests: 48, orders: 38, revenue: 94800 },
        { date: '2025-01-10', requests: 59, orders: 47, revenue: 118500 },
        { date: '2025-01-11', requests: 44, orders: 35, revenue: 87200 },
        { date: '2025-01-12', requests: 51, orders: 42, revenue: 105600 },
        { date: '2025-01-13', requests: 56, orders: 43, revenue: 108900 },
        { date: '2025-01-14', requests: 41, orders: 32, revenue: 81200 }
      ]);

      // Mock transport type distribution
      setTransportTypeDistribution([
        { type: 'ROAD', count: 789, percentage: 63.2 },
        { type: 'AIR', count: 234, percentage: 18.7 },
        { type: 'SEA', count: 156, percentage: 12.5 },
        { type: 'RAIL', count: 68, percentage: 5.6 }
      ]);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading 3PL Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">3PL Master Dashboard</h1>
          <p className="text-gray-600">Complete logistics management and orchestration</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="wetzlar">Wetzlar Industry Solutions</option>
            <option value="wfs">WFS Fulfillment Solutions</option>
          </select>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Requests</p>
                  <p className="text-3xl font-bold">{metrics?.totalRequests.toLocaleString()}</p>
                  <p className="text-blue-100 text-sm">
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                    +{metrics?.revenueGrowth ? Math.round(metrics.revenueGrowth * 100) : 0}% vs last month
                  </p>
                </div>
                <Package className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Active Suppliers</p>
                  <p className="text-3xl font-bold">{metrics?.activeSuppliers}</p>
                  <p className="text-green-100 text-sm">
                    <Users className="inline h-4 w-4 mr-1" />
                    {metrics?.totalSuppliers} total suppliers
                  </p>
                </div>
                <Building className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">AI Automation Rate</p>
                  <p className="text-3xl font-bold">{metrics?.workflowAutomationRate ? Math.round(metrics.workflowAutomationRate * 100) : 0}%</p>
                  <p className="text-purple-100 text-sm">
                    <Brain className="inline h-4 w-4 mr-1" />
                    {metrics?.aiOptimizedRequests} AI-optimized
                  </p>
                </div>
                <Workflow className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">On-Time Delivery</p>
                  <p className="text-3xl font-bold">{metrics?.onTimeDeliveryRate ? Math.round(metrics.onTimeDeliveryRate * 100) : 0}%</p>
                  <p className="text-orange-100 text-sm">
                    <Clock className="inline h-4 w-4 mr-1" />
                    {metrics?.averageQuoteResponseTime}h avg response
                  </p>
                </div>
                <Target className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="operations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="intelligence">AI Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Request Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Request Status Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Pending</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{metrics?.pendingRequests}</span>
                      <Badge variant="outline">{metrics?.totalRequests ? Math.round((metrics.pendingRequests / metrics.totalRequests) * 100) : 0}%</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Quoted</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{metrics?.quotedRequests}</span>
                      <Badge variant="outline">{metrics?.totalRequests ? Math.round((metrics.quotedRequests / metrics.totalRequests) * 100) : 0}%</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Ordered</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{metrics?.orderedRequests}</span>
                      <Badge variant="outline">{metrics?.totalRequests ? Math.round((metrics.orderedRequests / metrics.totalRequests) * 100) : 0}%</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">In Transit</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{metrics?.inTransitRequests}</span>
                      <Badge variant="outline">{metrics?.totalRequests ? Math.round((metrics.inTransitRequests / metrics.totalRequests) * 100) : 0}%</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Delivered</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{metrics?.deliveredRequests}</span>
                      <Badge variant="outline">{metrics?.totalRequests ? Math.round((metrics.deliveredRequests / metrics.totalRequests) * 100) : 0}%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transport Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Transport Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={transportTypeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {transportTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Requests']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {transportTypeDistribution.map((item, index) => (
                    <div key={item.type} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                      <span className="text-sm">{item.type}</span>
                      <span className="text-sm font-medium">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'TRANSPORT_REQUEST' ? 'bg-blue-100' :
                        activity.type === 'QUOTE' ? 'bg-green-100' :
                        activity.type === 'ORDER' ? 'bg-purple-100' :
                        activity.type === 'DELIVERY' ? 'bg-orange-100' :
                        'bg-gray-100'
                      }`}>
                        {activity.type === 'TRANSPORT_REQUEST' && <Package className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'QUOTE' && <FileText className="h-4 w-4 text-green-600" />}
                        {activity.type === 'ORDER' && <ShoppingCart className="h-4 w-4 text-purple-600" />}
                        {activity.type === 'DELIVERY' && <CheckCircle className="h-4 w-4 text-orange-600" />}
                        {activity.type === 'WORKFLOW' && <Workflow className="h-4 w-4 text-gray-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Supplier Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Top Supplier Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supplierPerformance.map((supplier, index) => (
                    <div key={supplier.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{supplier.name}</p>
                          <p className="text-sm text-gray-500">{supplier.quotesCount} quotes</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">Rating:</span>
                          <Badge variant="secondary">{supplier.rating}</Badge>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm">Reliability:</span>
                          <Badge variant="outline">{Math.round(supplier.reliability * 100)}%</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Supplier Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Supplier Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Portal Adoption</span>
                      <span className="text-sm text-gray-500">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Average Response Time</span>
                      <span className="text-sm text-gray-500">{metrics?.averageQuoteResponseTime}h</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Quality Score</span>
                      <span className="text-sm text-gray-500">{metrics?.supplierPerformance ? Math.round(metrics.supplierPerformance * 100) : 0}%</span>
                    </div>
                    <Progress value={metrics?.supplierPerformance ? Math.round(metrics.supplierPerformance * 100) : 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Contract Compliance</span>
                      <span className="text-sm text-gray-500">96%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Satisfaction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Customer Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {metrics?.customerSatisfaction ? Math.round(metrics.customerSatisfaction * 100) : 0}%
                  </div>
                  <p className="text-sm text-gray-500">Overall satisfaction rate</p>
                  <div className="mt-4">
                    <Progress value={metrics?.customerSatisfaction ? Math.round(metrics.customerSatisfaction * 100) : 0} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Customer Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Customers</span>
                    <span className="font-medium">{metrics?.totalCustomers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Portal Users</span>
                    <span className="font-medium">{metrics?.totalCustomers ? Math.round(metrics.totalCustomers * 0.85) : 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Repeat Customers</span>
                    <span className="font-medium">{metrics?.totalCustomers ? Math.round(metrics.totalCustomers * 0.76) : 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Order Value</span>
                    <span className="font-medium">€{metrics?.averageQuoteValue?.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Revenue Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    +{metrics?.revenueGrowth ? Math.round(metrics.revenueGrowth * 100) : 0}%
                  </div>
                  <p className="text-sm text-gray-500">Month-over-month</p>
                  <div className="mt-4">
                    <p className="text-sm">Total Revenue</p>
                    <p className="text-lg font-semibold">€{metrics?.totalOrderValue?.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Request & Revenue Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Request & Revenue Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="requests" stroke="#60B5FF" strokeWidth={2} />
                  <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#FF9149" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#72BF78" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Quote-to-Order Ratio</span>
                      <span className="text-sm text-gray-500">{metrics?.quotesToOrdersRatio ? Math.round(metrics.quotesToOrdersRatio * 100) : 0}%</span>
                    </div>
                    <Progress value={metrics?.quotesToOrdersRatio ? Math.round(metrics.quotesToOrdersRatio * 100) : 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">On-Time Delivery</span>
                      <span className="text-sm text-gray-500">{metrics?.onTimeDeliveryRate ? Math.round(metrics.onTimeDeliveryRate * 100) : 0}%</span>
                    </div>
                    <Progress value={metrics?.onTimeDeliveryRate ? Math.round(metrics.onTimeDeliveryRate * 100) : 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Customer Retention</span>
                      <span className="text-sm text-gray-500">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Cost Efficiency</span>
                      <span className="text-sm text-gray-500">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Total Quote Value</span>
                    <span className="font-semibold">€{metrics?.totalQuoteValue?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Total Order Value</span>
                    <span className="font-semibold">€{metrics?.totalOrderValue?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Cost Savings</span>
                    <span className="font-semibold text-green-600">€{metrics?.costSavings?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Average Quote Value</span>
                    <span className="font-semibold text-blue-600">€{metrics?.averageQuoteValue?.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Workflow Automation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Workflow className="h-5 w-5 mr-2" />
                  Workflow Automation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {metrics?.workflowAutomationRate ? Math.round(metrics.workflowAutomationRate * 100) : 0}%
                  </div>
                  <p className="text-sm text-gray-500">Automated processes</p>
                  <div className="mt-4">
                    <Progress value={metrics?.workflowAutomationRate ? Math.round(metrics.workflowAutomationRate * 100) : 0} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Process Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Process Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Auto Quote Collection</span>
                    <Badge variant="secondary">95%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Order Processing</span>
                    <Badge variant="secondary">88%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Document Generation</span>
                    <Badge variant="secondary">92%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Status Updates</span>
                    <Badge variant="secondary">97%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workflow Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Workflow Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Workflows</span>
                    <span className="font-medium">234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completed Today</span>
                    <span className="font-medium">89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Process Time</span>
                    <span className="font-medium">2.3h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Success Rate</span>
                    <span className="font-medium">98.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Route Optimization</span>
                      <span className="text-sm text-gray-500">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Cost Prediction</span>
                      <span className="text-sm text-gray-500">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Supplier Matching</span>
                      <span className="text-sm text-gray-500">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Risk Assessment</span>
                      <span className="text-sm text-gray-500">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Predictive Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="h-5 w-5 mr-2" />
                  Predictive Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Demand Forecast</p>
                        <p className="text-xs text-gray-500">Next 30 days</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-blue-600">+15%</p>
                        <p className="text-xs text-gray-500">Confidence: 89%</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Cost Optimization</p>
                        <p className="text-xs text-gray-500">Potential savings</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">€45,230</p>
                        <p className="text-xs text-gray-500">Confidence: 92%</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Risk Alert</p>
                        <p className="text-xs text-gray-500">High-risk routes</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-orange-600">3</p>
                        <p className="text-xs text-gray-500">Needs attention</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
