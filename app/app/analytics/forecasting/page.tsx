
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Target, TrendingUp, Calendar, Brain, BarChart3, Activity, Zap, Users } from 'lucide-react'

export default function AnalyticsForecastingPage() {
  const forecasts = [
    {
      id: 1,
      title: 'Revenue Forecast Q2 2024',
      category: 'Financial',
      accuracy: 94.5,
      trend: 'up',
      prediction: '€2.4M',
      confidence: 'high',
      timeframe: '3 months'
    },
    {
      id: 2,
      title: 'Employee Turnover Prediction',
      category: 'HR',
      accuracy: 89.2,
      trend: 'down',
      prediction: '8.5%',
      confidence: 'medium',
      timeframe: '6 months'
    },
    {
      id: 3,
      title: 'Logistics Demand Forecast',
      category: 'Operations',
      accuracy: 91.8,
      trend: 'up',
      prediction: '+15%',
      confidence: 'high',
      timeframe: '2 months'
    },
    {
      id: 4,
      title: 'Customer Acquisition Forecast',
      category: 'Marketing',
      accuracy: 87.3,
      trend: 'up',
      prediction: '1,250',
      confidence: 'medium',
      timeframe: '4 months'
    }
  ]

  const metrics = [
    { title: 'Forecast Accuracy', value: '91.2%', change: '+2.1%', icon: Target },
    { title: 'Models Active', value: '12', change: '+3', icon: Brain },
    { title: 'Predictions Made', value: '847', change: '+15%', icon: TrendingUp },
    { title: 'Data Points', value: '2.1M', change: '+22%', icon: BarChart3 }
  ]

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Financial': return BarChart3
      case 'HR': return Users
      case 'Operations': return Activity
      case 'Marketing': return Target
      default: return Brain
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forecasting Analytics</h1>
          <p className="text-gray-600">AI-powered predictive analytics and forecasting</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Brain className="w-4 h-4 mr-2" />
          Create Forecast
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{metric.change}</span> from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Forecasts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Active Forecasts
          </CardTitle>
          <CardDescription>
            Current AI-powered forecasts and predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {forecasts.map((forecast) => {
              const IconComponent = getCategoryIcon(forecast.category)
              return (
                <div key={forecast.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{forecast.title}</h3>
                      <p className="text-sm text-gray-600">{forecast.category} • {forecast.timeframe}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{forecast.accuracy}% accuracy</Badge>
                        <Badge className={getConfidenceColor(forecast.confidence)}>
                          {forecast.confidence} confidence
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {forecast.prediction}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`w-4 h-4 ${forecast.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                      <span className={`text-sm ${forecast.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {forecast.trend}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Forecast Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Financial Forecasts</h3>
                <p className="text-sm text-gray-600">Revenue and cost predictions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold">HR Forecasts</h3>
                <p className="text-sm text-gray-600">Employee and talent predictions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="font-semibold">Operations Forecasts</h3>
                <p className="text-sm text-gray-600">Demand and capacity planning</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-600" />
              <div>
                <h3 className="font-semibold">Market Forecasts</h3>
                <p className="text-sm text-gray-600">Customer and market trends</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
