
import { Metadata } from 'next';
import { ServiceCatalogInterface } from '@/components/portals/service-catalog-interface';

export const metadata: Metadata = {
  title: 'Service-Katalog - Customer Portal',
  description: 'Durchsuchen Sie unser umfassendes Service-Angebot',
};

export default function ServiceCatalogPage() {
  return <ServiceCatalogInterface />;
}
