
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import RealtimeTrackingDashboard from '@/components/enterprise-3pl/realtime-tracking-dashboard';

export const dynamic = 'force-dynamic';

export default async function TrackingPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const tenantId = session.user.tenantId || 'default-tenant';

  return (
    <div className="min-h-screen">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Lade Echtzeit-Tracking...</div>
        </div>
      }>
        <RealtimeTrackingDashboard tenantId={tenantId} />
      </Suspense>
    </div>
  );
}
