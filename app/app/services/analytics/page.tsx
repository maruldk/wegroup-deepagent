
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { UniversalServicesAnalytics } from '@/components/services/universal-services-analytics';

export const metadata: Metadata = {
  title: 'Services Analytics - WeGroup Platform',
  description: 'Umfassende Analysen und KPIs für Ihr Service-Management',
};

export default function ServiceAnalyticsPage() {
  return (
    <DashboardLayout>
      <UniversalServicesAnalytics />
    </DashboardLayout>
  );
}
