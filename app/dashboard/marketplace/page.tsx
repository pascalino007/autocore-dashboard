'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Plus, Car, Search, Edit, Trash2, Eye } from 'lucide-react'
import { SecondHandVehicle } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function MarketplacePage() {
  const [vehicles, setVehicles] = useState<SecondHandVehicle[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const { getMarketplaceListings } = await import('@/lib/api')
        const res = await getMarketplaceListings()
        const items = (res.data || res || []).map((v: any) => ({
          id: String(v.id),
          type: v.type || 'car',
          make: v.make || '',
          model: v.model || '',
          year: v.year || 0,
          mileage: v.mileage || 0,
          price: Number(v.price) || 0,
          condition: v.condition || 'good',
          description: v.description || '',
          images: (v.images || []).map((img: any) => typeof img === 'string' ? img : img.url || ''),
          sellerId: v.userId || v.sellerId || '',
          location: { city: v.city || '', state: v.state || '', country: v.country || '' },
          status: v.status || 'active',
          createdAt: v.createdAt || '',
        }))
        setVehicles(items)
      } catch (err) {
        console.error('Failed to load marketplace:', err)
      }
    }
    loadVehicles()
  }, [])

  const getTypeIcon = (type: string) => {
    return <Car className="w-5 h-5" />
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'bg-green-100 text-green-800'
      case 'good':
        return 'bg-blue-100 text-blue-800'
      case 'fair':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-red-100 text-red-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Second Hand Marketplace</h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2">Manage used cars, motorcycles, buses and more</p>
          </div>
          <button className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            <Plus className="w-5 h-5" />
            <span>Add Listing</span>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-12 text-center">
              <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-slate-400">No vehicles listed yet</p>
            </div>
          ) : (
            vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {getTypeIcon(vehicle.type)}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(vehicle.condition)}`}>
                      {vehicle.condition}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-slate-400 mb-4">
                    <p>Type: <span className="font-medium capitalize">{vehicle.type}</span></p>
                    <p>Mileage: <span className="font-medium">{vehicle.mileage.toLocaleString()} miles</span></p>
                    <p>Location: <span className="font-medium">{vehicle.location.city}, {vehicle.location.state}</span></p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                    <p className="text-xl font-bold text-primary-600">{formatCurrency(vehicle.price)}</p>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-primary-600 hover:bg-primary-50 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-primary-600 hover:bg-primary-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}


