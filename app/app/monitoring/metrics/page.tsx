
// WeGroup Platform - Sprint 4: System Metrics Dashboard
// Real-time system metrics, resource utilization, and infrastructure monitoring

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SystemMetricsComponent from './system-metrics-component'

export const dynamic = "force-dynamic"

export default async function SystemMetricsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Metrics</h1>
          <p className="text-gray-600 mt-2">
            Real-time system metrics, resource utilization, and infrastructure monitoring
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading system metrics...</div>}>
        <SystemMetricsComponent />
      </Suspense>
    </div>
  )
}
