
// WeGroup Platform - Sprint 4: Enterprise Dashboard
// Multi-Language, White-Label, and Integration Management

import { Suspense } from 'react'
import { Metadata } from 'next';
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import EnterpriseDashboard from '../../components/enterprise/enterprise-dashboard'

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: 'Enterprise Features - WeGroup Platform',
  description: 'Multi-language support, white-label customization, and enterprise integrations',
};

export default async function EnterprisePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enterprise Features</h1>
            <p className="text-gray-600 mt-2">
              Multi-language support, white-label customization, and enterprise integrations
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
          <EnterpriseDashboard />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
