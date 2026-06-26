import type { Metadata } from 'next'
import { FadeInUp } from '@/components/animations'
import { getProducts } from '@/app/actions/products'
import { ShopClient } from '@/components/shop-client'
import { Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shop All Makhana Products | Mithila Makhana',
  description: 'Browse our premium collection of GI-tagged Makhana products from Bihar — raw, roasted, flavored, and gift packs. Free shipping on orders above ₹499.',
}

export const dynamic = 'force-dynamic'

export default async function Shop() {
  const { data: productsData } = await getProducts()
  const activeProducts = (productsData || []).filter((p: any) => p.is_active !== false);

  return (
    <div className="bg-cream-bg min-h-screen selection:bg-gold-accent/30">
      
      {/* Cinematic Hero Section */}
      <div className="relative pt-32 pb-24 overflow-hidden bg-forest-deep">
        {/* Ambient Glowing Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-50%] left-[20%] w-[60%] h-[60%] rounded-full bg-gold-accent/10 blur-[150px] mix-blend-screen"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-custom/20 blur-[120px] mix-blend-screen"></div>
          
          {/* Subtle Texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'#ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 text-center">
          <FadeInUp delay={0.1} className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-gold-accent" />
              <span className="text-white/90 text-xs font-bold tracking-widest uppercase">The Heritage Superfood</span>
            </div>
            
            <h1 className="font-display-lg text-5xl md:text-6xl text-white mb-6 leading-tight">
              Curated <span className="text-gold-accent italic font-serif">Mithila</span> Collections
            </h1>
            
            <p className="font-body-md text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Discover the nutritional power of authentic Gorgon Nuts from the heart of Bihar. Sourced sustainably, processed with tradition, and delivered with care.
            </p>
          </FadeInUp>
        </div>
        
        {/* Decorative divider fading into the cream background below */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-cream-bg to-transparent"></div>
      </div>
      
      {/* Main Shop Interface */}
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <ShopClient products={activeProducts} />
      </div>
    </div>
  )
}
