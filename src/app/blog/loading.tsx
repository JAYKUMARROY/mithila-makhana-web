import { BookOpen } from "lucide-react"

export default function BlogLoading() {
  return (
    <div className="bg-cream-bg min-h-screen pt-32 pb-24 px-6 flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-gold-accent/20 text-gold-accent rounded-full flex items-center justify-center mb-6 animate-pulse">
        <BookOpen className="w-8 h-8 animate-bounce" />
      </div>
      <h2 className="font-display-lg text-3xl text-forest-deep mb-2">Loading Journal...</h2>
      <p className="text-on-surface-variant font-body-md animate-pulse">Gathering stories from Mithila</p>
    </div>
  )
}
