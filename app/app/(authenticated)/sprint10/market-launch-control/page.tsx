
import { Suspense } from 'react';
import MarketLaunchControlCenter from '@/components/sprint10/market-launch-control-center';

export const metadata = {
  title: 'Market Launch Control Center - Sprint 10',
  description: 'Beta Testing, Revenue Analytics & Partner Ecosystem',
};

export default function MarketLaunchControlPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400"></div>
        </div>
      }>
        <MarketLaunchControlCenter />
      </Suspense>
    </div>
  );
}
