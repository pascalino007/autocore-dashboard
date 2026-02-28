'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Calendar, Package, TrendingUp, DollarSign, ChevronDown, ChevronUp, Printer } from 'lucide-react'
import { Order, OrderItem } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function SalesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [allParts, setAllParts] = useState<Map<string, { part: OrderItem; quantity: number; total: number }>>(new Map())
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Mock data - replace with API call
    setOrders([
      {
        id: 'order-1',
        userId: 'user-1',
        items: [
          {
            id: 'item-1',
            partId: 'part-1',
            partName: 'Premium Oil Filter',
            quantity: 2,
            price: 29.99,
            shopId: 'shop-1',
            status: 'accepted',
          },
          {
            id: 'item-2',
            partId: 'part-2',
            partName: 'Brake Pads Set',
            quantity: 1,
            price: 89.99,
            shopId: 'shop-2',
            status: 'accepted',
          },
        ],
        total: 149.97,
        status: 'delivered',
        paymentStatus: 'paid',
        shippingAddress: {
          id: 'addr-1',
          userId: 'user-1',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          isDefault: true,
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'order-2',
        userId: 'user-2',
        items: [
          {
            id: 'item-3',
            partId: 'part-1',
            partName: 'Premium Oil Filter',
            quantity: 1,
            price: 29.99,
            shopId: 'shop-1',
            status: 'accepted',
          },
          {
            id: 'item-4',
            partId: 'part-3',
            partName: 'Air Filter',
            quantity: 2,
            price: 19.99,
            shopId: 'shop-1',
            status: 'accepted',
          },
        ],
        total: 69.97,
        status: 'delivered',
        paymentStatus: 'paid',
        shippingAddress: {
          id: 'addr-2',
          userId: 'user-2',
          street: '456 Oak Ave',
          city: 'Boston',
          state: 'MA',
          zipCode: '02101',
          country: 'USA',
          isDefault: true,
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, startDate, endDate])

  const filterOrders = () => {
    let filtered = orders.filter((order) => order.status === 'delivered' && order.paymentStatus === 'paid')

    if (startDate) {
      filtered = filtered.filter((order) => new Date(order.createdAt) >= new Date(startDate))
    }
    if (endDate) {
      filtered = filtered.filter((order) => new Date(order.createdAt) <= new Date(endDate + 'T23:59:59'))
    }

    setFilteredOrders(filtered)

    // Aggregate all parts
    const partsMap = new Map<string, { part: OrderItem; quantity: number; total: number }>()
    filtered.forEach((order) => {
      order.items.forEach((item) => {
        if (item.status === 'accepted') {
          const key = item.partId
          const existing = partsMap.get(key)
          if (existing) {
            existing.quantity += item.quantity
            existing.total += item.price * item.quantity
          } else {
            partsMap.set(key, {
              part: item,
              quantity: item.quantity,
              total: item.price * item.quantity,
            })
          }
        }
      })
    })
    setAllParts(partsMap)
  }

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = filteredOrders.length
  const totalParts = Array.from(allParts.values()).reduce((sum, p) => sum + p.quantity, 0)

  const toggleOrder = (orderId: string) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  const handlePrint = () => {
    const printContent = document.getElementById('sales-report')
    if (printContent) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Sales Report - ${startDate || 'All Time'} to ${endDate || 'Today'}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { margin: 0; color: #1f2937; }
                .header p { margin: 5px 0; color: #6b7280; }
                .summary { display: flex; justify-content: space-around; margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px; }
                .summary-item { text-align: center; }
                .summary-item h3 { margin: 0; color: #6b7280; font-size: 14px; }
                .summary-item p { margin: 5px 0; font-size: 24px; font-weight: bold; color: #1f2937; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
                th { background: #f9fafb; font-weight: 600; color: #374151; }
                .order { margin: 20px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
                .order-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
                .order-items { margin-top: 10px; }
                .order-item { padding: 8px; background: #f9fafb; margin: 5px 0; border-radius: 4px; display: flex; justify-content: space-between; }
                .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
                @media print {
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
              <div class="footer">
                <p>Generated on ${new Date().toLocaleString()}</p>
                <p>AutoCore Dashboard - Sales Report</p>
              </div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6" id="sales-report">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Sales Report</h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2">View sales data and parts sold within a date range</p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors no-print"
          >
            <Printer className="w-5 h-5" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 no-print">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400 dark:text-slate-500" />
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Start Date:</label>
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
            />
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400 dark:text-slate-500" />
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300">End Date:</label>
            </div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
            />
            <button
              onClick={() => {
                setStartDate('')
                setEndDate('')
              }}
              className="px-4 py-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Print Header */}
        <div className="hidden print:block text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Sales Report</h1>
          <p className="text-gray-600 mt-2">
            {startDate && endDate
              ? `${formatDate(startDate)} - ${formatDate(endDate)}`
              : startDate
              ? `From ${formatDate(startDate)}`
              : endDate
              ? `Until ${formatDate(endDate)}`
              : 'All Time'}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-500/10 dark:to-green-600/10 rounded-xl shadow-sm border border-green-200 dark:border-green-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-200 mt-2">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-600/10 rounded-xl shadow-sm border border-blue-200 dark:border-blue-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-200 mt-2">{totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-500/10 dark:to-purple-600/10 rounded-xl shadow-sm border border-purple-200 dark:border-purple-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 dark:text-purple-400 font-medium">Total Parts Sold</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-200 mt-2">{totalParts}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* All Parts Sold */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">All Parts in Orders</h2>
            <span className="text-sm text-gray-500 dark:text-slate-400">{allParts.size} unique parts</span>
          </div>
          {allParts.size === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-slate-400">No parts found for the selected date range</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Part Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Quantity Sold</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Unit Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {Array.from(allParts.values()).map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                        {item.part.partName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                        {formatCurrency(item.part.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-slate-800/80">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-slate-100 text-right">
                      Grand Total:
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-slate-100">
                      {formatCurrency(Array.from(allParts.values()).reduce((sum, p) => sum + p.total, 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Orders List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Orders</h2>
            <span className="text-sm text-gray-500 dark:text-slate-400">{filteredOrders.length} orders</span>
          </div>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-slate-400">No orders found for the selected date range</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => {
                const isExpanded = expandedOrders.has(order.id)
                const acceptedItems = order.items.filter((item) => item.status === 'accepted')
                return (
                  <div
                    key={order.id}
                    className="border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-md dark:hover:border-slate-600 transition-shadow overflow-hidden"
                  >
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => toggleOrder(order.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-slate-100">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{formatDate(order.createdAt)}</p>
                        </div>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
                        <div>
                          <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{formatCurrency(order.total)}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">{acceptedItems.length} items</p>
                        </div>
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/80 p-4 space-y-2">
                        {acceptedItems.length === 0 ? (
                          <p className="text-sm text-gray-500 dark:text-slate-400 text-center py-2">No accepted items</p>
                        ) : (
                          acceptedItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between text-sm bg-white dark:bg-slate-800 rounded p-2 border border-gray-200 dark:border-slate-700"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-slate-100">{item.partName}</p>
                                <p className="text-xs text-gray-500 dark:text-slate-400">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                              </div>
                              <span className="font-semibold text-gray-900 dark:text-slate-100 ml-2">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

