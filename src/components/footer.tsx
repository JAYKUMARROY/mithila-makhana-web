"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Globe, Mail, Share2 } from 'lucide-react'

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-forest-deep text-primary-fixed">
      <div className="max-w-[1280px] mx-auto px-6 py-16 flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-sm">
          <h2 className="font-headline-lg text-headline-lg text-primary-fixed mb-6">Mithila Makhana</h2>
          <p className="font-body-md text-body-md text-on-secondary-container/80 mb-8 leading-relaxed">
            Bringing the world's most nutritious superfood from the sacred ponds of Bihar to global kitchens.
          </p>
          <div className="flex gap-4">
            <span className="w-10 h-10 rounded-full border border-primary-fixed/30 flex items-center justify-center hover:bg-primary-fixed hover:text-forest-deep transition-all cursor-pointer">
              <Globe className="w-4 h-4" />
            </span>
            <span className="w-10 h-10 rounded-full border border-primary-fixed/30 flex items-center justify-center hover:bg-primary-fixed hover:text-forest-deep transition-all cursor-pointer">
              <Mail className="w-4 h-4" />
            </span>
            <span className="w-10 h-10 rounded-full border border-primary-fixed/30 flex items-center justify-center hover:bg-primary-fixed hover:text-forest-deep transition-all cursor-pointer">
              <Share2 className="w-4 h-4" />
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-8">
          <div className="space-y-4">
            <h4 className="font-label-lg text-label-lg tracking-widest text-gold-accent">Company</h4>
            <ul className="space-y-3 font-body-md text-body-md">
              <li><Link className="text-on-secondary-container/80 hover:text-primary-fixed transition-opacity" href="/about">Our Story</Link></li>
              <li><Link className="text-on-secondary-container/80 hover:text-primary-fixed transition-opacity" href="/blog">Blog</Link></li>
              <li><Link className="text-on-secondary-container/80 hover:text-primary-fixed transition-opacity" href="/shop">Shop</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-label-lg text-label-lg tracking-widest text-gold-accent">Support</h4>
            <ul className="space-y-3 font-body-md text-body-md">
              <li><Link className="text-on-secondary-container/80 hover:text-primary-fixed transition-opacity" href="/order-history">Order History</Link></li>
              <li><Link className="text-on-secondary-container/80 hover:text-primary-fixed transition-opacity" href="/login">My Account</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-label-lg text-label-lg tracking-widest text-gold-accent">Legal</h4>
            <ul className="space-y-3 font-body-md text-body-md">
              <li><span className="text-on-secondary-container/80">Privacy Policy</span></li>
              <li><span className="text-on-secondary-container/80">Terms of Service</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-6 py-8 border-t border-white/10 text-center md:text-left">
        <p className="font-body-md text-body-md text-on-secondary-container/60">© 2026 Mithila Makhana. Preserving Heritage, Promoting Health.</p>
      </div>
    </footer>
  )
}
