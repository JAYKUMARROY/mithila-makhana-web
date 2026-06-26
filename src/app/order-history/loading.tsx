import { Package } from "lucide-react"

export default function OrderHistoryLoading() {
  return (
    <div className="bg-cream-bg min-h-screen pt-32 pb-24 px-6 flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-secondary-container/50 text-secondary-custom rounded-full flex items-center justify-center mb-6 animate-pulse">
        <Package className="w-8 h-8 animate-bounce" />
      </div>
      <h2 className="font-display-lg text-3xl text-forest-deep mb-2">Loading Orders...</h2>
      <p className="text-on-surface-variant font-body-md animate-pulse">Retrieving your order history</p>
    </div>
  )
}
