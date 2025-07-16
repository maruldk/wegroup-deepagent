
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Edit3,
  Save,
  X,
  Download,
  RefreshCw,
  TrendingUp,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface InvoiceReviewData {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  vendorEmail: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  currency: string;
  processingStatus: string;
  documentUrl: string;
  extractedData: any;
  ocrResult: {
    overallConfidence: number;
    textQuality: number;
    dataAccuracy: number;
    validationStatus: string;
    extractedFields: any;
    validationErrors: any[];
  };
  confidenceScore: {
    overallConfidence: number;
    ocrConfidence: number;
    dataExtractionConfidence: number;
    validationConfidence: number;
    confidenceLevel: string;
    processingRecommendation: string;
  };
  threeWayMatch?: {
    overallMatchScore: number;
    matchingStatus: string;
    discrepancies: any[];
  };
}

export function InvoiceReviewInterface() {
  const [invoice, setInvoice] = useState<InvoiceReviewData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('extracted');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const invoiceId = urlParams.get('id');
    if (invoiceId) {
      fetchInvoiceData(invoiceId);
    }
  }, []);

  const fetchInvoiceData = async (invoiceId: string) => {
    try {
      setLoading(true);
      
      // Fetch invoice data
      const invoiceResponse = await fetch(`/api/finance/invoices?invoiceId=${invoiceId}`);
      const invoiceData = await invoiceResponse.json();
      
      // Fetch confidence score
      const confidenceResponse = await fetch(`/api/finance/confidence-score?invoiceId=${invoiceId}`);
      const confidenceData = await confidenceResponse.json();
      
      // Fetch three-way match if available
      const threeWayResponse = await fetch(`/api/finance/three-way-match?invoiceId=${invoiceId}`);
      const threeWayData = threeWayResponse.ok ? await threeWayResponse.json() : null;

      // Mock data for demonstration
      const mockInvoice: InvoiceReviewData = {
        id: invoiceId,
        invoiceNumber: 'INV-2024-001',
        vendorName: 'Müller GmbH',
        vendorEmail: 'info@mueller-gmbh.de',
        invoiceDate: '2024-01-15',
        dueDate: '2024-02-15',
        totalAmount: 1250.00,
        currency: 'EUR',
        processingStatus: 'OCR_COMPLETED',
        documentUrl: '/documents/invoice-001.pdf',
        extractedData: {
          invoiceNumber: 'INV-2024-001',
          vendorName: 'Müller GmbH',
          vendorEmail: 'info@mueller-gmbh.de',
          totalAmount: 1250.00,
          currency: 'EUR',
          lineItems: [
            { description: 'Consulting Services', quantity: 10, unitPrice: 100, totalPrice: 1000 },
            { description: 'Travel Expenses', quantity: 1, unitPrice: 250, totalPrice: 250 }
          ],
          paymentTerms: 'Net 30',
          taxInformation: { taxRate: 0.19, taxAmount: 200 }
        },
        ocrResult: {
          overallConfidence: 0.85,
          textQuality: 0.92,
          dataAccuracy: 0.88,
          validationStatus: 'VALIDATED',
          extractedFields: {},
          validationErrors: []
        },
        confidenceScore: {
          overallConfidence: 0.85,
          ocrConfidence: 0.92,
          dataExtractionConfidence: 0.88,
          validationConfidence: 0.75,
          confidenceLevel: 'HIGH',
          processingRecommendation: 'AUTOMATIC'
        },
        threeWayMatch: {
          overallMatchScore: 0.95,
          matchingStatus: 'MATCHED',
          discrepancies: []
        }
      };

      setInvoice(mockInvoice);
      setEditedData(mockInvoice.extractedData);
      
    } catch (error) {
      console.error('Error fetching invoice data:', error);
      toast.error('Fehler beim Laden der Rechnungsdaten');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!invoice) return;

    try {
      setSaving(true);
      
      // Update invoice with edited data
      const response = await fetch(`/api/finance/invoices/${invoice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          extractedData: editedData,
          processingStatus: 'VALIDATED'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update invoice');
      }

      // Update local state
      setInvoice(prev => prev ? { ...prev, extractedData: editedData } : null);
      setEditMode(false);
      toast.success('Rechnungsdaten erfolgreich aktualisiert');
      
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error('Fehler beim Speichern der Rechnungsdaten');
    } finally {
      setSaving(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadgeColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-500">Rechnung nicht gefunden</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Invoice Review - {invoice.invoiceNumber}
          </h1>
          <p className="text-gray-600 mt-1">
            Manuelle Überprüfung und Validierung von OCR-Ergebnissen
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setEditMode(!editMode)}
            variant="outline"
            className={editMode ? 'bg-red-50 border-red-200' : ''}
          >
            {editMode ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
            {editMode ? 'Abbrechen' : 'Bearbeiten'}
          </Button>
          {editMode && (
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Speichern
            </Button>
          )}
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Confidence Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-blue-800">Gesamt-Konfidenz</div>
                <div className={`text-xl font-bold ${getConfidenceColor(invoice.confidenceScore.overallConfidence)}`}>
                  {Math.round(invoice.confidenceScore.overallConfidence * 100)}%
                </div>
              </div>
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-green-800">OCR-Qualität</div>
                <div className={`text-xl font-bold ${getConfidenceColor(invoice.ocrResult.textQuality)}`}>
                  {Math.round(invoice.ocrResult.textQuality * 100)}%
                </div>
              </div>
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-yellow-800">Datengenauigkeit</div>
                <div className={`text-xl font-bold ${getConfidenceColor(invoice.ocrResult.dataAccuracy)}`}>
                  {Math.round(invoice.ocrResult.dataAccuracy * 100)}%
                </div>
              </div>
              <Activity className="w-6 h-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-purple-800">Empfehlung</div>
                <Badge className={getConfidenceBadgeColor(invoice.confidenceScore.confidenceLevel)}>
                  {invoice.confidenceScore.processingRecommendation}
                </Badge>
              </div>
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Dokument-Vorschau
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="text-gray-500 mb-4">PDF-Vorschau</div>
              <div className="w-full h-96 bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Dokument wird geladen...</p>
                  <p className="text-sm text-gray-400 mt-1">{invoice.documentUrl}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Extracted Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Extrahierte Daten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="extracted">Basisdaten</TabsTrigger>
                <TabsTrigger value="lineItems">Positionen</TabsTrigger>
                <TabsTrigger value="analysis">Analyse</TabsTrigger>
              </TabsList>
              
              <TabsContent value="extracted" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="invoiceNumber">Rechnungsnummer</Label>
                    <Input
                      id="invoiceNumber"
                      value={editedData.invoiceNumber || ''}
                      onChange={(e) => setEditedData({...editedData, invoiceNumber: e.target.value})}
                      disabled={!editMode}
                      className={editMode ? 'bg-yellow-50' : ''}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="vendorName">Lieferant</Label>
                    <Input
                      id="vendorName"
                      value={editedData.vendorName || ''}
                      onChange={(e) => setEditedData({...editedData, vendorName: e.target.value})}
                      disabled={!editMode}
                      className={editMode ? 'bg-yellow-50' : ''}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="vendorEmail">Lieferanten-E-Mail</Label>
                    <Input
                      id="vendorEmail"
                      value={editedData.vendorEmail || ''}
                      onChange={(e) => setEditedData({...editedData, vendorEmail: e.target.value})}
                      disabled={!editMode}
                      className={editMode ? 'bg-yellow-50' : ''}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="totalAmount">Gesamtbetrag</Label>
                      <Input
                        id="totalAmount"
                        type="number"
                        value={editedData.totalAmount || ''}
                        onChange={(e) => setEditedData({...editedData, totalAmount: parseFloat(e.target.value)})}
                        disabled={!editMode}
                        className={editMode ? 'bg-yellow-50' : ''}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="currency">Währung</Label>
                      <Input
                        id="currency"
                        value={editedData.currency || ''}
                        onChange={(e) => setEditedData({...editedData, currency: e.target.value})}
                        disabled={!editMode}
                        className={editMode ? 'bg-yellow-50' : ''}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="paymentTerms">Zahlungsbedingungen</Label>
                    <Input
                      id="paymentTerms"
                      value={editedData.paymentTerms || ''}
                      onChange={(e) => setEditedData({...editedData, paymentTerms: e.target.value})}
                      disabled={!editMode}
                      className={editMode ? 'bg-yellow-50' : ''}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="lineItems" className="space-y-4">
                <div className="space-y-3">
                  {editedData.lineItems?.map((item: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Beschreibung:</span>
                          <div>{item.description}</div>
                        </div>
                        <div>
                          <span className="font-medium">Menge:</span>
                          <div>{item.quantity}</div>
                        </div>
                        <div>
                          <span className="font-medium">Einzelpreis:</span>
                          <div>{item.unitPrice} €</div>
                        </div>
                        <div>
                          <span className="font-medium">Gesamtpreis:</span>
                          <div>{item.totalPrice} €</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="analysis" className="space-y-4">
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Konfidenz-Analyse</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>OCR-Konfidenz:</span>
                        <span className={getConfidenceColor(invoice.confidenceScore.ocrConfidence)}>
                          {Math.round(invoice.confidenceScore.ocrConfidence * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Datenextraktion:</span>
                        <span className={getConfidenceColor(invoice.confidenceScore.dataExtractionConfidence)}>
                          {Math.round(invoice.confidenceScore.dataExtractionConfidence * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Validierung:</span>
                        <span className={getConfidenceColor(invoice.confidenceScore.validationConfidence)}>
                          {Math.round(invoice.confidenceScore.validationConfidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {invoice.threeWayMatch && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">Drei-Wege-Abgleich</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Übereinstimmung:</span>
                          <span className="text-green-600">
                            {Math.round(invoice.threeWayMatch.overallMatchScore * 100)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge className="bg-green-100 text-green-800">
                            {invoice.threeWayMatch.matchingStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">Empfehlung</h4>
                    <div className="text-sm text-yellow-800">
                      {invoice.confidenceScore.processingRecommendation === 'AUTOMATIC' 
                        ? 'Diese Rechnung kann automatisch verarbeitet werden.'
                        : 'Manuelle Überprüfung wird empfohlen.'}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge className={getConfidenceBadgeColor(invoice.confidenceScore.confidenceLevel)}>
                {invoice.confidenceScore.confidenceLevel} Konfidenz
              </Badge>
              <span className="text-sm text-gray-600">
                Status: {invoice.processingStatus}
              </span>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/finance/invoice-processing'}
              >
                Zurück zur Übersicht
              </Button>
              
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  // Handle rejection
                  toast.error('Rechnung abgelehnt');
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Ablehnen
              </Button>
              
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  // Handle approval
                  toast.success('Rechnung genehmigt');
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Genehmigen
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
