
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { UniversalOrderManagement } from '@/components/services/universal-order-management';

export const metadata: Metadata = {
  title: 'Order Management - WeGroup Platform',
  description: 'Verwalten Sie alle Service-Bestellungen und Projektfortschritte',
};

export default function ServiceOrdersPage() {
  return (
    <DashboardLayout>
      <UniversalOrderManagement />
    </DashboardLayout>
  );
}
