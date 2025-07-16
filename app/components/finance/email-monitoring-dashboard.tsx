
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mail, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  Brain,
  Shield,
  Zap,
  Eye,
  Filter,
  RefreshCw,
  Bell,
  BarChart3,
  Users,
  Server,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface EmailStats {
  processing: Record<string, number>;
  classification: Record<string, number>;
  performance: {
    avgProcessingTime: number;
    avgAiConfidence: number;
    avgAiProcessingTime: number;
    totalEmails: number;
    invoicesDetected: number;
    avgConfidence: number;
  };
}

interface EmailInvoice {
  id: string;
  subject: string;
  senderEmail: string;
  receivedAt: string;
  processingStatus: string;
  isInvoice: boolean;
  invoiceConfidence: number;
  documentType?: string;
  emailConfig: {
    emailAddress: string;
    displayName: string;
  };
  classification?: {
    documentType: string;
    confidence: number;
    confidenceLevel: string;
    processingRecommendation: string;
    priority: string;
  };
  invoice?: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    processingStatus: string;
  };
}

interface HourlyTrend {
  hour: string;
  total_emails: number;
  invoices: number;
  avg_confidence: number;
}

interface EmailConfig {
  id: string;
  emailAddress: string;
  displayName: string;
  connectionStatus: string;
  lastTestDate?: string;
  lastTestResult?: string;
  isActive: boolean;
  _count: {
    emailInvoices: number;
  };
}

