
// WeGroup Platform - Sprint 4: Security Dashboard
// Security Monitoring and Compliance Management

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SecurityDashboard from '../../components/security/security-dashboard'

export const dynamic = "force-dynamic"

export default async function SecurityPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security & Compliance</h1>
          <p className="text-gray-600 mt-2">
            Security monitoring, audit logs, and GDPR compliance management
          </p>
        </div>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg" />
          ))}
        </div>
      }>
        <SecurityDashboard />
      </Suspense>
    </div>
  )
}
