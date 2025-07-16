
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  TrendingUp, 
  Clock, 
  Euro, 
  MapPin, 
  CheckCircle, 
  AlertTriangle,
  Truck,
  FileText,
  Calendar,
  Activity,
  BarChart3,
  Target,
  Star,
  User,
  Building,
  Phone,
  Mail,
  Globe,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Timer,
  Award,
  Shield,
  Zap,
  Bell,
  Route,
  Navigation
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
  Cell
} from 'recharts';

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3', '#A19AD3'];

interface CustomerMetrics {
  totalRequests: number;
  pendingRequests: number;
  inTransitShipments: number;
  deliveredShipments: number;
  totalSpent: number;
  averageOrderValue: number;
  onTimeDeliveryRate: number;
  customerSatisfaction: number;
  totalSavings: number;
  activeShipments: number;
  monthlyGrowth: number;
  preferredSuppliers: number;
}

interface ActiveShipment {
  id: string;
  requestNumber: string;
  cargoType: string;
  status: 'ORDERED' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  pickupLocation: string;
  deliveryLocation: string;
  estimatedDelivery: Date;
  progress: number;
  supplier: string;
  trackingNumber: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface RecentActivity {
  id: string;
  type: 'REQUEST_CREATED' | 'QUOTE_RECEIVED' | 'ORDER_PLACED' | 'SHIPMENT_PICKED' | 'DELIVERY_COMPLETED';
  description: string;
  timestamp: Date;
  requestNumber: string;
  amount?: number;
  status: 'SUCCESS' | 'PENDING' | 'WARNING';
}

export function CustomerPortalDashboard() {
  const [metrics, setMetrics] = useState<CustomerMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeShipments, setActiveShipments] = useState<ActiveShipment[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [costData, setCostData] = useState<any[]>([]);
  const [transportTypeData, setTransportTypeData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMetrics: CustomerMetrics = {
        totalRequests: 342,
        pendingRequests: 12,
        inTransitShipments: 28,
        deliveredShipments: 287,
        totalSpent: 1456789,
        averageOrderValue: 4256,
        onTimeDeliveryRate: 0.96,
        customerSatisfaction: 4.8,
        totalSavings: 89456,
        activeShipments: 28,
        monthlyGrowth: 0.12,
        preferredSuppliers: 15
      };

      setMetrics(mockMetrics);

      // Mock active shipments
      setActiveShipments([
        {
          id: 'ship-001',
          requestNumber: 'road-2025-0234',
          cargoType: 'Industrial Equipment',
          status: 'IN_TRANSIT',
          pickupLocation: 'Frankfurt, Germany',
          deliveryLocation: 'Munich, Germany',
          estimatedDelivery: new Date(Date.now() + 8 * 60 * 60 * 1000),
          progress: 75,
          supplier: 'Trans Europa GmbH',
          trackingNumber: 'TRK-2025-0234',
          riskLevel: 'LOW'
        },
        {
          id: 'ship-002',
          requestNumber: 'air-2025-0089',
          cargoType: 'Electronics',
          status: 'PICKED_UP',
          pickupLocation: 'Hamburg, Germany',
          deliveryLocation: 'Berlin, Germany',
          estimatedDelivery: new Date(Date.now() + 4 * 60 * 60 * 1000),
          progress: 25,
          supplier: 'Fast Freight Express',
          trackingNumber: 'TRK-2025-0089',
          riskLevel: 'MEDIUM'
        },
        {
          id: 'ship-003',
          requestNumber: 'road-2025-0198',
          cargoType: 'Automotive Parts',
          status: 'OUT_FOR_DELIVERY',
          pickupLocation: 'Stuttgart, Germany',
          deliveryLocation: 'Cologne, Germany',
          estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000),
          progress: 90,
          supplier: 'Spedition Schmidt',
          trackingNumber: 'TRK-2025-0198',
          riskLevel: 'LOW'
        }
      ]);

      // Mock recent activities
      setRecentActivities([
        {
          id: 'act-001',
          type: 'DELIVERY_COMPLETED',
          description: 'Shipment delivered successfully',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          requestNumber: 'road-2025-0156',
          amount: 3450,
          status: 'SUCCESS'
        },
        {
          id: 'act-002',
          type: 'SHIPMENT_PICKED',
          description: 'Cargo picked up from origin',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          requestNumber: 'road-2025-0234',
          status: 'SUCCESS'
        },
        {
          id: 'act-003',
          type: 'ORDER_PLACED',
          description: 'Order confirmed with supplier',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          requestNumber: 'air-2025-0089',
          amount: 5670,
          status: 'SUCCESS'
        },
        {
          id: 'act-004',
          type: 'QUOTE_RECEIVED',
          description: 'Quote received from multiple suppliers',
          timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
          requestNumber: 'road-2025-0245',
          status: 'PENDING'
        },
        {
          id: 'act-005',
          type: 'REQUEST_CREATED',
          description: 'New transport request submitted',
          timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000),
          requestNumber: 'sea-2025-0012',
          status: 'PENDING'
        }
      ]);

