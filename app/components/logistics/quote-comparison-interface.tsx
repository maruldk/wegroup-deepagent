
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Euro,
  Star,
  Building2,
  Package,
  Truck,
  Shield,
  Target,
  Zap,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuoteComparison {
  id: string;
  rfqId: string;
  status: string;
  bestQuoteId?: string;
  averagePrice?: number;
  comparisonData: {
    summary: {
      totalQuotes: number;
      averagePrice: number;
      bestPrice: number;
      worstPrice: number;
      averageDeliveryTime: number;
      bestDeliveryTime: number;
      worstDeliveryTime: number;
    };
    rankings: Array<{
      rank: number;
      quoteId: string;
      supplierName: string;
      overallScore: number;
      priceScore: number;
      deliveryScore: number;
      qualityScore: number;
      reliabilityScore: number;
      strengths: string[];
      weaknesses: string[];
      riskLevel: string;
    }>;
    recommendations: {
      bestValue: {
        quoteId: string;
        reason: string;
      };
      fastestDelivery: {
        quoteId: string;
        reason: string;
      };
      mostReliable: {
        quoteId: string;
        reason: string;
      };
    };
    insights: string[];
    riskAnalysis: {
      overallRisk: string;
      riskFactors: string[];
      mitigation: string[];
    };
  };
  rfq: {
    id: string;
    rfqNumber: string;
    title: string;
    quotes: Array<{
      id: string;
      supplier: {
        id: string;
        companyName: string;
        performanceScore?: number;
      };
      totalPrice: number;
      deliveryTime: number;
      status: string;
      aiScore?: number;
      aiRanking?: number;
    }>;
  };
}

interface QuoteComparisonProps {
  rfqId: string;
  onComparisonComplete?: (comparison: QuoteComparison) => void;
}

