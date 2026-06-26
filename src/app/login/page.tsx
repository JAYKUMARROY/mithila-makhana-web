"use client"
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { login, signup } from '@/app/actions/auth'
import { validateReferralCode } from '@/app/actions/referral'
import { CheckCircle, XCircle } from 'lucide-react'

function LoginContent() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEmailSignup, setIsEmailSignup] = useState(true);
  const [isEmailLogin, setIsEmailLogin] = useState(true);

  const searchParams = useSearchParams();
  const urlRef = searchParams.get('ref') || '';
  const [referralCode, setReferralCode] = useState(urlRef);
  const [isValidatingRef, setIsValidatingRef] = useState(false);
  const [refValid, setRefValid] = useState<boolean | null>(null);
  const [refMsg, setRefMsg] = useState('');

  useEffect(() => {
    if (urlRef) validateRef(urlRef);
  }, [urlRef]);

  const validateRef = async (code: string) => {
    if (!code || code.length < 5) {
      setRefValid(null);
      setRefMsg('');
      return;
    }
    setIsValidatingRef(true);
    const res = await validateReferralCode(code);
    if (res.valid) {
      setRefValid(true);
      setRefMsg(`Referred by ${res.referrerName}`);
    } else {
      setRefValid(false);
      setRefMsg(res.error || 'Invalid code');
    }
    setIsValidatingRef(false);
  };

  useEffect(() => {
    if (referralCode === urlRef) return;
    const timer = setTimeout(() => validateRef(referralCode), 500);
    return () => clearTimeout(timer);
  }, [referralCode, urlRef]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await login(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await signup(formData);
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
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px] z-10 relative">
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
          <div className={`transition-all duration-500 absolute inset-0 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white overflow-y-auto custom-scrollbar ${isLogin ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 -translate-x-12 z-0 pointer-events-none'}`}>
            <div className="mb-8">
              <h1 className="font-headline-lg text-headline-lg text-forest-deep mb-2">Welcome Back</h1>
              <p className="font-body-md text-on-surface-variant">Sign in to access your curated collection of heritage snacks.</p>
            </div>
            
            {error && isLogin && (
              <div className="mb-4 p-3 bg-error-container/20 border border-error/30 text-error rounded-lg text-sm font-body-md">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                {isEmailLogin ? (
                  <>
                    <label className="block font-label-lg text-on-surface-variant mb-2" htmlFor="login-email">Email Address</label>
                    <input name="identifier" required className="w-full px-4 py-3 bg-cream-bg border-0 border-b-2 border-outline-variant focus:border-gold-accent focus:ring-0 transition-colors text-charcoal-text placeholder:text-outline font-body-md outline-none" id="login-email" placeholder="Enter your email" type="email" />
                  </>
                ) : (
                  <>
                    <label className="block font-label-lg text-on-surface-variant mb-2" htmlFor="login-phone">Mobile Number</label>
                    <input name="identifier" required pattern="\d{10}" title="Enter a valid 10-digit mobile number" className="w-full px-4 py-3 bg-cream-bg border-0 border-b-2 border-outline-variant focus:border-gold-accent focus:ring-0 transition-colors text-charcoal-text placeholder:text-outline font-body-md outline-none" id="login-phone" placeholder="10-digit number" type="text" />
                  </>
                )}
                <div className="flex justify-end mt-2">
                  <button type="button" onClick={() => setIsEmailLogin(!isEmailLogin)} className="text-sm font-label-lg text-primary-custom hover:text-gold-accent transition-colors">
                    {isEmailLogin ? 'Use mobile number instead' : 'Use email address instead'}
                  </button>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block font-label-lg text-on-surface-variant" htmlFor="password">Password</label>
                  <button type="button" className="text-label-sm text-primary-custom hover:text-gold-accent transition-colors" onClick={() => alert('Password reset link sent to your email.')}>Forgot Password?</button>
                </div>
                <input name="password" required minLength={6} title="Password must be at least 6 characters long" className="w-full px-4 py-3 bg-cream-bg border-0 border-b-2 border-outline-variant focus:border-gold-accent focus:ring-0 transition-colors text-charcoal-text placeholder:text-outline font-body-md outline-none" id="password" placeholder="••••••••" type="password" />
              </div>
              <button disabled={loading} className="w-full py-4 bg-gold-accent text-on-primary-fixed font-headline-md rounded-lg shadow-sm hover:bg-gold-accent/90 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-70">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant"></div></div>
              <div className="relative flex justify-center text-label-sm uppercase tracking-widest"><span className="bg-white px-4 text-outline">Or continue with</span></div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-1 gap-4">
              <button type="button" disabled className="flex items-center justify-center gap-3 px-4 py-3 border border-outline-variant rounded-lg bg-surface-container-low transition-colors opacity-60 cursor-not-allowed">
                <svg className="w-5 h-5 grayscale opacity-70" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span className="font-label-lg text-on-surface-variant">Google Account (Coming Soon)</span>
              </button>
            </div>
            
            <p className="mt-8 text-center font-body-md text-on-surface-variant">
              Don't have an account? 
              <button className="text-forest-deep font-bold hover:text-gold-accent underline underline-offset-4 transition-colors ml-1" onClick={() => { setIsLogin(false); setError(null); }}>Sign Up</button>
            </p>
          </div>

          {/* Signup Section */}
          <div className={`transition-all duration-500 absolute inset-0 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white overflow-y-auto custom-scrollbar ${!isLogin ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-12 z-0 pointer-events-none'}`}>
            <div className="mb-8">
              <h1 className="font-headline-lg text-headline-lg text-forest-deep mb-2">Create Account</h1>
              <p className="font-body-md text-on-surface-variant">Join our community of makhana connoisseurs today.</p>
            </div>
            
            {error && !isLogin && (
              <div className="mb-4 p-3 bg-error-container/20 border border-error/30 text-error rounded-lg text-sm font-body-md">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSignup}>
              <div>
                <label className="block font-label-lg text-on-surface-variant mb-1" htmlFor="name">Full Name</label>
                <input name="name" required className="w-full px-4 py-2 bg-cream-bg border-0 border-b-2 border-outline-variant focus:border-gold-accent focus:ring-0 transition-colors text-charcoal-text font-body-md outline-none" id="name" type="text" />
              </div>
              
              <div>
                {isEmailSignup ? (
                  <>
                    <label className="block font-label-lg text-on-surface-variant mb-1" htmlFor="reg-email">Email Address</label>
                    <input name="identifier" required className="w-full px-4 py-2 bg-cream-bg border-0 border-b-2 border-outline-variant focus:border-gold-accent focus:ring-0 transition-colors text-charcoal-text font-body-md outline-none" id="reg-email" placeholder="Enter your email" type="email" />
                  </>
                ) : (
                  <>
                    <label className="block font-label-lg text-on-surface-variant mb-1" htmlFor="reg-phone">Mobile Number</label>
                    <input name="identifier" required pattern="\d{10}" title="Enter a valid 10-digit mobile number" className="w-full px-4 py-2 bg-cream-bg border-0 border-b-2 border-outline-variant focus:border-gold-accent focus:ring-0 transition-colors text-charcoal-text font-body-md outline-none" id="reg-phone" placeholder="10-digit number" type="text" />
                  </>
                )}
                <div className="flex justify-end mt-2">
                  <button type="button" onClick={() => setIsEmailSignup(!isEmailSignup)} className="text-sm font-label-lg text-primary-custom hover:text-gold-accent transition-colors">
                    {isEmailSignup ? 'Use mobile number instead' : 'Use email address instead'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block font-label-lg text-on-surface-variant mb-1" htmlFor="reg-password">Password</label>
                <input name="password" required minLength={6} title="Password must be at least 6 characters long" className="w-full px-4 py-2 bg-cream-bg border-0 border-b-2 border-outline-variant focus:border-gold-accent focus:ring-0 transition-colors text-charcoal-text font-body-md outline-none" id="reg-password" type="password" />
              </div>
              
              <div className="pt-2">
                <label className="block font-label-lg text-on-surface-variant mb-1" htmlFor="reg-ref">Referral Code (Optional)</label>
                <div className="relative">
                  <input name="referral_code" value={referralCode} onChange={(e) => setReferralCode(e.target.value.toUpperCase())} className="w-full px-4 py-2 bg-cream-bg border-0 border-b-2 border-outline-variant focus:border-gold-accent focus:ring-0 transition-colors text-charcoal-text font-body-md outline-none uppercase" id="reg-ref" placeholder="Enter code" type="text" />
                  {isValidatingRef && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-primary-custom border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  {!isValidatingRef && refValid === true && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-500">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                  {!isValidatingRef && refValid === false && referralCode.length >= 5 && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-error">
                      <XCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
                {refMsg && (
                  <p className={`text-xs mt-1 ${refValid ? 'text-emerald-600 font-bold' : 'text-error'}`}>
                    {refMsg}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input required className="rounded border-outline-variant text-forest-deep focus:ring-forest-deep accent-forest-deep" id="terms" type="checkbox" />
                <label className="text-label-sm text-on-surface-variant" htmlFor="terms">I agree to the <a className="text-primary-custom underline" href="#">Terms &amp; Conditions</a></label>
              </div>
              <button disabled={loading} className="w-full py-4 bg-forest-deep text-white font-headline-md rounded-lg shadow-sm hover:bg-forest-deep/90 active:scale-95 transition-all duration-200 mt-4 disabled:opacity-70">
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </form>
            <p className="mt-8 text-center font-body-md text-on-surface-variant">
              Already have an account? 
              <button className="text-forest-deep font-bold hover:text-gold-accent underline underline-offset-4 transition-colors ml-1" onClick={() => { setIsLogin(true); setError(null); }}>Sign In</button>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-custom border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
