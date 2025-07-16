
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  TrendingUp, 
  Award, 
  Clock, 
  Euro, 
  Target, 
  BarChart3,
  FileText,
  AlertTriangle,
  CheckCircle,
  Timer,
  Users,
  Package,
  Truck,
  Star,
  Calendar,
  DollarSign,
  Activity,
  Zap,
  Bell,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Edit,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown
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

interface SupplierMetrics {
  totalQuotes: number;
  selectedQuotes: number;
  winRate: number;
  averageResponseTime: number;
  totalQuoteValue: number;
  wonQuoteValue: number;
  activeTenders: number;
  rating: number;
  reliabilityScore: number;
  aiPerformanceScore: number;
}

interface TenderOpportunity {
  id: string;
  title: string;
  tenderNumber: string;
  estimatedValue: number;
  bidDeadline: Date;
  daysLeft: number;
  requirements: string[];
  status: 'OPEN' | 'CLOSING_SOON' | 'CLOSED';
}

interface RecentActivity {
  id: string;
  type: 'QUOTE_SUBMITTED' | 'QUOTE_WON' | 'QUOTE_LOST' | 'TENDER_RECEIVED' | 'PAYMENT_RECEIVED';
  description: string;
  timestamp: Date;
  amount?: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export function SupplierPortalDashboard() {
  const [metrics, setMetrics] = useState<SupplierMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [tenderOpportunities, setTenderOpportunities] = useState<TenderOpportunity[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [quoteData, setQuoteData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMetrics: SupplierMetrics = {
        totalQuotes: 156,
        selectedQuotes: 89,
        winRate: 57.1,
        averageResponseTime: 2.8,
        totalQuoteValue: 2456789,
        wonQuoteValue: 1402345,
        activeTenders: 12,
        rating: 4.7,
        reliabilityScore: 0.94,
        aiPerformanceScore: 0.89
      };

      setMetrics(mockMetrics);

      // Mock tender opportunities
      setTenderOpportunities([
        {
          id: 'tender-001',
          title: 'Regional Transport Services Q2',
          tenderNumber: 'TEN-2025-0045',
          estimatedValue: 450000,
          bidDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          daysLeft: 5,
          requirements: ['ISO 9001', 'SQAS Certificate', 'ADR License'],
          status: 'OPEN'
        },
        {
          id: 'tender-002',
          title: 'Automotive Parts Distribution',
          tenderNumber: 'TEN-2025-0046',
          estimatedValue: 125000,
          bidDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          daysLeft: 2,
          requirements: ['Temperature Control', 'GPS Tracking'],
          status: 'CLOSING_SOON'
        },
        {
          id: 'tender-003',
          title: 'Pharmaceutical Cold Chain',
          tenderNumber: 'TEN-2025-0047',
          estimatedValue: 780000,
          bidDeadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
          daysLeft: 8,
          requirements: ['GDP Certification', 'Validated Cold Chain'],
          status: 'OPEN'
        }
      ]);

      // Mock recent activities
      setRecentActivities([
        {
          id: 'act-001',
          type: 'QUOTE_WON',
          description: 'Quote selected for Transport Request road-2025-0234',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          amount: 3450,
          status: 'SUCCESS'
        },
        {
          id: 'act-002',
          type: 'TENDER_RECEIVED',
          description: 'New tender opportunity: Regional Transport Services Q2',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          status: 'PENDING'
        },
        {
          id: 'act-003',
          type: 'QUOTE_SUBMITTED',
          description: 'Quote submitted for Transport Request air-2025-0089',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          amount: 8900,
          status: 'PENDING'
        },
        {
          id: 'act-004',
          type: 'PAYMENT_RECEIVED',
          description: 'Payment received for Order ORD-2025-0156',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          amount: 5670,
          status: 'SUCCESS'
        },
        {
          id: 'act-005',
          type: 'QUOTE_LOST',
          description: 'Quote not selected for Transport Request road-2025-0198',
          timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
          status: 'FAILED'
        }
      ]);

      // Mock performance data
      setPerformanceData([
        { month: 'Jan', winRate: 52, responseTime: 3.2, quotes: 23 },
        { month: 'Feb', winRate: 55, responseTime: 3.0, quotes: 28 },
        { month: 'Mar', winRate: 48, responseTime: 2.8, quotes: 31 },
        { month: 'Apr', winRate: 61, responseTime: 2.5, quotes: 34 },
        { month: 'May', winRate: 59, responseTime: 2.6, quotes: 40 },
        { month: 'Jun', winRate: 57, responseTime: 2.8, quotes: 38 }
      ]);

      // Mock quote data
      setQuoteData([
        { status: 'Won', count: 89, value: 1402345 },
        { status: 'Lost', count: 45, value: 678900 },
        { status: 'Pending', count: 22, value: 375544 }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-100 text-green-800';
      case 'CLOSING_SOON': return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'QUOTE_WON': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'QUOTE_LOST': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'QUOTE_SUBMITTED': return <FileText className="h-4 w-4 text-blue-600" />;
      case 'TENDER_RECEIVED': return <Bell className="h-4 w-4 text-purple-600" />;
      case 'PAYMENT_RECEIVED': return <Euro className="h-4 w-4 text-green-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-green-50 border-green-200';
      case 'PENDING': return 'bg-yellow-50 border-yellow-200';
      case 'FAILED': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading supplier dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supplier Portal</h1>
          <p className="text-gray-600">Welcome back! Here's your performance overview</p>
        </div>
        <div className="flex items-center space-x-4">
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
                  <p className="text-blue-100 text-sm font-medium">Win Rate</p>
                  <p className="text-3xl font-bold">{metrics?.winRate}%</p>
                  <p className="text-blue-100 text-sm">
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                    {metrics?.selectedQuotes} of {metrics?.totalQuotes} quotes
                  </p>
                </div>
                <Target className="h-12 w-12 text-blue-200" />
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
                  <p className="text-green-100 text-sm font-medium">Won Quote Value</p>
                  <p className="text-3xl font-bold">€{(metrics?.wonQuoteValue || 0).toLocaleString()}</p>
                  <p className="text-green-100 text-sm">
                    <Euro className="inline h-4 w-4 mr-1" />
                    Revenue this month
                  </p>
                </div>
                <DollarSign className="h-12 w-12 text-green-200" />
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
                  <p className="text-purple-100 text-sm font-medium">Response Time</p>
                  <p className="text-3xl font-bold">{metrics?.averageResponseTime}h</p>
                  <p className="text-purple-100 text-sm">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Average response time
                  </p>
                </div>
                <Timer className="h-12 w-12 text-purple-200" />
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
                  <p className="text-orange-100 text-sm font-medium">Supplier Rating</p>
                  <p className="text-3xl font-bold">{metrics?.rating}</p>
                  <p className="text-orange-100 text-sm">
                    <Star className="inline h-4 w-4 mr-1" />
                    Out of 5.0 stars
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
          <TabsTrigger value="tenders">Tenders</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
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
                    <Line type="monotone" dataKey="winRate" stroke="#60B5FF" strokeWidth={2} />
                    <Line type="monotone" dataKey="quotes" stroke="#FF9149" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quote Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Quote Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={quoteData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {quoteData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {quoteData.map((item, index) => (
                    <div key={item.status} className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                        <span className="text-sm font-medium">{item.status}</span>
                      </div>
                      <p className="text-sm text-gray-600">{item.count} quotes</p>
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
                          {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString()}
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

        <TabsContent value="tenders" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Active Tender Opportunities</h2>
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
            {tenderOpportunities.map((tender) => (
              <Card key={tender.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{tender.title}</CardTitle>
                      <p className="text-sm text-gray-600">{tender.tenderNumber}</p>
                    </div>
                    <Badge className={getStatusColor(tender.status)}>
                      {tender.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Estimated Value</p>
                        <p className="text-lg font-semibold">€{tender.estimatedValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Bid Deadline</p>
                        <p className="text-lg font-semibold">
                          {tender.bidDeadline.toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Days Left</p>
                        <p className={`text-lg font-semibold ${tender.daysLeft <= 2 ? 'text-red-600' : 'text-green-600'}`}>
                          {tender.daysLeft}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Requirements</p>
                      <div className="flex flex-wrap gap-2">
                        {tender.requirements.map((req, index) => (
                          <Badge key={index} variant="outline">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" disabled={tender.status === 'CLOSED'}>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Bid
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quotes" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Quote Management</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quote Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Submitted</span>
                  <span className="font-semibold">{metrics?.totalQuotes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Won</span>
                  <span className="font-semibold text-green-600">{metrics?.selectedQuotes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lost</span>
                  <span className="font-semibold text-red-600">{(metrics?.totalQuotes || 0) - (metrics?.selectedQuotes || 0)}</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Win Rate</span>
                    <span className="text-sm font-medium">{metrics?.winRate}%</span>
                  </div>
                  <Progress value={metrics?.winRate || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Quote Value</span>
                  <span className="font-semibold">€{(metrics?.totalQuoteValue || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Won Value</span>
                  <span className="font-semibold text-green-600">€{(metrics?.wonQuoteValue || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Quote</span>
                  <span className="font-semibold">€{metrics?.totalQuotes ? Math.round((metrics.totalQuoteValue || 0) / metrics.totalQuotes).toLocaleString() : 0}</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Value Conversion</span>
                    <span className="text-sm font-medium">
                      {metrics?.totalQuoteValue ? Math.round(((metrics.wonQuoteValue || 0) / metrics.totalQuoteValue) * 100) : 0}%
                    </span>
                  </div>
                  <Progress value={metrics?.totalQuoteValue ? ((metrics.wonQuoteValue || 0) / metrics.totalQuoteValue) * 100 : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg Response Time</span>
                  <span className="font-semibold">{metrics?.averageResponseTime}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Reliability Score</span>
                  <span className="font-semibold">{metrics?.reliabilityScore ? Math.round(metrics.reliabilityScore * 100) : 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">AI Performance</span>
                  <span className="font-semibold">{metrics?.aiPerformanceScore ? Math.round(metrics.aiPerformanceScore * 100) : 0}%</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Overall Rating</span>
                    <span className="text-sm font-medium">{metrics?.rating}/5.0</span>
                  </div>
                  <Progress value={metrics?.rating ? (metrics.rating / 5) * 100 : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Win Rate Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Win Rate Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="winRate" stroke="#60B5FF" fill="#60B5FF" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Response Time Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Response Time Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="responseTime" stroke="#FF9149" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-green-600">Strengths</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Consistent win rate improvement</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Fast response times</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">High reliability score</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Strong AI performance rating</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-orange-600">Improvement Areas</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Increase quote volume</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Diversify service offerings</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Optimize pricing strategy</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Enhance technical proposals</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
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
                  <p className="text-sm text-gray-900">Transport Excellence GmbH</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Supplier Code</label>
                  <p className="text-sm text-gray-900">SUP-TE-001</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Contact Person</label>
                  <p className="text-sm text-gray-900">Klaus Müller</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">k.mueller@transport-excellence.de</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">+49 69 123456789</p>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Information
                </Button>
              </CardContent>
            </Card>

            {/* Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Service Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Transport Types</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline">Road Transport</Badge>
                    <Badge variant="outline">Express Delivery</Badge>
                    <Badge variant="outline">Temperature Controlled</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Service Areas</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline">Germany</Badge>
                    <Badge variant="outline">EU</Badge>
                    <Badge variant="outline">Scandinavia</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Certifications</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline">ISO 9001</Badge>
                    <Badge variant="outline">SQAS</Badge>
                    <Badge variant="outline">ADR</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Update Capabilities
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
