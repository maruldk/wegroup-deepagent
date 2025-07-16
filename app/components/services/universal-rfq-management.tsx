
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Plus, 
  Eye,
  Edit,
  Send,
  Calendar,
  Building,
  Euro
} from 'lucide-react';
import { motion } from 'framer-motion';

interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  category: string;
  customerName: string;
  status: string;
  totalQuotes: number;
  budget?: number;
  deadline: string;
  publishedAt?: string;
}

export function UniversalRFQManagement() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with demo data
    setTimeout(() => {
      setRfqs([
        {
          id: '1',
          rfqNumber: 'RFQ-2024-001',
          title: 'Website-Entwicklung für E-Commerce',
          category: 'IT_SERVICES',
          customerName: 'TechStart GmbH',
          status: 'ACTIVE',
          totalQuotes: 3,
          budget: 25000,
          deadline: '2024-02-15',
          publishedAt: '2024-01-15'
        },
        {
          id: '2',
          rfqNumber: 'RFQ-2024-002',
          title: 'Digital Marketing Kampagne',
          category: 'MARKETING_SERVICES',
          customerName: 'Marketing Pro AG',
          status: 'DRAFT',
          totalQuotes: 0,
          budget: 15000,
          deadline: '2024-02-20'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-700';
      case 'PUBLISHED':
        return 'bg-blue-100 text-blue-700';
      case 'ACTIVE':
        return 'bg-green-100 text-green-700';
      case 'CLOSED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RFQ Management</h1>
          <p className="text-gray-600">Erstellen und verwalten Sie RFQs für alle Service-Kategorien</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Neue RFQ
        </Button>
      </div>

      {/* RFQs list */}
      <div className="space-y-4">
        {rfqs.map((rfq, index) => (
          <motion.div
            key={rfq.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                      <h3 className="font-semibold text-gray-900">{rfq.title}</h3>
                      <Badge className={getStatusColor(rfq.status)} variant="secondary">
                        {rfq.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">RFQ-Nr.</p>
                        <p className="font-medium">{rfq.rfqNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Kunde</p>
                        <p className="font-medium">{rfq.customerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Kategorie</p>
                        <p className="font-medium">{rfq.category.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Angebote</p>
                        <p className="font-medium">{rfq.totalQuotes} eingegangen</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      {rfq.budget && (
                        <span className="flex items-center">
                          <Euro className="h-4 w-4 mr-1" />
                          Budget: €{rfq.budget.toLocaleString()}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Deadline: {rfq.deadline}
                      </span>
                      {rfq.publishedAt && (
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Veröffentlicht: {rfq.publishedAt}
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
                    {rfq.status === 'DRAFT' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Send className="h-4 w-4 mr-2" />
                        Veröffentlichen
                      </Button>
                    )}
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
