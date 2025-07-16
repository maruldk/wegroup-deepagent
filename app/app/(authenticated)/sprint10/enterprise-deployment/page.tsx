
import { Suspense } from 'react';
import EnterpriseDeploymentManager from '@/components/sprint10/enterprise-deployment-manager';

export const metadata = {
  title: 'Enterprise Deployment Manager - Sprint 10',
  description: 'Multi-Region Production Deployment Management',
};

export default function EnterpriseDeploymentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400"></div>
        </div>
      }>
        <EnterpriseDeploymentManager />
      </Suspense>
    </div>
  );
}
