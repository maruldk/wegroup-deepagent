
// WeGroup Platform - Sprint 4: Multi-Tenant Management
// Enterprise tenant management, resource allocation, configuration, and monitoring

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import TenantManagementComponent from './tenant-management-component'

export const dynamic = "force-dynamic"

export default async function TenantManagementPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tenant Management</h1>
          <p className="text-gray-600 mt-2">
            Enterprise tenant management, resource allocation, configuration, and monitoring
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading tenant management...</div>}>
        <TenantManagementComponent />
      </Suspense>
    </div>
  )
}
