
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Package, 
  Receipt, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  RefreshCw,
  TrendingUp,
  Activity,
  Eye,
  Brain,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface ThreeWayMatchData {
  id: string;
  invoiceId: string;
  invoice: {
    invoiceNumber: string;
    vendorName: string;
    totalAmount: number;
    currency: string;
    invoiceDate: string;
  };
  purchaseOrder: {
    orderNumber: string;
    orderDate: string;
    totalAmount: number;
    status: string;
  };
  goodsReceipt: {
    receiptNumber: string;
    receiptDate: string;
    totalAmount: number;
    status: string;
  };
  matchingResults: {
    quantityMatch: boolean;
    priceMatch: boolean;
    vendorMatch: boolean;
    dateMatch: boolean;
    overallMatchScore: number;
    matchingStatus: string;
  };
  discrepancies: Array<{
    type: string;
    description: string;
    severity: string;
    expectedValue: string;
    actualValue: string;
  }>;
  resolutionActions: Array<{
    action: string;
    priority: string;
    description: string;
  }>;
  aiAnalysis: {
    confidence: number;
    recommendation: string;
    riskFactors: string[];
  };
  tolerances: {
    quantityTolerance: number;
    priceTolerance: number;
    dateTolerance: number;
  };
}

interface MatchingStats {
  totalMatches: number;
  automaticMatches: number;
  manualReviews: number;
  discrepancies: number;
  avgMatchScore: number;
  processingTime: number;
}

