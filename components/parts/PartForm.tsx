'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { Part, IProductStock, IBrand, IProductType, IShopCategory, IProductAttribute, IProductOption, Category, SubCategory } from '@/lib/types'
import ImageUpload from '@/components/ui/ImageUpload'
import SuccessModal from '@/components/ui/SuccessModal'

interface PartFormProps {
  part: Part | null
  onClose: () => void
  onSave: (part: Part) => void
}

export default function PartForm({ part, onSave, onClose }: PartFormProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  
  // Car compatibility state
  const [carMakes, setCarMakes] = useState<string[]>([])
  const [carModels, setCarModels] = useState<string[]>([])
  const [carYears, setCarYears] = useState<number[]>([])
  const [carTrims, setCarTrims] = useState<Array<{ id: string; trim: string; engine?: string; fuelType?: string; transmission?: string }>>([])
  const [selectedMake, setSelectedMake] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedYear, setSelectedYear] = useState<number | ''>('')
  const [selectedTrims, setSelectedTrims] = useState<string[]>([])
  const [compatibleCars, setCompatibleCars] = useState<Array<{ id: string; make: string; model: string; year: number; trim?: string }>>([])
  
  const [formData, setFormData] = useState<Partial<Part>>({
    name: '',
    excerpt: '',
    description: '',
    slug: '',
    sku: '',
    partNumber: '',
    stock: { quantity: 0, status: 'in_stock' },
    price: 0,
    compareAtPrice: null,
    images: [],
    badges: [],
    rating: 0,
    reviews: 0,
    availability: 'in_stock',
    isFeatured: false,
    condition: 'new',
    vehicleType: 'AUTO',
    compatibility: 'unknown',
    brand: null,
    tags: [],
    type: { id: 0, name: '', slug: '' },
    categoryId: undefined,
    subCategoryId: undefined,
    categories: [],
    attributes: [],
    options: [],
    customFields: {},
    compatibleCarIds: [],
  })

  useEffect(() => {
    // Fetch categories and subcategories from API
    const loadCategories = async () => {
      try {
        const { getCategories } = await import('@/lib/api')
        const res = await getCategories({ depth: '2' })
        const items = Array.isArray(res) ? res : (res.data || [])
        const cats: Category[] = []
        const subs: SubCategory[] = []
        items.forEach((c: any) => {
          cats.push({ id: c.id, name: c.name, slug: c.slug, description: c.description || '' })
          if (c.children) {
            c.children.forEach((child: any) => {
              subs.push({ id: child.id, categoryId: c.id, name: child.name, slug: child.slug, description: child.description || '' })
            })
          }
        })
        setCategories(cats)
        setSubCategories(subs)
      } catch (err) {
        console.error('Failed to load categories:', err)
      }
    }
    loadCategories()
    
    // Fetch car makes and years
    fetchCarData()
  }, [])

  useEffect(() => {
    if (part) {
      setFormData(part)
    }
  }, [part])

  useEffect(() => {
    if (!part && formData.name) {
      setFormData((prev) => ({
        ...prev,
        slug: prev.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '',
      }))
    }
  }, [formData.name, part])

  // Refetch vehicle data when vehicleType changes
  useEffect(() => {
    if (formData.compatibility === 'specific') {
      fetchCarData()
      // Reset selections when vehicle type changes
      setSelectedMake('')
      setSelectedModel('')
      setSelectedYear('')
      setSelectedTrims([])
      setCarModels([])
      setCarTrims([])
    }
  }, [formData.vehicleType])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newPart: Part = {
      id: part?.id || Date.now(),
      name: formData.name!,
      excerpt: formData.excerpt || formData.description?.substring(0, 150) || '',
      description: formData.description || '',
      slug: formData.slug || formData.name?.toLowerCase().replace(/\s+/g, '-') || '',
      sku: formData.sku,
      partNumber: formData.partNumber!,
      stock: formData.stock || { quantity: 0, status: 'in_stock' },
      price: formData.price || 0,
      compareAtPrice: formData.compareAtPrice || null,
      images: formData.images || [],
      badges: formData.badges || [],
      rating: formData.rating,
      reviews: formData.reviews,
      availability: formData.availability,
      isFeatured: !!formData.isFeatured,
      compatibility: formData.compatibility || 'unknown',
      vehicleType: formData.vehicleType || 'AUTO',
      brand: formData.brand || null,
      tags: formData.tags || [],
      type: formData.type || { id: 0, name: '', slug: '' },
      categoryId: formData.categoryId,
      subCategoryId: formData.subCategoryId,
      condition: formData.condition || 'new',
      categories: formData.categories || [],
      attributes: formData.attributes || [],
      options: formData.options || [],
      customFields: formData.customFields || {},
      compatibleCarIds: compatibleCars.map(c => c.id),
    }
    onSave(newPart)
    setShowSuccess(true)
  }

  const fetchCarData = async () => {
    try {
      const vehicleType = formData.vehicleType || 'AUTO'
      const { getCarMakes, getCarYears } = await import('@/lib/api')
      const [makes, years] = await Promise.all([
        getCarMakes(vehicleType),
        getCarYears(vehicleType)
      ])
      setCarMakes(makes || [])
      setCarYears(years || [])
    } catch (err) {
      console.error('Failed to fetch vehicle data:', err)
    }
  }

  // Fetch models when make changes
  const handleMakeChange = async (make: string) => {
    setSelectedMake(make)
    setSelectedModel('')
    setSelectedYear('')
    setSelectedTrims([])
    setCarModels([])
    setCarTrims([])
    
    if (make) {
      try {
        const vehicleType = formData.vehicleType || 'AUTO'
        const { getCarModels } = await import('@/lib/api')
        const models = await getCarModels(make, vehicleType)
        setCarModels(models || [])
      } catch (err) {
        console.error('Failed to fetch models:', err)
      }
    }
  }
  
  // Fetch trims when model and year change
  const handleModelChange = async (model: string) => {
    setSelectedModel(model)
    setSelectedYear('')
    setSelectedTrims([])
    setCarTrims([])
  }
  
  const handleYearChange = async (year: number) => {
    setSelectedYear(year)
    setSelectedTrims([])
    
    if (selectedMake && selectedModel && year) {
      try {
        const vehicleType = formData.vehicleType || 'AUTO'
        const { getCarTrims } = await import('@/lib/api')
        const trims = await getCarTrims(selectedMake, selectedModel, year, vehicleType)
        setCarTrims(trims || [])
      } catch (err) {
        console.error('Failed to fetch trims:', err)
      }
    }
  }
  
  // Add compatible vehicle
  const addCompatibleVehicle = () => {
    if (!selectedMake || !selectedModel || !selectedYear) return
    
    const selectedTrimIds = selectedTrims.length > 0 ? selectedTrims : ['']
    
    selectedTrimIds.forEach(trimId => {
      const trim = trimId ? carTrims.find(t => t.id === trimId)?.trim : undefined
      
      const newVehicle = {
        id: trimId || `${selectedMake}-${selectedModel}-${selectedYear}`,
        make: selectedMake,
        model: selectedModel,
        year: Number(selectedYear),
        trim: trim,
      }
      
      // Check if already exists
      const exists = compatibleCars.some(c => 
        c.make === newVehicle.make && 
        c.model === newVehicle.model && 
        c.year === newVehicle.year &&
        c.trim === newVehicle.trim
      )
      
      if (!exists) {
        setCompatibleCars(prev => [...prev, newVehicle])
      }
    })
    
    // Reset selections
    setSelectedMake('')
    setSelectedModel('')
    setSelectedYear('')
    setSelectedTrims([])
    setCarModels([])
    setCarTrims([])
  }
  
  // Remove compatible vehicle
  const removeCompatibleVehicle = (index: number) => {
    setCompatibleCars(prev => prev.filter((_, i) => i !== index))
  }

  const addAttribute = () => {
    setFormData({
      ...formData,
      attributes: [...(formData.attributes || []), { name: '', value: '', type: 'text' }],
    })
  }

  const removeAttribute = (index: number) => {
    setFormData({
      ...formData,
      attributes: formData.attributes?.filter((_, i) => i !== index) || [],
    })
  }

  const updateAttribute = (index: number, field: keyof IProductAttribute, value: any) => {
    const updated = [...(formData.attributes || [])]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, attributes: updated })
  }

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...(formData.options || []), { name: '', values: [], required: false }],
    })
  }

  const removeOption = (index: number) => {
    setFormData({
      ...formData,
      options: formData.options?.filter((_, i) => i !== index) || [],
    })
  }

  const updateOption = (index: number, field: keyof IProductOption, value: any) => {
    const updated = [...(formData.options || [])]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, options: updated })
  }

  const addOptionValue = (optionIndex: number) => {
    const updated = [...(formData.options || [])]
    updated[optionIndex].values = [...updated[optionIndex].values, '']
    setFormData({ ...formData, options: updated })
  }

  const removeOptionValue = (optionIndex: number, valueIndex: number) => {
    const updated = [...(formData.options || [])]
    updated[optionIndex].values = updated[optionIndex].values.filter((_, i) => i !== valueIndex)
    setFormData({ ...formData, options: updated })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {part ? 'Edit Part' : 'Add New Part'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Part Name *
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
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="isFeatured"
                  type="checkbox"
                  checked={!!formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                  Featured product
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  value={formData.sku || ''}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Part Number *
                </label>
                <input
                  type="text"
                  value={formData.partNumber}
                  onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt (Short Description) *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
                placeholder="Brief description without HTML tags"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Images</h3>
            <ImageUpload
              images={formData.images || []}
              onChange={(images) => setFormData({ ...formData, images })}
              multiple={true}
              label="Product Images"
            />
          </div>

          {/* Pricing & Stock */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Pricing & Stock</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compare At Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.compareAtPrice || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      compareAtPrice: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  value={formData.stock?.quantity || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: {
                        ...formData.stock!,
                        quantity: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Status *
                </label>
                <select
                  value={formData.stock?.status || 'in_stock'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: {
                        ...formData.stock!,
                        status: e.target.value as 'in_stock' | 'out_of_stock' | 'low_stock',
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  value={formData.stock?.lowStockThreshold || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: {
                        ...formData.stock!,
                        lowStockThreshold: e.target.value ? parseInt(e.target.value) : undefined,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Category & Subcategory */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Category & Subcategory</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.categoryId || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categoryId: e.target.value || undefined,
                      subCategoryId: undefined,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory *
                </label>
                <select
                  value={formData.subCategoryId || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subCategoryId: e.target.value || undefined,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                  disabled={!formData.categoryId}
                >
                  <option value="">Select Subcategory</option>
                  {subCategories
                    .filter((sc) => sc.categoryId === formData.categoryId)
                    .map((subCat) => (
                      <option key={subCat.id} value={subCat.id}>
                        {subCat.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Brand, Type & Vehicle Type */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Brand, Type & Vehicle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={formData.brand?.name || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      brand: e.target.value
                        ? { id: formData.brand?.id || 0, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }
                        : null,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Type *
                </label>
                <input
                  type="text"
                  value={formData.type?.name || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: {
                        id: formData.type?.id || 0,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type *
                </label>
                <select
                  value={formData.vehicleType || 'AUTO'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vehicleType: e.target.value as 'AUTO' | 'MOTO',
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="AUTO">Car (Auto)</option>
                  <option value="MOTO">Motorcycle (Moto)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition *
                </label>
                <select
                  value={formData.condition || 'new'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      condition: e.target.value as 'new' | 'imported' | 'home_used',
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="new">New</option>
                  <option value="imported">Imported</option>
                  <option value="home_used">Home Used</option>
                </select>
              </div>
            </div>
          </div>

          {/* Vehicle Compatibility */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Vehicle Compatibility</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compatibility Type *
              </label>
              <select
                value={typeof formData.compatibility === 'string' ? formData.compatibility : 'specific'}
                onChange={(e) => {
                  if (e.target.value === 'all' || e.target.value === 'unknown') {
                    setFormData({ ...formData, compatibility: e.target.value })
                    setCompatibleCars([])
                  } else {
                    setFormData({ ...formData, compatibility: 'specific' })
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none mb-4"
                required
              >
                <option value="all">Compatible with all vehicles</option>
                <option value="unknown">Unknown compatibility</option>
                <option value="specific">Specific vehicles (select below)</option>
              </select>
            </div>
            
            {formData.compatibility === 'specific' && (formData.vehicleType === 'AUTO' || formData.vehicleType === 'MOTO') && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">
                  Add Compatible {formData.vehicleType === 'MOTO' ? 'Motorcycles' : 'Cars'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Make */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Make
                    </label>
                    <select
                      value={selectedMake}
                      onChange={(e) => handleMakeChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select Make</option>
                      {carMakes.map((make) => (
                        <option key={make} value={make}>
                          {make}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => handleModelChange(e.target.value)}
                      disabled={!selectedMake}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-100"
                    >
                      <option value="">Select Model</option>
                      {carModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => handleYearChange(Number(e.target.value))}
                      disabled={!selectedModel}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-100"
                    >
                      <option value="">Select Year</option>
                      {carYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Trim (Multi-select) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trim (Optional)
                    </label>
                    <select
                      multiple
                      value={selectedTrims}
                      onChange={(e) => {
                        const options = Array.from(e.target.selectedOptions, (opt) => opt.value)
                        setSelectedTrims(options)
                      }}
                      disabled={!selectedYear || carTrims.length === 0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-100 h-10"
                      size={1}
                    >
                      <option value="">All Trims</option>
                      {carTrims.map((trim) => (
                        <option key={trim.id} value={trim.id}>
                          {trim.trim}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Add Button */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={addCompatibleVehicle}
                      disabled={!selectedMake || !selectedModel || !selectedYear}
                      className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
                
                {/* Selected Compatible Vehicles */}
                {compatibleCars.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Selected Compatible {formData.vehicleType === 'MOTO' ? 'Motorcycles' : 'Cars'}:</h5>
                    <div className="flex flex-wrap gap-2">
                      {compatibleCars.map((car, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                        >
                          <span>{car.make} {car.model} {car.year}{car.trim ? ` (${car.trim})` : ''}</span>
                          <button
                            type="button"
                            onClick={() => removeCompatibleVehicle(index)}
                            className="p-1 hover:bg-primary-200 rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tags & Badges */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Tags & Badges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  placeholder="oil, filter, premium"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badges (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.badges?.join(', ') || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      badges: e.target.value.split(',').map((b) => b.trim()).filter(Boolean),
                    })
                  }
                  placeholder="new, sale, featured"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Attributes</h3>
              <button
                type="button"
                onClick={addAttribute}
                className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Attribute</span>
              </button>
            </div>
            <div className="space-y-3">
              {formData.attributes?.map((attr, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    placeholder="Attribute name"
                    value={attr.name}
                    onChange={(e) => updateAttribute(index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={attr.value}
                    onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeAttribute(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Product Options</h3>
              <button
                type="button"
                onClick={addOption}
                className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Option</span>
              </button>
            </div>
            <div className="space-y-4">
              {formData.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Option name (e.g., Size, Color)"
                      value={option.name}
                      onChange={(e) => updateOption(optionIndex, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={option.required || false}
                        onChange={(e) => updateOption(optionIndex, 'required', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Required</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeOption(optionIndex)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {option.values.map((value, valueIndex) => (
                      <div key={valueIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Option value"
                          value={value}
                          onChange={(e) => {
                            const updated = [...option.values]
                            updated[valueIndex] = e.target.value
                            updateOption(optionIndex, 'values', updated)
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeOptionValue(optionIndex, valueIndex)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOptionValue(optionIndex)}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      + Add Value
                    </button>
                  </div>
                </div>
              ))}
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
              {part ? 'Update Part' : 'Create Part'}
            </button>
          </div>
        </form>

        <SuccessModal
          isOpen={showSuccess}
          onClose={() => {
            setShowSuccess(false)
            onClose()
          }}
          title={part ? 'Part Updated!' : 'Part Created!'}
          message={part ? 'The part has been updated successfully.' : 'The part has been created successfully.'}
        />
      </div>
    </div>
  )
}
