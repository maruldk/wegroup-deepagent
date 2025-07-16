
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Building2, 
  FileText, 
  Package, 
  TrendingUp, 
  Calendar, 
  Clock,
  Euro,
  Send,
  Eye,
  Edit,
  Award,
  Target,
  BarChart3,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Shield,
  Star,
  Download,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SupplierPortalData {
  supplier: {
    id: string;
    supplierNumber: string;
    companyName: string;
    contactPerson?: string;
    email: string;
    phone?: string;
    website?: string;
    performanceScore?: number;
    qualityScore?: number;
    reliabilityScore?: number;
    totalOrders: number;
    totalRevenue: number;
    winRate?: number;
    servicesOffered: string[];
    certifications: string[];
    isVerified: boolean;
    status: string;
  };
  availableRFQs: RFQ[];
  myQuotes: Quote[];
  recentOrders: Order[];
  performance: {
    thisMonth: {
      quotesSubmitted: number;
      quotesAccepted: number;
      revenue: number;
    };
    lastMonth: {
      quotesSubmitted: number;
      quotesAccepted: number;
      revenue: number;
    };
  };
}

interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  description?: string;
  deadline: string;
  budget?: number;
  currency: string;
  status: string;
  publishedAt: string;
  customerRequest: {
    id: string;
    title: string;
    cargoType: string;
    weight?: number;
    volume?: number;
    origin: any;
    destination: any;
    customer: {
      companyName?: string;
      firstName?: string;
      lastName?: string;
    };
  };
  totalQuotes: number;
  hasSubmittedQuote: boolean;
}

interface Quote {
  id: string;
  quoteNumber: string;
  rfq: {
    id: string;
    rfqNumber: string;
    title: string;
    deadline: string;
  };
  totalPrice: number;
  currency: string;
  deliveryTime: number;
  status: string;
  aiScore?: number;
  aiRanking?: number;
  isWinning: boolean;
  submittedAt: string;
  validUntil: string;
}

interface Order {
  id: string;
  orderNumber: string;
  title: string;
  orderValue: number;
  currency: string;
  status: string;
  createdAt: string;
  requestedDeliveryDate?: string;
  customer: {
    companyName?: string;
    firstName?: string;
    lastName?: string;
  };
}

interface SupplierPortalProps {
  supplierId: string;
}

