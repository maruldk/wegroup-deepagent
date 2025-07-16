
import { Metadata } from 'next';
import { BudgetingDashboard } from '@/components/finance/budgeting-dashboard';

export const metadata: Metadata = {
  title: 'KI-Budget-Management - WeGroup Platform',
  description: 'Intelligente Budgetplanung und -kontrolle mit 92% Vorhersagegenauigkeit',
};

export default function BudgetingPage() {
  return <BudgetingDashboard />;
}
