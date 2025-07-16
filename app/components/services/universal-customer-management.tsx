
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Building, 
  Mail, 
  Phone,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Star,
  Euro,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Customer {
  id: string;
  customerNumber: string;
  companyName: string;
  industry?: string;
  companySize?: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  satisfactionScore?: number;
  lastActivityAt?: string;
}

export function UniversalCustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call with demo data
    setTimeout(() => {
      setCustomers([
        {
          id: '1',
          customerNumber: 'CUS-001',
          companyName: 'TechStart GmbH',
          industry: 'Technology',
          companySize: 'STARTUP',
          contactPerson: 'Sarah Mueller',
          email: 'sarah.mueller@techstart.de',
          phone: '+49 30 12345001',
          totalOrders: 5,
          totalSpent: 125000,
          satisfactionScore: 4.8,
          lastActivityAt: '2024-01-15'
        },
        {
          id: '2',
          customerNumber: 'CUS-002',
          companyName: 'Marketing Pro AG',
          industry: 'Marketing',
          companySize: 'SME',
          contactPerson: 'Thomas Weber',
          email: 'thomas.weber@marketingpro.de',
          phone: '+49 89 23456002',
          totalOrders: 8,
          totalSpent: 98000,
          satisfactionScore: 4.5,
          lastActivityAt: '2024-01-12'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Verwalten Sie alle Service-Kunden und deren Anforderungen</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Neuer Kunde
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Gesamt Kunden', value: customers.length, icon: Users, color: 'blue' },
          { title: 'Aktive Kunden', value: customers.filter(c => c.lastActivityAt).length, icon: Building, color: 'green' },
          { title: 'Durchschn. Bestellwert', value: `€${Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toLocaleString()}`, icon: Euro, color: 'purple' },
          { title: 'Kundenzufriedenheit', value: `${(customers.reduce((sum, c) => sum + (c.satisfactionScore || 0), 0) / customers.length).toFixed(1)}/5`, icon: Star, color: 'yellow' },
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

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Kunden durchsuchen..."
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

      {/* Customers list */}
      <div className="space-y-4">
        {filteredCustomers.map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{customer.companyName}</h3>
                      <Badge variant="outline">{customer.customerNumber}</Badge>
                      {customer.companySize && (
                        <Badge variant="secondary">{customer.companySize}</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Kontakt</p>
                        <p className="font-medium">{customer.contactPerson}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                          <Mail className="h-3 w-3" />
                          <span>{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Geschäftsdaten</p>
                        <p className="font-medium">Bestellungen: {customer.totalOrders}</p>
                        <p className="font-medium text-green-600">Umsatz: €{customer.totalSpent.toLocaleString()}</p>
                        {customer.industry && (
                          <p className="text-sm text-gray-600">Branche: {customer.industry}</p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Performance</p>
                        {customer.satisfactionScore && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-medium">{customer.satisfactionScore}/5.0</span>
                          </div>
                        )}
                        {customer.lastActivityAt && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Letzte Aktivität: {customer.lastActivityAt}</span>
                          </div>
                        )}
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
