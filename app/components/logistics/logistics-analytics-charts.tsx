
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'
import { Package, Truck, TrendingUp, Target } from 'lucide-react'

interface LogisticsAnalyticsCharts {
  overview: {
    totalShipments: number
    activeShipments: number
    deliveredShipments: number
    delayedShipments: number
    deliveryRate: number
    onTimeRate: number
    avgDeliveryTime: number
    avgEfficiency: number
    totalCO2: number
  }
  shipmentsByStatus: Array<{
    status: string
    count: number
    percentage: number
  }>
  shipmentsByCarrier: Array<{
    carrierName: string
    count: number
    percentage: number
  }>
  monthlyTrends?: Array<{
    month: string
    totalShipments: number
    delivered: number
    avgEfficiency: number
    totalCO2: number
  }>
  aiMetrics: {
    avgEfficiency: number
    avgDeliveryProbability: number
    avgPredictedDelay: number
    optimizationRate: number
    carbonEfficiency: number
  }
}

interface Props {
  analytics: LogisticsAnalyticsCharts | null
}

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3', '#A19AD3', '#72BF78', '#FFB366']

const statusLabels: { [key: string]: string } = {
  'REGISTERED': 'Registriert',
  'PICKED_UP': 'Abgeholt',
  'IN_TRANSIT': 'Unterwegs',
  'OUT_FOR_DELIVERY': 'Zur Zustellung',
  'DELIVERED': 'Zugestellt',
  'EXCEPTION': 'Ausnahme',
  'CANCELLED': 'Storniert',
  'RETURNED': 'Retourniert'
}

export function LogisticsAnalyticsCharts({ analytics }: Props) {
  if (!analytics) {
    return <div>Lade Analytics...</div>
  }

  // Prepare shipment status data
  const shipmentStatusData = analytics.shipmentsByStatus.map(status => ({
    ...status,
    statusLabel: statusLabels[status.status] || status.status,
    fill: COLORS[Math.abs(status.status.charCodeAt(0)) % COLORS.length]
  }))

  // Prepare carrier data
  const carrierData = analytics.shipmentsByCarrier.slice(0, 5).map((carrier, index) => ({
    ...carrier,
    fill: COLORS[index % COLORS.length]
  }))

  // Prepare monthly trends data
  const monthlyTrendData = analytics.monthlyTrends?.reverse() || []

  // Calculate efficiency trend
  const efficiencyTrendData = monthlyTrendData.map(month => ({
    month: month.month,
    efficiency: month.avgEfficiency,
    co2: month.totalCO2,
    deliveryRate: month.delivered > 0 ? (month.delivered / month.totalShipments * 100) : 0
  }))

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Shipment Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-blue-600" />
            <span>Sendungen nach Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={shipmentStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ statusLabel, percentage }) => 
                  percentage > 5 ? `${statusLabel} ${percentage}%` : ''
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {shipmentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [value, 'Sendungen']}
                labelFormatter={(label) => `Status: ${label}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Carrier Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5 text-green-600" />
            <span>Carrier Verteilung</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={carrierData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="carrierName" 
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip 
                formatter={(value: number) => [value, 'Sendungen']}
                labelFormatter={(label) => `Carrier: ${label}`}
              />
              <Bar dataKey="count" fill="#72BF78" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Delivery Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span>Liefertrends (6 Monate)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tick={{ fontSize: 10 }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'totalShipments' ? value : 
                  name === 'delivered' ? value :
                  `${value.toFixed(1)}%`,
                  name === 'totalShipments' ? 'Gesamt' : 
                  name === 'delivered' ? 'Zugestellt' : 'Lieferrate'
                ]}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="totalShipments"
                stackId="1"
                stroke="#60B5FF"
                fill="#60B5FF50"
                name="Gesamt Sendungen"
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="delivered"
                stackId="2"
                stroke="#72BF78"
                fill="#72BF7850"
                name="Zugestellt"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgEfficiency"
                stroke="#FF9149"
                strokeWidth={3}
                name="Effizienz %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* AI Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-orange-600" />
            <span>KI-Performance Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Routen-Effizienz</span>
              <span className="text-2xl font-bold text-green-600">
                {analytics.aiMetrics.avgEfficiency.toFixed(1)}%
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Lieferprognose-Genauigkeit</span>
                <span className="font-medium">{analytics.aiMetrics.avgDeliveryProbability.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Durchschnittliche Verspätung</span>
                <span className="font-medium">{analytics.aiMetrics.avgPredictedDelay.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Automatisierungsgrad</span>
                <span className="font-medium">{analytics.aiMetrics.optimizationRate}%</span>
              </div>
            </div>

            {/* AI Efficiency Visualization */}
            <div className="pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>KI-Optimierung</span>
                <span className="font-medium">{analytics.aiMetrics.optimizationRate}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.aiMetrics.optimizationRate}%` }}
                />
              </div>
            </div>

            {/* CO2 Efficiency */}
            <div className="pt-4 border-t">
              <div className="text-xs text-gray-500 mb-2">Nachhaltigkeit</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-500">CO2-Effizienz</div>
                  <div className="font-medium text-green-600">{analytics.aiMetrics.carbonEfficiency}kg</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Gesamt CO2</div>
                  <div className="font-medium text-orange-600">{analytics.overview.totalCO2.toFixed(1)}kg</div>
                </div>
              </div>
            </div>

            {/* Real-time Status */}
            <div className="pt-4 border-t">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600">Live KI-Optimierung aktiv</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
