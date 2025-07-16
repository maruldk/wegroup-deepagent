
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  Users, 
  FileText, 
  MessageSquare,
  ShoppingCart,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Link from 'next/link';

interface DashboardStats {
  totalRequests: number;
  totalRFQs: number;
  totalQuotes: number;
  totalOrders: number;
  totalCustomers: number;
  totalSuppliers: number;
  conversionRate: number;
  avgResponseTime: number;
}

interface RecentActivity {
  id: string;
  type: 'request' | 'rfq' | 'quote' | 'order';
  title: string;
  customer: string;
  supplier?: string;
  amount?: number;
  status: string;
  date: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export function UniversalServicesDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    totalRFQs: 0,
    totalQuotes: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
    conversionRate: 0,
    avgResponseTime: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Demo chart data
  const requestTrend = [
    { month: 'Jan', requests: 12, rfqs: 8, quotes: 24 },
    { month: 'Feb', requests: 19, rfqs: 15, quotes: 45 },
    { month: 'Mar', requests: 23, rfqs: 18, quotes: 52 },
    { month: 'Apr', requests: 27, rfqs: 22, quotes: 68 },
    { month: 'Mai', requests: 31, rfqs: 28, quotes: 78 },
    { month: 'Jun', requests: 35, rfqs: 32, quotes: 89 },
  ];

  const categoryDistribution = [
    { name: 'IT Services', value: 35, color: '#3B82F6' },
    { name: 'Marketing', value: 25, color: '#10B981' },
    { name: 'HR Services', value: 20, color: '#F59E0B' },
    { name: 'Legal', value: 12, color: '#EF4444' },
    { name: 'Finance', value: 8, color: '#8B5CF6' },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalRequests: 147,
        totalRFQs: 112,
        totalQuotes: 289,
        totalOrders: 98,
        totalCustomers: 34,
        totalSuppliers: 67,
        conversionRate: 68.5,
        avgResponseTime: 4.2,
      });

      setRecentActivity([
        {
          id: '1',
          type: 'request',
          title: 'Website-Entwicklung',
          customer: 'TechStart GmbH',
          status: 'RFQ_CREATED',
          date: '2024-01-15',
          amount: 25000
        },
        {
          id: '2',
          type: 'quote',
          title: 'Marketing-Kampagne',
          customer: 'Marketing Pro AG',
          supplier: 'Creative Studio',
          status: 'SUBMITTED',
          date: '2024-01-14',
          amount: 15000
        },
        {
          id: '3',
          type: 'order',
          title: 'HR-Beratung',
          customer: 'Global Consulting',
          supplier: 'HR Solutions Pro',
          status: 'IN_PROGRESS',
          date: '2024-01-13',
          amount: 12000
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      title: 'Service Requests',
      value: stats.totalRequests,
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'blue',
      href: '/services/requests',
    },
    {
      title: 'Aktive RFQs',
      value: stats.totalRFQs,
      change: '+8%',
      trend: 'up',
      icon: MessageSquare,
      color: 'green',
      href: '/services/rfqs',
    },
    {
      title: 'Eingegangene Angebote',
      value: stats.totalQuotes,
      change: '+15%',
      trend: 'up',
      icon: Briefcase,
      color: 'purple',
      href: '/services/quotes',
    },
    {
      title: 'Abgeschlossene Aufträge',
      value: stats.totalOrders,
      change: '+22%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'orange',
      href: '/services/orders',
    },
    {
      title: 'Kunden',
      value: stats.totalCustomers,
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'indigo',
      href: '/services/customers',
    },
    {
      title: 'Lieferanten',
      value: stats.totalSuppliers,
      change: '+18%',
      trend: 'up',
      icon: Users,
      color: 'pink',
      href: '/services/suppliers',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RFQ_CREATED':
        return 'bg-blue-100 text-blue-700';
      case 'SUBMITTED':
        return 'bg-green-100 text-green-700';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-700';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'request':
        return FileText;
      case 'rfq':
        return MessageSquare;
      case 'quote':
        return Briefcase;
      case 'order':
        return ShoppingCart;
      default:
        return FileText;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Universal Services Dashboard</h1>
            <p className="text-blue-100">
              KI-gestütztes Service-Management für alle Geschäftsbereiche
            </p>
          </div>
          <div className="hidden md:block">
            <Link href="/services/requests">
              <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Plus className="h-5 w-5 mr-2" />
                Neue Service-Anfrage
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        {stat.trend === 'up' ? (
                          <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">vs. letzter Monat</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Charts and analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request trend chart */}
        <Card>
          <CardHeader>
            <CardTitle>Service-Anfragen Trend</CardTitle>
            <CardDescription>Entwicklung über die letzten 6 Monate</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={requestTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="requests" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="rfqs" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="quotes" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Service-Kategorien</CardTitle>
            <CardDescription>Verteilung der Service-Anfragen</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
            <p className="text-sm text-gray-600">Conversion Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.avgResponseTime}h</p>
            <p className="text-sm text-gray-600">Ø Antwortzeit</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">94%</p>
            <p className="text-sm text-gray-600">Kundenzufriedenheit</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">€2.4M</p>
            <p className="text-sm text-gray-600">Gesamtvolumen</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Letzte Aktivitäten</CardTitle>
          <CardDescription>Die neuesten Service-Aktivitäten im Überblick</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const ActivityIcon = getActivityIcon(activity.type);
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <ActivityIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600">Kunde: {activity.customer}</span>
                        {activity.supplier && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600">Lieferant: {activity.supplier}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {activity.amount && (
                      <span className="font-semibold text-gray-900">
                        €{activity.amount.toLocaleString()}
                      </span>
                    )}
                    <Badge className={getStatusColor(activity.status)} variant="secondary">
                      {activity.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-gray-500">{activity.date}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
