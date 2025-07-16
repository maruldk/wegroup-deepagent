
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { InvoiceReviewInterface } from '@/components/finance/invoice-review-interface';

export const metadata: Metadata = {
  title: 'Invoice Review - Überprüfung',
  description: 'Manuelle Überprüfung und Validierung von OCR-Ergebnissen',
};

export default function InvoiceReviewPage() {
  return (
    <DashboardLayout>
      <InvoiceReviewInterface />
    </DashboardLayout>
  );
}
