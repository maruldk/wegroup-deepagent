'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard,
  Users, 
  Euro, 
  Truck,
  Brain,
  Settings,
  BarChart3,
  Shield,
  Globe,
  Building,
  Search,
  UserPlus,
  Target,
  Calculator,
  TrendingUp,
  Package,
  Route,
  PieChart,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Activity,
  Monitor,
  Database,
  Sparkles,
  Palette,
  ShoppingCart,
  Rocket,
  Star,
  Network,
  Workflow,
  Leaf,
  Warehouse,
  MapPin,
  MessageSquare,
  UserCheck,
  DollarSign,
  CreditCard,
  ShieldCheck,
  UserCog,
  Crown,
  Code,
  Lightbulb,
  Factory,
  Key,
  BookOpen,
  Flag,
  User,
  Zap,
  Receipt,
  Compass,
  Heart,
  Mail,
  Bell,
  Briefcase,
  Clock,
  Megaphone,
  Eye,
  Layers,
  TreePine,
  Recycle,
  Calendar,
  PhoneCall,
  Award,
  Cpu,
  Wand2,
  Gauge,
  Radar,
  Microscope,
  Beaker,
  Navigation,
  Map,
  GraduationCap,
  Store,
  Archive,
  Edit,
  Trash2,
  RefreshCw,
  Plus,
  Minus,
  X,
  MoreHorizontal,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  Move,
  MousePointer,
  Keyboard,
  Timer,
  AlarmClock,
  Sun,
  Moon,
  CloudRain,
  Wind,
  Mountain,
  Trees,
  Flower,
  Bug,
  Fish,
  Car,
  Plane,
  Ship,
  Train,
  Bus,
  Bike,
  Home,
  Laptop,
  Tablet,
  Smartphone,
  Server,
  HardDrive,
  Wifi,
  Lock,
  Cloud,
  Filter,
  LineChart,
  BarChart2,
  TrendingDown,
  CheckSquare,
  XCircle,
  AlertCircle,
  CheckCircle,
  Flame,
  Tags,
  FolderOpen,
  Download,
  Upload,
  Share,
  Copy,
  Play,
  Pause,
  Square,
  Camera,
  Video,
  Image,
  Music,
  Film,
  Wrench,
  Hammer,
  Scissors,
  Pen,
  Bookmark,
  FileCode,
  Command,
  Layers as LayersIcon,
  Zap as ZapIcon,
  Eye as EyeIcon,
  Workflow as WorkflowIcon,
  Recycle as RecycleIcon,
  TreePine as TreePineIcon,
  GitCompareArrows
} from 'lucide-react'

