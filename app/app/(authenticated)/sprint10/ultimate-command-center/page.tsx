
import { Suspense } from 'react';
import UltimateCommandCenter from '@/components/sprint10/ultimate-command-center';

export const metadata = {
  title: 'Ultimate Command Center - Sprint 10',
  description: '99.9%+ AI Autonomy Control Center',
};

export default function UltimateCommandCenterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400"></div>
        </div>
      }>
        <UltimateCommandCenter />
      </Suspense>
    </div>
  );
}
