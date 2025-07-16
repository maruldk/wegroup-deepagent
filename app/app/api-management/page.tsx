
// WeGroup Platform - Sprint 4: API Management Dashboard
// RESTful API Management and Analytics

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import APIManagementDashboard from '../../components/api-management/api-management-dashboard'

export const dynamic = "force-dynamic"

export default async function APIManagementPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Management</h1>
          <p className="text-gray-600 mt-2">
            Manage RESTful APIs, webhooks, and integration analytics
          </p>
        </div>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg" />
          ))}
        </div>
      }>
        <APIManagementDashboard />
      </Suspense>
    </div>
  )
}
