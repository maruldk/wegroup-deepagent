
import { Metadata } from 'next';
import { CustomerOrderInterface } from '@/components/portals/customer-order-interface';

export const metadata: Metadata = {
  title: 'Meine Bestellungen - Customer Portal',
  description: 'Verfolgen Sie Ihre aktiven Bestellungen und Services',
};

export default function CustomerOrdersPage() {
  return <CustomerOrderInterface />;
}
