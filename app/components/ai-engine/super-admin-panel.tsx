
// WeGroup Platform - Super Admin Panel
// Advanced AI Model Administration Controls

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Settings,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  Archive,
  Play,
  Pause,
  RotateCcw,
  Zap
} from 'lucide-react'

interface Approval {
  id: string
  modelId: string
  approvalType: string
  status: string
  requestReason: string
  requestedBy: string
  requestedAt: string
  model: {
    name: string
    modelType: string
    provider: string
    riskLevel: string
  }
}

interface AdminAction {
  id: string
  actionType: string
  targetType: string
  targetId: string
  reason: string
  priority: string
  status: string
  requestedBy: string
  createdAt: string
}

export default function SuperAdminPanel() {
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [adminActions, setAdminActions] = useState<AdminAction[]>([])
  const [loading, setLoading] = useState(true)
  const [processingApproval, setProcessingApproval] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [approvalsRes, actionsRes] = await Promise.all([
        fetch('/api/ai-engine/admin/approvals'),
        fetch('/api/ai-engine/admin/actions') // This would need to be created
      ])

      const approvalsData = await approvalsRes.json()
      if (approvalsData.success) {
        setApprovals(approvalsData.approvals || [])
      }

      // For now, we'll use mock data for admin actions
      setAdminActions([
        {
          id: '1',
          actionType: 'MODEL_DEPLOYMENT',
          targetType: 'model',
          targetId: 'model-123',
          reason: 'Emergency deployment for critical issue',
          priority: 'HIGH',
          status: 'COMPLETED',
          requestedBy: 'admin@wegroup.com',
          createdAt: new Date().toISOString()
        }
      ])

      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
      setLoading(false)
    }
  }

  const handleApproval = async (approvalId: string, action: 'approve' | 'reject', comments?: string) => {
    setProcessingApproval(approvalId)
    
    try {
      const response = await fetch('/api/ai-engine/admin/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvalId,
          action,
          comments: comments || `${action === 'approve' ? 'Approved' : 'Rejected'} by super admin`
        })
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchData() // Refresh data
      }
    } catch (error) {
      console.error('Approval processing failed:', error)
    } finally {
      setProcessingApproval(null)
    }
  }

  const getApprovalStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'critical':
        return 'bg-red-200 text-red-900'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'low':
        return 'bg-gray-100 text-gray-800'
      case 'medium':
        return 'bg-blue-100 text-blue-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'emergency':
        return 'bg-red-200 text-red-900'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const pendingApprovals = approvals.filter(a => a.status === 'PENDING')
  const recentActions = adminActions.slice(0, 10)

  const stats = {
    pendingApprovals: pendingApprovals.length,
    highRiskModels: approvals.filter(a => a.model?.riskLevel === 'HIGH' || a.model?.riskLevel === 'CRITICAL').length,
    actionsToday: adminActions.filter(a => 
      new Date(a.createdAt).toDateString() === new Date().toDateString()
    ).length,
    systemHealth: 95 // This would come from actual system monitoring
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Panel</h1>
          <p className="text-gray-600 mt-2">
            Advanced AI model administration and oversight controls
          </p>
        </div>
        <Badge className="bg-red-100 text-red-800">
          <Shield className="h-3 w-3 mr-1" />
          Super Admin Access
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-gray-600">require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Models</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highRiskModels}</div>
            <p className="text-xs text-gray-600">need security review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions Today</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.actionsToday}</div>
            <p className="text-xs text-gray-600">admin actions performed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.systemHealth}%</div>
            <Progress value={stats.systemHealth} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="approvals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="actions">Admin Actions</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="controls">System Controls</TabsTrigger>
        </TabsList>

        <TabsContent value="approvals" className="space-y-6">
          {/* Urgent Approvals */}
          {pendingApprovals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Urgent Approvals Required
                </CardTitle>
                <CardDescription>Critical models awaiting super admin approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <div key={approval.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{approval.model?.name || 'Unknown Model'}</h4>
                            <Badge className={getRiskColor(approval.model?.riskLevel || 'unknown')}>
                              {approval.model?.riskLevel || 'Unknown'} Risk
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            <strong>Type:</strong> {approval.approvalType.replace(/_/g, ' ')}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Provider:</strong> {approval.model?.provider || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-700">{approval.requestReason}</p>
                          <p className="text-xs text-gray-500">
                            Requested by {approval.requestedBy} • {new Date(approval.requestedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-100"
                            onClick={() => handleApproval(approval.id, 'reject')}
                            disabled={processingApproval === approval.id}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproval(approval.id, 'approve')}
                            disabled={processingApproval === approval.id}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {processingApproval === approval.id ? 'Processing...' : 'Approve'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                All Approval Requests
              </CardTitle>
              <CardDescription>Complete approval history and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {approvals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{approval.model?.name || 'Unknown Model'}</div>
                      <div className="text-sm text-gray-600">
                        {approval.approvalType.replace(/_/g, ' ')} • {approval.model?.provider}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(approval.requestedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getRiskColor(approval.model?.riskLevel || 'unknown')}>
                        {approval.model?.riskLevel || 'Unknown'}
                      </Badge>
                      <Badge className={getApprovalStatusColor(approval.status)}>
                        {approval.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {approvals.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
                    <p className="text-gray-600">All models are approved and operational.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Recent Admin Actions
              </CardTitle>
              <CardDescription>System changes and administrative operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{action.actionType.replace(/_/g, ' ')}</div>
                      <div className="text-sm text-gray-600">{action.reason}</div>
                      <div className="text-xs text-gray-500">
                        By {action.requestedBy} • {new Date(action.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getPriorityColor(action.priority)}>
                        {action.priority}
                      </Badge>
                      <Badge className={action.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {action.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Performance
                </CardTitle>
                <CardDescription>Real-time system health metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>CPU Usage</span>
                    <div className="flex items-center gap-2">
                      <Progress value={45} className="w-20" />
                      <span className="text-sm">45%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Memory Usage</span>
                    <div className="flex items-center gap-2">
                      <Progress value={67} className="w-20" />
                      <span className="text-sm">67%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>API Response Time</span>
                    <div className="flex items-center gap-2">
                      <Progress value={23} className="w-20" />
                      <span className="text-sm">120ms</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Error Rate</span>
                    <div className="flex items-center gap-2">
                      <Progress value={2} className="w-20" />
                      <span className="text-sm">0.2%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cost Monitoring
                </CardTitle>
                <CardDescription>AI model usage and cost tracking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Daily Spend</span>
                    <span className="font-medium">$127.45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Monthly Budget</span>
                    <span className="font-medium">$5,000.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Budget Used</span>
                    <div className="flex items-center gap-2">
                      <Progress value={34} className="w-20" />
                      <span className="text-sm">34%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cost per Request</span>
                    <span className="font-medium">$0.0034</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="controls" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Emergency Controls
                </CardTitle>
                <CardDescription>Critical system operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Play className="h-4 w-4 mr-2" />
                  Emergency Model Deployment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause All Model Operations
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Rollback Last Deployment
                </Button>
                <Button variant="outline" className="w-full justify-start border-red-300 text-red-700 hover:bg-red-50">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  System Maintenance Mode
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Access Management
                </CardTitle>
                <CardDescription>User permissions and access control</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Grant Emergency Access
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Review User Permissions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Archive className="h-4 w-4 mr-2" />
                  Generate Audit Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
