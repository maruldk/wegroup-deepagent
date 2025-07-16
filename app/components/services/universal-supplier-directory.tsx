
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Building, 
  Star, 
  Award,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Mail,
  Phone,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Supplier {
  id: string;
  supplierNumber: string;
  companyName: string;
  businessType: string;
  categories: string[];
  serviceTypes: string[];
  email: string;
  phone?: string;
  website?: string;
  status: string;
  performanceScore?: number;
  qualityScore?: number;
  totalOrders: number;
  experience: number;
  certifications: string[];
}

export function UniversalSupplierDirectory() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call with demo data
    setTimeout(() => {
      setSuppliers([
        {
          id: '1',
          supplierNumber: 'SUP-001',
          companyName: 'DevExperts Ltd',
          businessType: 'CORPORATION',
          categories: ['IT_SERVICES'],
          serviceTypes: ['SOFTWARE_DEVELOPMENT'],
          email: 'alex.johnson@devexperts.com',
          phone: '+49 30 98765001',
          website: 'https://devexperts.com',
          status: 'VERIFIED',
          performanceScore: 4.8,
          qualityScore: 4.7,
          totalOrders: 25,
          experience: 8,
          certifications: ['ISO 27001', 'AWS Certified']
        },
        {
          id: '2',
          supplierNumber: 'SUP-002',
          companyName: 'Creative Design Studio',
          businessType: 'AGENCY',
          categories: ['MARKETING_SERVICES'],
          serviceTypes: ['DIGITAL_MARKETING'],
          email: 'maria@creativedesign.de',
          phone: '+49 89 87654002',
          website: 'https://creativedesign.de',
          status: 'VERIFIED',
          performanceScore: 4.5,
          qualityScore: 4.6,
          totalOrders: 18,
          experience: 6,
          certifications: ['Google Ads Certified']
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-700';
      case 'PENDING_VERIFICATION':
        return 'bg-yellow-100 text-yellow-700';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supplier Directory</h1>
          <p className="text-gray-600">Umfassendes Verzeichnis aller Service-Lieferanten und -Partner</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Neuer Lieferant
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Lieferanten durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Gesamt Lieferanten', value: suppliers.length, icon: Building, color: 'blue' },
          { title: 'Verifiziert', value: suppliers.filter(s => s.status === 'VERIFIED').length, icon: Award, color: 'green' },
          { title: 'Durchschn. Performance', value: `${(suppliers.reduce((sum, s) => sum + (s.performanceScore || 0), 0) / suppliers.length).toFixed(1)}/5`, icon: Star, color: 'yellow' },
          { title: 'Gesamt Aufträge', value: suppliers.reduce((sum, s) => sum + s.totalOrders, 0), icon: Users, color: 'purple' },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Suppliers list */}
      <div className="space-y-4">
        {filteredSuppliers.map((supplier, index) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Building className="h-5 w-5 text-gray-400" />
                      <h3 className="font-semibold text-gray-900">{supplier.companyName}</h3>
                      <Badge className={getStatusColor(supplier.status)} variant="secondary">
                        {supplier.status}
                      </Badge>
                      <Badge variant="outline">{supplier.businessType}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Kontakt</p>
                        <div className="flex items-center space-x-2 text-sm mt-1">
                          <Mail className="h-3 w-3" />
                          <span>{supplier.email}</span>
                        </div>
                        {supplier.phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{supplier.phone}</span>
                          </div>
                        )}
                        {supplier.website && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Globe className="h-3 w-3" />
                            <span>Website</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Performance</p>
                        {supplier.performanceScore && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-medium">{supplier.performanceScore}/5.0</span>
                          </div>
                        )}
                        <p className="text-sm text-gray-600">Aufträge: {supplier.totalOrders}</p>
                        <p className="text-sm text-gray-600">Erfahrung: {supplier.experience} Jahre</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Services</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {supplier.categories.map((category, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {category.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {supplier.certifications.slice(0, 2).map((cert, i) => (
                            <span key={i} className="inline-block px-2 py-1 bg-blue-100 text-xs text-blue-700 rounded">
                              <Award className="h-3 w-3 inline mr-1" />
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-6">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Bearbeiten
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
