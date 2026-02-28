'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { useRouter } from 'next/navigation'
import { Plus, Search, Store, Edit, Trash2, MapPin, Phone, Mail, Package } from 'lucide-react'
import { Shop } from '@/lib/types'
import ShopForm from '@/components/shops/ShopForm'

export default function ShopsPage() {
  const router = useRouter()
  const [shops, setShops] = useState<Shop[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)

  useEffect(() => {
    const loadShops = async () => {
      try {
        const { getShops } = await import('@/lib/api')
        const res = await getShops()
        const items = (res.data || res || []).map((s: any) => ({
          id: String(s.id),
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
        setShops(items)
      } catch (err) {
        console.error('Failed to load shops:', err)
      }
    }
    loadShops()
  }, [])

  const handleEdit = (shop: Shop) => {
    setSelectedShop(shop)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shop?')) return
    try {
      const { deleteShop } = await import('@/lib/api')
      await deleteShop(id)
      setShops(shops.filter((s) => s.id !== id))
    } catch (err) {
      console.error('Failed to delete shop:', err)
      alert('Failed to delete shop. Please try again.')
    }
  }

  const filteredShops = shops.filter((shop) =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.location.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Shops & Suppliers</h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2">Manage shops and suppliers</p>
          </div>
          <button
            onClick={() => {
              setSelectedShop(null)
              setShowForm(true)
            }}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-5 h-5" />
            <span>Register Shop</span>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search shops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-12 text-center">
              <Store className="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-slate-400">No shops found. Register your first shop!</p>
            </div>
          ) : (
            filteredShops.map((shop) => (
            <div key={shop.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md dark:hover:border-slate-600 transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <Store className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-slate-100">{shop.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      shop.type === 'supplier' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300' : 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300'
                    }`}>
                      {shop.type}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">{shop.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  {shop.location.city}, {shop.location.state}
                </div>
                <div className="flex items-center text-gray-600 dark:text-slate-400">
                  <Phone className="w-4 h-4 mr-2" />
                  {shop.phone}
                </div>
                <div className="flex items-center text-gray-600 dark:text-slate-400">
                  <Mail className="w-4 h-4 mr-2" />
                  {shop.email}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => router.push(`/dashboard/shops/${shop.id}/parts`)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  <span>Parts</span>
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(shop)}
                    className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/20 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(shop.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            ))
          )}
        </div>

        {showForm && (
          <ShopForm
            shop={selectedShop}
            onClose={() => {
              setShowForm(false)
              setSelectedShop(null)
            }}
            onSave={async (shop) => {
              try {
                const { createShop, updateShop } = await import('@/lib/api')
                let savedShop;
                
                if (selectedShop) {
                  // Update existing shop
                  const updateData = {
                    name: shop.name,
                    description: shop.description,
                    phone: shop.phone,
                    email: shop.email,
                    street: shop.location?.address,
                    city: shop.location?.city,
                    state: shop.location?.state,
                    zipCode: shop.location?.zipCode,
                    country: shop.location?.country,
                  };
                  savedShop = await updateShop(selectedShop.id, updateData);
                  setShops(shops.map((s) => (s.id === selectedShop.id ? { ...shop, ...savedShop } : s)))
                } else {
                  // Create new shop
                  const createData = {
                    name: shop.name,
                    description: shop.description,
                    phone: shop.phone,
                    email: shop.email,
                    street: shop.location?.address,
                    city: shop.location?.city,
                    state: shop.location?.state,
                    zipCode: shop.location?.zipCode,
                    country: shop.location?.country,
                  };
                  savedShop = await createShop(createData);
                  setShops([...shops, { ...shop, id: savedShop.id }])
                }
                
                setShowForm(false)
                setSelectedShop(null)
              } catch (error) {
                console.error('Failed to save shop:', error)
                alert('Failed to save shop. Please try again.')
              }
            }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
