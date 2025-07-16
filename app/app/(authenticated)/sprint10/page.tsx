
import { Suspense } from 'react';
import Sprint10MasterDashboard from '@/components/sprint10/sprint10-master-dashboard';

export const metadata = {
  title: 'Sprint 10 - WeGroup DeepAgent Platform',
  description: 'Final Sprint: 99.9%+ AI Autonomy & Enterprise Production Ready',
};

export default function Sprint10Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400"></div>
        </div>
      }>
        <Sprint10MasterDashboard />
      </Suspense>
    </div>
  );
}
