
import { Metadata } from 'next';
import { CustomerPortalDashboard } from '@/components/portals/customer-portal-dashboard';

export const metadata: Metadata = {
  title: 'Dashboard - Customer Portal',
  description: 'Überblick über Ihre Service-Anfragen, Angebote und Bestellungen',
};

export default function CustomerPortalPage() {
  return <CustomerPortalDashboard />;
}
