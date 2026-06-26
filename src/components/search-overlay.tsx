"use client"
import { useState, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { SearchIcon, X, ArrowRight } from 'lucide-react'

export function SearchOverlay({ isOpen, onClose, allProducts }: { isOpen: boolean, onClose: () => void, allProducts: any[] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allProducts, searchQuery]);

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-[60] backdrop-blur-sm bg-charcoal-text/40 transition-all duration-300 flex flex-col items-center pt-24 px-4 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
    >
      <div className={`w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${isOpen ? "translate-y-0 scale-100" : "-translate-y-8 scale-95"}`} onClick={(e) => e.stopPropagation()}>
        <div className="relative flex items-center border-b border-outline-variant/20 p-2">
          <SearchIcon className="w-6 h-6 text-on-surface-variant absolute left-6" />
          <input type="text" className="w-full py-4 pl-14 pr-12 text-lg font-body-lg text-forest-deep outline-none placeholder:text-outline-variant/60 bg-transparent" placeholder="Search for 'Raw Phool Makhana'..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus={isOpen} />
          <button className="absolute right-4 p-2 text-on-surface-variant hover:text-forest-deep rounded-full hover:bg-surface-container transition-colors" onClick={handleClose} aria-label="Close search">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {searchQuery.trim() === '' ? (
            <div className="p-8 text-center text-on-surface-variant">
              <p className="font-body-md mb-2">Popular Searches</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button onClick={() => setSearchQuery('Raw Phool')} className="px-4 py-2 bg-surface-container-low rounded-full text-sm hover:bg-surface-container transition-colors">Raw Phool</button>
                <button onClick={() => setSearchQuery('Peri Peri')} className="px-4 py-2 bg-surface-container-low rounded-full text-sm hover:bg-surface-container transition-colors">Peri Peri</button>
                <button onClick={() => setSearchQuery('Honey')} className="px-4 py-2 bg-surface-container-low rounded-full text-sm hover:bg-surface-container transition-colors">Honey Glazed</button>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <ul className="p-2">
              {filteredProducts.map((product) => (
                <li key={product.id}>
                  <button className="w-full text-left p-4 flex items-center gap-4 hover:bg-cream-bg rounded-xl transition-colors group" onClick={() => { handleClose(); router.push(`/shop/${product.slug}`); }}>
                    <Image src={product.image_url || '/product-placeholder.svg'} alt={product.name} width={64} height={64} className="w-16 h-16 rounded-lg object-cover bg-surface-container-low border border-outline-variant/10" />
                    <div className="flex-1">
                      <h4 className="font-label-lg text-forest-deep group-hover:text-primary-custom transition-colors">{product.name}</h4>
                      <span className="text-label-sm text-on-surface-variant">₹{product.price}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-on-surface-variant opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-12 text-center text-on-surface-variant">
              <SearchIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-body-lg text-forest-deep mb-1">No products found</p>
              <p className="text-sm">Try searching for something else.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
