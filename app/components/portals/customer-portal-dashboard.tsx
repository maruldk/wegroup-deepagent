
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  FileText, 
  MessageSquare, 
  ShoppingCart, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Star,
  Calendar,
  Euro,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface DashboardStats {
  activeRequests: number;
  pendingQuotes: number;
  activeOrders: number;
  totalSpent: number;
}

interface RecentActivity {
  id: string;
  type: 'request' | 'quote' | 'order';
  title: string;
  status: string;
  date: string;
  amount?: number;
}

export function CustomerPortalDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    activeRequests: 0,
    pendingQuotes: 0,
    activeOrders: 0,
    totalSpent: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with demo data
    setTimeout(() => {
      setStats({
        activeRequests: 7,
        pendingQuotes: 12,
        activeOrders: 3,
        totalSpent: 45200,
      });
      
      setRecentActivity([
        {
          id: '1',
          type: 'quote',
          title: 'Website-Entwicklung',
          status: 'Neues Angebot',
          date: '2024-01-15',
          amount: 15000,
        },
        {
          id: '2',
          type: 'order',
          title: 'Marketing-Kampagne',
          status: 'In Bearbeitung',
          date: '2024-01-14',
          amount: 8500,
        },
        {
          id: '3',
          type: 'request',
          title: 'HR-Beratung',
          status: 'RFQ erstellt',
          date: '2024-01-13',
        },
        {
          id: '4',
          type: 'quote',
          title: 'IT-Consulting',
          status: 'Angebot erhalten',
          date: '2024-01-12',
          amount: 12000,
        },
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const statsCards = [
    {
      title: 'Aktive Anfragen',
      value: stats.activeRequests,
      icon: FileText,
      color: 'blue',
      href: '/customer-portal/requests',
    },
    {
      title: 'Offene Angebote',
      value: stats.pendingQuotes,
      icon: MessageSquare,
      color: 'orange',
      href: '/customer-portal/quotes',
    },
    {
      title: 'Laufende Aufträge',
      value: stats.activeOrders,
      icon: ShoppingCart,
      color: 'green',
      href: '/customer-portal/orders',
    },
    {
      title: 'Gesamt ausgegeben',
      value: `€${stats.totalSpent?.toLocaleString()}`,
      icon: Euro,
      color: 'purple',
      href: '/customer-portal/orders',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Neues Angebot':
        return 'bg-blue-100 text-blue-700';
      case 'In Bearbeitung':
        return 'bg-yellow-100 text-yellow-700';
      case 'RFQ erstellt':
        return 'bg-green-100 text-green-700';
      case 'Angebot erhalten':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'request':
        return FileText;
      case 'quote':
        return MessageSquare;
      case 'order':
        return ShoppingCart;
      default:
        return FileText;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
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
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Willkommen in Ihrem Service-Portal</h1>
            <p className="text-blue-100">
              Verwalten Sie alle Ihre Service-Anfragen, Angebote und Bestellungen an einem Ort.
            </p>
          </div>
          <div className="hidden md:block">
            <Link href="/customer-portal/requests/new">
              <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Plus className="h-5 w-5 mr-2" />
                Neue Anfrage
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
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

      {/* Main content tabs */}
      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity">Letzte Aktivitäten</TabsTrigger>
          <TabsTrigger value="services">Service-Kategorien</TabsTrigger>
          <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Letzte Aktivitäten
              </CardTitle>
              <CardDescription>
                Ihre neuesten Service-Aktivitäten im Überblick
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const IconComponent = getTypeIcon(activity.type);
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
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(activity.status)} variant="secondary">
                              {activity.status}
                            </Badge>
                            <span className="text-sm text-gray-500">{activity.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {activity.amount && (
                          <span className="font-semibold text-gray-900">
                            €{activity.amount.toLocaleString()}
                          </span>
                        )}
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'IT Services', icon: Package, count: 45, color: 'blue' },
              { name: 'Marketing', icon: TrendingUp, count: 32, color: 'green' },
              { name: 'HR Services', icon: Users, count: 28, color: 'purple' },
              { name: 'Consulting', icon: MessageSquare, count: 19, color: 'orange' },
              { name: 'Legal Services', icon: FileText, count: 15, color: 'red' },
              { name: 'Finance', icon: Euro, count: 22, color: 'indigo' },
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.count} verfügbare Services</p>
                      </div>
                      <div className={`p-3 rounded-lg bg-${category.color}-100`}>
                        <category.icon className={`h-6 w-6 text-${category.color}-600`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quick-actions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Neue Service-Anfrage stellen',
                description: 'Erstellen Sie eine neue Anfrage für beliebige Services',
                icon: Plus,
                href: '/customer-portal/requests/new',
                color: 'blue',
              },
              {
                title: 'Angebote vergleichen',
                description: 'Vergleichen Sie eingegangene Angebote',
                icon: MessageSquare,
                href: '/customer-portal/quotes',
                color: 'green',
              },
              {
                title: 'Aufträge verfolgen',
                description: 'Verfolgen Sie den Status Ihrer laufenden Aufträge',
                icon: ShoppingCart,
                href: '/customer-portal/orders',
                color: 'purple',
              },
              {
                title: 'Service-Katalog durchsuchen',
                description: 'Entdecken Sie alle verfügbaren Services',
                icon: Package,
                href: '/customer-portal/services',
                color: 'orange',
              },
            ].map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={action.href}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-blue-500 hover:border-l-blue-600">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg bg-${action.color}-100`}>
                          <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
