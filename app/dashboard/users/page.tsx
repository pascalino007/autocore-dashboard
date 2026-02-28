'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Users, Search, Edit, Trash2, Eye } from 'lucide-react'
import { User, Order, Payment } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import UserDetail from '@/components/users/UserDetail'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const { getUsers, getOrders, getPayments } = await import('@/lib/api')
        const [usersRes, ordersRes, paymentsRes] = await Promise.all([
          getUsers(), getOrders(), getPayments(),
        ])
        const userItems = (usersRes.data || usersRes || []).map((u: any) => ({
          id: String(u.id),
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
          email: u.email || '',
          role: (u.role || 'customer').toLowerCase(),
          createdAt: u.createdAt || '',
          garage: (u.garage || []).map((g: any) => ({
            id: String(g.id),
            userId: String(u.id),
            cars: (g.cars || []).map((c: any) => ({
              id: String(c.id), year: c.year || 0, make: c.make || '', model: c.model || '',
              engine: c.engine || '', fuelType: c.fuelType || '', motorisation: c.motorisation || '',
              images: [], createdAt: c.createdAt || '',
            })),
          })),
          addresses: (u.addresses || []).map((a: any) => ({
            id: String(a.id), userId: String(u.id),
            street: a.address1 || a.street || '', city: a.city || '', state: a.state || '',
            zipCode: a.postcode || a.zipCode || '', country: a.country || '', isDefault: a.isDefault || false,
          })),
        }))
        setUsers(userItems)
        const orderItems = (ordersRes.data || ordersRes || []).map((o: any) => ({
          id: String(o.id), userId: String(o.userId || o.user?.id || ''),
          items: (o.items || []).map((item: any) => ({
            id: String(item.id), partId: String(item.productId || item.product?.id || ''),
            partName: item.product?.name || '', quantity: item.quantity, price: Number(item.price),
            shopId: '', status: item.status?.toLowerCase() || 'pending',
          })),
          total: Number(o.total), status: o.status?.toLowerCase() || 'pending',
          paymentStatus: o.payment?.status?.toLowerCase() || 'pending',
          shippingAddress: { id: '', userId: '', street: '', city: '', state: '', zipCode: '', country: '', isDefault: false },
          createdAt: o.createdAt || '', updatedAt: o.updatedAt || '',
        }))
        setOrders(orderItems)
        const paymentItems = (paymentsRes.data || paymentsRes || []).map((p: any) => ({
          id: String(p.id), orderId: String(p.orderId || ''), amount: Number(p.amount),
          method: p.method || 'credit_card', status: p.status?.toLowerCase() || 'pending',
          transactionId: p.transactionId || p.id, createdAt: p.createdAt || '',
        }))
        setPayments(paymentItems)
      } catch (err) {
        console.error('Failed to load users:', err)
      }
    }
    loadData()
  }, [])

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== id))
    }
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">User Management</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-2">Manage platform users, their garages and addresses</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Garage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Addresses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Users className="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-slate-400">No users found</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-slate-100">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 capitalize">
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                        {user.garage?.[0]?.cars?.length || 0} cars
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                        {user.addresses?.length || 0} addresses
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 p-2 hover:bg-primary-50 dark:hover:bg-primary-500/20 rounded"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 p-2 hover:bg-primary-50 dark:hover:bg-primary-500/20 rounded">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-500/20 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedUser && (
          <UserDetail
            user={selectedUser}
            orders={orders}
            payments={payments}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

