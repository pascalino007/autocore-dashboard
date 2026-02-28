'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Shop } from '@/lib/types'
import ImageUpload from '@/components/ui/ImageUpload'
import SuccessModal from '@/components/ui/SuccessModal'

interface MechanicFormProps {
  mechanic: Shop | null
  onClose: () => void
  onSave: (mechanic: Shop) => void
}

export default function MechanicForm({ mechanic, onSave, onClose }: MechanicFormProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState<Partial<Shop>>({
    name: '',
    description: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    phone: '',
    email: '',
    type: 'mechanic',
    images: [],
  })

  useEffect(() => {
    if (mechanic) {
      setFormData(mechanic)
    }
  }, [mechanic])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newMechanic: Shop = {
      id: mechanic?.id || Date.now().toString(),
      ownerId: mechanic?.ownerId || 'owner-1',
      name: formData.name!,
      description: formData.description || '',
      location: formData.location!,
      phone: formData.phone!,
      email: formData.email!,
      type: 'mechanic',
      images: formData.images || [],
      createdAt: mechanic?.createdAt || new Date().toISOString(),
    }
    onSave(newMechanic)
    setShowSuccess(true)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {mechanic ? 'Edit Mechanic Shop' : 'Register New Mechanic Shop'}
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
                Shop Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                value={formData.location?.address || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location!, address: e.target.value },
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
                value={formData.location?.city || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location!, city: e.target.value },
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
                value={formData.location?.state || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location!, state: e.target.value },
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
                value={formData.location?.zipCode || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location!, zipCode: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                value={formData.location?.country || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location!, country: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Shop Images</h3>
            <ImageUpload
              images={formData.images || []}
              onChange={(images) => setFormData({ ...formData, images })}
              multiple={true}
              label="Shop Images"
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
              {mechanic ? 'Update Mechanic' : 'Register Mechanic'}
            </button>
          </div>
        </form>

        <SuccessModal
          isOpen={showSuccess}
          onClose={() => {
            setShowSuccess(false)
            onClose()
          }}
          title={mechanic ? 'Mechanic Updated!' : 'Mechanic Registered!'}
          message={mechanic ? 'The mechanic shop has been updated successfully.' : 'The mechanic shop has been registered successfully.'}
        />
      </div>
    </div>
  )
}


