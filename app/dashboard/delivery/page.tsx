'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Plus, Search, Truck, Edit, Trash2, Eye, MapPin, Calendar, DollarSign, User } from 'lucide-react'
import { Delivery, Order } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import DeliveryForm from '@/components/delivery/DeliveryForm'

export default function DeliveryPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    // Mock data - replace with API calls
    setDeliveries([
      {
        id: 'del-1',
        orderId: 'order-1',
        commandId: 'CMD-001',
        pickingAddress: {
          id: 'addr-1',
          userId: 'user-1',
          street: '123 Warehouse St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          isDefault: false,
        },
        shippingAddress: {
          id: 'addr-2',
          userId: 'user-1',
          street: '456 Customer Ave',
          city: 'Boston',
          state: 'MA',
          zipCode: '02101',
          country: 'USA',
          isDefault: true,
        },
        deliveryFees: 25.99,
        inChargeOfDelivery: 'John Driver',
        date: new Date().toISOString(),
        status: 'in_transit',
        trackingNumber: 'TRK123456789',
        notes: 'Handle with care',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'in_transit':
        return 'bg-blue-100 text-blue-800'
      case 'picking':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this delivery?')) {
      setDeliveries(deliveries.filter((d) => d.id !== id))
    }
  }

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.commandId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.inChargeOfDelivery.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || delivery.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const onGoingDeliveries = deliveries.filter((d) => d.status !== 'delivered' && d.status !== 'cancelled')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Delivery Management</h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2">Manage all deliveries and track their status</p>
          </div>
          <button
            onClick={() => {
              setSelectedDelivery(null)
              setShowForm(true)
            }}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-5 h-5" />
            <span>Create Delivery</span>
          </button>
        </div>

        {/* On Going Deliveries Summary */}
        {onGoingDeliveries.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-200">On Going Deliveries</h2>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              {onGoingDeliveries.length} delivery{onGoingDeliveries.length !== 1 ? 'ies' : ''} currently in progress
            </p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search by command ID, driver, or tracking number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="picking">Picking</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Deliveries Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Command ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Picking Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Shipping Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Delivery Fees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">In Charge</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {filteredDeliveries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <Truck className="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-slate-400">No deliveries found</p>
                    </td>
                  </tr>
                ) : (
                  filteredDeliveries.map((delivery) => (
                    <tr key={delivery.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                        {delivery.commandId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                          <span className="max-w-xs truncate">
                            {delivery.pickingAddress.city}, {delivery.pickingAddress.state}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                          <span className="max-w-xs truncate">
                            {delivery.shippingAddress.city}, {delivery.shippingAddress.state}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                        {formatCurrency(delivery.deliveryFees)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                          <span>{delivery.inChargeOfDelivery}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                          <span>{formatDate(delivery.date)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(delivery.status)}`}>
                          {delivery.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedDelivery(delivery)
                              setShowForm(true)
                            }}
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 p-2 hover:bg-primary-50 dark:hover:bg-primary-500/20 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(delivery.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-500/20 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showForm && (
          <DeliveryForm
            delivery={selectedDelivery}
            orders={orders}
            onClose={() => {
              setShowForm(false)
              setSelectedDelivery(null)
            }}
            onSave={(delivery) => {
              if (selectedDelivery) {
                setDeliveries(deliveries.map((d) => (d.id === delivery.id ? delivery : d)))
              } else {
                setDeliveries([...deliveries, { ...delivery, id: Date.now().toString() }])
              }
              setShowForm(false)
              setSelectedDelivery(null)
            }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}


