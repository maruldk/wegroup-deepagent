
'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Zap,
  Target,
  Shield,
  DollarSign,
  Users,
  Activity,
  Lightbulb,
  Clock,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface AIInsightsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AIRecommendation {
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  impact: string;
  implementation: string;
  timeframe: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface AIAlert {
  type: 'WARNING' | 'ERROR' | 'INFO';
  message: string;
  action: string;
}

interface AIInsights {
  summary: {
    overallScore: number;
    keyInsights: string[];
    criticalIssues: string[];
  };
  recommendations: AIRecommendation[];
  metrics: {
    userEngagement: number;
    systemHealth: number;
    securityPosture: number;
    costEfficiency: number;
    growthPotential: number;
  };
  predictions: {
    userGrowth: string;
    resourceNeeds: string;
    planUpgrade: string;
  };
  alerts: AIAlert[];
}

const CATEGORY_ICONS = {
  'Performance': BarChart3,
  'Security': Shield,
  'Cost': DollarSign,
  'Growth': TrendingUp,
  'User Experience': Users
};

const CATEGORY_COLORS = {
  'Performance': 'bg-blue-100 text-blue-700',
  'Security': 'bg-red-100 text-red-700',
  'Cost': 'bg-green-100 text-green-700',
  'Growth': 'bg-purple-100 text-purple-700',
  'User Experience': 'bg-yellow-100 text-yellow-700'
};

const PRIORITY_COLORS = {
  'HIGH': 'bg-red-100 text-red-700 border-red-200',
  'MEDIUM': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'LOW': 'bg-green-100 text-green-700 border-green-200'
};

const ALERT_ICONS = {
  'WARNING': AlertTriangle,
  'ERROR': AlertTriangle,
  'INFO': CheckCircle
};

const ALERT_COLORS = {
  'WARNING': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'ERROR': 'bg-red-100 text-red-700 border-red-200',
  'INFO': 'bg-blue-100 text-blue-700 border-blue-200'
};

export function AITenantInsightsPanel({ open, onOpenChange }: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAIInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/tenants/ai-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisType: 'comprehensive' })
      });

      if (!response.ok) throw new Error('Failed to fetch AI insights');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              // Parse final response
              try {
                const aiInsights = JSON.parse(buffer);
                setInsights(aiInsights);
              } catch (parseError) {
                console.error('Error parsing AI insights:', parseError);
                setError('Fehler beim Verarbeiten der KI-Analyse');
              }
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                buffer += parsed.content;
              } else if (parsed.type === 'complete') {
                setInsights(parsed.data);
                return;
              } else if (parsed.type === 'error') {
                setError(parsed.error);
                return;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      setError('Fehler beim Laden der KI-Einblicke');
      toast.error('Fehler beim Laden der KI-Einblicke');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open && !insights) {
      fetchAIInsights();
    }
  }, [open]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return TrendingUp;
    return AlertTriangle;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Brain className="h-6 w-6 text-purple-600" />
            KI-Mandanten-Einblicke
          </DialogTitle>
          <DialogDescription>
            Intelligente Analyse und Empfehlungen für Ihr Mandantenmanagement
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {loading && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-6 w-6 animate-spin text-purple-600" />
                    <span className="text-lg font-medium">KI analysiert Ihre Mandanten...</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-purple-600"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </div>
                  <p className="text-sm text-center text-gray-600">
                    Analysiere Tenant-Daten, Benutzerverhalten und Performance-Metriken...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="border-red-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-red-700">
                  <AlertTriangle className="h-6 w-6" />
                  <div>
                    <h3 className="font-medium">Fehler beim Laden der KI-Einblicke</h3>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
                <Button 
                  onClick={fetchAIInsights} 
                  className="mt-4"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Erneut versuchen
                </Button>
              </CardContent>
            </Card>
          )}

          {insights && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Overall Score & Summary */}
                <Card className="border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      Gesamtbewertung & Zusammenfassung
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${getScoreColor(insights.summary.overallScore)}`}>
                          {insights.summary.overallScore}%
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Gesamtbewertung</div>
                        <div className="flex items-center justify-center mt-2">
                          {React.createElement(getScoreIcon(insights.summary.overallScore), {
                            className: `h-5 w-5 ${getScoreColor(insights.summary.overallScore)}`
                          })}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          Wichtige Erkenntnisse
                        </h4>
                        <ul className="space-y-1">
                          {insights.summary.keyInsights.map((insight, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          Kritische Probleme
                        </h4>
                        <ul className="space-y-1">
                          {insights.summary.criticalIssues.map((issue, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Performance-Metriken
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {Object.entries(insights.metrics).map(([key, value]) => {
                        const label = {
                          userEngagement: 'Benutzer-Engagement',
                          systemHealth: 'System-Gesundheit',
                          securityPosture: 'Sicherheitslage',
                          costEfficiency: 'Kosteneffizienz',
                          growthPotential: 'Wachstumspotential'
                        }[key] || key;

                        return (
                          <div key={key} className="text-center">
                            <div className={`text-2xl font-bold ${getScoreColor(value)}`}>
                              {Math.round(value)}%
                            </div>
                            <div className="text-sm text-gray-600">{label}</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  value >= 80 ? 'bg-green-500' : 
                                  value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Alerts */}
                {insights.alerts.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-600" />
                        Warnungen & Benachrichtigungen
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {insights.alerts.map((alert, index) => {
                          const AlertIcon = ALERT_ICONS[alert.type];
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`p-4 rounded-lg border ${ALERT_COLORS[alert.type]}`}
                            >
                              <div className="flex items-start gap-3">
                                <AlertIcon className="h-5 w-5 mt-0.5" />
                                <div className="flex-1">
                                  <div className="font-medium">{alert.message}</div>
                                  <div className="text-sm mt-1 opacity-80">
                                    Empfohlene Aktion: {alert.action}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      KI-Empfehlungen ({insights.recommendations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {insights.recommendations.map((rec, index) => {
                        const CategoryIcon = CATEGORY_ICONS[rec.category as keyof typeof CATEGORY_ICONS] || Target;
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start gap-4">
                              <div className={`p-2 rounded-lg ${CATEGORY_COLORS[rec.category as keyof typeof CATEGORY_COLORS] || 'bg-gray-100 text-gray-700'}`}>
                                <CategoryIcon className="h-4 w-4" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-medium text-gray-900">{rec.title}</h3>
                                  <Badge className={PRIORITY_COLORS[rec.priority]}>
                                    {rec.priority}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {rec.category}
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <div className="font-medium text-gray-700 mb-1">Auswirkung:</div>
                                    <div className="text-gray-600">{rec.impact}</div>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-700 mb-1">Zeitrahmen:</div>
                                    <div className="text-gray-600 flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {rec.timeframe}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-700 mb-1">Risiko:</div>
                                    <Badge 
                                      variant={rec.riskLevel === 'HIGH' ? 'destructive' : 
                                              rec.riskLevel === 'MEDIUM' ? 'secondary' : 'default'}
                                      className="text-xs"
                                    >
                                      {rec.riskLevel}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <ArrowRight className="h-4 w-4" />
                                    Umsetzung:
                                  </div>
                                  <div className="text-sm text-gray-600">{rec.implementation}</div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Predictions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Vorhersagen & Prognosen
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Nutzerwachstum
                        </h3>
                        <p className="text-sm text-blue-700">{insights.predictions.userGrowth}</p>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Ressourcenbedarf
                        </h3>
                        <p className="text-sm text-green-700">{insights.predictions.resourceNeeds}</p>
                      </div>
                      
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h3 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Plan-Upgrade
                        </h3>
                        <p className="text-sm text-purple-700">{insights.predictions.planUpgrade}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Schließen
            </Button>
            <Button onClick={fetchAIInsights} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Analyse aktualisieren
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
