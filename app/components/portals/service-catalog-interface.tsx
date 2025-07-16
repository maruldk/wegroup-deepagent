
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Code, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Euro, 
  Scale, 
  Shield,
  Search,
  Filter,
  Star,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const SERVICE_CATEGORIES = [
  {
    id: 'IT_SERVICES',
    name: 'IT Services',
    icon: Code,
    color: 'blue',
    description: 'Software-Entwicklung, System-Integration, IT-Support',
    serviceCount: 45,
    avgPrice: '€15,000',
    topRated: true
  },
  {
    id: 'MARKETING_SERVICES', 
    name: 'Marketing Services',
    icon: TrendingUp,
    color: 'green',
    description: 'Digital Marketing, Content-Erstellung, SEO/SEM',
    serviceCount: 32,
    avgPrice: '€8,500',
    topRated: false
  },
  {
    id: 'HR_SERVICES',
    name: 'HR Services',
    icon: Users,
    color: 'purple',
    description: 'Recruiting, Training, HR-Beratung',
    serviceCount: 28,
    avgPrice: '€12,000',
    topRated: true
  },
  {
    id: 'LEGAL_SERVICES',
    name: 'Legal Services',
    icon: Scale,
    color: 'red',
    description: 'Vertragsrecht, Compliance, Rechtsberatung',
    serviceCount: 15,
    avgPrice: '€18,000',
    topRated: false
  },
  {
    id: 'FINANCIAL_SERVICES',
    name: 'Finance Services',
    icon: Euro,
    color: 'indigo',
    description: 'Buchhaltung, Steuerberatung, Finanzplanung',
    serviceCount: 22,
    avgPrice: '€9,500',
    topRated: true
  },
  {
    id: 'CONSULTING_BERATUNG',
    name: 'Consulting Services',
    icon: Briefcase,
    color: 'orange',
    description: 'Strategieberatung, Prozessoptimierung',
    serviceCount: 19,
    avgPrice: '€25,000',
    topRated: false
  }
];

export function ServiceCatalogInterface() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = SERVICE_CATEGORIES.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Service-Katalog</h1>
        <p className="text-blue-100">
          Entdecken Sie unser umfassendes Angebot an professionellen Services
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Services durchsuchen..."
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

      {/* Service categories grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-blue-500 hover:border-l-blue-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg bg-${category.color}-100`}>
                    <category.icon className={`h-6 w-6 text-${category.color}-600`} />
                  </div>
                  <div className="flex items-center space-x-2">
                    {category.topRated && (
                      <Badge className="bg-yellow-100 text-yellow-700" variant="secondary">
                        <Star className="h-3 w-3 mr-1" />
                        Top Rated
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Verfügbare Services:</span>
                    <span className="font-semibold">{category.serviceCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Durchschnittspreis:</span>
                    <span className="font-semibold text-green-600">{category.avgPrice}</span>
                  </div>
                  <div className="pt-3">
                    <Link href={`/customer-portal/requests/new?category=${category.id}`}>
                      <Button className="w-full group-hover:bg-blue-600">
                        Service anfragen
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Popular services section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">Beliebte Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Website-Entwicklung', category: 'IT Services', price: '€12,000 - €25,000' },
            { name: 'SEO Optimization', category: 'Marketing', price: '€3,000 - €8,000' },
            { name: 'Executive Search', category: 'HR Services', price: '€8,000 - €15,000' },
            { name: 'Vertragsberatung', category: 'Legal Services', price: '€5,000 - €12,000' },
          ].map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{service.category}</p>
                  <p className="text-sm font-medium text-green-600">{service.price}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