      // Mock performance data
      setPerformanceData([
        { month: 'Jan', requests: 28, onTime: 94, satisfaction: 4.6 },
        { month: 'Feb', requests: 32, onTime: 96, satisfaction: 4.7 },
        { month: 'Mar', requests: 29, onTime: 95, satisfaction: 4.5 },
        { month: 'Apr', requests: 35, onTime: 97, satisfaction: 4.8 },
        { month: 'May', requests: 42, onTime: 96, satisfaction: 4.9 },
        { month: 'Jun', requests: 38, onTime: 96, satisfaction: 4.8 }
      ]);

      // Mock cost data
      setCostData([
        { month: 'Jan', spent: 89500, saved: 6200 },
        { month: 'Feb', spent: 102300, saved: 7400 },
        { month: 'Mar', spent: 94800, saved: 5800 },
        { month: 'Apr', spent: 118500, saved: 8900 },
        { month: 'May', spent: 134200, saved: 10200 },
        { month: 'Jun', spent: 125600, saved: 9400 }
      ]);

      // Mock transport type data
      setTransportTypeData([
        { type: 'Road', count: 198, percentage: 58 },
        { type: 'Air', count: 89, percentage: 26 },
        { type: 'Sea', count: 34, percentage: 10 },
        { type: 'Rail', count: 21, percentage: 6 }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ORDERED': return 'bg-blue-100 text-blue-800';
      case 'PICKED_UP': return 'bg-purple-100 text-purple-800';
      case 'IN_TRANSIT': return 'bg-orange-100 text-orange-800';
      case 'OUT_FOR_DELIVERY': return 'bg-yellow-100 text-yellow-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'HIGH': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'REQUEST_CREATED': return <Plus className="h-4 w-4 text-blue-600" />;
      case 'QUOTE_RECEIVED': return <FileText className="h-4 w-4 text-purple-600" />;
      case 'ORDER_PLACED': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'SHIPMENT_PICKED': return <Package className="h-4 w-4 text-orange-600" />;
      case 'DELIVERY_COMPLETED': return <Truck className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-green-50 border-green-200';
      case 'PENDING': return 'bg-yellow-50 border-yellow-200';
      case 'WARNING': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customer dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Portal</h1>
          <p className="text-gray-600">Welcome back! Here's your logistics overview</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={fetchDashboardData} variant="outline" size="sm">
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
                  <p className="text-3xl font-bold">{metrics?.totalRequests}</p>
                  <p className="text-blue-100 text-sm">
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                    +{metrics?.monthlyGrowth ? Math.round(metrics.monthlyGrowth * 100) : 0}% vs last month
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
                  <p className="text-green-100 text-sm font-medium">On-Time Delivery</p>
                  <p className="text-3xl font-bold">{metrics?.onTimeDeliveryRate ? Math.round(metrics.onTimeDeliveryRate * 100) : 0}%</p>
                  <p className="text-green-100 text-sm">
                    <CheckCircle className="inline h-4 w-4 mr-1" />
                    Excellent performance
                  </p>
                </div>
                <Target className="h-12 w-12 text-green-200" />
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
                  <p className="text-purple-100 text-sm font-medium">Active Shipments</p>
                  <p className="text-3xl font-bold">{metrics?.activeShipments}</p>
                  <p className="text-purple-100 text-sm">
                    <Truck className="inline h-4 w-4 mr-1" />
                    Currently in transit
                  </p>
                </div>
                <Route className="h-12 w-12 text-purple-200" />
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
                  <p className="text-orange-100 text-sm font-medium">Total Savings</p>
                  <p className="text-3xl font-bold">€{(metrics?.totalSavings || 0).toLocaleString()}</p>
                  <p className="text-orange-100 text-sm">
                    <Euro className="inline h-4 w-4 mr-1" />
                    Cost optimized
                  </p>
                </div>
                <Award className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="requests" stroke="#60B5FF" strokeWidth={2} />
                    <Line type="monotone" dataKey="onTime" stroke="#FF9149" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Transport Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Transport Type Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={transportTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {transportTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {transportTypeData.map((item, index) => (
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
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${getActivityColor(activity.status)}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {activity.requestNumber} • {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {activity.amount && (
                        <p className="text-sm font-medium">€{activity.amount.toLocaleString()}</p>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Active Shipments</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {activeShipments.map((shipment) => (
              <Card key={shipment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{shipment.requestNumber}</CardTitle>
                      <p className="text-sm text-gray-600">{shipment.cargoType}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(shipment.status)}>
                        {shipment.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className={getRiskColor(shipment.riskLevel)}>
                        {shipment.riskLevel} Risk
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Pickup</p>
                          <p className="text-sm text-gray-600">{shipment.pickupLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Navigation className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Delivery</p>
                          <p className="text-sm text-gray-600">{shipment.deliveryLocation}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Supplier</p>
                        <p className="text-sm font-medium">{shipment.supplier}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tracking Number</p>
                        <p className="text-sm font-medium">{shipment.trackingNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Est. Delivery</p>
                        <p className="text-sm font-medium">
                          {shipment.estimatedDelivery.toLocaleDateString()} at {shipment.estimatedDelivery.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-gray-600">{shipment.progress}%</span>
                      </div>
                      <Progress value={shipment.progress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Track Shipment
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Documents
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Transport Requests</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Request Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Requests</span>
                  <span className="font-semibold">{metrics?.totalRequests}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-semibold text-yellow-600">{metrics?.pendingRequests}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Delivered</span>
                  <span className="font-semibold text-green-600">{metrics?.deliveredShipments}</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="text-sm font-medium">
                      {metrics?.totalRequests ? Math.round(((metrics.deliveredShipments || 0) / metrics.totalRequests) * 100) : 0}%
                    </span>
                  </div>
                  <Progress value={metrics?.totalRequests ? ((metrics.deliveredShipments || 0) / metrics.totalRequests) * 100 : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Spent</span>
                  <span className="font-semibold">€{(metrics?.totalSpent || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Order</span>
                  <span className="font-semibold">€{(metrics?.averageOrderValue || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Savings</span>
                  <span className="font-semibold text-green-600">€{(metrics?.totalSavings || 0).toLocaleString()}</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Savings Rate</span>
                    <span className="text-sm font-medium">
                      {metrics?.totalSpent ? Math.round(((metrics.totalSavings || 0) / metrics.totalSpent) * 100) : 0}%
                    </span>
                  </div>
                  <Progress value={metrics?.totalSpent ? ((metrics.totalSavings || 0) / metrics.totalSpent) * 100 : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Service Quality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">On-Time Delivery</span>
                  <span className="font-semibold">{metrics?.onTimeDeliveryRate ? Math.round(metrics.onTimeDeliveryRate * 100) : 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Satisfaction</span>
                  <span className="font-semibold">{metrics?.customerSatisfaction}/5.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Preferred Suppliers</span>
                  <span className="font-semibold">{metrics?.preferredSuppliers}</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Service Level</span>
                    <span className="text-sm font-medium">Excellent</span>
                  </div>
                  <Progress value={metrics?.onTimeDeliveryRate ? metrics.onTimeDeliveryRate * 100 : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Euro className="h-5 w-5 mr-2" />
                  Cost Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={costData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="spent" stackId="1" stroke="#60B5FF" fill="#60B5FF" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="saved" stackId="2" stroke="#72BF78" fill="#72BF78" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Satisfaction Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Customer Satisfaction Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[4, 5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="satisfaction" stroke="#FF9149" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Analytics Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-green-600">Performance Highlights</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">96% on-time delivery rate</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">4.8/5.0 customer satisfaction</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">€89K in cost savings</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">12% monthly growth</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-blue-600">Optimization Opportunities</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Consolidate shipments for better rates</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Explore air freight alternatives</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Increase use of preferred suppliers</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Implement predictive shipping</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Company Name</label>
                  <p className="text-sm text-gray-900">Manufacturing Excellence GmbH</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Customer Code</label>
                  <p className="text-sm text-gray-900">CUST-ME-001</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Industry</label>
                  <p className="text-sm text-gray-900">Manufacturing & Industrial</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <p className="text-sm text-gray-900">Industriestraße 123, 60325 Frankfurt am Main</p>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Information
                </Button>
              </CardContent>
            </Card>

            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Contact Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Primary Contact</label>
                  <p className="text-sm text-gray-900">Anna Müller</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">a.mueller@manufacturing-excellence.de</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">+49 69 987654321</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Department</label>
                  <p className="text-sm text-gray-900">Logistics & Supply Chain</p>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Update Contact
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Portal Access Level</label>
                    <p className="text-sm text-gray-900">Premium Access</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Credit Limit</label>
                    <p className="text-sm text-gray-900">€500,000</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Payment Terms</label>
                    <p className="text-sm text-gray-900">Net 30 days</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Notifications</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">Email</Badge>
                      <Badge variant="outline">SMS</Badge>
                      <Badge variant="outline">Portal</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Preferred Suppliers</label>
                    <p className="text-sm text-gray-900">{metrics?.preferredSuppliers} active partnerships</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Auto-approval Limit</label>
                    <p className="text-sm text-gray-900">€10,000 per request</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
