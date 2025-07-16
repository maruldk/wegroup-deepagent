
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { UniversalSupplierDirectory } from '@/components/services/universal-supplier-directory';

export const metadata: Metadata = {
  title: 'Supplier Directory - WeGroup Platform',
  description: 'Umfassendes Verzeichnis aller Service-Lieferanten und -Partner',
};

export default function ServiceSuppliersPage() {
  return (
    <DashboardLayout>
      <UniversalSupplierDirectory />
    </DashboardLayout>
  );
}