export function ThreeWayMatchingInterface() {
  const [matchingData, setMatchingData] = useState<ThreeWayMatchData[]>([]);
  const [stats, setStats] = useState<MatchingStats>({
    totalMatches: 0,
    automaticMatches: 0,
    manualReviews: 0,
    discrepancies: 0,
    avgMatchScore: 0,
    processingTime: 0
  });
  const [selectedMatch, setSelectedMatch] = useState<ThreeWayMatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchMatchingData();
    fetchStats();
  }, []);

  const fetchMatchingData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockData: ThreeWayMatchData[] = [
        {
          id: '1',
          invoiceId: 'inv-001',
          invoice: {
            invoiceNumber: 'INV-2024-001',
            vendorName: 'Müller GmbH',
            totalAmount: 1250.00,
            currency: 'EUR',
            invoiceDate: '2024-01-15'
          },
          purchaseOrder: {
            orderNumber: 'PO-2024-001',
            orderDate: '2024-01-10',
            totalAmount: 1250.00,
            status: 'COMPLETED'
          },
          goodsReceipt: {
            receiptNumber: 'GR-2024-001',
            receiptDate: '2024-01-12',
            totalAmount: 1250.00,
            status: 'COMPLETED'
          },
          matchingResults: {
            quantityMatch: true,
            priceMatch: true,
            vendorMatch: true,
            dateMatch: true,
            overallMatchScore: 0.98,
            matchingStatus: 'MATCHED'
          },
          discrepancies: [],
          resolutionActions: [],
          aiAnalysis: {
            confidence: 0.95,
            recommendation: 'APPROVE',
            riskFactors: []
          },
          tolerances: {
            quantityTolerance: 0.05,
            priceTolerance: 0.02,
            dateTolerance: 7
          }
        },
        {
          id: '2',
          invoiceId: 'inv-002',
          invoice: {
            invoiceNumber: 'INV-2024-002',
            vendorName: 'Schmidt AG',
            totalAmount: 850.00,
            currency: 'EUR',
            invoiceDate: '2024-01-16'
          },
          purchaseOrder: {
            orderNumber: 'PO-2024-002',
            orderDate: '2024-01-11',
            totalAmount: 800.00,
            status: 'COMPLETED'
          },
          goodsReceipt: {
            receiptNumber: 'GR-2024-002',
            receiptDate: '2024-01-13',
            totalAmount: 800.00,
            status: 'COMPLETED'
          },
          matchingResults: {
            quantityMatch: true,
            priceMatch: false,
            vendorMatch: true,
            dateMatch: true,
            overallMatchScore: 0.75,
            matchingStatus: 'MANUAL_REVIEW'
          },
          discrepancies: [
            {
              type: 'PRICE',
              description: 'Rechnungsbetrag überschreitet Bestellbetrag',
              severity: 'MEDIUM',
              expectedValue: '800.00 EUR',
              actualValue: '850.00 EUR'
            }
          ],
          resolutionActions: [
            {
              action: 'Prüfen Sie die Preisabweichung',
              priority: 'HIGH',
              description: 'Kontaktieren Sie den Lieferanten bezüglich der Preisdifferenz'
            }
          ],
          aiAnalysis: {
            confidence: 0.78,
            recommendation: 'REVIEW',
            riskFactors: ['Price deviation exceeds tolerance', 'Potential pricing error']
          },
          tolerances: {
            quantityTolerance: 0.05,
            priceTolerance: 0.02,
            dateTolerance: 7
          }
        }
      ];
      
      setMatchingData(mockData);
      setSelectedMatch(mockData[0]);
      
    } catch (error) {
      console.error('Error fetching matching data:', error);
      toast.error('Fehler beim Laden der Matching-Daten');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Mock stats
      setStats({
        totalMatches: 156,
        automaticMatches: 134,
        manualReviews: 22,
        discrepancies: 18,
        avgMatchScore: 0.89,
        processingTime: 12
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const performMatching = async (invoiceId: string) => {
    try {
      setProcessing(true);
      
      // Mock purchase order and goods receipt data
      const purchaseOrderData = {
        orderNumber: 'PO-2024-NEW',
        orderDate: '2024-01-10',
        totalAmount: 1000,
        status: 'COMPLETED'
      };
      
      const goodsReceiptData = {
        receiptNumber: 'GR-2024-NEW',
        receiptDate: '2024-01-12',
        totalAmount: 1000,
        status: 'COMPLETED'
      };
      
      const response = await fetch('/api/finance/three-way-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId,
          tenantId: 'default',
          purchaseOrderData,
          goodsReceiptData
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to perform three-way matching');
      }
      
      const result = await response.json();
      
      // Update local state
      fetchMatchingData();
      toast.success('Drei-Wege-Abgleich erfolgreich durchgeführt');
      
    } catch (error) {
      console.error('Error performing matching:', error);
      toast.error('Fehler beim Durchführen des Drei-Wege-Abgleichs');
    } finally {
      setProcessing(false);
    }
  };

  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case 'MATCHED': return 'bg-green-100 text-green-800';
      case 'UNMATCHED': return 'bg-red-100 text-red-800';
      case 'MANUAL_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'PENDING': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchIcon = (matched: boolean) => {
    return matched ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <X className="w-5 h-5 text-red-600" />
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Three-Way Matching Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Automatischer Abgleich von Bestellung, Wareneingang und Rechnung
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => performMatching('new-invoice')}
            disabled={processing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {processing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Activity className="w-4 h-4 mr-2" />
            )}
            Neuer Abgleich
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Toleranzen
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-blue-800">Gesamt-Abgleiche</div>
                <div className="text-2xl font-bold text-blue-900">{stats.totalMatches}</div>
              </div>
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-green-800">Automatisch</div>
                <div className="text-2xl font-bold text-green-900">{stats.automaticMatches}</div>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-yellow-800">Manuelle Prüfung</div>
                <div className="text-2xl font-bold text-yellow-900">{stats.manualReviews}</div>
              </div>
              <Eye className="w-6 h-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-purple-800">Ø Match-Score</div>
                <div className="text-2xl font-bold text-purple-900">
                  {Math.round(stats.avgMatchScore * 100)}%
                </div>
              </div>
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Matching List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Aktuelle Abgleiche</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Lade Daten...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {matchingData.map((match) => (
                  <div
                    key={match.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedMatch?.id === match.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedMatch(match)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-sm">{match.invoice.invoiceNumber}</div>
                      <Badge className={getMatchStatusColor(match.matchingResults.matchingStatus)}>
                        {match.matchingResults.matchingStatus}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>{match.invoice.vendorName}</div>
                      <div>{match.invoice.totalAmount.toLocaleString()} {match.invoice.currency}</div>
                      <div>Score: {Math.round(match.matchingResults.overallMatchScore * 100)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Matching Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedMatch ? `Abgleich-Details - ${selectedMatch.invoice.invoiceNumber}` : 'Abgleich-Details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMatch ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Übersicht</TabsTrigger>
                  <TabsTrigger value="documents">Dokumente</TabsTrigger>
                  <TabsTrigger value="discrepancies">Abweichungen</TabsTrigger>
                  <TabsTrigger value="analysis">KI-Analyse</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Match Score */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-blue-900">Gesamt-Match-Score</h3>
                      <span className="text-2xl font-bold text-blue-900">
                        {Math.round(selectedMatch.matchingResults.overallMatchScore * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={selectedMatch.matchingResults.overallMatchScore * 100} 
                      className="h-3"
                    />
                  </div>

                  {/* Matching Results */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          {getMatchIcon(selectedMatch.matchingResults.quantityMatch)}
                          <span className="text-sm font-medium">Mengen-Abgleich</span>
                        </div>
                        <Badge variant="outline" className={
                          selectedMatch.matchingResults.quantityMatch 
                            ? 'border-green-500 text-green-700' 
                            : 'border-red-500 text-red-700'
                        }>
                          {selectedMatch.matchingResults.quantityMatch ? 'OK' : 'Abweichung'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          {getMatchIcon(selectedMatch.matchingResults.priceMatch)}
                          <span className="text-sm font-medium">Preis-Abgleich</span>
                        </div>
                        <Badge variant="outline" className={
                          selectedMatch.matchingResults.priceMatch 
                            ? 'border-green-500 text-green-700' 
                            : 'border-red-500 text-red-700'
                        }>
                          {selectedMatch.matchingResults.priceMatch ? 'OK' : 'Abweichung'}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          {getMatchIcon(selectedMatch.matchingResults.vendorMatch)}
                          <span className="text-sm font-medium">Lieferanten-Abgleich</span>
                        </div>
                        <Badge variant="outline" className={
                          selectedMatch.matchingResults.vendorMatch 
                            ? 'border-green-500 text-green-700' 
                            : 'border-red-500 text-red-700'
                        }>
                          {selectedMatch.matchingResults.vendorMatch ? 'OK' : 'Abweichung'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          {getMatchIcon(selectedMatch.matchingResults.dateMatch)}
                          <span className="text-sm font-medium">Datum-Abgleich</span>
                        </div>
                        <Badge variant="outline" className={
                          selectedMatch.matchingResults.dateMatch 
                            ? 'border-green-500 text-green-700' 
                            : 'border-red-500 text-red-700'
                        }>
                          {selectedMatch.matchingResults.dateMatch ? 'OK' : 'Abweichung'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Tolerances */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Toleranzen</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Menge:</span>
                        <div className="font-medium">{selectedMatch.tolerances.quantityTolerance * 100}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Preis:</span>
                        <div className="font-medium">{selectedMatch.tolerances.priceTolerance * 100}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Datum:</span>
                        <div className="font-medium">{selectedMatch.tolerances.dateTolerance} Tage</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Invoice */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center">
                          <Receipt className="w-4 h-4 mr-2" />
                          Rechnung
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Nummer:</span>
                          <div className="font-medium">{selectedMatch.invoice.invoiceNumber}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Datum:</span>
                          <div className="font-medium">{selectedMatch.invoice.invoiceDate}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Betrag:</span>
                          <div className="font-medium">
                            {selectedMatch.invoice.totalAmount.toLocaleString()} {selectedMatch.invoice.currency}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Lieferant:</span>
                          <div className="font-medium">{selectedMatch.invoice.vendorName}</div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Purchase Order */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          Bestellung
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Nummer:</span>
                          <div className="font-medium">{selectedMatch.purchaseOrder.orderNumber}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Datum:</span>
                          <div className="font-medium">{selectedMatch.purchaseOrder.orderDate}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Betrag:</span>
                          <div className="font-medium">
                            {selectedMatch.purchaseOrder.totalAmount.toLocaleString()} {selectedMatch.invoice.currency}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            {selectedMatch.purchaseOrder.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Goods Receipt */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center">
                          <Package className="w-4 h-4 mr-2" />
                          Wareneingang
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Nummer:</span>
                          <div className="font-medium">{selectedMatch.goodsReceipt.receiptNumber}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Datum:</span>
                          <div className="font-medium">{selectedMatch.goodsReceipt.receiptDate}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Betrag:</span>
                          <div className="font-medium">
                            {selectedMatch.goodsReceipt.totalAmount.toLocaleString()} {selectedMatch.invoice.currency}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            {selectedMatch.goodsReceipt.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="discrepancies" className="space-y-4">
                  {selectedMatch.discrepancies.length > 0 ? (
                    <div className="space-y-4">
                      {selectedMatch.discrepancies.map((discrepancy, index) => (
                        <Card key={index} className="border-l-4 border-l-yellow-500">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                <span className="font-medium">{discrepancy.type}</span>
                              </div>
                              <Badge className={getSeverityColor(discrepancy.severity)}>
                                {discrepancy.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{discrepancy.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Erwartet:</span>
                                <div className="font-medium">{discrepancy.expectedValue}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Tatsächlich:</span>
                                <div className="font-medium">{discrepancy.actualValue}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {/* Resolution Actions */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Lösungsmaßnahmen</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedMatch.resolutionActions.map((action, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{action.action}</div>
                                  <div className="text-xs text-gray-600 mt-1">{action.description}</div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {action.priority}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <p>Keine Abweichungen gefunden</p>
                      <p className="text-sm">Alle Dokumente stimmen überein</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="analysis" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center">
                        <Brain className="w-4 h-4 mr-2" />
                        KI-Analyse
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Konfidenz</div>
                          <div className="text-2xl font-bold text-blue-600">
                            {Math.round(selectedMatch.aiAnalysis.confidence * 100)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Empfehlung</div>
                          <Badge className={
                            selectedMatch.aiAnalysis.recommendation === 'APPROVE' 
                              ? 'bg-green-100 text-green-800'
                              : selectedMatch.aiAnalysis.recommendation === 'REJECT'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }>
                            {selectedMatch.aiAnalysis.recommendation}
                          </Badge>
                        </div>
                      </div>
                      
                      {selectedMatch.aiAnalysis.riskFactors.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-2">Risikofaktoren</div>
                          <div className="space-y-2">
                            {selectedMatch.aiAnalysis.riskFactors.map((factor, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                <span>{factor}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Wählen Sie einen Abgleich aus der Liste aus
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
