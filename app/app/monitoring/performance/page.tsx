
// WeGroup Platform - Sprint 4: Performance Analytics
// Application performance monitoring, response times, throughput, and SLA tracking

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import PerformanceAnalyticsComponent from './performance-analytics-component'

export const dynamic = "force-dynamic"

export default async function PerformanceAnalyticsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600 mt-2">
            Application performance monitoring, response times, throughput, and SLA tracking
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading performance analytics...</div>}>
        <PerformanceAnalyticsComponent />
      </Suspense>
    </div>
  )
}
