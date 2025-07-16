

// WeGroup Platform - Sprint 4: Webhooks Management 
// Configure and manage webhook integrations and event listeners

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import WebhooksComponent from './webhooks-component'

export const dynamic = "force-dynamic"

export default async function WebhooksPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Webhooks</h1>
          <p className="text-gray-600 mt-2">
            Configure webhook integrations, event listeners, and real-time notifications
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading webhooks...</div>}>
        <WebhooksComponent />
      </Suspense>
    </div>
  )
}
