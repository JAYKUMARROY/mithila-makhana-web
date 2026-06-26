import Link from 'next/link'
import Image from 'next/image'
import { Verified, Leaf, ShieldCheck, Tractor, Star, ArrowRight, Play, ChevronRight, Award, Heart, Sparkles } from 'lucide-react'
import { WhyChooseUs } from '@/components/why-choose-us'
import { ContactUs } from '@/components/contact-us'
import { FadeInUp, FadeInRight } from '@/components/animations'
import { getProducts } from '@/app/actions/products'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { NewsletterForm } from '@/components/newsletter-form'

export default async function Home() {
  const { data: products } = await getProducts();
  const activeProducts = (products || []).filter((p: any) => p.is_active !== false);
  const bestsellers = activeProducts.slice(0, 4);

  return (
    <div className="bg-cream-bg selection:bg-gold-accent/30">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />

      {/* 1. Light, Airy Premium Hero Section */}
      <header className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        {/* Soft, vibrant gradients instead of dark mode */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gold-accent/20 blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary-custom/10 blur-[150px]"></div>
          <div 
            className="absolute inset-0 opacity-[0.03] bg-cover bg-center mix-blend-multiply" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD9rASEdnlmhEYkpwtHZKMklvMcIdtan0dHwTEJyzJ73g8YUT-h5exETsDXTxHSO2Y4eNZaK9OeheB5FXy8BSGNWvt0HHMZ4mjkTkwRSoJuiiOkt2jC6dwRNaHLFT9EiVtCPngWIBKREEifOKPVuRl1mhhgtVR2fahniaS6qt90hyIKCeQvwTZRXiQKYr-a5XAFDKDn8akT3Xyaj9HUpMFsloT30BaWW3S0Sh2N7UWFEAOAJLcr4siVShzqeozHvdAn5XKJReMDdEaq')" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Hero Content */}
          <FadeInUp delay={0.2} className="lg:col-span-6 xl:col-span-7">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-outline-variant/30 shadow-sm mb-8">
                <Sparkles className="w-4 h-4 text-gold-accent" />
                <span className="text-forest-deep text-xs font-bold tracking-widest uppercase">The Heritage Superfood</span>
              </div>
              
              <h1 className="font-display-lg text-5xl md:text-7xl text-forest-deep leading-[1.1] tracking-tight mb-6">
                Premium Mithila Makhana. <br/>
                <span className="text-primary-custom">Direct from Farms.</span>
              </h1>
              
              <p className="font-body-lg text-lg md:text-xl text-on-surface-variant mb-10 leading-relaxed">
                Experience the crunch of tradition. Our hand-picked gorgon nuts are naturally processed and GI-tagged for the ultimate health-conscious lifestyle.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-gold-accent to-yellow-400 text-forest-deep font-bold px-8 py-4 rounded-xl shadow-[0_10px_20px_rgba(255,193,7,0.3)] hover:shadow-[0_15px_30px_rgba(255,193,7,0.4)] transition-all hover:-translate-y-1 active:scale-95 duration-300">
                    SHOP THE COLLECTION <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link href="/about" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-forest-deep border border-outline-variant/30 font-bold px-8 py-4 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 active:scale-95 duration-300">
                    <Play className="w-5 h-5 text-primary-custom" /> OUR STORY
                  </button>
                </Link>
              </div>
              
              {/* Micro-stats */}
              <div className="mt-12 pt-8 border-t border-outline-variant/20 flex flex-wrap items-center gap-8 text-forest-deep">
                <div>
                  <p className="text-3xl font-display-sm font-bold mb-1">10k+</p>
                  <p className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Happy Customers</p>
                </div>
                <div>
                  <p className="text-3xl font-display-sm font-bold mb-1">4.9/5</p>
                  <p className="text-xs uppercase tracking-wider text-on-surface-variant font-bold flex items-center gap-1"><Star className="w-3 h-3 text-gold-accent fill-gold-accent"/> Reviews</p>
                </div>
                <div>
                  <p className="text-3xl font-display-sm font-bold mb-1">GI</p>
                  <p className="text-xs uppercase tracking-wider text-on-surface-variant font-bold flex items-center gap-1">Certified Origin</p>
                </div>
              </div>
            </div>
          </FadeInUp>

          {/* Hero Imagery (Framed to fix sharp edges) */}
          <FadeInRight delay={0.4} className="lg:col-span-6 xl:col-span-5 relative hidden lg:block">
            <div className="relative w-full h-[550px] animate-float">
              {/* Decorative Glass Backing */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white shadow-2xl rotate-6 transition-transform duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-container/40 to-transparent rounded-[2.5rem] -rotate-3 transition-transform duration-500"></div>
              
              {/* The Image Container (Hides sharp edges) */}
              <div className="absolute inset-0 rounded-[2.5rem] shadow-xl overflow-hidden bg-white border-4 border-white">
                <Image 
                  fill
                  className="object-cover" 
                  alt="Premium Raw Phool Makhana Packaging" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN53Vn9-tQcGTZsT1BQUEvXq00UZed4OvXAL6XOcWrefPSnsI23COrFx3CgyczguKDQqsvFSjSMxzdGMqsghey-jr7MPiDJXGkjFJcK_154sZWW6ethjPMO5ajkjQUkOvyN5NAmbNtOC97befiK1nGQPm02Oxk5D-GBZnKAls_Zyg632aYcP3MOlfwPMHYy_HanDtkLLnWb6eUoAH8JlA_-2N-SE3jQ-3z0OGHpnYgjcebULGLnV0Ij8Yl1NXLY6dLH-KzS3X4xnLA"
                  priority
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 z-20 bg-white border border-outline-variant/20 p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-container rounded-full p-2 text-primary-custom"><Verified className="w-5 h-5"/></div>
                  <div>
                    <p className="text-forest-deep font-bold text-sm">100% Authentic</p>
                    <p className="text-on-surface-variant font-bold text-[10px] uppercase tracking-widest">GI Tagged Origin</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInRight>
        </div>
      </header>

      {/* 2. Bento Box Trust Badges (Light Theme) */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="font-display-lg text-4xl md:text-5xl text-forest-deep mb-4">Why Mithila Makhana?</h2>
            <p className="text-on-surface-variant text-lg">We don't just sell snacks; we deliver centuries of tradition, packed with unparalleled nutrition.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Large Card 1 */}
            <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-outline-variant/30 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold-accent/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-forest-deep text-white rounded-2xl flex items-center justify-center shadow-md mb-6 group-hover:-translate-y-2 transition-transform duration-500">
                  <Award className="w-7 h-7" />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-forest-deep mb-2">GI Tagged Authenticity</h3>
                <p className="text-on-surface-variant max-w-md">Our Makhana is exclusively sourced from the certified wetlands of Mithila, ensuring you get the authentic, world-renowned quality.</p>
              </div>
            </div>
            
            {/* Small Card 1 */}
            <div className="bg-white border border-outline-variant/30 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/30 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-secondary-container text-secondary-custom rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:-translate-y-2 transition-transform duration-500">
                  <Leaf className="w-7 h-7" />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-forest-deep mb-2">100% Organic</h3>
                <p className="text-on-surface-variant text-sm">Grown naturally without harmful pesticides or synthetic fertilizers.</p>
              </div>
            </div>
            
            {/* Small Card 2 */}
            <div className="bg-white border border-outline-variant/30 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/30 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-primary-container text-primary-custom rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:-translate-y-2 transition-transform duration-500">
                  <ShieldCheck className="w-7 h-7" />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-forest-deep mb-2">FSSAI Certified</h3>
                <p className="text-on-surface-variant text-sm">Processed under the strictest hygiene and quality control standards.</p>
              </div>
            </div>
            
            {/* Large Card 2 */}
            <div className="md:col-span-2 bg-gradient-to-br from-forest-deep to-[#0A2F1D] rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden relative text-white flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-64 h-64 bg-primary-custom/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl flex items-center justify-center shadow-md mb-6 group-hover:-translate-y-2 transition-transform duration-500">
                  <Tractor className="w-7 h-7" />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Empowering Local Farmers</h3>
                <p className="text-white/80 max-w-md">By buying direct, we eliminate middlemen, ensuring our farmers receive fair compensation for their incredibly hard work.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Elevated Bestsellers Carousel */}
      <section className="py-24 bg-white relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent"></div>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="font-display-lg text-4xl md:text-5xl text-forest-deep mb-4">Trending Collections</h2>
              <p className="font-body-md text-lg text-on-surface-variant">The perfect combination of health and flavor. Discover our most loved Makhana varieties.</p>
            </div>
            <Link className="group inline-flex items-center gap-2 text-primary-custom font-bold text-lg hover:text-forest-deep transition-colors" href="/shop">
              Explore Menu <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestsellers.map((product, idx) => {
              const variants = product.variants || [];
              const defaultVariant = variants.length > 0 
                ? variants.reduce((prev: any, current: any) => (prev.weight_grams > current.weight_grams ? prev : current), variants[0])
                : { size: '250g', price: product.price };
              
              const effectivePrice = defaultVariant.price;
              const category = product.short_description || 'Premium Makhana';
              
              return (
                <div key={product.id} className="group bg-white rounded-3xl p-5 border border-outline-variant/20 hover:border-primary-custom/30 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col relative">
                  <div className="absolute top-8 left-8 z-20 flex flex-col gap-2">
                    {idx === 0 && (
                      <span className="bg-gradient-to-r from-gold-accent to-yellow-400 text-forest-deep font-bold text-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                        <Star className="w-3 h-3" /> BESTSELLER
                      </span>
                    )}

                  </div>
                  
                  <Link href={`/shop/${product.slug}`} className="relative h-64 rounded-2xl bg-surface-container-low mb-6 overflow-hidden block">
                    <Image 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                      alt={product.name} 
                      src={product.image_url || '/product-placeholder.svg'} 
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </Link>
                  
                  <div className="flex-grow flex flex-col">
                    <Link href={`/shop/${product.slug}`} className="block mb-4">
                      <p className="text-primary-custom font-bold text-xs tracking-widest uppercase mb-1">{category}</p>
                      <h3 className="font-display-sm text-xl text-forest-deep font-bold line-clamp-2 group-hover:text-primary-custom transition-colors">{product.name}</h3>
                    </Link>
                    
                    <div className="mt-auto flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-on-surface-variant text-xs mb-1">Starting at</span>
                        <div className="flex items-center gap-2">
                          <span className="text-forest-deep font-display-sm font-bold text-2xl">₹{effectivePrice}</span>
                        </div>
                      </div>
                      <div className="relative z-20">
                        <AddToCartButton product={product} price={effectivePrice} size={defaultVariant.size} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. Cinematic "Our Story" Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <div className="bg-forest-deep rounded-[3rem] p-10 md:p-16 lg:p-20 shadow-2xl relative overflow-hidden">
            {/* Subtle background texture inside the card */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'#ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
              
              {/* Content block */}
              <div className="space-y-8 order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <Heart className="w-4 h-4 text-vermillion-clay" />
                  <span className="text-white/90 text-xs font-bold tracking-widest uppercase">Rooted in Tradition</span>
                </div>
                
                <h2 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1]">
                  The Legacy of <br/>
                  <span className="text-gold-accent italic font-serif">Mithila's White Gold</span>
                </h2>
                
                <div className="w-20 h-1 bg-gradient-to-r from-gold-accent to-transparent"></div>
                
                <p className="font-body-md text-lg text-white/80 leading-relaxed">
                  For centuries, the pristine waters of Mithila have nurtured the Gorgon Nut, known locally as Makhana. Our journey begins in the heart of Bihar, where farmers meticulously harvest these seeds from the depths of lotus ponds, following age-old techniques.
                </p>
                
                <p className="font-body-md text-lg text-white/80 leading-relaxed">
                  Every pack of Mithila Makhana represents a story of resilience, purity, and the vibrant culture of Madhubani.
                </p>
                
                <Link href="/about" className="inline-block mt-4">
                  <button className="flex items-center gap-3 bg-white text-forest-deep font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-cream-bg transition-all hover:-translate-y-1 active:scale-95">
                    READ OUR FULL STORY <ChevronRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>

              {/* Masonry Image Layout */}
              <div className="relative h-[500px] w-full hidden md:block order-1 lg:order-2">
                {/* Main large image */}
                <div className="absolute top-0 right-0 w-2/3 h-2/3 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white/10 z-10 hover:z-30 transition-all duration-500 hover:scale-105">
                  <Image fill className="object-cover" alt="Farmers harvesting Makhana" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW6rnIjlQmYHGDDUAUwkOIrtOTwUtMQui4Be6SwmiNABQX0QBLi6J3FiNZR3hyiwAPIZw3xQJL8zRkEkf-nOkzHF4AJiWKKVrpD_nU8tzf5H8V8A510InvQ1NuzwarxraOcVZ9SRrld68v5hlpmxHuD3XsWL05gbvJ7_SwVLeTmUWu_eXb4i_lb4lhNJMiQxKw3bIWSYLE7U-ZY9h_j7v0ZslrpL8H0GUqYFFdMVfCwK8yPa5nsivI74h4hawFJpEX3-u3UPWZPmn7" />
                </div>
                
                {/* Bottom left floating image */}
                <div className="absolute bottom-0 left-0 w-3/5 h-2/5 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white/10 z-20 hover:z-30 transition-all duration-500 hover:scale-105">
                  <Image fill className="object-cover" alt="Traditional slow-roasting process" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOt2FW7M01JhU-FjSFyRIPrdBzMOVTBY0MY2YiIFDV2TnxD3qf7WYrOq2CCjPd2NR42kNj3sqQw5Croe4kU3hWqSH6t3fPKSpTFk2gsaRd8Jo54fPPSvyCWF0ZyTR6tIDyyhJvfF9Cv_OU4r8i3PZWEnO7J46KEnxgsOOmdNjLCt0PppZThyfDvNH2u3Bn6Qlu6WYj7HhGdSyBiM0IkWCd3smkTajz45n8Obzvs_EJgxtab--svhl73jw4brMMGq8PxMpd9nA5rvJN" />
                </div>
                
                {/* Gold accent circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-gold-accent/30 z-0"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us */}
      <WhyChooseUs />

      {/* 6. Contact Us */}
      <div className="bg-cream-bg">
        <ContactUs />
      </div>

    </div>
  )
}
