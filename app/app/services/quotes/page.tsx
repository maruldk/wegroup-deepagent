
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { UniversalQuoteComparison } from '@/components/services/universal-quote-comparison';

export const metadata: Metadata = {
  title: 'Quote Comparison - WeGroup Platform',
  description: 'KI-gestützte Angebotsbewertung und -vergleich für optimale Entscheidungen',
};

export default function ServiceQuotesPage() {
  return (
    <DashboardLayout>
      <UniversalQuoteComparison />
    </DashboardLayout>
  );
}
