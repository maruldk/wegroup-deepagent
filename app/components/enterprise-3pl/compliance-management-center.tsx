
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Brain,
  Settings,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Share,
  Save,
  X,
  Calendar,
  Building,
  Globe,
  Scale,
  Gavel,
  BookOpen,
  Award,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Target,
  Zap,
  Info,
  ExternalLink,
  Archive,
  Flag,
  Star,
  User,
  Mail,
  Phone,
  MapPin,
  Layers,
  Database,
  Lock,
  Unlock,
  AlertCircle,
  HelpCircle,
  CheckSquare,
  XCircle
} from 'lucide-react';

interface ComplianceManagementCenterProps {
  tenantId: string;
}

export default function ComplianceManagementCenter({ tenantId }: ComplianceManagementCenterProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  const [newDocument, setNewDocument] = useState({
    documentType: 'CUSTOMS_DECLARATION',
    title: '',
    description: '',
    documentNumber: '',
    regulationType: 'CUSTOMS',
    issuingAuthority: '',
    validFrom: '',
    validTo: '',
    filePath: '',
    fileUrl: '',
    content: ''
  });

  useEffect(() => {
    loadDocuments();
  }, [tenantId]);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/enterprise-3pl/compliance/documents?tenantId=${tenantId}`);
      const data = await response.json();
      setDocuments(data.data || []);
      setStatistics(data.statistics || {});
    } catch (error) {
      console.error('Fehler beim Laden der Compliance-Dokumente:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createDocument = async () => {
    try {
      const response = await fetch('/api/enterprise-3pl/compliance/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newDocument, tenantId })
      });
      
      if (response.ok) {
        loadDocuments();
        setShowDocumentDialog(false);
        setNewDocument({
          documentType: 'CUSTOMS_DECLARATION',
          title: '',
          description: '',
          documentNumber: '',
          regulationType: 'CUSTOMS',
          issuingAuthority: '',
          validFrom: '',
          validTo: '',
          filePath: '',
          fileUrl: '',
          content: ''
        });
      }
    } catch (error) {
      console.error('Fehler beim Erstellen des Dokuments:', error);
    }
  };

  const updateDocumentStatus = async (documentId: string, action: string) => {
    try {
      const response = await fetch('/api/enterprise-3pl/compliance/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: documentId, action })
      });
      
      if (response.ok) {
        loadDocuments();
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Dokuments:', error);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'EXPIRED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="w-4 h-4" />;
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'UNDER_REVIEW': return <Eye className="w-4 h-4" />;
      case 'REJECTED': return <XCircle className="w-4 h-4" />;
      case 'EXPIRED': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'HIGH': return 'text-orange-600';
      case 'CRITICAL': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const documentTypes = [
    { value: 'CUSTOMS_DECLARATION', label: 'Zollerklärung' },
    { value: 'DANGEROUS_GOODS', label: 'Gefahrgut' },
    { value: 'EXPORT_LICENSE', label: 'Exportlizenz' },
    { value: 'IMPORT_PERMIT', label: 'Importgenehmigung' },
    { value: 'CERTIFICATE_OF_ORIGIN', label: 'Ursprungszeugnis' },
    { value: 'COMMERCIAL_INVOICE', label: 'Handelsrechnung' },
    { value: 'PACKING_LIST', label: 'Packliste' },
    { value: 'BILL_OF_LADING', label: 'Frachtbrief' },
    { value: 'AIRWAY_BILL', label: 'Luftfrachtbrief' },
    { value: 'EORI_CERTIFICATE', label: 'EORI-Zertifikat' },
    { value: 'ATLAS_DECLARATION', label: 'ATLAS-Erklärung' },
    { value: 'T1_DOCUMENT', label: 'T1-Dokument' },
    { value: 'CMR_DOCUMENT', label: 'CMR-Dokument' },
    { value: 'INSURANCE_CERTIFICATE', label: 'Versicherungsschein' },
    { value: 'OTHER', label: 'Sonstiges' }
  ];

  const regulationTypes = [
    { value: 'CUSTOMS', label: 'Zoll' },
    { value: 'DANGEROUS_GOODS', label: 'Gefahrgut' },
    { value: 'EXPORT_CONTROL', label: 'Exportkontrolle' },
    { value: 'IMPORT_CONTROL', label: 'Importkontrolle' },
    { value: 'TRANSPORTATION', label: 'Transport' },
    { value: 'ENVIRONMENTAL', label: 'Umwelt' },
    { value: 'FOOD_SAFETY', label: 'Lebensmittelsicherheit' },
    { value: 'MEDICAL_DEVICE', label: 'Medizinprodukte' },
    { value: 'CHEMICAL', label: 'Chemikalien' },
    { value: 'AUTOMOTIVE', label: 'Automotive' },
    { value: 'ELECTRONICS', label: 'Elektronik' },
    { value: 'TEXTILE', label: 'Textilien' },
    { value: 'INTERNATIONAL_TRADE', label: 'Internationaler Handel' },
    { value: 'OTHER', label: 'Sonstiges' }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.documentNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.documentType === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesRisk = filterRisk === 'all' || doc.aiRiskLevel === filterRisk;
    return matchesSearch && matchesType && matchesStatus && matchesRisk;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-lg">Lade Compliance-Management...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="w-8 h-8 text-red-600" />
              Compliance-Management-Center
            </h1>
            <p className="text-gray-600 mt-1">
              KI-gestützte Compliance-Überwachung und Dokumentenverwaltung
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Bericht exportieren
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Dokumente importieren
            </Button>
            <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Neues Dokument
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Neues Compliance-Dokument hinzufügen</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="documentType">Dokumenttyp</Label>
                      <Select 
                        value={newDocument.documentType} 
                        onValueChange={(value) => setNewDocument({...newDocument, documentType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="regulationType">Regulierung</Label>
                      <Select 
                        value={newDocument.regulationType} 
                        onValueChange={(value) => setNewDocument({...newDocument, regulationType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {regulationTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="title">Titel</Label>
                    <Input
                      id="title"
                      value={newDocument.title}
                      onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
                      placeholder="Dokumenttitel"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Beschreibung</Label>
                    <Textarea
                      id="description"
                      value={newDocument.description}
                      onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
                      placeholder="Dokumentbeschreibung"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="documentNumber">Dokumentnummer</Label>
                      <Input
                        id="documentNumber"
                        value={newDocument.documentNumber}
                        onChange={(e) => setNewDocument({...newDocument, documentNumber: e.target.value})}
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <Label htmlFor="issuingAuthority">Ausstellende Behörde</Label>
                      <Input
                        id="issuingAuthority"
                        value={newDocument.issuingAuthority}
                        onChange={(e) => setNewDocument({...newDocument, issuingAuthority: e.target.value})}
                        placeholder="Behörde oder Institution"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="validFrom">Gültig ab</Label>
                      <Input
                        id="validFrom"
                        type="date"
                        value={newDocument.validFrom}
                        onChange={(e) => setNewDocument({...newDocument, validFrom: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="validTo">Gültig bis</Label>
                      <Input
                        id="validTo"
                        type="date"
                        value={newDocument.validTo}
                        onChange={(e) => setNewDocument({...newDocument, validTo: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Dokumentinhalt</Label>
                    <Textarea
                      id="content"
                      value={newDocument.content}
                      onChange={(e) => setNewDocument({...newDocument, content: e.target.value})}
                      placeholder="Dokumentinhalt für KI-Analyse"
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowDocumentDialog(false)}>
                      Abbrechen
                    </Button>
                    <Button onClick={createDocument} className="bg-red-600 hover:bg-red-700">
                      Dokument erstellen
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Compliance-Score</p>
                    <p className="text-3xl font-bold mt-1">
                      {statistics?.averageCompliance?.toFixed(1) || 0}%
                    </p>
                  </div>
                  <div className="bg-red-400 rounded-full p-3">
                    <Shield className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+5.2% vs. Vormonat</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Genehmigte Dokumente</p>
                    <p className="text-3xl font-bold mt-1">
                      {formatNumber(statistics?.approvedDocuments || 0)}
                    </p>
                  </div>
                  <div className="bg-green-400 rounded-full p-3">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <CheckSquare className="w-4 h-4" />
                  <span className="text-sm">{((statistics?.approvedDocuments || 0) / (statistics?.totalDocuments || 1) * 100).toFixed(1)}% Genehmigungsrate</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">Ausstehende Prüfungen</p>
                    <p className="text-3xl font-bold mt-1">
                      {formatNumber(statistics?.pendingDocuments || 0)}
                    </p>
                  </div>
                  <div className="bg-yellow-400 rounded-full p-3">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Durchschnitt: 2.3 Tage</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Hochrisiko-Dokumente</p>
                    <p className="text-3xl font-bold mt-1">
                      {formatNumber(statistics?.highRiskDocuments || 0)}
                    </p>
                  </div>
                  <div className="bg-purple-400 rounded-full p-3">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Brain className="w-4 h-4" />
                  <span className="text-sm">KI-Risikobewertung</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Document Detail Modal */}
        {selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Dokumentdetails</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedDocument(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-3">Dokumentinformationen</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Titel:</span>
                          <span className="font-medium">{selectedDocument.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Typ:</span>
                          <span className="font-medium">
                            {documentTypes.find(t => t.value === selectedDocument.documentType)?.label || selectedDocument.documentType}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Dokumentnummer:</span>
                          <span className="font-medium">{selectedDocument.documentNumber || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <Badge className={getStatusColor(selectedDocument.status)}>
                            {getStatusIcon(selectedDocument.status)}
                            <span className="ml-1">{selectedDocument.status}</span>
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Regulierung:</span>
                          <span className="font-medium">
                            {regulationTypes.find(r => r.value === selectedDocument.regulationType)?.label || selectedDocument.regulationType}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Ausstellende Behörde:</span>
                          <span className="font-medium">{selectedDocument.issuingAuthority || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3">Gültigkeitsdauer</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Gültig ab:</span>
                          <span className="font-medium">
                            {selectedDocument.validFrom 
                              ? new Date(selectedDocument.validFrom).toLocaleDateString('de-DE')
                              : 'N/A'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Gültig bis:</span>
                          <span className="font-medium">
                            {selectedDocument.validTo 
                              ? new Date(selectedDocument.validTo).toLocaleDateString('de-DE')
                              : 'N/A'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Verifikation:</span>
                          <div className="flex items-center gap-2">
                            {selectedDocument.isVerified ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-yellow-600" />
                            )}
                            <span className="font-medium">
                              {selectedDocument.isVerified ? 'Verifiziert' : 'Nicht verifiziert'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3">Beschreibung</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700">
                          {selectedDocument.description || 'Keine Beschreibung verfügbar'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-3">KI-Analyse</h3>
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Compliance-Score:</span>
                          <span className="font-bold text-blue-600">
                            {selectedDocument.aiCompliance?.toFixed(1) || 0}%
                          </span>
                        </div>
                        <Progress value={selectedDocument.aiCompliance || 0} className="h-2" />
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Risikostufe:</span>
                          <span className={`font-bold ${getRiskColor(selectedDocument.aiRiskLevel)}`}>
                            {selectedDocument.aiRiskLevel || 'N/A'}
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-600">KI-Empfehlungen:</span>
                          <ul className="mt-2 space-y-1">
                            {selectedDocument.aiRecommendations?.map((rec: string, index: number) => (
                              <li key={index} className="text-sm text-gray-700 ml-2">
                                • {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3">Aktionen</h3>
                      <div className="space-y-2">
                        {selectedDocument.status === 'PENDING' && (
                          <>
                            <Button 
                              onClick={() => updateDocumentStatus(selectedDocument.id, 'verify')}
                              className="w-full bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Genehmigen
                            </Button>
                            <Button 
                              onClick={() => updateDocumentStatus(selectedDocument.id, 'reject')}
                              variant="destructive"
                              className="w-full"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Ablehnen
                            </Button>
                          </>
                        )}
                        <Button variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Dokument herunterladen
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Share className="w-4 h-4 mr-2" />
                          Teilen
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3">Verlauf</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <div className="flex-1">
                            <div className="text-sm font-medium">Dokument erstellt</div>
                            <div className="text-xs text-gray-500">
                              {new Date(selectedDocument.createdAt).toLocaleString('de-DE')}
                            </div>
                          </div>
                        </div>
                        
                        {selectedDocument.verificationDate && (
                          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <div className="flex-1">
                              <div className="text-sm font-medium">Dokument verifiziert</div>
                              <div className="text-xs text-gray-500">
                                {new Date(selectedDocument.verificationDate).toLocaleString('de-DE')}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white rounded-lg shadow-sm p-1">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <Activity className="w-4 h-4" />
              Übersicht
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4" />
              Dokumente
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4" />
              Analyse
            </TabsTrigger>
            <TabsTrigger 
              value="audit" 
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <Scale className="w-4 h-4" />
              Audit
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4" />
              Einstellungen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-600" />
                    Compliance-Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Gesamtbewertung</span>
                      <span className="text-2xl font-bold text-red-600">
                        {statistics?.averageCompliance?.toFixed(1) || 0}%
                      </span>
                    </div>
                    <Progress value={statistics?.averageCompliance || 0} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Verifikationsrate</span>
                      <span className="text-2xl font-bold text-green-600">
                        {(statistics?.verificationRate * 100)?.toFixed(1) || 0}%
                      </span>
                    </div>
                    <Progress value={statistics?.verificationRate * 100 || 0} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Abgelaufene Dokumente</span>
                      <span className="text-2xl font-bold text-orange-600">
                        {statistics?.expiredDocuments || 0}
                      </span>
                    </div>
                    <Progress value={Math.min(statistics?.expiredDocuments / statistics?.totalDocuments * 100 || 0, 100)} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    KI-Risikobewertung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm">Kritisches Risiko</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-bold">2%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-sm">Hohes Risiko</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm font-bold">8%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm">Mittleres Risiko</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-bold">25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Niedriges Risiko</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-bold">65%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Compliance nach Regulierungstyp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regulationTypes.slice(0, 6).map((regulation, index) => (
                    <div key={regulation.value} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{regulation.label}</span>
                        <Badge variant="outline">{Math.floor(Math.random() * 50) + 50}%</Badge>
                      </div>
                      <Progress value={Math.floor(Math.random() * 50) + 50} className="h-2" />
                      <div className="text-xs text-gray-600 mt-1">
                        {Math.floor(Math.random() * 20) + 10} Dokumente
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            {/* Search and Filter */}
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Dokument suchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Dokumenttyp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Typen</SelectItem>
                      {documentTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Status</SelectItem>
                      <SelectItem value="APPROVED">Genehmigt</SelectItem>
                      <SelectItem value="PENDING">Ausstehend</SelectItem>
                      <SelectItem value="UNDER_REVIEW">Prüfung</SelectItem>
                      <SelectItem value="REJECTED">Abgelehnt</SelectItem>
                      <SelectItem value="EXPIRED">Abgelaufen</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterRisk} onValueChange={setFilterRisk}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Risiko" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Risiken</SelectItem>
                      <SelectItem value="CRITICAL">Kritisch</SelectItem>
                      <SelectItem value="HIGH">Hoch</SelectItem>
                      <SelectItem value="MEDIUM">Mittel</SelectItem>
                      <SelectItem value="LOW">Niedrig</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Documents Table */}
            <Card className="shadow-lg">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dokument
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Typ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Risiko
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Compliance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gültig bis
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aktionen
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDocuments.map((document, index) => (
                        <tr key={document.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <FileText className="w-4 h-4 text-red-600" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {document.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {document.documentNumber || 'Ohne Nummer'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {documentTypes.find(t => t.value === document.documentType)?.label || document.documentType}
                            </div>
                            <div className="text-sm text-gray-500">
                              {regulationTypes.find(r => r.value === document.regulationType)?.label || document.regulationType}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusColor(document.status)}>
                              {getStatusIcon(document.status)}
                              <span className="ml-1">{document.status}</span>
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${getRiskColor(document.aiRiskLevel)}`}>
                              {document.aiRiskLevel || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-1">
                                <Progress value={document.aiCompliance || 0} className="h-2" />
                              </div>
                              <span className="ml-2 text-sm font-medium">
                                {document.aiCompliance?.toFixed(1) || 0}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {document.validTo 
                                ? new Date(document.validTo).toLocaleDateString('de-DE')
                                : 'N/A'
                              }
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedDocument(document)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Compliance-Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">+8.5%</div>
                        <div className="text-sm text-gray-600">Compliance-Score</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">-15%</div>
                        <div className="text-sm text-gray-600">Risiko-Level</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">92%</div>
                        <div className="text-sm text-gray-600">Automatisierungsgrad</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">1.2 Tage</div>
                        <div className="text-sm text-gray-600">Ø Bearbeitungszeit</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    KI-Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Erkennungsgenauigkeit</span>
                      <span className="text-2xl font-bold text-purple-600">96.8%</span>
                    </div>
                    <Progress value={96.8} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Falsch-Positiv-Rate</span>
                      <span className="text-2xl font-bold text-blue-600">2.1%</span>
                    </div>
                    <Progress value={2.1} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Verarbeitungsgeschwindigkeit</span>
                      <span className="text-2xl font-bold text-green-600">0.3s</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-blue-600" />
                  Audit-Trail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <div>
                        <div className="font-medium">Dokument erstellt</div>
                        <div className="text-sm text-gray-600">Zollerklärung DE-2025-001</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">vor 2 Stunden</div>
                      <div className="text-xs text-gray-500">System</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div>
                        <div className="font-medium">Dokument genehmigt</div>
                        <div className="text-sm text-gray-600">Exportlizenz EU-2025-042</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">vor 4 Stunden</div>
                      <div className="text-xs text-gray-500">M. Müller</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <div>
                        <div className="font-medium">KI-Analyse durchgeführt</div>
                        <div className="text-sm text-gray-600">Gefahrgut-Klassifizierung</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">vor 6 Stunden</div>
                      <div className="text-xs text-gray-500">KI-System</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  Compliance-Einstellungen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minCompliance">Mindest-Compliance-Score (%)</Label>
                      <Input
                        id="minCompliance"
                        type="number"
                        defaultValue="80"
                        placeholder="80"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxRisk">Maximales Risiko-Level</Label>
                      <Select defaultValue="MEDIUM">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Niedrig</SelectItem>
                          <SelectItem value="MEDIUM">Mittel</SelectItem>
                          <SelectItem value="HIGH">Hoch</SelectItem>
                          <SelectItem value="CRITICAL">Kritisch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="autoApproval">Automatische Genehmigung bei Score (%)</Label>
                      <Input
                        id="autoApproval"
                        type="number"
                        defaultValue="95"
                        placeholder="95"
                      />
                    </div>
                    <div>
                      <Label htmlFor="alertThreshold">Alarm-Schwelle für Ablauf (Tage)</Label>
                      <Input
                        id="alertThreshold"
                        type="number"
                        defaultValue="30"
                        placeholder="30"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Save className="w-4 h-4 mr-2" />
                      Einstellungen speichern
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

