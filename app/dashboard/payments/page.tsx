'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { CreditCard, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Payment } from '@/lib/types'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, failed: 0 })

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const { getPayments } = await import('@/lib/api')
        const res = await getPayments()
        const items = (res.data || res || []).map((p: any) => ({
          id: String(p.id),
          orderId: String(p.orderId || ''),
          amount: Number(p.amount),
          method: p.method || 'credit_card',
          status: p.status?.toLowerCase() || 'pending',
          transactionId: p.transactionId || String(p.id),
          createdAt: p.createdAt || '',
        }))
        setPayments(items)
        const totalRev = items.reduce((s: number, p: any) => s + (p.status === 'completed' ? p.amount : 0), 0)
        setStats({
          total: totalRev,
          completed: items.filter((p: any) => p.status === 'completed').length,
          pending: items.filter((p: any) => p.status === 'pending').length,
          failed: items.filter((p: any) => p.status === 'failed').length,
        })
      } catch (err) {
        console.error('Failed to load payments:', err)
      }
    }
    loadPayments()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Payments</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-2">Track and manage all payment transactions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-2">{formatCurrency(stats.total)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-2">{stats.completed.toLocaleString()}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-2">{stats.pending.toLocaleString()}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Failed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-2">{stats.failed.toLocaleString()}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <CreditCard className="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-slate-400">No payments found</p>
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                        {payment.transactionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-100">#{payment.orderId.slice(0, 8)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400 capitalize">
                        {payment.method.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(payment.status)}
                          <span className="text-sm text-gray-900 dark:text-slate-100 capitalize">{payment.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                        {formatDate(payment.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

