
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ThreeWayMatchingInterface } from '@/components/finance/three-way-matching-interface';

export const metadata: Metadata = {
  title: 'Three-Way Matching - Drei-Wege-Abgleich',
  description: 'Automatischer Abgleich von Bestellung, Wareneingang und Rechnung',
};

export default function ThreeWayMatchingPage() {
  return (
    <DashboardLayout>
      <ThreeWayMatchingInterface />
    </DashboardLayout>
  );
}
