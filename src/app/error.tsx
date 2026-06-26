"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, Home } from "lucide-react"

export default function GlobalError({
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
    <div className="min-h-screen flex items-center justify-center bg-cream-bg px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-outline-variant/30 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-error-container rounded-full blur-[40px] opacity-50"></div>
        
        <div className="w-20 h-20 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-inner">
          <AlertTriangle className="w-10 h-10" />
        </div>
        
        <h2 className="font-display-lg text-3xl text-forest-deep mb-3 relative z-10">Something went wrong!</h2>
        <p className="text-on-surface-variant font-body-md mb-8 relative z-10">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-forest-deep text-white font-label-lg rounded-xl hover:bg-primary-custom transition-all active:scale-95 shadow-md"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-white text-forest-deep border border-outline-variant/50 font-label-lg rounded-xl hover:bg-surface-container-low transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
