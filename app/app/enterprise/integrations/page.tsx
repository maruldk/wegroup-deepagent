
// WeGroup Platform - Sprint 4: Enterprise Integrations
// API connectors, webhooks, data synchronization, and third-party system integrations

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import EnterpriseIntegrationsComponent from './enterprise-integrations-component'

export const dynamic = "force-dynamic"

export default async function EnterpriseIntegrationsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Integrations</h1>
          <p className="text-gray-600 mt-2">
            API connectors, webhooks, data synchronization, and third-party system integrations
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading enterprise integrations...</div>}>
        <EnterpriseIntegrationsComponent />
      </Suspense>
    </div>
  )
}
