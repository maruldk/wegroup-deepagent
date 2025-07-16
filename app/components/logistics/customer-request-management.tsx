
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Package, 
  FileText, 
  Clock, 
  TrendingUp, 
  Search, 
  Plus,
  Eye,
  Edit,
  Send,
  MapPin,
  Calendar,
  Euro,
  Weight,
  Package2,
  Truck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomerRequest {
  id: string;
  requestNumber: string;
  requestType: string;
  title: string;
  description?: string;
  origin: any;
  destination: any;
  cargoType: string;
  cargoDetails: any;
  weight?: number;
  volume?: number;
  value?: number;
  currency: string;
  requestedPickupDate?: string;
  requestedDeliveryDate?: string;
  isUrgent: boolean;
  status: string;
  estimatedCost?: number;
  actualCost?: number;
  source: string;
  createdAt: string;
  submittedAt?: string;
  customer: {
    id: string;
    customerNumber: string;
    companyName?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
  };
  rfqs: Array<{
    id: string;
    rfqNumber: string;
    status: string;
    totalQuotes: number;
    deadline: string;
  }>;
}

interface CustomerRequestManagementProps {
  tenantId: string;
}

const CustomerRequestManagement: React.FC<CustomerRequestManagementProps> = ({ tenantId }) => {
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<CustomerRequest | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRequests();
  }, [searchTerm, statusFilter, currentPage]);

  const fetchRequests = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      });

      const response = await fetch(`/api/logistics/customer-requests?${params}`);
      const data = await response.json();
      
      setRequests(data.requests || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/logistics/customer-requests/${requestId}/submit`, {
        method: 'POST',
      });
      
      if (response.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-500';
      case 'SUBMITTED': return 'bg-blue-500';
      case 'UNDER_REVIEW': return 'bg-yellow-500';
      case 'RFQ_CREATED': return 'bg-purple-500';
      case 'QUOTED': return 'bg-green-500';
      case 'ACCEPTED': return 'bg-green-600';
      case 'REJECTED': return 'bg-red-500';
      case 'CANCELLED': return 'bg-gray-600';
      case 'COMPLETED': return 'bg-green-700';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Entwurf';
      case 'SUBMITTED': return 'Eingereicht';
      case 'UNDER_REVIEW': return 'In Bearbeitung';
      case 'RFQ_CREATED': return 'Ausschreibung erstellt';
      case 'QUOTED': return 'Angebote erhalten';
      case 'ACCEPTED': return 'Angenommen';
      case 'REJECTED': return 'Abgelehnt';
      case 'CANCELLED': return 'Storniert';
      case 'COMPLETED': return 'Abgeschlossen';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT': return <FileText className="h-4 w-4" />;
      case 'SUBMITTED': return <Send className="h-4 w-4" />;
      case 'UNDER_REVIEW': return <Clock className="h-4 w-4" />;
      case 'RFQ_CREATED': return <Package className="h-4 w-4" />;
      case 'QUOTED': return <TrendingUp className="h-4 w-4" />;
      case 'ACCEPTED': return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED': return <XCircle className="h-4 w-4" />;
      case 'CANCELLED': return <XCircle className="h-4 w-4" />;
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getRequestTypeText = (type: string) => {
    switch (type) {
      case 'FREIGHT_FORWARDING': return 'Spedition';
      case 'LOGISTICS_SERVICES': return 'Logistik';
      case 'TRANSPORT_ONLY': return 'Transport';
      case 'WAREHOUSING': return 'Lagerung';
      case 'CUSTOMS_CLEARANCE': return 'Zollabfertigung';
      case 'INSURANCE': return 'Versicherung';
      case 'PACKAGING': return 'Verpackung';
      case 'MULTIMODAL': return 'Multimodal';
      default: return type;
    }
  };

  const getCargoTypeText = (type: string) => {
    switch (type) {
      case 'GENERAL': return 'Allgemein';
      case 'HAZARDOUS': return 'Gefahrgut';
      case 'PERISHABLE': return 'Verderblich';
      case 'FRAGILE': return 'Zerbrechlich';
      case 'OVERSIZED': return 'Übergroß';
      case 'BULK': return 'Schüttgut';
      case 'LIQUID': return 'Flüssig';
      case 'REFRIGERATED': return 'Gekühlt';
      default: return type;
    }
  };

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW').length;
  const completedRequests = requests.filter(r => r.status === 'COMPLETED').length;
  const avgValue = requests.reduce((sum, r) => sum + (r.estimatedCost || 0), 0) / requests.length;

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
          <h1 className="text-3xl font-bold text-gray-900">Kundenanfragen</h1>
          <p className="text-gray-600 mt-1">Verwalten Sie alle eingehenden Kundenanfragen</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Neue Anfrage
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
                  <p className="text-sm font-medium text-gray-600">Gesamt Anfragen</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
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
          <Card className="border-l-4 border-l-yellow-600">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Bearbeitung</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingRequests}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
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
          <Card className="border-l-4 border-l-green-600">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Abgeschlossen</p>
                  <p className="text-2xl font-bold text-gray-900">{completedRequests}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
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
          <Card className="border-l-4 border-l-purple-600">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ø Wert</p>
                  <p className="text-2xl font-bold text-gray-900">€{avgValue.toFixed(0)}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Euro className="h-6 w-6 text-purple-600" />
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
                placeholder="Suche nach Anfragen..."
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
                  <SelectItem value="SUBMITTED">Eingereicht</SelectItem>
                  <SelectItem value="UNDER_REVIEW">In Bearbeitung</SelectItem>
                  <SelectItem value="RFQ_CREATED">Ausschreibung</SelectItem>
                  <SelectItem value="QUOTED">Angebote</SelectItem>
                  <SelectItem value="COMPLETED">Abgeschlossen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Anfragen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {requests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="border-l-4 border-l-blue-600 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{request.title}</h3>
                            <Badge 
                              variant="secondary" 
                              className={`text-white ${getStatusColor(request.status)}`}
                            >
                              {getStatusIcon(request.status)}
                              <span className="ml-1">{getStatusText(request.status)}</span>
                            </Badge>
                            {request.isUrgent && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Eilig
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Anfrage Nr.</p>
                              <p className="font-medium">{request.requestNumber}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Kunde</p>
                              <p className="font-medium">
                                {request.customer.companyName || 
                                 `${request.customer.firstName} ${request.customer.lastName}`}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Typ</p>
                              <p className="font-medium">{getRequestTypeText(request.requestType)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Fracht</p>
                              <p className="font-medium">{getCargoTypeText(request.cargoType)}</p>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {request.weight && (
                              <div className="flex items-center gap-1">
                                <Weight className="h-4 w-4 text-gray-500" />
                                <span>{request.weight} kg</span>
                              </div>
                            )}
                            {request.volume && (
                              <div className="flex items-center gap-1">
                                <Package2 className="h-4 w-4 text-gray-500" />
                                <span>{request.volume} m³</span>
                              </div>
                            )}
                            {request.value && (
                              <div className="flex items-center gap-1">
                                <Euro className="h-4 w-4 text-gray-500" />
                                <span>{request.value} {request.currency}</span>
                              </div>
                            )}
                            {request.requestedDeliveryDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span>
                                  {new Date(request.requestedDeliveryDate).toLocaleDateString('de-DE')}
                                </span>
                              </div>
                            )}
                          </div>

                          {request.rfqs && request.rfqs.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm text-gray-600 mb-1">Ausschreibungen:</p>
                              <div className="flex flex-wrap gap-2">
                                {request.rfqs.map((rfq) => (
                                  <Badge key={rfq.id} variant="outline" className="text-xs">
                                    {rfq.rfqNumber} ({rfq.totalQuotes} Angebote)
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                          {request.status === 'DRAFT' && (
                            <Button
                              size="sm"
                              onClick={() => handleSubmitRequest(request.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Senden
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
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

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

      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-600" />
                {selectedRequest.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Anfrage-Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Nummer:</span>
                      <span className="ml-2 font-medium">{selectedRequest.requestNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Typ:</span>
                      <span className="ml-2 font-medium">{getRequestTypeText(selectedRequest.requestType)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <Badge className={`ml-2 text-white ${getStatusColor(selectedRequest.status)}`}>
                        {getStatusText(selectedRequest.status)}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">Quelle:</span>
                      <span className="ml-2 font-medium">{selectedRequest.source}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Erstellt:</span>
                      <span className="ml-2 font-medium">
                        {new Date(selectedRequest.createdAt).toLocaleString('de-DE')}
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
                        {selectedRequest.customer.companyName || 
                         `${selectedRequest.customer.firstName} ${selectedRequest.customer.lastName}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Kundennummer:</span>
                      <span className="ml-2 font-medium">{selectedRequest.customer.customerNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">E-Mail:</span>
                      <span className="ml-2 font-medium">{selectedRequest.customer.email}</span>
                    </div>
                    {selectedRequest.customer.phone && (
                      <div>
                        <span className="text-gray-600">Telefon:</span>
                        <span className="ml-2 font-medium">{selectedRequest.customer.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cargo Details */}
              <div>
                <h4 className="font-semibold mb-3">Fracht-Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Typ:</span>
                    <p className="font-medium">{getCargoTypeText(selectedRequest.cargoType)}</p>
                  </div>
                  {selectedRequest.weight && (
                    <div>
                      <span className="text-gray-600">Gewicht:</span>
                      <p className="font-medium">{selectedRequest.weight} kg</p>
                    </div>
                  )}
                  {selectedRequest.volume && (
                    <div>
                      <span className="text-gray-600">Volumen:</span>
                      <p className="font-medium">{selectedRequest.volume} m³</p>
                    </div>
                  )}
                  {selectedRequest.value && (
                    <div>
                      <span className="text-gray-600">Wert:</span>
                      <p className="font-medium">{selectedRequest.value} {selectedRequest.currency}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {selectedRequest.description && (
                <div>
                  <h4 className="font-semibold mb-3">Beschreibung</h4>
                  <p className="text-sm text-gray-700">{selectedRequest.description}</p>
                </div>
              )}

              {/* Costs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Kosten</h4>
                  <div className="space-y-2 text-sm">
                    {selectedRequest.estimatedCost && (
                      <div>
                        <span className="text-gray-600">Geschätzte Kosten:</span>
                        <span className="ml-2 font-medium">€{selectedRequest.estimatedCost}</span>
                      </div>
                    )}
                    {selectedRequest.actualCost && (
                      <div>
                        <span className="text-gray-600">Tatsächliche Kosten:</span>
                        <span className="ml-2 font-medium">€{selectedRequest.actualCost}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Termine</h4>
                  <div className="space-y-2 text-sm">
                    {selectedRequest.requestedPickupDate && (
                      <div>
                        <span className="text-gray-600">Abholung:</span>
                        <span className="ml-2 font-medium">
                          {new Date(selectedRequest.requestedPickupDate).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                    )}
                    {selectedRequest.requestedDeliveryDate && (
                      <div>
                        <span className="text-gray-600">Lieferung:</span>
                        <span className="ml-2 font-medium">
                          {new Date(selectedRequest.requestedDeliveryDate).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CustomerRequestManagement;
