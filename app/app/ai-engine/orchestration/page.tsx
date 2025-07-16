
// WeGroup Platform - Sprint 4: AI Orchestration Management
// Cross-module AI orchestration, workflow automation, and decision coordination

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AIOrchestrationComponent from './ai-orchestration-component'

export const dynamic = "force-dynamic"

export default async function AIOrchestrationPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Orchestration</h1>
          <p className="text-gray-600 mt-2">
            Cross-module AI orchestration, workflow automation, and intelligent decision coordination
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading orchestration workflows...</div>}>
        <AIOrchestrationComponent />
      </Suspense>
    </div>
  )
}
