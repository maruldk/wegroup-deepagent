
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { EnhancedHRDashboard } from '@/components/hr/enhanced-hr-dashboard';

export const metadata: Metadata = {
  title: 'HR Management - WeGroup Platform',
  description: 'KI-gestütztes Personalwesen mit 90% Autonomie - Recruiting, Performance Analytics und Workforce Intelligence',
};

export default function HRPage() {
  return (
    <DashboardLayout>
      <EnhancedHRDashboard />
    </DashboardLayout>
  );
}
