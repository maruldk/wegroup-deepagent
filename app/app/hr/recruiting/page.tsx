
import { Metadata } from 'next';
import { RecruitingDashboard } from '@/components/hr/recruiting-dashboard';

export const metadata: Metadata = {
  title: 'KI-Recruiting - WeGroup Platform',
  description: 'Intelligente Kandidatenanalyse und automatisierte Recruiting-Prozesse mit 94% Genauigkeit',
};

export default function RecruitingPage() {
  return <RecruitingDashboard />;
}
