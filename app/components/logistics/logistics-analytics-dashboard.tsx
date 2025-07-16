
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package,
  Euro,
  Clock,
  Star,
  Building2,
  CheckCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Calendar,
  Target,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalyticsData {
  overview: {
    totalCustomers: number;
    activeCustomers: number;
    totalSuppliers: number;
    activeSuppliers: number;
    totalRequests: number;
    activeRFQs: number;
    totalQuotes: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    averageQuoteValue: number;
    avgDeliveryTime: number;
    customerSatisfaction: number;
    supplierPerformance: number;
  };
  recent: {
    requests: Array<{
      id: string;
      requestNumber: string;
      title: string;
      status: string;
      createdAt: string;
      customer: {
        id: string;
        companyName?: string;
        firstName?: string;
        lastName?: string;
      };
    }>;
    orders: Array<{
      id: string;
      orderNumber: string;
      title: string;
      status: string;
      orderValue: number;
      createdAt: string;
      customer: {
        id: string;
        companyName?: string;
        firstName?: string;
        lastName?: string;
      };
      supplier: {
        id: string;
        companyName: string;
      };
    }>;
  };
  topPerformers: {
    suppliers: Array<{
      id: string;
      companyName: string;
      performanceScore?: number;
      totalRevenue: number;
      totalOrders: number;
    }>;
    customers: Array<{
      id: string;
      companyName?: string;
      firstName?: string;
      lastName?: string;
      totalValue: number;
      totalOrders: number;
    }>;
  };
  distributions: {
    rfqStatus: Array<{
      status: string;
      _count: { status: number };
    }>;
    orderStatus: Array<{
      status: string;
      _count: { status: number };
    }>;
  };
}

interface LogisticsAnalyticsProps {
  tenantId: string;
}

const LogisticsAnalyticsDashboard: React.FC<LogisticsAnalyticsProps> = ({ tenantId }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/logistics/analytics?period=${period}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'COMPLETED': return 'bg-green-600';
      case 'SUBMITTED': return 'bg-blue-500';
      case 'UNDER_REVIEW': return 'bg-yellow-500';
      case 'PENDING': return 'bg-orange-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Aktiv';
      case 'COMPLETED': return 'Abgeschlossen';
      case 'SUBMITTED': return 'Eingereicht';
      case 'UNDER_REVIEW': return 'In Bearbeitung';
      case 'PENDING': return 'Ausstehend';
      case 'CANCELLED': return 'Storniert';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Keine Daten verfügbar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Logistics Analytics</h1>
          <p className="text-gray-600 mt-1">Übersicht über Ihre Logistik-Performance</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Zeitraum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 Tage</SelectItem>
              <SelectItem value="30">30 Tage</SelectItem>
              <SelectItem value="90">90 Tage</SelectItem>
              <SelectItem value="365">1 Jahr</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Aktualisieren
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Kunden (Aktiv)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.overview.activeCustomers} / {analytics.overview.totalCustomers}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-green-600">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Lieferanten (Aktiv)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.overview.activeSuppliers} / {analytics.overview.totalSuppliers}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-purple-600">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gesamtumsatz</p>
                  <p className="text-2xl font-bold text-gray-900">
                    €{(analytics.overview.totalRevenue / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Euro className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-l-4 border-l-orange-600">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Kundenzufriedenheit</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.overview.customerSatisfaction.toFixed(1)}%
                  </p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Star className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktuelle RFQs</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.activeRFQs}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gesamt Angebote</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalQuotes}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Offene Bestellungen</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.pendingOrders}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ø Angebotswert</p>
                <p className="text-2xl font-bold text-gray-900">
                  €{analytics.overview.averageQuoteValue.toFixed(0)}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Lieferanten Performance</span>
                <span>{analytics.overview.supplierPerformance.toFixed(1)}%</span>
              </div>
              <Progress value={analytics.overview.supplierPerformance} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Kundenzufriedenheit</span>
                <span>{analytics.overview.customerSatisfaction.toFixed(1)}%</span>
              </div>
              <Progress value={analytics.overview.customerSatisfaction} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Abgeschlossene Bestellungen</span>
                <span>{((analytics.overview.completedOrders / (analytics.overview.completedOrders + analytics.overview.pendingOrders)) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(analytics.overview.completedOrders / (analytics.overview.completedOrders + analytics.overview.pendingOrders)) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              Status Verteilung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">RFQ Status</p>
                <div className="flex flex-wrap gap-2">
                  {analytics.distributions.rfqStatus.map((status) => (
                    <Badge 
                      key={status.status} 
                      variant="secondary" 
                      className={`text-white ${getStatusColor(status.status)}`}
                    >
                      {getStatusText(status.status)} ({status._count.status})
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Bestellung Status</p>
                <div className="flex flex-wrap gap-2">
                  {analytics.distributions.orderStatus.map((status) => (
                    <Badge 
                      key={status.status} 
                      variant="secondary" 
                      className={`text-white ${getStatusColor(status.status)}`}
                    >
                      {getStatusText(status.status)} ({status._count.status})
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-green-600" />
              Top Lieferanten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topPerformers.suppliers.slice(0, 5).map((supplier, index) => (
                <div key={supplier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Building2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{supplier.companyName}</p>
                      <p className="text-xs text-gray-600">
                        {supplier.totalOrders} Bestellungen • €{(supplier.totalRevenue / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{supplier.performanceScore?.toFixed(1) || 0}%</p>
                    <p className="text-xs text-gray-600">Performance</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Top Kunden
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topPerformers.customers.slice(0, 5).map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {customer.companyName || `${customer.firstName} ${customer.lastName}`}
                      </p>
                      <p className="text-xs text-gray-600">
                        {customer.totalOrders} Bestellungen
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">€{(customer.totalValue / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-gray-600">Gesamtwert</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Neueste Anfragen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recent.requests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{request.title}</p>
                      <p className="text-xs text-gray-600">
                        {request.customer.companyName || `${request.customer.firstName} ${request.customer.lastName}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className={`text-white ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </Badge>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(request.createdAt).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Neueste Bestellungen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recent.orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{order.title}</p>
                      <p className="text-xs text-gray-600">
                        {order.customer.companyName || `${order.customer.firstName} ${order.customer.lastName}`}
                        → {order.supplier.companyName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">€{order.orderValue.toLocaleString()}</p>
                    <Badge variant="secondary" className={`text-white ${getStatusColor(order.status)} mt-1`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogisticsAnalyticsDashboard;
