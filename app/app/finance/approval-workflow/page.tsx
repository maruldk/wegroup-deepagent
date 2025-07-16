
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ApprovalWorkflowInterface } from '@/components/finance/approval-workflow-interface';

export const metadata: Metadata = {
  title: 'Approval Workflow - Freigabe-Prozess',
  description: 'Mehrstufiger Freigabeprozess mit automatischer Workflow-Bestimmung',
};

export default function ApprovalWorkflowPage() {
  return (
    <DashboardLayout>
      <ApprovalWorkflowInterface />
    </DashboardLayout>
  );
}
