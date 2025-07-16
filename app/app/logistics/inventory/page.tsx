
import { Metadata } from 'next';
import { InventoryDashboard } from '@/components/logistics/inventory-dashboard';

export const metadata: Metadata = {
  title: 'KI-Lager-Management - WeGroup Platform',
  description: 'Intelligente Bestandsoptimierung und Inventory Management mit 96% Genauigkeit',
};

export default function InventoryPage() {
  return <InventoryDashboard />;
}
