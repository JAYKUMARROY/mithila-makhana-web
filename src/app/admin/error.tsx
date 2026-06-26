"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle, LayoutDashboard } from "lucide-react"

export default function AdminError({
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
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-outline-variant/30 text-center">
        <div className="w-16 h-16 bg-error-container text-error rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        
        <h2 className="font-display-sm text-2xl text-forest-deep mb-3">Admin Error</h2>
        <p className="text-on-surface-variant text-sm mb-8">
          There was a problem loading this section of the admin panel.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 bg-forest-deep text-white font-bold text-sm rounded-xl hover:bg-primary-custom transition-all shadow-sm"
          >
            Retry
          </button>
          <Link
            href="/admin"
            className="px-6 py-2.5 bg-surface-container text-forest-deep font-bold text-sm rounded-xl hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
