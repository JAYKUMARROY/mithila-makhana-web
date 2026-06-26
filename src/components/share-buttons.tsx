"use client"
import { Share2, Link2, Mail } from 'lucide-react'
import { useToast } from '@/components/toast'

export function ShareButtons({ title, url }: { title: string, url: string }) {
  const { showToast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    showToast("Link copied to clipboard!");
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      handleCopyLink();
    }
  }

  const handleEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-forest-deep/40 uppercase tracking-widest mr-2">Share Article</span>
      <button onClick={handleShare} className="w-10 h-10 rounded-full bg-cream-bg border border-outline-variant/50 flex items-center justify-center text-forest-deep hover:bg-forest-deep hover:text-white transition-colors shadow-sm" aria-label="Share">
        <Share2 className="w-4 h-4" />
      </button>
      <button onClick={handleCopyLink} className="w-10 h-10 rounded-full bg-cream-bg border border-outline-variant/50 flex items-center justify-center text-forest-deep hover:bg-forest-deep hover:text-white transition-colors shadow-sm" aria-label="Copy Link">
        <Link2 className="w-4 h-4" />
      </button>
      <button onClick={handleEmail} className="w-10 h-10 rounded-full bg-cream-bg border border-outline-variant/50 flex items-center justify-center text-forest-deep hover:bg-forest-deep hover:text-white transition-colors shadow-sm" aria-label="Email">
        <Mail className="w-4 h-4" />
      </button>
    </div>
  )
}
