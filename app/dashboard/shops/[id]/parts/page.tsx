'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { ArrowLeft, Package, Search } from 'lucide-react'
import { Shop, Part } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import PartDetail from '@/components/parts/PartDetail'

export default function ShopPartsPage() {
  const params = useParams()
  const router = useRouter()
  const shopId = params.id as string
  const [shop, setShop] = useState<Shop | null>(null)
  const [parts, setParts] = useState<Part[]>([])
  const [selectedPart, setSelectedPart] = useState<Part | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Mock data - replace with API calls
    setShop({
      id: shopId,
      ownerId: 'owner-1',
      name: 'AutoParts Pro',
      description: 'Premium auto parts supplier',
      location: {
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      images: [],
      phone: '+1-555-0123',
      email: 'contact@autopartspro.com',
      type: 'supplier',
      createdAt: new Date().toISOString(),
    })

    // Mock parts for this shop
    setParts([
      {
        id: 1,
        name: 'Premium Oil Filter',
        excerpt: 'High-quality oil filter',
        description: 'High-quality oil filter for optimal engine performance',
        slug: 'premium-oil-filter',
        sku: 'OF-001',
        partNumber: 'PN-12345',
        stock: { quantity: 100, status: 'in_stock' },
        price: 29.99,
        compareAtPrice: 39.99,
        images: ['/api/placeholder/400/300'],
        badges: ['new'],
        rating: 4.5,
        reviews: 125,
        availability: 'in_stock',
        condition: 'new',
        compatibility: 'all',
        brand: { id: 1, name: 'AutoPro', slug: 'autopro' },
        tags: ['oil', 'filter'],
        type: { id: 1, name: 'Filter', slug: 'filter' },
        categories: [],
        attributes: [],
        options: [],
      },
      {
        id: 2,
        name: 'Brake Pads Set',
        excerpt: 'Premium brake pads',
        description: 'High-performance brake pads for reliable stopping power',
        slug: 'brake-pads-set',
        sku: 'BP-002',
        partNumber: 'PN-12346',
        stock: { quantity: 50, status: 'in_stock' },
        price: 89.99,
        compareAtPrice: null,
        images: ['/api/placeholder/400/300'],
        badges: [],
        rating: 4.8,
        reviews: 234,
        availability: 'in_stock',
        condition: 'new',
        compatibility: [1, 2],
        brand: { id: 2, name: 'BrakeMax', slug: 'brakemax' },
        tags: ['brakes', 'pads'],
        type: { id: 2, name: 'Brakes', slug: 'brakes' },
        categories: [],
        attributes: [],
        options: [],
      },
    ])
  }, [shopId])

  const filteredParts = parts.filter((part) =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (part.sku && part.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/shops')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
              {shop?.name || 'Shop'} - Parts
            </h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2">All parts available from this shop</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search parts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredParts.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-slate-400">No parts found</p>
            </div>
          ) : (
            filteredParts.map((part) => (
              <div
                key={part.id}
                onClick={() => setSelectedPart(part)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="aspect-square bg-gray-100 relative">
                  {part.images && part.images.length > 0 ? (
                    <img
                      src={part.images[0]}
                      alt={part.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  {part.badges && part.badges.length > 0 && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                        {part.badges[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-1 line-clamp-2">{part.name}</h3>
                  {part.brand && (
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">{part.brand.name}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="text-lg font-bold text-primary-600">{formatCurrency(part.price)}</p>
                      {part.compareAtPrice && (
                        <p className="text-xs text-gray-400 line-through">{formatCurrency(part.compareAtPrice)}</p>
                      )}
                    </div>
                    {part.rating && (
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm text-gray-600 dark:text-slate-400">{part.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        part.stock.status === 'in_stock'
                          ? 'bg-green-100 text-green-800'
                          : part.stock.status === 'low_stock'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {part.stock.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedPart && (
          <PartDetail part={selectedPart} onClose={() => setSelectedPart(null)} />
        )}
      </div>
    </DashboardLayout>
  )
}


