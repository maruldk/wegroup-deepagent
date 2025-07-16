
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home,
  BarChart3,
  Users,
  Target,
  Lightbulb,
  Zap,
  TrendingUp,
  Globe,
  Brain,
  Infinity,
  ChevronDown,
  ChevronRight,
  Rocket,
  Cloud,
  Network,
  Truck
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    current: false,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    current: false,
  },
  {
    name: 'Team',
    href: '/team',
    icon: Users,
    current: false,
  },
  {
    name: 'Goals',
    href: '/goals',
    icon: Target,
    current: false,
  },
  {
    name: 'Logistics',
    href: '/logistics',
    icon: Truck,
    current: false,
  },
  {
    name: 'Sprints',
    icon: Zap,
    current: false,
    children: [
      { name: 'Sprint 1: Foundation', href: '/sprint1', icon: Home },
      { name: 'Sprint 2: Analytics', href: '/sprint2', icon: BarChart3 },
      { name: 'Sprint 3: Teams', href: '/sprint3', icon: Users },
      { name: 'Sprint 4: Goals', href: '/sprint4', icon: Target },
      { name: 'Sprint 5: Innovation', href: '/sprint5', icon: Lightbulb },
      { name: 'Sprint 6: Performance', href: '/sprint6', icon: TrendingUp },
      { name: 'Sprint 7: Global Scale', href: '/sprint7', icon: Globe },
      { name: 'Sprint 8: AI Integration', href: '/sprint8', icon: Brain },
      { 
        name: 'Sprint 9: AGI Singularity', 
        href: '/sprint9', 
        icon: Infinity,
        description: '99.8% Autonomous Intelligence',
        badge: 'COSMIC'
      },
      { 
        name: 'Sprint 10: FINAL SPRINT', 
        href: '/sprint10', 
        icon: Rocket,
        description: '99.9%+ AI Autonomy - Production Ready',
        badge: 'COMPLETE'
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [sprintsExpanded, setSprintsExpanded] = useState(true);

  return (
    <div className="flex flex-col w-64 bg-slate-900 border-r border-slate-700">
      <div className="flex items-center justify-center h-16 px-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <span className="text-white font-semibold text-lg">WeGroup</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          
          if (item.children) {
            return (
              <div key={item.name}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-between text-left font-normal',
                    'text-slate-300 hover:text-white hover:bg-slate-800'
                  )}
                  onClick={() => setSprintsExpanded(!sprintsExpanded)}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  {sprintsExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
                
                {sprintsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 mt-2 space-y-1"
                  >
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href;
                      const IconComponent = child.icon;
                      
                      return (
                        <Link key={child.name} href={child.href}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              'w-full justify-start text-left font-normal relative',
                              isChildActive
                                ? 'bg-blue-500/10 text-blue-400 border-r-2 border-blue-400'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800',
                              child.name.includes('Sprint 9') && 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20',
                              child.name.includes('Sprint 10') && 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20'
                            )}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <IconComponent className={cn(
                                'w-4 h-4',
                                child.name.includes('Sprint 9') && 'text-purple-400',
                                child.name.includes('Sprint 10') && 'text-yellow-400'
                              )} />
                              <span className={cn(
                                child.name.includes('Sprint 9') && 'text-purple-300 font-medium',
                                child.name.includes('Sprint 10') && 'text-yellow-300 font-bold'
                              )}>
                                {child.name}
                              </span>
                            </div>
                            
                            {child.badge && (
                              <span className={cn(
                                'px-2 py-0.5 text-xs rounded-full',
                                child.name.includes('Sprint 10') 
                                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              )}>
                                {child.badge}
                              </span>
                            )}
                            
                            {child.description && isChildActive && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={cn(
                                  'absolute left-full ml-2 top-0 bg-slate-800 rounded-lg p-2 text-xs whitespace-nowrap z-50 shadow-lg',
                                  child.name.includes('Sprint 10')
                                    ? 'border border-yellow-500/30 text-yellow-300'
                                    : 'border border-purple-500/30 text-purple-300'
                                )}
                              >
                                {child.description}
                              </motion.div>
                            )}
                          </Button>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            );
          }

          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  isActive
                    ? 'bg-blue-500/10 text-blue-400 border-r-2 border-blue-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Sprint 10 Status Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Rocket className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-300">Sprint 10 Status</span>
          </div>
          <div className="text-xs text-slate-400 mb-1">Mission Complete</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-700 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-1.5 rounded-full transition-all duration-1000"
                style={{ width: '99.9%' }}
              />
            </div>
            <span className="text-xs font-medium text-yellow-400">99.9%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
