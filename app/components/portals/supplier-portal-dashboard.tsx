
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  FileText, 
  ShoppingCart, 
  TrendingUp,
  Clock,
  Star,
  Euro,
  Award,
  Target,
  Users,
  Calendar,
  ArrowRight,
  Eye,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface SupplierStats {
  availableRFQs: number;
  activeQuotes: number;
  activeOrders: number;
  totalRevenue: number;
  performanceScore: number;
  responseRate: number;
  winRate: number;
}

interface RFQOpportunity {
  id: string;
  title: string;
  category: string;
  budget: number;
  deadline: string;
  requirements: string[];
  isNew: boolean;
}

export function SupplierPortalDashboard() {
  const [stats, setStats] = useState<SupplierStats>({
    availableRFQs: 0,
    activeQuotes: 0,
    activeOrders: 0,
    totalRevenue: 0,
    performanceScore: 0,
    responseRate: 0,
    winRate: 0,
  });
  const [rfqOpportunities, setRfqOpportunities] = useState<RFQOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with demo data
    setTimeout(() => {
      setStats({
        availableRFQs: 15,
        activeQuotes: 8,
        activeOrders: 5,
        totalRevenue: 125000,
        performanceScore: 4.8,
        responseRate: 92,
        winRate: 68,
      });
      
      setRfqOpportunities([
        {
          id: '1',
          title: 'E-Commerce Website Development',
          category: 'IT_SERVICES',
          budget: 25000,
          deadline: '2024-02-15',
          requirements: ['React', 'Node.js', 'Payment Integration'],
          isNew: true,
        },
        {
          id: '2',
          title: 'Digital Marketing Campaign',
          category: 'MARKETING_SERVICES',
          budget: 15000,
          deadline: '2024-02-20',
          requirements: ['SEO', 'Social Media', 'Content Creation'],
          isNew: true,
        },
        {
          id: '3',
          title: 'HR Consulting Services',
          category: 'HR_SERVICES',
          budget: 12000,
          deadline: '2024-02-25',
          requirements: ['Recruitment', 'Performance Management'],
          isNew: false,
        },
        {
          id: '4',
          title: 'Business Process Optimization',
          category: 'CONSULTING_SERVICES',
          budget: 18000,
          deadline: '2024-03-01',
          requirements: ['Process Analysis', 'Change Management'],
          isNew: false,
        },
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const statsCards = [
    {
      title: 'Verfügbare RFQs',
      value: stats.availableRFQs,
      icon: Briefcase,
      color: 'blue',
      href: '/supplier-portal/rfqs',
    },
    {
      title: 'Aktive Angebote',
      value: stats.activeQuotes,
      icon: FileText,
      color: 'orange',
      href: '/supplier-portal/quotes',
    },
    {
      title: 'Laufende Aufträge',
      value: stats.activeOrders,
      icon: ShoppingCart,
      color: 'green',
      href: '/supplier-portal/orders',
    },
    {
      title: 'Gesamtumsatz',
      value: `€${stats.totalRevenue?.toLocaleString()}`,
      icon: Euro,
      color: 'purple',
      href: '/supplier-portal/performance',
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'IT_SERVICES':
        return 'bg-blue-100 text-blue-700';
      case 'MARKETING_SERVICES':
        return 'bg-green-100 text-green-700';
      case 'HR_SERVICES':
        return 'bg-purple-100 text-purple-700';
      case 'CONSULTING_SERVICES':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Willkommen im Supplier Portal</h1>
            <p className="text-green-100">
              Entdecken Sie neue Geschäftsmöglichkeiten und verwalten Sie Ihre Aufträge.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.performanceScore}/5.0</div>
              <div className="text-green-100">Performance Score</div>
            </div>
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
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
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

      {/* Performance metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Response Rate</h3>
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Antwortquote</span>
                <span>{stats.responseRate}%</span>
              </div>
              <Progress value={stats.responseRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Win Rate</h3>
              <Award className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Erfolgsquote</span>
                <span>{stats.winRate}%</span>
              </div>
              <Progress value={stats.winRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Performance</h3>
              <Star className="h-5 w-5 text-purple-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Bewertung</span>
                <span>{stats.performanceScore}/5.0</span>
              </div>
              <Progress value={(stats.performanceScore / 5) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content tabs */}
      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="opportunities">Neue Chancen</TabsTrigger>
          <TabsTrigger value="active">Aktive Projekte</TabsTrigger>
          <TabsTrigger value="analytics">Analyse</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Neue RFQ-Gelegenheiten
              </CardTitle>
              <CardDescription>
                Passende Geschäftsmöglichkeiten für Ihre Services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rfqOpportunities.map((rfq, index) => (
                  <motion.div
                    key={rfq.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{rfq.title}</h4>
                        {rfq.isNew && (
                          <Badge className="bg-green-100 text-green-700" variant="secondary">
                            Neu
                          </Badge>
                        )}
                        <Badge className={getCategoryColor(rfq.category)} variant="secondary">
                          {rfq.category.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Euro className="h-4 w-4 mr-1" />
                          €{rfq.budget.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {rfq.deadline}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {rfq.requirements.slice(0, 3).map((req, i) => (
                          <span
                            key={i}
                            className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded"
                          >
                            {req}
                          </span>
                        ))}
                        {rfq.requirements.length > 3 && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                            +{rfq.requirements.length - 3} mehr
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Angebot erstellen
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Aktive Angebote</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium">Mobile App Entwicklung</h4>
                        <p className="text-sm text-gray-600">Eingereicht vor 2 Tagen</p>
                      </div>
                      <Badge variant="outline">Unter Bewertung</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Laufende Aufträge</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Website Redesign</h4>
                        <Badge className="bg-green-100 text-green-700">75%</Badge>
                      </div>
                      <Progress value={75} className="h-2" />
                      <p className="text-sm text-gray-600 mt-2">Deadline: 15. März 2024</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Monatlicher Umsatz', value: '€25,400', change: '+12%', color: 'green' },
              { title: 'Neue Aufträge', value: '8', change: '+25%', color: 'blue' },
              { title: 'Kundenzufriedenheit', value: '4.9/5', change: '+0.2', color: 'purple' },
            ].map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">{metric.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{metric.value}</span>
                      <span className={`text-sm font-medium text-${metric.color}-600`}>
                        {metric.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
