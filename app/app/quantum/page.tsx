
import { Metadata } from 'next';
import { QuantumCommandCenter } from '@/components/sprint8/quantum-command-center';

export const metadata: Metadata = {
  title: 'Quantum Command Center | WeGroup Platform',
  description: 'Real-time Quantum Computing Operations & Performance Monitoring',
};

export const dynamic = "force-dynamic";

export default function QuantumPage() {
  return <QuantumCommandCenter />;
}
