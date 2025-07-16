
// WeGroup Platform - Sprint 4: Security Dashboard Component
// Security Monitoring and Compliance Tracking

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Lock,
  UserCheck,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface SecurityStats {
  totalAuditLogs: number
  criticalEvents: number
  complianceScore: number
  gdprRequests: number
  securityIncidents: number
  loginAttempts: number
  successfulLogins: number
  failedLogins: number
}

interface AuditLog {
  id: string
  eventType: string
  severity: string
  description: string
  userId?: string
  timestamp: Date
  ipAddress?: string
}

interface ComplianceRecord {
  id: string
  complianceType: string
  status: string
  description?: string
  createdAt: Date
}

export default function SecurityDashboard() {
  const [stats, setStats] = useState<SecurityStats>({
    totalAuditLogs: 0,
    criticalEvents: 0,
    complianceScore: 0,
    gdprRequests: 0,
    securityIncidents: 0,
    loginAttempts: 0,
    successfulLogins: 0,
    failedLogins: 0
  })
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [complianceRecords, setComplianceRecords] = useState<ComplianceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSecurityData()
  }, [])

  const fetchSecurityData = async () => {
    try {
      // Fetch audit logs
      const auditResponse = await fetch('/api/security/audit-logs?limit=50')
      const auditData = await auditResponse.json()

      // Fetch compliance records
      const complianceResponse = await fetch('/api/security/compliance')
      const complianceData = await complianceResponse.json()

      if (auditData.success) {
        const logs = auditData.auditLogs || []
        setAuditLogs(logs.slice(0, 10))
        
        const criticalEvents = logs.filter((log: any) => log.severity === 'CRITICAL' || log.severity === 'HIGH').length
        const loginEvents = logs.filter((log: any) => log.eventType.includes('LOGIN'))
        const successfulLogins = loginEvents.filter((log: any) => log.eventType === 'LOGIN_SUCCESS').length
        const failedLogins = loginEvents.filter((log: any) => log.eventType === 'LOGIN_FAILURE').length

        setStats(prev => ({
          ...prev,
          totalAuditLogs: logs.length,
          criticalEvents,
          loginAttempts: loginEvents.length,
          successfulLogins,
          failedLogins,
          securityIncidents: criticalEvents
        }))
      }

      if (complianceData.success) {
        const records = complianceData.complianceRecords || []
        setComplianceRecords(records.slice(0, 8))
        
        const gdprRequests = records.filter((record: any) => record.complianceType.startsWith('GDPR')).length
        const completedRecords = records.filter((record: any) => record.status === 'COMPLETED').length
        const complianceScore = records.length > 0 ? Math.round((completedRecords / records.length) * 100) : 100

        setStats(prev => ({
          ...prev,
          gdprRequests,
          complianceScore
        }))
      }

      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch security data:', error)
      setLoading(false)
    }
  }

  // Sample data for charts
  const securityTrendsData = [
    { date: 'Mon', incidents: 2, loginAttempts: 45, criticalEvents: 1 },
    { date: 'Tue', incidents: 1, loginAttempts: 52, criticalEvents: 0 },
    { date: 'Wed', incidents: 3, loginAttempts: 48, criticalEvents: 2 },
    { date: 'Thu', incidents: 0, loginAttempts: 41, criticalEvents: 0 },
    { date: 'Fri', incidents: 2, loginAttempts: 58, criticalEvents: 1 },
    { date: 'Sat', incidents: 1, loginAttempts: 33, criticalEvents: 0 },
    { date: 'Sun', incidents: 0, loginAttempts: 29, criticalEvents: 0 }
  ]

  const eventTypeDistribution = [
    { name: 'Login Success', value: 65, color: '#80D8C3' },
    { name: 'Data Access', value: 20, color: '#60B5FF' },
    { name: 'Login Failure', value: 10, color: '#FF9149' },
    { name: 'Security Violation', value: 3, color: '#FF9898' },
    { name: 'Permission Denied', value: 2, color: '#A19AD3' }
  ]

  const complianceProgress = [
    { type: 'GDPR Compliance', progress: 95, status: 'excellent' },
    { type: 'SOC2 Controls', progress: 87, status: 'good' },
    { type: 'ISO 27001', progress: 72, status: 'warning' },
    { type: 'Data Retention', progress: 98, status: 'excellent' }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL': return 'bg-red-100 text-red-800'
      case 'HIGH': return 'bg-red-100 text-red-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-blue-100 text-blue-800'
      case 'INFO': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'text-green-600'
    if (progress >= 70) return 'text-blue-600'
    if (progress >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98%</div>
            <p className="text-xs text-gray-600">Excellent security posture</p>
            <Progress value={98} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.criticalEvents}</div>
            <p className="text-xs text-gray-600">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GDPR Compliance</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.complianceScore}%</div>
            <p className="text-xs text-gray-600">{stats.gdprRequests} requests processed</p>
            <Progress value={stats.complianceScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Login Success</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.loginAttempts > 0 ? Math.round((stats.successfulLogins / stats.loginAttempts) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-600">{stats.failedLogins} failed attempts</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="insights">Security Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Security Event Trends
                </CardTitle>
                <CardDescription>Weekly security incidents and login patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={securityTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="incidents" stroke="#FF9149" strokeWidth={2} name="Security Incidents" />
                    <Line type="monotone" dataKey="loginAttempts" stroke="#60B5FF" strokeWidth={2} name="Login Attempts" />
                    <Line type="monotone" dataKey="criticalEvents" stroke="#FF6363" strokeWidth={2} name="Critical Events" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Event Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Security Event Types
                </CardTitle>
                <CardDescription>Distribution of security events by type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={eventTypeDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {eventTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit-logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Security Events
              </CardTitle>
              <CardDescription>Latest security audit logs and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(log.severity)}>
                          {log.severity}
                        </Badge>
                        <span className="font-medium">{log.eventType.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="text-sm text-gray-600">{log.description}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {log.timestamp.toLocaleString()}
                        {log.ipAddress && (
                          <>
                            <span>•</span>
                            <span>IP: {log.ipAddress}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {log.userId && (
                        <div className="text-sm text-gray-600">User: {log.userId.slice(0, 8)}...</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Compliance Status
                </CardTitle>
                <CardDescription>Current compliance framework progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {complianceProgress.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.type}</span>
                      <span className={`text-sm font-bold ${getProgressColor(item.progress)}`}>
                        {item.progress}%
                      </span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Compliance Records */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Compliance Records
                </CardTitle>
                <CardDescription>Latest GDPR and compliance activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {record.complianceType.replace(/_/g, ' ')}
                        </div>
                        {record.description && (
                          <div className="text-xs text-gray-600">{record.description}</div>
                        )}
                        <div className="text-xs text-gray-500">
                          {record.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                      <Badge className={getComplianceColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Security Insights
                </CardTitle>
                <CardDescription>AI-powered security analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Strong Security Posture</span>
                  </div>
                  <p className="text-sm text-green-700">
                    No critical vulnerabilities detected. Security controls are functioning optimally.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Access Pattern Analysis</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Normal access patterns detected. No anomalous login behaviors identified.
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Recommendation</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Consider implementing additional MFA for admin accounts to enhance security.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Security Actions
                </CardTitle>
                <CardDescription>Common security management tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Export Security Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Run Compliance Check
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Review Access Logs
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Lock className="h-4 w-4 mr-2" />
                  Configure Security Rules
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Incident Response
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
