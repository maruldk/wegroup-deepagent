
import { Suspense } from 'react'
import { Metadata } from 'next'
import WeCreateProjects from '@/components/wecreate/projects/projects-dashboard'

export const metadata: Metadata = {
  title: 'Projekte - weCreate | WeGroup Platform',
  description: 'Verwalten Sie Ihre kreativen Projekte mit KI-Unterstützung, Collaboration-Features und Asset-Management.',
}

export default function WeCreateProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<ProjectsSkeleton />}>
          <WeCreateProjects />
        </Suspense>
      </div>
    </div>
  )
}

function ProjectsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
