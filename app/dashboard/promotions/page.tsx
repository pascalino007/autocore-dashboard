'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Plus, Tag, Edit, Trash2, Calendar } from 'lucide-react'
import { Promotion } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import PromotionForm from '@/components/promotions/PromotionForm'

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null)

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const { getPromotions } = await import('@/lib/api')
        const res = await getPromotions()
        const items = (res.data || res || []).map((p: any) => ({
          id: String(p.id),
          name: p.name || '',
          description: p.description || '',
          code: p.code || '',
          type: p.type || 'PERCENTAGE',
          value: Number(p.value) || 0,
          minPurchase: Number(p.minPurchase) || 0,
          maxDiscount: Number(p.maxDiscount) || 0,
          usageLimit: Number(p.usageLimit) || 100,
          usageCount: Number(p.usageCount) || 0,
          startDate: p.startDate || new Date().toISOString(),
          endDate: p.endDate || new Date().toISOString(),
          isActive: p.isActive ?? true,
        }))
        setPromotions(items)
      } catch (err) {
        console.error('Failed to load promotions:', err)
      }
    }
    loadPromotions()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Special Promotions</h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2">Create and manage special offers and bundles</p>
          </div>
          <button 
            onClick={() => {
              setSelectedPromotion(null)
              setShowForm(true)
            }}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-5 h-5" />
            <span>Create Promotion</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-12 text-center">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-slate-400">No promotions yet. Create your first promotion!</p>
            </div>
          ) : (
            promotions.map((promo) => (
              <div key={promo.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Tag className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-slate-100">{promo.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        promo.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {promo.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">{promo.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                  </div>
                  <div className="text-gray-600 dark:text-slate-400">
                    Type: <span className="font-medium capitalize">{promo.type.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                  <button className="p-2 text-primary-600 hover:bg-primary-50 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {showForm && (
          <PromotionForm
            promotion={selectedPromotion}
            onClose={() => {
              setShowForm(false)
              setSelectedPromotion(null)
            }}
            onSave={async (promotion) => {
              try {
                const { createPromotion, updatePromotion } = await import('@/lib/api')
                let savedPromotion;
                
                if (selectedPromotion) {
                  // Update existing promotion
                  const updateData = {
                    name: promotion.name,
                    description: promotion.description,
                    code: promotion.code,
                    type: promotion.type,
                    value: promotion.value,
                    minPurchase: promotion.minPurchase,
                    maxDiscount: promotion.maxDiscount,
                    usageLimit: promotion.usageLimit,
                    startDate: promotion.startDate,
                    endDate: promotion.endDate,
                    isActive: promotion.isActive,
                  };
                  savedPromotion = await updatePromotion(Number(selectedPromotion.id), updateData);
                  setPromotions(promotions.map((p) => (p.id === selectedPromotion.id ? { ...promotion, ...savedPromotion } : p)))
                } else {
                  // Create new promotion
                  const createData = {
                    name: promotion.name,
                    description: promotion.description,
                    code: promotion.code,
                    type: promotion.type,
                    value: promotion.value,
                    minPurchase: promotion.minPurchase,
                    maxDiscount: promotion.maxDiscount,
                    usageLimit: promotion.usageLimit,
                    startDate: promotion.startDate,
                    endDate: promotion.endDate,
                    isActive: promotion.isActive,
                  };
                  savedPromotion = await createPromotion(createData);
                  setPromotions([...promotions, { ...promotion, id: savedPromotion.id }])
                }
                
                setShowForm(false)
                setSelectedPromotion(null)
              } catch (error) {
                console.error('Failed to save promotion:', error)
                alert('Failed to save promotion. Please try again.')
              }
            }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}


