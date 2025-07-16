
import { Suspense } from 'react'
import { Metadata } from 'next'
import WeSellCustomers from '@/components/wesell/customers/customers-dashboard'

export const metadata: Metadata = {
  title: 'Kunden - weSell | WeGroup Platform',
  description: 'Intelligentes Kundenmanagement mit KI-gestützter Analyse, Predictive Analytics und 360-Grad-Kundensicht.',
}

export default function WeSellCustomersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<CustomersSkeleton />}>
          <WeSellCustomers />
        </Suspense>
      </div>
    </div>
  )
}

function CustomersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg">
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
