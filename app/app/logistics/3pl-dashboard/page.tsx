
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ThreePLMasterDashboard } from '@/components/logistics/threpl-master-dashboard';

export const metadata: Metadata = {
  title: '3PL Master Dashboard - WeGroup Platform',
  description: 'Complete 3PL logistics management and orchestration for Wetzlar Industry Solutions and WFS Fulfillment Solutions',
};

export default function ThreePLDashboardPage() {
  return (
    <DashboardLayout>
      <ThreePLMasterDashboard />
    </DashboardLayout>
  );
}
