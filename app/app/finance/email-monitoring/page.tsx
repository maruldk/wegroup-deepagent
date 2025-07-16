
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { EmailMonitoringDashboard } from '@/components/finance/email-monitoring-dashboard';

export const metadata: Metadata = {
  title: 'E-Mail-Monitoring - Live Dashboard',
  description: 'Echtzeit-Überwachung der E-Mail-Rechnungsverarbeitung mit KI-Analytics',
};

export default function EmailMonitoringPage() {
  return (
    <DashboardLayout>
      <EmailMonitoringDashboard />
    </DashboardLayout>
  );
}
