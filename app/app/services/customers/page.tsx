
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { UniversalCustomerManagement } from '@/components/services/universal-customer-management';

export const metadata: Metadata = {
  title: 'Customer Management - WeGroup Platform',
  description: 'Verwalten Sie alle Service-Kunden und deren Anforderungen',
};

export default function ServiceCustomersPage() {
  return (
    <DashboardLayout>
      <UniversalCustomerManagement />
    </DashboardLayout>
  );
}
