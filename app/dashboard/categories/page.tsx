'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Plus, Search, Folder, Edit, Trash2, ChevronRight, ChevronDown } from 'lucide-react'
import { Category, SubCategory } from '@/lib/types'
import CategoryForm from '@/components/categories/CategoryForm'
import SubCategoryForm from '@/components/categories/SubCategoryForm'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showSubCategoryForm, setShowSubCategoryForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null)
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<Category | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { getCategories } = await import('@/lib/api')
        const res = await getCategories()
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
  }, [])

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const handleDeleteCategory = (id: number) => {
    if (confirm('Are you sure you want to delete this category? All subcategories will also be deleted.')) {
      setCategories(categories.filter((c) => c.id !== id))
      setSubCategories(subCategories.filter((sc) => sc.categoryId !== id))
    }
  }

  const handleDeleteSubCategory = (id: number) => {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      setSubCategories(subCategories.filter((sc) => sc.id !== id))
    }
  }

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Categories & Subcategories</h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2">Manage product categories and subcategories</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setSelectedCategory(null)
                setShowCategoryForm(true)
              }}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              <Plus className="w-5 h-5" />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {filteredCategories.length === 0 ? (
              <div className="p-12 text-center">
                <Folder className="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-slate-400">No categories found. Create your first category!</p>
              </div>
            ) : (
              filteredCategories.map((category) => {
                const categorySubs = subCategories.filter((sc) => sc.categoryId === category.id)
                const isExpanded = expandedCategories.has(category.id)

                return (
                  <div key={category.id}>
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                          )}
                        </button>
                        <Folder className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-slate-100">{category.name}</h3>
                          {category.description && (
                            <p className="text-sm text-gray-500 dark:text-slate-400">{category.description}</p>
                          )}
                          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Slug: {category.slug}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedCategoryForSub(category)
                              setSelectedSubCategory(null)
                              setShowSubCategoryForm(true)
                            }}
                            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 px-3 py-1 hover:bg-primary-50 dark:hover:bg-primary-500/20 rounded"
                          >
                            <Plus className="w-4 h-4 inline mr-1" />
                            Add Subcategory
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCategory(category)
                              setShowCategoryForm(true)
                            }}
                            className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/20 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="bg-gray-50 dark:bg-slate-800/80 pl-12 pr-4 pb-4 space-y-2">
                        {categorySubs.length === 0 ? (
                          <p className="text-sm text-gray-500 dark:text-slate-400 py-2">No subcategories</p>
                        ) : (
                          categorySubs.map((subCategory) => (
                            <div
                              key={subCategory.id}
                              className="bg-white dark:bg-slate-800 rounded-lg p-3 flex items-center justify-between border border-gray-200 dark:border-slate-700"
                            >
                              <div>
                                <p className="font-medium text-gray-900 dark:text-slate-100">{subCategory.name}</p>
                                <p className="text-xs text-gray-400 dark:text-slate-500">Slug: {subCategory.slug}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedSubCategory(subCategory)
                                    setSelectedCategoryForSub(category)
                                    setShowSubCategoryForm(true)
                                  }}
                                  className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/20 rounded"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSubCategory(subCategory.id)}
                                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
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

        {showCategoryForm && (
          <CategoryForm
            category={selectedCategory}
            onClose={() => {
              setShowCategoryForm(false)
              setSelectedCategory(null)
            }}
            onSave={async (category) => {
              try {
                const { createCategory, updateCategory } = await import('@/lib/api')
                let savedCategory;
                
                if (selectedCategory) {
                  // Update existing category
                  const updateData = {
                    name: category.name,
                    description: category.description,
                    slug: category.slug,
                    type: 'AUTO',
                  };
                  savedCategory = await updateCategory(Number(selectedCategory.id), updateData);
                  setCategories(categories.map((c) => (c.id === selectedCategory.id ? { ...category, ...savedCategory } : c)))
                } else {
                  // Create new category
                  const createData = {
                    name: category.name,
                    description: category.description,
                    slug: category.slug,
                    type: 'AUTO',
                  };
                  savedCategory = await createCategory(createData);
                  setCategories([...categories, { ...category, id: savedCategory.id }])
                }
                
                setShowCategoryForm(false)
                setSelectedCategory(null)
              } catch (error) {
                console.error('Failed to save category:', error)
                alert('Failed to save category. Please try again.')
              }
            }}
          />
        )}

        {showSubCategoryForm && (
          <SubCategoryForm
            subCategory={selectedSubCategory}
            category={selectedCategoryForSub!}
            onClose={() => {
              setShowSubCategoryForm(false)
              setSelectedSubCategory(null)
              setSelectedCategoryForSub(null)
            }}
            onSave={async (subCategory) => {
              try {
                const { createSubCategory, updateSubCategory } = await import('@/lib/api')
                let savedSubCategory;
                
                if (selectedSubCategory) {
                  // Update existing subcategory
                  const updateData = {
                    name: subCategory.name,
                    description: subCategory.description,
                    slug: subCategory.slug,
                    parentId: selectedCategoryForSub?.id,
                    type: 'AUTO',
                  };
                  savedSubCategory = await updateSubCategory(Number(selectedSubCategory.id), updateData);
                  setSubCategories(
                    subCategories.map((sc) => (sc.id === selectedSubCategory.id ? { ...subCategory, ...savedSubCategory } : sc))
                  )
                } else {
                  // Create new subcategory
                  const createData = {
                    name: subCategory.name,
                    description: subCategory.description,
                    slug: subCategory.slug,
                    parentId: selectedCategoryForSub?.id,
                    type: 'AUTO',
                  };
                  savedSubCategory = await createSubCategory(createData);
                  setSubCategories([...subCategories, { ...subCategory, id: savedSubCategory.id }])
                }
                
                setShowSubCategoryForm(false)
                setSelectedSubCategory(null)
                setSelectedCategoryForSub(null)
              } catch (error) {
                console.error('Failed to save subcategory:', error)
                alert('Failed to save subcategory. Please try again.')
              }
            }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}


