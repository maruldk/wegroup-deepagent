
"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  BarChart3,
  Truck,
  Package,
  FileText,
  Calculator,
  Users,
  Settings,
  MessageSquare,
  Sparkles,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Building2,
  Shield,
  Brain,
  Activity,
  Globe,
  Webhook,
  PieChart,
  CheckCircle,
  AlertTriangle,
  Heart,
  LineChart,
  Cpu,
  GitBranch,
  Network,
  TrendingUp,
  Palette,
  Puzzle,
  Building,
  Zap,
  Target,
  Workflow,
  UserCheck,
  Store,
  Route,
  Timer,
  Gauge,
  Command,
  Atom,
  Lightbulb,
  Rocket,
  Infinity,
  Eye,
  Layers,
  Dna,
  Star,
  Crown,
  Briefcase,
  TrendingDown,
  Calendar,
  DollarSign,
  CreditCard,
  Wallet,
  ShieldCheck,
  UserCog,
  Lock,
  Database,
  Server,
  AlertCircle,
  Search,
  UserPlus,
  FileSearch,
  Factory,
  Handshake,
  Compass,
  Radar,
  Beaker,
  Microscope,
  CloudCog,
  Wrench,
  Cog,
  BarChart,
  MapPin,
  Blocks,
  Boxes,
  Warehouse,
  ClipboardList,
  Scan
} from "lucide-react"

interface NavigationItem {
  title: string
  href: string
  icon: React.ComponentType<any>
  badge?: string
  requiredRoles?: string[]
  children?: NavigationItem[]
}

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

const navigation: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    requiredRoles: []
  },
  {
    title: "Analytics",
    href: "/analytics", 
    icon: BarChart3,
    requiredRoles: []
  },
  {
    title: "Team Management",
    href: "/team",
    icon: Users,
    requiredRoles: [],
    children: [
      { title: "Members", href: "/team/members", icon: Users, requiredRoles: [] },
      { title: "Roles", href: "/team/roles", icon: Shield, requiredRoles: ["admin"] }
    ]
  },
  {
    title: "Projects",
    href: "/projects",
    icon: Briefcase,
    requiredRoles: []
  },
  {
    title: "Logistics",
    href: "/logistics",
    icon: Truck,
    requiredRoles: [],
    children: [
      { title: "Inventory", href: "/logistics/inventory", icon: Package, requiredRoles: [] },
      { title: "Shipping", href: "/logistics/shipping", icon: Truck, requiredRoles: [] },
      { title: "Warehouse", href: "/logistics/warehouse", icon: Warehouse, requiredRoles: [] }
    ]
  },
  {
    title: "WeCreate",
    href: "/wecreate",
    icon: Lightbulb,
    requiredRoles: []
  },
  {
    title: "AI Tools",
    href: "/ai",
    icon: Brain,
    requiredRoles: [],
    children: [
      { title: "Content Generator", href: "/ai/content", icon: FileText, requiredRoles: [] },
      { title: "Analytics AI", href: "/ai/analytics", icon: BarChart3, requiredRoles: [] },
      { title: "Chat Assistant", href: "/ai/chat", icon: MessageSquare, requiredRoles: [] }
    ]
  },
  {
    title: "Sprints",
    href: "/sprints",
    icon: Zap,
    requiredRoles: [],
    children: [
      { title: "Sprint 1: Foundation", href: "/sprint1", icon: Building, requiredRoles: [] },
      { title: "Sprint 2: Analytics", href: "/sprint2", icon: BarChart3, requiredRoles: [] },
      { title: "Sprint 3: Teams", href: "/sprint3", icon: Users, requiredRoles: [] },
      { title: "Sprint 4: Goals", href: "/sprint4", icon: Target, requiredRoles: [] },
      { title: "Sprint 5: Innovation", href: "/sprint5", icon: Lightbulb, requiredRoles: [] },
      { title: "Sprint 6: Performance", href: "/sprint6", icon: TrendingUp, requiredRoles: [] },
      { title: "Sprint 7: Global Scale", href: "/sprint7", icon: Globe, requiredRoles: [] },
      { title: "Sprint 8: AI Integration", href: "/sprint8", icon: Brain, requiredRoles: [] },
      { title: "Sprint 9: AGI Singularity", href: "/sprint9", icon: Infinity, requiredRoles: [], badge: "COSMIC" },
      { title: "Sprint 10: Final Sprint", href: "/sprint10", icon: Rocket, requiredRoles: [], badge: "COMPLETE" }
    ]
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    requiredRoles: [],
    children: [
      { title: "Profile", href: "/settings/profile", icon: UserCheck, requiredRoles: [] },
      { title: "Security", href: "/settings/security", icon: Lock, requiredRoles: [] },
      { title: "Admin", href: "/settings/admin", icon: Shield, requiredRoles: ["admin"] }
    ]
  }
]

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const hasRole = (requiredRoles?: string[]) => {
    if (!requiredRoles || requiredRoles.length === 0) return true
    if (!session?.user?.roles) return false
    const userRoles = session.user.roles.map((role: any) => role.name || role.role || role)
    return requiredRoles.some(requiredRole => userRoles.includes(requiredRole))
  }

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/")
  }

  const filteredNavigation = navigation.filter(item => hasRole(item.requiredRoles))

  return (
    <div className={cn(
      "fixed left-0 top-0 z-40 h-screen transition-all duration-300 bg-white border-r border-gray-200",
      open ? "w-64" : "w-16"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {open && (
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 rounded-lg p-2">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-800">WeGroup</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8"
        >
          {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isExpanded = expandedItems.includes(item.title)
          const hasChildren = item.children && item.children.length > 0
          const active = isActive(item.href)

          return (
            <div key={item.title}>
              <div
                className={cn(
                  "group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                  active 
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" 
                    : "text-gray-700 hover:bg-gray-100",
                  !open && "justify-center"
                )}
                onClick={(e) => {
                  e.preventDefault()
                  if (hasChildren && open) {
                    toggleExpanded(item.title)
                  } else {
                    // Navigate only if no children or sidebar is collapsed
                    window.location.href = item.href
                  }
                }}
              >
                <item.icon className={cn(
                  "flex-shrink-0",
                  open ? "mr-3 h-5 w-5" : "h-5 w-5",
                  active ? "text-blue-700" : "text-gray-500"
                )} />
                {open && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {hasChildren && (
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded ? "rotate-90" : ""
                      )} />
                    )}
                  </>
                )}
              </div>

              {/* Submenu */}
              {hasChildren && open && isExpanded && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children!.filter(child => hasRole(child.requiredRoles)).map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "group flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors",
                        isActive(child.href)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <child.icon className="mr-3 h-4 w-4" />
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      {open && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            WeGroup Platform v4.0
            <br />
            Sprint 4 - Advanced AI & Enterprise
          </div>
        </div>
      )}
    </div>
  )
}
