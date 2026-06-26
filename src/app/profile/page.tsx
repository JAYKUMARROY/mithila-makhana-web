"use client"

import { useState, useEffect } from 'react'
import { User, Mail, MapPin, Phone, Shield, Save, Wallet, Gift, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getProfile, updateProfile } from '@/app/actions/profile'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    addresses: [] as any[],
    wallet_balance: 0
  })
  
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)

  useEffect(() => {
    getProfile().then(res => {
      if (!res) {
        router.push('/login');
      } else {
        setProfile({
          name: res.name || '',
          email: res.email || '',
          phone: res.phone || '',
          addresses: res.addresses || [],
          wallet_balance: res.wallet_balance || 0
        });
        setLoading(false);
      }
    });
  }, [router]);

  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    // Keep empty values for address to avoid breaking the old action API
    formData.append('address', '');
    formData.append('city', '');
    formData.append('state', '');
    formData.append('zip', '');
    await updateProfile(formData);
    setSaving(false);
    setIsEditing(false)
  }

  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const addressData = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      zip: formData.get('zip'),
    };
    
    if (editingAddress) {
      await import('@/app/actions/profile').then(m => m.manageAddress('edit', { id: editingAddress.id, ...addressData }));
    } else {
      await import('@/app/actions/profile').then(m => m.manageAddress('add', addressData));
    }
    
    setAddressModalOpen(false);
    setEditingAddress(null);
    import('@/app/actions/profile').then(m => m.getProfile()).then(res => res && setProfile(p => ({...p, addresses: res.addresses})));
  }

  const handleDeleteAddress = async (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      await import('@/app/actions/profile').then(m => m.manageAddress('delete', { id }));
      import('@/app/actions/profile').then(m => m.getProfile()).then(res => res && setProfile(p => ({...p, addresses: res.addresses})));
    }
  }

  const handleSetDefaultAddress = async (id: string) => {
    await import('@/app/actions/profile').then(m => m.manageAddress('set_default', { id }));
    import('@/app/actions/profile').then(m => m.getProfile()).then(res => res && setProfile(p => ({...p, addresses: res.addresses})));
  }

  if (loading) return <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <main className="pt-32 pb-24 bg-cream-bg min-h-screen">
      <div className="max-w-[1000px] mx-auto px-6">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="font-display-lg text-4xl md:text-5xl text-forest-deep mb-4">My Profile</h1>
            <p className="font-body-lg text-on-surface-variant text-lg">
              Manage your personal information, addresses, and account security.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar / Quick Info */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-8 text-center">
              <div className="w-24 h-24 bg-primary-custom/10 rounded-full mx-auto flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-primary-custom" />
              </div>
              <h3 className="font-headline-md text-forest-deep text-xl">{profile.name}</h3>
              <p className="text-on-surface-variant font-body-md mb-4">{profile.email}</p>
              <div className="flex justify-center gap-2">
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Verified Member
                </span>
              </div>
            </div>

            {/* Wallet & Rewards */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/30 p-6 overflow-hidden relative group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Wallet className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <h4 className="font-label-lg text-forest-deep mb-4 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary-custom" />
                  Wallet Balance
                </h4>
                <div className="font-headline-lg text-3xl font-bold text-forest-deep mb-6">
                  ₹{profile.wallet_balance}
                </div>
                <div className="space-y-2">
                  <Link href="/wallet" className="flex items-center justify-between w-full text-left font-body-md text-forest-deep hover:text-primary-custom transition-colors py-2 border-b border-outline-variant/20">
                    <span className="flex items-center gap-2"><Wallet className="w-4 h-4" /> My Wallet</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/referral" className="flex items-center justify-between w-full text-left font-body-md text-emerald-600 hover:text-emerald-700 transition-colors py-2 border-b border-outline-variant/20">
                    <span className="flex items-center gap-2"><Gift className="w-4 h-4" /> Refer & Earn ₹50</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-6">
              <h4 className="font-label-lg text-forest-deep mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gold-accent" />
                Account Security
              </h4>
              <button onClick={() => alert('Password reset email sent.')} className="w-full text-left font-body-md text-on-surface-variant hover:text-primary-custom transition-colors py-2 border-b border-outline-variant/20">
                Change Password
              </button>
              <button disabled className="w-full text-left font-body-md text-on-surface-variant/50 transition-colors py-2 border-b border-outline-variant/20 cursor-not-allowed">
                Two-Factor Authentication (Coming Soon)
              </button>
              <button disabled className="w-full text-left font-body-md text-error/50 transition-colors py-2 mt-2 cursor-not-allowed">
                Delete Account (Contact Support)
              </button>
            </div>
          </div>

          {/* Main Form */}
          <div className="md:col-span-8 bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-headline-md text-forest-deep text-2xl">Personal Information</h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-primary-custom hover:underline font-label-lg"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                    <input 
                      name="name"
                      disabled={!isEditing}
                      value={profile.name}
                      onChange={e => setProfile({...profile, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary-custom outline-none disabled:bg-surface-container-low disabled:text-on-surface-variant"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                    <input 
                      name="email"
                      disabled={true} // Email should usually not be directly editable without verification
                      type="email"
                      value={profile.email}
                      onChange={e => setProfile({...profile, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary-custom outline-none disabled:bg-surface-container-low disabled:text-on-surface-variant"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                    <input 
                      name="phone"
                      disabled={!isEditing}
                      pattern="\d{10}"
                      maxLength={10}
                      title="10-digit Phone Number"
                      value={profile.phone}
                      onChange={e => setProfile({...profile, phone: e.target.value.replace(/\D/g, '')})}
                      className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary-custom outline-none disabled:bg-surface-container-low disabled:text-on-surface-variant"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="pt-6 border-t border-outline-variant/20 flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 font-label-lg text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={saving}
                    type="submit"
                    className="px-8 py-3 bg-forest-deep text-white font-label-lg rounded-xl flex items-center gap-2 hover:bg-primary-custom transition-colors active:scale-95 shadow-md disabled:opacity-70"
                  >
                    <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>

            <div className="mt-12 pt-12 border-t border-outline-variant/20">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-headline-md text-forest-deep text-2xl">Address Book</h3>
                {profile.addresses.length < 10 && (
                  <button 
                    onClick={() => { setEditingAddress(null); setAddressModalOpen(true); }}
                    className="text-primary-custom hover:underline font-label-lg"
                  >
                    + Add New Address
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.addresses.map((addr: any) => (
                  <div key={addr.id} className="border border-outline-variant/30 rounded-xl p-6 relative">
                    {addr.isDefault && (
                      <span className="absolute top-4 right-4 bg-primary-container text-on-primary-container px-2 py-1 text-[10px] font-bold rounded uppercase">
                        Default
                      </span>
                    )}
                    <h4 className="font-headline-sm text-forest-deep mb-1">{addr.name}</h4>
                    <p className="text-on-surface-variant text-sm mb-4">{addr.phone}</p>
                    <p className="text-on-surface-variant font-body-sm leading-relaxed mb-6">
                      {addr.address}<br />
                      {addr.city}, {addr.state} {addr.zip}
                    </p>
                    <div className="flex gap-4 pt-4 border-t border-outline-variant/20">
                      <button onClick={() => { setEditingAddress(addr); setAddressModalOpen(true); }} className="text-sm font-label-lg text-forest-deep hover:text-primary-custom">Edit</button>
                      <button onClick={() => handleDeleteAddress(addr.id)} className="text-sm font-label-lg text-error hover:underline">Delete</button>
                      {!addr.isDefault && (
                        <button onClick={() => handleSetDefaultAddress(addr.id)} className="text-sm font-label-lg text-on-surface-variant hover:text-forest-deep ml-auto">
                          Set Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {profile.addresses.length === 0 && (
                  <div className="col-span-1 md:col-span-2 text-center py-12 border border-dashed border-outline-variant/50 rounded-xl text-on-surface-variant">
                    No addresses saved yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-8 max-w-[500px] w-full shadow-lg">
            <h3 className="font-headline-md text-forest-deep text-2xl mb-6">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Full Name</label>
                <input required name="name" defaultValue={editingAddress?.name || ''} className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg outline-none focus:ring-2 focus:ring-primary-custom" />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Phone Number</label>
                <input required type="text" pattern="\d{10}" maxLength={10} title="10-digit Phone Number" name="phone" defaultValue={editingAddress?.phone || ''} onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '')} className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg outline-none focus:ring-2 focus:ring-primary-custom" />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Street Address</label>
                <input required name="address" defaultValue={editingAddress?.address || ''} className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg outline-none focus:ring-2 focus:ring-primary-custom" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-1">City</label>
                  <input required name="city" defaultValue={editingAddress?.city || ''} className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg outline-none focus:ring-2 focus:ring-primary-custom" />
                </div>
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-1">State</label>
                  <input required name="state" defaultValue={editingAddress?.state || ''} className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg outline-none focus:ring-2 focus:ring-primary-custom" />
                </div>
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">ZIP Code</label>
                <input required type="text" pattern="\d{6}" maxLength={6} title="6-digit ZIP/PIN Code" name="zip" defaultValue={editingAddress?.zip || ''} onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '')} className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg outline-none focus:ring-2 focus:ring-primary-custom" />
              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setAddressModalOpen(false)} className="px-5 py-2 font-label-lg text-on-surface-variant hover:bg-surface-container rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-forest-deep text-white font-label-lg rounded-lg hover:bg-primary-custom">Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
