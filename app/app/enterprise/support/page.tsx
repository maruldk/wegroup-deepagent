
// WeGroup Platform - Sprint 4: Enterprise Support Dashboard
// Support ticket management, knowledge base, SLA tracking, and customer success metrics

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import EnterpriseSupportComponent from './enterprise-support-component'

export const dynamic = "force-dynamic"

export default async function EnterpriseSupportPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Support</h1>
          <p className="text-gray-600 mt-2">
            Support ticket management, knowledge base, SLA tracking, and customer success metrics
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading enterprise support...</div>}>
        <EnterpriseSupportComponent />
      </Suspense>
    </div>
  )
}
