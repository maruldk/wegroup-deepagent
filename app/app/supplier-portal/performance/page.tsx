
import { Metadata } from 'next';
import { SupplierPerformanceInterface } from '@/components/portals/supplier-performance-interface';

export const metadata: Metadata = {
  title: 'Meine Performance - Supplier Portal',
  description: 'Verfolgen Sie Ihre Leistungskennzahlen und Bewertungen',
};

export default function SupplierPerformancePage() {
  return <SupplierPerformanceInterface />;
}
