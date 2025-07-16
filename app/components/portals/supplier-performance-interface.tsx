
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Star, 
  Clock, 
  Award,
  Target,
  BarChart3,
  Euro,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface PerformanceData {
  overallScore: number;
  qualityScore: number;
  responseTime: number;
  onTimeDeliveryRate: number;
  customerSatisfaction: number;
  totalOrders: number;
  totalRevenue: number;
  winRate: number;
}

export function SupplierPerformanceInterface() {
  const [performance, setPerformance] = useState<PerformanceData>({
    overallScore: 0,
    qualityScore: 0,
    responseTime: 0,
    onTimeDeliveryRate: 0,
    customerSatisfaction: 0,
    totalOrders: 0,
    totalRevenue: 0,
    winRate: 0,
  });
  const [loading, setLoading] = useState(true);

  // Demo chart data
  const monthlyData = [
    { month: 'Jan', score: 4.2, orders: 3, revenue: 15000 },
    { month: 'Feb', score: 4.4, orders: 5, revenue: 28000 },
    { month: 'Mar', score: 4.6, orders: 4, revenue: 22000 },
    { month: 'Apr', score: 4.7, orders: 6, revenue: 35000 },
    { month: 'Mai', score: 4.8, orders: 5, revenue: 30000 },
    { month: 'Jun', score: 4.8, orders: 7, revenue: 42000 },
  ];

  const radarData = [
    { criteria: 'Qualität', score: 96 },
    { criteria: 'Pünktlichkeit', score: 88 },
    { criteria: 'Kommunikation', score: 92 },
    { criteria: 'Innovation', score: 85 },
    { criteria: 'Kosten-Nutzen', score: 90 },
  ];

  useEffect(() => {
    // Simulate API call with demo data
    setTimeout(() => {
      setPerformance({
        overallScore: 4.8,
        qualityScore: 4.7,
        responseTime: 4.2,
        onTimeDeliveryRate: 88,
        customerSatisfaction: 4.6,
        totalOrders: 25,
        totalRevenue: 125000,
        winRate: 68,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meine Performance</h1>
        <p className="text-gray-600">Verfolgen Sie Ihre Leistungskennzahlen und Bewertungen</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            title: 'Gesamt-Score', 
            value: `${performance.overallScore}/5.0`, 
            icon: TrendingUp, 
            color: 'blue',
            description: 'Gesamtbewertung'
          },
          { 
            title: 'Qualitätsscore', 
            value: `${performance.qualityScore}/5.0`, 
            icon: Star, 
            color: 'yellow',
            description: 'Durchschnittliche Qualität'
          },
          { 
            title: 'Pünktlichkeit', 
            value: `${performance.onTimeDeliveryRate}%`, 
            icon: Clock, 
            color: 'green',
            description: 'Termingetreue Lieferung'
          },
          { 
            title: 'Erfolgsquote', 
            value: `${performance.winRate}%`, 
            icon: Target, 
            color: 'purple',
            description: 'Gewonnene Angebote'
          },
        ].map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className={`text-2xl font-bold ${getScoreColor(parseFloat(kpi.value))}`}>
                      {kpi.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{kpi.description}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${kpi.color}-100`}>
                    <kpi.icon className={`h-6 w-6 text-${kpi.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Response Time</h3>
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Durchschnittliche Antwortzeit</span>
                <span>{performance.responseTime}h</span>
              </div>
              <Progress value={(24 - performance.responseTime) / 24 * 100} className="h-2" />
              <p className="text-xs text-gray-500">Ziel: &lt; 6 Stunden</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Kundenzufriedenheit</h3>
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Durchschnittsbewertung</span>
                <span>{performance.customerSatisfaction}/5.0</span>
              </div>
              <Progress value={(performance.customerSatisfaction / 5) * 100} className="h-2" />
              <p className="text-xs text-gray-500">Basierend auf {performance.totalOrders} Aufträgen</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Geschäftserfolg</h3>
              <Euro className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Gesamtumsatz</span>
                <span className="font-semibold">€{performance.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Aufträge</span>
                <span className="font-semibold">{performance.totalOrders}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Ø Auftragswert</span>
                <span className="font-semibold">€{Math.round(performance.totalRevenue / performance.totalOrders).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance-Trend</CardTitle>
            <CardDescription>Entwicklung Ihrer Bewertungen über die Zeit</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[3.5, 5]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bewertungsprofil</CardTitle>
            <CardDescription>Ihre Stärken in verschiedenen Bereichen</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="criteria" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.1}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Auszeichnungen & Meilensteine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Top Performer', description: 'Performance Score > 4.5', achieved: true },
              { title: 'Zuverlässiger Partner', description: '95% Pünktlichkeitsrate', achieved: performance.onTimeDeliveryRate >= 95 },
              { title: 'Kundenliebling', description: 'Kundenzufriedenheit > 4.5', achieved: performance.customerSatisfaction >= 4.5 },
            ].map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 ${
                  achievement.achieved 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {achievement.achieved ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