interface SidebarItem {
  id: string
  label: string
  icon: any
  href?: string
  badge?: string
  subItems?: SidebarItem[]
  isActive?: boolean
  isCategory?: boolean // New flag for parent categories
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    subItems: [
      {
        id: 'dashboard-live',
        label: 'Live Monitoring',
        icon: Activity,
        href: '/dashboard/live'
      }
    ]
  },
  {
    id: 'members',
    label: 'Members',
    icon: Users,
    href: '/members'
  },
  {
    id: 'expenses',
    label: 'Expenses',
    icon: Receipt,
    href: '/expenses'
  },
  {
    id: 'ai-insights',
    label: 'AI Insights',
    icon: Brain,
    href: '/ai-insights',
    badge: 'New'
  },
  {
    id: 'hr',
    label: 'HR Management',
    icon: Users,
    href: '/hr',
    isCategory: true,
    subItems: [
      {
        id: 'hr-employees',
        label: 'Mitarbeiter',
        icon: UserCheck,
        href: '/hr/employees'
      },
      {
        id: 'hr-recruiting',
        label: 'KI-Recruiting',
        icon: UserPlus,
        href: '/hr/recruiting'
      },
      {
        id: 'hr-performance',
        label: 'Performance',
        icon: TrendingUp,
        href: '/hr/performance'
      },
      {
        id: 'hr-management',
        label: 'Management',
        icon: Crown,
        href: '/hr/management'
      }
    ]
  },
  {
    id: 'finance',
    label: 'Finance Management',
    icon: DollarSign,
    href: '/finance',
    isCategory: true,
    subItems: [
      {
        id: 'finance-invoice-processing',
        label: 'Invoice Processing',
        icon: Receipt,
        href: '/finance/invoice-processing',
        badge: 'Phase 5',
        badgeColor: 'bg-blue-100 text-blue-800'
      },
      {
        id: 'finance-invoice-upload',
        label: 'Invoice Upload',
        icon: Upload,
        href: '/finance/invoice-upload',
        badge: 'OCR',
        badgeColor: 'bg-purple-100 text-purple-800'
      },
      {
        id: 'finance-invoice-review',
        label: 'Invoice Review',
        icon: Eye,
        href: '/finance/invoice-review',
        badge: 'KI',
        badgeColor: 'bg-green-100 text-green-800'
      },
      {
        id: 'finance-approval-workflow',
        label: 'Approval Workflow',
        icon: UserCheck,
        href: '/finance/approval-workflow',
        badge: 'Auto',
        badgeColor: 'bg-orange-100 text-orange-800'
      },
      {
        id: 'finance-three-way-matching',
        label: 'Three-Way Matching',
        icon: Target,
        href: '/finance/three-way-matching',
        badge: 'Smart',
        badgeColor: 'bg-teal-100 text-teal-800'
      },
      {
        id: 'finance-mobile-approval',
        label: 'Mobile Approval',
        icon: Smartphone,
        href: '/finance/mobile-approval',
        badge: 'Mobile',
        badgeColor: 'bg-indigo-100 text-indigo-800'
      },
      // Phase 5 Extension: Multi-Tenant Email Integration
      {
        id: 'finance-email-configuration',
        label: 'E-Mail-Konfiguration',
        icon: Mail,
        href: '/finance/email-configuration',
        badge: 'Email',
        badgeColor: 'bg-blue-100 text-blue-800'
      },
      {
        id: 'finance-email-monitoring',
        label: 'E-Mail-Monitoring',
        icon: Activity,
        href: '/finance/email-monitoring',
        badge: 'Live',
        badgeColor: 'bg-green-100 text-green-800'
      },
      {
        id: 'finance-email-processing',
        label: 'E-Mail-Verarbeitung',
        icon: Zap,
        href: '/finance/email-processing-pipeline',
        badge: 'Pipeline',
        badgeColor: 'bg-purple-100 text-purple-800'
      },
      {
        id: 'finance-tenant-email-settings',
        label: 'Mandanten-E-Mail',
        icon: Settings,
        href: '/finance/tenant-email-settings',
        badge: 'Config',
        badgeColor: 'bg-orange-100 text-orange-800'
      },
      {
        id: 'finance-accounting',
        label: 'Buchhaltung',
        icon: Calculator,
        href: '/finance/accounting'
      },
      {
        id: 'finance-budgeting',
        label: 'Budget-Management',
        icon: PieChart,
        href: '/finance/budgeting'
      },
      {
        id: 'finance-forecasting',
        label: 'KI-Forecasting',
        icon: TrendingUp,
        href: '/finance/forecasting'
      },
      {
        id: 'finance-reports',
        label: 'Reports',
        icon: FileText,
        href: '/finance/reports'
      },
      {
        id: 'finance-compliance',
        label: 'Compliance',
        icon: ShieldCheck,
        href: '/finance/compliance'
      }
    ]
  },
  {
    id: 'services',
    label: 'Universal Services',
    icon: Briefcase,
    href: '/services',
    isCategory: true,
    subItems: [
      {
        id: 'services-dashboard',
        label: 'Dashboard',
        icon: BarChart3,
        href: '/services'
      },
      {
        id: 'services-requests',
        label: 'Service Requests',
        icon: FileText,
        href: '/services/requests'
      },
      {
        id: 'services-suppliers',
        label: 'Supplier Directory',
        icon: Users,
        href: '/services/suppliers'
      },
      {
        id: 'services-rfqs',
        label: 'RFQ Management',
        icon: MessageSquare,
        href: '/services/rfqs'
      },
      {
        id: 'services-quotes',
        label: 'Quote Comparison',
        icon: GitCompareArrows,
        href: '/services/quotes'
      },
      {
        id: 'services-orders',
        label: 'Order Management',
        icon: ShoppingCart,
        href: '/services/orders'
      },
      {
        id: 'services-customers',
        label: 'Customer Management',
        icon: UserCheck,
        href: '/services/customers'
      },
      {
        id: 'services-analytics',
        label: 'Analytics',
        icon: LineChart,
        href: '/services/analytics'
      }
    ]
  },
  {
    id: 'logistics',
    label: 'Logistics Management',
    icon: Truck,
    href: '/logistics',
    isCategory: true,
    subItems: [
      {
        id: 'logistics-customer-requests',
        label: 'Kundenanfragen',
        icon: Users,
        href: '/logistics/customer-requests'
      },
      {
        id: 'logistics-supplier-directory',
        label: 'Lieferantenverzeichnis',
        icon: Building,
        href: '/logistics/supplier-directory'
      },
      {
        id: 'logistics-rfq-management',
        label: 'RFQ Management',
        icon: FileText,
        href: '/logistics/rfq-management'
      },
      {
        id: 'logistics-quote-comparison',
        label: 'Angebots-Vergleich',
        icon: BarChart3,
        href: '/logistics/quote-comparison'
      },
      {
        id: 'logistics-analytics',
        label: 'Analytics',
        icon: TrendingUp,
        href: '/logistics/analytics'
      },
      {
        id: 'logistics-tracking',
        label: 'Tracking',
        icon: MapPin,
        href: '/logistics/tracking'
      },
      {
        id: 'logistics-inventory',
        label: 'Inventory',
        icon: Package,
        href: '/logistics/inventory'
      },
      {
        id: 'logistics-optimization',
        label: 'Routen-Optimierung',
        icon: Route,
        href: '/logistics/optimization'
      },
      {
        id: 'logistics-warehousing',
        label: 'Warehousing',
        icon: Warehouse,
        href: '/logistics/warehousing'
      },
      {
        id: 'logistics-3pl',
        label: '3PL Dashboard',
        icon: Building,
        href: '/logistics/3pl-dashboard'
      },
      {
        id: 'logistics-transport',
        label: 'Transport Requests',
        icon: Truck,
        href: '/logistics/transport-requests'
      },
      {
        id: 'logistics-workflow',
        label: 'Workflow Manager',
        icon: Workflow,
        href: '/logistics/workflow-manager'
      },
      {
        id: 'logistics-supplier',
        label: 'Supplier Portal',
        icon: Factory,
        href: '/logistics/supplier-portal'
      },
      {
        id: 'logistics-customer',
        label: 'Customer Portal',
        icon: Users,
        href: '/logistics/customer-portal'
      },
      {
        id: 'logistics-procurement',
        label: 'Procurement',
        icon: ShoppingCart,
        href: '/logistics/procurement'
      }
    ]
  },
  {
    id: 'ai-engine',
    label: 'AI Engine',
    icon: Brain,
    href: '/ai-engine',
    badge: 'New',
    isCategory: true,
    subItems: [
      {
        id: 'ai-models',
        label: 'Model Registry',
        icon: Database,
        href: '/ai-engine/models'
      },
      {
        id: 'ai-discovery',
        label: 'Discovery',
        icon: Compass,
        href: '/ai-engine/discovery'
      },
      {
        id: 'ai-decisions',
        label: 'Entscheidungen',
        icon: Target,
        href: '/ai-engine/decisions'
      },
      {
        id: 'ai-orchestration',
        label: 'Orchestration',
        icon: Workflow,
        href: '/ai-engine/orchestration'
      },
      {
        id: 'ai-analytics',
        label: 'Analytics',
        icon: BarChart3,
        href: '/ai-engine/analytics'
      },
      {
        id: 'ai-admin',
        label: 'Admin',
        icon: Settings,
        href: '/ai-engine/admin'
      },
      {
        id: 'ai-super-admin',
        label: 'Super Admin',
        icon: Crown,
        href: '/ai-engine/super-admin'
      }
    ]
  },
  {
    id: 'analytics',
    label: 'Business Intelligence',
    icon: BarChart3,
    href: '/analytics',
    isCategory: true,
    subItems: [
      {
        id: 'analytics-forecasting',
        label: 'Forecasting',
        icon: TrendingUp,
        href: '/analytics/forecasting'
      },
      {
        id: 'analytics-performance',
        label: 'Performance',
        icon: Gauge,
        href: '/analytics/performance'
      },
      {
        id: 'analytics-reports',
        label: 'Reports',
        icon: FileText,
        href: '/analytics/reports'
      },
      {
        id: 'api-management',
        label: 'API Management',
        icon: Code,
        href: '/api-management'
      },
      {
        id: 'monitoring',
        label: 'Monitoring',
        icon: Monitor,
        href: '/monitoring'
      }
    ]
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: Cpu,
    isCategory: true,
    subItems: [
      {
        id: 'operations-inventory',
        label: 'Inventory',
        icon: Package,
        href: '/operations/inventory'
      },
      {
        id: 'operations-routes',
        label: 'Routes',
        icon: Route,
        href: '/operations/routes'
      },
      {
        id: 'operations-warehouses',
        label: 'Warehouses',
        icon: Warehouse,
        href: '/operations/warehouses'
      }
    ]
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: MessageSquare,
    isCategory: true,
    subItems: [
      {
        id: 'communication-announcements',
        label: 'Announcements',
        icon: Megaphone,
        href: '/communication/announcements'
      },
      {
        id: 'communication-messages',
        label: 'Messages',
        icon: MessageSquare,
        href: '/communication/messages'
      },
      {
        id: 'communication-notifications',
        label: 'Notifications',
        icon: Bell,
        href: '/communication/notifications'
      }
    ]
  },
  {
    id: 'user-management',
    label: 'User Management',
    icon: UserCog,
    href: '/user-management',
    isCategory: true,
    subItems: [
      {
        id: 'users',
        label: 'Benutzer',
        icon: Users,
        href: '/user-management'
      },
      {
        id: 'roles',
        label: 'Rollen',
        icon: Key,
        href: '/user-management/roles'
      },
      {
        id: 'permissions',
        label: 'Berechtigungen',
        icon: Shield,
        href: '/user-management/permissions'
      }
    ]
  },
  {
    id: 'security',
    label: 'Security & Compliance',
    icon: Shield,
    href: '/security',
    isCategory: true,
    subItems: [
      {
        id: 'security-audit',
        label: 'Audit',
        icon: FileText,
        href: '/security/audit'
      },
      {
        id: 'security-incidents',
        label: 'Incidents',
        icon: AlertTriangle,
        href: '/security/incidents'
      },
      {
        id: 'security-policies',
        label: 'Richtlinien',
        icon: BookOpen,
        href: '/security/policies'
      },
      {
        id: 'security-compliance',
        label: 'Compliance',
        icon: ShieldCheck,
        href: '/security/compliance'
      }
    ]
  },
  {
    id: 'enterprise',
    label: 'Enterprise Features',
    icon: Building,
    href: '/enterprise',
    isCategory: true,
    subItems: [
      {
        id: 'enterprise-billing',
        label: 'Billing',
        icon: CreditCard,
        href: '/enterprise/billing'
      },
      {
        id: 'enterprise-integrations',
        label: 'Integrationen',
        icon: Network,
        href: '/enterprise/integrations'
      },
      {
        id: 'enterprise-support',
        label: 'Support',
        icon: Heart,
        href: '/enterprise/support'
      },
      {
        id: 'enterprise-tenants',
        label: 'Tenants',
        icon: Database,
        href: '/enterprise/tenants'
      }
    ]
  },
  {
    id: 'enterprise-3pl',
    label: 'Enterprise 3PL',
    icon: Factory,
    href: '/enterprise-3pl',
    isCategory: true,
    subItems: [
      {
        id: '3pl-multi-carrier',
        label: 'Multi-Carrier',
        icon: Truck,
        href: '/enterprise-3pl/multi-carrier'
      },
      {
        id: '3pl-ki-routing',
        label: 'KI-Routing',
        icon: Route,
        href: '/enterprise-3pl/ki-routing'
      },
      {
        id: '3pl-tracking',
        label: 'Realtime Tracking',
        icon: MapPin,
        href: '/enterprise-3pl/tracking'
      },
      {
        id: '3pl-compliance',
        label: 'Compliance',
        icon: ShieldCheck,
        href: '/enterprise-3pl/compliance'
      },
      {
        id: '3pl-analytics',
        label: 'Predictive Analytics',
        icon: BarChart3,
        href: '/enterprise-3pl/analytics'
      }
    ]
  },
  {
    id: 'wegroup-products',
    label: 'WeGroup Products',
    icon: Star,
    isCategory: true,
    subItems: [
      {
        id: 'wecreate',
        label: 'WeCreate',
        icon: Palette,
        href: '/wecreate'
      },
      {
        id: 'wesell',
        label: 'WeSell',
        icon: ShoppingCart,
        href: '/wesell'
      }
    ]
  },
  {
    id: 'sprint-features',
    label: 'Advanced Features',
    icon: Rocket,
    isCategory: true,
    subItems: [
      {
        id: 'quantum',
        label: 'Quantum',
        icon: Sparkles,
        href: '/quantum'
      },
      {
        id: 'ecosystem',
        label: 'Ecosystem',
        icon: Globe,
        href: '/ecosystem'
      },
      {
        id: 'innovation',
        label: 'Innovation',
        icon: Lightbulb,
        href: '/innovation'
      },
      {
        id: 'sustainability',
        label: 'Sustainability',
        icon: Leaf,
        href: '/sustainability'
      },
      {
        id: 'personalization',
        label: 'Personalization',
        icon: User,
        href: '/personalization'
      },
      {
        id: 'sprint7',
        label: 'Sprint 7',
        icon: Flag,
        href: '/sprint7'
      },
      {
        id: 'sprint9',
        label: 'Sprint 9',
        icon: Rocket,
        href: '/sprint9'
      },
      {
        id: 'sprint10',
        label: 'Sprint 10',
        icon: Crown,
        href: '/sprint10'
      }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    isCategory: true,
    subItems: [
      {
        id: 'settings-general',
        label: 'General',
        icon: Settings,
        href: '/settings/general'
      },
      {
        id: 'settings-system',
        label: 'System',
        icon: Server,
        href: '/settings/system'
      },
      {
        id: 'settings-users',
        label: 'Users',
        icon: Users,
        href: '/settings/users'
      },
      {
        id: 'settings-security',
        label: 'Security',
        icon: Shield,
        href: '/settings/security'
      },
      {
        id: 'settings-integrations',
        label: 'Integrations',
        icon: Network,
        href: '/settings/integrations'
      },
      {
        id: 'settings-personalization',
        label: 'Personalization',
        icon: Palette,
        href: '/settings/personalization'
      }
    ]
  }
]

