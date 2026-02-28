'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Order, ProcessingInfo, Address } from '@/lib/types'
import SuccessModal from '@/components/ui/SuccessModal'

interface ProcessingFormProps {
  order: Order
  onClose: () => void
  onSave: (processingInfo: ProcessingInfo) => void
}

export default function ProcessingForm({ order, onSave, onClose }: ProcessingFormProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState<Partial<ProcessingInfo>>({
    orderId: order.id,
    pickingAddress: {
      id: '',
      userId: order.userId,
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false,
    },
    shippingAddress: order.shippingAddress,
    deliveryFees: 0,
    inChargeOfDelivery: '',
    estimatedDeliveryDate: '',
    trackingNumber: '',
    notes: '',
  })

  useEffect(() => {
    if (order.processingInfo) {
      setFormData(order.processingInfo)
    }
  }, [order])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const processingInfo: ProcessingInfo = {
      orderId: order.id,
      pickingAddress: formData.pickingAddress!,
      shippingAddress: formData.shippingAddress!,
      deliveryFees: formData.deliveryFees || 0,
      inChargeOfDelivery: formData.inChargeOfDelivery!,
      estimatedDeliveryDate: formData.estimatedDeliveryDate!,
      trackingNumber: formData.trackingNumber,
      notes: formData.notes,
    }
    onSave(processingInfo)
    setShowSuccess(true)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Processing Information</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Order ID:</strong> #{order.id.slice(0, 8)}
            </p>
            <p className="text-sm text-blue-800 mt-1">
              <strong>Total:</strong> ${order.total.toFixed(2)}
            </p>
          </div>

          {/* Picking Address */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Picking Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
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

          {/* Shipping Address (Read-only, from order) */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}, {order.shippingAddress.country}
              </p>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Delivery Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Fees *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.deliveryFees || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, deliveryFees: parseFloat(e.target.value) || 0 })
                  }
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
                  value={formData.inChargeOfDelivery || ''}
                  onChange={(e) => setFormData({ ...formData, inChargeOfDelivery: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Delivery Date *
                </label>
                <input
                  type="date"
                  value={formData.estimatedDeliveryDate || ''}
                  onChange={(e) => setFormData({ ...formData, estimatedDeliveryDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
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
              Save Processing Info
            </button>
          </div>
        </form>

        <SuccessModal
          isOpen={showSuccess}
          onClose={() => {
            setShowSuccess(false)
            onClose()
          }}
          title="Processing Information Saved!"
          message="The processing information has been saved successfully."
        />
      </div>
    </div>
  )
}


