
// WeGroup Platform - Sprint 4: Alert Management
// Alert configuration, notification rules, escalation policies, and incident tracking

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AlertManagementComponent from './alert-management-component'

export const dynamic = "force-dynamic"

export default async function AlertManagementPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alert Management</h1>
          <p className="text-gray-600 mt-2">
            Alert configuration, notification rules, escalation policies, and incident tracking
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading alert management...</div>}>
        <AlertManagementComponent />
      </Suspense>
    </div>
  )
}
