

// WeGroup Platform - Sprint 4: API Analytics & Insights
// Detailed analytics, usage patterns, and performance metrics for APIs

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import APIAnalyticsComponent from './api-analytics-component'

export const dynamic = "force-dynamic"

export default async function APIAnalyticsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Analytics</h1>
          <p className="text-gray-600 mt-2">
            Detailed analytics, usage patterns, and performance insights for all API endpoints
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading analytics...</div>}>
        <APIAnalyticsComponent />
      </Suspense>
    </div>
  )
}
