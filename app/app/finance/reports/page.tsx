
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Calendar, TrendingUp, Euro, BarChart3, PieChart, RefreshCw, Filter } from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart as RechartsPieChart, Cell } from "recharts"


interface FinancialReport {
  id: string
  name: string
  type: 'p_l' | 'balance_sheet' | 'cash_flow' | 'tax' | 'custom'
  period: string
  generatedAt: string
  status: 'completed' | 'generating' | 'scheduled'
  format: 'PDF' | 'Excel' | 'CSV'
  size?: string
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  type: string
  category: string
  frequency: 'monthly' | 'quarterly' | 'yearly' | 'custom'
}

export default function FinanceReportsPage() {
  const [reports, setReports] = useState<FinancialReport[]>([])
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState("current_month")
  const [selectedFormat, setSelectedFormat] = useState("PDF")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReportsData()
  }, [])

  const loadReportsData = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setReports([
        {
          id: "1",
          name: "Gewinn- und Verlustrechnung Q1 2024",
          type: "p_l",
          period: "Q1 2024",
          generatedAt: "2024-01-15",
          status: "completed",
          format: "PDF",
          size: "2.4 MB"
        },
        {
          id: "2",
          name: "Bilanz Dezember 2023",
          type: "balance_sheet",
          period: "Dezember 2023", 
          generatedAt: "2024-01-10",
          status: "completed",
          format: "Excel",
          size: "1.8 MB"
        },
        {
          id: "3",
          name: "Cash Flow Analyse Januar 2024",
          type: "cash_flow",
          period: "Januar 2024",
          generatedAt: "2024-01-08",
          status: "generating",
          format: "PDF"
        },
        {
          id: "4",
          name: "Umsatzsteuervoranmeldung Q4 2023",
          type: "tax",
          period: "Q4 2023",
          generatedAt: "2024-01-05",
          status: "completed",
          format: "PDF",
          size: "890 KB"
        }
      ])

      setTemplates([
        {
          id: "1",
          name: "Gewinn- und Verlustrechnung",
          description: "Detaillierte Aufstellung der Erträge und Aufwendungen",
          type: "P&L",
          category: "Standardberichte",
          frequency: "monthly"
        },
        {
          id: "2",
          name: "Bilanz", 
          description: "Vermögens- und Kapitalstruktur zum Stichtag",
          type: "Bilanz",
          category: "Standardberichte",
          frequency: "monthly"
        },
        {
          id: "3",
          name: "Cash Flow Statement",
          description: "Geldflussrechnung nach direkter/indirekter Methode",
          type: "Cash Flow",
          category: "Standardberichte",
          frequency: "monthly"
        },
        {
          id: "4",
          name: "Management Dashboard",
          description: "KPI-Dashboard für die Geschäftsleitung",
          type: "Dashboard",
          category: "Executive Reports",
          frequency: "monthly"
        },
        {
          id: "5",
          name: "Kostenstellenbericht",
          description: "Detaillierte Kostenstellen-Analyse",
          type: "Controlling",
          category: "Controlling",
          frequency: "monthly"
        },
        {
          id: "6",
          name: "Umsatzsteuervoranmeldung",
          description: "Steuerliche Meldung an das Finanzamt",
          type: "Steuern",
          category: "Compliance",
          frequency: "monthly"
        }
      ])
      setLoading(false)
    }, 1000)
  }

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'p_l': return <TrendingUp className="w-5 h-5 text-green-500" />
      case 'balance_sheet': return <BarChart3 className="w-5 h-5 text-blue-500" />
      case 'cash_flow': return <Euro className="w-5 h-5 text-purple-500" />
      case 'tax': return <FileText className="w-5 h-5 text-orange-500" />
      default: return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      generating: "secondary",
      scheduled: "outline"
    } as const
    
    const labels = {
      completed: "Abgeschlossen",
      generating: "Wird erstellt",
      scheduled: "Geplant"
    }
    
    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  // Sample chart data
  const monthlyRevenueData = [
    { month: 'Aug', revenue: 85000, profit: 15000 },
    { month: 'Sep', revenue: 92000, profit: 18000 },
    { month: 'Okt', revenue: 88000, profit: 16000 },
    { month: 'Nov', revenue: 95000, profit: 22000 },
    { month: 'Dez', revenue: 98000, profit: 25000 },
    { month: 'Jan', revenue: 102000, profit: 28000 }
  ]

  const departmentCosts = [
    { name: 'IT', value: 45000, color: '#3B82F6' },
    { name: 'Marketing', value: 35000, color: '#EF4444' },
    { name: 'HR', value: 28000, color: '#10B981' },
    { name: 'Operations', value: 52000, color: '#F59E0B' },
    { name: 'Sales', value: 38000, color: '#8B5CF6' }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Finanzberichte</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-gray-900">Finanzberichte</h1>
          <p className="text-gray-600 mt-1">Generierung und Verwaltung von Finanzberichten</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Aktualisieren
          </Button>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Neuer Bericht
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Heute erstellt</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Diesen Monat</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Geplante Reports</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <RefreshCw className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gesamtgröße</p>
                <p className="text-2xl font-bold text-gray-900">125 MB</p>
              </div>
              <Download className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Umsatz & Gewinn Entwicklung</CardTitle>
            <CardDescription>Monatliche Entwicklung der letzten 6 Monate</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenueData}>
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
                <Tooltip formatter={(value) => [`€${value?.toLocaleString()}`, '']} />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} name="Umsatz" />
                <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} name="Gewinn" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kostenverteilung nach Bereichen</CardTitle>
            <CardDescription>Aktuelle Kostenverteilung im Unternehmen</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Tooltip formatter={(value) => [`€${value?.toLocaleString()}`, '']} />
                <RechartsPieChart dataKey="value" data={departmentCosts} cx="50%" cy="50%" outerRadius={80}>
                  {departmentCosts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPieChart>
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {departmentCosts.map((dept) => (
                <div key={dept.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></div>
                  <span className="text-sm text-gray-600">{dept.name}: €{dept.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Erstelle Berichte</TabsTrigger>
          <TabsTrigger value="templates">Report-Vorlagen</TabsTrigger>
          <TabsTrigger value="history">Verlauf</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Neuen Bericht erstellen</CardTitle>
              <CardDescription>Konfigurieren Sie Ihren individuellen Finanzbericht</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Berichtszeitraum</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Zeitraum wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current_month">Aktueller Monat</SelectItem>
                      <SelectItem value="last_month">Letzter Monat</SelectItem>
                      <SelectItem value="current_quarter">Aktuelles Quartal</SelectItem>
                      <SelectItem value="last_quarter">Letztes Quartal</SelectItem>
                      <SelectItem value="current_year">Aktuelles Jahr</SelectItem>
                      <SelectItem value="custom">Benutzerdefiniert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Format</label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Format wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="Excel">Excel</SelectItem>
                      <SelectItem value="CSV">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Aktionen</label>
                  <Button className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Bericht erstellen
                  </Button>
                </div>
              </div>
              
              {selectedPeriod === "custom" && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Benutzerdefinierter Zeitraum</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      type="date" 
                      placeholder="Von"
                      onChange={(e) => console.log('Date from:', e.target.value)}
                    />
                    <Input 
                      type="date" 
                      placeholder="Bis"
                      onChange={(e) => console.log('Date to:', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getReportTypeIcon(template.type)}
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {template.frequency === 'monthly' && 'Monatlich'}
                      {template.frequency === 'quarterly' && 'Quartalsweise'}
                      {template.frequency === 'yearly' && 'Jährlich'}
                      {template.frequency === 'custom' && 'Benutzerdefiniert'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{template.category}</Badge>
                    <Button size="sm">
                      Erstellen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getReportTypeIcon(template.type)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{template.category}</Badge>
                          <Badge variant="secondary" className="text-xs">
                            {template.frequency === 'monthly' && 'Monatlich'}
                            {template.frequency === 'quarterly' && 'Quartalsweise'}
                            {template.frequency === 'yearly' && 'Jährlich'}
                            {template.frequency === 'custom' && 'Benutzerdefiniert'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Bearbeiten
                      </Button>
                      <Button size="sm">
                        Verwenden
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getReportTypeIcon(report.type)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{report.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>Erstellt: {report.generatedAt}</span>
                          <span>•</span>
                          <span>Zeitraum: {report.period}</span>
                          <span>•</span>
                          <span>Format: {report.format}</span>
                          {report.size && (
                            <>
                              <span>•</span>
                              <span>Größe: {report.size}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(report.status)}
                      {report.status === 'completed' && (
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
