
// WeGroup Platform - Sprint 4: AI Decision Trees Management
// AI decision logs, approval workflows, decision rule management, and analytics

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AIDecisionsComponent from './ai-decisions-component'

export const dynamic = "force-dynamic"

export default async function AIDecisionsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Decisions</h1>
          <p className="text-gray-600 mt-2">
            AI decision logs, approval workflows, rule management, and decision analytics
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading decision analytics...</div>}>
        <AIDecisionsComponent />
      </Suspense>
    </div>
  )
}
