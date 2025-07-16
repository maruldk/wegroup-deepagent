
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { EnhancedLogisticsDashboard } from '@/components/logistics/enhanced-logistics-dashboard';

export const metadata: Metadata = {
  title: 'Logistics Management - WeGroup Platform',
  description: 'KI-gestützte Lieferketten-Optimierung mit 88% Autonomie - Route-Optimierung, Inventar-Management und Predictive Maintenance',
};

export default function LogisticsPage() {
  return (
    <DashboardLayout>
      <EnhancedLogisticsDashboard />
    </DashboardLayout>
  );
}
