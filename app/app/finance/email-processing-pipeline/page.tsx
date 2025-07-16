
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { EmailProcessingInterface } from '@/components/finance/email-processing-interface';

export const metadata: Metadata = {
  title: 'E-Mail-Verarbeitungspipeline - KI-Integration',
  description: 'Automatisierte E-Mail-Rechnungsverarbeitung mit KI-gestützter Klassifizierung und OCR',
};

export default function EmailProcessingPipelinePage() {
  return (
    <DashboardLayout>
      <EmailProcessingInterface />
    </DashboardLayout>
  );
}
