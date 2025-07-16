
// WeGroup Platform - Sprint 4: Security Audit Dashboard
// Security audit logs, user activity tracking, access monitoring, and compliance reporting

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SecurityAuditComponent from './security-audit-component'

export const dynamic = "force-dynamic"

export default async function SecurityAuditPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Audit</h1>
          <p className="text-gray-600 mt-2">
            Security audit logs, user activity tracking, access monitoring, and compliance reporting
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading security audit...</div>}>
        <SecurityAuditComponent />
      </Suspense>
    </div>
  )
}
