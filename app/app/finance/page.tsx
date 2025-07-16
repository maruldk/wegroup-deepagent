
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { EnhancedFinanceDashboard } from '@/components/finance/enhanced-finance-dashboard';

export const metadata: Metadata = {
  title: 'Finance Management - WeGroup Platform',
  description: 'KI-gestützte Finanzanalyse mit 92% Autonomie - Dokumentenverarbeitung, Forecasting und Risikobewertung',
};

export default function FinancePage() {
  return (
    <DashboardLayout>
      <EnhancedFinanceDashboard />
    </DashboardLayout>
  );
}
