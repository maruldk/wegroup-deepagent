
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  File, 
  CheckCircle, 
  AlertTriangle, 
  Brain, 
  X,
  FileText,
  Activity,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  file: File;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  ocrResult?: any;
  confidence?: number;
  extractedData?: any;
  errors?: string[];
}

export function InvoiceUploadInterface() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      status: 'uploading',
      progress: 0
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Process each file
    newFiles.forEach(uploadFile => {
      processFile(uploadFile);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.tiff']
    },
    maxFiles: 10
  });

  const processFile = async (uploadFile: UploadedFile) => {
    try {
      setIsProcessing(true);
      
      // Create invoice record first
      const invoiceResponse = await fetch('/api/finance/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: 'default',
          invoiceData: {
            invoiceNumber: `TEMP-${Date.now()}`,
            vendorName: 'Processing...',
            totalAmount: 0,
            currency: 'EUR'
          }
        })
      });

      if (!invoiceResponse.ok) {
        throw new Error('Failed to create invoice record');
      }

      const { invoice } = await invoiceResponse.json();

      // Update file status
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'processing', progress: 20 }
          : f
      ));

      // Process OCR
      const formData = new FormData();
      formData.append('file', uploadFile.file);
      formData.append('invoiceId', invoice.id);
      formData.append('tenantId', 'default');

      const response = await fetch('/api/finance/ocr-process', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('OCR processing failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                // Process complete
                try {
                  const extractedData = JSON.parse(buffer);
                  
                  // Update file with results
                  setFiles(prev => prev.map(f => 
                    f.id === uploadFile.id 
                      ? { 
                          ...f, 
                          status: 'completed', 
                          progress: 100,
                          extractedData,
                          confidence: extractedData.confidence || 0
                        }
                      : f
                  ));

                  // Calculate confidence score
                  await fetch('/api/finance/confidence-score', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      invoiceId: invoice.id,
                      tenantId: 'default'
                    })
                  });

                  toast.success(`OCR completed for ${uploadFile.file.name}`);
                } catch (error) {
                  console.error('Error processing OCR result:', error);
                  setFiles(prev => prev.map(f => 
                    f.id === uploadFile.id 
                      ? { ...f, status: 'error', errors: ['Failed to process OCR result'] }
                      : f
                  ));
                }
                return;
              }
              
              try {
                const parsed = JSON.parse(data);
                buffer += parsed.content || '';
                
                // Update progress
                setFiles(prev => prev.map(f => 
                  f.id === uploadFile.id 
                    ? { ...f, progress: Math.min(f.progress + 5, 90) }
                    : f
                ));
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('File processing error:', error);
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'error', errors: [error.message] }
          : f
      ));
      toast.error(`Error processing ${uploadFile.file.name}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Invoice Upload & OCR Processing
          </h1>
          <p className="text-gray-600 mt-1">
            Drag & Drop Upload mit Real-time OCR-Preview und Confidence-Indicators
          </p>
        </div>
        <Button 
          onClick={() => window.location.href = '/finance/invoice-processing'}
          variant="outline"
        >
          <Eye className="w-4 h-4 mr-2" />
          Zur Übersicht
        </Button>
      </div>

      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Rechnungen hochladen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {isDragActive ? 'Dateien hier ablegen...' : 'Dateien hochladen'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Drag & Drop oder klicken Sie hier. Unterstützte Formate: PDF, JPG, PNG, TIFF
                </p>
              </div>
              <div className="flex justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Dateien auswählen
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Status */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Verarbeitungsstatus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{file.file.name}</div>
                        <div className="text-sm text-gray-500">
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(file.status)}>
                        {file.status === 'uploading' && 'Hochladen'}
                        {file.status === 'processing' && 'Verarbeitung'}
                        {file.status === 'completed' && 'Abgeschlossen'}
                        {file.status === 'error' && 'Fehler'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {file.status !== 'completed' && file.status !== 'error' && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Fortschritt</span>
                        <span>{file.progress}%</span>
                      </div>
                      <Progress value={file.progress} className="h-2" />
                    </div>
                  )}

                  {/* OCR Results */}
                  {file.status === 'completed' && file.extractedData && (
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">OCR-Ergebnisse</span>
                        </div>
                        {file.confidence && (
                          <Badge 
                            variant="outline" 
                            className={getConfidenceColor(file.confidence)}
                          >
                            {Math.round(file.confidence * 100)}% Konfidenz
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Rechnungsnummer:</span>
                          <div className="font-medium">{file.extractedData.invoiceNumber || 'N/A'}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Lieferant:</span>
                          <div className="font-medium">{file.extractedData.vendorName || 'N/A'}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Betrag:</span>
                          <div className="font-medium">
                            {file.extractedData.totalAmount || 0} {file.extractedData.currency || 'EUR'}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Datum:</span>
                          <div className="font-medium">{file.extractedData.invoiceDate || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Confidence Indicators */}
                  {file.status === 'completed' && file.confidence && (
                    <div className="mt-3 flex items-center gap-4">
                      {file.confidence >= 0.8 && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Hohe Konfidenz - Automatische Verarbeitung</span>
                        </div>
                      )}
                      {file.confidence >= 0.6 && file.confidence < 0.8 && (
                        <div className="flex items-center gap-2 text-yellow-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm">Mittlere Konfidenz - Manuelle Überprüfung empfohlen</span>
                        </div>
                      )}
                      {file.confidence < 0.6 && (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm">Niedrige Konfidenz - Manuelle Überprüfung erforderlich</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Errors */}
                  {file.status === 'error' && file.errors && (
                    <div className="mt-3 bg-red-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-red-600 mb-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-medium">Verarbeitungsfehler</span>
                      </div>
                      <ul className="text-sm text-red-600 space-y-1">
                        {file.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Summary */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Verarbeitungsübersicht</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {files.length}
                </div>
                <div className="text-sm text-gray-600">Dateien gesamt</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {files.filter(f => f.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Erfolgreich verarbeitet</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {files.filter(f => f.status === 'processing').length}
                </div>
                <div className="text-sm text-gray-600">In Bearbeitung</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {files.filter(f => f.status === 'error').length}
                </div>
                <div className="text-sm text-gray-600">Fehlgeschlagen</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
