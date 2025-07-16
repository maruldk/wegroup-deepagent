
"use client"

import { useState } from "react"
import EnhancedSidebar from "@/components/layout/enhanced-sidebar"
import { Header } from "@/components/layout/header"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Enhanced Sidebar */}
      <div className="fixed left-0 top-0 h-full">
        <EnhancedSidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        <Header />
        
        {/* Page Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
