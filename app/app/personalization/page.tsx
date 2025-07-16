
import { Metadata } from 'next';
import { HyperPersonalizationConsole } from '@/components/sprint8/hyper-personalization-console';

export const metadata: Metadata = {
  title: 'Hyper-Personalization Console | WeGroup Platform',
  description: 'Neural Customer Profiles & Predictive Journey Optimization',
};

export const dynamic = "force-dynamic";

export default function PersonalizationPage() {
  return <HyperPersonalizationConsole />;
}
