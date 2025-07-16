
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  DollarSign, 
  Download,
  RefreshCw,
  Calendar,
  CreditCard,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Activity,
  Target,
  BarChart3,
  Eye
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, AreaChart, Area } from 'recharts'

interface Invoice {
  id: string
  tenantId: string
  tenantName: string
  amount: number
  status: 'paid' | 'pending' | 'overdue' | 'failed'
  dueDate: string
  paidDate?: string
  billingPeriod: {
    start: string
    end: string
  }
  items: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
}

interface UsageMetric {
  tenantId: string
  tenantName: string
  plan: string
  users: number
  storageGB: number
  apiCalls: number
  computeHours: number
  monthlySpend: number
  lastMonthSpend: number
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV-2024-001',
    tenantId: '1',
    tenantName: 'Acme Corporation',
    amount: 4999,
    status: 'paid',
    dueDate: '2024-01-15',
    paidDate: '2024-01-12',
    billingPeriod: {
      start: '2024-01-01',
      end: '2024-01-31'
    },
    items: [
      { description: 'Enterprise Plan', quantity: 1, unitPrice: 3999, total: 3999 },
      { description: 'Additional Users (45)', quantity: 45, unitPrice: 20, total: 900 },
      { description: 'Extra Storage (10GB)', quantity: 10, unitPrice: 10, total: 100 }
    ]
  },
  {
    id: 'INV-2024-002',
    tenantId: '2',
    tenantName: 'TechStart Inc',
    amount: 1999,
    status: 'pending',
    dueDate: '2024-01-20',
    billingPeriod: {
      start: '2024-01-01',
      end: '2024-01-31'
    },
    items: [
      { description: 'Professional Plan', quantity: 1, unitPrice: 1999, total: 1999 }
    ]
  },
  {
    id: 'INV-2024-003',
    tenantId: '3',
    tenantName: 'Global Logistics Ltd',
    amount: 7999,
    status: 'paid',
    dueDate: '2024-01-10',
    paidDate: '2024-01-08',
    billingPeriod: {
      start: '2024-01-01',
      end: '2024-01-31'
    },
    items: [
      { description: 'Enterprise Plan', quantity: 1, unitPrice: 3999, total: 3999 },
      { description: 'Additional Users (200)', quantity: 200, unitPrice: 20, total: 4000 }
    ]
  },
  {
    id: 'INV-2023-089',
    tenantId: '5',
    tenantName: 'Manufacturing Pro',
    amount: 1999,
    status: 'overdue',
    dueDate: '2023-12-20',
    billingPeriod: {
      start: '2023-12-01',
      end: '2023-12-31'
    },
    items: [
      { description: 'Professional Plan', quantity: 1, unitPrice: 1999, total: 1999 }
    ]
  },
  {
    id: 'INV-2024-004',
    tenantId: '6',
    tenantName: 'RetailChain Plus',
    amount: 15999,
    status: 'paid',
    dueDate: '2024-01-25',
    paidDate: '2024-01-20',
    billingPeriod: {
      start: '2024-01-01',
      end: '2024-01-31'
    },
    items: [
      { description: 'Custom Enterprise Plan', quantity: 1, unitPrice: 12999, total: 12999 },
      { description: 'Dedicated Resources', quantity: 1, unitPrice: 3000, total: 3000 }
    ]
  }
]

const mockUsageMetrics: UsageMetric[] = [
  {
    tenantId: '1',
    tenantName: 'Acme Corporation',
    plan: 'Enterprise',
    users: 245,
    storageGB: 89.4,
    apiCalls: 1250000,
    computeHours: 456.7,
    monthlySpend: 4999,
    lastMonthSpend: 4756
  },
  {
    tenantId: '2',
    tenantName: 'TechStart Inc',
    plan: 'Professional',
    users: 87,
    storageGB: 34.7,
    apiCalls: 450000,
    computeHours: 123.4,
    monthlySpend: 1999,
    lastMonthSpend: 1899
  },
  {
    tenantId: '3',
    tenantName: 'Global Logistics Ltd',
    plan: 'Enterprise',
    users: 512,
    storageGB: 156.8,
    apiCalls: 2100000,
    computeHours: 789.2,
    monthlySpend: 7999,
    lastMonthSpend: 7234
  }
]

const revenueData = [
  { month: 'Aug', revenue: 89500, expenses: 23400, profit: 66100 },
  { month: 'Sep', revenue: 104200, expenses: 27800, profit: 76400 },
  { month: 'Oct', revenue: 116800, expenses: 31200, profit: 85600 },
  { month: 'Nov', revenue: 122100, expenses: 33900, profit: 88200 },
  { month: 'Dec', revenue: 134300, expenses: 36700, profit: 97600 },
  { month: 'Jan', revenue: 142200, expenses: 38900, profit: 103300 }
]

