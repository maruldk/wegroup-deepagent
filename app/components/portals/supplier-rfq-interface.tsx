
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  Clock, 
  Euro, 
  Eye,
  MessageSquare,
  Calendar,
  ArrowRight,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  category: string;
  serviceType: string;
  budget?: number;
  deadline: string;
  publishedAt: string;
  description: string;
  requirements: string[];
  customerCompany: string;
  isNew: boolean;
  matchScore: number;
  quoteCount: number;
  timeLeft: string;
}

export function SupplierRFQInterface() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with demo data
    setTimeout(() => {
      setRfqs([
        {
          id: '1',
          rfqNumber: 'RFQ-2024-001',
          title: 'E-Commerce Website Development',
          category: 'IT_SERVICES',
          serviceType: 'SOFTWARE_DEVELOPMENT',
          budget: 25000,
          deadline: '2024-02-15',
          publishedAt: '2024-01-15',
          description: 'Development of a modern e-commerce platform with React and Node.js',
          requirements: ['React', 'Node.js', 'Payment Integration', 'Responsive Design'],
          customerCompany: 'TechStart GmbH',
          isNew: true,
          matchScore: 95,
          quoteCount: 2,
          timeLeft: '14 Tage'
        },
        {
          id: '2',
          rfqNumber: 'RFQ-2024-002',
          title: 'Digital Marketing Campaign',
          category: 'MARKETING_SERVICES',
          serviceType: 'DIGITAL_MARKETING',
          budget: 15000,
          deadline: '2024-02-20',
          publishedAt: '2024-01-12',
          description: 'Comprehensive digital marketing strategy with SEO, SEM and social media',
          requirements: ['Google Ads', 'Facebook Marketing', 'SEO', 'Content Creation'],
          customerCompany: 'Marketing Pro AG',
          isNew: true,
          matchScore: 88,
          quoteCount: 4,
          timeLeft: '19 Tage'
        },
        {
          id: '3',
          rfqNumber: 'RFQ-2024-003',
          title: 'Senior Developer Recruitment',
          category: 'HR_SERVICES',
          serviceType: 'RECRUITMENT',
          budget: 8000,
          deadline: '2024-02-25',
          publishedAt: '2024-01-10',
          description: 'Search and selection of a Senior Full-Stack Developer',
          requirements: ['5+ years experience', 'React', 'Node.js', 'Team Leadership'],
          customerCompany: 'Global Consulting',
          isNew: false,
          matchScore: 82,
          quoteCount: 3,
          timeLeft: '24 Tage'
        },
        {
          id: '4',
          rfqNumber: 'RFQ-2024-004',
          title: 'Legal Contract Review',
          category: 'LEGAL_SERVICES',
          serviceType: 'CONTRACT_LAW',
          budget: 12000,
          deadline: '2024-03-01',
          publishedAt: '2024-01-08',
          description: 'Legal review and optimization of customer contracts',
          requirements: ['Contract Law', 'German & English', 'SaaS Experience'],
          customerCompany: 'FinanceFirst AG',
          isNew: false,
          matchScore: 76,
          quoteCount: 1,
          timeLeft: '29 Tage'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'IT_SERVICES':
        return 'bg-blue-100 text-blue-700';
      case 'MARKETING_SERVICES':
        return 'bg-green-100 text-green-700';
      case 'HR_SERVICES':
        return 'bg-purple-100 text-purple-700';
      case 'LEGAL_SERVICES':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-gray-600';
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
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Verfügbare RFQs</h1>
        <p className="text-green-100">
          Entdecken Sie neue Geschäftsmöglichkeiten passend zu Ihren Services
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Verfügbare RFQs', value: rfqs.length, icon: Briefcase, color: 'blue' },
          { label: 'Neue heute', value: rfqs.filter(r => r.isNew).length, icon: AlertCircle, color: 'green' },
          { label: 'Hohe Übereinstimmung', value: rfqs.filter(r => r.matchScore >= 90).length, icon: Star, color: 'yellow' },
          { label: 'Ablaufend bald', value: rfqs.filter(r => parseInt(r.timeLeft) <= 7).length, icon: Clock, color: 'red' },
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="RFQs durchsuchen..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* RFQs list */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Alle RFQs</TabsTrigger>
          <TabsTrigger value="new">Neu</TabsTrigger>
          <TabsTrigger value="matched">Passend</TabsTrigger>
          <TabsTrigger value="urgent">Dringend</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {rfqs.map((rfq, index) => (
            <motion.div
              key={rfq.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{rfq.title}</h3>
                        {rfq.isNew && (
                          <Badge className="bg-green-100 text-green-700" variant="secondary">
                            Neu
                          </Badge>
                        )}
                        <Badge className={getCategoryColor(rfq.category)} variant="secondary">
                          {rfq.category.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{rfq.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                        <span className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {rfq.rfqNumber}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Deadline: {rfq.deadline}
                        </span>
                        {rfq.budget && (
                          <span className="flex items-center">
                            <Euro className="h-4 w-4 mr-1" />
                            €{rfq.budget.toLocaleString()}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {rfq.timeLeft} verbleibend
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            Kunde: <span className="font-semibold">{rfq.customerCompany}</span>
                          </span>
                          <span className="text-sm text-gray-600">
                            Angebote: <span className="font-semibold">{rfq.quoteCount}</span>
                          </span>
                          <span className={`text-sm font-semibold ${getMatchScoreColor(rfq.matchScore)}`}>
                            <Star className="h-4 w-4 inline mr-1" />
                            {rfq.matchScore}% Match
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {rfq.requirements.slice(0, 4).map((req, i) => (
                          <span
                            key={i}
                            className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded"
                          >
                            {req}
                          </span>
                        ))}
                        {rfq.requirements.length > 4 && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                            +{rfq.requirements.length - 4} weitere
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2 ml-6">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Angebot erstellen
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
