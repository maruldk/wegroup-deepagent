
"use client"

import { ReactNode } from "react"

interface AuthLayoutProps {
  children: [ReactNode, ReactNode] // [FormComponent, DemoSimulatorComponent]
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const [formComponent, demoSimulatorComponent] = children

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8 items-stretch min-h-screen">
          
          {/* Left Side - Form (40% width) */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {formComponent}
            </div>
          </div>

          {/* Right Side - Demo Simulator (60% width) */}
          <div className="lg:col-span-3 flex flex-col justify-center">
            <div className="max-w-2xl mx-auto w-full h-full">
              <div className="h-full min-h-[600px] lg:min-h-[700px] flex flex-col">
                {demoSimulatorComponent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