const QuoteComparisonInterface: React.FC<QuoteComparisonProps> = ({ 
  rfqId, 
  onComparisonComplete 
}) => {
  const [comparison, setComparison] = useState<QuoteComparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchComparison();
  }, [rfqId]);

  const fetchComparison = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/logistics/quotes/compare?rfqId=${rfqId}`);
      if (response.ok) {
        const data = await response.json();
        setComparison(data.comparison);
      }
    } catch (error) {
      console.error('Error fetching comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeQuotes = async () => {
    try {
      setAnalyzing(true);
      const response = await fetch('/api/logistics/quotes/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rfqId }),
      });

      if (response.ok) {
        const data = await response.json();
        setComparison(data.comparison);
        onComparisonComplete?.(data.comparison);
      }
    } catch (error) {
      console.error('Error analyzing quotes:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-500';
      case 2: return 'bg-gray-400';
      case 3: return 'bg-orange-500';
      default: return 'bg-blue-500';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Award className="h-4 w-4" />;
      case 2: return <Star className="h-4 w-4" />;
      case 3: return <Target className="h-4 w-4" />;
      default: return <span className="text-sm font-bold">#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">KI-Angebots-Vergleich</h2>
          <p className="text-gray-600 mt-1">Intelligente Analyse und Empfehlungen</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleAnalyzeQuotes}
            disabled={analyzing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {analyzing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analysiere...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Neu analysieren
              </>
            )}
          </Button>
        </div>
      </div>

      {!comparison ? (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Keine Analyse verfügbar</h3>
            <p className="text-gray-600 mb-4">
              Starten Sie die KI-Analyse, um Angebote zu vergleichen und Empfehlungen zu erhalten.
            </p>
            <Button
              onClick={handleAnalyzeQuotes}
              disabled={analyzing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analysiere...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Analyse starten
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-l-4 border-l-blue-600">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Angebote erhalten</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {comparison.comparisonData.summary.totalQuotes}
                      </p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-l-4 border-l-green-600">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Bestes Angebot</p>
                      <p className="text-2xl font-bold text-gray-900">
                        €{comparison.comparisonData.summary.bestPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingDown className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-l-4 border-l-purple-600">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Durchschnittspreis</p>
                      <p className="text-2xl font-bold text-gray-900">
                        €{comparison.comparisonData.summary.averagePrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-l-4 border-l-orange-600">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Beste Lieferzeit</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {comparison.comparisonData.summary.bestDeliveryTime} Tage
                      </p>
                    </div>
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          </div>

          {/* Rankings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-gold-600" />
                Angebots-Ranking
              </CardTitle>
              <CardDescription>
                KI-gestützte Bewertung basierend auf Preis, Lieferzeit, Qualität und Zuverlässigkeit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {comparison.comparisonData.rankings.map((ranking, index) => (
                    <motion.div
                      key={ranking.quoteId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center p-4 bg-gray-50 rounded-lg border-l-4 border-l-blue-600">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full text-white ${getRankColor(ranking.rank)}`}>
                            {getRankIcon(ranking.rank)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg">{ranking.supplierName}</h4>
                              <Badge variant="outline" className="text-green-600">
                                {ranking.overallScore.toFixed(1)}% Score
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`${getRiskColor(ranking.riskLevel)}`}
                              >
                                {ranking.riskLevel} Risiko
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-gray-600">Preis-Score</p>
                                <div className="flex items-center gap-2">
                                  <Progress value={ranking.priceScore} className="h-2 flex-1" />
                                  <span className="text-sm font-medium">{ranking.priceScore.toFixed(0)}%</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Lieferzeit-Score</p>
                                <div className="flex items-center gap-2">
                                  <Progress value={ranking.deliveryScore} className="h-2 flex-1" />
                                  <span className="text-sm font-medium">{ranking.deliveryScore.toFixed(0)}%</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Qualitäts-Score</p>
                                <div className="flex items-center gap-2">
                                  <Progress value={ranking.qualityScore} className="h-2 flex-1" />
                                  <span className="text-sm font-medium">{ranking.qualityScore.toFixed(0)}%</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Zuverlässigkeit</p>
                                <div className="flex items-center gap-2">
                                  <Progress value={ranking.reliabilityScore} className="h-2 flex-1" />
                                  <span className="text-sm font-medium">{ranking.reliabilityScore.toFixed(0)}%</span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-green-600 mb-1">Stärken</p>
                                <div className="flex flex-wrap gap-1">
                                  {ranking.strengths.map((strength, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs bg-green-100 text-green-800">
                                      {strength}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-orange-600 mb-1">Schwächen</p>
                                <div className="flex flex-wrap gap-1">
                                  {ranking.weaknesses.map((weakness, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                      {weakness}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-green-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-green-600" />
                  Bestes Preis-Leistungs-Verhältnis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">Empfehlung:</p>
                <p className="font-medium text-gray-900 mb-3">
                  Angebot {comparison.comparisonData.recommendations.bestValue.quoteId}
                </p>
                <p className="text-sm text-gray-700">
                  {comparison.comparisonData.recommendations.bestValue.reason}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  Schnellste Lieferung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">Empfehlung:</p>
                <p className="font-medium text-gray-900 mb-3">
                  Angebot {comparison.comparisonData.recommendations.fastestDelivery.quoteId}
                </p>
                <p className="text-sm text-gray-700">
                  {comparison.comparisonData.recommendations.fastestDelivery.reason}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Zuverlässigster Lieferant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">Empfehlung:</p>
                <p className="font-medium text-gray-900 mb-3">
                  Angebot {comparison.comparisonData.recommendations.mostReliable.quoteId}
                </p>
                <p className="text-sm text-gray-700">
                  {comparison.comparisonData.recommendations.mostReliable.reason}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Risk Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Risikoanalyse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600">Gesamtrisiko:</span>
                  <Badge 
                    variant="outline" 
                    className={`${getRiskColor(comparison.comparisonData.riskAnalysis.overallRisk)}`}
                  >
                    {comparison.comparisonData.riskAnalysis.overallRisk}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Risikofaktoren</h4>
                    <ul className="space-y-1">
                      {comparison.comparisonData.riskAnalysis.riskFactors.map((factor, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Risikominderung</h4>
                    <ul className="space-y-1">
                      {comparison.comparisonData.riskAnalysis.mitigation.map((mitigation, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{mitigation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                KI-Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {comparison.comparisonData.insights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="p-1 bg-blue-100 rounded-full">
                      <Zap className="h-3 w-3 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QuoteComparisonInterface;
