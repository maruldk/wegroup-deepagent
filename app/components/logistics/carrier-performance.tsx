
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Truck, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  Target,
  Star,
  Award,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

interface CarrierData {
  carrierName: string
  totalShipments: number
  deliverySuccessRate: number
  avgEfficiency: number
  avgDeliveryTime: number
  costEfficiency: number
  customerSatisfaction: number
  recommendationScore: number
}

interface Props {
  carriers?: CarrierData[]
}

const mockCarrierData: CarrierData[] = [
  {
    carrierName: 'DHL Express',
    totalShipments: 156,
    deliverySuccessRate: 98.5,
    avgEfficiency: 92.3,
    avgDeliveryTime: 2.1,
    costEfficiency: 87.8,
    customerSatisfaction: 94.2,
    recommendationScore: 91.6
  },
  {
    carrierName: 'UPS',
    totalShipments: 134,
    deliverySuccessRate: 96.8,
    avgEfficiency: 89.1,
    avgDeliveryTime: 2.4,
    costEfficiency: 92.1,
    customerSatisfaction: 91.7,
    recommendationScore: 89.9
  },
  {
    carrierName: 'FedEx',
    totalShipments: 98,
    deliverySuccessRate: 97.2,
    avgEfficiency: 90.5,
    avgDeliveryTime: 2.2,
    costEfficiency: 85.9,
    customerSatisfaction: 93.1,
    recommendationScore: 88.4
  },
  {
    carrierName: 'DPD',
    totalShipments: 112,
    deliverySuccessRate: 95.1,
    avgEfficiency: 86.7,
    avgDeliveryTime: 2.8,
    costEfficiency: 94.3,
    customerSatisfaction: 88.9,
    recommendationScore: 86.2
  },
  {
    carrierName: 'Hermes',
    totalShipments: 87,
    deliverySuccessRate: 93.4,
    avgEfficiency: 82.9,
    avgDeliveryTime: 3.1,
    costEfficiency: 96.2,
    customerSatisfaction: 85.6,
    recommendationScore: 82.7
  }
]

