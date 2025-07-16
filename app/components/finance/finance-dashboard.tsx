
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calculator, 
  Receipt, 
  TrendingUp, 
  AlertTriangle,
  FileText,
  Upload,
  Brain,
  CheckCircle,
  Clock,
  Euro,
  BarChart3,
  Eye,
  Zap
} from 'lucide-react'
import { FinanceAnalyticsCharts } from './finance-analytics-charts'
import { InvoiceManager } from './invoice-manager'
import { TransactionList } from './transaction-list'
import { CashFlowForecast } from './cash-flow-forecast'

interface FinanceAnalytics {
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
  cashFlowForecast: Array<{
    month: string
    predictedInflow: number
    predictedOutflow: number
    netCashFlow: number
    confidence: number
  }>
}

export function FinanceDashboard() {
  const { data: session } = useSession()
  const [analytics, setAnalytics] = useState<FinanceAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/finance/analytics?period=30d')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch finance analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading Finance Dashboard...</div>
  }

  const overview = analytics?.overview
  const aiMetrics = analytics?.aiMetrics

  return (
    <div className="space-y-6">
      {/* Key Financial Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Gesamtbetrag
            </CardTitle>
            <Euro className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              €{overview?.totalAmount?.toLocaleString('de-DE') || 0}
            </div>
            <p className="text-xs text-green-700">
              {overview?.totalInvoices || 0} Rechnungen
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Ausstehend
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              €{overview?.pendingAmount?.toLocaleString('de-DE') || 0}
            </div>
            <p className="text-xs text-blue-700">
              {overview?.pendingInvoices || 0} Rechnungen offen
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Bezahlungsrate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {overview?.paymentRate?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-purple-700">
              {overview?.paidInvoices || 0} bezahlte Rechnungen
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-800">
              KI-Automatisierung
            </CardTitle>
            <Brain className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-900">
              {aiMetrics?.automationRate || 0}%
            </div>
            <p className="text-xs text-indigo-700">
              {aiMetrics?.processedInvoices || 0} automatisch verarbeitet
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Performance Insights */}
      <Card className="border-emerald-200 bg-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-emerald-800">
            <Zap className="h-5 w-5" />
            <span>KI-Performance Dashboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 p-3 rounded-full">
                <Eye className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-800">OCR-Genauigkeit</p>
                <p className="text-2xl font-bold text-emerald-900">{aiMetrics?.ocrAccuracy || 0}%</p>
                <p className="text-xs text-emerald-700">Automatische Datenextraktion</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 p-3 rounded-full">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-800">Duplikate erkannt</p>
                <p className="text-2xl font-bold text-emerald-900">{aiMetrics?.duplicatesDetected || 0}</p>
                <p className="text-xs text-emerald-700">Automatische Duplikatserkennung</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 p-3 rounded-full">
                <Brain className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-800">Verarbeitungszeit</p>
                <p className="text-2xl font-bold text-emerald-900">{overview?.avgProcessingTime?.toFixed(1) || 0}d</p>
                <p className="text-xs text-emerald-700">Durchschnittlich</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overdue Alert */}
      {overview && overview.overdueInvoices > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Überfällige Rechnungen</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-800">
                  <strong>{overview.overdueInvoices}</strong> Rechnungen sind überfällig
                </p>
                <p className="text-sm text-red-700 mt-1">
                  Empfehlung: Sofortige Nachverfolgung und Mahnung
                </p>
              </div>
              <Badge variant="destructive">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Überfällig
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Übersicht</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center space-x-2">
            <Receipt className="h-4 w-4" />
            <span>Rechnungen</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Transaktionen</span>
          </TabsTrigger>
          <TabsTrigger value="forecast" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Prognose</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <FinanceAnalyticsCharts analytics={analytics} />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <InvoiceManager />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <TransactionList />
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <CashFlowForecast forecast={analytics?.cashFlowForecast} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
