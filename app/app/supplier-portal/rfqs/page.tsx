
import { Metadata } from 'next';
import { SupplierRFQInterface } from '@/components/portals/supplier-rfq-interface';

export const metadata: Metadata = {
  title: 'Verfügbare RFQs - Supplier Portal',
  description: 'Entdecken Sie neue Geschäftsmöglichkeiten',
};

export default function SupplierRFQsPage() {
  return <SupplierRFQInterface />;
}
