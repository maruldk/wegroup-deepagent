
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  CheckCircle, 
  AlertTriangle,
  XCircle,
  Shield,
  FileText,
  Calendar,
  Download,
  RefreshCw,
  Clock,
  Users,
  Database,
  Lock,
  Gauge,
  Target,
  TrendingUp,
  Award
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

interface ComplianceStandard {
  id: string
  name: string
  fullName: string
  status: 'compliant' | 'partially_compliant' | 'non_compliant'
  score: number
  lastAssessment: string
  nextReview: string
  requirements: number
  compliantRequirements: number
  criticalIssues: number
}

const complianceStandards: ComplianceStandard[] = [
  {
    id: '1',
    name: 'GDPR',
    fullName: 'General Data Protection Regulation',
    status: 'compliant',
    score: 94.2,
    lastAssessment: '2024-01-01',
    nextReview: '2024-04-01',
    requirements: 99,
    compliantRequirements: 93,
    criticalIssues: 1
  },
  {
    id: '2',
    name: 'SOX',
    fullName: 'Sarbanes-Oxley Act',
    status: 'partially_compliant',
    score: 87.5,
    lastAssessment: '2023-12-15',
    nextReview: '2024-03-15',
    requirements: 72,
    compliantRequirements: 63,
    criticalIssues: 3
  },
  {
    id: '3',
    name: 'ISO 27001',
    fullName: 'Information Security Management',
    status: 'compliant',
    score: 91.8,
    lastAssessment: '2024-01-05',
    nextReview: '2024-07-05',
    requirements: 114,
    compliantRequirements: 105,
    criticalIssues: 0
  },
  {
    id: '4',
    name: 'PCI DSS',
    fullName: 'Payment Card Industry Data Security Standard',
    status: 'partially_compliant',
    score: 83.4,
    lastAssessment: '2023-12-20',
    nextReview: '2024-02-20',
    requirements: 78,
    compliantRequirements: 65,
    criticalIssues: 2
  },
  {
    id: '5',
    name: 'HIPAA',
    fullName: 'Health Insurance Portability and Accountability Act',
    status: 'non_compliant',
    score: 67.2,
    lastAssessment: '2023-11-30',
    nextReview: '2024-01-30',
    requirements: 45,
    compliantRequirements: 30,
    criticalIssues: 5
  }
]

const complianceTrends = [
  { month: 'Sep', gdpr: 89, sox: 82, iso: 88, pci: 79, hipaa: 65 },
  { month: 'Oct', gdpr: 91, sox: 84, iso: 89, pci: 81, hipaa: 66 },
  { month: 'Nov', gdpr: 92, sox: 85, iso: 90, pci: 82, hipaa: 67 },
  { month: 'Dec', gdpr: 93, sox: 87, iso: 91, pci: 83, hipaa: 67 },
  { month: 'Jan', gdpr: 94, sox: 87, iso: 92, pci: 83, hipaa: 67 }
]

const issueCategories = [
  { category: 'Data Protection', issues: 12, resolved: 8, color: '#3b82f6' },
  { category: 'Access Control', issues: 8, resolved: 6, color: '#10b981' },
  { category: 'Audit Logging', issues: 6, resolved: 5, color: '#f59e0b' },
  { category: 'Encryption', issues: 4, resolved: 4, color: '#ef4444' },
  { category: 'Documentation', issues: 15, resolved: 12, color: '#8b5cf6' },
  { category: 'Training', issues: 9, resolved: 7, color: '#06b6d4' }
]

const radarData = [
  { framework: 'Data Protection', score: 92 },
  { framework: 'Access Control', score: 88 },
  { framework: 'Incident Response', score: 85 },
  { framework: 'Risk Management', score: 91 },
  { framework: 'Monitoring', score: 94 },
  { framework: 'Documentation', score: 86 }
]

const upcomingDeadlines = [
  { standard: 'PCI DSS', task: 'Quarterly Security Assessment', dueDate: '2024-02-20', priority: 'high' },
  { standard: 'HIPAA', task: 'Risk Assessment Update', dueDate: '2024-01-30', priority: 'critical' },
  { standard: 'GDPR', task: 'Data Processing Audit', dueDate: '2024-04-01', priority: 'medium' },
  { standard: 'SOX', task: 'Internal Controls Testing', dueDate: '2024-03-15', priority: 'high' },
  { standard: 'ISO 27001', task: 'Annual Certification Review', dueDate: '2024-07-05', priority: 'medium' }
]

const statusColors: Record<string, string> = {
  compliant: '#10b981',
  partially_compliant: '#f59e0b',
  non_compliant: '#ef4444'
}

const priorityColors: Record<string, string> = {
  low: '#6b7280',
  medium: '#3b82f6',
  high: '#f59e0b',
  critical: '#ef4444'
}

