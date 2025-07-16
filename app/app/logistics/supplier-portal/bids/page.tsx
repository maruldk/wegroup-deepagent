
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SupplierBidManager } from '@/components/logistics/supplier-bid-manager';

export const metadata: Metadata = {
  title: 'Bid Manager - WeGroup Platform',
  description: 'Manage your tender bids and submissions with AI-powered optimization',
};

export default function SupplierBidsPage() {
  return (
    <DashboardLayout>
      <SupplierBidManager />
    </DashboardLayout>
  );
}
