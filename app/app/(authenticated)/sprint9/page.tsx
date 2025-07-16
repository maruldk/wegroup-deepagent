
import { Metadata } from 'next';
import AGIMasterDashboard from '@/components/sprint9/agi-master-dashboard';

export const metadata: Metadata = {
  title: 'Sprint 9: AGI Singularity Platform | WeGroup',
  description: 'Advanced General Intelligence platform achieving autonomous business operations at cosmic scale',
};

export default function Sprint9Page() {
  return <AGIMasterDashboard />;
}
