
import { Metadata } from 'next';
import { NewServiceRequestForm } from '@/components/portals/new-service-request-form';

export const metadata: Metadata = {
  title: 'Neue Service-Anfrage - Customer Portal',
  description: 'Erstellen Sie eine neue Service-Anfrage',
};

export default function NewRequestPage() {
  return <NewServiceRequestForm />;
}
