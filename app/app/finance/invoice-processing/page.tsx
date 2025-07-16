
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { InvoiceProcessingDashboard } from '@/components/finance/invoice-processing-dashboard';

export const metadata: Metadata = {
  title: 'Invoice Processing - Phase 5 KI-Erfassung',
  description: 'KI-gestützte Rechnungsverarbeitung mit OCR, Confidence-Scoring und automatischer Validierung',
};

export default function InvoiceProcessingPage() {
  return (
    <DashboardLayout>
      <InvoiceProcessingDashboard />
    </DashboardLayout>
  );
}
