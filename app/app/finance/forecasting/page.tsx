
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calculator,
  AlertTriangle,
  CheckCircle,
  Brain,
  Target,
  Euro
} from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, ComposedChart } from 'recharts'

interface ForecastData {
  period: string
  revenue: {
    actual?: number
    forecast: number
    optimistic: number
    pessimistic: number
    confidence: number
  }
  expenses: {
    actual?: number
    forecast: number
    optimistic: number
    pessimistic: number
  }
  cashFlow: {
    actual?: number
    forecast: number
    optimistic: number
    pessimistic: number
  }
  scenarios: {
    best: number
    realistic: number
    worst: number
  }
}

export default function ForecastingPage() {
  const [forecastData, setForecastData] = useState<ForecastData[]>([])
  const [selectedHorizon, setSelectedHorizon] = useState('12_months')
  const [selectedScenario, setSelectedScenario] = useState('realistic')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadForecastData()
  }, [selectedHorizon, selectedScenario])

  const loadForecastData = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setForecastData([
        {
          period: '2024-02',
          revenue: { actual: 120000, forecast: 125000, optimistic: 135000, pessimistic: 115000, confidence: 87 },
          expenses: { actual: 95000, forecast: 98000, optimistic: 92000, pessimistic: 105000 },
          cashFlow: { actual: 25000, forecast: 27000, optimistic: 43000, pessimistic: 10000 },
          scenarios: { best: 43000, realistic: 27000, worst: 10000 }
        },
        {
          period: '2024-03',
          revenue: { forecast: 132000, optimistic: 145000, pessimistic: 120000, confidence: 85 },
          expenses: { forecast: 100000, optimistic: 95000, pessimistic: 108000 },
          cashFlow: { forecast: 32000, optimistic: 50000, pessimistic: 12000 },
          scenarios: { best: 50000, realistic: 32000, worst: 12000 }
        },
        {
          period: '2024-04',
          revenue: { forecast: 138000, optimistic: 152000, pessimistic: 125000, confidence: 83 },
          expenses: { forecast: 102000, optimistic: 97000, pessimistic: 110000 },
          cashFlow: { forecast: 36000, optimistic: 55000, pessimistic: 15000 },
          scenarios: { best: 55000, realistic: 36000, worst: 15000 }
        },
        {
          period: '2024-05',
          revenue: { forecast: 145000, optimistic: 160000, pessimistic: 130000, confidence: 81 },
          expenses: { forecast: 105000, optimistic: 100000, pessimistic: 115000 },
          cashFlow: { forecast: 40000, optimistic: 60000, pessimistic: 15000 },
          scenarios: { best: 60000, realistic: 40000, worst: 15000 }
        },
        {
          period: '2024-06',
          revenue: { forecast: 151000, optimistic: 168000, pessimistic: 135000, confidence: 79 },
          expenses: { forecast: 108000, optimistic: 103000, pessimistic: 118000 },
          cashFlow: { forecast: 43000, optimistic: 65000, pessimistic: 17000 },
          scenarios: { best: 65000, realistic: 43000, worst: 17000 }
        },
        {
          period: '2024-07',
          revenue: { forecast: 148000, optimistic: 165000, pessimistic: 132000, confidence: 77 },
          expenses: { forecast: 106000, optimistic: 101000, pessimistic: 116000 },
          cashFlow: { forecast: 42000, optimistic: 64000, pessimistic: 16000 },
          scenarios: { best: 64000, realistic: 42000, worst: 16000 }
        }
      ])
      setLoading(false)
    }, 1000)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600'
    if (confidence >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const riskFactors = [
    {
      factor: 'Marktvolatilität',
      impact: 'Hoch',
      probability: 65,
      mitigation: 'Diversifikation der Einnahmequellen'
    },
    {
      factor: 'Inflationsdruck',
      impact: 'Mittel',
      probability: 78,
      mitigation: 'Flexible Preisgestaltung'
    },
    {
      factor: 'Lieferkettenprobleme',
      impact: 'Mittel',
      probability: 45,
      mitigation: 'Alternative Lieferanten'
    },
    {
      factor: 'Regulatorische Änderungen',
      impact: 'Niedrig',
      probability: 30,
      mitigation: 'Compliance Monitoring'
    }
  ]

  const scenarioData = forecastData.map(item => ({
    period: item.period,
    optimistic: item.scenarios.best,
    realistic: item.scenarios.realistic,
    pessimistic: item.scenarios.worst
  }))

  const avgConfidence = Math.round(
    forecastData.reduce((acc, item) => acc + (item.revenue.confidence || 0), 0) / forecastData.length
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">KI-Forecasting</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">KI-Financial Forecasting</h1>
          <p className="text-gray-600 mt-1">Intelligente Finanzprognosen mit maschinellem Lernen</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedHorizon} onValueChange={setSelectedHorizon}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Prognosehorizont" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6_months">6 Monate</SelectItem>
              <SelectItem value="12_months">12 Monate</SelectItem>
              <SelectItem value="24_months">24 Monate</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Brain className="w-4 h-4 mr-2" />
            Prognose aktualisieren
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prognose-Genauigkeit</p>
                <p className={`text-2xl font-bold ${getConfidenceColor(avgConfidence)}`}>{avgConfidence}%</p>
                <p className="text-xs text-blue-600">Durchschnittlich</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nächster Monat</p>
                <p className="text-2xl font-bold text-green-600">€{forecastData[1]?.revenue.forecast.toLocaleString()}</p>
                <p className="text-xs text-green-600">Umsatzprognose</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cash Flow</p>
                <p className="text-2xl font-bold text-blue-600">€{forecastData[1]?.cashFlow.forecast.toLocaleString()}</p>
                <p className="text-xs text-blue-600">Nächster Monat</p>
              </div>
              <Euro className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Risiko-Score</p>
                <p className="text-2xl font-bold text-orange-600">Mittel</p>
                <p className="text-xs text-orange-600">4 Faktoren</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Umsatz-Forecast</CardTitle>
          <CardDescription>Tatsächliche vs. prognostizierte Werte mit Konfidenzintervall</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={forecastData}>
              <XAxis 
                dataKey="period" 
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
                dataKey="revenue.optimistic"
                stroke="#80D8C3"
                fill="#80D8C3"
                fillOpacity={0.1}
                name="Optimistisch"
              />
              <Area
                type="monotone"
                dataKey="revenue.pessimistic"
                stroke="#FF9898"
                fill="#FF9898"
                fillOpacity={0.1}
                name="Pessimistisch"
              />
              <Line
                type="monotone"
                dataKey="revenue.actual"
                stroke="#2563EB"
                strokeWidth={3}
                name="Tatsächlich"
              />
              <Line
                type="monotone"
                dataKey="revenue.forecast"
                stroke="#60B5FF"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Prognose"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs defaultValue="scenarios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scenarios">Szenarien</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="risks">Risiken</TabsTrigger>
          <TabsTrigger value="insights">KI-Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Szenario-Vergleich</CardTitle>
                <CardDescription>Optimistisch vs. Realistisch vs. Pessimistisch</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={scenarioData}>
                    <XAxis 
                      dataKey="period" 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis 
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Cash Flow (€)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="optimistic"
                      stackId="1"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.3}
                      name="Optimistisch"
                    />
                    <Area
                      type="monotone"
                      dataKey="realistic"
                      stackId="2"
                      stroke="#60B5FF"
                      fill="#60B5FF"
                      fillOpacity={0.5}
                      name="Realistisch"
                    />
                    <Area
                      type="monotone"
                      dataKey="pessimistic"
                      stackId="3"
                      stroke="#EF4444"
                      fill="#EF4444"
                      fillOpacity={0.3}
                      name="Pessimistisch"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Szenario-Wahrscheinlichkeiten</CardTitle>
                <CardDescription>Eintrittswahrscheinlichkeiten der Szenarien</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Optimistisches Szenario</span>
                    </div>
                    <span className="font-bold">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">Realistisches Szenario</span>
                    </div>
                    <span className="font-bold">55%</span>
                  </div>
                  <Progress value={55} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium">Pessimistisches Szenario</span>
                    </div>
                    <span className="font-bold">20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Empfehlung</h4>
                  <p className="text-sm text-blue-800">
                    Basierend auf den aktuellen Marktdaten ist das realistische Szenario am wahrscheinlichsten. 
                    Vorbereitung auf pessimistische Entwicklungen empfohlen.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Prognose</CardTitle>
              <CardDescription>Detaillierte Liquiditätsentwicklung</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={forecastData}>
                  <XAxis 
                    dataKey="period" 
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Betrag (€)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                  />
                  <Tooltip />
                  <Bar dataKey="revenue.forecast" fill="#60B5FF" name="Umsatz" />
                  <Bar dataKey="expenses.forecast" fill="#FF9149" name="Ausgaben" />
                  <Line
                    type="monotone"
                    dataKey="cashFlow.forecast"
                    stroke="#10B981"
                    strokeWidth={3}
                    name="Cash Flow"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <div className="grid gap-4">
            {riskFactors.map((risk, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{risk.factor}</h3>
                        <Badge variant="outline" className={
                          risk.impact === 'Hoch' ? 'border-red-200 text-red-700' :
                          risk.impact === 'Mittel' ? 'border-yellow-200 text-yellow-700' :
                          'border-green-200 text-green-700'
                        }>
                          {risk.impact} Impact
                        </Badge>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Eintrittswahrscheinlichkeit</span>
                          <span className="font-medium">{risk.probability}%</span>
                        </div>
                        <Progress value={risk.probability} />
                      </div>

                      <div className="text-sm">
                        <span className="text-gray-600">Minderungsmaßnahme: </span>
                        <span className="font-medium">{risk.mitigation}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      {risk.impact === 'Hoch' && <AlertTriangle className="w-6 h-6 text-red-500" />}
                      {risk.impact === 'Mittel' && <TrendingDown className="w-6 h-6 text-yellow-500" />}
                      {risk.impact === 'Niedrig' && <CheckCircle className="w-6 h-6 text-green-500" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>KI-Modell Performance</CardTitle>
                <CardDescription>Algorithmus-Metriken und Lernfortschritt</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Vorhersagegenauigkeit</span>
                  <span className="font-bold text-green-600">87.5%</span>
                </div>
                <Progress value={87.5} />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Datenqualität</span>
                  <span className="font-bold">94.2%</span>
                </div>
                <Progress value={94.2} />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Modell-Vertrauen</span>
                  <span className="font-bold">91.8%</span>
                </div>
                <Progress value={91.8} />

                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Modell zeigt stabile Performance bei kontinuierlichem Lernen
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Strategische Empfehlungen</CardTitle>
                <CardDescription>KI-generierte Handlungsoptionen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Liquiditätsreserve aufbauen</p>
                      <p className="text-xs text-gray-600">3-Monats-Reserve empfohlen für Q2 Volatilität</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Umsatzdiversifikation</p>
                      <p className="text-xs text-gray-600">Neue Einnahmequellen für Risikominimierung</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Calculator className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Kostenstruktur optimieren</p>
                      <p className="text-xs text-gray-600">Variable Kosten um 8% reduzierbar</p>
                    </div>
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
