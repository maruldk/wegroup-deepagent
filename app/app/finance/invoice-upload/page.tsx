
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { InvoiceUploadInterface } from '@/components/finance/invoice-upload-interface';

export const metadata: Metadata = {
  title: 'Invoice Upload - KI-Erfassung',
  description: 'Drag & Drop Upload mit Real-time OCR-Preview und Confidence-Indicators',
};

export default function InvoiceUploadPage() {
  return (
    <DashboardLayout>
      <InvoiceUploadInterface />
    </DashboardLayout>
  );
}
