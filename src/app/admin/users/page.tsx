'use client'

import { useState, useEffect } from 'react'
import { Search, Users as UsersIcon, ShieldAlert, ShieldCheck, UserCog, UserCheck, UserMinus, RefreshCw } from 'lucide-react'
import { getAllUsers, updateUserStatus } from '@/app/actions/users'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

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
    setUpdatingId(userId);
    const newStatus = currentStatus === 'BANNED' ? 'ACTIVE' : 'BANNED';
    await updateUserStatus(userId, newStatus);
    await fetchUsers();
    setUpdatingId(null);
  }

  const filteredUsers = users.filter(u => 
    searchTerm === '' || 
    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeUsersCount = users.filter(u => u.status !== 'BANNED').length;
  const bannedUsersCount = users.filter(u => u.status === 'BANNED').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Area */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617] p-8 md:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transform translate-x-8 -translate-y-8">
          <UsersIcon className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-display-lg mb-3 tracking-tight text-white flex items-center gap-3">
              User Management
            </h1>
            <p className="text-white/70 font-body-lg max-w-2xl text-lg">
              View registered users, track their purchase history, and manage their account status securely.
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-lg">
            <div className="flex flex-col">
              <span className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1">Total Users</span>
              <span className="text-2xl font-bold">{users.length}</span>
            </div>
            <div className="w-px h-10 bg-white/10 mx-2"></div>
            <div className="flex flex-col">
              <span className="text-xs text-emerald-400/80 uppercase tracking-wider font-bold mb-1 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Active</span>
              <span className="text-2xl font-bold text-emerald-50">{activeUsersCount}</span>
            </div>
            <div className="w-px h-10 bg-white/10 mx-2"></div>
            <div className="flex flex-col">
              <span className="text-xs text-rose-400/80 uppercase tracking-wider font-bold mb-1 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Banned</span>
              <span className="text-2xl font-bold text-rose-50">{bannedUsersCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/30 overflow-hidden flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
        
        {/* Table Toolbar */}
        <div className="p-6 border-b border-outline-variant/20 flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-container-lowest">
          <h2 className="text-xl font-headline-md text-forest-deep flex items-center gap-2">
            <UserCog className="w-5 h-5 text-primary-custom" /> Customer Directory
          </h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
              <input 
                type="text"
                placeholder="Search by Name, Email, or User ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary-custom focus:ring-2 focus:ring-primary-custom/20 transition-all font-body-sm text-sm"
              />
            </div>
            <button onClick={fetchUsers} className="p-3 bg-surface-container-low border border-outline-variant/30 rounded-xl hover:bg-surface-container-high transition-colors text-forest-deep" title="Refresh Users">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm whitespace-nowrap">
            <thead className="bg-surface-container-low/30 text-on-surface-variant text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-8 py-5">User Identity</th>
                <th className="px-8 py-5">Contact Info</th>
                <th className="px-8 py-5 text-center">Engagement</th>
                <th className="px-8 py-5">Registered On</th>
                <th className="px-8 py-5 text-center">Account Status</th>
                <th className="px-8 py-5 text-right">Security Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-on-surface-variant">
                      <RefreshCw className="w-8 h-8 animate-spin mb-4 text-primary-custom opacity-50" />
                      <p className="font-label-md">Loading customer directory...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-on-surface-variant opacity-60">
                      <UsersIcon className="w-16 h-16 mb-4 opacity-50 text-outline-variant" />
                      <p className="font-label-lg text-lg mb-1">No users found</p>
                      <p className="font-body-sm">We couldn't find any customers matching your search.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const purchasedCount = u.orders 
                    ? u.orders.filter((o:any) => o.status !== 'CANCELLED').reduce((acc: number, curr: any) => {
                        const itemsTotal = curr.order_items?.reduce((itemAcc: number, item: any) => itemAcc + item.quantity, 0) || 0;
                        return acc + itemsTotal;
                      }, 0)
                    : 0;
                  
                  const isBanned = u.status === 'BANNED';
                  const isUpdating = updatingId === u.id;
                  
                  const getInitials = (name: string) => {
                    if (!name) return 'U';
                    const words = name.trim().split(/\s+/);
                    if (words.length === 1) return words[0].substring(0, 1).toUpperCase();
                    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
                  };

                  return (
                    <tr key={u.id} className="hover:bg-surface-container-lowest/80 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-sm border ${
                            isBanned ? 'bg-error-container/20 text-error border-error/20' : 'bg-primary-container text-on-primary-container border-primary-custom/10'
                          }`}>
                            {getInitials(u.name)}
                          </div>
                          <div>
                            <p className={`font-headline-md text-base ${isBanned ? 'text-on-surface-variant line-through opacity-70' : 'text-forest-deep'}`}>
                              {u.name || 'Anonymous User'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="font-bold text-forest-deep mb-0.5">{u.email || '-'}</p>
                        <p className="text-xs text-on-surface-variant">{u.phone || 'No Phone Number'}</p>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-xl font-headline-lg text-primary-custom leading-none">{purchasedCount}</span>
                          <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mt-1">Items Bought</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="font-bold text-forest-deep">
                          {new Date(u.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {new Date(u.created_at).toLocaleTimeString('en-IN', {
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                          isBanned 
                            ? 'bg-error-container/30 text-error border-error/30' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {isBanned ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                          {isBanned ? 'BANNED' : 'ACTIVE'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => handleToggleStatus(u.id, u.status)}
                          disabled={isUpdating}
                          className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-label-sm text-sm transition-all shadow-sm border ${
                            isBanned 
                              ? 'bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50' 
                              : 'bg-white border-error/20 text-error hover:bg-error-container/30'
                          }`}
                        >
                          {isUpdating ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : isBanned ? (
                            <UserCheck className="w-4 h-4" />
                          ) : (
                            <UserMinus className="w-4 h-4" />
                          )}
                          {isBanned ? 'Restore Access' : 'Ban User'}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
