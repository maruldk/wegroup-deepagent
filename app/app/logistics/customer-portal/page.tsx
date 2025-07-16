
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { CustomerPortalDashboard } from '@/components/logistics/customer-portal-dashboard';

export const metadata: Metadata = {
  title: 'Customer Portal - WeGroup Platform',
  description: 'Customer portal for transport requests, tracking, and logistics management',
};

export default function CustomerPortalPage() {
  return (
    <DashboardLayout>
      <CustomerPortalDashboard />
    </DashboardLayout>
  );
}
