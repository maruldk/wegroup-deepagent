
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Clock, Download, FileText, Search, Shield, Users, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ComplianceRule {
  id: string
  name: string
  description: string
  status: 'compliant' | 'warning' | 'violation'
  lastCheck: string
  nextCheck: string
  category: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface ComplianceReport {
  id: string
  title: string
  type: string
  generatedAt: string
  status: 'pending' | 'completed' | 'failed'
  size?: string
}

export default function CompliancePage() {
  const [rules, setRules] = useState<ComplianceRule[]>([])
  const [reports, setReports] = useState<ComplianceReport[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadComplianceData()
  }, [])

  const loadComplianceData = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setRules([
        {
          id: "1",
          name: "DSGVO Datenschutz",
          description: "Einhaltung der Datenschutz-Grundverordnung",
          status: "compliant",
          lastCheck: "2024-01-15",
          nextCheck: "2024-04-15",
          category: "Datenschutz",
          severity: "critical"
        },
        {
          id: "2", 
          name: "AO Aufbewahrungsfristen",
          description: "Steuerrechtliche Aufbewahrungspflichten",
          status: "compliant",
          lastCheck: "2024-01-10",
          nextCheck: "2024-07-10",
          category: "Steuerrecht",
          severity: "high"
        },
        {
          id: "3",
          name: "HGB Bilanzierungsregeln",
          description: "Handelsrechtliche Bilanzierungsvorschriften",
          status: "warning",
          lastCheck: "2024-01-12",
          nextCheck: "2024-03-12",
          category: "Bilanzierung",
          severity: "medium"
        },
        {
          id: "4",
          name: "ISO 27001 IT-Sicherheit",
          description: "Informationssicherheits-Management",
          status: "violation",
          lastCheck: "2024-01-08",
          nextCheck: "2024-02-08",
          category: "IT-Sicherheit",
          severity: "critical"
        }
      ])

      setReports([
        {
          id: "1",
          title: "DSGVO Compliance Report Q1 2024",
          type: "PDF",
          generatedAt: "2024-01-15",
          status: "completed",
          size: "2.4 MB"
        },
        {
          id: "2",
          title: "Steuerliche Compliance Prüfung",
          type: "Excel",
          generatedAt: "2024-01-14",
          status: "completed",
          size: "1.8 MB"
        },
        {
          id: "3",
          title: "IT-Sicherheits Assessment",
          type: "PDF",
          generatedAt: "2024-01-13",
          status: "pending"
        }
      ])
      setLoading(false)
    }, 1000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'violation': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      compliant: "default",
      warning: "secondary", 
      violation: "destructive"
    } as const
    
    const labels = {
      compliant: "Konform",
      warning: "Warnung",
      violation: "Verletzung"
    }
    
    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || rule.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const complianceScore = Math.round((rules.filter(r => r.status === 'compliant').length / rules.length) * 100) || 0

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Compliance Management</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Compliance Management</h1>
          <p className="text-gray-600 mt-1">Überwachung und Verwaltung regulatorischer Anforderungen</p>
        </div>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          Neuer Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                <p className="text-2xl font-bold text-gray-900">{complianceScore}%</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
            <Progress value={complianceScore} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktive Regeln</p>
                <p className="text-2xl font-bold text-gray-900">{rules.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verletzungen</p>
                <p className="text-2xl font-bold text-red-600">{rules.filter(r => r.status === 'violation').length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Offene Reports</p>
                <p className="text-2xl font-bold text-gray-900">{reports.filter(r => r.status === 'pending').length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {rules.filter(r => r.status === 'violation').length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Kritische Compliance-Verletzungen erkannt!</strong> Sofortige Maßnahmen erforderlich.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Compliance Regeln</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="audits">Audits</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Regeln durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Kategorie wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                <SelectItem value="Datenschutz">Datenschutz</SelectItem>
                <SelectItem value="Steuerrecht">Steuerrecht</SelectItem>
                <SelectItem value="Bilanzierung">Bilanzierung</SelectItem>
                <SelectItem value="IT-Sicherheit">IT-Sicherheit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredRules.map((rule) => (
              <Card key={rule.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(rule.status)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                          {getStatusBadge(rule.status)}
                          <Badge variant="outline">{rule.category}</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{rule.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Letzte Prüfung: {rule.lastCheck}</span>
                          <span>Nächste Prüfung: {rule.nextCheck}</span>
                          <Badge variant="outline" className="text-xs">
                            {rule.severity === 'critical' && '🔴 Kritisch'}
                            {rule.severity === 'high' && '🟠 Hoch'}
                            {rule.severity === 'medium' && '🟡 Mittel'}
                            {rule.severity === 'low' && '🟢 Niedrig'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{report.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>Erstellt: {report.generatedAt}</span>
                          <span>•</span>
                          <span>Typ: {report.type}</span>
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
                      <Badge variant={report.status === 'completed' ? 'default' : report.status === 'pending' ? 'secondary' : 'destructive'}>
                        {report.status === 'completed' && 'Abgeschlossen'}
                        {report.status === 'pending' && 'In Bearbeitung'}
                        {report.status === 'failed' && 'Fehlgeschlagen'}
                      </Badge>
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

        <TabsContent value="audits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit-Planung</CardTitle>
              <CardDescription>
                Geplante und durchgeführte Compliance-Audits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Audit-System wird vorbereitet</h3>
                <p className="text-gray-600">Umfassendes Audit-Management wird in Kürze verfügbar sein</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
