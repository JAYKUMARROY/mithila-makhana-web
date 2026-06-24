import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 pt-32 pb-16 text-center">
      <h1 className="font-display-lg text-display-lg text-forest-deep mb-4">404</h1>
      <h2 className="font-headline-lg text-headline-lg text-forest-deep mb-4">Page Not Found</h2>
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-md">
        The page you're looking for doesn't exist. It may have been moved or the URL might be incorrect.
      </p>
      <div className="flex gap-4">
        <Link href="/" className="bg-gold-accent text-forest-deep font-label-lg text-label-lg px-8 py-4 rounded-lg shadow-md hover:brightness-105 active:scale-95 transition-all">
          Go Home
        </Link>
        <Link href="/shop" className="border-2 border-forest-deep text-forest-deep font-label-lg text-label-lg px-8 py-4 rounded-lg hover:bg-forest-deep hover:text-white transition-all active:scale-95">
          Browse Shop
        </Link>
      </div>
    </div>
  )
}
