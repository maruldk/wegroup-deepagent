
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { UnifiedDashboard } from '@/components/integration/unified-dashboard';

export const metadata: Metadata = {
  title: 'Enterprise AI Dashboard - WeGroup Platform',
  description: 'Unified Business Intelligence mit 89.7% KI-Autonomie - Cross-Module Analytics und Executive Overview',
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <UnifiedDashboard />
    </DashboardLayout>
  );
}
