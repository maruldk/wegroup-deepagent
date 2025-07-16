
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Enterprise3PLMasterDashboard from '@/components/enterprise-3pl/master-dashboard';

export const dynamic = 'force-dynamic';

export default async function Enterprise3PLPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const tenantId = session.user.tenantId || 'default-tenant';

  return (
    <div className="min-h-screen">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Lade Enterprise 3PL Dashboard...</div>
        </div>
      }>
        <Enterprise3PLMasterDashboard tenantId={tenantId} />
      </Suspense>
    </div>
  );
}