export default function ComplianceDashboardComponent() {
  const [timeRange, setTimeRange] = useState('6m')
  const [selectedStandard, setSelectedStandard] = useState('all')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4" />
      case 'partially_compliant': return <AlertTriangle className="h-4 w-4" />
      case 'non_compliant': return <XCircle className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'compliant': return 'Compliant'
      case 'partially_compliant': return 'Partially Compliant'
      case 'non_compliant': return 'Non-Compliant'
      default: return 'Unknown'
    }
  }

  const overallScore = complianceStandards.reduce((sum, std) => sum + std.score, 0) / complianceStandards.length
  const compliantStandards = complianceStandards.filter(std => std.status === 'compliant').length
  const totalIssues = issueCategories.reduce((sum, cat) => sum + cat.issues, 0)
  const resolvedIssues = issueCategories.reduce((sum, cat) => sum + cat.resolved, 0)

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
          <Select value={selectedStandard} onValueChange={setSelectedStandard}>
            <SelectTrigger className="w-40">
              <Shield className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Standards</SelectItem>
              <SelectItem value="gdpr">GDPR</SelectItem>
              <SelectItem value="sox">SOX</SelectItem>
              <SelectItem value="iso">ISO 27001</SelectItem>
              <SelectItem value="pci">PCI DSS</SelectItem>
              <SelectItem value="hipaa">HIPAA</SelectItem>
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
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Overall Score</p>
                  <p className="text-2xl font-bold text-blue-900">{overallScore.toFixed(1)}%</p>
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
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Compliant Standards</p>
                  <p className="text-2xl font-bold text-green-900">{compliantStandards}/{complianceStandards.length}</p>
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
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-600">Open Issues</p>
                  <p className="text-2xl font-bold text-orange-900">{totalIssues - resolvedIssues}</p>
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
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600">Resolution Rate</p>
                  <p className="text-2xl font-bold text-purple-900">{((resolvedIssues / totalIssues) * 100).toFixed(0)}%</p>
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
                Compliance Trends
              </CardTitle>
              <CardDescription>
                Compliance scores over time by standard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={complianceTrends}>
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
                      domain={[60, 100]}
                      label={{ value: 'Score %', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        fontSize: 11
                      }} 
                    />
                    <Line type="monotone" dataKey="gdpr" stroke="#3b82f6" strokeWidth={2} name="GDPR" />
                    <Line type="monotone" dataKey="sox" stroke="#10b981" strokeWidth={2} name="SOX" />
                    <Line type="monotone" dataKey="iso" stroke="#f59e0b" strokeWidth={2} name="ISO 27001" />
                    <Line type="monotone" dataKey="pci" stroke="#ef4444" strokeWidth={2} name="PCI DSS" />
                    <Line type="monotone" dataKey="hipaa" stroke="#8b5cf6" strokeWidth={2} name="HIPAA" />
                  </LineChart>
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
                <Gauge className="h-5 w-5" />
                Compliance Overview
              </CardTitle>
              <CardDescription>
                Multi-dimensional compliance assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="framework" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fontSize: 10 }}
                    />
                    <Radar
                      name="Compliance"
                      dataKey="score"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        fontSize: 11
                      }} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Standards Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Compliance Standards
            </CardTitle>
            <CardDescription>
              Current status and scores for each compliance standard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {complianceStandards.map((standard, index) => (
                <div key={standard.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{standard.name}</h3>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1"
                        style={{ color: statusColors[standard.status], borderColor: statusColors[standard.status] }}
                      >
                        {getStatusIcon(standard.status)}
                        {getStatusText(standard.status)}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{standard.score}%</p>
                      <p className="text-sm text-gray-500">Compliance Score</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{standard.fullName}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Requirements</p>
                      <p className="font-semibold">{standard.compliantRequirements}/{standard.requirements}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Critical Issues</p>
                      <p className="font-semibold text-red-600">{standard.criticalIssues}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Assessment</p>
                      <p className="font-semibold">{new Date(standard.lastAssessment).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Next Review</p>
                      <p className="font-semibold">{new Date(standard.nextReview).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <Progress value={standard.score} className="h-3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Issues by Category and Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Issues by Category
              </CardTitle>
              <CardDescription>
                Open and resolved issues across compliance areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={issueCategories}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="category" 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
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
                    <Bar dataKey="issues" name="Total Issues" fill="#ef4444" />
                    <Bar dataKey="resolved" name="Resolved" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>
                Important compliance deadlines and reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{deadline.standard}</Badge>
                        <Badge 
                          variant="outline" 
                          style={{ color: priorityColors[deadline.priority], borderColor: priorityColors[deadline.priority] }}
                        >
                          {deadline.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="font-medium">{deadline.task}</p>
                      <p className="text-sm text-gray-500">Due: {new Date(deadline.dueDate).toLocaleDateString()}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      Schedule
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
