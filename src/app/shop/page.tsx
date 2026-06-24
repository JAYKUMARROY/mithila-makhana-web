import { FadeInUp } from '@/components/animations'
import { getProducts } from '@/app/actions/products'
import { ShopClient } from '@/components/shop-client'

export const dynamic = 'force-dynamic'

export default async function Shop() {
  const productsData = await getProducts()

  return (
    <div className="pt-24 pb-20 max-w-[1280px] mx-auto px-6">
      {/* Hero Title Section */}
      <FadeInUp delay={0.1} className="relative mb-12 py-10">
        <div className="absolute inset-0 bg-secondary-container/20 rounded-xl"></div>
        <div className="relative z-10 text-center md:text-left p-6">
          <h1 className="font-headline-lg text-headline-lg text-forest-deep mb-2">Heritage Superfoods</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Discover the nutritional power of authentic Gorgon Nuts from the heart of Mithila. Sourced sustainably, processed with tradition.</p>
        </div>
      </FadeInUp>
      
      <ShopClient products={productsData} />
    </div>
  )
}
