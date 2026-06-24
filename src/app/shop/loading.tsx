export default function Loading() {
  return (
    <div className="pt-24 pb-20 max-w-[1280px] mx-auto px-6 animate-pulse">
      <div className="h-32 bg-surface-container rounded-xl mb-12"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 space-y-4">
            <div className="aspect-square bg-surface-container rounded-lg"></div>
            <div className="h-5 bg-surface-container rounded w-3/4"></div>
            <div className="h-4 bg-surface-container rounded w-1/2"></div>
            <div className="h-8 bg-surface-container rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
