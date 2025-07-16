
import { Metadata } from 'next';
import { CustomerQuoteInterface } from '@/components/portals/customer-quote-interface';

export const metadata: Metadata = {
  title: 'Meine Angebote - Customer Portal',
  description: 'Überprüfen und vergleichen Sie eingegangene Angebote',
};

export default function CustomerQuotesPage() {
  return <CustomerQuoteInterface />;
}
