"use client"
import { useState } from 'react'
import { adminLogin } from '@/app/actions/auth'

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await adminLogin(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }



  return (
    <div className="flex items-center justify-center py-16 px-4 relative overflow-hidden" style={{ minHeight: 'calc(100vh - 80px - 200px)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(#D4AF37 0.5px, transparent 0.5px)', backgroundSize: '16px 16px' }}></div>
      
      {/* Auth Card Container */}
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] z-10 relative">
        {/* Left Side: Visual/Heritage */}
        <div className="hidden md:block w-1/2 relative bg-forest-deep overflow-hidden">
          <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-transparent to-transparent z-10"></div>
            <img className="w-full h-full object-cover" alt="Makhana background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWBVJx2MdA2fS_DSyPkiRYLhSIXaNTQcHc0mhePDzPt_3KeAZznUyLF31C7qyccIM1Q4Wv4zlPbOSAKYMqdDWA1PI3M7Wt4T9lCGNNdo7V1DWWDTVQEKZbqHaqXMTP_eJKpc8rQib0h9iAKko-fLdvbgvfKvkQeNtAcqzxXMtAbyzaUiQ7oUejdlzlNbeVdud6_EQgbZ9wfFKaaUdJmPrSxI4iJrSgEVK4CXDDeAvnPmkM7CI_QgGHjkLVXU_mbazHOBg24mJBQ_fu" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-end p-12 z-20">
            <h2 className="font-display-lg text-display-lg text-white mb-4">Taste the Heritage</h2>
            <p className="font-body-lg text-body-lg text-secondary-fixed max-w-sm">
              Experience the nutritional richness of Mithila's finest GI-tagged superfood, delivered from the heart of Bihar to your doorstep.
            </p>
            <div className="mt-8 flex items-center gap-2">
              <div className="w-12 h-px bg-gold-accent"></div>
              <span className="font-label-sm text-gold-accent tracking-[0.2em] uppercase">Mithila Makhana Store</span>
            </div>
          </div>
        </div>

        {/* Right Side: Forms */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative overflow-hidden">
          
          {/* Login Form */}
          <div className="transition-all duration-500 absolute inset-0 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white opacity-100 translate-x-0 z-10">
            <div className="mb-8">
              <h1 className="font-headline-lg text-headline-lg text-forest-deep mb-2">Admin Login</h1>
              <p className="font-body-md text-on-surface-variant">Sign in to manage Mithila Makhana.</p>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-error-container/20 border border-error/30 text-error rounded-lg text-sm font-body-md">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block font-label-lg text-on-surface-variant mb-2" htmlFor="email">Email Address</label>
                <input name="email" required className="w-full px-4 py-3 bg-cream-bg border-0 border-b-2 border-outline-variant focus:border-gold-accent focus:ring-0 transition-colors text-charcoal-text placeholder:text-outline font-body-md outline-none" id="email" placeholder="Enter your email" type="email" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block font-label-lg text-on-surface-variant" htmlFor="password">Password</label>
                  {/* <a className="text-label-sm text-primary-custom hover:text-gold-accent transition-colors" href="#">Forgot Password?</a> */}
                </div>
                <input name="password" required className="w-full px-4 py-3 bg-cream-bg border-0 border-b-2 border-outline-variant focus:border-gold-accent focus:ring-0 transition-colors text-charcoal-text placeholder:text-outline font-body-md outline-none" id="password" placeholder="••••••••" type="password" />
              </div>
              <button disabled={loading} className="w-full py-4 bg-gold-accent text-on-primary-fixed font-headline-md rounded-lg shadow-sm hover:bg-gold-accent/90 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-70">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
          </div>
          
        </div>
      </div>
    </div>
  )
}
