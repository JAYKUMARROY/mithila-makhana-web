"use client"
import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { logout } from '@/app/actions/auth'
import { Search, ShoppingCart, User, ShoppingBag, X, Minus, Plus, Trash2, ArrowRight, ShieldCheck, SearchIcon, Menu } from 'lucide-react'
import { createOrder } from '@/app/actions/orders'
import { getProducts } from '@/app/actions/products'
import { getProfile, manageAddress } from '@/app/actions/profile'
import { useCart } from '@/components/cart-context'
import { useToast } from '@/components/toast'

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    getProducts().then(setAllProducts);
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
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) setSearchQuery('');
  };

  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price_at_time * item.quantity, 0);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({ name: '', address: '', city: '', state: '', pincode: '', phone: '' });
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [showPaymentSimulation, setShowPaymentSimulation] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'PREPAID' | 'COD'>('PREPAID');

  useEffect(() => {
    if (showAddressForm && isLoggedIn) {
      getProfile().then(p => {
        setUserProfile(p);
        if (p?.addresses?.length > 0) {
          const defaultAddr = p.addresses.find((a:any) => a.isDefault) || p.addresses[0];
          setSelectedAddressId(defaultAddr.id);
          setIsAddingNewAddress(false);
        } else {
          setIsAddingNewAddress(true);
        }
      });
    }
  }, [showAddressForm, isLoggedIn]);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      showToast("Your cart is empty!", 'error');
      return;
    }
    if (!isLoggedIn) {
      router.push('/login');
      setIsCartOpen(false);
      return;
    }
    if (!showAddressForm) {
      setShowAddressForm(true);
      return;
    }

    let finalAddress: any = null;
    
    if (isAddingNewAddress) {
      if (!shippingAddress.name || !shippingAddress.address || !shippingAddress.city || !shippingAddress.pincode || !shippingAddress.phone) {
        showToast("Please fill all shipping details", 'error');
        return;
      }
      if (!/^\d{6}$/.test(shippingAddress.pincode)) {
        showToast("Please enter a valid 6-digit PIN code", 'error');
        return;
      }
      if (!/^\d{10}$/.test(shippingAddress.phone)) {
        showToast("Please enter a valid 10-digit Phone Number", 'error');
        return;
      }
      finalAddress = { ...shippingAddress, zip: shippingAddress.pincode };
    } else {
      const selected = userProfile?.addresses?.find((a:any) => a.id === selectedAddressId);
      if (!selected) {
        showToast("Please select a shipping address", 'error');
        return;
      }
      finalAddress = { name: selected.name, address: selected.address, city: selected.city, pincode: selected.zip || selected.pincode, phone: selected.phone };
    }

    if (paymentMethod === 'COD') {
      processOrder(true, 'COD');
    } else {
      setShowPaymentSimulation(true);
      setIsCheckingOut(false);
    }
  }

  const processOrder = async (isSuccess: boolean, method: 'PREPAID' | 'COD' = 'PREPAID') => {
    setShowPaymentSimulation(false);
    
    if (!isSuccess) {
      showToast("Payment failed. Please try again.", 'error');
      return;
    }

    setIsCheckingOut(true);
    try {
      let finalAddress: any = null;
      if (isAddingNewAddress) {
        finalAddress = { ...shippingAddress, zip: shippingAddress.pincode };
      } else {
        const selected = userProfile?.addresses?.find((a:any) => a.id === selectedAddressId);
        finalAddress = { name: selected.name, address: selected.address, city: selected.city, pincode: selected.zip || selected.pincode, phone: selected.phone };
      }

      const orderItems = cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price_at_time: item.price_at_time,
        size: item.size || '250g'
      }));
      const total = orderItems.reduce((acc, item) => acc + (item.price_at_time * item.quantity), 0);
      const res = await createOrder({
        total_amount: total,
        shipping_address: finalAddress,
        items: orderItems,
        payment_method: method
      });
      if (res?.error) {
        if (res.error === 'Not logged in') {
          router.push('/login');
          setIsCartOpen(false);
        } else {
          showToast("Error: " + res.error, 'error');
        }
      } else {
        if (isAddingNewAddress && (!userProfile?.addresses || userProfile.addresses.length < 10)) {
          await manageAddress('add', {
            name: shippingAddress.name,
            phone: shippingAddress.phone,
            address: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state || '',
            zip: shippingAddress.pincode
          });
        }
        
        clearCart();
        setShowAddressForm(false);
        setShippingAddress({ name: '', address: '', city: '', state: '', pincode: '', phone: '' });
        showToast("Order placed successfully!");
        router.push('/order-history');
        setIsCartOpen(false);
      }
    } catch (e) {
      showToast("Something went wrong", 'error');
    }
    setIsCheckingOut(false);
  }

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-cream-bg shadow-sm">
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
            <button onClick={toggleCart} className="text-forest-deep hover:text-primary-custom transition-colors duration-200 relative" aria-label="Open shopping cart" aria-expanded={isCartOpen}>
              <ShoppingCart className="w-6 h-6" />
              {isMounted && cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-error-custom text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cartItemCount}</span>
              )}
            </button>
            <div className="relative" ref={dropdownRef}>
              {isLoggedIn ? (
                <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="text-forest-deep hover:text-primary-custom transition-colors duration-200" aria-label="User menu" aria-expanded={isProfileDropdownOpen}>
                  <User className="w-6 h-6" />
                </button>
              ) : (
                <Link href="/login" className="text-forest-deep hover:text-primary-custom transition-colors duration-200" aria-label="Sign in">
                  <User className="w-6 h-6" />
                </Link>
              )}
              {isLoggedIn && isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-outline-variant/10 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200" role="menu">
                  <Link href="/profile" onClick={() => setIsProfileDropdownOpen(false)} className="block px-4 py-2 font-label-lg text-forest-deep hover:bg-cream-bg transition-colors" role="menuitem">Profile</Link>
                  <Link href="/order-history" onClick={() => setIsProfileDropdownOpen(false)} className="block px-4 py-2 font-label-lg text-forest-deep hover:bg-cream-bg transition-colors" role="menuitem">Orders</Link>
                  <div className="border-t border-outline-variant/10 my-1"></div>
                  <button onClick={async () => { setIsProfileDropdownOpen(false); await logout(); }} className="w-full text-left px-4 py-2 font-label-lg text-vermillion-clay hover:bg-error-container/20 transition-colors" role="menuitem">Logout</button>
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

      {/* Search Overlay */}
      <div
        className={`fixed inset-0 z-[60] backdrop-blur-sm bg-charcoal-text/40 transition-all duration-300 flex flex-col items-center pt-24 px-4 ${isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
        onClick={toggleSearch}
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
      >
        <div className={`w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${isSearchOpen ? "translate-y-0 scale-100" : "-translate-y-8 scale-95"}`} onClick={(e) => e.stopPropagation()}>
          <div className="relative flex items-center border-b border-outline-variant/20 p-2">
            <SearchIcon className="w-6 h-6 text-on-surface-variant absolute left-6" />
            <input type="text" className="w-full py-4 pl-14 pr-12 text-lg font-body-lg text-forest-deep outline-none placeholder:text-outline-variant/60 bg-transparent" placeholder="Search for 'Raw Phool Makhana'..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus={isSearchOpen} />
            <button className="absolute right-4 p-2 text-on-surface-variant hover:text-forest-deep rounded-full hover:bg-surface-container transition-colors" onClick={toggleSearch} aria-label="Close search">
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
                    <button className="w-full text-left p-4 flex items-center gap-4 hover:bg-cream-bg rounded-xl transition-colors group" onClick={() => { toggleSearch(); router.push(`/shop/${product.slug}`); }}>
                      <Image src={product.image_url || 'https://via.placeholder.com/150'} alt={product.name} width={64} height={64} className="w-16 h-16 rounded-lg object-cover bg-surface-container-low border border-outline-variant/10" />
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

      {/* Shopping Cart Drawer */}
      <div
        className={`fixed inset-0 z-[60] backdrop-blur-sm bg-charcoal-text/20 transition-all duration-300 flex justify-end ${isCartOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
        onClick={toggleCart}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <aside className={`w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-500 ease-out ${isCartOpen ? "translate-x-0" : "translate-x-full"}`} onClick={(e) => e.stopPropagation()}>
          <div className="px-8 py-6 flex justify-between items-center bg-cream-bg border-b border-outline-variant/20">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-forest-deep" />
              <h2 className="font-headline-md text-headline-md text-forest-deep">Your Basket ({cartItemCount})</h2>
            </div>
            <div className="flex items-center gap-3">
              {cartItems.length > 0 && (
                <button onClick={clearCart} className="text-on-surface-variant hover:text-error text-sm underline underline-offset-2 transition-colors">
                  Clear
                </button>
              )}
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-forest-deep" onClick={toggleCart} aria-label="Close cart">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Your basket is empty.</p>
              </div>
            ) : showAddressForm ? (
              <div className="space-y-6">
                <h3 className="font-headline-md text-forest-deep text-lg">Select Shipping Address</h3>
                
                {userProfile?.addresses?.length > 0 && !isAddingNewAddress && (
                  <div className="space-y-4">
                    {userProfile.addresses.map((addr: any) => (
                      <div 
                        key={addr.id} 
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 border rounded-xl cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-primary-custom bg-primary-container/10' : 'border-outline-variant/30 hover:border-primary-custom/50'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-headline-sm text-forest-deep flex items-center gap-2">
                            {addr.name}
                            {addr.isDefault && <span className="bg-primary-container text-on-primary-container px-2 py-0.5 text-[10px] font-bold rounded uppercase">Default</span>}
                          </h4>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedAddressId === addr.id ? 'border-primary-custom bg-primary-custom' : 'border-outline-variant'}`}>
                            {selectedAddressId === addr.id && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>
                        <p className="text-on-surface-variant text-sm mb-1">{addr.phone}</p>
                        <p className="text-on-surface-variant font-body-sm leading-relaxed">
                          {addr.address}<br />
                          {addr.city}, {addr.state} {addr.zip}
                        </p>
                      </div>
                    ))}
                    
                    {userProfile.addresses.length < 10 && (
                      <button 
                        onClick={() => setIsAddingNewAddress(true)}
                        className="w-full py-3 border border-dashed border-primary-custom text-primary-custom rounded-xl font-label-lg hover:bg-primary-container/10 transition-colors"
                      >
                        + Add New Address
                      </button>
                    )}
                  </div>
                )}
                
                {isAddingNewAddress && (
                  <div className="space-y-4">
                    <input className="w-full px-4 py-3 border border-outline-variant rounded-lg" placeholder="Full Name" value={shippingAddress.name} onChange={e => setShippingAddress(p => ({...p, name: e.target.value}))} />
                    <input className="w-full px-4 py-3 border border-outline-variant rounded-lg" placeholder="Address" value={shippingAddress.address} onChange={e => setShippingAddress(p => ({...p, address: e.target.value}))} />
                    <div className="grid grid-cols-2 gap-3">
                      <input className="w-full px-4 py-3 border border-outline-variant rounded-lg" placeholder="City" value={shippingAddress.city} onChange={e => setShippingAddress(p => ({...p, city: e.target.value}))} />
                      <input type="text" maxLength={6} pattern="\d{6}" className="w-full px-4 py-3 border border-outline-variant rounded-lg" placeholder="PIN/ZIP Code" value={shippingAddress.pincode} onChange={e => setShippingAddress(p => ({...p, pincode: e.target.value.replace(/\D/g, '')}))} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input className="w-full px-4 py-3 border border-outline-variant rounded-lg" placeholder="State" value={shippingAddress.state} onChange={e => setShippingAddress(p => ({...p, state: e.target.value}))} />
                      <input type="text" maxLength={10} pattern="\d{10}" className="w-full px-4 py-3 border border-outline-variant rounded-lg" placeholder="Phone Number" value={shippingAddress.phone} onChange={e => setShippingAddress(p => ({...p, phone: e.target.value.replace(/\D/g, '')}))} />
                    </div>
                    
                {userProfile?.addresses?.length > 0 && (
                  <button onClick={() => setIsAddingNewAddress(false)} className="text-sm text-primary-custom hover:underline">Cancel & Use Saved Address</button>
                )}
              </div>
            )}

            <div className="space-y-4 pt-8 border-t border-outline-variant/20 mt-8">
              <h3 className="font-headline-sm text-forest-deep">Payment Method</h3>
              <div className="flex flex-col gap-3">
                <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'PREPAID' ? 'border-primary-custom bg-primary-container/10' : 'border-outline-variant/30 hover:border-primary-custom/50'}`}>
                  <input type="radio" name="payment" className="accent-primary-custom w-4 h-4" checked={paymentMethod === 'PREPAID'} onChange={() => setPaymentMethod('PREPAID')} />
                  <span className="font-label-lg text-forest-deep">Prepaid (Pay Online)</span>
                </label>
                <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-primary-custom bg-primary-container/10' : 'border-outline-variant/30 hover:border-primary-custom/50'}`}>
                  <input type="radio" name="payment" className="accent-primary-custom w-4 h-4" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                  <span className="font-label-lg text-forest-deep">Cash on Delivery (COD)</span>
                </label>
              </div>
            </div>

            <button onClick={() => setShowAddressForm(false)} className="text-sm text-primary-custom underline block mt-6">← Back to cart</button>
          </div>
        ) : (
              cartItems.map((item, idx) => (
                <div key={`${item.product.id}-${item.size}-${idx}`} className="flex gap-4">
                  <div className="w-24 h-24 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0 border border-outline-variant/10 relative">
                    <Image fill className="object-cover" alt={item.product.name} src={item.product.image_url || 'https://via.placeholder.com/150'} sizes="96px" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-label-lg text-forest-deep">{item.product.name}</h4>
                      <span className="font-label-lg text-forest-deep">₹{item.price_at_time}</span>
                    </div>
                    {item.size && <p className="text-on-surface-variant text-label-sm mb-4">{item.size}</p>}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-outline-variant/50 rounded-full px-2 py-1 bg-white">
                        <button className="w-6 h-6 flex items-center justify-center text-forest-deep hover:text-primary-custom transition-colors" onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size)} aria-label="Decrease quantity">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 font-label-lg text-forest-deep">{item.quantity}</span>
                        <button className="w-6 h-6 flex items-center justify-center text-forest-deep hover:text-primary-custom transition-colors" onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size)} aria-label="Increase quantity">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="text-on-surface-variant hover:text-vermillion-clay transition-colors flex items-center gap-1" onClick={() => removeFromCart(item.product.id, item.size)} aria-label={`Remove ${item.product.name}`}>
                        <Trash2 className="w-4 h-4" />
                        <span className="text-[12px] font-label-sm">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-8 py-8 bg-surface-container-lowest border-t border-outline-variant/20 space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
            <div className="space-y-2">
              <div className="flex justify-between text-on-surface-variant"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-on-surface-variant"><span>Shipping</span><span className="text-forest-deep font-bold">{cartTotal > 0 ? 'FREE' : '₹0'}</span></div>
              <div className="flex justify-between pt-2 border-t border-outline-variant/20"><span className="font-headline-md text-forest-deep">Total</span><span className="font-headline-md text-forest-deep">₹{cartTotal.toFixed(2)}</span></div>
            </div>
            <div className="pt-4 space-y-3">
              <button onClick={handleCheckout} disabled={isCheckingOut || cartItems.length === 0} className="w-full bg-gold-accent text-forest-deep h-14 rounded-xl font-headline-md text-[16px] hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <span>{isCheckingOut ? 'Processing...' : showAddressForm ? 'Place Order' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full text-center text-forest-deep font-label-lg hover:text-primary-custom transition-colors py-2 underline underline-offset-4" onClick={toggleCart}>Continue Shopping</button>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2 text-on-surface-variant">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-widest font-label-sm">Secure Payment Guaranteed</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Payment Simulation Modal */}
      {showPaymentSimulation && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-[400px] w-full shadow-2xl text-center">
            <ShieldCheck className="w-16 h-16 text-gold-accent mx-auto mb-4" />
            <h3 className="font-headline-md text-forest-deep text-2xl mb-2">Payment Gateway Simulation</h3>
            <p className="text-on-surface-variant font-body-sm mb-8">
              This is a testing environment. Choose whether the payment should succeed or fail to test the checkout flow.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => processOrder(true, 'PREPAID')} 
                disabled={isCheckingOut}
                className="w-full py-3 bg-forest-deep text-white font-label-lg rounded-xl hover:bg-primary-custom transition-colors shadow-md disabled:opacity-50"
              >
                {isCheckingOut ? 'Processing...' : 'Simulate Success'}
              </button>
              <button 
                onClick={() => processOrder(false)} 
                disabled={isCheckingOut}
                className="w-full py-3 bg-error-container text-error font-label-lg rounded-xl hover:bg-error-container/80 transition-colors"
              >
                Simulate Failure
              </button>
              <button 
                onClick={() => setShowPaymentSimulation(false)} 
                disabled={isCheckingOut}
                className="w-full py-2 text-on-surface-variant hover:text-forest-deep font-label-sm underline mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
