
import { Metadata } from 'next';
import { InnovationIntelligencePortal } from '@/components/sprint8/innovation-intelligence-portal';

export const metadata: Metadata = {
  title: 'Innovation Intelligence Portal | WeGroup Platform',
  description: 'AI-Generated Business Models & Market Opportunity Discovery Engine',
};

export const dynamic = "force-dynamic";

export default function InnovationPage() {
  return <InnovationIntelligencePortal />;
}
