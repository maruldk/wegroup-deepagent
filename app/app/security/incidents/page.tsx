
// WeGroup Platform - Sprint 4: Security Incident Management
// Security incident tracking, response coordination, threat analysis, and resolution workflows

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SecurityIncidentsComponent from './security-incidents-component'

export const dynamic = "force-dynamic"

export default async function SecurityIncidentsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Incidents</h1>
          <p className="text-gray-600 mt-2">
            Security incident tracking, response coordination, threat analysis, and resolution workflows
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading security incidents...</div>}>
        <SecurityIncidentsComponent />
      </Suspense>
    </div>
  )
}
