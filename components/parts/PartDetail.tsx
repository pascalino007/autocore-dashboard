'use client'

import { X, Package, Star } from 'lucide-react'
import { Part } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface PartDetailProps {
  part: Part
  onClose: () => void
}

export default function PartDetail({ part, onClose }: PartDetailProps) {
  const getStockColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800'
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800'
      case 'out_of_stock':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCompatibilityText = () => {
    if (part.compatibility === 'all') return 'Compatible with all vehicles'
    if (part.compatibility === 'unknown') return 'Compatibility unknown'
    return `Compatible with ${part.compatibility.length} specific vehicles`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Part Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header with Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {part.images && part.images.length > 0 ? (
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={part.images[0]}
                    alt={part.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <Package className="w-24 h-24 text-gray-400" />
                </div>
              )}
              {part.images && part.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {part.images.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={img} alt={`${part.name} ${idx + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{part.name}</h1>
                {part.brand && (
                  <p className="text-lg text-gray-600 mt-1">Brand: {part.brand.name}</p>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-3xl font-bold text-primary-600">{formatCurrency(part.price)}</p>
                  {part.compareAtPrice && (
                    <p className="text-sm text-gray-400 line-through">{formatCurrency(part.compareAtPrice)}</p>
                  )}
                </div>
                {part.rating && (
                  <div>
                    <p className="text-sm text-gray-500">Rating</p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-lg font-semibold">{part.rating}</span>
                      {part.reviews && (
                        <span className="text-sm text-gray-500">({part.reviews} reviews)</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStockColor(part.stock.status)}`}>
                  {part.stock.status.replace('_', ' ')} ({part.stock.quantity} units)
                </span>
                {part.condition && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                    {part.condition.replace('_', ' ')}
                  </span>
                )}
                {part.badges?.map((badge, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {badge}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">SKU: {part.sku || 'N/A'}</p>
                <p className="text-sm text-gray-500">Part Number: {part.partNumber}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700">{part.description || part.excerpt}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium text-gray-900">{part.type.name}</span>
                </div>
                {part.categoryId && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium text-gray-900">
                      {part.categories?.find((c) => c.id === part.categoryId)?.name || 'N/A'}
                    </span>
                  </div>
                )}
                {part.subCategoryId && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subcategory:</span>
                    <span className="font-medium text-gray-900">N/A</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Compatibility:</span>
                  <span className="font-medium text-gray-900">{getCompatibilityText()}</span>
                </div>
                {part.vendorCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vendor Code:</span>
                    <span className="font-medium text-gray-900">{part.vendorCode}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Quantity:</span>
                  <span className="font-medium text-gray-900">{part.stock.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStockColor(part.stock.status)}`}>
                    {part.stock.status.replace('_', ' ')}
                  </span>
                </div>
                {part.stock.lowStockThreshold && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Low Stock Threshold:</span>
                    <span className="font-medium text-gray-900">{part.stock.lowStockThreshold}</span>
                  </div>
                )}
                {part.availability && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Availability:</span>
                    <span className="font-medium text-gray-900 capitalize">{part.availability.replace('_', ' ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Attributes */}
          {part.attributes && part.attributes.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attributes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {part.attributes.map((attr, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-500">{attr.name}</p>
                    <p className="font-medium text-gray-900">{attr.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {part.tags && part.tags.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {part.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Options */}
          {part.options && part.options.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Options</h3>
              <div className="space-y-3">
                {part.options.map((option, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{option.name}</p>
                      {option.required && (
                        <span className="text-xs text-red-600">Required</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {option.values.map((value, vIdx) => (
                        <span key={vIdx} className="px-2 py-1 bg-white border border-gray-200 rounded text-sm">
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

