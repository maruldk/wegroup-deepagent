
// WeGroup Platform - Sprint 4: AI Models Management
// Manage AI models, deployments, training status, and performance metrics

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AIModelsComponent from './ai-models-component'

export const dynamic = "force-dynamic"

export default async function AIModelsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Models</h1>
          <p className="text-gray-600 mt-2">
            Manage AI models, deployments, training status, and performance analytics
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading AI models...</div>}>
        <AIModelsComponent />
      </Suspense>
    </div>
  )
}
