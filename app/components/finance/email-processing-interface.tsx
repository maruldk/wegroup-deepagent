
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, 
  Upload, 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Zap,
  FileText,
  Eye,
  Send,
  Play,
  Pause,
  RotateCcw,
  Download,
  Filter,
  Search,
  RefreshCw,
  Activity,
  Target,
  Layers,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface EmailProcessingJob {
  id: string;
  subject: string;
  senderEmail: string;
  receivedAt: string;
  processingStatus: string;
  extractionStatus: string;
  isInvoice: boolean;
  invoiceConfidence: number;
  documentType?: string;
  classification?: {
    documentType: string;
    confidence: number;
    confidenceLevel: string;
    processingRecommendation: string;
    priority: string;
    vendorName?: string;
  };
  invoice?: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    processingStatus: string;
  };
}

interface ProcessingStats {
  RECEIVED: number;
  PROCESSING: number;
  COMPLETED: number;
  FAILED: number;
}

export function EmailProcessingInterface() {
  const [emailJobs, setEmailJobs] = useState<EmailProcessingJob[]>([]);
  const [stats, setStats] = useState<ProcessingStats>({
    RECEIVED: 0,
    PROCESSING: 0,
    COMPLETED: 0,
    FAILED: 0
  });
  const [loading, setLoading] = useState(true);
  const [processingActive, setProcessingActive] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<EmailProcessingJob | null>(null);
  const [classificationBuffer, setClassificationBuffer] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);

  useEffect(() => {
    fetchEmailJobs();
  }, []);

  const fetchEmailJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/finance/email-processing?tenantId=default');
      const data = await response.json();
      setEmailJobs(data.emailInvoices || []);
      setStats(data.stats || {});
    } catch (error) {
      console.error('Error fetching email jobs:', error);
      toast.error('Fehler beim Laden der E-Mail-Jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleStartProcessing = async () => {
    try {
      setProcessingActive(true);
      const response = await fetch('/api/finance/email-monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: 'default',
          action: 'start_monitoring'
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('E-Mail-Verarbeitung gestartet');
        fetchEmailJobs();
      } else {
        toast.error('Fehler beim Starten der Verarbeitung');
      }
    } catch (error) {
      console.error('Error starting processing:', error);
      toast.error('Fehler beim Starten der Verarbeitung');
    }
  };

  const handleStopProcessing = async () => {
    try {
      setProcessingActive(false);
      const response = await fetch('/api/finance/email-monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: 'default',
          action: 'stop_monitoring'
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('E-Mail-Verarbeitung gestoppt');
      } else {
        toast.error('Fehler beim Stoppen der Verarbeitung');
      }
    } catch (error) {
      console.error('Error stopping processing:', error);
      toast.error('Fehler beim Stoppen der Verarbeitung');
    }
  };

  const handleClassifyEmail = async (emailJob: EmailProcessingJob) => {
    try {
      setIsClassifying(true);
      setSelectedJob(emailJob);
      setClassificationBuffer('');

      const response = await fetch('/api/finance/email-classification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: 'default',
          emailSubject: emailJob.subject,
          emailSender: emailJob.senderEmail,
          emailBody: '', // Would be populated from email content
          attachmentInfo: {}
        })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader?.read() || { done: true, value: undefined };
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              // Process complete response
              try {
                const result = JSON.parse(buffer);
                toast.success('E-Mail-Klassifizierung abgeschlossen');
                fetchEmailJobs();
                setIsClassifying(false);
                return;
              } catch (error) {
                console.error('Error parsing classification result:', error);
              }
            } else {
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  buffer += parsed.content;
                  setClassificationBuffer(buffer);
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error classifying email:', error);
      toast.error('Fehler bei der E-Mail-Klassifizierung');
    } finally {
      setIsClassifying(false);
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

  const filteredJobs = emailJobs.filter(job => {
    const matchesFilter = filter === 'all' || job.processingStatus === filter;
    const matchesSearch = searchTerm === '' || 
      job.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.senderEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalJobs = Object.values(stats).reduce((sum, count) => sum + count, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            E-Mail-Verarbeitungspipeline
          </h1>
          <p className="text-gray-600 mt-1">
            Automatisierte E-Mail-Rechnungsverarbeitung mit KI-gestützter Klassifizierung
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {processingActive ? (
            <Button 
              onClick={handleStopProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              <Pause className="w-4 h-4 mr-2" />
              Verarbeitung stoppen
            </Button>
          ) : (
            <Button 
              onClick={handleStartProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Verarbeitung starten
            </Button>
          )}
          <Button variant="outline" onClick={fetchEmailJobs}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Aktualisieren
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-800 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Warteschlange
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{stats.RECEIVED}</div>
            <div className="text-xs text-yellow-600 mt-1">
              Bereit zur Verarbeitung
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-800 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              In Bearbeitung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.PROCESSING}</div>
            <div className="text-xs text-blue-600 mt-1">
              Aktive Verarbeitung
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-800 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Abgeschlossen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.COMPLETED}</div>
            <div className="text-xs text-green-600 mt-1">
              Erfolgreich verarbeitet
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-800 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Fehlgeschlagen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{stats.FAILED}</div>
            <div className="text-xs text-red-600 mt-1">
              Benötigt Aufmerksamkeit
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processing Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Verarbeitungsfortschritt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Gesamtfortschritt</span>
                <span>{Math.round((stats.COMPLETED / totalJobs) * 100)}%</span>
              </div>
              <Progress value={(stats.COMPLETED / totalJobs) * 100} className="h-2" />
            </div>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-yellow-600 font-medium">Warteschlange</div>
                <div className="text-2xl font-bold">{stats.RECEIVED}</div>
              </div>
              <div className="text-center">
                <div className="text-blue-600 font-medium">Verarbeitung</div>
                <div className="text-2xl font-bold">{stats.PROCESSING}</div>
              </div>
              <div className="text-center">
                <div className="text-green-600 font-medium">Abgeschlossen</div>
                <div className="text-2xl font-bold">{stats.COMPLETED}</div>
              </div>
              <div className="text-center">
                <div className="text-red-600 font-medium">Fehlgeschlagen</div>
                <div className="text-2xl font-bold">{stats.FAILED}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Jobs List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Layers className="w-5 h-5 mr-2" />
                E-Mail-Verarbeitungsjobs
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle</SelectItem>
                    <SelectItem value="RECEIVED">Warteschlange</SelectItem>
                    <SelectItem value="PROCESSING">Verarbeitung</SelectItem>
                    <SelectItem value="COMPLETED">Abgeschlossen</SelectItem>
                    <SelectItem value="FAILED">Fehlgeschlagen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Lade E-Mail-Jobs...</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Keine E-Mail-Jobs gefunden
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <div 
                      key={job.id} 
                      className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        selectedJob?.id === job.id ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-medium text-gray-900 text-sm">
                              {job.subject}
                            </span>
                            <Badge className={getStatusColor(job.processingStatus)}>
                              {job.processingStatus}
                            </Badge>
                            {job.classification && (
                              <Badge className={getPriorityColor(job.classification.priority)}>
                                {job.classification.priority}
                              </Badge>
                            )}
                            {job.isInvoice && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Rechnung
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>Von: {job.senderEmail}</div>
                            <div>Empfangen: {new Date(job.receivedAt).toLocaleString()}</div>
                            {job.classification && (
                              <div>
                                Typ: {job.classification.documentType}
                                <span className={`ml-2 ${getConfidenceColor(job.classification.confidence)}`}>
                                  ({Math.round(job.classification.confidence * 100)}%)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClassifyEmail(job);
                            }}
                            disabled={isClassifying}
                          >
                            <Brain className="w-4 h-4 mr-1" />
                            Klassifizieren
                          </Button>
                          {job.invoice && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `/finance/invoice-review?id=${job.invoice.id}`;
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Anzeigen
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

        {/* Processing Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Verarbeitungsdetails
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedJob ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">E-Mail-Betreff</Label>
                  <div className="text-sm text-gray-600 mt-1">{selectedJob.subject}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Absender</Label>
                  <div className="text-sm text-gray-600 mt-1">{selectedJob.senderEmail}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedJob.processingStatus)}>
                      {selectedJob.processingStatus}
                    </Badge>
                  </div>
                </div>
                {selectedJob.classification && (
                  <>
                    <div>
                      <Label className="text-sm font-medium">Dokumenttyp</Label>
                      <div className="text-sm text-gray-600 mt-1">
                        {selectedJob.classification.documentType}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Konfidenz</Label>
                      <div className="mt-1">
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={selectedJob.classification.confidence * 100} 
                            className="flex-1 h-2" 
                          />
                          <span className={`text-sm ${getConfidenceColor(selectedJob.classification.confidence)}`}>
                            {Math.round(selectedJob.classification.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Empfehlung</Label>
                      <div className="text-sm text-gray-600 mt-1">
                        {selectedJob.classification.processingRecommendation}
                      </div>
                    </div>
                    {selectedJob.classification.vendorName && (
                      <div>
                        <Label className="text-sm font-medium">Lieferant</Label>
                        <div className="text-sm text-gray-600 mt-1">
                          {selectedJob.classification.vendorName}
                        </div>
                      </div>
                    )}
                  </>
                )}
                {selectedJob.invoice && (
                  <div>
                    <Label className="text-sm font-medium">Verknüpfte Rechnung</Label>
                    <div className="text-sm text-gray-600 mt-1">
                      {selectedJob.invoice.invoiceNumber}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Wählen Sie einen Job aus, um Details anzuzeigen
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Classification Results */}
      {isClassifying && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              KI-Klassifizierung läuft...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">Analysiere E-Mail-Inhalt...</span>
              </div>
              {classificationBuffer && (
                <div>
                  <Label className="text-sm font-medium">Klassifizierungsergebnis</Label>
                  <Textarea
                    value={classificationBuffer}
                    readOnly
                    className="mt-2 h-32 text-xs"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
