
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  MessageSquare,
  Calendar,
  Euro,
  User,
  Building
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ServiceRequest {
  id: string;
  requestNumber: string;
  title: string;
  category: string;
  serviceType: string;
  customerName: string;
  status: string;
  priority: string;
  budget?: number;
  deadline?: string;
  submittedAt: string;
}

export function UniversalRequestManagement() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
          customerName: 'TechStart GmbH',
          status: 'RFQ_CREATED',
          priority: 'HIGH',
          budget: 25000,
          deadline: '2024-03-15',
          submittedAt: '2024-01-15'
        },
        {
          id: '2',
          requestNumber: 'SRQ-2024-002',
          title: 'Digital Marketing Kampagne',
          category: 'MARKETING_SERVICES',
          serviceType: 'DIGITAL_MARKETING',
          customerName: 'Marketing Pro AG',
          status: 'UNDER_REVIEW',
          priority: 'MEDIUM',
          budget: 15000,
          deadline: '2024-04-01',
          submittedAt: '2024-01-12'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRequests = requests.filter(request =>
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Service Requests Management</h1>
          <p className="text-gray-600">Verwalten Sie alle eingehenden Service-Anfragen zentral und effizient</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Neue Anfrage
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Anfragen durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Requests list */}
      <div className="space-y-4">
        {filteredRequests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <h3 className="font-semibold text-gray-900">{request.title}</h3>
                      <Badge className={getStatusColor(request.status)} variant="secondary">
                        {request.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(request.priority)} variant="secondary">
                        {request.priority}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Anfrage-Nr.</p>
                        <p className="font-medium">{request.requestNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Kunde</p>
                        <p className="font-medium">{request.customerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Kategorie</p>
                        <p className="font-medium">{request.category.replace('_', ' ')}</p>
                      </div>
                      {request.budget && (
                        <div>
                          <p className="text-sm text-gray-600">Budget</p>
                          <p className="font-medium text-green-600">€{request.budget.toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Eingereicht: {request.submittedAt}
                      </span>
                      {request.deadline && (
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Deadline: {request.deadline}
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
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      RFQ erstellen
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
