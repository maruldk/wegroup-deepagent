
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PermissionManagementDashboard } from '@/components/user-management/permission-management-dashboard';

export const dynamic = "force-dynamic";

export default async function PermissionManagementPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <DashboardLayout>
      <PermissionManagementDashboard />
    </DashboardLayout>
  );
}
