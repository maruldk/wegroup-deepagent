
import { Metadata } from 'next';
import { SupplierPortalLayout } from '@/components/portals/supplier-portal-layout';

export const metadata: Metadata = {
  title: 'Supplier Portal - WeGroup Universal Services',
  description: 'Ihr zentraler Zugang zu neuen Geschäftsmöglichkeiten',
};

export default function SupplierPortalLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupplierPortalLayout>
      {children}
    </SupplierPortalLayout>
  );
}
