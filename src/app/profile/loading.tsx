import { User } from "lucide-react"

export default function ProfileLoading() {
  return (
    <div className="bg-cream-bg min-h-screen pt-32 pb-24 px-6 flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-primary-container/30 text-primary-custom rounded-full flex items-center justify-center mb-6 animate-pulse">
        <User className="w-8 h-8 animate-bounce" />
      </div>
      <h2 className="font-display-lg text-3xl text-forest-deep mb-2">Loading Profile...</h2>
      <p className="text-on-surface-variant font-body-md animate-pulse">Securely fetching your details</p>
    </div>
  )
}
