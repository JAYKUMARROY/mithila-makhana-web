import { Verified, Activity, Leaf, Flame } from 'lucide-react'

export function WhyChooseUs() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-[1280px] mx-auto bg-cream-bg">
      <div className="text-center mb-16">
        <h2 className="font-headline-lg text-headline-lg text-forest-deep mb-4">Why Choose Us</h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto font-body-md text-body-md">
          Our commitment to quality and tradition makes every bite of Mithila Makhana a journey through heritage.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="p-8 bg-white rounded-xl border border-surface-container shadow-sm text-center hover:scale-105 transition-transform">
          <div className="w-16 h-16 bg-gold-accent/10 rounded-full flex items-center justify-center text-gold-accent mx-auto mb-6">
            <Verified className="w-8 h-8" />
          </div>
          <h3 className="font-headline-md text-headline-md text-forest-deep mb-3">Purity & Origin</h3>
          <p className="text-on-surface-variant text-sm">Directly sourced from the pristine wetlands of Mithila, Bihar.</p>
        </div>
        <div className="p-8 bg-white rounded-xl border border-surface-container shadow-sm text-center hover:scale-105 transition-transform">
          <div className="w-16 h-16 bg-gold-accent/10 rounded-full flex items-center justify-center text-gold-accent mx-auto mb-6">
            <Activity className="w-8 h-8" />
          </div>
          <h3 className="font-headline-md text-headline-md text-forest-deep mb-3">Nutritional Power</h3>
          <p className="text-on-surface-variant text-sm">A gluten-free superfood packed with protein, fiber, and antioxidants.</p>
        </div>
        <div className="p-8 bg-white rounded-xl border border-surface-container shadow-sm text-center hover:scale-105 transition-transform">
          <div className="w-16 h-16 bg-gold-accent/10 rounded-full flex items-center justify-center text-gold-accent mx-auto mb-6">
            <Leaf className="w-8 h-8" />
          </div>
          <h3 className="font-headline-md text-headline-md text-forest-deep mb-3">Sustainable Sourcing</h3>
          <p className="text-on-surface-variant text-sm">Fair-trade practices that support 50,000+ local farming families.</p>
        </div>
        <div className="p-8 bg-white rounded-xl border border-surface-container shadow-sm text-center hover:scale-105 transition-transform">
          <div className="w-16 h-16 bg-gold-accent/10 rounded-full flex items-center justify-center text-gold-accent mx-auto mb-6">
            <Flame className="w-8 h-8" />
          </div>
          <h3 className="font-headline-md text-headline-md text-forest-deep mb-3">Heritage Craft</h3>
          <p className="text-on-surface-variant text-sm">Traditional hand-roasting methods preserved for over a millennium.</p>
        </div>
      </div>
    </section>
  )
}
