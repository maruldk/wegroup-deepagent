
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Receipt, 
  Search, 
  Upload, 
  FileText,
  Calendar,
  Euro,
  Brain,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Download
} from 'lucide-react'
import { toast } from 'sonner'
import { useDropzone } from 'react-dropzone'

interface Invoice {
  id: string
  invoiceNumber: string
  vendorName: string
  vendorEmail?: string
  invoiceDate: string
  dueDate: string
  totalAmount: number
  currency: string
  processingStatus: string
  paymentStatus: string
  approvalStatus: string
  documentUrl?: string
  ocrConfidenceScore?: number
  extractedData?: any
  isDuplicate?: boolean
  predictedGlAccount?: string
  aiValidationScore?: number
  createdAt: string
}

const statusLabels: { [key: string]: string } = {
  'RECEIVED': 'Eingegangen',
  'OCR_IN_PROGRESS': 'OCR läuft',
  'OCR_COMPLETED': 'OCR fertig',
  'VALIDATION_PENDING': 'Validierung',
  'VALIDATED': 'Validiert',
  'APPROVED': 'Genehmigt',
  'PAID': 'Bezahlt',
  'REJECTED': 'Abgelehnt'
}

const statusColors: { [key: string]: string } = {
  'RECEIVED': 'bg-blue-100 text-blue-800',
  'OCR_IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
  'OCR_COMPLETED': 'bg-green-100 text-green-800',
  'VALIDATION_PENDING': 'bg-orange-100 text-orange-800',
  'VALIDATED': 'bg-green-100 text-green-800',
  'APPROVED': 'bg-green-100 text-green-800',
  'PAID': 'bg-green-100 text-green-800',
  'REJECTED': 'bg-red-100 text-red-800'
}

export function InvoiceManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [vendorFilter, setVendorFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchInvoices()
  }, [page, statusFilter, vendorFilter])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })
      
      if (statusFilter) params.append('status', statusFilter)
      if (vendorFilter) params.append('vendor', vendorFilter)

      const response = await fetch(`/api/finance/invoices?${params}`)
      if (response.ok) {
        const data = await response.json()
        setInvoices(data.invoices)
        setTotal(data.pagination.total)
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      toast.info('Rechnung wird hochgeladen und verarbeitet...')
      
      const response = await fetch('/api/finance/invoices/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.isDuplicate) {
          toast.warning(`Mögliches Duplikat erkannt! Ähnliche Rechnung vom ${new Date(data.duplicateMatch.createdAt).toLocaleDateString('de-DE')}`)
        } else {
          toast.success('Rechnung erfolgreich verarbeitet!')
        }
        
        // Refresh the list
        fetchInvoices()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Upload fehlgeschlagen')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Upload fehlgeschlagen')
    } finally {
      setUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    maxFiles: 1,
    disabled: uploading
  })

  const filteredInvoices = invoices.filter(invoice => {
    if (!searchTerm) return true
    return invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
           invoice.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const getValidationBadge = (score?: number) => {
    if (!score) return null
    
    if (score >= 0.8) {
      return (
        <Badge className="bg-green-100 text-green-800 text-xs">
          <CheckCircle className="h-3 w-3 mr-1" />
          Validiert ({Math.round(score * 100)}%)
        </Badge>
      )
    } else if (score >= 0.6) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Prüfung ({Math.round(score * 100)}%)
        </Badge>
      )
    } else {
      return (
        <Badge variant="destructive" className="text-xs">
          <X className="h-3 w-3 mr-1" />
          Fehler ({Math.round(score * 100)}%)
        </Badge>
      )
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Rechnung hochladen</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-2">
              <Upload className="h-8 w-8 text-gray-400 mx-auto" />
              {uploading ? (
                <div className="space-y-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-600">Verarbeite Rechnung mit KI...</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">
                    {isDragActive ? 'Datei hier ablegen...' : 'PDF oder Bild hierher ziehen oder klicken zum Auswählen'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Unterstützt: PDF, JPG, PNG (max. 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Receipt className="h-5 w-5" />
              <span>Rechnungsverwaltung</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Brain className="h-3 w-3 mr-1" />
                KI-gestützt
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Suche nach Rechnungsnummer oder Lieferant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="RECEIVED">Eingegangen</SelectItem>
                <SelectItem value="OCR_COMPLETED">OCR fertig</SelectItem>
                <SelectItem value="VALIDATED">Validiert</SelectItem>
                <SelectItem value="APPROVED">Genehmigt</SelectItem>
                <SelectItem value="PAID">Bezahlt</SelectItem>
              </SelectContent>
            </Select>
            <Select value={vendorFilter} onValueChange={setVendorFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Lieferant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Lieferanten</SelectItem>
                <SelectItem value="Microsoft">Microsoft</SelectItem>
                <SelectItem value="Amazon">Amazon</SelectItem>
                <SelectItem value="Google">Google</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Invoice List */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Lade Rechnungen...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold truncate">
                            {invoice.invoiceNumber}
                          </h3>
                          <Badge className={statusColors[invoice.processingStatus] || 'bg-gray-100 text-gray-800'}>
                            {statusLabels[invoice.processingStatus] || invoice.processingStatus}
                          </Badge>
                          {invoice.isDuplicate && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Duplikat
                            </Badge>
                          )}
                          {getValidationBadge(invoice.aiValidationScore)}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <span className="font-medium">{invoice.vendorName}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Euro className="h-3 w-3" />
                              <span className="font-medium">
                                {invoice.totalAmount.toLocaleString('de-DE', { 
                                  style: 'currency', 
                                  currency: invoice.currency 
                                })}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Fällig: {new Date(invoice.dueDate).toLocaleDateString('de-DE')}</span>
                            </div>
                            
                            {invoice.predictedGlAccount && (
                              <div className="flex items-center space-x-1">
                                <Brain className="h-3 w-3 text-purple-600" />
                                <span className="text-purple-600">GL: {invoice.predictedGlAccount}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* OCR Confidence */}
                          {invoice.ocrConfidenceScore !== null && invoice.ocrConfidenceScore !== undefined && (
                            <div className="flex items-center space-x-2">
                              <Eye className="h-3 w-3 text-indigo-600" />
                              <span className="text-xs text-indigo-600">
                                OCR-Genauigkeit: {Math.round(invoice.ocrConfidenceScore * 100)}%
                              </span>
                              <div className="flex-1 max-w-32">
                                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                    style={{ width: `${invoice.ocrConfidenceScore * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Extracted Data Preview */}
                          {invoice.extractedData && Object.keys(invoice.extractedData).length > 0 && (
                            <div className="bg-gray-50 p-2 rounded text-xs">
                              <span className="text-gray-500">KI-Extraktion: </span>
                              {invoice.extractedData.lineItems && invoice.extractedData.lineItems.length > 0 && (
                                <span>{invoice.extractedData.lineItems[0].description}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col items-end space-y-2 min-w-24">
                        <div className="text-right text-xs text-gray-500">
                          {new Date(invoice.createdAt).toLocaleDateString('de-DE')}
                        </div>
                        
                        <div className="flex space-x-1">
                          {invoice.documentUrl && (
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {invoice.processingStatus === 'OCR_COMPLETED' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                            Genehmigen
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredInvoices.length === 0 && (
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Keine Rechnungen gefunden</p>
                </div>
              )}
              
              {/* Pagination */}
              {total > 10 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-gray-600">
                    Zeige {Math.min(page * 10, total)} von {total} Rechnungen
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Zurück
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={page * 10 >= total}
                    >
                      Weiter
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
