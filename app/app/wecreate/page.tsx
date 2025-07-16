
import { Suspense } from 'react'
import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Palette, Users, Zap, TrendingUp, Lightbulb } from 'lucide-react'
import WeCreateDashboard from '@/components/wecreate/wecreate-dashboard'

export const metadata: Metadata = {
  title: 'weCreate - KI-gestützte Kreativplattform | WeGroup Platform',
  description: 'Revolutionäre Content-Erstellung mit 80% KI-Autonomie. Multimodale Generierung, Collaboration und Asset-Management.',
}

export default function WeCreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                KI-Autonomie: 80%
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              weCreate
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
              KI-gestützte Kreativplattform für multimodale Content-Erstellung, 
              interaktives Storytelling und intelligentes Asset-Management
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                <Palette className="w-4 h-4 mr-2" />
                Multimodale Generierung
              </div>
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                Team-Collaboration
              </div>
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Real-time KI-Engine
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<WeCreateDashboardSkeleton />}>
          <WeCreateDashboard />
        </Suspense>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            KI-First Kreativwerkzeuge
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Leistungsstarke KI-Technologien zur Automatisierung und Optimierung 
            des gesamten kreativen Workflows
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-blue-50">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <CardTitle>KI-Avatare & Content</CardTitle>
              <CardDescription>
                Personalisierte KI-Avatare für Markenidentität und automatisierte Content-Generierung
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  GPT-4o Integration
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Multimodale Ausgabe
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Brand Consistency
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Design-Tools</CardTitle>
              <CardDescription>
                KI-gestütztes Prototyping und Design-System-Generierung für professionelle Ergebnisse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Auto-Layout Generation
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Smart Color Palettes
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Responsive Templates
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Interactive Storytelling</CardTitle>
              <CardDescription>
                Immersive Präsentationen und Workshop-Tools mit KI-optimierter Narrative
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Branching Narratives
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Engagement Analytics
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Real-time Collaboration
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
              Messbare KI-Autonomie und Effizienzsteigerung
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">80%</div>
              <div className="text-sm text-gray-600">KI-Autonomie</div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">90%</div>
              <div className="text-sm text-gray-600">Workflow Automation</div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">5x</div>
              <div className="text-sm text-gray-600">Collaboration Effizienz</div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">95%</div>
              <div className="text-sm text-gray-600">Content Quality Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function WeCreateDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
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
      <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
  )
}
