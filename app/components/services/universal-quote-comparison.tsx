
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GitCompareArrows, 
  Star, 
  Euro, 
  Calendar,
  Building,
  Award,
  Zap,
  CheckCircle,
  Eye,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface QuoteComparison {
  id: string;
  rfqTitle: string;
  quotes: {
    id: string;
    supplierName: string;
    price: number;
    deliveryTime: number;
    qualityScore: number;
    aiScore: number;
    experience: number;
    certifications: number;
  }[];
  criteria: {
    price: number;
    quality: number;
    timeline: number;
    experience: number;
  };
}

export function UniversalQuoteComparison() {
  const [comparisons, setComparisons] = useState<QuoteComparison[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with demo data
    setTimeout(() => {
      setComparisons([
        {
          id: '1',
          rfqTitle: 'Website-Entwicklung für E-Commerce',
          quotes: [
            {
              id: '1',
              supplierName: 'DevExperts Ltd',
              price: 28500,
              deliveryTime: 45,
              qualityScore: 4.8,
              aiScore: 92,
              experience: 8,
              certifications: 3
            },
            {
              id: '2',
              supplierName: 'WebCraft Solutions',
              price: 32000,
              deliveryTime: 35,
              qualityScore: 4.5,
              aiScore: 88,
              experience: 6,
              certifications: 2
            },
            {
              id: '3',
              supplierName: 'Digital Masters',
              price: 25000,
              deliveryTime: 55,
              qualityScore: 4.2,
              aiScore: 85,
              experience: 10,
              certifications: 4
            }
          ],
          criteria: {
            price: 30,
            quality: 25,
            timeline: 20,
            experience: 25
          }
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const comparison = comparisons[0]; // For demo, show first comparison

  // Prepare data for charts
  const chartData = comparison?.quotes.map(quote => ({
    name: quote.supplierName.split(' ')[0],
    price: quote.price,
    deliveryTime: quote.deliveryTime,
    qualityScore: quote.qualityScore * 20, // Scale to 100
    aiScore: quote.aiScore,
    experience: quote.experience * 10 // Scale to 100
  }));

  const radarData = [
    { criteria: 'Preis', ...comparison?.quotes.reduce((acc, quote) => ({ 
      ...acc, 
      [quote.supplierName.split(' ')[0]]: 100 - (quote.price / Math.max(...comparison.quotes.map(q => q.price)) * 100) 
    }), {}) },
    { criteria: 'Qualität', ...comparison?.quotes.reduce((acc, quote) => ({ 
      ...acc, 
      [quote.supplierName.split(' ')[0]]: quote.qualityScore * 20 
    }), {}) },
    { criteria: 'Lieferzeit', ...comparison?.quotes.reduce((acc, quote) => ({ 
      ...acc, 
      [quote.supplierName.split(' ')[0]]: 100 - (quote.deliveryTime / Math.max(...comparison.quotes.map(q => q.deliveryTime)) * 100) 
    }), {}) },
    { criteria: 'Erfahrung', ...comparison?.quotes.reduce((acc, quote) => ({ 
      ...acc, 
      [quote.supplierName.split(' ')[0]]: quote.experience * 10 
    }), {}) }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quote Comparison</h1>
          <p className="text-gray-600">KI-gestützte Angebotsbewertung und -vergleich für optimale Entscheidungen</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Vergleichsreport
        </Button>
      </div>

      {comparison && (
        <>
          {/* RFQ Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GitCompareArrows className="h-5 w-5 mr-2" />
                {comparison.rfqTitle}
              </CardTitle>
              <CardDescription>
                Vergleich von {comparison.quotes.length} Angeboten basierend auf KI-Analyse
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Preis-Vergleich</CardTitle>
                <CardDescription>Angebotene Preise in EUR</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `€${Number(value).toLocaleString()}`} />
                    <Bar dataKey="price" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Multi-Kriterien-Vergleich</CardTitle>
                <CardDescription>Bewertung nach verschiedenen Kriterien</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="criteria" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    {comparison.quotes.map((quote, index) => (
                      <Radar
                        key={quote.id}
                        name={quote.supplierName.split(' ')[0]}
                        dataKey={quote.supplierName.split(' ')[0]}
                        stroke={['#3B82F6', '#10B981', '#F59E0B'][index]}
                        fill={['#3B82F6', '#10B981', '#F59E0B'][index]}
                        fillOpacity={0.1}
                      />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Detaillierter Vergleich</CardTitle>
              <CardDescription>Alle Angebote im direkten Vergleich</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comparison.quotes
                  .sort((a, b) => b.aiScore - a.aiScore)
                  .map((quote, index) => (
                    <motion.div
                      key={quote.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`p-4 border rounded-lg ${
                        index === 0 ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{quote.supplierName}</h3>
                            {index === 0 && (
                              <Badge className="bg-green-100 text-green-700" variant="secondary">
                                <Zap className="h-3 w-3 mr-1" />
                                KI-Empfehlung
                              </Badge>
                            )}
                            <Badge variant="outline">
                              Rang #{index + 1}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <p className="text-2xl font-bold text-blue-600">€{quote.price.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">Preis</p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <p className="text-2xl font-bold text-green-600">{quote.deliveryTime}</p>
                              <p className="text-sm text-gray-600">Tage</p>
                            </div>
                            <div className="text-center p-3 bg-yellow-50 rounded-lg">
                              <p className="text-2xl font-bold text-yellow-600">{quote.qualityScore}</p>
                              <p className="text-sm text-gray-600">Qualität</p>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <p className={`text-2xl font-bold ${getScoreColor(quote.aiScore)}`}>{quote.aiScore}</p>
                              <p className="text-sm text-gray-600">KI-Score</p>
                            </div>
                            <div className="text-center p-3 bg-orange-50 rounded-lg">
                              <p className="text-2xl font-bold text-orange-600">{quote.experience}</p>
                              <p className="text-sm text-gray-600">Jahre Erfahrung</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 mt-3">
                            <span className="flex items-center text-sm text-gray-600">
                              <Award className="h-4 w-4 mr-1" />
                              {quote.certifications} Zertifizierungen
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-6">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                          {index === 0 && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Auswählen
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
