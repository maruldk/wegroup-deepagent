
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
import { Euro, Receipt, TrendingUp, Users } from 'lucide-react'

interface FinanceAnalyticsCharts {
  overview: {
    totalInvoices: number
    pendingInvoices: number
    paidInvoices: number
    overdueInvoices: number
    totalAmount: number
    paidAmount: number
    pendingAmount: number
    paymentRate: number
    avgInvoiceAmount: number
    avgProcessingTime: number
    duplicateCount: number
  }
  invoicesByStatus: Array<{
    status: string
    count: number
    percentage: number
  }>
  invoicesByMonth?: Array<{
    month: string
    count: number
    amount: number
  }>
  topVendors: Array<{
    vendorName: string
    totalAmount: number
    invoiceCount: number
    avgAmount: number
  }>
  aiMetrics: {
    ocrAccuracy: number
    processedInvoices: number
    duplicatesDetected: number
    automationRate: number
  }
}

interface Props {
  analytics: FinanceAnalyticsCharts | null
}

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3', '#A19AD3', '#72BF78', '#FFB366']

const statusLabels: { [key: string]: string } = {
  'RECEIVED': 'Eingegangen',
  'OCR_IN_PROGRESS': 'OCR läuft',
  'OCR_COMPLETED': 'OCR fertig',
  'VALIDATION_PENDING': 'Validierung',
  'VALIDATED': 'Validiert',
  'APPROVED': 'Genehmigt',
  'PAID': 'Bezahlt',
  'REJECTED': 'Abgelehnt'
}

export function FinanceAnalyticsCharts({ analytics }: Props) {
  if (!analytics) {
    return <div>Lade Analytics...</div>
  }

  // Prepare invoice status data
  const invoiceStatusData = analytics.invoicesByStatus.map(status => ({
    ...status,
    statusLabel: statusLabels[status.status] || status.status,
    fill: COLORS[Math.abs(status.status.charCodeAt(0)) % COLORS.length]
  }))

  // Prepare top vendors data
  const topVendorsData = analytics.topVendors.slice(0, 5).map((vendor, index) => ({
    ...vendor,
    displayName: vendor.vendorName.length > 15 
      ? vendor.vendorName.substring(0, 15) + '...' 
      : vendor.vendorName,
    fill: COLORS[index % COLORS.length]
  }))

  // Prepare monthly trend data
  const monthlyTrendData = analytics.invoicesByMonth?.reverse() || []

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Invoice Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5 text-blue-600" />
            <span>Rechnungen nach Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={invoiceStatusData}
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
                {invoiceStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [value, 'Rechnungen']}
                labelFormatter={(label) => `Status: ${label}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Vendors by Amount */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-600" />
            <span>Top Lieferanten</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topVendorsData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
              />
              <YAxis 
                type="category" 
                dataKey="displayName" 
                tick={{ fontSize: 9 }}
                width={100}
              />
              <Tooltip 
                formatter={(value: number) => [`€${value.toLocaleString('de-DE')}`, 'Betrag']}
                labelFormatter={(label) => `Lieferant: ${label}`}
              />
              <Bar dataKey="totalAmount" fill="#72BF78" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Invoice Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span>Monatliche Trends</span>
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
                tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'amount' ? `€${value.toLocaleString('de-DE')}` : value,
                  name === 'amount' ? 'Betrag' : 'Anzahl'
                ]}
              />
              <Legend />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="amount"
                stackId="1"
                stroke="#FF9149"
                fill="#FF914950"
                name="Betrag"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="count"
                stroke="#60B5FF"
                strokeWidth={3}
                name="Anzahl Rechnungen"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Euro className="h-5 w-5 text-orange-600" />
            <span>Finanz-Zusammenfassung</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Durchschnittlicher Rechnungsbetrag</span>
              <span className="text-2xl font-bold text-green-600">
                €{analytics.overview.avgInvoiceAmount.toLocaleString('de-DE')}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Gesamtbetrag</span>
                <span className="font-medium">€{analytics.overview.totalAmount.toLocaleString('de-DE')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Bezahlt</span>
                <span className="font-medium text-green-600">€{analytics.overview.paidAmount.toLocaleString('de-DE')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Ausstehend</span>
                <span className="font-medium text-blue-600">€{analytics.overview.pendingAmount.toLocaleString('de-DE')}</span>
              </div>
            </div>

            {/* Payment Rate Visualization */}
            <div className="pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Bezahlungsrate</span>
                <span className="font-medium">{analytics.overview.paymentRate.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.overview.paymentRate}%` }}
                />
              </div>
            </div>

            {/* AI Automation Metrics */}
            <div className="pt-4 border-t">
              <div className="text-xs text-gray-500 mb-2">KI-Automatisierung</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-500">OCR-Genauigkeit</div>
                  <div className="font-medium text-indigo-600">{analytics.aiMetrics.ocrAccuracy}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Automatisiert</div>
                  <div className="font-medium text-purple-600">{analytics.aiMetrics.automationRate}%</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
