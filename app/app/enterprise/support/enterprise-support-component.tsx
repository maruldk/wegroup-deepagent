
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  Headphones, 
  Plus, 
  Search, 
  Filter,
  RefreshCw,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Users,
  Target,
  TrendingUp,
  Award,
  Book,
  Eye,
  Edit,
  Star,
  ThumbsUp,
  Phone
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts'

interface SupportTicket {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'pending_customer' | 'resolved' | 'closed'
  category: 'technical' | 'billing' | 'feature_request' | 'bug_report' | 'integration'
  tenantName: string
  customerName: string
  customerEmail: string
  assignedTo: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  responseTime: number // minutes
  resolutionTime?: number // hours
  satisfaction?: number // 1-5 stars
}

interface KnowledgeBaseArticle {
  id: string
  title: string
  category: string
  views: number
  helpfulVotes: number
  lastUpdated: string
  author: string
}

const mockTickets: SupportTicket[] = [
  {
    id: 'SUP-2024-001',
    title: 'API integration failing with 500 errors',
    description: 'Customer experiencing intermittent 500 errors when calling the logistics API endpoint',
    priority: 'high',
    status: 'in_progress',
    category: 'technical',
    tenantName: 'Acme Corporation',
    customerName: 'John Smith',
    customerEmail: 'john.smith@acme.com',
    assignedTo: 'Sarah Johnson',
    createdAt: '2024-01-07 09:30:00',
    updatedAt: '2024-01-07 10:45:00',
    responseTime: 15,
    resolutionTime: undefined
  },
  {
    id: 'SUP-2024-002',
    title: 'Request for additional user licenses',
    description: 'Need to add 50 more user licenses to our enterprise plan',
    priority: 'medium',
    status: 'resolved',
    category: 'billing',
    tenantName: 'Global Logistics Ltd',
    customerName: 'Michael Chen',
    customerEmail: 'mike.chen@globallogistics.com',
    assignedTo: 'Emma Wilson',
    createdAt: '2024-01-06 14:20:00',
    updatedAt: '2024-01-07 11:30:00',
    resolvedAt: '2024-01-07 11:30:00',
    responseTime: 45,
    resolutionTime: 21.2,
    satisfaction: 5
  },
  {
    id: 'SUP-2024-003',
    title: 'Feature request: Advanced reporting dashboard',
    description: 'Would like custom reporting capabilities for logistics analytics',
    priority: 'low',
    status: 'open',
    category: 'feature_request',
    tenantName: 'TechStart Inc',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@techstart.com',
    assignedTo: 'Mike Rodriguez',
    createdAt: '2024-01-07 11:15:00',
    updatedAt: '2024-01-07 11:15:00',
    responseTime: 0
  },
  {
    id: 'SUP-2024-004',
    title: 'Data sync issues with external warehouse system',
    description: 'Inventory data not syncing properly with WMS integration',
    priority: 'critical',
    status: 'open',
    category: 'integration',
    tenantName: 'RetailChain Plus',
    customerName: 'Lisa Martinez',
    customerEmail: 'lisa.martinez@retailchain.com',
    assignedTo: 'Alex Thompson',
    createdAt: '2024-01-07 12:00:00',
    updatedAt: '2024-01-07 12:00:00',
    responseTime: 0
  },
  {
    id: 'SUP-2024-005',
    title: 'Dashboard loading performance issues',
    description: 'Analytics dashboard taking too long to load with large datasets',
    priority: 'medium',
    status: 'pending_customer',
    category: 'bug_report',
    tenantName: 'Manufacturing Pro',
    customerName: 'Robert Davis',
    customerEmail: 'robert@mfgpro.com',
    assignedTo: 'Jennifer Lee',
    createdAt: '2024-01-06 16:45:00',
    updatedAt: '2024-01-07 09:20:00',
    responseTime: 30,
    satisfaction: 4
  }
]

