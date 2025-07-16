
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { EmailConfigurationInterface } from '@/components/finance/email-configuration-interface';

export const metadata: Metadata = {
  title: 'E-Mail-Konfiguration - Multi-Mandant Integration',
  description: 'Konfiguration der E-Mail-Integration für automatische Rechnungsverarbeitung pro Mandant',
};

export default function EmailConfigurationPage() {
  return (
    <DashboardLayout>
      <EmailConfigurationInterface />
    </DashboardLayout>
  );
}
