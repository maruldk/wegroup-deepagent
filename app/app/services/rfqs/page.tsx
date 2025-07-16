
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { UniversalRFQManagement } from '@/components/services/universal-rfq-management';

export const metadata: Metadata = {
  title: 'RFQ Management - WeGroup Platform',
  description: 'Erstellen und verwalten Sie RFQs für alle Service-Kategorien',
};

export default function ServiceRFQsPage() {
  return (
    <DashboardLayout>
      <UniversalRFQManagement />
    </DashboardLayout>
  );
}
