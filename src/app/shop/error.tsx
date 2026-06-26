"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, ShoppingBag } from "lucide-react"

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="pt-32 pb-24 min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-outline-variant/30 text-center">
        <div className="w-20 h-20 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <AlertTriangle className="w-10 h-10" />
        </div>
        
        <h2 className="font-display-lg text-3xl text-forest-deep mb-3">Shop Error</h2>
        <p className="text-on-surface-variant font-body-md mb-8">
          We couldn't load the products at this time. Please try again.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-forest-deep text-white font-label-lg rounded-xl hover:bg-primary-custom transition-all shadow-md"
          >
            Try Again
          </button>
          <Link
            href="/shop"
            className="px-6 py-3 bg-white text-forest-deep border border-outline-variant/50 font-label-lg rounded-xl hover:bg-surface-container-low transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Back to Shop
          </Link>
        </div>
      </div>
    </div>
  )
}
