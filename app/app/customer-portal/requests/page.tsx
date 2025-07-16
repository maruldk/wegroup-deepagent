
import { Metadata } from 'next';
import { CustomerRequestInterface } from '@/components/portals/customer-request-interface';

export const metadata: Metadata = {
  title: 'Meine Anfragen - Customer Portal',
  description: 'Verwalten Sie Ihre Service-Anfragen und verfolgen Sie den Fortschritt',
};

export default function CustomerRequestsPage() {
  return <CustomerRequestInterface />;
}
