'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Plus, Car, Search, Edit, Trash2 } from 'lucide-react'
import { Car as CarType } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import CarForm from '@/components/cars/CarForm'

export default function CarsPage() {
  const [cars, setCars] = useState<CarType[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadCars = async () => {
      try {
        const { getCars } = await import('@/lib/api')
        const res = await getCars()
        const items = (res.data || res || []).map((c: any) => ({
          id: String(c.id),
          year: c.year || 0,
          make: c.make || '',
          model: c.model || '',
          engine: c.engine || c.trim || '',
          fuelType: (c.fuelType || '').toUpperCase(),
          motorisation: c.motorisation || c.engine || '',
          images: (c.images || []).map((img: any) => typeof img === 'string' ? img : img.url || ''),
          createdAt: c.createdAt || new Date().toISOString(),
        }))
        setCars(items)
      } catch (err) {
        console.error('Failed to load cars:', err)
      }
    }
    loadCars()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Car Registration</h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2">Register and manage cars for parts compatibility</p>
          </div>
          <button
            onClick={() => {
              setSelectedCar(null)
              setShowForm(true)
            }}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-5 h-5" />
            <span>Register Car</span>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by make, model, or year..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-800/80 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Make</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Model</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Engine</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Fuel Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Motorisation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Registered</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cars.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <Car className="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-slate-400">No cars registered yet. Register your first car!</p>
                    </td>
                  </tr>
                ) : (
                  cars.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-50 dark:bg-slate-800/80 dark:hover:bg-slate-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-100">{car.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">{car.make}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-100">{car.model}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{car.engine}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400 capitalize">{car.fuelType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{car.motorisation}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{formatDate(car.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedCar(car)
                              setShowForm(true)
                            }}
                            className="text-primary-600 hover:text-primary-900 p-2 hover:bg-primary-50 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              if (!confirm('Delete this car?')) return
                              try {
                                const { deleteCar } = await import('@/lib/api')
                                await deleteCar(Number(car.id))
                                setCars(cars.filter((c) => c.id !== car.id))
                              } catch (err) {
                                console.error('Failed to delete car:', err)
                                alert('Failed to delete car. Please try again.')
                              }
                            }}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded"
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
          <CarForm
            car={selectedCar}
            onClose={() => {
              setShowForm(false)
              setSelectedCar(null)
            }}
            onSave={async (car) => {
              try {
                const { createCar, updateCar } = await import('@/lib/api')
                let savedCar;
                
                if (selectedCar) {
                  // Update existing car
                  const updateData = {
                    year: car.year,
                    make: car.make,
                    model: car.model,
                    trim: car.engine,
                    engine: car.engine,
                    fuelType: car.fuelType,
                    transmission: 'MANUAL',
                    bodyType: 'sedan',
                    driveType: 'FWD',
                    vehicleType: 'AUTO',
                  };
                  savedCar = await updateCar(Number(selectedCar.id), updateData);
                  setCars(cars.map((c) => (c.id === selectedCar.id ? { ...car, ...savedCar } : c)))
                } else {
                  // Create new car
                  const createData = {
                    year: car.year,
                    make: car.make,
                    model: car.model,
                    trim: car.engine,
                    engine: car.engine,
                    fuelType: car.fuelType,
                    transmission: 'MANUAL',
                    bodyType: 'sedan',
                    driveType: 'FWD',
                    vehicleType: 'AUTO',
                  };
                  savedCar = await createCar(createData);
                  setCars([...cars, { ...car, id: savedCar.id }])
                }
                
                setShowForm(false)
                setSelectedCar(null)
              } catch (error) {
                console.error('Failed to save car:', error)
                alert('Failed to save car. Please try again.')
              }
            }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}


