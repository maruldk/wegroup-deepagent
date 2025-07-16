
import { Metadata } from 'next';
import { GlobalEcosystemDashboard } from '@/components/sprint8/global-ecosystem-dashboard';

export const metadata: Metadata = {
  title: 'Global Ecosystem Platform | WeGroup Platform',
  description: 'Cross-Company Collaboration Hub & Partner Network Intelligence',
};

export const dynamic = "force-dynamic";

export default function EcosystemPage() {
  return <GlobalEcosystemDashboard />;
}
