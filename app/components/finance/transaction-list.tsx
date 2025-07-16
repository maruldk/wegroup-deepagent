
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, 
  Search, 
  Plus, 
  Euro,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain
} from 'lucide-react'

interface Transaction {
  id: string
  amount: number
  currency: string
  type: string
  status: string
  description?: string
  reference?: string
  glAccount?: string
  aiCategorization?: string
  confidenceScore?: number
  fraudRiskScore?: number
  invoiceId?: string
  createdAt: string
}

const typeLabels: { [key: string]: string } = {
  'INCOME': 'Einnahme',
  'EXPENSE': 'Ausgabe',
  'TRANSFER': 'Überweisung',
  'INVOICE': 'Rechnung',
  'PAYMENT': 'Zahlung',
  'REFUND': 'Erstattung',
  'ADJUSTMENT': 'Korrektur'
}

const statusLabels: { [key: string]: string } = {
  'PENDING': 'Ausstehend',
  'COMPLETED': 'Abgeschlossen',
  'CANCELLED': 'Storniert',
  'FAILED': 'Fehlgeschlagen',
  'RECONCILED': 'Ausgeglichen'
}

const typeColors: { [key: string]: string } = {
  'INCOME': 'bg-green-100 text-green-800',
  'EXPENSE': 'bg-red-100 text-red-800',
  'TRANSFER': 'bg-blue-100 text-blue-800',
  'INVOICE': 'bg-purple-100 text-purple-800',
  'PAYMENT': 'bg-orange-100 text-orange-800',
  'REFUND': 'bg-yellow-100 text-yellow-800',
  'ADJUSTMENT': 'bg-gray-100 text-gray-800'
}

const statusColors: { [key: string]: string } = {
  'PENDING': 'bg-yellow-100 text-yellow-800',
  'COMPLETED': 'bg-green-100 text-green-800',
  'CANCELLED': 'bg-gray-100 text-gray-800',
  'FAILED': 'bg-red-100 text-red-800',
  'RECONCILED': 'bg-blue-100 text-blue-800'
}

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchTransactions()
  }, [page, typeFilter, statusFilter])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })
      
      if (typeFilter) params.append('type', typeFilter)
      if (statusFilter) params.append('status', statusFilter)

      const response = await fetch(`/api/finance/transactions?${params}`)
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions)
        setTotal(data.pagination.total)
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    if (!searchTerm) return true
    return transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           transaction.glAccount?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'INCOME':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case 'EXPENSE':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      case 'TRANSFER':
        return <RefreshCw className="h-4 w-4 text-blue-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getFraudRiskBadge = (score?: number) => {
    if (!score || score < 0.3) return null
    
    if (score >= 0.7) {
      return (
        <Badge variant="destructive" className="text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Hoch ({Math.round(score * 100)}%)
        </Badge>
      )
    } else if (score >= 0.5) {
      return (
        <Badge className="bg-orange-100 text-orange-800 text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Mittel ({Math.round(score * 100)}%)
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
          Niedrig ({Math.round(score * 100)}%)
        </Badge>
      )
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Transaktionen</span>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Neue Transaktion
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Suche nach Beschreibung, Referenz oder Konto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Typ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Typen</SelectItem>
                <SelectItem value="INCOME">Einnahme</SelectItem>
                <SelectItem value="EXPENSE">Ausgabe</SelectItem>
                <SelectItem value="TRANSFER">Überweisung</SelectItem>
                <SelectItem value="PAYMENT">Zahlung</SelectItem>
                <SelectItem value="REFUND">Erstattung</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="PENDING">Ausstehend</SelectItem>
                <SelectItem value="COMPLETED">Abgeschlossen</SelectItem>
                <SelectItem value="CANCELLED">Storniert</SelectItem>
                <SelectItem value="FAILED">Fehlgeschlagen</SelectItem>
                <SelectItem value="RECONCILED">Ausgeglichen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transaction List */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Lade Transaktionen...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        {getTypeIcon(transaction.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">
                            {transaction.description || 'Transaktion ohne Beschreibung'}
                          </h3>
                          <Badge className={typeColors[transaction.type] || 'bg-gray-100 text-gray-800'}>
                            {typeLabels[transaction.type] || transaction.type}
                          </Badge>
                          <Badge className={statusColors[transaction.status] || 'bg-gray-100 text-gray-800'}>
                            {statusLabels[transaction.status] || transaction.status}
                          </Badge>
                          {getFraudRiskBadge(transaction.fraudRiskScore)}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Euro className="h-3 w-3" />
                              <span className={`font-bold ${
                                transaction.type === 'INCOME' ? 'text-green-600' : 
                                transaction.type === 'EXPENSE' ? 'text-red-600' : 
                                'text-blue-600'
                              }`}>
                                {transaction.type === 'EXPENSE' ? '-' : '+'}
                                {transaction.amount.toLocaleString('de-DE', { 
                                  style: 'currency', 
                                  currency: transaction.currency 
                                })}
                              </span>
                            </div>
                            
                            {transaction.reference && (
                              <div className="flex items-center space-x-1">
                                <span>Ref: {transaction.reference}</span>
                              </div>
                            )}
                            
                            {transaction.glAccount && (
                              <div className="flex items-center space-x-1">
                                <span className="font-medium">Konto: {transaction.glAccount}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(transaction.createdAt).toLocaleDateString('de-DE')}</span>
                            </div>
                          </div>
                          
                          {/* AI Categorization */}
                          {transaction.aiCategorization && (
                            <div className="bg-indigo-50 p-2 rounded text-xs">
                              <div className="flex items-center space-x-2">
                                <Brain className="h-3 w-3 text-indigo-600" />
                                <span className="text-indigo-800">KI-Kategorisierung: {transaction.aiCategorization}</span>
                                {transaction.confidenceScore && (
                                  <span className="text-indigo-600">
                                    ({Math.round(transaction.confidenceScore * 100)}% Confidence)
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col items-end space-y-2 min-w-24">
                        <div className="text-right text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleTimeString('de-DE', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        
                        {transaction.status === 'PENDING' && (
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Bestätigen
                            </Button>
                          </div>
                        )}
                        
                        {transaction.status === 'COMPLETED' && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verbucht
                          </Badge>
                        )}
                        
                        {transaction.invoiceId && (
                          <Badge variant="outline" className="text-xs">
                            Rechnung verknüpft
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredTransactions.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Keine Transaktionen gefunden</p>
                </div>
              )}
              
              {/* Pagination */}
              {total > 10 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-gray-600">
                    Zeige {Math.min(page * 10, total)} von {total} Transaktionen
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
