'use client'

import { useState, useEffect } from 'react'
import { Search, Users as UsersIcon, ShieldAlert, ShieldCheck } from 'lucide-react'
import { getAllUsers, updateUserStatus } from '@/app/actions/users'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const data = await getAllUsers()
    setUsers(data)
    setLoading(false)
  }

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'BANNED' ? 'ACTIVE' : 'BANNED';
    await updateUserStatus(userId, newStatus);
    fetchUsers();
  }

  const filteredUsers = users.filter(u => 
    searchTerm === '' || 
    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="relative z-10 max-w-[1280px] mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-forest-deep mb-2">User Management</h1>
          <p className="font-body-lg text-on-surface-variant">View all registered users on your platform.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
        {/* Filters Area */}
        <div className="p-6 border-b border-outline-variant/20 bg-cream-bg/50">
          <div className="relative group max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-5 h-5" />
            <input 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-gold-accent outline-none transition-all font-body-md" 
              placeholder="Search by User Name or ID..." 
              type="text" 
            />
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-on-surface-variant animate-pulse">Loading users...</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20">
                  <th className="px-6 py-5 font-label-lg text-forest-deep">Name & Email</th>
                  <th className="px-6 py-5 font-label-lg text-forest-deep">Mobile No</th>
                  <th className="px-6 py-5 font-label-lg text-forest-deep">Products Purchased</th>
                  <th className="px-6 py-5 font-label-lg text-forest-deep">Join Date</th>
                  <th className="px-6 py-5 font-label-lg text-forest-deep text-center">Status</th>
                  <th className="px-6 py-5 font-label-lg text-forest-deep text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-on-surface-variant">No users found.</td>
                  </tr>
                )}
                {filteredUsers.map(u => {
                  const purchasedCount = u.orders 
                    ? u.orders.filter((o:any) => o.status !== 'CANCELLED').reduce((acc: number, curr: any) => {
                        const itemsTotal = curr.order_items?.reduce((itemAcc: number, item: any) => itemAcc + item.quantity, 0) || 0;
                        return acc + itemsTotal;
                      }, 0)
                    : 0;
                  
                  const isBanned = u.status === 'BANNED';

                  return (
                  <tr key={u.id} className="hover:bg-cream-bg transition-colors group cursor-pointer">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {u.name ? u.name.substring(0, 2).toUpperCase() : 'U'}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-label-lg text-forest-deep truncate">{u.name || 'Anonymous User'}</div>
                        <div className="text-xs text-on-surface-variant truncate" title={u.email}>{u.email || '-'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body-sm text-on-surface-variant">{u.phone || '-'}</td>
                    <td className="px-6 py-4 font-label-lg text-forest-deep">{purchasedCount}</td>
                    <td className="px-6 py-4 font-body-md text-on-surface-variant">
                      {new Date(u.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${isBanned ? 'bg-error-container text-error' : 'bg-secondary-container/50 text-on-secondary-container'}`}>
                        {isBanned ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                        {isBanned ? 'BANNED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleToggleStatus(u.id, u.status)}
                        className={`text-xs font-bold hover:underline ${isBanned ? 'text-primary-custom' : 'text-error'}`}
                      >
                        {isBanned ? 'Unban' : 'Ban'}
                      </button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
