
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Brain, TrendingUp, Users, Package, Target, Sparkles, BarChart3, Zap } from 'lucide-react'

export default function AIInsightsPage() {
  const insights = [
    {
      id: 1,
      title: 'Predictive Analytics',
      description: 'AI-powered forecasting for better decision making',
      category: 'Analytics',
      confidence: 95,
      impact: 'high',
      trend: 'up'
    },
    {
      id: 2,
      title: 'Employee Performance',
      description: 'AI insights into team productivity and engagement',
      category: 'HR',
      confidence: 88,
      impact: 'medium',
      trend: 'up'
    },
    {
      id: 3,
      title: 'Logistics Optimization',
      description: 'Route optimization and delivery predictions',
      category: 'Logistics',
      confidence: 92,
      impact: 'high',
      trend: 'stable'
    },
    {
      id: 4,
      title: 'Customer Behavior',
      description: 'Understanding customer patterns and preferences',
      category: 'Marketing',
      confidence: 85,
      impact: 'medium',
      trend: 'up'
    }
  ]

  const stats = [
    { title: 'AI Models Active', value: '24', change: '+8%', icon: Brain },
    { title: 'Predictions Made', value: '12,543', change: '+15%', icon: Target },
    { title: 'Accuracy Rate', value: '94.2%', change: '+2.1%', icon: TrendingUp },
    { title: 'Insights Generated', value: '1,847', change: '+22%', icon: Sparkles }
  ]

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-600">Intelligent analytics and predictive insights</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Brain className="w-4 h-4 mr-2" />
          Generate New Insight
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Latest AI Insights
          </CardTitle>
          <CardDescription>
            AI-generated insights to help optimize your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{insight.category}</Badge>
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact} impact
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {insight.confidence}%
                  </div>
                  <p className="text-xs text-gray-500">Confidence</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600">{insight.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Performance Analytics</h3>
                <p className="text-sm text-gray-600">View detailed performance metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold">Predictive Models</h3>
                <p className="text-sm text-gray-600">Explore AI prediction models</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="font-semibold">Automation</h3>
                <p className="text-sm text-gray-600">AI-powered automation tools</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
