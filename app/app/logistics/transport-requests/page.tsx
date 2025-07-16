
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { TransportRequestForm } from '@/components/logistics/transport-request-form';

export const metadata: Metadata = {
  title: 'Transport Requests - WeGroup Platform',
  description: 'Create and manage transport requests with AI-powered quote optimization',
};

export default function TransportRequestsPage() {
  return (
    <DashboardLayout>
      <TransportRequestForm />
    </DashboardLayout>
  );
}
