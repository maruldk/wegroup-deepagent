
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { MobileApprovalInterface } from '@/components/finance/mobile-approval-interface';

export const metadata: Metadata = {
  title: 'Mobile Approval - Mobile Freigabe',
  description: 'Mobile-optimierte Rechnungsfreigabe mit Push-Notifications',
};

export default function MobileApprovalPage() {
  return (
    <DashboardLayout>
      <MobileApprovalInterface />
    </DashboardLayout>
  );
}
