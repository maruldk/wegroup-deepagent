
import { Suspense } from 'react';
import AutonomousIntelligenceMonitor from '@/components/sprint10/autonomous-intelligence-monitor';

export const metadata = {
  title: 'Autonomous Intelligence Monitor - Sprint 10',
  description: 'AI Learning Analytics & Predictive Intelligence',
};

export default function AutonomousIntelligencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400"></div>
        </div>
      }>
        <AutonomousIntelligenceMonitor />
      </Suspense>
    </div>
  );
}
