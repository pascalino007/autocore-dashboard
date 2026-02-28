'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Plus, Search, Filter, Edit, Trash2, Eye, Package, LayoutGrid, List } from 'lucide-react'
import { formatCurrency, toPublicImageUrl } from '@/lib/utils'
import PartForm from '@/components/parts/PartForm'
import PartDetail from '@/components/parts/PartDetail'
import { Part } from '@/lib/types'

export default function PartsPage() {
  const [parts, setParts] = useState<Part[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedPart, setSelectedPart] = useState<Part | null>(null)
  const [viewPart, setViewPart] = useState<Part | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)

  useEffect(() => {
    const loadParts = async () => {
      try {
        const { getProducts } = await import('@/lib/api')
        const res = await getProducts()
        const items = (res.data || res || []).map((p: any) => ({
          id: p.id,
          name: p.name || '',
          excerpt: p.excerpt || p.description?.slice(0, 100) || '',
          description: p.description || '',
          slug: p.slug || '',
          sku: p.sku || '',
          partNumber: p.partNumber || p.sku || '',
          stock: {
            quantity: p.stockQuantity ?? p.stock ?? 0,
            status: (p.stockQuantity ?? p.stock ?? 0) > 20 ? 'in_stock' : (p.stockQuantity ?? p.stock ?? 0) > 0 ? 'low_stock' : 'out_of_stock',
            lowStockThreshold: 20,
          },
          price: Number(p.price) || 0,
          compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
          images: (p.images || []).map((img: any) => {
            const raw = typeof img === 'string' ? img : img.url || img.location || ''
            return toPublicImageUrl(raw)
          }),
          badges: p.badges || [],
          rating: p.rating ? Number(p.rating) : 0,
          reviews: p.reviewCount || p._count?.reviews || 0,
          availability: (p.stockQuantity ?? p.stock ?? 0) > 0 ? 'in_stock' : 'out_of_stock',
          isFeatured: !!(p.isFeatured ?? p.featured ?? false),
          compatibility: p.compatibility || 'all',
          brand: p.brand ? { id: p.brand.id, name: p.brand.name, slug: p.brand.slug } : null,
          tags: p.tags || [],
          type: { id: p.category?.id || 0, name: p.category?.name || 'Auto Parts', slug: p.category?.slug || 'auto-parts' },
          categories: p.categories || (p.category ? [{ id: p.category.id, name: p.category.name, slug: p.category.slug }] : []),
          attributes: (p.specs || p.attributes || []).map((a: any) => ({ name: a.name || a.key, value: a.value, type: 'text' })),
          options: [],
          customFields: {},
        }))
        setParts(items)
      } catch (err) {
        console.error('Failed to load parts:', err)
      }
    }
    loadParts()
  }, [])

  const handleEdit = (part: Part) => {
    setSelectedPart(part)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this part?')) return
    try {
      const { deleteProduct } = await import('@/lib/api')
      await deleteProduct(id)
      setParts(parts.filter((p) => String(p.id) !== id))
    } catch (err) {
      console.error('Failed to delete part:', err)
      alert('Failed to delete part. Please try again.')
    }
  }

  const filteredParts = parts.filter((part) =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (part.sku && part.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
    part.partNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filteredParts.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedParts = filteredParts.slice(startIndex, endIndex)
  const setPageSafe = (p: number) => setPage(Math.min(Math.max(1, p), totalPages))

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Car Parts Management</h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2">Manage all auto parts in your inventory</p>
          </div>
          <button
            onClick={() => {
              setSelectedPart(null)
              setShowForm(true)
            }}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Part</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search parts by name or SKU..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setPage(1)
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
              />
            </div>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-slate-200">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg border ${viewMode === 'grid' ? 'bg-primary-50 border-primary-400 text-primary-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                aria-label="Grid view"
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg border ${viewMode === 'list' ? 'bg-primary-50 border-primary-400 text-primary-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                aria-label="List view"
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Per page</span>
              <select
                value={pageSize}
                onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)) }}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
              >
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-transparent">
          {filteredParts.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-slate-400">No parts found. Add your first part to get started.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {paginatedParts.map((part) => {
                const imageSrc = part.images && part.images.length > 0 ? part.images[0] : ''
                const stockClass =
                  part.stock.status === 'in_stock'
                    ? 'bg-green-100 text-green-800'
                    : part.stock.status === 'low_stock'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                return (
                  <div
                    key={part.id}
                    className="group rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden"
                  >
                    <div className="relative bg-gray-100 dark:bg-slate-700">
                      <div className="aspect-[4/3] w-full overflow-hidden">
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={part.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-gray-400 dark:text-slate-500" />
                          </div>
                        )}
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockClass}`}>
                          {part.stock.status.replace('_', ' ')} ({part.stock.quantity})
                        </span>
                      </div>
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">
                            {part.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                            {part.brand?.name || 'No brand'}
                          </p>
                        </div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                          {formatCurrency(part.price)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-300">
                        <span>SKU: {part.sku || 'N/A'}</span>
                        <span>⭐ {part.rating || 0} ({part.reviews || 0})</span>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          onClick={() => setViewPart(part)}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 p-2 hover:bg-primary-50 dark:hover:bg-primary-500/20 rounded"
                          aria-label="View"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(part)}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 p-2 hover:bg-primary-50 dark:hover:bg-primary-500/20 rounded"
                          aria-label="Edit"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(part.id.toString())}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-500/20 rounded"
                          aria-label="Delete"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Part</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">SKU</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Availability</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                    {paginatedParts.map((part) => (
                      <tr key={part.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-lg mr-3 overflow-hidden flex items-center justify-center">
                              {part.images && part.images.length > 0 ? (
                                <img src={part.images[0]} alt={part.name} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-6 h-6 text-gray-400 dark:text-slate-500" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-slate-100">{part.name}</div>
                              <div className="text-sm text-gray-500 dark:text-slate-400">{part.brand?.name || 'No brand'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-100">{part.sku || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                          {formatCurrency(part.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              part.stock.status === 'in_stock'
                                ? 'bg-green-100 text-green-800'
                                : part.stock.status === 'low_stock'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {part.stock.status.replace('_', ' ')} ({part.stock.quantity})
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-100">
                          ⭐ {part.rating || 0} ({part.reviews || 0})
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setViewPart(part)}
                              className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 p-2 hover:bg-primary-50 dark:hover:bg-primary-500/20 rounded"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(part)}
                              className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 p-2 hover:bg-primary-50 dark:hover:bg-primary-500/20 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(part.id.toString())}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-500/20 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        {filteredParts.length > 0 && (
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-3">
            <div className="text-xs text-gray-600 dark:text-slate-300">
              Showing {startIndex + 1}–{Math.min(endIndex, filteredParts.length)} of {filteredParts.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPageSafe(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-50 bg-white dark:bg-slate-800"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }).slice(0, 5).map((_, idx) => {
                const p = idx + 1
                return (
                  <button
                    key={p}
                    onClick={() => setPageSafe(p)}
                    className={`px-3 py-1.5 text-sm rounded-lg border ${currentPage === p ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-gray-300 bg-white dark:bg-slate-800'}`}
                  >
                    {p}
                  </button>
                )
              })}
              {totalPages > 5 && (
                <>
                  <span className="text-sm text-gray-500">…</span>
                  <button
                    onClick={() => setPageSafe(totalPages)}
                    className={`px-3 py-1.5 text-sm rounded-lg border ${currentPage === totalPages ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-gray-300 bg-white dark:bg-slate-800'}`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                onClick={() => setPageSafe(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-50 bg-white dark:bg-slate-800"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Part Form Modal */}
        {showForm && (
          <PartForm
            part={selectedPart}
            onClose={() => {
              setShowForm(false)
              setSelectedPart(null)
            }}
            onSave={async (part) => {
              try {
                const { createProduct, updateProduct } = await import('@/lib/api')
                let savedPart: any;
                
                if (selectedPart) {
                  const baseUrls = (part.images || []).filter((u) => typeof u === 'string' && /^https?:\/\//i.test(u)) as string[]
                  const dataUris = (part.images || []).filter((u) => typeof u === 'string' && u.startsWith('data:')) as string[]
                  let uploadedUrls: string[] = []
                  if (dataUris.length > 0) {
                    try {
                      const files = await Promise.all(
                        dataUris.map(async (u, idx) => {
                          const res = await fetch(u)
                          const blob = await res.blob()
                          return new File([blob], `image-${idx}.png`, { type: blob.type || 'image/png' })
                        })
                      )
                      const { uploadImages } = await import('@/lib/upload')
                      uploadedUrls = await uploadImages(files)
                    } catch {}
                  }
                  const imageUrls = [...baseUrls, ...uploadedUrls]
                  const updateData = {
                    name: part.name || '',
                    description: part.description || '',
                    sku: part.sku || '',
                    partNumber: part.partNumber || '',
                    price: Number(part.price) || 0,
                  stock: Math.max(0, Math.floor(Number(part.stock?.quantity) || 0)),
                    condition: (part.condition || 'new').toUpperCase(),
                    vehicleType: part.vehicleType || 'AUTO',
                  categoryId: part.categoryId || undefined,
                    brandId: part.brand?.id ? Number(part.brand.id) : undefined,
                    compatibleCarIds: part.compatibleCarIds || [],
                    isFeatured: !!part.isFeatured,
                  images: imageUrls.length ? imageUrls.map((url) => ({ url })) : undefined,
                  };
                  
                  // Remove undefined/null values to avoid validation errors
                  Object.keys(updateData).forEach(key => {
                    if ((updateData as any)[key] === undefined || (updateData as any)[key] === null) {
                      delete (updateData as any)[key];
                    }
                  });
                  
                  const result = await updateProduct(Number(selectedPart.id), updateData);
                  const savedData = (result && (result.data || result)) || {}
                  const normalizedImages = (savedData.images || []).map((img: any) => toPublicImageUrl(typeof img === 'string' ? img : img.url || ''))
                  setParts(parts.map((p) => (p.id === selectedPart.id ? { ...part, ...savedData, images: normalizedImages } : p)))
                } else {
                  const baseUrls = (part.images || []).filter((u) => typeof u === 'string' && /^https?:\/\//i.test(u)) as string[]
                  const dataUris = (part.images || []).filter((u) => typeof u === 'string' && u.startsWith('data:')) as string[]
                  let uploadedUrls: string[] = []
                  if (dataUris.length > 0) {
                    try {
                      const files = await Promise.all(
                        dataUris.map(async (u, idx) => {
                          const res = await fetch(u)
                          const blob = await res.blob()
                          return new File([blob], `image-${idx}.png`, { type: blob.type || 'image/png' })
                        })
                      )
                      const { uploadImages } = await import('@/lib/upload')
                      uploadedUrls = await uploadImages(files)
                    } catch {}
                  }
                  const imageUrls = [...baseUrls, ...uploadedUrls]
                  const createData = {
                    name: part.name || '',
                    description: (part.description || '').substring(0, 2000),
                    sku: part.sku || '',
                    partNumber: part.partNumber || '',
                    price: Number(part.price) || 0,
                  stock: Math.max(0, Math.floor(Number(part.stock?.quantity) || 0)),
                    condition: (part.condition || 'new').toUpperCase(),
                    vehicleType: part.vehicleType || 'AUTO',
                  categoryId: part.categoryId || undefined,
                    brandId: part.brand?.id ? Number(part.brand.id) : undefined,
                    compatibleCarIds: part.compatibleCarIds || [],
                    isFeatured: !!part.isFeatured,
                  images: imageUrls.length ? imageUrls.map((url) => ({ url })) : undefined,
                  };
                  
                  // Remove undefined/null values to avoid validation errors
                  Object.keys(createData).forEach(key => {
                    if ((createData as any)[key] === undefined || (createData as any)[key] === null) {
                      delete (createData as any)[key];
                    }
                  });
                  
                  const result = await createProduct(createData);
                  const savedData = (result && (result.data || result)) || {}
                  const normalizedImages = (savedData.images || []).map((img: any) => toPublicImageUrl(typeof img === 'string' ? img : img.url || ''))
                  setParts([...parts, { ...part, id: savedData.id, images: normalizedImages }])
                }
                
                setShowForm(false)
                setSelectedPart(null)
              } catch (error) {
                console.error('Failed to save part:', error)
                alert('Failed to save part. Please try again.')
              }
            }}
          />
        )}

        {viewPart && (
          <PartDetail part={viewPart} onClose={() => setViewPart(null)} />
        )}
      </div>
    </DashboardLayout>
  )
}
