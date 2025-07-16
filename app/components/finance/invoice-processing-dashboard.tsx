
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  Activity,
  Upload,
  Eye,
  Settings,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface InvoiceStats {
  totalInvoices: number;
  pendingOCR: number;
  needsReview: number;
  autoApproved: number;
  avgConfidenceScore: number;
  processingTime: number;
  accuracyRate: number;
}

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  totalAmount: number;
  currency: string;
  processingStatus: string;
  confidenceScore?: {
    overallConfidence: number;
    confidenceLevel: string;
    processingRecommendation: string;
  };
  ocrResult?: {
    overallConfidence: number;
    processingDuration: number;
    validationStatus: string;
  };
  approvalWorkflow?: {
    currentStage: string;
    workflowType: string;
    aiRecommendation: string;
  };
  createdAt: string;
}

export function InvoiceProcessingDashboard() {
  const [stats, setStats] = useState<InvoiceStats>({
    totalInvoices: 0,
    pendingOCR: 0,
    needsReview: 0,
    autoApproved: 0,
    avgConfidenceScore: 0,
    processingTime: 0,
    accuracyRate: 0
  });
  
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInvoices();
    fetchStats();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/finance/invoices?tenantId=default');
      const data = await response.json();
      setInvoices(data.invoices || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Fehler beim Laden der Rechnungen');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Mock stats for demonstration
      setStats({
        totalInvoices: 247,
        pendingOCR: 12,
        needsReview: 35,
        autoApproved: 156,
        avgConfidenceScore: 0.87,
        processingTime: 45,
        accuracyRate: 0.94
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RECEIVED': return 'bg-blue-100 text-blue-800';
      case 'OCR_IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'OCR_COMPLETED': return 'bg-green-100 text-green-800';
      case 'VALIDATION_PENDING': return 'bg-orange-100 text-orange-800';
      case 'VALIDATED': return 'bg-green-100 text-green-800';
      case 'APPROVED': return 'bg-emerald-100 text-emerald-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (filter === 'all') return true;
    if (filter === 'pending') return ['RECEIVED', 'OCR_IN_PROGRESS', 'VALIDATION_PENDING'].includes(invoice.processingStatus);
    if (filter === 'completed') return ['APPROVED', 'VALIDATED'].includes(invoice.processingStatus);
    if (filter === 'review') return invoice.confidenceScore?.processingRecommendation === 'MANUAL_REVIEW';
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Invoice Processing Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            KI-gestützte Rechnungsverarbeitung mit OCR und automatischer Validierung
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => window.location.href = '/finance/invoice-upload'}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Rechnung hochladen
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Einstellungen
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-800 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Gesamte Rechnungen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.totalInvoices}</div>
            <div className="text-xs text-blue-600 mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +12% vs. letzten Monat
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-800 flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              OCR in Bearbeitung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{stats.pendingOCR}</div>
            <div className="text-xs text-yellow-600 mt-1">
              <Activity className="w-3 h-3 inline mr-1" />
              Ø {stats.processingTime}s Verarbeitung
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-800 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Manuelle Prüfung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{stats.needsReview}</div>
            <div className="text-xs text-orange-600 mt-1">
              <Clock className="w-3 h-3 inline mr-1" />
              Niedrige Konfidenz
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-800 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Automatisch genehmigt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.autoApproved}</div>
            <div className="text-xs text-green-600 mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              {Math.round(stats.avgConfidenceScore * 100)}% Konfidenz
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
              KI-Performance Metriken
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Durchschnittliche Konfidenz</span>
                <span className={getConfidenceColor(stats.avgConfidenceScore)}>
                  {Math.round(stats.avgConfidenceScore * 100)}%
                </span>
              </div>
              <Progress value={stats.avgConfidenceScore * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>OCR-Genauigkeit</span>
                <span className="text-green-600">{Math.round(stats.accuracyRate * 100)}%</span>
              </div>
              <Progress value={stats.accuracyRate * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Automatisierungsrate</span>
                <span className="text-blue-600">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Verarbeitungszeiten
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">OCR-Verarbeitung</span>
              <span className="font-semibold">{stats.processingTime}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Validierung</span>
              <span className="font-semibold">12s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Drei-Wege-Abgleich</span>
              <span className="font-semibold">8s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Gesamte Verarbeitung</span>
              <span className="font-semibold text-green-600">65s</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Aktuelle Rechnungen</CardTitle>
            <Tabs value={filter} onValueChange={setFilter} className="w-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Alle</TabsTrigger>
                <TabsTrigger value="pending">Ausstehend</TabsTrigger>
                <TabsTrigger value="review">Prüfung</TabsTrigger>
                <TabsTrigger value="completed">Abgeschlossen</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Lade Rechnungen...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInvoices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Keine Rechnungen gefunden
                </div>
              ) : (
                filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-900">
                            {invoice.invoiceNumber}
                          </span>
                          <Badge className={getStatusColor(invoice.processingStatus)}>
                            {invoice.processingStatus}
                          </Badge>
                          {invoice.confidenceScore && (
                            <Badge variant="outline" className={getConfidenceColor(invoice.confidenceScore.overallConfidence)}>
                              {Math.round(invoice.confidenceScore.overallConfidence * 100)}% Konfidenz
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Lieferant: {invoice.vendorName}</div>
                          <div>Betrag: {invoice.totalAmount} {invoice.currency}</div>
                          {invoice.approvalWorkflow && (
                            <div>Workflow: {invoice.approvalWorkflow.currentStage}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.location.href = `/finance/invoice-review?id=${invoice.id}`}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Prüfen
                        </Button>
                        {invoice.confidenceScore?.processingRecommendation === 'MANUAL_REVIEW' && (
                          <Button 
                            size="sm" 
                            className="bg-yellow-600 hover:bg-yellow-700"
                            onClick={() => window.location.href = `/finance/invoice-review?id=${invoice.id}`}
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
