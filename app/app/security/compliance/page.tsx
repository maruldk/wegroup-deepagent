
// WeGroup Platform - Sprint 4: Compliance Dashboard
// GDPR, SOX, ISO compliance monitoring, policy adherence, and regulatory reporting

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import ComplianceDashboardComponent from './compliance-dashboard-component'

export const dynamic = "force-dynamic"

export default async function ComplianceDashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance Dashboard</h1>
          <p className="text-gray-600 mt-2">
            GDPR, SOX, ISO compliance monitoring, policy adherence, and regulatory reporting
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading compliance dashboard...</div>}>
        <ComplianceDashboardComponent />
      </Suspense>
    </div>
  )
}
