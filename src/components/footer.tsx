"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Globe, Mail, Share2, Sparkles, MapPin, Phone } from 'lucide-react'
import { useToast } from '@/components/toast'

export function Footer() {
  const pathname = usePathname();
  const { showToast } = useToast();

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mithila Makhana',
          text: 'Check out these authentic Mithila Makhanas!',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  };
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="relative bg-[#1A2E20] text-white print:hidden overflow-hidden mt-auto">
      {/* Decorative Top Accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-accent via-primary-custom to-gold-accent"></div>
      
      {/* Subtle Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gold-accent/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-custom/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto px-6 pt-24 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Brand Column */}
          <div className="md:col-span-12 lg:col-span-5 space-y-8">
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-accent to-yellow-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-forest-deep" />
              </div>
              <h2 className="font-display-lg text-3xl font-bold text-white tracking-tight">Mithila Makhana</h2>
            </div>
            
            <p className="font-body-md text-lg text-white/70 max-w-md leading-relaxed">
              Bringing the world's most nutritious, GI-tagged superfood from the sacred ponds of Bihar directly to global kitchens.
            </p>
            
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold-accent hover:text-forest-deep hover:border-gold-accent hover:-translate-y-1 transition-all duration-300">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold-accent hover:text-forest-deep hover:border-gold-accent hover:-translate-y-1 transition-all duration-300">
                <Mail className="w-5 h-5" />
              </a>
              <button onClick={handleShare} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold-accent hover:text-forest-deep hover:border-gold-accent hover:-translate-y-1 transition-all duration-300">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Links Columns */}
          <div className="md:col-span-12 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-6">
              <h4 className="font-label-lg font-bold text-gold-accent uppercase tracking-widest text-sm">Company</h4>
              <ul className="space-y-4">
                <li><Link className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all" href="/about">Our Story</Link></li>
                <li><Link className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all" href="/shop">Shop Collection</Link></li>
                <li><Link className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all" href="/blog">Health Blog</Link></li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-label-lg font-bold text-gold-accent uppercase tracking-widest text-sm">Support</h4>
              <ul className="space-y-4">
                <li><Link className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all" href="/login">My Account</Link></li>
                <li><Link className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all" href="/order-history">Track Order</Link></li>
                <li><Link className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all" href="/contact">Contact Us</Link></li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-label-lg font-bold text-gold-accent uppercase tracking-widest text-sm">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-white/70">
                  <MapPin className="w-5 h-5 text-gold-accent shrink-0 mt-0.5" />
                  <span className="text-sm">Darbhanga, Bihar<br/>India 846004</span>
                </li>
                <li className="flex items-center gap-3 text-white/70">
                  <Phone className="w-5 h-5 text-gold-accent shrink-0" />
                  <span className="text-sm">+91 98765 43210</span>
                </li>
              </ul>
            </div>
          </div>
          
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">© {new Date().getFullYear()} Mithila Makhana. Preserving Heritage, Promoting Health.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-white/50 hover:text-white transition-colors cursor-pointer">Privacy Policy</Link>
            <Link href="/terms" className="text-white/50 hover:text-white transition-colors cursor-pointer">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
