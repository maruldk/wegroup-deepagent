
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Search, 
  Filter, 
  Download,
  Star,
  Mail,
  Phone,
  Globe,
  MapPin,
  Package,
  Truck,
  Clock,
  Award,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Plus,
  FileText,
  Shield,
  Calendar
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

interface Supplier {
  id: string;
  supplierNumber: string;
  supplierType: string;
  companyName: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  website?: string;
  address: any;
  status: string;
  isVerified: boolean;
  totalOrders: number;
  totalRevenue: number;
  performanceScore?: number;
  qualityScore?: number;
  reliabilityScore?: number;
  onTimeDeliveryRate?: number;
  winRate?: number;
  servicesOffered: string[];
  geographicalCoverage: string[];
  certifications: string[];
  createdAt: string;
  lastActivityAt?: string;
  _count: {
    quotes: number;
    orders: number;
  };
}

interface SupplierDirectoryProps {
  tenantId: string;
}

const SupplierDirectoryInterface: React.FC<SupplierDirectoryProps> = ({ tenantId }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSuppliers();
  }, [searchTerm, statusFilter, typeFilter, currentPage]);

  const fetchSuppliers = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(typeFilter !== 'all' && { supplierType: typeFilter }),
      });

      const response = await fetch(`/api/logistics/suppliers?${params}`);
      const data = await response.json();
      
      setSuppliers(data.suppliers || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'INACTIVE': return 'bg-gray-500';
      case 'SUSPENDED': return 'bg-red-500';
      case 'PENDING_VERIFICATION': return 'bg-yellow-500';
      case 'UNDER_REVIEW': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Aktiv';
      case 'INACTIVE': return 'Inaktiv';
      case 'SUSPENDED': return 'Gesperrt';
      case 'PENDING_VERIFICATION': return 'Prüfung';
      case 'UNDER_REVIEW': return 'Bewertung';
      default: return status;
    }
  };

  const getSupplierTypeText = (type: string) => {
    switch (type) {
      case 'FREIGHT_FORWARDER': return 'Spedition';
      case 'CARRIER': return 'Frachtführer';
      case 'LOGISTICS_PROVIDER': return 'Logistikdienstleister';
      case 'WAREHOUSING': return 'Lagerung';
      case 'CUSTOMS_BROKER': return 'Zollagent';
      case 'INSURANCE_PROVIDER': return 'Versicherung';
      default: return type;
    }
  };

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'ACTIVE').length;
  const totalRevenue = suppliers.reduce((sum, s) => sum + (s.totalRevenue || 0), 0);
  const avgPerformance = suppliers.reduce((sum, s) => sum + (s.performanceScore || 0), 0) / suppliers.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with KPIs */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lieferantenverzeichnis</h1>
          <p className="text-gray-600 mt-1">Verwalten Sie alle Ihre Logistikpartner</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Lieferant hinzufügen
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
                  <p className="text-sm font-medium text-gray-600">Gesamt Lieferanten</p>
                  <p className="text-2xl font-bold text-gray-900">{totalSuppliers}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
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
                  <p className="text-sm font-medium text-gray-600">Aktive Lieferanten</p>
                  <p className="text-2xl font-bold text-gray-900">{activeSuppliers}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
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
                  <p className="text-2xl font-bold text-gray-900">€{(totalRevenue / 1000000).toFixed(1)}M</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
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
                  <p className="text-sm font-medium text-gray-600">Ø Performance</p>
                  <p className="text-2xl font-bold text-gray-900">{avgPerformance.toFixed(1)}%</p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
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
                placeholder="Suche nach Lieferanten..."
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
                  <SelectItem value="ACTIVE">Aktiv</SelectItem>
                  <SelectItem value="INACTIVE">Inaktiv</SelectItem>
                  <SelectItem value="SUSPENDED">Gesperrt</SelectItem>
                  <SelectItem value="PENDING_VERIFICATION">Prüfung</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Typen</SelectItem>
                  <SelectItem value="FREIGHT_FORWARDER">Spedition</SelectItem>
                  <SelectItem value="CARRIER">Frachtführer</SelectItem>
                  <SelectItem value="LOGISTICS_PROVIDER">Logistik</SelectItem>
                  <SelectItem value="WAREHOUSING">Lagerung</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {suppliers.map((supplier, index) => (
            <motion.div
              key={supplier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-600">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarContent>
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </AvatarContent>
                        <AvatarFallback>
                          {supplier.companyName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {supplier.companyName}
                        </h3>
                        <p className="text-sm text-gray-500">{supplier.supplierNumber}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {getSupplierTypeText(supplier.supplierType)}
                          </Badge>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs text-white ${getStatusColor(supplier.status)}`}
                          >
                            {getStatusText(supplier.status)}
                          </Badge>
                          {supplier.isVerified && (
                            <Shield className="h-3 w-3 text-green-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    {supplier.contactPerson && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        {supplier.contactPerson}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {supplier.email}
                    </div>
                    {supplier.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {supplier.phone}
                      </div>
                    )}
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Performance Score</span>
                      <span className="font-medium">{supplier.performanceScore?.toFixed(1) || 0}%</span>
                    </div>
                    <Progress value={supplier.performanceScore || 0} className="h-2" />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Bestellungen</span>
                        <p className="font-medium">{supplier.totalOrders}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Umsatz</span>
                        <p className="font-medium">€{(supplier.totalRevenue / 1000).toFixed(0)}K</p>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Services</p>
                    <div className="flex flex-wrap gap-1">
                      {supplier.servicesOffered?.slice(0, 3).map((service, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {supplier.servicesOffered?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{supplier.servicesOffered.length - 3} mehr
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedSupplier(supplier)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
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

      {/* Supplier Details Dialog */}
      {selectedSupplier && (
        <Dialog open={!!selectedSupplier} onOpenChange={() => setSelectedSupplier(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-blue-600" />
                {selectedSupplier.companyName}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Contact & Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Kontaktinformationen</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{selectedSupplier.contactPerson || 'Nicht angegeben'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{selectedSupplier.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{selectedSupplier.phone || 'Nicht angegeben'}</span>
                    </div>
                    {selectedSupplier.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span>{selectedSupplier.website}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Performance</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Performance Score</span>
                        <span>{selectedSupplier.performanceScore?.toFixed(1) || 0}%</span>
                      </div>
                      <Progress value={selectedSupplier.performanceScore || 0} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Qualität</span>
                        <span>{selectedSupplier.qualityScore?.toFixed(1) || 0}%</span>
                      </div>
                      <Progress value={selectedSupplier.qualityScore || 0} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Zuverlässigkeit</span>
                        <span>{selectedSupplier.reliabilityScore?.toFixed(1) || 0}%</span>
                      </div>
                      <Progress value={selectedSupplier.reliabilityScore || 0} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Services & Coverage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Angebotene Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSupplier.servicesOffered?.map((service, idx) => (
                      <Badge key={idx} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Geografische Abdeckung</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSupplier.geographicalCoverage?.map((area, idx) => (
                      <Badge key={idx} variant="outline">
                        <MapPin className="h-3 w-3 mr-1" />
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h4 className="font-semibold mb-3">Zertifizierungen</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSupplier.certifications?.map((cert, idx) => (
                    <Badge key={idx} variant="secondary">
                      <Award className="h-3 w-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{selectedSupplier._count.quotes}</p>
                  <p className="text-sm text-gray-600">Angebote</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Truck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{selectedSupplier._count.orders}</p>
                  <p className="text-sm text-gray-600">Bestellungen</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">€{(selectedSupplier.totalRevenue / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-gray-600">Umsatz</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Star className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">{selectedSupplier.winRate?.toFixed(1) || 0}%</p>
                  <p className="text-sm text-gray-600">Erfolgsquote</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SupplierDirectoryInterface;
