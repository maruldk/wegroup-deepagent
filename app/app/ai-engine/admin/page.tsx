
// WeGroup Platform - AI Engine Admin Dashboard
// Complete AI Model Administration Interface

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import ModelRegistryDashboard from '../../../components/ai-engine/model-registry-dashboard'

export const dynamic = "force-dynamic"

export default async function AIEngineAdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg" />
          ))}
        </div>
      }>
        <ModelRegistryDashboard />
      </Suspense>
    </div>
  )
}
