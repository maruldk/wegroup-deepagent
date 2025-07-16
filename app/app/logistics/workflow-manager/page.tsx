
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ThreePLWorkflowManager } from '@/components/logistics/threpl-workflow-manager';

export const metadata: Metadata = {
  title: 'Workflow Manager - WeGroup Platform',
  description: 'Manage and monitor automated 3PL workflows with AI-powered orchestration',
};

export default function WorkflowManagerPage() {
  return (
    <DashboardLayout>
      <ThreePLWorkflowManager />
    </DashboardLayout>
  );
}
