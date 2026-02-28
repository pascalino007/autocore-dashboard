'use client'

import { X, User, Car, ShoppingCart, CreditCard, MapPin, Mail, Phone, Calendar } from 'lucide-react'
import { User as UserType, Order, Payment, Car as CarType } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

interface UserDetailProps {
  user: UserType
  orders: Order[]
  payments: Payment[]
  onClose: () => void
}

export default function UserDetail({ user, orders, payments, onClose }: UserDetailProps) {
  const userOrders = orders.filter((o) => o.userId === user.id)
  const userPayments = payments.filter((p) => {
    const order = orders.find((o) => o.id === p.orderId)
    return order?.userId === user.id
  })
  const userCars = user.garage?.[0]?.cars || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'on_going':
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="px-2 py-1 bg-primary-200 text-primary-800 rounded-full text-xs font-medium capitalize">
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Joined: {formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cars */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Car className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Cars ({userCars.length})</h3>
              </div>
              {userCars.length === 0 ? (
                <p className="text-sm text-gray-500">No cars registered</p>
              ) : (
                <div className="space-y-3">
                  {userCars.map((car) => (
                    <div key={car.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {car.year} {car.make} {car.model}
                          </p>
                          <p className="text-sm text-gray-500">
                            {car.engine} • {car.fuelType} • {car.motorisation}
                          </p>
                        </div>
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Car className="w-5 h-5 text-primary-600" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Addresses */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Addresses ({user.addresses?.length || 0})
                </h3>
              </div>
              {!user.addresses || user.addresses.length === 0 ? (
                <p className="text-sm text-gray-500">No addresses registered</p>
              ) : (
                <div className="space-y-3">
                  {user.addresses.map((address) => (
                    <div key={address.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{address.street}</p>
                          <p className="text-sm text-gray-500">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="text-sm text-gray-500">{address.country}</p>
                        </div>
                        {address.isDefault && (
                          <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingCart className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Orders ({userOrders.length})
              </h3>
            </div>
            {userOrders.length === 0 ? (
              <p className="text-sm text-gray-500">No orders found</p>
            ) : (
              <div className="space-y-3">
                {userOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="text-sm text-gray-600 flex justify-between">
                          <span>{item.partName} x {item.quantity}</span>
                          <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Transactions ({userPayments.length})
              </h3>
            </div>
            {userPayments.length === 0 ? (
              <p className="text-sm text-gray-500">No transactions found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{payment.transactionId}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 capitalize">
                          {payment.method.replace('_', ' ')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {formatDate(payment.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


