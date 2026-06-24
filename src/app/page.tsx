import Link from 'next/link'
import Image from 'next/image'
import { Verified, Leaf, ShieldCheck, Tractor, Star, ArrowRight } from 'lucide-react'
import { WhyChooseUs } from '@/components/why-choose-us'
import { ContactUs } from '@/components/contact-us'
import { FadeInUp, FadeInRight, StaggerContainer, StaggerItem, ParallaxImage } from '@/components/animations'
import { getProducts } from '@/app/actions/products'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { NewsletterForm } from '@/components/newsletter-form'

export default async function Home() {
  const products = await getProducts();
  const bestsellers = products.slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full opacity-40 bg-cover bg-center" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD9rASEdnlmhEYkpwtHZKMklvMcIdtan0dHwTEJyzJ73g8YUT-h5exETsDXTxHSO2Y4eNZaK9OeheB5FXy8BSGNWvt0HHMZ4mjkTkwRSoJuiiOkt2jC6dwRNaHLFT9EiVtCPngWIBKREEifOKPVuRl1mhhgtVR2fahniaS6qt90hyIKCeQvwTZRXiQKYr-a5XAFDKDn8akT3Xyaj9HUpMFsloT30BaWW3S0Sh2N7UWFEAOAJLcr4siVShzqeozHvdAn5XKJReMDdEaq')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cream-bg via-cream-bg/90 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <FadeInUp delay={0.2} className="space-y-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-lg text-label-lg uppercase tracking-wider">
              Heritage Superfood
            </span>
            <h1 className="font-display-lg text-display-lg text-forest-deep leading-tight">
              PREMIUM MITHILA MAKHANA - <span className="text-gold-accent">Direct from the farms of Bihar</span> to your home.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
              Experience the crunch of tradition. Our hand-picked gorgon nuts are naturally processed and GI-tagged for the ultimate health-conscious snack.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop">
                <button className="bg-gold-accent text-forest-deep font-label-lg text-label-lg px-8 py-4 rounded-lg shadow-lg hover:bg-primary-container transition-all active:scale-95 duration-150">
                  SHOP THE COLLECTION
                </button>
              </Link>
              <Link href="/about">
                <button className="border-2 border-forest-deep text-forest-deep font-label-lg text-label-lg px-8 py-4 rounded-lg hover:bg-forest-deep hover:text-white transition-all active:scale-95 duration-150">
                  LEARN OUR STORY
                </button>
              </Link>
            </div>
          </FadeInUp>
          <FadeInRight delay={0.4} className="relative hidden md:block">
            <div className="w-full h-[500px] relative">
              <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/50 shadow-2xl rotate-3 transition-transform duration-500 hover:rotate-6 hover:scale-105"></div>
              <div className="absolute inset-0 rounded-3xl shadow-xl -rotate-2 transform hover:rotate-0 transition-transform duration-500 overflow-hidden">
                <Image 
                  fill
                  className="object-cover" 
                  alt="Raw Phool Makhana" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN53Vn9-tQcGTZsT1BQUEvXq00UZed4OvXAL6XOcWrefPSnsI23COrFx3CgyczguKDQqsvFSjSMxzdGMqsghey-jr7MPiDJXGkjFJcK_154sZWW6ethjPMO5ajkjQUkOvyN5NAmbNtOC97befiK1nGQPm02Oxk5D-GBZnKAls_Zyg632aYcP3MOlfwPMHYy_HanDtkLLnWb6eUoAH8JlA_-2N-SE3jQ-3z0OGHpnYgjcebULGLnV0Ij8Yl1NXLY6dLH-KzS3X4xnLA"
                />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-forest-deep text-white p-6 rounded-2xl shadow-xl">
              <span className="font-display-lg text-headline-lg block">100%</span>
              <span className="font-label-sm text-label-sm uppercase tracking-widest">Natural & Organic</span>
            </div>
          </FadeInRight>
        </div>
      </header>

      {/* Trust Badges */}
      <section className="py-12 bg-surface-container-low border-y border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto px-6">
          <StaggerContainer className="flex flex-wrap justify-center md:justify-between items-center gap-8">
            <StaggerItem className="flex items-center gap-4 group">
              <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Verified className="text-primary-custom w-8 h-8" />
              </div>
              <div>
                <h4 className="font-headline-md text-label-lg text-forest-deep">GI Tagged</h4>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Authentic Mithila Origin</p>
              </div>
            </StaggerItem>
            <StaggerItem className="flex items-center gap-4 group">
              <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Leaf className="text-secondary-custom w-8 h-8" />
              </div>
              <div>
                <h4 className="font-headline-md text-label-lg text-forest-deep">100% Organic</h4>
                <p className="font-label-sm text-label-sm text-on-surface-variant">No Pesticides or Additives</p>
              </div>
            </StaggerItem>
            <StaggerItem className="flex items-center gap-4 group">
              <div className="w-16 h-16 rounded-full bg-tertiary-fixed flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-tertiary w-8 h-8" />
              </div>
              <div>
                <h4 className="font-headline-md text-label-lg text-forest-deep">FSSAI Certified</h4>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Highest Quality Standards</p>
              </div>
            </StaggerItem>
            <StaggerItem className="flex items-center gap-4 group">
              <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Tractor className="text-primary-custom w-8 h-8" />
              </div>
              <div>
                <h4 className="font-headline-md text-label-lg text-forest-deep">Direct from Farms</h4>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Supporting Local Farmers</p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-24 bg-cream-bg">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="font-headline-lg text-headline-lg text-forest-deep mb-4">Our Bestsellers</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">The perfect combination of health and flavor. Discover our most loved Makhana varieties crafted with artisanal care.</p>
            </div>
            <Link className="text-gold-accent font-label-lg text-label-lg flex items-center gap-2 hover:underline" href="/shop">
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestsellers.map((product, idx) => {
              let meta: any = {};
              try { meta = JSON.parse(product.description || '{}') } catch(e) {}
              const category = meta.category || 'Premium Makhana';
              const discountedPrice = meta.discountedPrice || (meta.sizes?.[0]?.discountedPrice) || null;
              const effectivePrice = discountedPrice || product.price;
              
              return (
                <div key={product.id} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 border border-outline-variant/20 flex flex-col">
                  <Link href={`/shop/${product.slug}`} className="relative overflow-hidden rounded-lg aspect-square bg-[#F3F4F6] mb-4 block">
                    <div className="absolute top-3 left-3 z-10">
                      {idx === 0 && (
                        <span className="bg-gold-accent text-forest-deep font-label-sm text-label-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <Star className="w-3 h-3" /> GI Tagged
                        </span>
                      )}
                      {idx === 1 && (
                        <span className="bg-vermillion-clay text-white font-label-sm text-label-sm px-3 py-1 rounded-full shadow-sm">Popular</span>
                      )}
                    </div>
                    <Image 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                      alt={`${product.name} - ${category} from Mithila`} 
                      src={product.image_url || 'https://via.placeholder.com/300'} 
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </Link>
                  <Link href={`/shop/${product.slug}`}>
                    <h3 className="font-headline-md text-headline-md text-forest-deep text-lg mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-on-surface-variant font-label-sm text-label-sm mb-4">{category}</p>
                  </Link>
                  <div className="mt-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-forest-deep font-bold text-lg">₹{effectivePrice}</span>
                      {discountedPrice && <span className="text-on-surface-variant text-sm line-through">₹{product.price}</span>}
                    </div>
                    <AddToCartButton product={product} price={effectivePrice} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-forest-deep text-white overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative w-full h-64 rounded-xl shadow-lg border-2 border-white/10 overflow-hidden">
                    <Image fill className="object-cover" alt="Farmers harvesting Makhana from lotus ponds in Mithila, Bihar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW6rnIjlQmYHGDDUAUwkOIrtOTwUtMQui4Be6SwmiNABQX0QBLi6J3FiNZR3hyiwAPIZw3xQJL8zRkEkf-nOkzHF4AJiWKKVrpD_nU8tzf5H8V8A510InvQ1NuzwarxraOcVZ9SRrld68v5hlpmxHuD3XsWL05gbvJ7_SwVLeTmUWu_eXb4i_lb4lhNJMiQxKw3bIWSYLE7U-ZY9h_j7v0ZslrpL8H0GUqYFFdMVfCwK8yPa5nsivI74h4hawFJpEX3-u3UPWZPmn7" />
                  </div>
                  <div className="relative w-full h-48 rounded-xl shadow-lg border-2 border-white/10 overflow-hidden">
                    <Image fill className="object-cover" alt="Raw Makhana seeds freshly collected from Bihar wetlands" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAA2BCUcjSp6NuD7ywcs7K1Zp1eVJnG4NyimorDT63XVD1skBCmgDqQ9n3w2ITzCqge2NnCfi4DXLmR5jnRw_HFQbaOu0hzFteIYv4a5GTQM35OGnx3g4342iwLnhLML1cppOmY567gBDceOGmV9bGXhzrinNQ0D5vwPMyVJWwcG9GbUQhjUuZnLIDsVc_KmFLQMLrHJU7HzuxJEdiWgiFgZPSioBY2UXFM_E0LutUX0SRKRQOZBh4cgfP_FhGcVs7ghxleJjKZ0kGk" />
                  </div>
                </div>
                <div className="pt-12">
                  <div className="relative w-full h-80 rounded-xl shadow-lg border-2 border-white/10 overflow-hidden">
                    <Image fill className="object-cover" alt="Traditional slow-roasting process of Makhana in Bihar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOt2FW7M01JhU-FjSFyRIPrdBzMOVTBY0MY2YiIFDV2TnxD3qf7WYrOq2CCjPd2NR42kNj3sqQw5Croe4kU3hWqSH6t3fPKSpTFk2gsaRd8Jo54fPPSvyCWF0ZyTR6tIDyyhJvfF9Cv_OU4r8i3PZWEnO7J46KEnxgsOOmdNjLCt0PppZThyfDvNH2u3Bn6Qlu6WYj7HhGdSyBiM0IkWCd3smkTajz45n8Obzvs_EJgxtab--svhl73jw4brMMGq8PxMpd9nA5rvJN" />
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 border-8 border-gold-accent/20 rounded-full"></div>
            </div>
            <div className="space-y-8">
              <span className="text-gold-accent font-label-lg text-label-lg uppercase tracking-widest border-b border-gold-accent/50 pb-2">Rooted in Tradition</span>
              <h2 className="font-display-lg text-headline-lg text-primary-fixed leading-tight">The Legacy of Mithila's White Gold</h2>
              <p className="font-body-md text-body-md text-white/80 leading-relaxed">
                For centuries, the pristine waters of Mithila have nurtured the Gorgon Nut, known locally as Makhana. Our journey begins in the heart of Bihar, where farmers meticulously harvest these seeds from the depths of lotus ponds, following age-old techniques passed down through generations.
              </p>
              <p className="font-body-md text-body-md text-white/80 leading-relaxed">
                We are committed to preserving this heritage while ensuring sustainable practices and fair trade for our farming communities. Every pack of Mithila Makhana represents a story of resilience, purity, and the vibrant culture of Madhubani.
              </p>
              <Link className="inline-flex items-center gap-3 text-gold-accent font-label-lg text-label-lg hover:gap-5 transition-all group" href="/about">
                Read Our Full Story <ArrowRight className="w-5 h-5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Contact Us */}
      <ContactUs />

      {/* Newsletter / CTA */}
      <section className="py-20 relative overflow-hidden bg-cream-bg">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-headline-lg text-headline-lg text-forest-deep mb-6">Join Our Healthy Community</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-10">Subscribe to receive exclusive offers, authentic Bihar recipes, and health tips delivered to your inbox.</p>
          <NewsletterForm />
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl -z-10"></div>
      </section>
    </>
  )
}
