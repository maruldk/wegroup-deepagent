
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Smartphone, 
  Bell, 
  CheckCircle, 
  X, 
  Clock, 
  TrendingUp,
  User,
  FileText,
  AlertTriangle,
  MessageSquare,
  Settings,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface MobileApprovalItem {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  totalAmount: number;
  currency: string;
  currentStage: string;
  requiredBy: string;
  daysWaiting: number;
  priority: string;
  aiRecommendation: string;
  aiConfidence: number;
  riskLevel: string;
  quickApprovalEligible: boolean;
  notificationSent: boolean;
  lastNotificationTime: string;
}

interface MobileStats {
  pendingApprovals: number;
  todayApproved: number;
  avgResponseTime: number;
  mobileUsage: number;
}

export function MobileApprovalInterface() {
  const [approvals, setApprovals] = useState<MobileApprovalItem[]>([]);
  const [stats, setStats] = useState<MobileStats>({
    pendingApprovals: 0,
    todayApproved: 0,
    avgResponseTime: 0,
    mobileUsage: 0
  });
  const [selectedApproval, setSelectedApproval] = useState<MobileApprovalItem | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchApprovals();
    fetchStats();
  }, []);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      
      // Mock data for mobile approval demonstration
      const mockApprovals: MobileApprovalItem[] = [
        {
          id: '1',
          invoiceNumber: 'INV-2024-001',
          vendorName: 'Müller GmbH',
          totalAmount: 1250.00,
          currency: 'EUR',
          currentStage: 'STAGE_1',
          requiredBy: 'Sie',
          daysWaiting: 1,
          priority: 'HIGH',
          aiRecommendation: 'APPROVE',
          aiConfidence: 0.92,
          riskLevel: 'LOW',
          quickApprovalEligible: true,
          notificationSent: true,
          lastNotificationTime: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          invoiceNumber: 'INV-2024-002',
          vendorName: 'Schmidt AG',
          totalAmount: 850.00,
          currency: 'EUR',
          currentStage: 'STAGE_2',
          requiredBy: 'Ihr Team',
          daysWaiting: 2,
          priority: 'MEDIUM',
          aiRecommendation: 'REVIEW',
          aiConfidence: 0.78,
          riskLevel: 'MEDIUM',
          quickApprovalEligible: false,
          notificationSent: true,
          lastNotificationTime: '2024-01-14T14:20:00Z'
        },
        {
          id: '3',
          invoiceNumber: 'INV-2024-003',
          vendorName: 'Weber & Co',
          totalAmount: 45000.00,
          currency: 'EUR',
          currentStage: 'STAGE_3',
          requiredBy: 'Geschäftsführung',
          daysWaiting: 5,
          priority: 'URGENT',
          aiRecommendation: 'REVIEW',
          aiConfidence: 0.65,
          riskLevel: 'HIGH',
          quickApprovalEligible: false,
          notificationSent: true,
          lastNotificationTime: '2024-01-10T09:15:00Z'
        }
      ];
      
      setApprovals(mockApprovals);
    } catch (error) {
      console.error('Error fetching approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStats({
        pendingApprovals: 12,
        todayApproved: 8,
        avgResponseTime: 2.3,
        mobileUsage: 67
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApproval = async (approvalId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      setProcessing(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setApprovals(prev => prev.filter(a => a.id !== approvalId));
      setSelectedApproval(null);
      setComment('');
      
      toast.success(
        action === 'APPROVE' 
          ? 'Rechnung erfolgreich genehmigt' 
          : 'Rechnung abgelehnt'
      );
      
      // Update stats
      if (action === 'APPROVE') {
        setStats(prev => ({
          ...prev,
          pendingApprovals: prev.pendingApprovals - 1,
          todayApproved: prev.todayApproved + 1
        }));
      }
      
    } catch (error) {
      console.error('Error processing approval:', error);
      toast.error('Fehler beim Verarbeiten der Genehmigung');
    } finally {
      setProcessing(false);
    }
  };

  const sendNotification = async (approvalId: string) => {
    try {
      // Simulate notification sending
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setApprovals(prev => prev.map(a => 
        a.id === approvalId 
          ? { ...a, notificationSent: true, lastNotificationTime: new Date().toISOString() }
          : a
      ));
      
      toast.success('Push-Benachrichtigung gesendet');
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Fehler beim Senden der Benachrichtigung');
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH': return 'text-red-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-green-600';
      default: return 'text-gray-600';
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
            Mobile Approval Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Mobile-optimierte Rechnungsfreigabe mit Push-Notifications
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Benachrichtigungen
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Einstellungen
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-blue-800">Ausstehend</div>
                <div className="text-2xl font-bold text-blue-900">{stats.pendingApprovals}</div>
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
                <div className="text-2xl font-bold text-green-900">{stats.todayApproved}</div>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-yellow-800">Ø Antwortzeit</div>
                <div className="text-2xl font-bold text-yellow-900">{stats.avgResponseTime}h</div>
              </div>
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-purple-800">Mobile Nutzung</div>
                <div className="text-2xl font-bold text-purple-900">{stats.mobileUsage}%</div>
              </div>
              <Smartphone className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Approval Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Smartphone className="w-5 h-5 mr-2" />
              Mobile Genehmigungen
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Lade Genehmigungen...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvals.map((approval) => (
                  <div
                    key={approval.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedApproval?.id === approval.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedApproval(approval)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {approval.invoiceNumber}
                        </span>
                        <Badge className={getPriorityColor(approval.priority)}>
                          {approval.priority}
                        </Badge>
                        {approval.quickApprovalEligible && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Zap className="w-3 h-3 mr-1" />
                            Quick
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {approval.totalAmount.toLocaleString()} {approval.currency}
                        </div>
                        <div className="text-xs text-gray-500">
                          {approval.daysWaiting} Tage wartend
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Lieferant: {approval.vendorName}</div>
                      <div>Erforderlich von: {approval.requiredBy}</div>
                      <div className="flex items-center gap-2">
                        <span>KI-Empfehlung:</span>
                        <span className={getAIRecommendationColor(approval.aiRecommendation)}>
                          {approval.aiRecommendation}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({Math.round(approval.aiConfidence * 100)}% Konfidenz)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Risiko:</span>
                        <span className={getRiskColor(approval.riskLevel)}>
                          {approval.riskLevel}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-2">
                        {approval.notificationSent && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            <Bell className="w-3 h-3 mr-1" />
                            Benachrichtigt
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            sendNotification(approval.id);
                          }}
                          variant="outline"
                          className="text-xs"
                        >
                          <Bell className="w-3 h-3 mr-1" />
                          Benachrichtigen
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Approval Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedApproval ? `Genehmigung - ${selectedApproval.invoiceNumber}` : 'Genehmigungsdetails'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedApproval ? (
              <div className="space-y-6">
                {/* Invoice Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Rechnungsdetails</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Rechnungsnummer:</span>
                      <div className="font-medium">{selectedApproval.invoiceNumber}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Lieferant:</span>
                      <div className="font-medium">{selectedApproval.vendorName}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Betrag:</span>
                      <div className="font-medium text-lg">
                        {selectedApproval.totalAmount.toLocaleString()} {selectedApproval.currency}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Wartedauer:</span>
                      <div className="font-medium">{selectedApproval.daysWaiting} Tage</div>
                    </div>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">KI-Analyse</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-800">Empfehlung:</span>
                      <Badge className={
                        selectedApproval.aiRecommendation === 'APPROVE' 
                          ? 'bg-green-100 text-green-800'
                          : selectedApproval.aiRecommendation === 'REJECT'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }>
                        {selectedApproval.aiRecommendation}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-800">Konfidenz:</span>
                      <span className="font-medium text-blue-900">
                        {Math.round(selectedApproval.aiConfidence * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-800">Risiko:</span>
                      <span className={`font-medium ${getRiskColor(selectedApproval.riskLevel)}`}>
                        {selectedApproval.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                {selectedApproval.quickApprovalEligible && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-900">Quick Approval verfügbar</span>
                    </div>
                    <p className="text-sm text-green-800 mb-3">
                      Diese Rechnung erfüllt alle Kriterien für eine schnelle Genehmigung.
                    </p>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApproval(selectedApproval.id, 'APPROVE')}
                      disabled={processing}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Schnell genehmigen
                    </Button>
                  </div>
                )}

                {/* Comment Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kommentar (optional)
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Geben Sie einen Kommentar ein..."
                    className="h-20"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    className="bg-red-600 hover:bg-red-700 flex-1"
                    onClick={() => handleApproval(selectedApproval.id, 'REJECT')}
                    disabled={processing}
                  >
                    {processing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <X className="w-4 h-4 mr-2" />
                    )}
                    Ablehnen
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 flex-1"
                    onClick={() => handleApproval(selectedApproval.id, 'APPROVE')}
                    disabled={processing}
                  >
                    {processing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Genehmigen
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p>Wählen Sie eine Genehmigung aus</p>
                <p className="text-sm">Tippen Sie auf eine Rechnung in der Liste</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mobile Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mobile Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Push-Benachrichtigungen</h3>
              <p className="text-sm text-gray-600">
                Sofortige Benachrichtigungen über neue Genehmigungsanfragen
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quick Approval</h3>
              <p className="text-sm text-gray-600">
                Ein-Klick-Genehmigung für vertrauenswürdige Rechnungen
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Biometrische Authentifizierung</h3>
              <p className="text-sm text-gray-600">
                Sicherer Zugriff durch Fingerabdruck oder Face ID
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
