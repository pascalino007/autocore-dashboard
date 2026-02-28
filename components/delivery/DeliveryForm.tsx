'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Delivery, Order, Address } from '@/lib/types'
import SuccessModal from '@/components/ui/SuccessModal'

interface DeliveryFormProps {
  delivery: Delivery | null
  orders: Order[]
  onClose: () => void
  onSave: (delivery: Delivery) => void
}

export default function DeliveryForm({ delivery, orders, onSave, onClose }: DeliveryFormProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState<Partial<Delivery>>({
    commandId: '',
    orderId: '',
    pickingAddress: {
      id: '',
      userId: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false,
    },
    shippingAddress: {
      id: '',
      userId: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false,
    },
    deliveryFees: 0,
    inChargeOfDelivery: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    trackingNumber: '',
    notes: '',
  })

  useEffect(() => {
    if (delivery) {
      setFormData(delivery)
    }
  }, [delivery])

  useEffect(() => {
    if (formData.orderId) {
      const selectedOrder = orders.find((o) => o.id === formData.orderId)
      if (selectedOrder) {
        setFormData({
          ...formData,
          shippingAddress: selectedOrder.shippingAddress,
          pickingAddress: selectedOrder.processingInfo?.pickingAddress || formData.pickingAddress,
        })
      }
    }
  }, [formData.orderId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newDelivery: Delivery = {
      id: delivery?.id || Date.now().toString(),
      orderId: formData.orderId!,
      commandId: formData.commandId!,
      pickingAddress: formData.pickingAddress!,
      shippingAddress: formData.shippingAddress!,
      deliveryFees: formData.deliveryFees || 0,
      inChargeOfDelivery: formData.inChargeOfDelivery!,
      date: formData.date!,
      status: formData.status || 'pending',
      trackingNumber: formData.trackingNumber,
      notes: formData.notes,
      createdAt: delivery?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    onSave(newDelivery)
    setShowSuccess(true)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {delivery ? 'Edit Delivery' : 'Create Delivery'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order *
              </label>
              <select
                value={formData.orderId}
                onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              >
                <option value="">Select Order</option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    Order #{order.id.slice(0, 8)} - ${order.total.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Command ID *
              </label>
              <input
                type="text"
                value={formData.commandId}
                onChange={(e) => setFormData({ ...formData, commandId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
                placeholder="CMD-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Fees *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.deliveryFees || 0}
                onChange={(e) => setFormData({ ...formData, deliveryFees: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                In Charge of Delivery *
              </label>
              <input
                type="text"
                value={formData.inChargeOfDelivery}
                onChange={(e) => setFormData({ ...formData, inChargeOfDelivery: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Delivery['status'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              >
                <option value="pending">Pending</option>
                <option value="picking">Picking</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking Number
              </label>
              <input
                type="text"
                value={formData.trackingNumber || ''}
                onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Picking Address */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Picking Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                <input
                  type="text"
                  value={formData.pickingAddress?.street || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pickingAddress: { ...formData.pickingAddress!, street: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  value={formData.pickingAddress?.city || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pickingAddress: { ...formData.pickingAddress!, city: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <input
                  type="text"
                  value={formData.pickingAddress?.state || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pickingAddress: { ...formData.pickingAddress!, state: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                <input
                  type="text"
                  value={formData.pickingAddress?.zipCode || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pickingAddress: { ...formData.pickingAddress!, zipCode: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  value={formData.pickingAddress?.country || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pickingAddress: { ...formData.pickingAddress!, country: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                <input
                  type="text"
                  value={formData.shippingAddress?.street || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: { ...formData.shippingAddress!, street: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  value={formData.shippingAddress?.city || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: { ...formData.shippingAddress!, city: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <input
                  type="text"
                  value={formData.shippingAddress?.state || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: { ...formData.shippingAddress!, state: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                <input
                  type="text"
                  value={formData.shippingAddress?.zipCode || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: { ...formData.shippingAddress!, zipCode: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  value={formData.shippingAddress?.country || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: { ...formData.shippingAddress!, country: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {delivery ? 'Update Delivery' : 'Create Delivery'}
            </button>
          </div>
        </form>

        <SuccessModal
          isOpen={showSuccess}
          onClose={() => {
            setShowSuccess(false)
            onClose()
          }}
          title={delivery ? 'Delivery Updated!' : 'Delivery Created!'}
          message={delivery ? 'The delivery has been updated successfully.' : 'The delivery has been created successfully.'}
        />
      </div>
    </div>
  )
}


