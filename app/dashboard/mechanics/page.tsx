'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Plus, Wrench, Search, Edit, Trash2, MapPin, Phone, Mail } from 'lucide-react'
import { Shop } from '@/lib/types'
import MechanicForm from '@/components/mechanics/MechanicForm'

export default function MechanicsPage() {
  const [mechanics, setMechanics] = useState<Shop[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedMechanic, setSelectedMechanic] = useState<Shop | null>(null)

  useEffect(() => {
    const loadMechanics = async () => {
      try {
        const { getMechanics } = await import('@/lib/api')
        const res = await getMechanics()
        const items = (res.data || res || []).map((m: any) => ({
          id: String(m.id),
          ownerId: '',
          name: m.name || '',
          description: m.description || '',
          location: {
            address: m.address || '',
            city: m.city || '',
            state: m.state || '',
            zipCode: m.zipCode || '',
            country: m.country || '',
          },
          images: (m.images || []).map((img: any) => typeof img === 'string' ? img : img.url || ''),
          phone: m.phone || '',
          email: m.email || '',
          type: 'mechanic' as const,
          createdAt: m.createdAt || '',
        }))
        setMechanics(items)
      } catch (err) {
        console.error('Failed to load mechanics:', err)
      }
    }
    loadMechanics()
  }, [])

  const handleEdit = (mechanic: Shop) => {
    setSelectedMechanic(mechanic)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mechanic shop?')) return
    try {
      const { deleteMechanic } = await import('@/lib/api')
      await deleteMechanic(id)
      setMechanics(mechanics.filter((m) => m.id !== id))
    } catch (err) {
      console.error('Failed to delete mechanic:', err)
      alert('Failed to delete mechanic. Please try again.')
    }
  }

  const filteredMechanics = mechanics.filter((mechanic) =>
    mechanic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mechanic.location.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Mechanics Shops</h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2">Register and manage mechanics shops</p>
          </div>
          <button
            onClick={() => {
              setSelectedMechanic(null)
              setShowForm(true)
            }}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-5 h-5" />
            <span>Register Mechanic</span>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search mechanics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMechanics.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-12 text-center">
              <Wrench className="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-slate-400">No mechanics registered yet</p>
            </div>
          ) : (
            filteredMechanics.map((mechanic) => (
              <div key={mechanic.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-slate-100">{mechanic.name}</h3>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">{mechanic.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    {mechanic.location.city}, {mechanic.location.state}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-slate-400">
                    <Phone className="w-4 h-4 mr-2" />
                    {mechanic.phone}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-slate-400">
                    <Mail className="w-4 h-4 mr-2" />
                    {mechanic.email}
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                  <button
                    onClick={() => handleEdit(mechanic)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(mechanic.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {showForm && (
          <MechanicForm
            mechanic={selectedMechanic}
            onClose={() => {
              setShowForm(false)
              setSelectedMechanic(null)
            }}
            onSave={async (mechanic) => {
              try {
                const { createMechanic, updateMechanic } = await import('@/lib/api')
                let saved;
                const payload = {
                  name: mechanic.name,
                  description: mechanic.description,
                  phone: mechanic.phone,
                  email: mechanic.email,
                  address: mechanic.location?.address,
                  city: mechanic.location?.city,
                  state: mechanic.location?.state,
                  zipCode: mechanic.location?.zipCode,
                  country: mechanic.location?.country,
                }
                if (selectedMechanic) {
                  saved = await updateMechanic(selectedMechanic.id, payload)
                  setMechanics(mechanics.map((m) => (m.id === selectedMechanic.id ? { ...mechanic, ...saved } : m)))
                } else {
                  saved = await createMechanic(payload)
                  setMechanics([...mechanics, { ...mechanic, id: String(saved.id || Date.now()) }])
                }
                setShowForm(false)
                setSelectedMechanic(null)
              } catch (err) {
                console.error('Failed to save mechanic:', err)
                alert('Failed to save mechanic. Please try again.')
              }
            }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
