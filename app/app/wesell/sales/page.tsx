
import { Suspense } from 'react'
import { Metadata } from 'next'
import WeSellSales from '@/components/wesell/sales/sales-dashboard'

export const metadata: Metadata = {
  title: 'Vertrieb - weSell | WeGroup Platform',
  description: 'Intelligente Sales Pipeline mit KI-gestützten Opportunities, automatisierter Angebotserstellung und Forecasting.',
}

export default function WeSellSalesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<SalesSkeleton />}>
          <WeSellSales />
        </Suspense>
      </div>
    </div>
  )
}

function SalesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-48 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="bg-white rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
