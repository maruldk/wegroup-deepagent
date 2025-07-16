

// WeGroup Platform - Sprint 4: API Endpoints Management
// Manage REST API endpoints, configurations, and permissions

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import APIEndpointsComponent from './api-endpoints-component'

export const dynamic = "force-dynamic"

export default async function APIEndpointsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Endpoints</h1>
          <p className="text-gray-600 mt-2">
            Manage REST API endpoints, configurations, rate limits, and permissions
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading endpoints...</div>}>
        <APIEndpointsComponent />
      </Suspense>
    </div>
  )
}
