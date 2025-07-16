
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  User, 
  FileText, 
  TrendingUp,
  Activity,
  Bell,
  MessageSquare,
  ChevronRight,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface ApprovalWorkflowData {
  id: string;
  invoiceId: string;
  workflowType: string;
  approvalLevel: number;
  maxApprovalLevel: number;
  currentStage: string;
  invoice: {
    invoiceNumber: string;
    vendorName: string;
    totalAmount: number;
    currency: string;
    processingStatus: string;
  };
  stage1Status: string;
  stage1Approver: string;
  stage1ApprovedAt: string;
  stage1Comments: string;
  stage2Status: string;
  stage2Approver: string;
  stage2ApprovedAt: string;
  stage2Comments: string;
  stage3Status: string;
  stage3Approver: string;
  stage3ApprovedAt: string;
  stage3Comments: string;
  aiRecommendation: string;
  aiConfidenceScore: number;
  aiRiskAssessment: any;
  escalationRules: any[];
  notificationsSent: any[];
  reminderCount: number;
}

interface PendingApproval {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  totalAmount: number;
  currency: string;
  currentStage: string;
  daysWaiting: number;
  aiRecommendation: string;
  priority: string;
}

export function ApprovalWorkflowInterface() {
  const [workflows, setWorkflows] = useState<ApprovalWorkflowData[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ApprovalWorkflowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [approvalComment, setApprovalComment] = useState('');

  useEffect(() => {
    fetchWorkflows();
    fetchPendingApprovals();
  }, []);

  const fetchWorkflows = async () => {
    try {
      // Mock data for demonstration
      const mockWorkflows: ApprovalWorkflowData[] = [
        {
          id: '1',
          invoiceId: 'inv-001',
          workflowType: 'MANUAL',
          approvalLevel: 2,
          maxApprovalLevel: 3,
          currentStage: 'STAGE_2',
          invoice: {
            invoiceNumber: 'INV-2024-001',
            vendorName: 'Müller GmbH',
            totalAmount: 15000,
            currency: 'EUR',
            processingStatus: 'VALIDATION_PENDING'
          },
          stage1Status: 'APPROVED',
          stage1Approver: 'John Doe',
          stage1ApprovedAt: '2024-01-15T10:30:00Z',
          stage1Comments: 'Checked and approved.',
          stage2Status: 'PENDING',
          stage2Approver: 'Jane Smith',
          stage2ApprovedAt: '',
          stage2Comments: '',
          stage3Status: 'PENDING',
          stage3Approver: 'CEO',
          stage3ApprovedAt: '',
          stage3Comments: '',
          aiRecommendation: 'APPROVE',
          aiConfidenceScore: 0.85,
          aiRiskAssessment: {
            riskLevel: 'LOW',
            riskFactors: ['Standard vendor', 'Within budget'],
            mitigationActions: []
          },
          escalationRules: [],
          notificationsSent: [],
          reminderCount: 1
        }
      ];
      setWorkflows(mockWorkflows);
    } catch (error) {
      console.error('Error fetching workflows:', error);
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockPendingApprovals: PendingApproval[] = [
        {
          id: '1',
          invoiceNumber: 'INV-2024-001',
          vendorName: 'Müller GmbH',
          totalAmount: 15000,
          currency: 'EUR',
          currentStage: 'STAGE_2',
          daysWaiting: 2,
          aiRecommendation: 'APPROVE',
          priority: 'HIGH'
        },
        {
          id: '2',
          invoiceNumber: 'INV-2024-002',
          vendorName: 'Schmidt AG',
          totalAmount: 850,
          currency: 'EUR',
          currentStage: 'STAGE_1',
          daysWaiting: 1,
          aiRecommendation: 'REVIEW',
          priority: 'MEDIUM'
        },
        {
          id: '3',
          invoiceNumber: 'INV-2024-003',
          vendorName: 'Weber & Co',
          totalAmount: 45000,
          currency: 'EUR',
          currentStage: 'STAGE_3',
          daysWaiting: 5,
          aiRecommendation: 'REVIEW',
          priority: 'URGENT'
        }
      ];
      
      setPendingApprovals(mockPendingApprovals);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (workflowId: string, stage: number, action: 'APPROVE' | 'REJECT') => {
    try {
      const response = await fetch('/api/finance/approval-workflow', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId,
          stage,
          action,
          comments: approvalComment,
          approverId: 'current-user-id'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update approval');
      }

      const result = await response.json();
      
      // Update local state
      setWorkflows(prev => prev.map(w => 
        w.id === workflowId ? { ...w, currentStage: result.workflow.currentStage } : w
      ));
      
      // Clear comment
      setApprovalComment('');
      
      // Show success message
      toast.success(
        action === 'APPROVE' 
          ? 'Rechnung erfolgreich genehmigt' 
          : 'Rechnung abgelehnt'
      );
      
      // Refresh data
      fetchPendingApprovals();
      
    } catch (error) {
      console.error('Error processing approval:', error);
      toast.error('Fehler beim Verarbeiten der Genehmigung');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAIRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'APPROVE': return 'text-green-600';
      case 'REJECT': return 'text-red-600';
      case 'REVIEW': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Approval Workflow Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Mehrstufiger Freigabeprozess mit automatischer Workflow-Bestimmung
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Benachrichtigungen
          </Button>
          <Button variant="outline">
            <Activity className="w-4 h-4 mr-2" />
            Workflow-Einstellungen
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-blue-800">Ausstehende Genehmigungen</div>
                <div className="text-2xl font-bold text-blue-900">{pendingApprovals.length}</div>
              </div>
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-green-800">Heute genehmigt</div>
                <div className="text-2xl font-bold text-green-900">23</div>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-red-800">Überfällig</div>
                <div className="text-2xl font-bold text-red-900">
                  {pendingApprovals.filter(p => p.daysWaiting > 3).length}
                </div>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-yellow-800">Ø Bearbeitungszeit</div>
                <div className="text-2xl font-bold text-yellow-900">2.3 Tage</div>
              </div>
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Ausstehend ({pendingApprovals.length})</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ausstehende Genehmigungen</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Lade Genehmigungen...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <div key={approval.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-gray-900">
                              {approval.invoiceNumber}
                            </span>
                            <Badge className={getPriorityColor(approval.priority)}>
                              {approval.priority}
                            </Badge>
                            <Badge className={getStatusColor(approval.currentStage)}>
                              {approval.currentStage}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Lieferant: {approval.vendorName}</div>
                            <div>Betrag: {approval.totalAmount.toLocaleString()} {approval.currency}</div>
                            <div>Wartedauer: {approval.daysWaiting} Tage</div>
                            <div className="flex items-center gap-2">
                              <span>KI-Empfehlung:</span>
                              <span className={getAIRecommendationColor(approval.aiRecommendation)}>
                                {approval.aiRecommendation}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              const workflow = workflows.find(w => w.invoiceId === approval.id);
                              setSelectedWorkflow(workflow || null);
                            }}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Details
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleApproval(approval.id, 1, 'REJECT')}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Ablehnen
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproval(approval.id, 1, 'APPROVE')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Genehmigen
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workflow-Übersicht</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {workflow.invoice.invoiceNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {workflow.invoice.vendorName} • {workflow.invoice.totalAmount.toLocaleString()} {workflow.invoice.currency}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(workflow.currentStage)}>
                          {workflow.currentStage}
                        </Badge>
                        <Badge variant="outline" className={getAIRecommendationColor(workflow.aiRecommendation)}>
                          KI: {workflow.aiRecommendation}
                        </Badge>
                      </div>
                    </div>

                    {/* Workflow Steps */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            workflow.stage1Status === 'APPROVED' ? 'bg-green-500' : 
                            workflow.stage1Status === 'REJECTED' ? 'bg-red-500' : 
                            'bg-yellow-500'
                          }`}>
                            {workflow.stage1Status === 'APPROVED' ? (
                              <CheckCircle className="w-4 h-4 text-white" />
                            ) : workflow.stage1Status === 'REJECTED' ? (
                              <X className="w-4 h-4 text-white" />
                            ) : (
                              <Clock className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm">Stufe 1 - Sachbearbeiter</div>
                            <div className="text-xs text-gray-500">
                              {workflow.stage1Approver || 'Nicht zugewiesen'}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            workflow.stage2Status === 'APPROVED' ? 'bg-green-500' : 
                            workflow.stage2Status === 'REJECTED' ? 'bg-red-500' : 
                            workflow.approvalLevel >= 2 ? 'bg-yellow-500' : 'bg-gray-300'
                          }`}>
                            {workflow.stage2Status === 'APPROVED' ? (
                              <CheckCircle className="w-4 h-4 text-white" />
                            ) : workflow.stage2Status === 'REJECTED' ? (
                              <X className="w-4 h-4 text-white" />
                            ) : workflow.approvalLevel >= 2 ? (
                              <Clock className="w-4 h-4 text-white" />
                            ) : (
                              <User className="w-4 h-4 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm">Stufe 2 - Abteilungsleiter</div>
                            <div className="text-xs text-gray-500">
                              {workflow.stage2Approver || 'Nicht zugewiesen'}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            workflow.stage3Status === 'APPROVED' ? 'bg-green-500' : 
                            workflow.stage3Status === 'REJECTED' ? 'bg-red-500' : 
                            workflow.approvalLevel >= 3 ? 'bg-yellow-500' : 'bg-gray-300'
                          }`}>
                            {workflow.stage3Status === 'APPROVED' ? (
                              <CheckCircle className="w-4 h-4 text-white" />
                            ) : workflow.stage3Status === 'REJECTED' ? (
                              <X className="w-4 h-4 text-white" />
                            ) : workflow.approvalLevel >= 3 ? (
                              <Clock className="w-4 h-4 text-white" />
                            ) : (
                              <User className="w-4 h-4 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm">Stufe 3 - Geschäftsführung</div>
                            <div className="text-xs text-gray-500">
                              {workflow.stage3Approver || 'Nicht zugewiesen'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Fortschritt</span>
                          <span>{Math.round((workflow.approvalLevel / workflow.maxApprovalLevel) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(workflow.approvalLevel / workflow.maxApprovalLevel) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Genehmigungszeiten</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Stufe 1 (Sachbearbeiter)</span>
                    <span className="font-semibold">1.2 Tage</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Stufe 2 (Abteilungsleiter)</span>
                    <span className="font-semibold">2.1 Tage</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Stufe 3 (Geschäftsführung)</span>
                    <span className="font-semibold">1.8 Tage</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-sm font-medium">Durchschnitt</span>
                    <span className="font-bold text-blue-600">2.3 Tage</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">KI-Empfehlungen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Genehmigen</span>
                    <span className="font-semibold text-green-600">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Prüfen</span>
                    <span className="font-semibold text-yellow-600">18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ablehnen</span>
                    <span className="font-semibold text-red-600">4%</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-sm font-medium">Genauigkeit</span>
                    <span className="font-bold text-blue-600">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Approval Comment Modal */}
      {selectedWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Genehmigung - {selectedWorkflow.invoice.invoiceNumber}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedWorkflow(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <div>Lieferant: {selectedWorkflow.invoice.vendorName}</div>
                <div>Betrag: {selectedWorkflow.invoice.totalAmount.toLocaleString()} {selectedWorkflow.invoice.currency}</div>
                <div>KI-Empfehlung: 
                  <span className={getAIRecommendationColor(selectedWorkflow.aiRecommendation)}>
                    {' ' + selectedWorkflow.aiRecommendation}
                  </span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="comment">Kommentar (optional)</Label>
                <Textarea
                  id="comment"
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder="Geben Sie einen Kommentar ein..."
                  className="mt-1"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  className="bg-red-600 hover:bg-red-700 flex-1"
                  onClick={() => {
                    handleApproval(selectedWorkflow.id, selectedWorkflow.approvalLevel, 'REJECT');
                    setSelectedWorkflow(null);
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Ablehnen
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 flex-1"
                  onClick={() => {
                    handleApproval(selectedWorkflow.id, selectedWorkflow.approvalLevel, 'APPROVE');
                    setSelectedWorkflow(null);
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Genehmigen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
