
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { UniversalRequestManagement } from '@/components/services/universal-request-management';

export const metadata: Metadata = {
  title: 'Service Requests Management - WeGroup Platform',
  description: 'Verwalten Sie alle eingehenden Service-Anfragen zentral und effizient',
};

export default function ServiceRequestsPage() {
  return (
    <DashboardLayout>
      <UniversalRequestManagement />
    </DashboardLayout>
  );
}
