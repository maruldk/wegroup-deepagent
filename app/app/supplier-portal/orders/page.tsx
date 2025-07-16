
import { Metadata } from 'next';
import { SupplierOrderInterface } from '@/components/portals/supplier-order-interface';

export const metadata: Metadata = {
  title: 'Meine Aufträge - Supplier Portal',
  description: 'Verwalten Sie Ihre aktiven Aufträge und Projekte',
};

export default function SupplierOrdersPage() {
  return <SupplierOrderInterface />;
}
