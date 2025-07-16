
import { Suspense } from 'react'
import { Metadata } from 'next'
import AdvancedAnalyticsDashboard from '@/components/analytics/advanced-analytics-dashboard'

export const metadata: Metadata = {
  title: 'Advanced Analytics - Cross-Module Business Intelligence | WeGroup Platform',
  description: 'Comprehensive analytics dashboard with AI insights, real-time KPIs, and predictive business intelligence across all modules.',
}

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Advanced Analytics
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-blue-100 max-w-3xl mx-auto">
              Cross-module business intelligence with AI-powered insights, 
              real-time monitoring, and predictive analytics
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                📊 50+ KPIs
              </div>
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                🤖 AI Insights
              </div>
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                ⚡ Real-time Data
              </div>
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                🔮 Predictive Models
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<AnalyticsDashboardSkeleton />}>
          <AdvancedAnalyticsDashboard />
        </Suspense>
      </div>
    </div>
  )
}

function AnalyticsDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mt-2 animate-pulse"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>

      <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
  )
}
