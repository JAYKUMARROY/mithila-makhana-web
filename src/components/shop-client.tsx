"use client"
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Verified, ChevronLeft, ChevronRight } from 'lucide-react'
import { StaggerContainer, StaggerItem } from '@/components/animations'

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
      <nav className="mb-8 flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm" aria-label="Breadcrumb">
        <Link className="hover:text-primary-custom transition-colors" href="/">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-forest-deep font-semibold">Shop All</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="w-full lg:w-64 space-y-8">
          <div>
            <h3 className="font-label-lg text-label-lg text-forest-deep uppercase tracking-wider mb-4">Category</h3>
            <div className="space-y-3">
              {['Raw Makhana', 'Roasted Snacks', 'Flavored Delights', 'Premium Gift Boxes'].map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input className="w-5 h-5 rounded border-outline-variant text-primary-custom focus:ring-primary-custom" type="checkbox" checked={categories.includes(cat)} onChange={() => toggleCategory(cat)} />
                  <span className="font-body-md text-on-surface-variant group-hover:text-forest-deep transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="p-4 bg-secondary-container rounded-xl border border-secondary-fixed">
            <div className="flex items-center gap-2 mb-2 text-forest-deep">
              <Verified className="w-5 h-5" />
              <span className="font-label-lg text-label-lg">GI Tagged Authenticity</span>
            </div>
            <p className="text-label-sm font-label-sm text-on-secondary-container/80">Every pack carries the Geographical Indication tag, ensuring Mithila origin.</p>
          </div>
        </aside>

        <section className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <span className="font-label-lg text-label-lg text-on-surface-variant">Showing {activeProducts.length} products</span>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="font-label-lg text-label-lg text-forest-deep">Sort by:</label>
              <select id="sort-select" className="bg-transparent border-none font-label-lg text-label-lg text-primary-custom focus:ring-0 cursor-pointer" value={sortParam} onChange={(e) => setSortParam(e.target.value)}>
                <option>Best Selling</option>
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>
          
          {activeProducts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold text-forest-deep">No products found</h3>
              <p className="text-on-surface-variant mt-2">Try adjusting your filters.</p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {activeProducts.map(product => {
                let meta: any = {};
                try { meta = JSON.parse(product.description || '{}') } catch (e) {}
                
                let parsedSizes = [{ size: '250g', price: product.price, discountedPrice: null }];
                if (meta.sizes?.length > 0) {
                  parsedSizes = typeof meta.sizes[0] === 'string'
                    ? meta.sizes.map((s: string) => ({ size: s, price: product.price, discountedPrice: meta.discountedPrice || null }))
                    : meta.sizes;
                }

                const category = meta.category || 'Premium Makhana';
                const currentSizeObj = parsedSizes[0];
                const currentPrice = currentSizeObj.price;
                const currentDiscount = currentSizeObj.discountedPrice;
                
                return (
                  <StaggerItem key={product.id} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col group border border-outline-variant/20">
                    <Link href={`/shop/${product.slug}`} className="flex flex-col flex-grow">
                      <div className="relative aspect-square bg-[#F3F4F6] overflow-hidden">
                        <Image fill className="object-cover group-hover:scale-110 transition-transform duration-500" alt={`${product.name} - ${category}`} src={product.image_url || "https://via.placeholder.com/300"} sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" />
                        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                          {category === 'Raw Makhana' && (
                            <span className="bg-gold-accent text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 shadow-sm"><Verified className="w-3 h-3" /> GI Tagged</span>
                          )}
                          {currentDiscount && (
                            <span className="bg-vermillion-clay text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">Sale</span>
                          )}
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="font-headline-md text-headline-md text-forest-deep mb-1 line-clamp-1">{product.name}</h3>
                        <p className="text-label-sm font-label-sm text-on-surface-variant mb-4">{category} - {currentSizeObj.size}</p>
                        <div className="mt-auto flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="font-headline-md text-headline-md text-charcoal-text">₹{currentDiscount || currentPrice}</span>
                            {currentDiscount && <span className="text-xs text-on-surface-variant line-through">₹{currentPrice}</span>}
                          </div>
                          <span className="bg-forest-deep text-white px-4 py-2 rounded-lg font-label-lg text-label-lg group-hover:bg-primary-custom transition-colors">View</span>
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
          
          <div className="mt-16 flex justify-center items-center gap-4">
            <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:border-primary-custom hover:text-primary-custom transition-all disabled:opacity-30" disabled aria-label="Previous page">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full bg-primary-custom text-white font-label-lg text-label-lg flex items-center justify-center" aria-current="page">1</button>
            </div>
            <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:border-primary-custom hover:text-primary-custom transition-all disabled:opacity-30" disabled aria-label="Next page">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </div>
    </>
  )
}
