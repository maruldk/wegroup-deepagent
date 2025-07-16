
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Building2, 
  Mail, 
  Phone, 
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  Star,
  AlertTriangle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { CreateCustomerForm, CustomerType, CustomerTier, CompanySize } from '@/lib/types'

interface Customer {
  id: string
  customerNumber: string
  companyName?: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  website?: string
  industry?: string
  companySize?: string
  customerType: string
  customerTier: string
  aiLifetimeValue?: number
  aiChurnProbability?: number
  aiCrossSellScore?: number
  aiEngagementScore?: number
  aiNextBestAction?: string
  totalOrderValue?: number
  totalOrders: number
  lastContactDate?: string
  createdAt: string
}

export default function WeSellCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState<CreateCustomerForm>({
    email: '',
    customerType: CustomerType.PROSPECT,
    customerTier: CustomerTier.STANDARD,
    tags: [],
    notes: ''
  })

  useEffect(() => {
    fetchCustomers()
  }, [tierFilter, typeFilter])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const mockCustomers: Customer[] = [
        {
          id: '1',
          customerNumber: 'CUST-000001',
          companyName: 'TechCorp Solutions GmbH',
          firstName: 'Max',
          lastName: 'Mustermann',
          email: 'max.mustermann@techcorp.de',
          phone: '+49 30 12345678',
          website: 'techcorp-solutions.de',
          industry: 'Technology',
          companySize: 'MEDIUM',
          customerType: 'ACTIVE_CUSTOMER',
          customerTier: 'PREMIUM',
          aiLifetimeValue: 85000,
          aiChurnProbability: 0.15,
          aiCrossSellScore: 78,
          aiEngagementScore: 92,
          aiNextBestAction: 'Upselling-Gespräch für Enterprise-Features',
          totalOrderValue: 45000,
          totalOrders: 8,
          lastContactDate: '2024-01-12T10:30:00Z',
          createdAt: '2023-06-15T09:00:00Z'
        },
        {
          id: '2',
          customerNumber: 'CUST-000002',
          companyName: 'Marketing Plus GmbH',
          firstName: 'Anna',
          lastName: 'Schmidt',
          email: 'anna.schmidt@marketingplus.de',
          phone: '+49 40 98765432',
          website: 'marketing-plus.de',
          industry: 'Marketing',
          companySize: 'SMALL',
          customerType: 'LEAD',
          customerTier: 'STANDARD',
          aiLifetimeValue: 32000,
          aiChurnProbability: 0.25,
          aiCrossSellScore: 65,
          aiEngagementScore: 74,
          aiNextBestAction: 'Demo-Termin vereinbaren',
          totalOrderValue: 12000,
          totalOrders: 3,
          lastContactDate: '2024-01-11T14:20:00Z',
          createdAt: '2023-11-20T11:15:00Z'
        },
        {
          id: '3',
          customerNumber: 'CUST-000003',
          companyName: 'InnovateTech AG',
          firstName: 'Dr. Thomas',
          lastName: 'Weber',
          email: 'thomas.weber@innovatetech.com',
          phone: '+49 89 55443322',
          website: 'innovate-tech.com',
          industry: 'Innovation',
          companySize: 'LARGE',
          customerType: 'VIP_CUSTOMER',
          customerTier: 'VIP',
          aiLifetimeValue: 150000,
          aiChurnProbability: 0.08,
          aiCrossSellScore: 89,
          aiEngagementScore: 96,
          aiNextBestAction: 'Strategisches Partnership Meeting',
          totalOrderValue: 125000,
          totalOrders: 15,
          lastContactDate: '2024-01-10T16:45:00Z',
          createdAt: '2022-03-10T08:30:00Z'
        },
        {
          id: '4',
          customerNumber: 'CUST-000004',
          firstName: 'Sarah',
          lastName: 'Müller',
          email: 'sarah.mueller@freelance.de',
          phone: '+49 172 1234567',
          industry: 'Freelance',
          companySize: 'MICRO',
          customerType: 'PROSPECT',
          customerTier: 'STANDARD',
          aiLifetimeValue: 8500,
          aiChurnProbability: 0.45,
          aiCrossSellScore: 42,
          aiEngagementScore: 58,
          aiNextBestAction: 'Erstkontakt per E-Mail',
          totalOrderValue: 0,
          totalOrders: 0,
          lastContactDate: undefined,
          createdAt: '2024-01-08T12:00:00Z'
        }
      ]
      
      setCustomers(mockCustomers)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching customers:', error)
      setLoading(false)
    }
  }

  const handleCreateCustomer = async () => {
    try {
      // Here would be the actual API call
      console.log('Creating customer:', newCustomer)
      
      // Reset form and close dialog
      setNewCustomer({
        email: '',
        customerType: CustomerType.PROSPECT,
        customerTier: CustomerTier.STANDARD,
        tags: [],
        notes: ''
      })
      setCreateDialogOpen(false)
      
      // Refresh customers
      fetchCustomers()
    } catch (error) {
      console.error('Error creating customer:', error)
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTier = tierFilter === 'all' || customer.customerTier === tierFilter
    const matchesType = typeFilter === 'all' || customer.customerType === typeFilter
    
    return matchesSearch && matchesTier && matchesType
  })

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'STANDARD': return 'bg-gray-100 text-gray-800'
      case 'PREMIUM': return 'bg-blue-100 text-blue-800'
      case 'VIP': return 'bg-purple-100 text-purple-800'
      case 'ENTERPRISE': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PROSPECT': return 'bg-yellow-100 text-yellow-800'
      case 'LEAD': return 'bg-orange-100 text-orange-800'
      case 'ACTIVE_CUSTOMER': return 'bg-green-100 text-green-800'
      case 'VIP_CUSTOMER': return 'bg-purple-100 text-purple-800'
      case 'INACTIVE_CUSTOMER': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getChurnRiskColor = (probability: number) => {
    if (probability > 0.4) return 'text-red-600'
    if (probability > 0.2) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getCompanySizeLabel = (size: string) => {
    switch (size) {
      case 'MICRO': return '1-10'
      case 'SMALL': return '11-50'
      case 'MEDIUM': return '51-250'
      case 'LARGE': return '251-1000'
      case 'ENTERPRISE': return '1000+'
      default: return 'Unbekannt'
    }
  }

  if (loading) {
    return <CustomersSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kundenmanagement</h1>
          <p className="text-gray-600 mt-1">
            Intelligente 360-Grad-Kundensicht mit KI-gestützter Analyse und Predictive Insights
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Neuer Kunde
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Neuen Kunden hinzufügen</DialogTitle>
              <DialogDescription>
                Erfassen Sie einen neuen Kunden mit KI-gestützter Analyse und Bewertung.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Vorname</Label>
                  <Input
                    id="firstName"
                    value={newCustomer.firstName || ''}
                    onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                    placeholder="Vorname"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nachname</Label>
                  <Input
                    id="lastName"
                    value={newCustomer.lastName || ''}
                    onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                    placeholder="Nachname"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Firmenname</Label>
                <Input
                  id="companyName"
                  value={newCustomer.companyName || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, companyName: e.target.value })}
                  placeholder="Firmenname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="E-Mail-Adresse"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerType">Kundentyp</Label>
                  <Select 
                    value={newCustomer.customerType} 
                    onValueChange={(value) => setNewCustomer({ ...newCustomer, customerType: value as CustomerType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PROSPECT">Interessent</SelectItem>
                      <SelectItem value="LEAD">Lead</SelectItem>
                      <SelectItem value="ACTIVE_CUSTOMER">Aktiver Kunde</SelectItem>
                      <SelectItem value="VIP_CUSTOMER">VIP Kunde</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerTier">Kundenstufe</Label>
                  <Select 
                    value={newCustomer.customerTier} 
                    onValueChange={(value) => setNewCustomer({ ...newCustomer, customerTier: value as CustomerTier })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STANDARD">Standard</SelectItem>
                      <SelectItem value="PREMIUM">Premium</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                      <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notizen</Label>
                <Textarea
                  id="notes"
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  placeholder="Zusätzliche Informationen..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleCreateCustomer} disabled={!newCustomer.email}>
                Kunde erstellen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Kunden</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{customers.length}</div>
            <p className="text-xs text-gray-600 mt-1">+8 diesen Monat</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-teal-50 border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Aktive Kunden</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {customers.filter(c => c.customerType === 'ACTIVE_CUSTOMER').length}
            </div>
            <p className="text-xs text-gray-600 mt-1">87% Aktivität</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">VIP Kunden</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              {customers.filter(c => c.customerTier === 'VIP').length}
            </div>
            <p className="text-xs text-gray-600 mt-1">High-Value Segment</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Churn Risiko</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">
              {customers.filter(c => (c.aiChurnProbability || 0) > 0.3).length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Benötigen Aufmerksamkeit</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Kunden durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Typ filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Typen</SelectItem>
            <SelectItem value="PROSPECT">Interessenten</SelectItem>
            <SelectItem value="LEAD">Leads</SelectItem>
            <SelectItem value="ACTIVE_CUSTOMER">Aktive Kunden</SelectItem>
            <SelectItem value="VIP_CUSTOMER">VIP Kunden</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Stufe filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Stufen</SelectItem>
            <SelectItem value="STANDARD">Standard</SelectItem>
            <SelectItem value="PREMIUM">Premium</SelectItem>
            <SelectItem value="VIP">VIP</SelectItem>
            <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Customers Table */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="space-y-0">
              {filteredCustomers.map((customer, index) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.firstName} ${customer.lastName}`} />
                        <AvatarFallback>
                          {customer.firstName?.[0] || ''}{customer.lastName?.[0] || customer.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                            {customer.companyName || `${customer.firstName} ${customer.lastName}`}
                          </h3>
                          <Badge className={getTypeColor(customer.customerType)}>
                            {customer.customerType.replace('_', ' ')}
                          </Badge>
                          <Badge className={getTierColor(customer.customerTier)}>
                            {customer.customerTier}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {customer.phone}
                            </div>
                          )}
                          {customer.companySize && (
                            <div className="flex items-center">
                              <Building2 className="w-4 h-4 mr-1" />
                              {getCompanySizeLabel(customer.companySize)} Mitarbeiter
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      {/* AI Metrics */}
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Brain className="w-4 h-4 text-purple-500 mr-1" />
                          <span className="text-sm font-medium">KI-Score</span>
                        </div>
                        <div className="text-lg font-bold text-purple-600">
                          {customer.aiEngagementScore || 0}%
                        </div>
                      </div>

                      {/* Lifetime Value */}
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Target className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm font-medium">LTV</span>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          €{((customer.aiLifetimeValue || 0) / 1000).toFixed(0)}k
                        </div>
                      </div>

                      {/* Churn Risk */}
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          {(customer.aiChurnProbability || 0) > 0.3 ? (
                            <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                          ) : (
                            <Star className="w-4 h-4 text-green-500 mr-1" />
                          )}
                          <span className="text-sm font-medium">Churn</span>
                        </div>
                        <div className={`text-lg font-bold ${getChurnRiskColor(customer.aiChurnProbability || 0)}`}>
                          {((customer.aiChurnProbability || 0) * 100).toFixed(0)}%
                        </div>
                      </div>

                      {/* Orders */}
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">Bestellungen</div>
                        <div className="text-lg font-bold">
                          {customer.totalOrders}
                        </div>
                        <div className="text-xs text-gray-500">
                          €{((customer.totalOrderValue || 0) / 1000).toFixed(1)}k
                        </div>
                      </div>

                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* AI Next Best Action */}
                  {customer.aiNextBestAction && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Brain className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-800">KI-Empfehlung:</span>
                        <span className="text-sm text-blue-700 ml-2">{customer.aiNextBestAction}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Keine Kunden gefunden
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || tierFilter !== 'all' || typeFilter !== 'all' 
              ? 'Versuchen Sie andere Filter oder fügen Sie einen neuen Kunden hinzu.'
              : 'Fügen Sie Ihren ersten Kunden hinzu, um mit dem KI-gestützten CRM zu beginnen.'
            }
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ersten Kunden hinzufügen
          </Button>
        </div>
      )}
    </div>
  )
}

function CustomersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      <div className="grid md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex gap-4">
        <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>
      <Card>
        <CardContent className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="flex space-x-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="w-16 h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
