
"use client"

import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { TenantSelector } from "@/components/layout/tenant-selector"
import { RealTimeNotifications } from "@/components/enterprise/real-time-notifications"
import { UserGuideTrigger } from "@/components/user-guide/user-guide-trigger"
import { 
  Menu, 
  Bell, 
  Search, 
  Settings, 
  LogOut, 
  User,
  ChevronDown,
  HelpCircle
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {}

export function Header({}: HeaderProps = {}) {
  const { data: session } = useSession()
  const currentTime = new Date()
  const hour = currentTime.getHours()
  
  let greeting = "Guten Morgen"
  if (hour >= 12 && hour < 18) {
    greeting = "Guten Tag"
  } else if (hour >= 18) {
    greeting = "Guten Abend"
  }

  const getUserRole = () => {
    if (!session?.user?.roles?.length) return "Benutzer"
    
    const role = session.user.roles[0]?.name
    switch (role) {
      case "super_admin": return "Super Admin"
      case "tenant_admin": return "Tenant Admin"
      case "c_level": return "C-Level"
      case "manager": return "Manager"
      case "employee": return "Mitarbeiter"
      default: return "Benutzer"
    }
  }

  const getInitials = () => {
    if (session?.user?.firstName && session?.user?.lastName) {
      return `${session.user.firstName[0]}${session.user.lastName[0]}`
    }
    return session?.user?.email?.[0]?.toUpperCase() || "U"
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          {/* Tenant Selector */}
          <TenantSelector />
          
          <div className="hidden sm:block h-8 w-px bg-gray-300" />
          
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {greeting}, {session?.user?.firstName || "Benutzer"}!
            </h1>
            <p className="text-sm text-gray-600">
              Willkommen in Ihrer WeGroup Platform
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Suchen..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>

          {/* Real-time Notifications */}
          <RealTimeNotifications />

          {/* User Guide */}
          <UserGuideTrigger />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user?.image || ""} />
                  <AvatarFallback className="bg-blue-600 text-white text-sm">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-700">
                    {session?.user?.firstName} {session?.user?.lastName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getUserRole()}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <div className="font-medium">
                    {session?.user?.firstName} {session?.user?.lastName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {session?.user?.email}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  // TODO: Implement profile editing
                  console.log('Profil bearbeiten clicked')
                  // For now, just log - could navigate to /profile
                }}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                Profil bearbeiten
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  // Navigate to settings page
                  window.location.href = '/settings'
                }}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                Einstellungen
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Abmelden
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
