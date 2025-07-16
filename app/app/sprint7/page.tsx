
// WeGroup Platform - Sprint 7: Market Readiness & Advanced Integration
// Executive Command Center - 95% KI-Autonomie Dashboard

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ExecutiveCommandCenter from '@/components/sprint7/executive-command-center'

export const metadata = {
  title: 'Sprint 7 - Executive Command Center | WeGroup Platform',
  description: 'Market Readiness & Advanced Integration - 95% KI-Autonomie Dashboard'
}

export default async function Sprint7Page() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <ExecutiveCommandCenter />
    </div>
  )
}
