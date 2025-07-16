
import { Metadata } from 'next';
import { SupplierPortalDashboard } from '@/components/portals/supplier-portal-dashboard';

export const metadata: Metadata = {
  title: 'Dashboard - Supplier Portal',
  description: 'Überblick über Ihre RFQs, Angebote und Performance',
};

export default function SupplierPortalPage() {
  return <SupplierPortalDashboard />;
}
