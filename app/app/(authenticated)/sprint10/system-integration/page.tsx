
import { Suspense } from 'react';
import FinalSystemIntegrationHub from '@/components/sprint10/final-system-integration-hub';

export const metadata = {
  title: 'Final System Integration Hub - Sprint 10',
  description: 'Cross-Module Orchestration & Event-Driven Architecture',
};

export default function SystemIntegrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-400"></div>
        </div>
      }>
        <FinalSystemIntegrationHub />
      </Suspense>
    </div>
  );
}
