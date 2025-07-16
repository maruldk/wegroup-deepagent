
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  FileText, 
  MessageSquare, 
  ShoppingCart, 
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface SupplierPortalLayoutProps {
  children: React.ReactNode;
}

export function SupplierPortalLayout({ children }: SupplierPortalLayoutProps) {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/supplier-portal', icon: Home, current: pathname === '/supplier-portal' },
    { name: 'Verfügbare RFQs', href: '/supplier-portal/rfqs', icon: Briefcase, current: pathname === '/supplier-portal/rfqs' },
    { name: 'Meine Angebote', href: '/supplier-portal/quotes', icon: FileText, current: pathname === '/supplier-portal/quotes' },
    { name: 'Aufträge', href: '/supplier-portal/orders', icon: ShoppingCart, current: pathname === '/supplier-portal/orders' },
    { name: 'Performance', href: '/supplier-portal/performance', icon: TrendingUp, current: pathname === '/supplier-portal/performance' },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden"
          >
            <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Briefcase className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-2">
                  <div className="text-sm font-semibold text-gray-900">Supplier Portal</div>
                  <div className="text-xs text-gray-500">WeGroup Services</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="mt-4 px-4">
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        item.current
                          ? 'bg-green-100 text-green-700 border-l-4 border-green-500'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          <div className="flex h-16 items-center px-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Briefcase className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-2">
                <div className="text-sm font-semibold text-gray-900">Supplier Portal</div>
                <div className="text-xs text-gray-500">WeGroup Services</div>
              </div>
            </div>
          </div>
          <nav className="mt-4 flex-1 px-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      item.current
                        ? 'bg-green-100 text-green-700 border-l-4 border-green-500'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Performance badge */}
          <div className="px-4 py-3">
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center">
                <Award className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <div className="text-sm font-medium text-green-800">Performance Score</div>
                  <div className="text-2xl font-bold text-green-600">4.8/5.0</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* User info at bottom */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-gray-400 bg-gray-100 rounded-full p-1" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.email || 'Supplier User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Supplier Portal
                </p>
              </div>
            </div>
            <div className="mt-3 flex space-x-2">
              <Button variant="ghost" size="sm" className="flex-1">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden sm:block">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="RFQs durchsuchen..."
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-64"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                  5
                </span>
              </Button>
              <div className="hidden sm:block text-sm text-gray-700">
                Willkommen, {session?.user?.email?.split('@')[0] || 'Supplier'}!
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