const mockKnowledgeBase: KnowledgeBaseArticle[] = [
  {
    id: '1',
    title: 'How to set up API authentication',
    category: 'Technical',
    views: 1247,
    helpfulVotes: 89,
    lastUpdated: '2024-01-05',
    author: 'Technical Team'
  },
  {
    id: '2',
    title: 'Understanding billing cycles and invoices',
    category: 'Billing',
    views: 892,
    helpfulVotes: 67,
    lastUpdated: '2024-01-03',
    author: 'Support Team'
  },
  {
    id: '3',
    title: 'Configuring webhook endpoints',
    category: 'Integration',
    views: 634,
    helpfulVotes: 45,
    lastUpdated: '2024-01-04',
    author: 'Integration Team'
  },
  {
    id: '4',
    title: 'Troubleshooting common connection issues',
    category: 'Technical',
    views: 1456,
    helpfulVotes: 123,
    lastUpdated: '2024-01-06',
    author: 'Technical Team'
  }
]

const supportMetrics = [
  { month: 'Aug', tickets: 145, resolved: 138, avgResponse: 25, satisfaction: 4.2 },
  { month: 'Sep', tickets: 167, resolved: 159, avgResponse: 22, satisfaction: 4.3 },
  { month: 'Oct', tickets: 189, resolved: 182, avgResponse: 19, satisfaction: 4.5 },
  { month: 'Nov', tickets: 156, resolved: 151, avgResponse: 18, satisfaction: 4.4 },
  { month: 'Dec', tickets: 134, resolved: 128, avgResponse: 16, satisfaction: 4.6 },
  { month: 'Jan', tickets: 178, resolved: 167, avgResponse: 15, satisfaction: 4.7 }
]

const priorityDistribution = [
  { priority: 'Critical', count: 8, color: '#dc2626' },
  { priority: 'High', count: 23, color: '#ea580c' },
  { priority: 'Medium', count: 45, color: '#ca8a04' },
  { priority: 'Low', count: 32, color: '#16a34a' }
]

const categoryDistribution = [
  { category: 'Technical', count: 56, color: '#3b82f6' },
  { category: 'Billing', count: 23, color: '#10b981' },
  { category: 'Feature Request', count: 18, color: '#f59e0b' },
  { category: 'Bug Report', count: 15, color: '#ef4444' },
  { category: 'Integration', count: 12, color: '#8b5cf6' }
]

const slaMetrics = [
  { metric: 'First Response SLA', target: 30, actual: 15, unit: 'minutes' },
  { metric: 'Resolution SLA', target: 24, actual: 18.5, unit: 'hours' },
  { metric: 'Customer Satisfaction', target: 4.0, actual: 4.7, unit: 'stars' },
  { metric: 'Resolution Rate', target: 95, actual: 96.8, unit: '%' }
]

const priorityColors: Record<string, string> = {
  low: '#16a34a',
  medium: '#ca8a04',
  high: '#ea580c',
  critical: '#dc2626'
}

const statusColors: Record<string, string> = {
  open: '#dc2626',
  in_progress: '#3b82f6',
  pending_customer: '#ca8a04',
  resolved: '#16a34a',
  closed: '#6b7280'
}