export function CarrierPerformance({ carriers }: Props) {
  const carrierData = carriers || mockCarrierData

  // Sort carriers by recommendation score
  const sortedCarriers = [...carrierData].sort((a, b) => b.recommendationScore - a.recommendationScore)

  // Prepare radar chart data
  const radarData = sortedCarriers.slice(0, 3).map(carrier => ({
    carrier: carrier.carrierName,
    'Lieferrate': carrier.deliverySuccessRate,
    'Effizienz': carrier.avgEfficiency,
    'Kosten': carrier.costEfficiency,
    'Zufriedenheit': carrier.customerSatisfaction,
    'Geschwindigkeit': Math.max(0, 100 - (carrier.avgDeliveryTime * 20)) // Convert delivery time to score
  }))

  // Prepare bar chart data for comparison
  const comparisonData = sortedCarriers.map(carrier => ({
    name: carrier.carrierName.length > 8 ? carrier.carrierName.substring(0, 8) + '...' : carrier.carrierName,
    fullName: carrier.carrierName,
    recommendation: carrier.recommendationScore,
    efficiency: carrier.avgEfficiency,
    satisfaction: carrier.customerSatisfaction
  }))

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 90) {
      return <Badge className="bg-green-100 text-green-800">Exzellent</Badge>
    } else if (score >= 80) {
      return <Badge className="bg-blue-100 text-blue-800">Gut</Badge>
    } else if (score >= 70) {
      return <Badge className="bg-yellow-100 text-yellow-800">Befriedigend</Badge>
    } else {
      return <Badge variant="destructive">Verbesserung nötig</Badge>
    }
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Award className="h-5 w-5 text-yellow-500" />
      case 1:
        return <Award className="h-5 w-5 text-gray-400" />
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <Truck className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Performance Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Top Performer
            </CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {sortedCarriers[0]?.carrierName || 'N/A'}
            </div>
            <p className="text-xs text-green-700">
              {sortedCarriers[0]?.recommendationScore?.toFixed(1) || 0}% Bewertung
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Durchschnitt Lieferzeit
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {(carrierData.reduce((sum, c) => sum + c.avgDeliveryTime, 0) / carrierData.length).toFixed(1)}d
            </div>
            <p className="text-xs text-blue-700">
              Über alle Carrier
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Gesamt Sendungen
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {carrierData.reduce((sum, c) => sum + c.totalShipments, 0)}
            </div>
            <p className="text-xs text-purple-700">
              Letzte 30 Tage
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Carrier Rankings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-orange-600" />
              <span>Carrier-Ranking</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedCarriers.map((carrier, index) => (
                <div key={carrier.carrierName} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(index)}
                    <span className="text-sm font-medium">#{index + 1}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold truncate">{carrier.carrierName}</h4>
                      {getPerformanceBadge(carrier.recommendationScore)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>{carrier.deliverySuccessRate.toFixed(1)}% Erfolg</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{carrier.avgDeliveryTime.toFixed(1)}d Ø-Zeit</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>{carrier.customerSatisfaction.toFixed(1)}% Zufriedenheit</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>{carrier.totalShipments} Sendungen</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getPerformanceColor(carrier.recommendationScore)}`}>
                      {carrier.recommendationScore.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Performance Vergleich</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData[0] ? [radarData[0]] : []}>
                <PolarGrid />
                <PolarAngleAxis 
                  dataKey="carrier" 
                  tick={{ fontSize: 10 }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  tick={{ fontSize: 8 }}
                />
                <Radar
                  name="Lieferrate"
                  dataKey="Lieferrate"
                  stroke="#60B5FF"
                  fill="#60B5FF"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Effizienz"
                  dataKey="Effizienz"
                  stroke="#72BF78"
                  fill="#72BF78"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Kosten"
                  dataKey="Kosten"
                  stroke="#FF9149"
                  fill="#FF9149"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Zufriedenheit"
                  dataKey="Zufriedenheit"
                  stroke="#A19AD3"
                  fill="#A19AD3"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Geschwindigkeit"
                  dataKey="Geschwindigkeit"
                  stroke="#FF90BB"
                  fill="#FF90BB"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            <span>Detaillierter Leistungsvergleich</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip 
                formatter={(value: any, name: any) => [
                  `${value.toFixed(1)}%`,
                  name === 'recommendation' ? 'Empfehlung' :
                  name === 'efficiency' ? 'Effizienz' : 'Zufriedenheit'
                ]}
                labelFormatter={(label: any, payload: any) => {
                  const data = payload?.[0]?.payload
                  return data ? data.fullName : label
                }}
              />
              <Legend />
              <Bar 
                dataKey="recommendation" 
                fill="#60B5FF" 
                name="Empfehlung"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="efficiency" 
                fill="#72BF78" 
                name="Effizienz"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="satisfaction" 
                fill="#FF9149" 
                name="Zufriedenheit"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card className="border-indigo-200 bg-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-indigo-800">
            <TrendingUp className="h-5 w-5" />
            <span>KI-Carrier-Empfehlungen</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Award className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-800">
                  Beste Wahl: {sortedCarriers[0]?.carrierName}
                </p>
                <p className="text-sm text-indigo-700">
                  Höchste Gesamtbewertung mit {sortedCarriers[0]?.recommendationScore?.toFixed(1)}%. 
                  Besonders stark bei Lieferzuverlässigkeit und Kundenzufriedenheit.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Target className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-800">
                  Kostenoptimal: {carrierData.find(c => c.costEfficiency === Math.max(...carrierData.map(x => x.costEfficiency)))?.carrierName}
                </p>
                <p className="text-sm text-indigo-700">
                  Beste Kosteneffizienz für Standardsendungen. 
                  Ideal für preissensitive Sendungen ohne Zeitdruck.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Clock className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-800">
                  Schnellster: {carrierData.find(c => c.avgDeliveryTime === Math.min(...carrierData.map(x => x.avgDeliveryTime)))?.carrierName}
                </p>
                <p className="text-sm text-indigo-700">
                  Kürzeste durchschnittliche Lieferzeit. 
                  Empfohlen für express und zeitkritische Sendungen.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
