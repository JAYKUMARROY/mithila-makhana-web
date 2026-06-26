"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ChevronRight, Verified, Leaf, Minus, Plus, ShoppingBag, Truck, Activity, BadgeCheck, Flame, HeartPulse, BookOpen, CheckCircle2, AlertTriangle } from 'lucide-react'
import { FadeInRight, StaggerContainer, StaggerItem } from '@/components/animations'
import { getProductBySlug, getProducts } from '@/app/actions/products'
import { checkPincodeServiceability } from '@/app/actions/shipmozo'
import { useCart } from '@/components/cart-context'
import { useToast } from '@/components/toast'
import { useParams, useRouter } from 'next/navigation'

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState("");
  const [imgLoading, setImgLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");

  useEffect(() => {
    setImgLoading(true);
  }, [activeImg]);
  
  const [pincode, setPincode] = useState('');
  const [pinLoading, setPinLoading] = useState(false);
  const [pinMessage, setPinMessage] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  
  useEffect(() => {
    const slug = params.id as string;
    Promise.all([getProductBySlug(slug), getProducts()]).then(([data, all]) => {
      setProduct(data.data);
      setAllProducts(all.data || []);
      if (data.data?.image_url) setActiveImg(data.data.image_url);
      if (data.data?.variants?.length > 0) {
        setSelectedSize(data.data.variants[0].size);
      } else if (data.data?.price) {
        // Fallback for products without variants
        setSelectedSize('');
      }
      setLoading(false);
    });
  }, [params.id]);

  if (loading) return (
    <div className="pt-32 pb-24 min-h-[500px] flex items-start justify-center max-w-[1280px] mx-auto px-6">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
        <div className="lg:col-span-7 h-[400px] md:h-[600px] bg-surface-container-low rounded-[32px]"></div>
        <div className="lg:col-span-5 space-y-6 pt-4">
          <div className="h-10 bg-surface-container-low rounded-lg w-3/4"></div>
          <div className="h-12 bg-surface-container-low rounded-lg w-1/3"></div>
          <div className="h-8 bg-surface-container-low rounded-lg w-1/2"></div>
          <div className="h-14 bg-surface-container-low rounded-lg w-full mt-12"></div>
          <div className="h-14 bg-surface-container-low rounded-lg w-full"></div>
        </div>
      </div>
    </div>
  );
  if (!product) return <div className="pt-32 pb-24 min-h-[500px] flex items-center justify-center text-forest-deep text-xl">Product not found.</div>;

  let meta: any = {};
  try { meta = JSON.parse(product.description || '{}') } catch (e) {}
  
  const variants = meta.sizes?.length > 0 ? meta.sizes : (product.variants || []);
  const category = product.short_description || meta.category || 'Premium Makhana';
  const currentVariant = variants.find((v: any) => v.size === selectedSize) || variants[0] || { stock: product.stock_quantity || 0, price: product.price };
  const currentStock = Number(currentVariant.stock) || 0;
  const currentPrice = currentVariant.price;
  const metaSize = (meta.sizes || []).find((s: any) => s.size === selectedSize) || (meta.sizes || [])[0];
  const currentDiscount = metaSize?.discountedPrice || null;
  const nutrition = meta.nutrition || { calories: '347 kcal', protein: '9.7g', carbohydrate: '76.9g', fat: '0.1g' };
  const images = meta.images?.length > 0 ? meta.images : [product.image_url].filter(Boolean);
  const relatedProducts = allProducts.filter((p: any) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart({ product, quantity: qty, size: selectedSize || undefined, price_at_time: currentDiscount || currentPrice });
    showToast(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart({ product, quantity: qty, size: selectedSize || undefined, price_at_time: currentDiscount || currentPrice });
    // Open cart drawer for checkout
    const event = new CustomEvent('open-cart');
    window.dispatchEvent(event);
  };

  return (
    <>
      <main className="pt-24 pb-16 px-6 max-w-[1280px] mx-auto">
        <nav className="mb-8 flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm" aria-label="Breadcrumb">
          <Link className="hover:text-primary-custom transition-colors" href="/">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link className="hover:text-primary-custom transition-colors" href="/shop">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-forest-deep font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <FadeInRight delay={0.1} className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4 items-start">
            <div className="relative w-full h-[400px] md:h-[600px] flex-1 bg-surface-container-lowest rounded-[32px] overflow-hidden group shadow-sm border border-outline-variant/10 shrink-0">
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="bg-gold-accent text-on-primary-fixed px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1 shadow-sm"><Verified className="w-4 h-4" /> GI TAGGED</span>
                <span className="bg-forest-deep text-white px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1 shadow-sm"><Leaf className="w-4 h-4" /> ORGANIC</span>
              </div>
              {imgLoading && <div className="absolute inset-0 bg-surface-container-low animate-pulse z-20"></div>}
              <Image 
                fill 
                className={`object-cover transition-all duration-500 group-hover:scale-110 ${imgLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} rounded-[32px]`} 
                alt={`${product.name} - ${category} product photo`} 
                src={activeImg || product.image_url} 
                sizes="(max-width: 768px) 100vw, 60vw" 
                priority 
                onLoad={() => setImgLoading(false)}
              />
            </div>
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3">
                {images.map((img: string, i: number) => (
                  <button key={i} className={`w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-white border-2 transition-all hover:scale-105 relative ${activeImg === img ? 'border-primary-custom shadow-md' : 'border-transparent'}`} onClick={() => setActiveImg(img)}>
                    <Image fill className="object-cover" alt={`${product.name} view ${i + 1}`} src={img} sizes="96px" />
                  </button>
                ))}
              </div>
            )}
          </FadeInRight>

          <StaggerContainer delayChildren={0.2} staggerChildren={0.1} className="lg:col-span-5 flex flex-col">
            <StaggerItem><h1 className="font-headline-lg text-headline-lg text-forest-deep mb-2">{product.name}</h1></StaggerItem>
            <StaggerItem className="mb-8">
              <span className="text-3xl font-bold text-forest-deep">₹{currentDiscount || currentPrice}</span>
              {currentDiscount && (
                <>
                  <span className="ml-2 text-on-surface-variant line-through text-lg">₹{currentPrice}</span>
                  <span className="ml-3 bg-vermillion-clay/10 text-vermillion-clay px-2 py-1 rounded text-sm font-bold">SALE</span>
                </>
              )}
            </StaggerItem>
            <StaggerItem className="mb-6">
              <label className="block font-label-lg text-label-lg text-forest-deep mb-3 uppercase tracking-wider">Size Selection</label>
              {variants.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {variants.map((v: any, idx: number) => (
                    <button key={v.size || idx} onClick={() => setSelectedSize(v.size)} className={`px-6 py-2 border-2 ${selectedSize === v.size ? 'border-primary-custom bg-primary-custom/5 text-primary-custom' : 'border-outline-variant hover:border-primary-custom'} rounded-lg font-bold transition-all hover:scale-105 active:scale-95`}>{v.size}</button>
                  ))}
                </div>
              )}
              {currentStock > 0 && currentStock < 10 && (
                <div className="text-vermillion-clay font-bold text-sm mt-3 animate-pulse">
                  Only {currentStock} left in stock - order soon!
                </div>
              )}
              {currentStock <= 0 && (
                <div className="text-vermillion-clay font-bold text-sm mt-3">
                  Currently out of stock.
                </div>
              )}
            </StaggerItem>
            <StaggerItem className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-outline-variant rounded-lg bg-white overflow-hidden">
                  <button className="px-4 py-3 hover:bg-surface-container transition-colors disabled:opacity-50" disabled={currentStock <= 0} onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity"><Minus className="w-5 h-5" /></button>
                  <input className="w-12 text-center border-none focus:ring-0 font-bold bg-transparent" min="1" max={currentStock > 0 ? currentStock : 1} type="number" value={qty} readOnly />
                  <button className="px-4 py-3 hover:bg-surface-container transition-colors disabled:opacity-50" disabled={currentStock <= 0 || qty >= currentStock} onClick={() => setQty(qty + 1)} aria-label="Increase quantity"><Plus className="w-5 h-5" /></button>
                </div>
                <button onClick={handleAddToCart} disabled={currentStock <= 0} className="flex-1 bg-forest-deep text-white font-bold py-3.5 rounded-lg hover:bg-forest-deep/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ShoppingBag className="w-5 h-5" /> {currentStock <= 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                </button>
              </div>
              <button onClick={handleBuyNow} disabled={currentStock <= 0} className="w-full bg-gold-accent text-forest-deep font-bold py-3.5 rounded-lg hover:bg-gold-accent/90 active:scale-[0.98] transition-all uppercase tracking-widest shadow-md shadow-gold-accent/20 disabled:opacity-50 disabled:cursor-not-allowed">
                BUY IT NOW
              </button>

              <div className="mt-4 p-5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl">
                <label className="block font-label-lg text-forest-deep mb-2">Check Delivery</label>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (pincode.length !== 6) return;
                  setPinLoading(true);
                  const res = await checkPincodeServiceability(pincode);
                  setPinSuccess(!!(res.success && res.serviceable));
                  setPinMessage(res.success && res.serviceable ? `Available! Estimated Delivery: ${res.estimatedDelivery}` : res.message || 'Not available for this pincode.');
                  setPinLoading(false);
                }} className="flex gap-2">
                  <input 
                    type="text" 
                    pattern="[0-9]{6}" 
                    maxLength={6} 
                    required
                    placeholder="Enter 6-digit Pincode" 
                    value={pincode} 
                    onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-surface-container-low border border-outline-variant/30 px-4 py-2.5 rounded-lg outline-none focus:border-primary-custom"
                  />
                  <button disabled={pincode.length !== 6 || pinLoading} className="bg-forest-deep text-white px-6 py-2.5 rounded-lg font-bold disabled:opacity-50 transition-all hover:bg-forest-deep/90 active:scale-95">
                    {pinLoading ? 'Checking...' : 'Check'}
                  </button>
                </form>
                {pinMessage && (
                  <p className={`mt-3 text-sm font-bold flex items-center gap-1 ${pinSuccess ? 'text-primary-custom' : 'text-error'}`}>
                    {pinSuccess ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    {pinMessage}
                  </p>
                )}
              </div>
            </StaggerItem>
            <StaggerItem className="grid grid-cols-3 gap-4 border-t border-b border-surface-container py-6 mb-8">
              <div className="flex flex-col items-center text-center gap-2"><Truck className="text-primary-custom w-8 h-8" /><span className="text-[11px] font-bold text-on-surface-variant uppercase">Fast Shipping</span></div>
              <div className="flex flex-col items-center text-center gap-2"><Activity className="text-primary-custom w-8 h-8" /><span className="text-[11px] font-bold text-on-surface-variant uppercase">Zero Cholesterol</span></div>
              <div className="flex flex-col items-center text-center gap-2"><BadgeCheck className="text-primary-custom w-8 h-8" /><span className="text-[11px] font-bold text-on-surface-variant uppercase">FSSAI Certified</span></div>
            </StaggerItem>
          </StaggerContainer>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <div className="flex gap-8 border-b border-surface-container mb-8">
              <button className="pb-4 border-b-2 border-primary-custom text-primary-custom font-bold text-lg">Description</button>
            </div>
            <div className="space-y-6">
              <p className="text-body-lg font-body-lg text-charcoal-text leading-relaxed">Crunchy, organic, and nutritious, {product.name} is the ultimate guilt-free snack. Sourced directly from the fertile wetlands of Mithila, Bihar, these fox nuts are hand-picked, slow-roasted to perfection.</p>
              <p className="text-on-surface-variant leading-relaxed">Rich in antioxidants and minerals, this snack is designed for those who refuse to compromise on flavor or health. Perfect for evening tea, post-workout fuel, or late-night cravings.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="bg-surface-container-low p-6 rounded-xl flex items-start gap-4"><Flame className="text-vermillion-clay bg-white p-3 rounded-full shadow-sm w-12 h-12" /><div><h4 className="font-bold text-forest-deep">Bold Flavor</h4><p className="text-sm text-on-surface-variant">Authentic spice blend with natural ingredients.</p></div></div>
                <div className="bg-surface-container-low p-6 rounded-xl flex items-start gap-4"><HeartPulse className="text-primary-custom bg-white p-3 rounded-full shadow-sm w-12 h-12" /><div><h4 className="font-bold text-forest-deep">Nutrient Dense</h4><p className="text-sm text-on-surface-variant">Low glycemic index, rich in calcium and iron.</p></div></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 bg-forest-deep text-white p-8 rounded-2xl relative overflow-hidden">
            <h3 className="font-headline-md text-headline-md mb-6 flex items-center gap-2"><BookOpen className="w-6 h-6" /> Nutritional Info</h3>
            <div className="space-y-4 relative z-10">
              {[['Serving Size', nutrition.servingSize || '100g'], ['Protein', nutrition.protein || '9g'], ['Calories', nutrition.calories || '347 kcal'], ['Carbohydrate', nutrition.carbohydrate || '77g'], ['Dietary Fiber', nutrition.fiber || '0.6g'], ['Fat', nutrition.fat || '0.1g']].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-white/10 pb-3"><span className="opacity-80">{label}</span><span className="font-bold">{value}</span></div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10"><p className="text-xs italic opacity-70">* Percent Daily Values are based on a 2,000 calorie diet.</p></div>
          </div>
        </div>
      </main>

      {relatedProducts.length > 0 && (
        <section className="bg-surface-container-low py-16 px-6">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-forest-deep mb-10 text-center">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <Link key={item.id} href={`/shop/${item.slug}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all group border border-outline-variant/10">
                  <div className="h-48 overflow-hidden rounded-t-xl bg-surface relative">
                    <Image fill className="object-cover group-hover:scale-110 transition-transform" alt={`${item.name} - related product`} src={item.image_url || '/product-placeholder.svg'} sizes="(max-width: 768px) 50vw, 25vw" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-forest-deep mb-1 line-clamp-1">{item.name}</h4>
                    <p className="text-primary-custom font-bold">₹{item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
