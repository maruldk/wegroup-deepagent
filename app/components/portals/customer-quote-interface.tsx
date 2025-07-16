
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Star, 
  Euro, 
  Calendar,
  Clock,
  Eye,
  CheckCircle,
  Building,
  Award,
  Zap,
  ArrowRight,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Quote {
  id: string;
  quoteNumber: string;
  supplierName: string;
  supplierRating: number;
  rfqTitle: string;
  totalPrice: number;
  currency: string;
  deliveryTime: number;
  validUntil: string;
  submittedAt: string;
  status: string;
  aiScore: number;
  aiRanking: number;
  proposal: string;
  methodology: string;
  teamSize: number;
  experience: number;
  certifications: string[];
  isRecommended: boolean;
}

export function CustomerQuoteInterface() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with demo data
    setTimeout(() => {
      setQuotes([
        {
          id: '1',
          quoteNumber: 'QUO-2024-001',
          supplierName: 'DevExperts Ltd',
          supplierRating: 4.8,
          rfqTitle: 'E-Commerce Website Development',
          totalPrice: 28500,
          currency: 'EUR',
          deliveryTime: 45,
          validUntil: '2024-02-15',
          submittedAt: '2024-01-12',
          status: 'SUBMITTED',
          aiScore: 92,
          aiRanking: 1,
          proposal: 'Umfassende E-Commerce-Lösung mit React, Node.js und modernem Design',
          methodology: 'Agile Entwicklung mit 2-Wochen-Sprints',
          teamSize: 4,
          experience: 8,
          certifications: ['AWS Certified', 'Scrum Master'],
          isRecommended: true
        },
        {
          id: '2',
          quoteNumber: 'QUO-2024-002',
          supplierName: 'Creative Design Studio',
          supplierRating: 4.5,
          rfqTitle: 'Digital Marketing Campaign',
          totalPrice: 16200,
          currency: 'EUR',
          deliveryTime: 30,
          validUntil: '2024-02-20',
          submittedAt: '2024-01-13',
          status: 'SUBMITTED',
          aiScore: 88,
          aiRanking: 2,
          proposal: 'Ganzheitliche Marketing-Strategie mit SEO, SEM und Social Media',
          methodology: 'Datengetriebener Ansatz mit monatlichen Reports',
          teamSize: 3,
          experience: 6,
          certifications: ['Google Ads Certified', 'Facebook Marketing'],
          isRecommended: true
        },
        {
          id: '3',
          quoteNumber: 'QUO-2024-003',
          supplierName: 'HR Solutions Pro',
          supplierRating: 4.2,
          rfqTitle: 'Senior Developer Recruitment',
          totalPrice: 9800,
          currency: 'EUR',
          deliveryTime: 60,
          validUntil: '2024-02-25',
          submittedAt: '2024-01-14',
          status: 'UNDER_REVIEW',
          aiScore: 85,
          aiRanking: 3,
          proposal: 'Executive Search mit 6-monatiger Garantie',
          methodology: 'Strukturierter Recruiting-Prozess mit Assessment Center',
          teamSize: 2,
          experience: 12,
          certifications: ['SHRM Certified'],
          isRecommended: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-700';
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-700';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-700';
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-gray-600';
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
          <h1 className="text-2xl font-bold text-gray-900">Meine Angebote</h1>
          <p className="text-gray-600">Vergleichen und bewerten Sie eingegangene Angebote</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Vergleichsreport
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Eingegangene Angebote', value: quotes.length, icon: MessageSquare, color: 'blue' },
          { label: 'KI-Empfehlungen', value: quotes.filter(q => q.isRecommended).length, icon: Zap, color: 'purple' },
          { label: 'Durchschnittspreis', value: `€${Math.round(quotes.reduce((sum, q) => sum + q.totalPrice, 0) / quotes.length).toLocaleString()}`, icon: Euro, color: 'green' },
          { label: 'Beste Bewertung', value: Math.max(...quotes.map(q => q.supplierRating)).toFixed(1), icon: Star, color: 'yellow' },
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

      {/* Quotes list */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Alle Angebote</TabsTrigger>
          <TabsTrigger value="recommended">KI-Empfehlungen</TabsTrigger>
          <TabsTrigger value="reviewed">Geprüft</TabsTrigger>
          <TabsTrigger value="accepted">Akzeptiert</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {quotes
            .sort((a, b) => b.aiScore - a.aiScore)
            .map((quote, index) => (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`hover:shadow-lg transition-all cursor-pointer ${
                  quote.isRecommended ? 'border-l-4 border-l-purple-500 bg-purple-50/30' : 'border-l-4 border-l-blue-500'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{quote.supplierName}</h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">{quote.supplierRating}</span>
                          </div>
                          {quote.isRecommended && (
                            <Badge className="bg-purple-100 text-purple-700" variant="secondary">
                              <Zap className="h-3 w-3 mr-1" />
                              KI-Empfehlung
                            </Badge>
                          )}
                          <Badge className={getStatusColor(quote.status)} variant="secondary">
                            {quote.status.replace('_', ' ')}
                          </Badge>
                          <Badge className="bg-gray-100 text-gray-700" variant="secondary">
                            Rang #{quote.aiRanking}
                          </Badge>
                        </div>

                        <p className="text-gray-600 mb-3">{quote.proposal}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">€{quote.totalPrice.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Gesamtpreis</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">{quote.deliveryTime}</p>
                            <p className="text-sm text-gray-600">Tage Lieferzeit</p>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <p className={`text-2xl font-bold ${getAIScoreColor(quote.aiScore)}`}>{quote.aiScore}</p>
                            <p className="text-sm text-gray-600">KI-Score</p>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 rounded-lg">
                            <p className="text-2xl font-bold text-yellow-600">{quote.experience}</p>
                            <p className="text-sm text-gray-600">Jahre Erfahrung</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            Team: {quote.teamSize} Personen
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Eingereicht: {quote.submittedAt}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Gültig bis: {quote.validUntil}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 mb-3">
                          <span className="text-sm text-gray-600">Methodik:</span>
                          <span className="text-sm font-medium">{quote.methodology}</span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {quote.certifications.map((cert, i) => (
                            <span
                              key={i}
                              className="inline-block px-2 py-1 bg-blue-100 text-xs text-blue-700 rounded"
                            >
                              <Award className="h-3 w-3 inline mr-1" />
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2 ml-6">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Akzeptieren
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Nachfragen
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
