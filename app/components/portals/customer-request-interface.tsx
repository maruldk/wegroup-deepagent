
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Eye,
  MessageSquare,
  Calendar,
  Euro,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ServiceRequest {
  id: string;
  requestNumber: string;
  title: string;
  category: string;
  serviceType: string;
  status: string;
  priority: string;
  budget?: number;
  deadline?: string;
  createdAt: string;
  rfqCount: number;
  quoteCount: number;
}

export function CustomerRequestInterface() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with demo data
    setTimeout(() => {
      setRequests([
        {
          id: '1',
          requestNumber: 'SRQ-2024-001',
          title: 'Website-Entwicklung für E-Commerce',
          category: 'IT_SERVICES',
          serviceType: 'SOFTWARE_DEVELOPMENT',
          status: 'RFQ_CREATED',
          priority: 'HIGH',
          budget: 25000,
          deadline: '2024-03-15',
          createdAt: '2024-01-15',
          rfqCount: 1,
          quoteCount: 3
        },
        {
          id: '2',
          requestNumber: 'SRQ-2024-002',
          title: 'Digital Marketing Kampagne',
          category: 'MARKETING_SERVICES',
          serviceType: 'DIGITAL_MARKETING',
          status: 'UNDER_REVIEW',
          priority: 'MEDIUM',
          budget: 15000,
          deadline: '2024-04-01',
          createdAt: '2024-01-12',
          rfqCount: 1,
          quoteCount: 5
        },
        {
          id: '3',
          requestNumber: 'SRQ-2024-003',
          title: 'Senior Developer Recruitment',
          category: 'HR_SERVICES',
          serviceType: 'RECRUITMENT',
          status: 'SUBMITTED',
          priority: 'HIGH',
          budget: 8000,
          deadline: '2024-02-28',
          createdAt: '2024-01-10',
          rfqCount: 0,
          quoteCount: 0
        },
        {
          id: '4',
          requestNumber: 'SRQ-2024-004',
          title: 'Vertragsrechtliche Beratung',
          category: 'LEGAL_SERVICES',
          serviceType: 'CONTRACT_LAW',
          status: 'DRAFT',
          priority: 'LOW',
          budget: 12000,
          createdAt: '2024-01-08',
          rfqCount: 0,
          quoteCount: 0
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-700';
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-700';
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-700';
      case 'RFQ_CREATED':
        return 'bg-green-100 text-green-700';
      case 'QUOTES_RECEIVED':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'bg-gray-100 text-gray-700';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700';
      case 'HIGH':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return Clock;
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return AlertCircle;
      case 'RFQ_CREATED':
      case 'QUOTES_RECEIVED':
        return CheckCircle;
      default:
        return Clock;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Meine Service-Anfragen</h1>
          <p className="text-gray-600">Verwalten und verfolgen Sie alle Ihre Service-Anfragen</p>
        </div>
        <Link href="/customer-portal/requests/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Neue Anfrage
          </Button>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Gesamt Anfragen', value: requests.length, icon: FileText, color: 'blue' },
          { label: 'Aktive RFQs', value: requests.filter(r => r.status === 'RFQ_CREATED').length, icon: MessageSquare, color: 'green' },
          { label: 'Offene Angebote', value: requests.reduce((sum, r) => sum + r.quoteCount, 0), icon: Eye, color: 'purple' },
          { label: 'Hohe Priorität', value: requests.filter(r => r.priority === 'HIGH').length, icon: AlertCircle, color: 'red' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
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

      {/* Requests list */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Alle</TabsTrigger>
          <TabsTrigger value="draft">Entwürfe</TabsTrigger>
          <TabsTrigger value="active">Aktiv</TabsTrigger>
          <TabsTrigger value="quotes">Mit Angeboten</TabsTrigger>
          <TabsTrigger value="completed">Abgeschlossen</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {requests.map((request, index) => {
            const StatusIcon = getStatusIcon(request.status);
            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <StatusIcon className="h-5 w-5 text-gray-400" />
                          <h3 className="font-semibold text-gray-900">{request.title}</h3>
                          <Badge className={getStatusColor(request.status)} variant="secondary">
                            {request.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(request.priority)} variant="secondary">
                            {request.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            {request.requestNumber}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Erstellt: {request.createdAt}
                          </span>
                          {request.budget && (
                            <span className="flex items-center">
                              <Euro className="h-4 w-4 mr-1" />
                              €{request.budget.toLocaleString()}
                            </span>
                          )}
                          {request.deadline && (
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Deadline: {request.deadline}
                            </span>
                          )}
                        </div>
                        <div className="mt-3 flex items-center space-x-4 text-sm">
                          <span className="text-gray-600">
                            RFQs: <span className="font-semibold">{request.rfqCount}</span>
                          </span>
                          <span className="text-gray-600">
                            Angebote: <span className="font-semibold">{request.quoteCount}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                        {request.quoteCount > 0 && (
                          <Link href={`/customer-portal/quotes?requestId=${request.id}`}>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Angebote ansehen
                            </Button>
                          </Link>
                        )}
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
