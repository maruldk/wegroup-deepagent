
import { Metadata } from 'next';
import { SupplierQuoteInterface } from '@/components/portals/supplier-quote-interface';

export const metadata: Metadata = {
  title: 'Meine Angebote - Supplier Portal',
  description: 'Verwalten Sie Ihre abgegebenen Angebote',
};

export default function SupplierQuotesPage() {
  return <SupplierQuoteInterface />;
}
