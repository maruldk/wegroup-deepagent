
// WeGroup Platform - Sprint 4: AI Engine Dashboard
// Central AI Orchestration and Management

import { Suspense } from 'react'
import { Metadata } from 'next';
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import EnhancedAIEngineDashboard from '../../components/ai-engine/enhanced-ai-engine-dashboard'

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: 'AI Engine - WeGroup Platform',
  description: 'Central AI orchestration and intelligent decision making with 89.7% automation',
};

export default async function AIEnginePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Engine</h1>
            <p className="text-gray-600 mt-2">
              Central AI orchestration and intelligent decision making for 89.7% automation
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
          <EnhancedAIEngineDashboard />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
