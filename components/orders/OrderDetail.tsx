'use client'

import { useState } from 'react'
import { X, CheckCircle, XCircle, Store, Package, Truck } from 'lucide-react'
import { Order, Shop } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import ProcessingForm from './ProcessingForm'

interface OrderDetailProps {
  order: Order
  shops: Shop[]
  onClose: () => void
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void
  onUpdateItemStatus: (orderId: string, itemId: string, status: 'accepted' | 'rejected') => void
  onSaveProcessingInfo: (processingInfo: any) => void
}

export default function OrderDetail({
  order,
  shops,
  onClose,
  onUpdateOrderStatus,
  onUpdateItemStatus,
  onSaveProcessingInfo,
}: OrderDetailProps) {
  const [showProcessingForm, setShowProcessingForm] = useState(false)
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
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getItemStatusColor = (status?: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getShopName = (shopId: string) => {
    const shop = shops.find((s) => s.id === shopId)
    return shop?.name || 'Unknown Shop'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500 mt-1">Order #{order.id.slice(0, 8)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Status</p>
              <p className={`mt-1 text-sm font-medium px-2 py-1 rounded-full inline-block ${getStatusColor(order.status)}`}>
                {order.status.replace('_', ' ')}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Total</p>
              <p className="mt-1 text-lg font-bold text-gray-900">{formatCurrency(order.total)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Date</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          {/* Order Actions */}
          {order.status === 'pending' && (
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 flex-1">Order is pending. Choose an action:</p>
              <button
                onClick={() => onUpdateOrderStatus(order.id, 'accepted')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Accept Order</span>
              </button>
              <button
                onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Order</span>
              </button>
            </div>
          )}

          {/* Status Update for Accepted Orders */}
          {order.status === 'accepted' && (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 flex-1">Order is accepted. Add processing information:</p>
                <button
                  onClick={() => setShowProcessingForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Truck className="w-4 h-4" />
                  <span>Add Processing Info</span>
                </button>
              </div>
              {order.processingInfo && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 flex-1 mb-2">Processing information added. Update status:</p>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'on_going')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Mark as On Going
                    </button>
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status Update for On Going Orders */}
          {order.status === 'on_going' && (
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 flex-1">Order is on going. Update status:</p>
              <button
                onClick={() => onUpdateOrderStatus(order.id, 'processing')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Mark as Processing
              </button>
              <button
                onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel Order
              </button>
            </div>
          )}

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Package className="w-5 h-5 text-gray-400" />
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.partName}</h4>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="ml-8 space-y-2">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-600">
                            Price: <span className="font-medium">{formatCurrency(item.price)}</span>
                          </span>
                          <span className="text-gray-600">
                            Subtotal: <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Status:</span>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${getItemStatusColor(item.status)}`}
                          >
                            {item.status || 'pending'}
                          </span>
                        </div>
                        {item.shopId && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Store className="w-4 h-4" />
                            <span>Supplier: {getShopName(item.shopId)}</span>
                          </div>
                        )}
                        {item.suppliers && item.suppliers.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Available Suppliers:</p>
                            <div className="flex flex-wrap gap-2">
                              {item.suppliers.map((supplierId) => (
                                <span
                                  key={supplierId}
                                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                                >
                                  {getShopName(supplierId)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {(!item.status || item.status === 'pending') && order.status !== 'cancelled' && (
                        <>
                          <button
                            onClick={() => onUpdateItemStatus(order.id, item.id, 'accepted')}
                            className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => onUpdateItemStatus(order.id, item.id, 'rejected')}
                            className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showProcessingForm && (
          <ProcessingForm
            order={order}
            onClose={() => setShowProcessingForm(false)}
            onSave={(processingInfo) => {
              onSaveProcessingInfo(processingInfo)
              setShowProcessingForm(false)
            }}
          />
        )}
      </div>
    </div>
  )
}