export default function EnterpriseSupportComponent() {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets)
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter
    return matchesSearch && matchesPriority && matchesStatus && matchesCategory
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="h-4 w-4" />
      case 'in_progress': return <Clock className="h-4 w-4" />
      case 'pending_customer': return <MessageSquare className="h-4 w-4" />
      case 'resolved': return <CheckCircle className="h-4 w-4" />
      case 'closed': return <CheckCircle className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const totalTickets = tickets.length
  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length
  const avgResponseTime = tickets.filter(t => t.responseTime > 0).reduce((sum, t) => sum + t.responseTime, 0) / 
                          tickets.filter(t => t.responseTime > 0).length || 0
  const avgSatisfaction = tickets.filter(t => t.satisfaction).reduce((sum, t) => sum + (t.satisfaction || 0), 0) / 
                         tickets.filter(t => t.satisfaction).length || 0

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-4">
          <Button className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
          </Button>
          <Button variant="outline" className="whitespace-nowrap">
            <Book className="h-4 w-4 mr-2" />
            Knowledge Base
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Escalate Call
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
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Headphones className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Tickets</p>
                  <p className="text-2xl font-bold text-blue-900">{totalTickets}</p>
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
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-600">Open Tickets</p>
                  <p className="text-2xl font-bold text-orange-900">{openTickets}</p>
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
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Avg Response</p>
                  <p className="text-2xl font-bold text-green-900">{avgResponseTime.toFixed(0)}m</p>
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
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600">Satisfaction</p>
                  <p className="text-2xl font-bold text-purple-900">{avgSatisfaction.toFixed(1)}/5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* SLA Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {slaMetrics.map((metric, index) => (
          <motion.div
            key={metric.metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">{metric.metric}</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{metric.actual}{metric.unit}</p>
                      <p className="text-sm text-gray-500">Target: {metric.target}{metric.unit}</p>
                    </div>
                    <div className="text-right">
                      {metric.actual <= metric.target ? (
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-8 w-8 text-orange-500" />
                      )}
                    </div>
                  </div>
                  <Progress 
                    value={Math.min((metric.target / metric.actual) * 100, 100)} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Support Trends
              </CardTitle>
              <CardDescription>
                Monthly ticket volume and resolution metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={supportMetrics}>
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
                    <Line type="monotone" dataKey="tickets" stroke="#3b82f6" strokeWidth={2} name="Tickets Created" />
                    <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} name="Tickets Resolved" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Priority Distribution
              </CardTitle>
              <CardDescription>
                Current tickets by priority level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {priorityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        fontSize: 11
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {priorityDistribution.map((item) => (
                  <div key={item.priority} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.priority}</span>
                    </div>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Category Breakdown
              </CardTitle>
              <CardDescription>
                Tickets by support category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="category" 
                      tickLine={false}
                      tick={{ fontSize: 9 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      label={{ value: 'Category', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: 11 } }}
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
                    <Bar dataKey="count" name="Tickets">
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Knowledge Base Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Popular Knowledge Base Articles
            </CardTitle>
            <CardDescription>
              Most viewed and helpful articles from the knowledge base
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockKnowledgeBase.map((article, index) => (
                <div key={article.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{article.title}</h4>
                    <Badge variant="secondary">{article.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span>👁 {article.views} views</span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {article.helpfulVotes}
                      </span>
                    </div>
                    <span>Updated {new Date(article.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-32">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="pending_customer">Pending Customer</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="billing">Billing</SelectItem>
            <SelectItem value="feature_request">Feature Request</SelectItem>
            <SelectItem value="bug_report">Bug Report</SelectItem>
            <SelectItem value="integration">Integration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket, index) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 + index * 0.05 }}
            whileHover={{ scale: 1.01 }}
          >
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{ticket.id}</h3>
                      <Badge 
                        variant="outline" 
                        style={{ color: priorityColors[ticket.priority], borderColor: priorityColors[ticket.priority] }}
                      >
                        {ticket.priority.toUpperCase()}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1"
                        style={{ color: statusColors[ticket.status], borderColor: statusColors[ticket.status] }}
                      >
                        {getStatusIcon(ticket.status)}
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant="secondary">
                        {ticket.category.replace('_', ' ')}
                      </Badge>
                    </div>
                    <h4 className="font-medium mb-2">{ticket.title}</h4>
                    <p className="text-gray-600 mb-3">{ticket.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Update
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-500 mb-1">Customer</p>
                    <p className="font-medium">{ticket.customerName}</p>
                    <p className="text-xs text-gray-500">{ticket.tenantName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Assigned To</p>
                    <p className="font-medium">{ticket.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Response Time</p>
                    <p className="font-medium">{ticket.responseTime > 0 ? `${ticket.responseTime}m` : 'Pending'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Resolution Time</p>
                    <p className="font-medium">{ticket.resolutionTime ? `${ticket.resolutionTime}h` : 'Pending'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Satisfaction</p>
                    <div className="flex items-center gap-1">
                      {ticket.satisfaction ? (
                        <>
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < ticket.satisfaction! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                          <span className="text-xs ml-1">{ticket.satisfaction}/5</span>
                        </>
                      ) : (
                        <span className="text-xs">Not rated</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created:</span>
                    <span className="font-medium">{new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <Card className="p-12 text-center">
          <Headphones className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Ticket
          </Button>
        </Card>
      )}
    </div>
  )
}
