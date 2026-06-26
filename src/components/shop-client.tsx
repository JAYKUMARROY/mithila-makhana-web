"use client"
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Verified, ChevronLeft, ChevronRight, Filter, Star, Sparkles } from 'lucide-react'
import { StaggerContainer, StaggerItem } from '@/components/animations'
import { AddToCartButton } from '@/components/add-to-cart-button'

export function ShopClient({ products }: { products: any[] }) {
  const [categories, setCategories] = useState<string[]>([]);
  const [sortParam, setSortParam] = useState('Best Selling');
  
  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) setCategories(categories.filter(c => c !== cat));
    else setCategories([...categories, cat]);
  };

  const activeProducts = useMemo(() => {
    let res = [...products];
    if (categories.length > 0) {
      res = res.filter(p => {
        let meta: any = {};
        try { meta = JSON.parse(p.description || '{}') } catch (e) {}
        return categories.includes(meta.category || 'Premium Makhana');
      });
    }
    if (sortParam === 'Price: Low to High') res.sort((a,b) => a.price - b.price);
    else if (sortParam === 'Price: High to Low') res.sort((a,b) => b.price - a.price);
    else if (sortParam === 'Newest Arrivals') res.sort((a,b) => b.id.localeCompare(a.id));
    return res;
  }, [products, categories, sortParam]);

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="mb-10 flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider" aria-label="Breadcrumb">
        <Link className="hover:text-primary-custom hover:underline transition-all" href="/">Home</Link>
        <ChevronRight className="w-4 h-4 opacity-50" />
        <span className="text-forest-deep font-bold">Shop All</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sleek Filter Sidebar */}
        <aside className="w-full lg:w-[280px] shrink-0 space-y-8">
          
          {/* Categories Bento Box */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-full blur-[30px] -z-10"></div>
            
            <div className="flex items-center gap-2 mb-6 text-forest-deep">
              <Filter className="w-5 h-5" />
              <h3 className="font-label-lg font-bold uppercase tracking-widest text-sm">Filter by Category</h3>
            </div>
            
            <div className="space-y-3">
              {['Raw Makhana', 'Roasted Snacks', 'Flavored Delights', 'Premium Gift Boxes'].map(cat => (
                <label key={cat} className="flex items-center gap-4 cursor-pointer group p-2 hover:bg-cream-bg rounded-xl transition-colors">
                  <input type="checkbox" className="sr-only" checked={categories.includes(cat)} onChange={() => toggleCategory(cat)} />
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all duration-300 ${categories.includes(cat) ? 'bg-gold-accent border-gold-accent' : 'border-outline-variant/50 group-hover:border-gold-accent/50'}`}>
                    {categories.includes(cat) && <svg className="w-3 h-3 text-forest-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className={`font-body-md transition-colors ${categories.includes(cat) ? 'text-forest-deep font-bold' : 'text-on-surface-variant group-hover:text-forest-deep'}`}>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* GI Tagged Glowing Card */}
          <div className="relative bg-gradient-to-br from-forest-deep to-[#0A2F1D] rounded-3xl p-6 overflow-hidden shadow-lg group">
            <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-gold-accent/20 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-white/20 shadow-inner">
                <Verified className="w-6 h-6 text-gold-accent" />
              </div>
              <h4 className="font-display-sm text-xl text-white font-bold mb-2">GI Tagged Authenticity</h4>
              <p className="text-sm text-white/70 leading-relaxed">Every pack carries the Geographical Indication tag, ensuring pure Mithila origin.</p>
            </div>
          </div>
          
        </aside>

        {/* Product Grid Area */}
        <section className="flex-1 min-w-0">
          
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-outline-variant/30">
            <div className="flex items-center gap-2 px-2">
              <Sparkles className="w-4 h-4 text-gold-accent" />
              <span className="font-label-lg font-bold text-forest-deep tracking-wider uppercase text-sm">Showing {activeProducts.length} Results</span>
            </div>
            
            <div className="flex items-center gap-3 bg-cream-bg px-4 py-2 rounded-xl">
              <label htmlFor="sort-select" className="font-label-sm text-on-surface-variant uppercase tracking-widest text-xs font-bold">Sort by:</label>
              <select id="sort-select" className="bg-transparent border-none font-label-lg text-forest-deep font-bold focus:ring-0 cursor-pointer p-0 text-sm" value={sortParam} onChange={(e) => setSortParam(e.target.value)}>
                <option>Best Selling</option>
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>
          
          {activeProducts.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl border border-outline-variant/30 shadow-sm">
              <div className="w-20 h-20 bg-cream-bg rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="w-10 h-10 text-outline-variant" />
              </div>
              <h3 className="font-display-sm text-3xl font-bold text-forest-deep mb-2">No matching products</h3>
              <p className="text-on-surface-variant text-lg">Try adjusting your filters to find what you're looking for.</p>
              <button 
                onClick={() => setCategories([])} 
                className="mt-8 px-6 py-3 bg-forest-deep text-white font-bold rounded-xl hover:bg-primary-custom transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeProducts.map((product, idx) => {
                let meta: any = {};
                try { meta = JSON.parse(product.description || '{}') } catch (e) {}
                
                let parsedSizes = [{ size: '250g', price: product.price, discountedPrice: null }];
                if (meta.sizes?.length > 0) {
                  parsedSizes = typeof meta.sizes[0] === 'string'
                    ? meta.sizes.map((s: string) => ({ size: s, price: product.price, discountedPrice: meta.discountedPrice || null }))
                    : meta.sizes;
                }
                const largestSizeObj = parsedSizes.reduce((prev: any, current: any) => {
                  const prevWeight = parseInt(prev.size.replace(/\D/g, '')) || 0;
                  const currWeight = parseInt(current.size.replace(/\D/g, '')) || 0;
                  return (prevWeight > currWeight) ? prev : current;
                }, parsedSizes[0]);

                const category = meta.category || 'Premium Makhana';
                const currentSizeObj = largestSizeObj;
                const effectivePrice = currentSizeObj.discountedPrice || currentSizeObj.price;
                const originalPrice = currentSizeObj.price;
                
                return (
                  <StaggerItem key={product.id} className="group bg-white rounded-3xl p-5 border border-outline-variant/20 hover:border-primary-custom/30 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col relative">
                    <div className="absolute top-8 left-8 z-20 flex flex-col gap-2">
                      {category === 'Raw Makhana' && (
                        <span className="bg-gradient-to-r from-gold-accent to-yellow-400 text-forest-deep font-bold text-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                          <Verified className="w-3 h-3" /> GI TAGGED
                        </span>
                      )}
                      {currentSizeObj.discountedPrice && (
                        <span className="bg-vermillion-clay text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-md w-fit">
                          SALE
                        </span>
                      )}
                    </div>
                    
                    <Link href={`/shop/${product.slug}`} className="relative h-64 rounded-2xl bg-surface-container-low mb-6 overflow-hidden block">
                      <Image 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                        alt={product.name} 
                        src={product.image_url || 'https://via.placeholder.com/300'} 
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </Link>
                    
                    <div className="flex-grow flex flex-col">
                      <Link href={`/shop/${product.slug}`} className="block mb-4">
                        <p className="text-primary-custom font-bold text-xs tracking-widest uppercase mb-1">{category} - {currentSizeObj.size}</p>
                        <h3 className="font-display-sm text-xl text-forest-deep font-bold line-clamp-2 group-hover:text-primary-custom transition-colors">{product.name}</h3>
                      </Link>
                      
                      <div className="mt-auto flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-on-surface-variant text-xs mb-1">Price</span>
                          <div className="flex items-center gap-2">
                            <span className="text-forest-deep font-display-sm font-bold text-2xl">₹{effectivePrice}</span>
                            {currentSizeObj.discountedPrice && <span className="text-on-surface-variant text-sm line-through">₹{originalPrice}</span>}
                          </div>
                        </div>
                        <div className="relative z-20">
                          <AddToCartButton product={product} price={effectivePrice} size={currentSizeObj.size} />
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
          
          {/* Polished Pagination */}
          {activeProducts.length > 0 && (
            <div className="mt-16 flex justify-center items-center gap-4">
              <button className="w-12 h-12 rounded-full bg-white border border-outline-variant/50 flex items-center justify-center hover:border-forest-deep hover:text-forest-deep transition-all shadow-sm hover:shadow-md disabled:opacity-30 disabled:hover:border-outline-variant/50 disabled:hover:shadow-sm" disabled aria-label="Previous page">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <button className="w-12 h-12 rounded-full bg-forest-deep text-white font-bold text-lg flex items-center justify-center shadow-md hover:-translate-y-1 transition-all" aria-current="page">1</button>
              </div>
              <button className="w-12 h-12 rounded-full bg-white border border-outline-variant/50 flex items-center justify-center hover:border-forest-deep hover:text-forest-deep transition-all shadow-sm hover:shadow-md disabled:opacity-30 disabled:hover:border-outline-variant/50 disabled:hover:shadow-sm" disabled aria-label="Next page">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
