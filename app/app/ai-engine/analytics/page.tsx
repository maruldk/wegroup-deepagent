
// WeGroup Platform - Sprint 4: AI Analytics Dashboard
// AI performance analytics, model metrics, usage insights, and ROI analysis

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AIAnalyticsComponent from './ai-analytics-component'

export const dynamic = "force-dynamic"

export default async function AIAnalyticsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Analytics</h1>
          <p className="text-gray-600 mt-2">
            AI performance analytics, model metrics, usage insights, and ROI analysis
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading AI analytics...</div>}>
        <AIAnalyticsComponent />
      </Suspense>
    </div>
  )
}
