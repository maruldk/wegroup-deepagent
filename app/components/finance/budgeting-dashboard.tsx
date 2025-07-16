
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Euro, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Calculator,
  PieChart as PieChartIcon,
  Target,
  Calendar
} from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Area, AreaChart } from 'recharts'

interface BudgetCategory {
  id: string
  name: string
  allocated: number
  spent: number
  remaining: number
  utilization: number
  status: 'under_budget' | 'on_track' | 'over_budget' | 'critical'
  department: string
  subcategories: BudgetSubcategory[]
}

interface BudgetSubcategory {
  id: string
  name: string
  allocated: number
  spent: number
  forecast: number
}

interface BudgetForecast {
  month: string
  planned: number
  actual: number
  forecast: number
  variance: number
}

export function BudgetingDashboard() {
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('current_year')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBudgetData()
  }, [selectedPeriod, selectedDepartment])

  const loadBudgetData = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setBudgetCategories([
        {
          id: '1',
          name: 'Personal',
          allocated: 450000,
          spent: 342000,
          remaining: 108000,
          utilization: 76,
          status: 'on_track',
          department: 'HR',
          subcategories: [
            { id: '1-1', name: 'Gehälter', allocated: 320000, spent: 246000, forecast: 315000 },
            { id: '1-2', name: 'Benefits', allocated: 80000, spent: 58000, forecast: 75000 },
            { id: '1-3', name: 'Weiterbildung', allocated: 50000, spent: 38000, forecast: 48000 }
          ]
        },
        {
          id: '2',
          name: 'Marketing',
          allocated: 120000,
          spent: 105000,
          remaining: 15000,
          utilization: 87.5,
          status: 'over_budget',
          department: 'Marketing',
          subcategories: [
            { id: '2-1', name: 'Digital Marketing', allocated: 60000, spent: 58000, forecast: 62000 },
            { id: '2-2', name: 'Events', allocated: 40000, spent: 35000, forecast: 38000 },
            { id: '2-3', name: 'Content', allocated: 20000, spent: 12000, forecast: 18000 }
          ]
        },
        {
          id: '3',
          name: 'IT & Technologie',
          allocated: 200000,
          spent: 125000,
          remaining: 75000,
          utilization: 62.5,
          status: 'under_budget',
          department: 'IT',
          subcategories: [
            { id: '3-1', name: 'Software Lizenzen', allocated: 80000, spent: 72000, forecast: 78000 },
            { id: '3-2', name: 'Hardware', allocated: 70000, spent: 35000, forecast: 65000 },
            { id: '3-3', name: 'Cloud Services', allocated: 50000, spent: 18000, forecast: 45000 }
          ]
        },
        {
          id: '4',
          name: 'Betrieb & Verwaltung',
          allocated: 180000,
          spent: 148000,
          remaining: 32000,
          utilization: 82.2,
          status: 'on_track',
          department: 'Operations',
          subcategories: [
            { id: '4-1', name: 'Miete & Nebenkosten', allocated: 120000, spent: 100000, forecast: 118000 },
            { id: '4-2', name: 'Büromaterial', allocated: 30000, spent: 25000, forecast: 28000 },
            { id: '4-3', name: 'Versicherungen', allocated: 30000, spent: 23000, forecast: 29000 }
          ]
        },
        {
          id: '5',
          name: 'Forschung & Entwicklung',
          allocated: 300000,
          spent: 195000,
          remaining: 105000,
          utilization: 65,
          status: 'under_budget',
          department: 'R&D',
          subcategories: [
            { id: '5-1', name: 'Prototyping', allocated: 150000, spent: 98000, forecast: 145000 },
            { id: '5-2', name: 'Tools & Infrastruktur', allocated: 100000, spent: 67000, forecast: 95000 },
            { id: '5-3', name: 'External Services', allocated: 50000, spent: 30000, forecast: 48000 }
          ]
        }
      ])
      setLoading(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      under_budget: 'bg-blue-100 text-blue-700',
      on_track: 'bg-green-100 text-green-700', 
      over_budget: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'under_budget':
        return <TrendingDown className="w-4 h-4 text-blue-500" />
      case 'on_track':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'over_budget':
        return <TrendingUp className="w-4 h-4 text-orange-500" />
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Calculator className="w-4 h-4 text-gray-500" />
    }
  }

  const budgetTrends = [
    { month: 'Aug', planned: 85000, actual: 82000, forecast: 84000, variance: -3000 },
    { month: 'Sep', planned: 95000, actual: 98000, forecast: 96000, variance: 3000 },
    { month: 'Okt', planned: 88000, actual: 85000, forecast: 87000, variance: -3000 },
    { month: 'Nov', planned: 92000, actual: 96000, forecast: 94000, variance: 4000 },
    { month: 'Dez', planned: 110000, actual: 108000, forecast: 109000, variance: -2000 },
    { month: 'Jan', planned: 95000, actual: 99000, forecast: 97000, variance: 4000 }
  ]

  const departmentSpending = [
    { name: 'HR', value: 342000, percentage: 35.2, color: '#60B5FF' },
    { name: 'IT', value: 125000, percentage: 12.9, color: '#FF9149' },
    { name: 'Marketing', value: 105000, percentage: 10.8, color: '#FF9898' },
    { name: 'Operations', value: 148000, percentage: 15.2, color: '#80D8C3' },
    { name: 'R&D', value: 195000, percentage: 20.1, color: '#A19AD3' },
    { name: 'Sonstige', value: 55000, percentage: 5.7, color: '#FF90BB' }
  ]

  const totalAllocated = budgetCategories.reduce((acc, cat) => acc + cat.allocated, 0)
  const totalSpent = budgetCategories.reduce((acc, cat) => acc + cat.spent, 0)
  const totalRemaining = budgetCategories.reduce((acc, cat) => acc + cat.remaining, 0)
  const avgUtilization = Math.round(budgetCategories.reduce((acc, cat) => acc + cat.utilization, 0) / budgetCategories.length)

  const overBudgetCount = budgetCategories.filter(cat => cat.status === 'over_budget' || cat.status === 'critical').length
  const onTrackCount = budgetCategories.filter(cat => cat.status === 'on_track').length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Budget-Management</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">KI-Budget-Management</h1>
          <p className="text-gray-600 mt-1">Intelligente Budgetplanung mit 92% Vorhersagegenauigkeit</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Zeitraum wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_year">Aktuelles Jahr</SelectItem>
              <SelectItem value="current_quarter">Aktuelles Quartal</SelectItem>
              <SelectItem value="last_quarter">Letztes Quartal</SelectItem>
              <SelectItem value="ytd">Year-to-Date</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Target className="w-4 h-4 mr-2" />
            Budget erstellen
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gesamtbudget</p>
                <p className="text-2xl font-bold text-gray-900">€{totalAllocated.toLocaleString()}</p>
                <p className="text-xs text-blue-600">Zugewiesen</p>
              </div>
              <Euro className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ausgegeben</p>
                <p className="text-2xl font-bold text-orange-600">€{totalSpent.toLocaleString()}</p>
                <p className="text-xs text-orange-600">{Math.round((totalSpent/totalAllocated)*100)}% verbraucht</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verbleibendes Budget</p>
                <p className="text-2xl font-bold text-green-600">€{totalRemaining.toLocaleString()}</p>
                <p className="text-xs text-green-600">Verfügbar</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ø Auslastung</p>
                <p className="text-2xl font-bold text-purple-600">{avgUtilization}%</p>
                <p className="text-xs text-purple-600">Durchschnittlich</p>
              </div>
              <Calculator className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget-Trends & Forecasting</CardTitle>
          <CardDescription>Geplant vs. Tatsächlich vs. KI-Prognose</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={budgetTrends}>
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
              <Area 
                type="monotone" 
                dataKey="planned" 
                stackId="1"
                stroke="#60B5FF" 
                fill="#60B5FF" 
                fillOpacity={0.3}
                name="Geplant"
              />
              <Area 
                type="monotone" 
                dataKey="actual" 
                stackId="2"
                stroke="#FF9149" 
                fill="#FF9149" 
                fillOpacity={0.3}
                name="Tatsächlich"
              />
              <Line 
                type="monotone" 
                dataKey="forecast" 
                stroke="#80D8C3" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="KI-Prognose"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Budget-Kategorien</TabsTrigger>
          <TabsTrigger value="departments">Abteilungen</TabsTrigger>
          <TabsTrigger value="forecasting">KI-Forecasting</TabsTrigger>
          <TabsTrigger value="optimization">Optimierung</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4">
            {budgetCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <Badge className={getStatusColor(category.status)}>
                          {getStatusIcon(category.status)}
                          <span className="ml-1">
                            {category.status === 'under_budget' && 'Unter Budget'}
                            {category.status === 'on_track' && 'Im Plan'}
                            {category.status === 'over_budget' && 'Über Budget'}
                            {category.status === 'critical' && 'Kritisch'}
                          </span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {category.department}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Zugewiesen: </span>
                          <span className="font-medium">€{category.allocated.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Ausgegeben: </span>
                          <span className="font-medium">€{category.spent.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Verbleibend: </span>
                          <span className="font-medium text-green-600">€{category.remaining.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Auslastung: </span>
                          <span className="font-medium">{category.utilization}%</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Budget-Auslastung</span>
                          <span>{category.utilization}%</span>
                        </div>
                        <Progress value={category.utilization} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {category.subcategories.map((sub) => (
                          <div key={sub.id} className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="font-medium text-sm text-gray-900 mb-2">{sub.name}</h4>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span>Budget:</span>
                                <span>€{sub.allocated.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Ausgegeben:</span>
                                <span>€{sub.spent.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Prognose:</span>
                                <span className="text-blue-600">€{sub.forecast.toLocaleString()}</span>
                              </div>
                            </div>
                            <Progress 
                              value={(sub.spent / sub.allocated) * 100} 
                              className="mt-2 h-1"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                      <Button size="sm">
                        Anpassen
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ausgaben nach Abteilung</CardTitle>
                <CardDescription>Verteilung der Budgetverwendung</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentSpending}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.percentage}%`}
                    >
                      {departmentSpending.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `€${Number(value).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget-Performance</CardTitle>
                <CardDescription>Abteilungs-Performance im Vergleich</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentSpending}>
                    <XAxis 
                      dataKey="name" 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Betrag (€)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <Tooltip formatter={(value) => `€${Number(value).toLocaleString()}`} />
                    <Bar dataKey="value" fill="#60B5FF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>KI-Budget-Vorhersagen</CardTitle>
                <CardDescription>Prognostizierte Ausgaben für die nächsten 6 Monate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Vorhersagegenauigkeit</span>
                  <span className="font-bold text-green-600">92.3%</span>
                </div>
                <Progress value={92.3} />
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Q2 2024 Prognose</span>
                    <span className="font-medium">€285,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Erwartete Einsparungen</span>
                    <span className="font-medium text-green-600">€45,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Risiko-Kategorien</span>
                    <span className="font-medium text-orange-600">2 Bereiche</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimierungsempfehlungen</CardTitle>
                <CardDescription>KI-generierte Verbesserungsvorschläge</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">IT-Lizenzen konsolidieren</p>
                      <p className="text-xs text-gray-600">Potenzielle Einsparung: €12,000/Jahr</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Marketing-Budget neu verteilen</p>
                      <p className="text-xs text-gray-600">15% zu Digital Marketing verschieben</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">R&D Investment erhöhen</p>
                      <p className="text-xs text-gray-600">ROI-Potential: 245% in 24 Monaten</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Target className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Automatische Budgetierung</h3>
                    <p className="text-sm text-gray-600">KI-basierte Budget-Allokation</p>
                    <p className="text-xs text-green-600 mt-1">+23% Effizienz</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-8 h-8 text-orange-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Ausgaben-Monitoring</h3>
                    <p className="text-sm text-gray-600">Real-time Budget-Überwachung</p>
                    <p className="text-xs text-orange-600 mt-1">5 Alerts aktiv</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Jahresplanung 2025</h3>
                    <p className="text-sm text-gray-600">KI-gestützte Budgetplanung</p>
                    <p className="text-xs text-blue-600 mt-1">In Vorbereitung</p>
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
