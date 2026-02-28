'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { TrendingUp, Store, Wrench, Package, BarChart3 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function AnalyticsPage() {
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [orderStats, setOrderStats] = useState<any>(null)
  const [userStats, setUserStats] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const { getTopProducts, getOrderStats, getUserStats } = await import('@/lib/api')
        const [tp, os, us] = await Promise.all([
          getTopProducts(5).catch(() => []),
          getOrderStats().catch(() => null),
          getUserStats().catch(() => null),
        ])
        setTopProducts(Array.isArray(tp) ? tp : (tp?.data || []))
        setOrderStats(os)
        setUserStats(us)
      } catch (err) {
        console.error('Failed to load analytics:', err)
      }
    }
    load()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Analytics & Performance</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-2">Insights into your platform's performance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Stats */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Store className="w-6 h-6 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">User Breakdown</h2>
            </div>
            <div className="space-y-4">
              {userStats ? (
                Object.entries(userStats).map(([role, count]: [string, any], i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-slate-700 last:border-0">
                    <p className="font-medium text-gray-900 dark:text-slate-100 capitalize">{role.replace('_', ' ')}</p>
                    <p className="font-medium text-gray-900 dark:text-slate-100">{Number(count).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-slate-400">Loading...</p>
              )}
            </div>
          </div>

          {/* Order Stats */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Wrench className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Order Stats</h2>
            </div>
            <div className="space-y-4">
              {orderStats ? (
                Object.entries(orderStats).map(([status, count]: [string, any], i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-slate-700 last:border-0">
                    <p className="font-medium text-gray-900 dark:text-slate-100 capitalize">{status.replace('_', ' ')}</p>
                    <p className="font-medium text-gray-900 dark:text-slate-100">{Number(count).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-slate-400">Loading...</p>
              )}
            </div>
          </div>

          {/* Top Parts */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Package className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Top Selling Parts</h2>
            </div>
            <div className="space-y-4">
              {topProducts.length > 0 ? topProducts.map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-slate-700 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-slate-100">{p.name || p.productName || `Product ${i + 1}`}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{p.totalSold || p.orderCount || 0} units</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-slate-100">{formatCurrency(p.revenue || p.totalRevenue || 0)}</p>
                    <TrendingUp className="w-4 h-4 text-green-500 inline ml-1" />
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500 dark:text-slate-400">No data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="w-6 h-6 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Revenue Overview</h2>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-slate-400">
            <p>Chart visualization would go here (using recharts or similar)</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}


