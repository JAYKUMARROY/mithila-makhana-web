"use client"
import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { logout } from '@/app/actions/auth'
import { getProfile } from '@/app/actions/profile'
import { Search, ShoppingCart, User, Menu, Wallet } from 'lucide-react'
import { getProducts } from '@/app/actions/products'
import { useCart } from '@/components/cart-context'
import { SearchOverlay } from '@/components/search-overlay'
import { CartDrawer } from '@/components/cart-drawer'

export function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const { cartItems, isCartOpen, setIsCartOpen } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (session) {
        getProfile().then(p => {
          if (p) setWalletBalance(p.wallet_balance || 0);
        });
      }
    });
  }, [pathname, supabase]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        getProfile().then(p => {
          if (p) setWalletBalance(p.wallet_balance || 0);
        });
      } else {
        setWalletBalance(0);
      }
    });
    getProducts().then(res => setAllProducts(res.data || []));
    return () => subscription.unsubscribe();
  }, [supabase]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isProfileDropdownOpen]);

  // Close mobile menu on route change
  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-cream-bg shadow-sm print:hidden">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-headline-md text-headline-md font-bold text-forest-deep">
              Mithila Makhana
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/shop" className={`font-label-lg text-label-lg transition-colors duration-200 ${pathname?.startsWith('/shop') ? 'text-primary-custom border-b-2 border-primary-custom pb-1' : 'text-forest-deep hover:text-primary-custom'}`}>Shop</Link>
              <Link href="/about" className={`font-label-lg text-label-lg transition-colors duration-200 ${pathname === '/about' ? 'text-primary-custom border-b-2 border-primary-custom pb-1' : 'text-forest-deep hover:text-primary-custom'}`}>Story</Link>
              <Link href="/blog" className={`font-label-lg text-label-lg transition-colors duration-200 ${pathname?.startsWith('/blog') ? 'text-primary-custom border-b-2 border-primary-custom pb-1' : 'text-forest-deep hover:text-primary-custom'}`}>Blog</Link>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button onClick={toggleSearch} className="text-forest-deep hover:text-primary-custom transition-colors duration-200" aria-label="Search products">
              <Search className="w-6 h-6" />
            </button>
            {isLoggedIn && (
              <Link href="/wallet" className="text-forest-deep hover:text-primary-custom transition-colors duration-200 flex items-center gap-1 font-bold bg-primary-container/20 px-3 py-1.5 rounded-full" aria-label="Wallet">
                <Wallet className="w-5 h-5" />
                <span className="text-sm">₹{walletBalance}</span>
              </Link>
            )}
            <button onClick={toggleCart} className="text-forest-deep hover:text-primary-custom transition-colors duration-200 relative" aria-label="Open shopping cart" aria-expanded={isCartOpen}>
              <ShoppingCart className="w-6 h-6" />
              {isMounted && cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-error-custom text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cartItemCount}</span>
              )}
            </button>
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="text-forest-deep hover:text-primary-custom transition-colors duration-200" aria-label="User menu" aria-expanded={isProfileDropdownOpen}>
                <User className="w-6 h-6" />
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-outline-variant/10 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200" role="menu">
                  {isLoggedIn ? (
                    <>
                      <Link href="/profile" onClick={() => setIsProfileDropdownOpen(false)} className="block px-4 py-2 font-label-lg text-forest-deep hover:bg-cream-bg transition-colors" role="menuitem">Profile</Link>
                      <Link href="/order-history" onClick={() => setIsProfileDropdownOpen(false)} className="block px-4 py-2 font-label-lg text-forest-deep hover:bg-cream-bg transition-colors" role="menuitem">Orders</Link>
                      <Link href="/wallet" onClick={() => setIsProfileDropdownOpen(false)} className="block px-4 py-2 font-label-lg text-forest-deep hover:bg-cream-bg transition-colors" role="menuitem">Wallet</Link>
                      <Link href="/referral" onClick={() => setIsProfileDropdownOpen(false)} className="block px-4 py-2 font-label-lg text-emerald-600 hover:bg-emerald-50 transition-colors" role="menuitem">Refer & Earn</Link>
                      <div className="border-t border-outline-variant/10 my-1"></div>
                      <button onClick={async () => { setIsProfileDropdownOpen(false); await logout(); }} className="w-full text-left px-4 py-2 font-label-lg text-vermillion-clay hover:bg-error-container/20 transition-colors" role="menuitem">Logout</button>
                    </>
                  ) : (
                    <Link href="/login" onClick={() => setIsProfileDropdownOpen(false)} className="block px-4 py-2 font-label-lg text-primary-custom hover:bg-primary-container/20 transition-colors" role="menuitem">Login</Link>
                  )}
                </div>
              )}
            </div>
            {/* Mobile hamburger */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-forest-deep" aria-label="Toggle navigation menu" aria-expanded={isMobileMenuOpen}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-outline-variant/20 bg-cream-bg px-6 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <Link href="/shop" className="block font-label-lg text-label-lg text-forest-deep hover:text-primary-custom py-2">Shop</Link>
            <Link href="/about" className="block font-label-lg text-label-lg text-forest-deep hover:text-primary-custom py-2">Our Story</Link>
            <Link href="/blog" className="block font-label-lg text-label-lg text-forest-deep hover:text-primary-custom py-2">Blog</Link>
          </div>
        )}
      </nav>

      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        allProducts={allProducts} 
      />
      
      <CartDrawer 
        isLoggedIn={isLoggedIn}
        allProducts={allProducts}
      />
    </>
  )
}
