
import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TenantManagementDashboard } from '@/components/tenant-management/tenant-management-dashboard';

export const metadata: Metadata = {
  title: 'Mandantenverwaltung | WeGroup Platform',
  description: 'Intelligentes Mandantenmanagement mit KI-Orchestrierung und erweiterten Analytics',
};

export default async function MandantenPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <TenantManagementDashboard />
      </div>
    </div>
  );
}
