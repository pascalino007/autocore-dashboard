'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Search, Car, User, Package, ChevronRight, ChevronDown } from 'lucide-react'
import { User as UserType, Car as CarType, Part } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

export default function GaragePage() {
  const [users, setUsers] = useState<UserType[]>([])
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null)
  const [compatibleParts, setCompatibleParts] = useState<Part[]>([])
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Mock data - replace with API call
    const mockUsers: UserType[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
        createdAt: new Date().toISOString(),
        garage: [
          {
            id: 'garage-1',
            userId: '1',
            cars: [
              {
                id: 'car-1',
                year: 2020,
                make: 'Toyota',
                model: 'Camry',
                engine: '2.5L',
                fuelType: 'gasoline',
                motorisation: 'Automatic',
                images: [],
                createdAt: new Date().toISOString(),
              },
              {
                id: 'car-2',
                year: 2018,
                make: 'Honda',
                model: 'Civic',
                engine: '1.5L',
                fuelType: 'gasoline',
                motorisation: 'Manual',
                images: [],
                createdAt: new Date().toISOString(),
              },
            ],
          },
        ],
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'customer',
        createdAt: new Date().toISOString(),
        garage: [
          {
            id: 'garage-2',
            userId: '2',
            cars: [
              {
                id: 'car-3',
                year: 2021,
                make: 'Ford',
                model: 'F-150',
                engine: '3.5L V6',
                fuelType: 'gasoline',
                motorisation: 'Automatic',
                images: [],
                createdAt: new Date().toISOString(),
              },
            ],
          },
        ],
      },
    ]
    setUsers(mockUsers)
  }, [])

  useEffect(() => {
    if (selectedCar) {
      // Mock compatible parts - replace with API call
      const mockParts: Part[] = [
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
          images: [],
          badges: ['new'],
          rating: 4.5,
          reviews: 125,
          availability: 'in_stock',
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
          images: [],
          badges: [],
          rating: 4.8,
          reviews: 234,
          availability: 'in_stock',
          compatibility: [1, 2], // Compatible with specific cars
          brand: { id: 2, name: 'BrakeMax', slug: 'brakemax' },
          tags: ['brakes', 'pads'],
          type: { id: 2, name: 'Brakes', slug: 'brakes' },
          categories: [],
          attributes: [],
          options: [],
        },
      ]
      setCompatibleParts(mockParts)
    }
  }, [selectedCar])

  const toggleUser = (userId: string) => {
    const newExpanded = new Set(expandedUsers)
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId)
      setSelectedUser(null)
      setSelectedCar(null)
      setCompatibleParts([])
    } else {
      newExpanded.add(userId)
    }
    setExpandedUsers(newExpanded)
  }

  const handleCarSelect = (car: CarType, user: UserType) => {
    setSelectedCar(car)
    setSelectedUser(user)
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">User Garage</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-2">View users, their cars, and compatible parts</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users and Cars List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50">
                <h2 className="font-semibold text-gray-900 dark:text-slate-100">Users & Cars</h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center">
                    <User className="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-slate-400">No users found</p>
                  </div>
                ) : (
                  filteredUsers.map((user) => {
                    const isExpanded = expandedUsers.has(user.id)
                    const userCars = user.garage?.[0]?.cars || []

                    return (
                      <div key={user.id}>
                        <div
                          className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer"
                          onClick={() => toggleUser(user.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                              )}
                              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-primary-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-slate-100">{user.name}</p>
                                <p className="text-sm text-gray-500 dark:text-slate-400">{user.email}</p>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-slate-400 bg-gray-100 px-2 py-1 rounded">
                              {userCars.length} car{userCars.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="bg-gray-50 pl-12 pr-4 pb-4 space-y-2">
                            {userCars.length === 0 ? (
                              <p className="text-sm text-gray-500 dark:text-slate-400 py-2">No cars registered</p>
                            ) : (
                              userCars.map((car) => (
                                <div
                                  key={car.id}
                                  onClick={() => handleCarSelect(car, user)}
                                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                    selectedCar?.id === car.id
                                      ? 'bg-primary-50 border-primary-300'
                                      : 'bg-white border-gray-200 dark:border-slate-700 hover:border-primary-300'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2">
                                    <Car className="w-4 h-4 text-primary-600" />
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900 dark:text-slate-100 text-sm">
                                        {car.year} {car.make} {car.model}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-slate-400">
                                        {car.engine} • {car.fuelType}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* Selected Car Details & Compatible Parts */}
          <div className="lg:col-span-2 space-y-6">
            {selectedCar && selectedUser ? (
              <>
                {/* Car Details */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                        {selectedCar.year} {selectedCar.make} {selectedCar.model}
                      </h2>
                      <p className="text-gray-600 dark:text-slate-400 mt-1">
                        Owner: <span className="font-medium">{selectedUser.name}</span>
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Car className="w-8 h-8 text-primary-600" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-slate-400">Engine</p>
                      <p className="font-medium text-gray-900 dark:text-slate-100">{selectedCar.engine || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-slate-400">Fuel Type</p>
                      <p className="font-medium text-gray-900 dark:text-slate-100 capitalize">{selectedCar.fuelType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-slate-400">Motorisation</p>
                      <p className="font-medium text-gray-900 dark:text-slate-100">{selectedCar.motorisation || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-slate-400">Year</p>
                      <p className="font-medium text-gray-900 dark:text-slate-100">{selectedCar.year}</p>
                    </div>
                  </div>
                </div>

                {/* Compatible Parts */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Compatible Parts</h2>
                    <span className="text-sm text-gray-500 dark:text-slate-400">
                      {compatibleParts.length} part{compatibleParts.length !== 1 ? 's' : ''} found
                    </span>
                  </div>

                  {compatibleParts.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-slate-400">No compatible parts found for this car</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {compatibleParts.map((part) => (
                        <div
                          key={part.id}
                          className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              {part.images && part.images.length > 0 ? (
                                <img
                                  src={part.images[0]}
                                  alt={part.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <Package className="w-8 h-8 text-gray-400 dark:text-slate-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 dark:text-slate-100 truncate">{part.name}</h3>
                              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">{part.excerpt}</p>
                              <div className="flex items-center justify-between mt-3">
                                <div>
                                  <p className="text-lg font-bold text-primary-600">
                                    {formatCurrency(part.price)}
                                  </p>
                                  {part.compareAtPrice && (
                                    <p className="text-sm text-gray-400 dark:text-slate-500 line-through">
                                      {formatCurrency(part.compareAtPrice)}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center space-x-1">
                                    <span className="text-yellow-500">⭐</span>
                                    <span className="text-sm text-gray-600 dark:text-slate-400">
                                      {part.rating || 0} ({part.reviews || 0})
                                    </span>
                                  </div>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
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
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-12 text-center">
                <Car className="w-16 h-16 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-slate-400">Select a user and car to view compatible parts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}


