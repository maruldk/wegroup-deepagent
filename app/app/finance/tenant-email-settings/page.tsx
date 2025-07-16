
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { TenantEmailSettingsInterface } from '@/components/finance/tenant-email-settings-interface';

export const metadata: Metadata = {
  title: 'Mandanten-E-Mail-Einstellungen - Konfiguration',
  description: 'Erweiterte E-Mail-Einstellungen und Konfiguration für Multi-Mandant-Integration',
};

export default function TenantEmailSettingsPage() {
  return (
    <DashboardLayout>
      <TenantEmailSettingsInterface />
    </DashboardLayout>
  );
}
