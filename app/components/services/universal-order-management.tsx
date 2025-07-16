
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  Building, 
  Calendar, 
  Euro,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Order {
  id: string;
  orderNumber: string;
  title: string;
  category: string;
  customerName: string;
  supplierName: string;
  totalAmount: number;
  currency: string;
  status: string;
  progress: number;
  startDate: string;
  expectedEndDate: string;
  qualityScore?: number;
  satisfactionScore?: number;
}

export function UniversalOrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with demo data
    setTimeout(() => {
      setOrders([
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          title: 'Website-Entwicklung für E-Commerce',
          category: 'IT_SERVICES',
          customerName: 'TechStart GmbH',
          supplierName: 'DevExperts Ltd',
          totalAmount: 28500,
          currency: 'EUR',
          status: 'IN_PROGRESS',
          progress: 75,
          startDate: '2024-01-15',
          expectedEndDate: '2024-03-01',
          qualityScore: 4.8,
          satisfactionScore: 4.5
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          title: 'Digital Marketing Kampagne',
          category: 'MARKETING_SERVICES',
          customerName: 'Marketing Pro AG',
          supplierName: 'Creative Design Studio',
          totalAmount: 16200,
          currency: 'EUR',
          status: 'COMPLETED',
          progress: 100,
          startDate: '2024-01-10',
          expectedEndDate: '2024-02-15',
          qualityScore: 4.5,
          satisfactionScore: 4.7
        },
        {
          id: '3',
          orderNumber: 'ORD-2024-003',
          title: 'Senior Developer Recruitment',
          category: 'HR_SERVICES',
          customerName: 'Global Consulting',
          supplierName: 'HR Solutions Pro',
          totalAmount: 9800,
          currency: 'EUR',
          status: 'PENDING',
          progress: 0,
          startDate: '2024-02-01',
          expectedEndDate: '2024-03-15'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'ON_HOLD':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return Clock;
      case 'IN_PROGRESS':
        return AlertCircle;
      case 'COMPLETED':
        return CheckCircle;
      default:
        return Clock;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600">Verwalten Sie alle Service-Bestellungen und Projektfortschritte</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            title: 'Gesamt Bestellungen', 
            value: orders.length, 
            icon: ShoppingCart, 
            color: 'blue' 
          },
          { 
            title: 'In Bearbeitung', 
            value: orders.filter(o => o.status === 'IN_PROGRESS').length, 
            icon: AlertCircle, 
            color: 'yellow' 
          },
          { 
            title: 'Abgeschlossen', 
            value: orders.filter(o => o.status === 'COMPLETED').length, 
            icon: CheckCircle, 
            color: 'green' 
          },
          { 
            title: 'Gesamtwert', 
            value: `€${orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}`, 
            icon: Euro, 
            color: 'purple' 
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
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
          </motion.div>
        ))}
      </div>

      {/* Orders list */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Alle</TabsTrigger>
          <TabsTrigger value="pending">Wartend</TabsTrigger>
          <TabsTrigger value="active">Aktiv</TabsTrigger>
          <TabsTrigger value="completed">Abgeschlossen</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {orders.map((order, index) => {
            const StatusIcon = getStatusIcon(order.status);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <StatusIcon className="h-5 w-5 text-gray-400" />
                          <h3 className="font-semibold text-gray-900">{order.title}</h3>
                          <Badge className={getStatusColor(order.status)} variant="secondary">
                            {order.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Bestellnummer</p>
                            <p className="font-medium">{order.orderNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Kunde</p>
                            <p className="font-medium">{order.customerName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Lieferant</p>
                            <p className="font-medium">{order.supplierName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Wert</p>
                            <p className="font-medium text-green-600">€{order.totalAmount.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span>Fortschritt</span>
                            <span>{order.progress}%</span>
                          </div>
                          <Progress value={order.progress} className="h-2" />
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Start: {order.startDate}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Ende: {order.expectedEndDate}
                          </span>
                          {order.qualityScore && (
                            <span className="flex items-center">
                              <Star className="h-4 w-4 mr-1 text-yellow-500" />
                              Qualität: {order.qualityScore}/5
                            </span>
                          )}
                          {order.satisfactionScore && (
                            <span className="flex items-center">
                              <Star className="h-4 w-4 mr-1 text-yellow-500" />
                              Zufriedenheit: {order.satisfactionScore}/5
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-6">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Bearbeiten
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
