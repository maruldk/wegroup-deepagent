
import { Metadata } from 'next';
import { CustomerPortalLayout } from '@/components/portals/customer-portal-layout';

export const metadata: Metadata = {
  title: 'Customer Portal - WeGroup Universal Services',
  description: 'Zentrale Anlaufstelle für alle Ihre Service-Anfragen und Bestellungen',
};

export default function CustomerPortalLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomerPortalLayout>
      {children}
    </CustomerPortalLayout>
  );
}