const SupplierPortalInterface: React.FC<SupplierPortalProps> = ({ supplierId }) => {
  const [portalData, setPortalData] = useState<SupplierPortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    basePrice: '',
    deliveryTime: '',
    terms: '',
    description: '',
  });

  useEffect(() => {
    fetchPortalData();
  }, [supplierId]);

  const fetchPortalData = async () => {
    try {
      // This would be a single endpoint that returns all supplier portal data
      const [supplierRes, rfqsRes, quotesRes, ordersRes] = await Promise.all([
        fetch(`/api/logistics/suppliers/${supplierId}`),
        fetch(`/api/logistics/rfqs?status=ACTIVE&limit=10`),
        fetch(`/api/logistics/quotes?supplierId=${supplierId}&limit=10`),
        fetch(`/api/logistics/orders?supplierId=${supplierId}&limit=10`),
      ]);

      const [supplier, rfqs, quotes, orders] = await Promise.all([
        supplierRes.json(),
        rfqsRes.json(),
        quotesRes.json(),
        ordersRes.json(),
      ]);

      setPortalData({
        supplier,
        availableRFQs: rfqs.rfqs || [],
        myQuotes: quotes.quotes || [],
        recentOrders: orders.orders || [],
        performance: {
          thisMonth: {
            quotesSubmitted: quotes.quotes?.filter((q: Quote) => 
              new Date(q.submittedAt).getMonth() === new Date().getMonth()
            ).length || 0,
            quotesAccepted: quotes.quotes?.filter((q: Quote) => 
              q.status === 'ACCEPTED' && new Date(q.submittedAt).getMonth() === new Date().getMonth()
            ).length || 0,
            revenue: orders.orders?.filter((o: Order) => 
              o.status === 'COMPLETED' && new Date(o.createdAt).getMonth() === new Date().getMonth()
            ).reduce((sum: number, o: Order) => sum + o.orderValue, 0) || 0,
          },
          lastMonth: {
            quotesSubmitted: quotes.quotes?.filter((q: Quote) => 
              new Date(q.submittedAt).getMonth() === new Date().getMonth() - 1
            ).length || 0,
            quotesAccepted: quotes.quotes?.filter((q: Quote) => 
              q.status === 'ACCEPTED' && new Date(q.submittedAt).getMonth() === new Date().getMonth() - 1
            ).length || 0,
            revenue: orders.orders?.filter((o: Order) => 
              o.status === 'COMPLETED' && new Date(o.createdAt).getMonth() === new Date().getMonth() - 1
            ).reduce((sum: number, o: Order) => sum + o.orderValue, 0) || 0,
          },
        },
      });
    } catch (error) {
      console.error('Error fetching portal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuote = async (rfqId: string) => {
    try {
      const response = await fetch('/api/logistics/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rfqId,
          supplierId,
          basePrice: parseFloat(quoteForm.basePrice),
          totalPrice: parseFloat(quoteForm.basePrice), // Simplified for demo
          deliveryTime: parseInt(quoteForm.deliveryTime),
          terms: quoteForm.terms,
          description: quoteForm.description,
          currency: 'EUR',
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        }),
      });

      if (response.ok) {
        setShowQuoteDialog(false);
        setQuoteForm({ basePrice: '', deliveryTime: '', terms: '', description: '' });
        fetchPortalData(); // Refresh data
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'SUBMITTED': return 'bg-blue-500';
      case 'ACCEPTED': return 'bg-green-600';
      case 'REJECTED': return 'bg-red-500';
      case 'COMPLETED': return 'bg-green-700';
      case 'WINNING': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Aktiv';
      case 'SUBMITTED': return 'Eingereicht';
      case 'ACCEPTED': return 'Angenommen';
      case 'REJECTED': return 'Abgelehnt';
      case 'COMPLETED': return 'Abgeschlossen';
      case 'WINNING': return 'Gewonnen';
      case 'DRAFT': return 'Entwurf';
      default: return status;
    }
  };

  const getDeadlineStatus = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const hoursLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (hoursLeft < 0) return { status: 'expired', text: 'Abgelaufen', color: 'text-red-600' };
    if (hoursLeft < 24) return { status: 'urgent', text: `${hoursLeft}h`, color: 'text-red-600' };
    if (hoursLeft < 48) return { status: 'soon', text: `${Math.ceil(hoursLeft/24)}d`, color: 'text-yellow-600' };
    return { status: 'normal', text: `${Math.ceil(hoursLeft/24)}d`, color: 'text-green-600' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!portalData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Zugriff verweigert</h2>
          <p className="text-gray-600">Sie haben keinen Zugriff auf dieses Portal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Willkommen, {portalData.supplier.companyName}
                </h1>
                <p className="text-sm text-gray-600">
                  {portalData.supplier.supplierNumber} • {portalData.supplier.isVerified ? 'Verifiziert' : 'Nicht verifiziert'}
                  {portalData.supplier.isVerified && <Shield className="inline h-4 w-4 ml-1 text-green-600" />}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className={`text-white ${getStatusColor(portalData.supplier.status)}`}>
                {getStatusText(portalData.supplier.status)}
              </Badge>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profil
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('rfqs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rfqs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Verfügbare RFQs ({portalData.availableRFQs.length})
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'quotes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Meine Angebote ({portalData.myQuotes.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bestellungen ({portalData.recentOrders.length})
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
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
                        <p className="text-sm font-medium text-gray-600">Performance Score</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {portalData.supplier.performanceScore?.toFixed(1) || 0}%
                        </p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
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
                        <p className="text-sm font-medium text-gray-600">Erfolgsquote</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {portalData.supplier.winRate?.toFixed(1) || 0}%
                        </p>
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
                        <p className="text-sm font-medium text-gray-600">Gesamtumsatz</p>
                        <p className="text-2xl font-bold text-gray-900">
                          €{(portalData.supplier.totalRevenue / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Euro className="h-6 w-6 text-purple-600" />
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
                        <p className="text-sm font-medium text-gray-600">Bestellungen</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {portalData.supplier.totalOrders}
                        </p>
                      </div>
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Package className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            </div>

            {/* Performance Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Performance Übersicht
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Performance Score</span>
                      <span>{portalData.supplier.performanceScore?.toFixed(1) || 0}%</span>
                    </div>
                    <Progress value={portalData.supplier.performanceScore || 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Qualität</span>
                      <span>{portalData.supplier.qualityScore?.toFixed(1) || 0}%</span>
                    </div>
                    <Progress value={portalData.supplier.qualityScore || 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Zuverlässigkeit</span>
                      <span>{portalData.supplier.reliabilityScore?.toFixed(1) || 0}%</span>
                    </div>
                    <Progress value={portalData.supplier.reliabilityScore || 0} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Monatliche Entwicklung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Angebote eingereicht</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{portalData.performance.thisMonth.quotesSubmitted}</span>
                        <span className="text-xs text-gray-500">
                          ({portalData.performance.thisMonth.quotesSubmitted > portalData.performance.lastMonth.quotesSubmitted ? '+' : ''}
                          {portalData.performance.thisMonth.quotesSubmitted - portalData.performance.lastMonth.quotesSubmitted})
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Angebote angenommen</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{portalData.performance.thisMonth.quotesAccepted}</span>
                        <span className="text-xs text-gray-500">
                          ({portalData.performance.thisMonth.quotesAccepted > portalData.performance.lastMonth.quotesAccepted ? '+' : ''}
                          {portalData.performance.thisMonth.quotesAccepted - portalData.performance.lastMonth.quotesAccepted})
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Umsatz</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">€{(portalData.performance.thisMonth.revenue / 1000).toFixed(0)}K</span>
                        <span className="text-xs text-gray-500">
                          ({portalData.performance.thisMonth.revenue > portalData.performance.lastMonth.revenue ? '+' : ''}
                          €{((portalData.performance.thisMonth.revenue - portalData.performance.lastMonth.revenue) / 1000).toFixed(0)}K)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Aktuelle Aktivitäten
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {portalData.availableRFQs.slice(0, 3).map((rfq) => (
                    <div key={rfq.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{rfq.title}</p>
                          <p className="text-xs text-gray-600">
                            Deadline: {new Date(rfq.deadline).toLocaleDateString('de-DE')}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Ansehen
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Available RFQs Tab */}
        {activeTab === 'rfqs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Verfügbare Ausschreibungen</h2>
                <p className="text-gray-600">Entdecken Sie neue Geschäftsmöglichkeiten</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {portalData.availableRFQs.map((rfq, index) => {
                  const deadlineStatus = getDeadlineStatus(rfq.deadline);
                  return (
                    <motion.div
                      key={rfq.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{rfq.title}</h3>
                              <p className="text-sm text-gray-600">{rfq.rfqNumber}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className={`text-white ${getStatusColor(rfq.status)}`}>
                                {getStatusText(rfq.status)}
                              </Badge>
                              {rfq.hasSubmittedQuote && (
                                <Badge variant="outline" className="text-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Eingereicht
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Kunde:</span>
                              <p className="font-medium">
                                {rfq.customerRequest.customer.companyName || 
                                 `${rfq.customerRequest.customer.firstName} ${rfq.customerRequest.customer.lastName}`}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Fracht:</span>
                              <p className="font-medium">{rfq.customerRequest.cargoType}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Budget:</span>
                              <p className="font-medium">
                                {rfq.budget ? `€${rfq.budget.toLocaleString()}` : 'Offen'}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Angebote:</span>
                              <p className="font-medium">{rfq.totalQuotes}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600">Deadline:</span>
                              <span className={`font-medium ${deadlineStatus.color}`}>
                                {new Date(rfq.deadline).toLocaleDateString('de-DE')} ({deadlineStatus.text})
                              </span>
                            </div>
                          </div>

                          {rfq.description && (
                            <p className="text-sm text-gray-700 line-clamp-2">{rfq.description}</p>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => setSelectedRFQ(rfq)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                            {!rfq.hasSubmittedQuote && deadlineStatus.status !== 'expired' && (
                              <Button
                                size="sm"
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  setSelectedRFQ(rfq);
                                  setShowQuoteDialog(true);
                                }}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Angebot abgeben
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* My Quotes Tab */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Meine Angebote</h2>
                <p className="text-gray-600">Übersicht aller eingereichten Angebote</p>
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {portalData.myQuotes.map((quote, index) => (
                  <motion.div
                    key={quote.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className={`border-l-4 ${quote.isWinning ? 'border-l-green-500' : 'border-l-blue-600'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{quote.rfq.title}</h3>
                              <Badge variant="secondary" className={`text-white ${getStatusColor(quote.status)}`}>
                                {getStatusText(quote.status)}
                              </Badge>
                              {quote.isWinning && (
                                <Badge variant="secondary" className="text-white bg-green-600">
                                  <Award className="h-3 w-3 mr-1" />
                                  Gewonnen
                                </Badge>
                              )}
                              {quote.aiRanking && (
                                <Badge variant="outline" className="text-blue-600">
                                  Rang #{quote.aiRanking}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Angebot Nr.:</span>
                                <p className="font-medium">{quote.quoteNumber}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Preis:</span>
                                <p className="font-medium text-lg">€{quote.totalPrice.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Lieferzeit:</span>
                                <p className="font-medium">{quote.deliveryTime} Tage</p>
                              </div>
                              <div>
                                <span className="text-gray-600">KI-Score:</span>
                                <p className="font-medium">{quote.aiScore?.toFixed(1) || 0}%</p>
                              </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Eingereicht:</span>
                                <p className="font-medium">{new Date(quote.submittedAt).toLocaleDateString('de-DE')}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Gültig bis:</span>
                                <p className="font-medium">{new Date(quote.validUntil).toLocaleDateString('de-DE')}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">RFQ Deadline:</span>
                                <p className="font-medium">{new Date(quote.rfq.deadline).toLocaleDateString('de-DE')}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                            {quote.status === 'DRAFT' && (
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Bestellungen</h2>
                <p className="text-gray-600">Alle Ihre Bestellungen im Überblick</p>
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {portalData.recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="border-l-4 border-l-green-600">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{order.title}</h3>
                              <Badge variant="secondary" className={`text-white ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Bestellung Nr.:</span>
                                <p className="font-medium">{order.orderNumber}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Kunde:</span>
                                <p className="font-medium">
                                  {order.customer.companyName || 
                                   `${order.customer.firstName} ${order.customer.lastName}`}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-600">Wert:</span>
                                <p className="font-medium text-lg">€{order.orderValue.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Status:</span>
                                <p className="font-medium">{getStatusText(order.status)}</p>
                              </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Erstellt:</span>
                                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('de-DE')}</p>
                              </div>
                              {order.requestedDeliveryDate && (
                                <div>
                                  <span className="text-gray-600">Liefertermin:</span>
                                  <p className="font-medium">{new Date(order.requestedDeliveryDate).toLocaleDateString('de-DE')}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Quote Submission Dialog */}
      {showQuoteDialog && selectedRFQ && (
        <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Angebot abgeben für: {selectedRFQ.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="basePrice">Grundpreis (€)</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    value={quoteForm.basePrice}
                    onChange={(e) => setQuoteForm({...quoteForm, basePrice: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryTime">Lieferzeit (Tage)</Label>
                  <Input
                    id="deliveryTime"
                    type="number"
                    value={quoteForm.deliveryTime}
                    onChange={(e) => setQuoteForm({...quoteForm, deliveryTime: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={quoteForm.description}
                  onChange={(e) => setQuoteForm({...quoteForm, description: e.target.value})}
                  placeholder="Beschreiben Sie Ihr Angebot..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="terms">Bedingungen</Label>
                <Textarea
                  id="terms"
                  value={quoteForm.terms}
                  onChange={(e) => setQuoteForm({...quoteForm, terms: e.target.value})}
                  placeholder="Geschäftsbedingungen..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowQuoteDialog(false)}
                  className="flex-1"
                >
                  Abbrechen
                </Button>
                <Button 
                  onClick={() => handleSubmitQuote(selectedRFQ.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!quoteForm.basePrice || !quoteForm.deliveryTime}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Angebot abgeben
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SupplierPortalInterface;