const usageTrends = [
  { month: 'Aug', users: 1847, storage: 456, api: 8900000, compute: 2345 },
  { month: 'Sep', users: 1923, storage: 489, api: 9450000, compute: 2567 },
  { month: 'Oct', users: 2156, storage: 534, api: 10200000, compute: 2789 },
  { month: 'Nov', users: 2234, storage: 567, api: 11100000, compute: 2934 },
  { month: 'Dec', users: 2387, storage: 612, api: 12300000, compute: 3123 },
  { month: 'Jan', users: 2456, storage: 634, api: 12850000, compute: 3245 }
]

const statusColors: Record<string, string> = {
  paid: '#16a34a',
  pending: '#ca8a04',
  overdue: '#dc2626',
  failed: '#ef4444'
}

export default function BillingManagementComponent() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [usageMetrics, setUsageMetrics] = useState<UsageMetric[]>(mockUsageMetrics)
  const [timeRange, setTimeRange] = useState('6m')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredInvoices = invoices.filter(invoice => {
    return statusFilter === 'all' || invoice.status === statusFilter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'overdue': return <AlertTriangle className="h-4 w-4" />
      case 'failed': return <AlertTriangle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)
  const pendingAmount = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0)
  const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0)
  const totalInvoices = invoices.length

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-900">${totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-600">Pending Amount</p>
                  <p className="text-2xl font-bold text-orange-900">${pendingAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-500 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600">Overdue Amount</p>
                  <p className="text-2xl font-bold text-red-900">${overdueAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Invoices</p>
                  <p className="text-2xl font-bold text-blue-900">{totalInvoices}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue & Profit Trends
              </CardTitle>
              <CardDescription>
                Monthly revenue, expenses, and profit analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Month', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <YAxis 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        fontSize: 11
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stackId="1"
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                      name="Revenue"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stackId="2"
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.6}
                      name="Expenses"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Usage Growth Trends
              </CardTitle>
              <CardDescription>
                Platform usage metrics and growth patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Month', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <YAxis 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        fontSize: 11
                      }} 
                    />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Users" />
                    <Line type="monotone" dataKey="storage" stroke="#10b981" strokeWidth={2} name="Storage (GB)" />
                    <Line type="monotone" dataKey="compute" stroke="#f59e0b" strokeWidth={2} name="Compute Hours" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Usage Metrics Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Tenant Usage & Spend Analysis
            </CardTitle>
            <CardDescription>
              Detailed usage metrics and spending patterns by tenant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Tenant</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Plan</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Users</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Storage (GB)</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">API Calls</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Compute (hrs)</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Monthly Spend</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {usageMetrics.map((metric, index) => {
                    const growth = ((metric.monthlySpend - metric.lastMonthSpend) / metric.lastMonthSpend) * 100
                    return (
                      <tr key={metric.tenantId} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{metric.tenantName}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{metric.plan}</Badge>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {metric.users.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {metric.storageGB.toFixed(1)}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {(metric.apiCalls / 1000000).toFixed(1)}M
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {metric.computeHours.toFixed(1)}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          ${metric.monthlySpend.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {growth > 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <span className={`text-sm font-medium ${growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {Math.abs(growth).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Invoices Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Invoices
            </CardTitle>
            <CardDescription>
              Latest billing invoices and payment status
            </CardDescription>
            <div className="flex gap-2 mt-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInvoices.map((invoice, index) => (
                <div key={invoice.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">{invoice.id}</h4>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1"
                        style={{ color: statusColors[invoice.status], borderColor: statusColors[invoice.status] }}
                      >
                        {getStatusIcon(invoice.status)}
                        {invoice.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">${invoice.amount.toLocaleString()}</span>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Tenant</p>
                      <p className="font-medium">{invoice.tenantName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Due Date</p>
                      <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Billing Period</p>
                      <p className="font-medium">
                        {new Date(invoice.billingPeriod.start).toLocaleDateString()} - 
                        {new Date(invoice.billingPeriod.end).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Paid Date</p>
                      <p className="font-medium">
                        {invoice.paidDate ? new Date(invoice.paidDate).toLocaleDateString() : 'Not paid'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500 mb-2">Invoice Items:</p>
                    <div className="space-y-1">
                      {invoice.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between text-xs">
                          <span>{item.description} (×{item.quantity})</span>
                          <span className="font-medium">${item.total.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
