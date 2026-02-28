'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
  Store,
  Car,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { ROLE_LABELS, type UserRole } from '@/lib/roles'

interface StatCard {
  title: string
  value: string
  change: number
  icon: React.ElementType
  color: string
}

const ROLE_HEADLINES: Record<UserRole, { title: string; subtitle: string }> = {
  admin: {
    title: 'Command Center',
    subtitle: 'Full visibility and control across inventory, orders, logistics, and revenue. Your platform at a glance.',
  },
  manager: {
    title: 'Operations Overview',
    subtitle: 'Track performance, orders, and growth metrics. Make data-driven decisions across the business.',
  },
  accountant: {
    title: 'Financial Overview',
    subtitle: 'Revenue, payments, and sales performance. Everything you need for reporting and reconciliation.',
  },
  logistics: {
    title: 'Logistics & Fulfillment',
    subtitle: 'Orders, delivery status, and supplier coordination. Keep operations moving smoothly.',
  },
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatCard[]>([])
  const [role, setRole] = useState<UserRole>('admin')

  useEffect(() => {
    const stored = localStorage.getItem('userRole') as UserRole | null
    if (stored && ['admin', 'manager', 'accountant', 'logistics'].includes(stored)) {
      setRole(stored)
    }
  }, [])

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { getAdminDashboard } = await import('@/lib/api')
        const data = await getAdminDashboard()
        const base = [
          { title: 'Total Parts', value: Number(data.totalProducts || 0).toLocaleString(), change: 12.5, icon: Package, color: 'bg-blue-500' },
          { title: 'Total Orders', value: Number(data.totalOrders || 0).toLocaleString(), change: 8.2, icon: ShoppingCart, color: 'bg-emerald-500' },
          { title: 'Revenue', value: formatCurrency(data.totalRevenue || 0), change: 15.3, icon: DollarSign, color: 'bg-violet-500' },
          { title: 'Active Users', value: Number(data.totalUsers || 0).toLocaleString(), change: -2.1, icon: Users, color: 'bg-amber-500' },
          { title: 'Shops & Suppliers', value: Number(data.totalShops || 0).toLocaleString(), change: 5.7, icon: Store, color: 'bg-rose-500' },
          { title: 'Marketplace Listings', value: Number(data.totalListings || 0).toLocaleString(), change: 18.9, icon: Car, color: 'bg-indigo-500' },
        ]
        setStats(base)
      } catch {
        setStats([
          { title: 'Total Parts', value: '0', change: 0, icon: Package, color: 'bg-blue-500' },
          { title: 'Total Orders', value: '0', change: 0, icon: ShoppingCart, color: 'bg-emerald-500' },
          { title: 'Revenue', value: formatCurrency(0), change: 0, icon: DollarSign, color: 'bg-violet-500' },
          { title: 'Active Users', value: '0', change: 0, icon: Users, color: 'bg-amber-500' },
          { title: 'Shops & Suppliers', value: '0', change: 0, icon: Store, color: 'bg-rose-500' },
          { title: 'Marketplace Listings', value: '0', change: 0, icon: Car, color: 'bg-indigo-500' },
        ])
      }
    }
    loadStats()
  }, [role])

  const headline = ROLE_HEADLINES[role]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <p className="text-sm font-medium text-primary-500 dark:text-primary-400">
            {ROLE_LABELS[role]} · Live
          </p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
            {headline.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
            {headline.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg dark:hover:shadow-none hover:border-primary-200 dark:hover:border-primary-500/30 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stat.value}</p>
                  <div className="flex items-center mt-4 gap-1">
                    {stat.change > 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className={stat.change > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                      {Math.abs(stat.change)}%
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`${stat.color} p-4 rounded-xl shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Orders</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Order #ORD-{1000 + i}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">2 items · {formatCurrency(150 + i * 25)}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-full">
                    Delivered
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Selling Parts</h2>
            <div className="space-y-4">
              {['Oil Filter', 'Brake Pads', 'Air Filter', 'Spark Plugs', 'Battery'].map((part, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{part}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{234 - i * 10} units sold</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
