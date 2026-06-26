'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Gift, CheckCircle, ShoppingBag, Sparkles, XCircle } from 'lucide-react'
import { validateReferralCode } from '@/app/actions/referral'
import Link from 'next/link'

function ReferContent() {
  const searchParams = useSearchParams()
  const urlCode = searchParams.get('code') || ''
  
  const [code, setCode] = useState(urlCode)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [referrerName, setReferrerName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    if (urlCode) {
      validateCode(urlCode)
    }
  }, [urlCode])

  const validateCode = async (c: string) => {
    if (!c || c.length < 5) {
      setIsValid(null)
      setErrorMsg('')
      return
    }
    setIsValidating(true)
    const res = await validateReferralCode(c)
    if (res.valid) {
      setIsValid(true)
      setReferrerName(res.referrerName || '')
      setErrorMsg('')
    } else {
      setIsValid(false)
      setErrorMsg(res.error || 'Invalid code')
    }
    setIsValidating(false)
  }

  // Debounced input change
  useEffect(() => {
    if (code === urlCode) return // handled by other effect
    const timer = setTimeout(() => validateCode(code), 500)
    return () => clearTimeout(timer)
  }, [code, urlCode])

  return (
    <div className="min-h-screen bg-cream-bg flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-custom/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary-custom/10 rounded-full blur-3xl"></div>

      <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 sm:px-6 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-primary-custom to-amber-500 rounded-full mb-6 shadow-lg shadow-primary-custom/30 text-[#1a1400]">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="font-headline-lg text-4xl sm:text-5xl md:text-6xl font-bold text-forest-deep mb-4 tracking-tight">
            You've Been Invited!
          </h1>
          <p className="text-lg text-on-surface-variant max-w-xl mx-auto">
            Experience the finest premium Makhana from Mithila. 
            Sign up now and help your friend earn rewards.
          </p>
        </div>

        {/* Code Input Card */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 max-w-md w-full border border-outline-variant/20 mb-12">
          {isValid ? (
            <div className="text-center mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-emerald-800 text-lg">Referred by {referrerName}</p>
              <p className="text-sm text-emerald-600 mt-1">Code applied successfully</p>
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-bold text-forest-deep mb-2 uppercase tracking-wider">Referral Code</label>
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Enter code here"
                  className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 rounded-xl px-4 py-4 font-headline-md text-xl tracking-widest text-center text-forest-deep focus:border-primary-custom focus:ring-0 transition-colors uppercase"
                />
                {isValidating && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-primary-custom border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                {!isValidating && isValid === false && code.length >= 5 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-error">
                    <XCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
              {!isValidating && isValid === false && code.length >= 5 && (
                <p className="text-error text-sm mt-2 text-center">{errorMsg}</p>
              )}
            </div>
          )}

          <Link 
            href={isValid ? `/login?ref=${code}` : `/login`}
            className={`block w-full py-4 rounded-xl font-bold text-center text-lg transition-all shadow-md active:scale-95 ${
              isValid 
                ? 'bg-forest-deep text-white hover:opacity-90 shadow-forest-deep/20' 
                : 'bg-primary-custom text-[#1a1400] hover:bg-white border border-transparent hover:border-primary-custom'
            }`}
          >
            {isValid ? 'Sign Up Now' : 'Sign Up Without Code'}
          </Link>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full text-center">
          <div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-outline-variant/20 text-forest-deep">
              1
            </div>
            <h3 className="font-bold text-forest-deep mb-2">Sign Up</h3>
            <p className="text-sm text-on-surface-variant">Create your free account.</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-outline-variant/20 text-forest-deep">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-forest-deep mb-2">Order ≥₹349</h3>
            <p className="text-sm text-on-surface-variant">Place your first order of premium Makhana.</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-outline-variant/20 text-forest-deep">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-forest-deep mb-2">Friend Earns ₹50</h3>
            <p className="text-sm text-on-surface-variant">Once delivered, your friend gets ₹50 in their wallet!</p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-on-surface-variant">
            Already have an account?{' '}
            <Link href="/shop" className="text-primary-custom font-bold hover:underline">
              Browse our shop
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ReferLandingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-custom border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ReferContent />
    </Suspense>
  )
}
