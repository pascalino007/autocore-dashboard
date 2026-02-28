'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Car } from '@/lib/types'
import ImageUpload from '@/components/ui/ImageUpload'
import SuccessModal from '@/components/ui/SuccessModal'

interface CarFormProps {
  car: Car | null
  onClose: () => void
  onSave: (car: Car) => void
}

export default function CarForm({ car, onSave, onClose }: CarFormProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState<Partial<Car>>({
    year: new Date().getFullYear(),
    make: '',
    model: '',
    engine: '',
    fuelType: 'gasoline',
    motorisation: '',
    images: [],
  })

  useEffect(() => {
    if (car) {
      setFormData(car)
    }
  }, [car])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newCar: Car = {
      id: car?.id || Date.now().toString(),
      year: formData.year!,
      make: formData.make!,
      model: formData.model!,
      engine: formData.engine || '',
      fuelType: formData.fuelType || 'gasoline',
      motorisation: formData.motorisation || '',
      images: formData.images || [],
      createdAt: car?.createdAt || new Date().toISOString(),
    }
    onSave(newCar)
    setShowSuccess(true)
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {car ? 'Edit Car' : 'Register New Car'}
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
                Year *
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Make *
              </label>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                placeholder="e.g., Toyota, Honda, Ford"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model *
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g., Camry, Civic, F-150"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Engine
              </label>
              <input
                type="text"
                value={formData.engine}
                onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                placeholder="e.g., 2.0L, V6, 3.5L"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Type *
              </label>
              <select
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              >
                <option value="gasoline">Gasoline</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
                <option value="plug-in_hybrid">Plug-in Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motorisation
              </label>
              <input
                type="text"
                value={formData.motorisation}
                onChange={(e) => setFormData({ ...formData, motorisation: e.target.value })}
                placeholder="e.g., Automatic, Manual, CVT"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Car Images</h3>
            <ImageUpload
              images={formData.images || []}
              onChange={(images) => setFormData({ ...formData, images })}
              multiple={true}
              label="Car Images"
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
              {car ? 'Update Car' : 'Register Car'}
            </button>
          </div>
        </form>

        <SuccessModal
          isOpen={showSuccess}
          onClose={() => {
            setShowSuccess(false)
            onClose()
          }}
          title={car ? 'Car Updated!' : 'Car Registered!'}
          message={car ? 'The car has been updated successfully.' : 'The car has been registered successfully.'}
        />
      </div>
    </div>
  )
}

