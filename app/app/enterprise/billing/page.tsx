
// WeGroup Platform - Sprint 4: Enterprise Billing & Usage
// Billing management, usage analytics, cost optimization, and payment processing

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import BillingManagementComponent from './billing-management-component'

export const dynamic = "force-dynamic"

export default async function BillingManagementPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Usage</h1>
          <p className="text-gray-600 mt-2">
            Billing management, usage analytics, cost optimization, and payment processing
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading billing management...</div>}>
        <BillingManagementComponent />
      </Suspense>
    </div>
  )
}
