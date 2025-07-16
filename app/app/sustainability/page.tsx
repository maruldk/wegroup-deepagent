
import { Metadata } from 'next';
import { SustainabilityControlCenter } from '@/components/sprint8/sustainability-control-center';

export const metadata: Metadata = {
  title: 'Sustainability Control Center | WeGroup Platform',
  description: 'Real-time ESG Compliance & Environmental Impact Optimization',
};

export const dynamic = "force-dynamic";

export default function SustainabilityPage() {
  return <SustainabilityControlCenter />;
}
