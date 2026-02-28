'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { SubCategory, Category } from '@/lib/types'
import SuccessModal from '@/components/ui/SuccessModal'

interface SubCategoryFormProps {
  subCategory: SubCategory | null
  category: Category
  onClose: () => void
  onSave: (subCategory: SubCategory) => void
}

export default function SubCategoryForm({
  subCategory,
  category,
  onSave,
  onClose,
}: SubCategoryFormProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState<Partial<SubCategory>>({
    name: '',
    slug: '',
    description: '',
    categoryId: category.id,
  })

  useEffect(() => {
    if (subCategory) {
      setFormData(subCategory)
    } else {
      setFormData((prev) => ({ ...prev, categoryId: category.id }))
    }
  }, [subCategory, category])

  useEffect(() => {
    if (!subCategory && formData.name) {
      setFormData((prev) => ({
        ...prev,
        slug: prev.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '',
      }))
    }
  }, [formData.name, subCategory])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newSubCategory: SubCategory = {
      id: subCategory?.id || Date.now(),
      categoryId: category.id,
      name: formData.name!,
      slug: formData.slug || formData.name?.toLowerCase().replace(/\s+/g, '-') || '',
      description: formData.description,
    }
    onSave(newSubCategory)
    setShowSuccess(true)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {subCategory ? 'Edit Subcategory' : 'Add New Subcategory'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Category
            </label>
            <input
              type="text"
              value={category.name}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory Name *
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
              placeholder="auto-generated-from-name"
            />
            <p className="text-xs text-gray-500 mt-1">URL-friendly identifier</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
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
              {subCategory ? 'Update Subcategory' : 'Create Subcategory'}
            </button>
          </div>
        </form>

        <SuccessModal
          isOpen={showSuccess}
          onClose={() => {
            setShowSuccess(false)
            onClose()
          }}
          title={subCategory ? 'Subcategory Updated!' : 'Subcategory Created!'}
          message={subCategory ? 'The subcategory has been updated successfully.' : 'The subcategory has been created successfully.'}
        />
      </div>
    </div>
  )
}

