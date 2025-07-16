
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, FileText, Calculator, TrendingUp, TrendingDown, Euro, Calendar, Search, Download } from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts"

interface JournalEntry {
  id: string
  date: string
  reference: string
  description: string
  debitAccount: string
  creditAccount: string
  amount: number
  status: 'posted' | 'pending' | 'draft'
}

interface Account {
  id: string
  number: string
  name: string
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  balance: number
  currency: string
}

export default function AccountingPage() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("current")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAccountingData()
  }, [])

  const loadAccountingData = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setJournalEntries([
        {
          id: "1",
          date: "2024-01-15",
          reference: "JE-2024-001",
          description: "Rechnung Lieferant ABC GmbH",
          debitAccount: "5000 - Wareneinkauf",
          creditAccount: "1600 - Verbindlichkeiten",
          amount: 12500.00,
          status: "posted"
        },
        {
          id: "2",
          date: "2024-01-14",
          reference: "JE-2024-002", 
          description: "Verkauf an Kunde XYZ",
          debitAccount: "1200 - Forderungen",
          creditAccount: "8000 - Umsatzerlöse",
          amount: 8900.00,
          status: "posted"
        },
        {
          id: "3",
          date: "2024-01-13",
          reference: "JE-2024-003",
          description: "Büromaterial Einkauf",
          debitAccount: "6300 - Büroausstattung",
          creditAccount: "1000 - Kasse",
          amount: 450.00,
          status: "pending"
        },
        {
          id: "4",
          date: "2024-01-12",
          reference: "JE-2024-004",
          description: "Mieteinnahme Januar",
          debitAccount: "1000 - Kasse",
          creditAccount: "8500 - Mieteinnahmen",
          amount: 3200.00,
          status: "draft"
        }
      ])

      setAccounts([
        { id: "1", number: "1000", name: "Kasse", type: "asset", balance: 15420.50, currency: "EUR" },
        { id: "2", number: "1200", name: "Forderungen", type: "asset", balance: 45890.30, currency: "EUR" },
        { id: "3", number: "1600", name: "Verbindlichkeiten", type: "liability", balance: 23450.80, currency: "EUR" },
        { id: "4", number: "5000", name: "Wareneinkauf", type: "expense", balance: 125600.00, currency: "EUR" },
        { id: "5", number: "8000", name: "Umsatzerlöse", type: "revenue", balance: 256890.50, currency: "EUR" },
        { id: "6", number: "6300", name: "Büroausstattung", type: "expense", balance: 8950.20, currency: "EUR" }
      ])
      setLoading(false)
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      posted: "default",
      pending: "secondary",
      draft: "outline"
    } as const
    
    const labels = {
      posted: "Gebucht",
      pending: "Offen",
      draft: "Entwurf"
    }
    
    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const getAccountTypeColor = (type: string) => {
    const colors = {
      asset: "text-green-600",
      liability: "text-red-600", 
      equity: "text-blue-600",
      revenue: "text-purple-600",
      expense: "text-orange-600"
    }
    return colors[type as keyof typeof colors] || "text-gray-600"
  }

  const filteredEntries = journalEntries.filter(entry => 
    entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.reference.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const monthlyData = [
    { month: 'Okt', revenue: 45000, expenses: 32000 },
    { month: 'Nov', revenue: 52000, expenses: 38000 },
    { month: 'Dez', revenue: 48000, expenses: 35000 },
    { month: 'Jan', revenue: 58000, expenses: 42000 }
  ]

  const totalRevenue = accounts.filter(a => a.type === 'revenue').reduce((sum, a) => sum + a.balance, 0)
  const totalExpenses = accounts.filter(a => a.type === 'expense').reduce((sum, a) => sum + a.balance, 0)
  const totalAssets = accounts.filter(a => a.type === 'asset').reduce((sum, a) => sum + a.balance, 0)
  const totalLiabilities = accounts.filter(a => a.type === 'liability').reduce((sum, a) => sum + a.balance, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Finanzbuchhaltung</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finanzbuchhaltung</h1>
          <p className="text-gray-600 mt-1">Journalbuchungen und Kontoführung</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            Neue Buchung
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Umsatzerlöse</p>
                <p className="text-2xl font-bold text-green-600">€{totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ausgaben</p>
                <p className="text-2xl font-bold text-red-600">€{totalExpenses.toLocaleString()}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktiva</p>
                <p className="text-2xl font-bold text-blue-600">€{totalAssets.toLocaleString()}</p>
              </div>
              <Calculator className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verbindlichkeiten</p>
                <p className="text-2xl font-bold text-orange-600">€{totalLiabilities.toLocaleString()}</p>
              </div>
              <Euro className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Finanzübersicht</CardTitle>
          <CardDescription>Monatliche Entwicklung von Einnahmen und Ausgaben</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tickLine={false}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                tickLine={false}
                tick={{ fontSize: 10 }}
                label={{ value: 'Betrag (€)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
              />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10B981" name="Einnahmen" />
              <Bar dataKey="expenses" fill="#F59E0B" name="Ausgaben" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs defaultValue="journal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="accounts">Kontenplan</TabsTrigger>
          <TabsTrigger value="reports">Berichte</TabsTrigger>
        </TabsList>

        <TabsContent value="journal" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buchungen durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Zeitraum wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Aktueller Monat</SelectItem>
                <SelectItem value="quarter">Quartal</SelectItem>
                <SelectItem value="year">Jahr</SelectItem>
                <SelectItem value="all">Alle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredEntries.map((entry) => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{entry.reference}</h3>
                        {getStatusBadge(entry.status)}
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {entry.date}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{entry.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Soll: </span>
                          <span className="font-medium">{entry.debitAccount}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Haben: </span>
                          <span className="font-medium">{entry.creditAccount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">€{entry.amount.toLocaleString()}</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        Bearbeiten
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <div className="grid gap-4">
            {accounts.map((account) => (
              <Card key={account.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold">{account.number.substring(0, 2)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{account.number} - {account.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Badge variant="outline" className="text-xs">
                            {account.type === 'asset' && 'Aktiva'}
                            {account.type === 'liability' && 'Passiva'}
                            {account.type === 'equity' && 'Eigenkapital'}
                            {account.type === 'revenue' && 'Erlöse'}
                            {account.type === 'expense' && 'Aufwendungen'}
                          </Badge>
                          <span>{account.currency}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${getAccountTypeColor(account.type)}`}>
                        €{account.balance.toLocaleString()}
                      </p>
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Gewinn- und Verlustrechnung</h3>
                    <p className="text-sm text-gray-600">Aufstellung der Erträge und Aufwendungen</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Calculator className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Bilanz</h3>
                    <p className="text-sm text-gray-600">Vermögens- und Kapitalstruktur</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Euro className="w-8 h-8 text-purple-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Summen- und Saldenliste</h3>
                    <p className="text-sm text-gray-600">Kontensalden im Überblick</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Umsatzsteuervoranmeldung</h3>
                    <p className="text-sm text-gray-600">Monatliche/quartalsweise Meldung</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
