
import { Suspense } from 'react'
import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Users, TrendingUp, Brain, Target, BarChart3 } from 'lucide-react'
import WeSellDashboard from '@/components/wesell/wesell-dashboard'

export const metadata: Metadata = {
  title: 'weSell - Intelligentes Vertriebsökosystem | WeGroup Platform',
  description: 'KI-gestütztes Vertriebsmanagement mit 85% Automatisierung. Predictive Analytics, CRM und Sales Forecasting.',
}

export default function WeSellPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-blue-600 to-teal-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Brain className="w-4 h-4 mr-2" />
                KI-Automatisierung: 85%
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              weSell
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Intelligentes Vertriebsökosystem mit KI-gestütztem CRM, 
              Predictive Analytics und automatisierter Lead-Qualifizierung
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                Smart CRM
              </div>
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                Sales Forecasting
              </div>
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                <Target className="w-4 h-4 mr-2" />
                Lead Automation
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<WeSellDashboardSkeleton />}>
          <WeSellDashboard />
        </Suspense>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            KI-First Vertriebsmanagement
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Revolutionäre Technologien für intelligente Kundenbeziehungen 
            und datengetriebene Verkaufsentscheidungen
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-blue-50">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle>KI-gestütztes CRM</CardTitle>
              <CardDescription>
                360-Grad-Kundensicht mit Predictive Customer Analytics und automatischer Segmentierung
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Automated Lead Scoring
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Churn Prediction
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Next Best Action
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-teal-50">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Sales Forecasting</CardTitle>
              <CardDescription>
                ML-gestützte Umsatzprognosen mit Echtzeit-Pipeline-Analyse und Risikobewertung
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Revenue Prediction
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Deal Probability
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Risk Assessment
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-teal-50 to-green-50">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Angebotsautomatisierung</CardTitle>
              <CardDescription>
                KI-generierte Angebote mit personalisierter Inhaltsoptimierung und Erfolgsvorhersage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                  Auto Proposal Gen
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                  Content Personalization
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                  Success Optimization
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sprint 3 Performance Ziele
            </h2>
            <p className="text-lg text-gray-600">
              Messbare Verkaufsautomatisierung und Revenue Growth
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-sm text-gray-600">Verkaufsautomatisierung</div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-sm text-gray-600">Forecast Accuracy</div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-teal-600 mb-2">3x</div>
              <div className="text-sm text-gray-600">Lead Conversion</div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">40%</div>
              <div className="text-sm text-gray-600">Revenue Growth</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function WeSellDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  )
}
