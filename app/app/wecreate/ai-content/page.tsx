
import { Suspense } from 'react'
import { Metadata } from 'next'
import AIContentGenerator from '@/components/wecreate/ai-content/ai-content-generator'

export const metadata: Metadata = {
  title: 'KI-Content Generator - weCreate | WeGroup Platform',
  description: 'Generieren Sie hochwertige Inhalte mit fortschrittlicher KI-Technologie. Text, Bilder, Videos und mehr.',
}

export default function AIContentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<AIContentSkeleton />}>
          <AIContentGenerator />
        </Suspense>
      </div>
    </div>
  )
}

function AIContentSkeleton() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-32 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  )
}
