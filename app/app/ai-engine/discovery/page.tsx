
// WeGroup Platform - AI Model Discovery Page
// Intelligent Model Research Interface

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import ModelDiscoveryInterface from '../../../components/ai-engine/model-discovery-interface'

export const dynamic = "force-dynamic"

export default async function ModelDiscoveryPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      }>
        <ModelDiscoveryInterface />
      </Suspense>
    </div>
  )
}
