import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { UnifiedDashboard } from '@/components/integration/unified-dashboard';

export const metadata: Metadata = {
  title: 'WeGroup Platform - Enterprise AI Dashboard',
  description: 'KI-gestützte 3PL/Fulfillment-Plattform mit 89.7% Autonomie',
};

export default function HomePage() {
  return (
    <DashboardLayout>
      <UnifiedDashboard />
    </DashboardLayout>
  );
}
