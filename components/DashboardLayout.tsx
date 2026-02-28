'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  Store,
  ShoppingCart,
  CreditCard,
  Tag,
  Wrench,
  BarChart3,
  Users,
  MessageSquare,
  Car,
  LogOut,
  Menu,
  X,
  FolderTree,
  Warehouse,
  Truck,
  Receipt,
  Sun,
  Moon,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/ThemeContext'
import { getNavigationForRole, ROLE_LABELS, type UserRole } from '@/lib/roles'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [role, setRole] = useState<UserRole>('admin')

  const navigation = getNavigationForRole(role)

  useEffect(() => {
    const stored = localStorage.getItem('userRole') as UserRole | null
    if (stored && ['admin', 'manager', 'accountant', 'logistics'].includes(stored)) {
      setRole(stored)
    }
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    const allowedHrefs = navigation.map((n) => n.href)
    const hasAccess = pathname === '/dashboard' || allowedHrefs.some((href) => pathname === href || pathname.startsWith(href + '/'))
    if (role && navigation.length > 0 && !hasAccess) {
      router.replace('/dashboard')
    }
  }, [pathname, role, navigation])

  const handleLogout = async () => {
    try {
      const { logout } = await import('@/lib/api')
      await logout()
    } catch { /* ignore */ }
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">AutoCore</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out',
            'fixed md:static inset-y-0 left-0 z-50',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
            'w-64 h-screen flex flex-col'
          )}
        >
          <div className="p-6 flex-shrink-0">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">AutoCore</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Command Center</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/50">
              <Shield className="w-4 h-4 text-primary-500" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {ROLE_LABELS[role]}
              </span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 pb-6 space-y-0.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 border-l-4',
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 font-medium border-primary-500'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 truncate">{item.name}</span>
                  {item.badge != null && (
                    <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span className="text-sm font-medium">{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 w-full transition-colors border-l-4 border-transparent hover:border-red-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign out</span>
            </button>
          </div>
        </aside>

        {sidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 min-h-screen">
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
