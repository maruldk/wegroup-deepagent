
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Package, 
  Clock, 
  TrendingUp, 
  Search, 
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Send,
  Calendar,
  Euro,
  Users,
  BarChart3,
  CheckCircle,
  AlertCircle,
  XCircle,
  PlayCircle,
  StopCircle,
  Award,
  Target,
  Building2,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  description?: string;
  status: string;
  totalQuotes: number;
  budget?: number;
  currency: string;
  deadline: string;
  publishedAt?: string;
  awardedAt?: string;
  customerRequest: {
    id: string;
    title: string;
    customer: {
      id: string;
      customerNumber: string;
      companyName?: string;
      firstName?: string;
      lastName?: string;
      email: string;
    };
  };
  quotes: Array<{
    id: string;
    supplier: {
      id: string;
      supplierNumber: string;
      companyName: string;
      performanceScore?: number;
    };
    totalPrice: number;
    deliveryTime: number;
    status: string;
    aiScore?: number;
    aiRanking?: number;
  }>;
  comparison?: {
    id: string;
    status: string;
    bestQuoteId?: string;
    averagePrice?: number;
  };
  createdAt: string;
  _count?: {
    quotes: number;
  };
}

interface RFQManagementProps {
  tenantId: string;
}

const RFQManagementInterface: React.FC<RFQManagementProps> = ({ tenantId }) => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRFQs();
  }, [searchTerm, statusFilter, currentPage]);

  const fetchRFQs = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      });

      const response = await fetch(`/api/logistics/rfqs?${params}`);
      const data = await response.json();
      
      setRfqs(data.rfqs || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching RFQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishRFQ = async (rfqId: string) => {
    try {
      const response = await fetch(`/api/logistics/rfqs/${rfqId}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notifySuppliers: true,
        }),
      });
      
      if (response.ok) {
        fetchRFQs();
      }
    } catch (error) {
      console.error('Error publishing RFQ:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-500';
      case 'PUBLISHED': return 'bg-blue-500';
      case 'ACTIVE': return 'bg-green-500';
      case 'CLOSED': return 'bg-orange-500';
      case 'CANCELLED': return 'bg-red-500';
      case 'AWARDED': return 'bg-purple-500';
      case 'EXPIRED': return 'bg-gray-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Entwurf';
      case 'PUBLISHED': return 'Veröffentlicht';
      case 'ACTIVE': return 'Aktiv';
      case 'CLOSED': return 'Geschlossen';
      case 'CANCELLED': return 'Abgebrochen';
      case 'AWARDED': return 'Vergeben';
      case 'EXPIRED': return 'Abgelaufen';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT': return <FileText className="h-4 w-4" />;
      case 'PUBLISHED': return <Send className="h-4 w-4" />;
      case 'ACTIVE': return <PlayCircle className="h-4 w-4" />;
      case 'CLOSED': return <StopCircle className="h-4 w-4" />;
      case 'CANCELLED': return <XCircle className="h-4 w-4" />;
      case 'AWARDED': return <Award className="h-4 w-4" />;
      case 'EXPIRED': return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getDeadlineStatus = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { status: 'expired', text: 'Abgelaufen', color: 'text-red-600' };
    if (daysLeft === 0) return { status: 'today', text: 'Heute', color: 'text-orange-600' };
    if (daysLeft === 1) return { status: 'tomorrow', text: 'Morgen', color: 'text-orange-600' };
    if (daysLeft <= 3) return { status: 'urgent', text: `${daysLeft} Tage`, color: 'text-red-600' };
    if (daysLeft <= 7) return { status: 'soon', text: `${daysLeft} Tage`, color: 'text-yellow-600' };
    return { status: 'normal', text: `${daysLeft} Tage`, color: 'text-green-600' };
  };

  const getProgressPercentage = (rfq: RFQ) => {
    const now = new Date();
    const created = new Date(rfq.createdAt);
    const deadline = new Date(rfq.deadline);
    const total = deadline.getTime() - created.getTime();
    const elapsed = now.getTime() - created.getTime();
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const totalRFQs = rfqs.length;
  const activeRFQs = rfqs.filter(r => r.status === 'ACTIVE').length;
  const totalQuotes = rfqs.reduce((sum, r) => sum + r.totalQuotes, 0);
  const avgBudget = rfqs.reduce((sum, r) => sum + (r.budget || 0), 0) / rfqs.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">RFQ Management</h1>
          <p className="text-gray-600 mt-1">Verwalten Sie alle Ausschreibungen</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Neue RFQ
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gesamt RFQs</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRFQs}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-green-600">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktive RFQs</p>
                  <p className="text-2xl font-bold text-gray-900">{activeRFQs}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-purple-600">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gesamt Angebote</p>
                  <p className="text-2xl font-bold text-gray-900">{totalQuotes}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-l-4 border-l-orange-600">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ø Budget</p>
                  <p className="text-2xl font-bold text-gray-900">€{avgBudget.toFixed(0)}</p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Euro className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Suche nach RFQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="DRAFT">Entwurf</SelectItem>
                  <SelectItem value="PUBLISHED">Veröffentlicht</SelectItem>
                  <SelectItem value="ACTIVE">Aktiv</SelectItem>
                  <SelectItem value="CLOSED">Geschlossen</SelectItem>
                  <SelectItem value="AWARDED">Vergeben</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* RFQ List */}
      <div className="space-y-4">
        <AnimatePresence>
          {rfqs.map((rfq, index) => {
            const deadlineStatus = getDeadlineStatus(rfq.deadline);
            const progress = getProgressPercentage(rfq);
            const isUrgent = deadlineStatus.status === 'urgent' || deadlineStatus.status === 'today';
            
            return (
              <motion.div
                key={rfq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`border-l-4 ${isUrgent ? 'border-l-red-500' : 'border-l-blue-600'} hover:shadow-lg transition-all duration-300`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{rfq.title}</h3>
                          <Badge 
                            variant="secondary" 
                            className={`text-white ${getStatusColor(rfq.status)}`}
                          >
                            {getStatusIcon(rfq.status)}
                            <span className="ml-1">{getStatusText(rfq.status)}</span>
                          </Badge>
                          {isUrgent && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Dringend
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-gray-600">RFQ Nummer</p>
                            <p className="font-medium">{rfq.rfqNumber}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Kunde</p>
                            <p className="font-medium">
                              {rfq.customerRequest.customer.companyName || 
                               `${rfq.customerRequest.customer.firstName} ${rfq.customerRequest.customer.lastName}`}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Angebote</p>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{rfq.totalQuotes}</span>
                              <Progress value={(rfq.totalQuotes / 10) * 100} className="w-16 h-2" />
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-600">Budget</p>
                            <p className="font-medium">
                              {rfq.budget ? `€${rfq.budget.toLocaleString()}` : 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-gray-600">Erstellt</p>
                            <p className="font-medium">
                              {new Date(rfq.createdAt).toLocaleDateString('de-DE')}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Deadline</p>
                            <p className={`font-medium ${deadlineStatus.color}`}>
                              {new Date(rfq.deadline).toLocaleDateString('de-DE')}
                              <span className="ml-1">({deadlineStatus.text})</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Veröffentlicht</p>
                            <p className="font-medium">
                              {rfq.publishedAt ? new Date(rfq.publishedAt).toLocaleDateString('de-DE') : 'Nein'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Vergeben</p>
                            <p className="font-medium">
                              {rfq.awardedAt ? new Date(rfq.awardedAt).toLocaleDateString('de-DE') : 'Nein'}
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Fortschritt</span>
                            <span className="font-medium">{progress.toFixed(0)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        {/* Top Quotes */}
                        {rfq.quotes && rfq.quotes.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Top Angebote</p>
                            <div className="flex flex-wrap gap-2">
                              {rfq.quotes.slice(0, 3).map((quote, idx) => (
                                <Badge key={quote.id} variant="outline" className="text-xs">
                                  {quote.supplier.companyName} - €{quote.totalPrice.toLocaleString()}
                                  {quote.aiRanking && (
                                    <span className="ml-1 text-blue-600">#{quote.aiRanking}</span>
                                  )}
                                </Badge>
                              ))}
                              {rfq.quotes.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{rfq.quotes.length - 3} weitere
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Comparison Status */}
                        {rfq.comparison && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <BarChart3 className="h-4 w-4 text-blue-600" />
                              <span className="text-gray-600">Vergleichsanalyse:</span>
                              <Badge variant="secondary" className={`text-white ${getStatusColor(rfq.comparison.status)}`}>
                                {rfq.comparison.status}
                              </Badge>
                              {rfq.comparison.averagePrice && (
                                <span className="text-gray-600 ml-2">
                                  Ø €{rfq.comparison.averagePrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRFQ(rfq)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                        {rfq.status === 'DRAFT' && (
                          <Button
                            size="sm"
                            onClick={() => handlePublishRFQ(rfq.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Veröffentlichen
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            Zurück
          </Button>
          <span className="text-sm text-gray-600">
            Seite {currentPage} von {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          >
            Weiter
          </Button>
        </div>
      )}

      {/* RFQ Details Dialog */}
      {selectedRFQ && (
        <Dialog open={!!selectedRFQ} onOpenChange={() => setSelectedRFQ(null)}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-600" />
                {selectedRFQ.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">RFQ Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Nummer:</span>
                      <span className="ml-2 font-medium">{selectedRFQ.rfqNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <Badge className={`ml-2 text-white ${getStatusColor(selectedRFQ.status)}`}>
                        {getStatusText(selectedRFQ.status)}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">Budget:</span>
                      <span className="ml-2 font-medium">
                        {selectedRFQ.budget ? `€${selectedRFQ.budget.toLocaleString()}` : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Deadline:</span>
                      <span className="ml-2 font-medium">
                        {new Date(selectedRFQ.deadline).toLocaleString('de-DE')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Erstellt:</span>
                      <span className="ml-2 font-medium">
                        {new Date(selectedRFQ.createdAt).toLocaleString('de-DE')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Kunde</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Unternehmen:</span>
                      <span className="ml-2 font-medium">
                        {selectedRFQ.customerRequest.customer.companyName || 
                         `${selectedRFQ.customerRequest.customer.firstName} ${selectedRFQ.customerRequest.customer.lastName}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Kundennummer:</span>
                      <span className="ml-2 font-medium">{selectedRFQ.customerRequest.customer.customerNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">E-Mail:</span>
                      <span className="ml-2 font-medium">{selectedRFQ.customerRequest.customer.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Ursprüngliche Anfrage:</span>
                      <span className="ml-2 font-medium">{selectedRFQ.customerRequest.title}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedRFQ.description && (
                <div>
                  <h4 className="font-semibold mb-3">Beschreibung</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedRFQ.description}</p>
                </div>
              )}

              {/* Quotes */}
              {selectedRFQ.quotes && selectedRFQ.quotes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Eingegangene Angebote ({selectedRFQ.quotes.length})</h4>
                  <div className="space-y-3">
                    {selectedRFQ.quotes.map((quote, index) => (
                      <div key={quote.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h5 className="font-medium">{quote.supplier.companyName}</h5>
                              <p className="text-sm text-gray-600">{quote.supplier.supplierNumber}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {quote.aiRanking && (
                              <Badge variant="secondary" className="text-xs">
                                Rang #{quote.aiRanking}
                              </Badge>
                            )}
                            <Badge className={`text-white ${getStatusColor(quote.status)}`}>
                              {quote.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Preis:</span>
                            <p className="font-medium text-lg">€{quote.totalPrice.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Lieferzeit:</span>
                            <p className="font-medium">{quote.deliveryTime} Tage</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Performance:</span>
                            <p className="font-medium">{quote.supplier.performanceScore?.toFixed(1) || 0}%</p>
                          </div>
                          <div>
                            <span className="text-gray-600">KI-Score:</span>
                            <p className="font-medium">{quote.aiScore?.toFixed(1) || 0}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comparison Analysis */}
              {selectedRFQ.comparison && (
                <div>
                  <h4 className="font-semibold mb-3">Vergleichsanalyse</h4>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <Badge className={`ml-2 text-white ${getStatusColor(selectedRFQ.comparison.status)}`}>
                          {selectedRFQ.comparison.status}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-600">Durchschnittspreis:</span>
                        <p className="font-medium">
                          {selectedRFQ.comparison.averagePrice ? 
                            `€${selectedRFQ.comparison.averagePrice.toLocaleString()}` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Beste Angebot:</span>
                        <p className="font-medium">
                          {selectedRFQ.comparison.bestQuoteId ? 'Identifiziert' : 'Noch nicht'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RFQManagementInterface;
