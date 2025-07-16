
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Brain,
  Euro,
  AlertTriangle,
  CheckCircle,
  Eye,
  Calendar,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ReferenceLine
} from 'recharts'
import { useState } from 'react'

interface ForecastData {
  month: string
  predictedInflow: number
  predictedOutflow: number
  netCashFlow: number
  confidence: number
}

interface Props {
  forecast?: ForecastData[]
}

export function CashFlowForecast({ forecast }: Props) {
  const [selectedPeriod, setSelectedPeriod] = useState('12m')
  const [viewType, setViewType] = useState('combined')

  // Mock data if no forecast provided
  const mockForecast: ForecastData[] = [
    { month: 'Jul 24', predictedInflow: 85000, predictedOutflow: 62000, netCashFlow: 23000, confidence: 92 },
    { month: 'Aug 24', predictedInflow: 78000, predictedOutflow: 58000, netCashFlow: 20000, confidence: 89 },
    { month: 'Sep 24', predictedInflow: 92000, predictedOutflow: 65000, netCashFlow: 27000, confidence: 85 },
    { month: 'Okt 24', predictedInflow: 88000, predictedOutflow: 61000, netCashFlow: 27000, confidence: 82 },
    { month: 'Nov 24', predictedInflow: 95000, predictedOutflow: 68000, netCashFlow: 27000, confidence: 78 },
    { month: 'Dez 24', predictedInflow: 105000, predictedOutflow: 72000, netCashFlow: 33000, confidence: 75 },
    { month: 'Jan 25', predictedInflow: 82000, predictedOutflow: 59000, netCashFlow: 23000, confidence: 72 },
    { month: 'Feb 25', predictedInflow: 87000, predictedOutflow: 62000, netCashFlow: 25000, confidence: 68 },
    { month: 'Mär 25', predictedInflow: 91000, predictedOutflow: 64000, netCashFlow: 27000, confidence: 65 },
    { month: 'Apr 25', predictedInflow: 89000, predictedOutflow: 63000, netCashFlow: 26000, confidence: 62 },
    { month: 'Mai 25', predictedInflow: 96000, predictedOutflow: 67000, netCashFlow: 29000, confidence: 58 },
    { month: 'Jun 25', predictedInflow: 98000, predictedOutflow: 69000, netCashFlow: 29000, confidence: 55 }
  ]

  const data = forecast || mockForecast

  // Calculate summary metrics
  const totalInflow = data.reduce((sum, item) => sum + item.predictedInflow, 0)
  const totalOutflow = data.reduce((sum, item) => sum + item.predictedOutflow, 0)
  const totalNetFlow = totalInflow - totalOutflow
  const avgConfidence = data.reduce((sum, item) => sum + item.confidence, 0) / data.length
  
  const positiveMonths = data.filter(item => item.netCashFlow > 0).length
  const negativeMonths = data.filter(item => item.netCashFlow < 0).length

  // Get trend indicators
  const firstThree = data.slice(0, 3)
  const lastThree = data.slice(-3)
  const earlyAvg = firstThree.reduce((sum, item) => sum + item.netCashFlow, 0) / 3
  const lateAvg = lastThree.reduce((sum, item) => sum + item.netCashFlow, 0) / 3
  const trend = lateAvg > earlyAvg ? 'positive' : lateAvg < earlyAvg ? 'negative' : 'stable'

  const formatCurrency = (value: number) => {
    return `€${(value / 1000).toFixed(0)}k`
  }

  const formatTooltipCurrency = (value: number) => {
    return `€${value.toLocaleString('de-DE')}`
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Geplante Einnahmen
            </CardTitle>
            <ArrowDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              €{totalInflow.toLocaleString('de-DE')}
            </div>
            <p className="text-xs text-blue-700">
              Durchschnitt: €{Math.round(totalInflow / 12).toLocaleString('de-DE')}/Monat
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">
              Geplante Ausgaben
            </CardTitle>
            <ArrowUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              €{totalOutflow.toLocaleString('de-DE')}
            </div>
            <p className="text-xs text-red-700">
              Durchschnitt: €{Math.round(totalOutflow / 12).toLocaleString('de-DE')}/Monat
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Netto-Cashflow
            </CardTitle>
            {trend === 'positive' ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : trend === 'negative' ? (
              <TrendingDown className="h-4 w-4 text-red-600" />
            ) : (
              <Activity className="h-4 w-4 text-blue-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalNetFlow >= 0 ? 'text-green-900' : 'text-red-900'}`}>
              €{totalNetFlow.toLocaleString('de-DE')}
            </div>
            <p className="text-xs text-green-700">
              {positiveMonths} positive, {negativeMonths} negative Monate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              KI-Confidence
            </CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {avgConfidence.toFixed(0)}%
            </div>
            <p className="text-xs text-purple-700">
              Prognose-Genauigkeit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Alert */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-amber-800">
            <Brain className="h-5 w-5" />
            <span>KI-Cashflow-Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="bg-amber-100 p-2 rounded-full">
                {trend === 'positive' ? (
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-amber-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Trend: {trend === 'positive' ? 'Positiv' : trend === 'negative' ? 'Negativ' : 'Stabil'}
                </p>
                <p className="text-sm text-amber-700">
                  {trend === 'positive' 
                    ? 'Cashflow verbessert sich in den kommenden Monaten. Gute Liquiditätslage erwartet.'
                    : trend === 'negative'
                    ? 'Cashflow verschlechtert sich. Empfehlung: Ausgaben reduzieren oder Einnahmen steigern.'
                    : 'Stabiler Cashflow. Keine größeren Schwankungen erwartet.'
                  }
                </p>
              </div>
            </div>
            
            {negativeMonths > 0 && (
              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 p-2 rounded-full">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Warnung: {negativeMonths} Monate mit negativem Cashflow
                  </p>
                  <p className="text-sm text-amber-700">
                    Empfehlung: Liquiditätsreserven sicherstellen und Zahlungstermine optimieren.
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-start space-x-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <Target className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Optimierung: Zahlungsziele anpassen
                </p>
                <p className="text-sm text-amber-700">
                  Durch Verkürzung der Zahlungsziele um 5 Tage könnte der Cashflow um 8-12% verbessert werden.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6m">6 Monate</SelectItem>
              <SelectItem value="12m">12 Monate</SelectItem>
              <SelectItem value="24m">24 Monate</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={viewType} onValueChange={setViewType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="combined">Kombiniert</SelectItem>
              <SelectItem value="separate">Getrennt</SelectItem>
              <SelectItem value="net">Nur Netto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            <Eye className="h-3 w-3 mr-1" />
            Machine Learning
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Brain className="h-3 w-3 mr-1" />
            {avgConfidence.toFixed(0)}% Genauigkeit
          </Badge>
        </div>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>Cashflow-Prognose (12 Monate)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewType === 'combined' ? (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatTooltipCurrency(value),
                    name === 'predictedInflow' ? 'Einnahmen' :
                    name === 'predictedOutflow' ? 'Ausgaben' : 'Netto-Cashflow'
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="predictedInflow"
                  stackId="1"
                  stroke="#72BF78"
                  fill="#72BF7850"
                  name="Einnahmen"
                />
                <Area
                  type="monotone"
                  dataKey="predictedOutflow"
                  stackId="2"
                  stroke="#FF6363"
                  fill="#FF636350"
                  name="Ausgaben"
                />
                <Line
                  type="monotone"
                  dataKey="netCashFlow"
                  stroke="#60B5FF"
                  strokeWidth={3}
                  name="Netto-Cashflow"
                />
                <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" />
              </AreaChart>
            </ResponsiveContainer>
          ) : viewType === 'separate' ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatTooltipCurrency(value),
                    name === 'predictedInflow' ? 'Einnahmen' : 'Ausgaben'
                  ]}
                />
                <Legend />
                <Bar dataKey="predictedInflow" fill="#72BF78" name="Einnahmen" />
                <Bar dataKey="predictedOutflow" fill="#FF6363" name="Ausgaben" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  formatter={(value: number) => [formatTooltipCurrency(value), 'Netto-Cashflow']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="netCashFlow"
                  stroke="#60B5FF"
                  strokeWidth={3}
                  name="Netto-Cashflow"
                  dot={{ fill: '#60B5FF', strokeWidth: 2, r: 4 }}
                />
                <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Confidence Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>Prognose-Genauigkeit</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Confidence']}
              />
              <Area
                type="monotone"
                dataKey="confidence"
                stroke="#A19AD3"
                fill="#A19AD350"
                name="Confidence"
              />
              <ReferenceLine y={70} stroke="#FFA500" strokeDasharray="5 5" label="Min. Threshold" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