export default function EnhancedSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleExpanded = (itemId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const isItemActive = (href?: string) => {
    if (!href) return false
    return pathname === href || pathname.startsWith(href + '/')
  }

  const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
    const isActive = isItemActive(item.href)
    const isExpanded = expandedItems.includes(item.id)
    const hasSubItems = item.subItems && item.subItems.length > 0
    const IconComponent = item.icon

    const itemContent = (
      <div className={`
        group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
        ${level === 0 ? 'mx-2' : 'mx-4 ml-6'}
        ${isActive 
          ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200' 
          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        }
        ${isCollapsed && level === 0 ? 'justify-center' : ''}
      `}>
        <IconComponent className={`
          flex-shrink-0 transition-colors duration-200
          ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}
          ${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'}
        `} />
        
        {!isCollapsed && (
          <>
            <span className="flex-1 font-medium text-sm truncate">
              {item.label}
            </span>
            
            {item.badge && (
              <Badge variant={isActive ? 'default' : 'secondary'} className="text-xs">
                {item.badge}
              </Badge>
            )}
            
            {hasSubItems && (
              <button
                onClick={(e) => toggleExpanded(item.id, e)}
                className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
              >
                <ChevronDown className={`
                  h-4 w-4 transition-transform duration-200
                  ${isExpanded ? 'rotate-180' : ''}
                  ${isActive ? 'text-blue-600' : 'text-gray-400'}
                `} />
              </button>
            )}
          </>
        )}
      </div>
    )

    return (
      <div key={item.id} className="space-y-1">
        {/* Categories with both link and toggle functionality */}
        {item.isCategory && item.href ? (
          <div className="relative">
            <Link href={item.href} className="block">
              {itemContent}
            </Link>
          </div>
        ) : item.href ? (
          /* Regular links */
          <Link href={item.href} className="block">
            {itemContent}
          </Link>
        ) : (
          /* Toggle-only items */
          <button
            onClick={() => toggleExpanded(item.id)}
            className="w-full text-left"
          >
            {itemContent}
          </button>
        )}
        
        {/* Submenu rendering */}
        {hasSubItems && isExpanded && !isCollapsed && (
          <div className="space-y-1 pb-2 ml-4">
            {item.subItems!.map(subItem => renderSidebarItem(subItem, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`
      bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">WeGroup</h2>
              <p className="text-xs text-gray-500">Platform</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0 hover:bg-gray-100"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      )}

      {/* User Info */}
      {!isCollapsed && session && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session.user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.user?.email || 'user@example.com'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1">
          {sidebarItems.map(item => renderSidebarItem(item))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Activity className="h-3 w-3" />
              <span>System Status</span>
              <div className="flex-1 flex justify-end">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Operational</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Monitor className="h-3 w-3" />
              <span>Performance</span>
              <div className="flex-1 flex justify-end">
                <span>98.2%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  )
}
