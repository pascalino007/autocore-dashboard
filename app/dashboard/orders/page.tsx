'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Search, Filter, Eye, Package } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Order, Shop } from '@/lib/types'
import OrderDetail from '@/components/orders/OrderDetail'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [shops, setShops] = useState<Shop[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const { getOrders, getShops } = await import('@/lib/api')
        const [ordersRes, shopsRes] = await Promise.all([getOrders(), getShops()])
        const orderItems = (ordersRes.data || ordersRes || []).map((o: any) => ({
          id: o.id,
          userId: o.userId || o.user?.id || '',
          items: (o.items || []).map((item: any) => ({
            id: item.id,
            partId: item.productId || item.product?.id || '',
            partName: item.product?.name || '',
            quantity: item.quantity,
            price: Number(item.price),
            shopId: item.product?.shopId || '',
            status: item.status?.toLowerCase() || 'pending',
            suppliers: [],
          })),
          total: Number(o.total),
          status: o.status?.toLowerCase() || 'pending',
          paymentStatus: o.payment?.status?.toLowerCase() || 'pending',
          shippingAddress: o.address ? {
            id: o.address.id || '',
            userId: o.userId || '',
            street: o.address.address1 || o.address.street || '',
            city: o.address.city || '',
            state: o.address.state || '',
            zipCode: o.address.postcode || o.address.zipCode || '',
            country: o.address.country || '',
            isDefault: false,
          } : { id: '', userId: '', street: '', city: '', state: '', zipCode: '', country: '', isDefault: false },
          createdAt: o.createdAt || '',
          updatedAt: o.updatedAt || '',
        }))
        setOrders(orderItems)
        const shopItems = (shopsRes.data || shopsRes || []).map((s: any) => ({
          id: s.id,
          ownerId: s.userId || s.owner?.id || '',
          name: s.name || '',
          description: s.description || '',
          location: {
            address: s.address || '',
            city: s.city || '',
            state: s.state || '',
            zipCode: s.zipCode || '',
            country: s.country || '',
          },
          images: (s.images || []).map((img: any) => typeof img === 'string' ? img : img.url || ''),
          phone: s.phone || '',
          email: s.email || '',
          type: 'supplier' as const,
          createdAt: s.createdAt || '',
        }))
        setShops(shopItems)
      } catch (err) {
        console.error('Failed to load orders:', err)
      }
    }
    loadData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'on_going':
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o)))
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status, updatedAt: new Date().toISOString() })
    }
  }

  const handleUpdateItemStatus = (orderId: string, itemId: string, status: 'accepted' | 'rejected') => {
    setOrders(
      orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              items: o.items.map((item) => (item.id === itemId ? { ...item, status } : item)),
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    )
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        items: selectedOrder.items.map((item) => (item.id === itemId ? { ...item, status } : item)),
        updatedAt: new Date().toISOString(),
      })
    }
  }

  const handleSaveProcessingInfo = (processingInfo: any) => {
    setOrders(
      orders.map((o) =>
        o.id === processingInfo.orderId
          ? { ...o, processingInfo, updatedAt: new Date().toISOString() }
          : o
      )
    )
    if (selectedOrder && selectedOrder.id === processingInfo.orderId) {
      setSelectedOrder({ ...selectedOrder, processingInfo, updatedAt: new Date().toISOString() })
    }
  }

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Orders Management</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-2">View and manage all customer orders</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-slate-200">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Package className="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-slate-400">No orders found</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-100">User {order.userId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{order.items.length} items</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 p-2 hover:bg-primary-50 dark:hover:bg-primary-500/20 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedOrder && (
          <OrderDetail
            order={selectedOrder}
            shops={shops}
            onClose={() => setSelectedOrder(null)}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateItemStatus={handleUpdateItemStatus}
            onSaveProcessingInfo={handleSaveProcessingInfo}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

