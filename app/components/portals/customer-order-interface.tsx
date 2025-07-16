
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ShoppingCart, 
  Calendar, 
  Euro, 
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  Star,
  Building
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Order {
  id: string;
  orderNumber: string;
  title: string;
  category: string;
  supplierName: string;
  totalAmount: number;
  currency: string;
  status: string;
  progress: number;
  startDate: string;
  expectedEndDate: string;
  qualityScore?: number;
}

export function CustomerOrderInterface() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with demo data
    setTimeout(() => {
      setOrders([
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          title: 'Website-Entwicklung',
          category: 'IT_SERVICES',
          supplierName: 'DevExperts Ltd',
          totalAmount: 28500,
          currency: 'EUR',
          status: 'IN_PROGRESS',
          progress: 75,
          startDate: '2024-01-15',
          expectedEndDate: '2024-03-01',
          qualityScore: 4.8
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          title: 'Marketing-Kampagne',
          category: 'MARKETING_SERVICES',
          supplierName: 'Creative Design Studio',
          totalAmount: 16200,
          currency: 'EUR',
          status: 'COMPLETED',
          progress: 100,
          startDate: '2024-01-10',
          expectedEndDate: '2024-02-15',
          qualityScore: 4.5
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
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
        <h1 className="text-2xl font-bold text-gray-900">Meine Bestellungen</h1>
        <p className="text-gray-600">Verfolgen Sie Ihre aktiven Aufträge und Services</p>
      </div>

      {/* Orders list */}
      <div className="space-y-4">
        {orders.map((order, index) => (
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
                      <h3 className="font-semibold text-gray-900">{order.title}</h3>
                      <Badge className={getStatusColor(order.status)} variant="secondary">
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                      <span className="flex items-center">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        {order.orderNumber}
                      </span>
                      <span className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        {order.supplierName}
                      </span>
                      <span className="flex items-center">
                        <Euro className="h-4 w-4 mr-1" />
                        €{order.totalAmount.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {order.expectedEndDate}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Fortschritt</span>
                        <span>{order.progress}%</span>
                      </div>
                      <Progress value={order.progress} className="h-2" />
                    </div>

                    {order.qualityScore && (
                      <div className="flex items-center mt-3">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{order.qualityScore}/5.0</span>
                        <span className="text-sm text-gray-600 ml-2">Qualitätsbewertung</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-6">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Kontakt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
