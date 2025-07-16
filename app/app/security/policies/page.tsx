
// WeGroup Platform - Sprint 4: Security Policies Management
// Security policy configuration, access controls, password policies, and compliance rules

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SecurityPoliciesComponent from './security-policies-component'

export const dynamic = "force-dynamic"

export default async function SecurityPoliciesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Policies</h1>
          <p className="text-gray-600 mt-2">
            Security policy configuration, access controls, password policies, and compliance rules
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading security policies...</div>}>
        <SecurityPoliciesComponent />
      </Suspense>
    </div>
  )
}
