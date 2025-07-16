
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { UniversalServicesDashboard } from '@/components/services/universal-services-dashboard';

export const metadata: Metadata = {
  title: 'Universal Services Management - WeGroup Platform',
  description: 'KI-gestütztes Service-Management für alle Geschäftsbereiche - Von IT bis Marketing, HR bis Consulting',
};

export default function ServicesPage() {
  return (
    <DashboardLayout>
      <UniversalServicesDashboard />
    </DashboardLayout>
  );
}