export function EmailMonitoringDashboard() {
  const [stats, setStats] = useState<EmailStats>({
    processing: {},
    classification: {},
    performance: {
      avgProcessingTime: 0,
      avgAiConfidence: 0,
      avgAiProcessingTime: 0,
      totalEmails: 0,
      invoicesDetected: 0,
      avgConfidence: 0
    }
  });
  const [recentEmails, setRecentEmails] = useState<EmailInvoice[]>([]);
  const [hourlyTrends, setHourlyTrends] = useState<HourlyTrend[]>([]);
  const [emailConfigs, setEmailConfigs] = useState<EmailConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedConfig, setSelectedConfig] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchMonitoringData();
    if (autoRefresh) {
      const interval = setInterval(fetchMonitoringData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [timeRange, autoRefresh]);

  const fetchMonitoringData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/finance/email-monitoring?tenantId=default&timeRange=${timeRange}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch monitoring data');
      }
      
      const data = await response.json();
      
      // Ensure stats has the correct structure with safe defaults
      const safeStats = {
        processing: data.stats?.processing || {},
        classification: data.stats?.classification || {},
        performance: {
          avgProcessingTime: data.stats?.performance?.avgProcessingTime || 0,
          avgAiConfidence: data.stats?.performance?.avgAiConfidence || 0,
          avgAiProcessingTime: data.stats?.performance?.avgAiProcessingTime || 0,
          totalEmails: data.stats?.performance?.totalEmails || 0,
          invoicesDetected: data.stats?.performance?.invoicesDetected || 0,
          avgConfidence: data.stats?.performance?.avgConfidence || 0
        }
      };
      
      setStats(safeStats);
      setRecentEmails(data.recentEmails || []);
      setHourlyTrends(data.hourlyTrends || []);
      setEmailConfigs(data.emailConfigs || []);
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
      toast.error('Fehler beim Laden der Monitoring-Daten');
      
      // Set safe default values on error
      setStats({
        processing: {},
        classification: {},
        performance: {
          avgProcessingTime: 0,
          avgAiConfidence: 0,
          avgAiProcessingTime: 0,
          totalEmails: 0,
          invoicesDetected: 0,
          avgConfidence: 0
        }
      });
      setRecentEmails([]);
      setHourlyTrends([]);
      setEmailConfigs([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'RECEIVED': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'NORMAL': return 'bg-blue-100 text-blue-800';
      case 'LOW': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEmails = selectedConfig === 'all' 
    ? recentEmails 
    : recentEmails.filter(email => email.emailConfig?.emailAddress?.includes(selectedConfig));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            E-Mail-Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Echtzeit-Überwachung der E-Mail-Rechnungsverarbeitung
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 Stunde</SelectItem>
              <SelectItem value="24h">24 Stunden</SelectItem>
              <SelectItem value="7d">7 Tage</SelectItem>
              <SelectItem value="30d">30 Tage</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 text-green-700' : ''}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {autoRefresh ? 'Auto-Refresh Ein' : 'Auto-Refresh Aus'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchMonitoringData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Aktualisieren
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-800 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Gesamte E-Mails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.performance.totalEmails}</div>
            <div className="text-xs text-blue-600 mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              Zeitraum: {timeRange}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-800 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Rechnungen erkannt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.performance.invoicesDetected}</div>
            <div className="text-xs text-green-600 mt-1">
              <Brain className="w-3 h-3 inline mr-1" />
              {stats.performance.totalEmails > 0 
                ? Math.round((stats.performance.invoicesDetected / stats.performance.totalEmails) * 100)
                : 0}% Erkennungsrate
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-800 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Ø KI-Konfidenz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {Math.round(stats.performance.avgAiConfidence * 100)}%
            </div>
            <div className="text-xs text-purple-600 mt-1">
              <Activity className="w-3 h-3 inline mr-1" />
              Sehr hohe Genauigkeit
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-800 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Ø Verarbeitungszeit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {stats.performance.avgProcessingTime.toFixed(1)}s
            </div>
            <div className="text-xs text-orange-600 mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              KI: {stats.performance.avgAiProcessingTime.toFixed(1)}s
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Verarbeitungsstatistiken
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.processing).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{status}</span>
                  <span className="font-medium">{count}</span>
                </div>
                <Progress 
                  value={stats.performance.totalEmails > 0 ? (count / stats.performance.totalEmails) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              KI-Klassifizierung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.classification).map(([type, count]) => (
              <div key={type}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{type.replace('_', ' ')}</span>
                  <span className="font-medium">{count}</span>
                </div>
                <Progress 
                  value={stats.performance.totalEmails > 0 ? (count / stats.performance.totalEmails) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Email Configuration Health */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Server className="w-5 h-5 mr-2" />
            E-Mail-Konfiguration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emailConfigs.map((config) => (
              <div key={config.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-sm">{config.emailAddress}</div>
                    <div className="text-xs text-gray-600">{config.displayName}</div>
                  </div>
                  <Badge className={
                    config.connectionStatus === 'CONNECTED' ? 'bg-green-100 text-green-800' :
                    config.connectionStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }>
                    {config.connectionStatus}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600">
                  {config._count.emailInvoices} E-Mails verarbeitet
                </div>
                <div className="text-xs text-gray-600">
                  Letzter Test: {config.lastTestDate ? new Date(config.lastTestDate).toLocaleString() : 'Nie'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Emails */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Aktuelle E-Mails
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={selectedConfig} onValueChange={setSelectedConfig}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Konfiguration wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Konfigurationen</SelectItem>
                  {emailConfigs.map((config) => (
                    <SelectItem key={config.id} value={config.emailAddress}>
                      {config.emailAddress}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Lade E-Mails...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEmails.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Keine E-Mails im ausgewählten Zeitraum gefunden
                </div>
              ) : (
                filteredEmails.map((email) => (
                  <div key={email.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium text-gray-900">
                            {email.subject}
                          </span>
                          <Badge className={getStatusColor(email.processingStatus)}>
                            {email.processingStatus}
                          </Badge>
                          {email.classification && (
                            <Badge className={getPriorityColor(email.classification.priority)}>
                              {email.classification.priority}
                            </Badge>
                          )}
                          {email.isInvoice && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Rechnung
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Von: {email.senderEmail}</div>
                          <div>An: {email.emailConfig?.emailAddress || 'Unbekannt'}</div>
                          <div>Empfangen: {new Date(email.receivedAt).toLocaleString()}</div>
                          {email.classification && (
                            <div>
                              Typ: {email.classification.documentType} 
                              <span className={`ml-2 ${getConfidenceColor(email.classification.confidence)}`}>
                                ({Math.round(email.classification.confidence * 100)}% Konfidenz)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {email.invoice && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.location.href = `/finance/invoice-review?id=${email.invoice.id}`}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Rechnung anzeigen
                          </Button>
                        )}
                        {email.classification?.processingRecommendation === 'REVIEW' && (
                          <Button 
                            size="sm" 
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Prüfung erforderlich
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
