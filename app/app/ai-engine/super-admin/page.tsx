
// WeGroup Platform - Super Admin Control Panel
// Advanced AI Model Administration Controls

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SuperAdminPanel from '../../../components/ai-engine/super-admin-panel'

export const dynamic = "force-dynamic"

export default async function SuperAdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  // In a real application, you'd check for super admin permissions here
  // For demo purposes, we'll allow access

  return (
    <div className="space-y-6">
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg" />
          ))}
        </div>
      }>
        <SuperAdminPanel />
      </Suspense>
    </div>
  )
}
