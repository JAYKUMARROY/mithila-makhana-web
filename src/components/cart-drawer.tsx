"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShoppingBag, X, Minus, Plus, Trash2, ArrowRight, ShieldCheck, Star } from 'lucide-react'
import { useCart } from '@/components/cart-context'
import { useToast } from '@/components/toast'
import { CheckoutFlow } from '@/components/checkout-flow'

export function CartDrawer({ isLoggedIn, allProducts }: { isLoggedIn: boolean, allProducts: any[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, addToCart } = useCart();
  const [showAddressForm, setShowAddressForm] = useState(false);

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price_at_time * item.quantity, 0);

  useEffect(() => {
    if (!isCartOpen) {
      setTimeout(() => setShowAddressForm(false), 300); // Reset form when drawer closes
    }
  }, [isCartOpen]);

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) {
      showToast("Your cart is empty!", 'error');
      return;
    }
    if (!isLoggedIn) {
      router.push('/login');
      setIsCartOpen(false);
      return;
    }
    setShowAddressForm(true);
  }

  return (
    <div
      className={`fixed inset-0 z-[60] backdrop-blur-sm bg-charcoal-text/20 transition-all duration-300 flex justify-end ${isCartOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
      onClick={() => setIsCartOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      <aside className={`w-full max-w-md bg-white h-full shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${isCartOpen ? "translate-x-0" : "translate-x-full"}`} onClick={(e) => e.stopPropagation()}>
        <div className="px-8 py-6 flex justify-between items-center bg-cream-bg border-b border-surface-container shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-forest-deep" />
            <h2 className="font-headline-md text-forest-deep">Your Basket</h2>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-forest-deep" onClick={() => setIsCartOpen(false)} aria-label="Close cart">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`flex-1 px-8 py-6 ${!showAddressForm && cartItems.length === 0 ? 'flex flex-col justify-center items-center' : 'custom-scrollbar overflow-y-auto'}`}>
          {showAddressForm ? (
            <CheckoutFlow onBack={() => setShowAddressForm(false)} isLoggedIn={isLoggedIn} />
          ) : (
            <div className="h-full flex flex-col w-full">
              {cartItems.length > 0 && (
                <div className="flex justify-between items-center mb-4 shrink-0">
                  <span className="text-sm font-label-lg text-on-surface-variant">{cartItems.length} items</span>
                  <button onClick={clearCart} className="text-sm font-label-lg text-error hover:text-error/80 underline decoration-error/30 transition-colors">Clear Basket</button>
                </div>
              )}
              
              {cartItems.length === 0 ? (
                <div className="text-center text-on-surface-variant w-full">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-6 opacity-20" />
                  <p className="text-lg font-body-lg">Your basket is empty.</p>
                </div>
              ) : (
                <div className="space-y-6 flex-1">
                  {cartItems.map((item, idx) => (
                    <div key={`${item.product.id}-${item.size}-${idx}`} className="flex gap-4">
                      <div className="w-24 h-24 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0 relative">
                        <Image fill className="object-cover" alt={item.product.name} src={item.product.image_url || '/product-placeholder.svg'} sizes="96px" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-label-lg text-forest-deep line-clamp-2 pr-2">{item.product.name}</h4>
                            <span className="font-label-lg text-forest-deep whitespace-nowrap">₹{item.price_at_time}</span>
                          </div>
                          <p className="text-on-surface-variant text-label-sm mb-4">{item.size || 'Standard Size'}</p>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center border border-outline-variant rounded-full px-2 py-1 bg-white">
                            <button className="w-6 h-6 flex items-center justify-center hover:text-primary-custom transition-colors" onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size)} aria-label="Decrease quantity">
                              <Minus className="w-4 h-4" strokeWidth={2.5} />
                            </button>
                            <span className="px-3 font-label-lg text-forest-deep w-6 text-center">{item.quantity}</span>
                            <button className="w-6 h-6 flex items-center justify-center hover:text-primary-custom transition-colors" onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size)} aria-label="Increase quantity">
                              <Plus className="w-4 h-4" strokeWidth={2.5} />
                            </button>
                          </div>
                          <button className="text-on-surface-variant hover:text-vermillion-clay transition-colors flex items-center gap-1" onClick={() => removeFromCart(item.product.id, item.size)} aria-label={`Remove ${item.product.name}`}>
                            <Trash2 className="w-[16px] h-[16px]" />
                            <span className="text-[12px] font-label-sm">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Upsell block */}
                  {cartItems.length > 0 && allProducts.filter(p => !cartItems.find(c => c.product.id === p.id)).length > 0 && (
                    <div className="pt-8 border-t border-surface-container mt-4">
                      <h5 className="text-label-lg text-on-surface-variant mb-4 flex items-center gap-2">
                        <Star className="w-[18px] h-[18px] fill-gold-accent text-gold-accent" />
                        Complete your health ritual
                      </h5>
                      <div 
                        className="bg-surface-container-low p-4 rounded-xl flex items-center gap-4 group cursor-pointer hover:bg-surface-container transition-colors"
                        onClick={() => {
                          const recommendation = allProducts.find(p => !cartItems.find(c => c.product.id === p.id));
                          if (recommendation) {
                             addToCart({ product: recommendation, quantity: 1, price_at_time: recommendation.price, size: recommendation.sizes?.[0] || '250g' });
                             showToast(`Added ${recommendation.name} to cart!`);
                          }
                        }}
                      >
                        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 relative">
                          <Image fill sizes="64px" className="object-cover" alt="Recommendation" src={allProducts.find(p => !cartItems.find(c => c.product.id === p.id))?.image_url || '/product-placeholder.svg'} />
                        </div>
                        <div className="flex-1">
                          <p className="font-label-lg text-forest-deep line-clamp-1">
                            {allProducts.find(p => !cartItems.find(c => c.product.id === p.id))?.name}
                          </p>
                          <p className="text-[12px] text-on-surface-variant mt-0.5">
                            Add for only ₹{allProducts.find(p => !cartItems.find(c => c.product.id === p.id))?.price}
                          </p>
                        </div>
                        <button className="bg-forest-deep text-white w-8 h-8 rounded-full hover:bg-primary-custom transition-colors flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {!showAddressForm && (
          <div className="px-8 py-8 bg-surface-container-lowest border-t border-surface-container space-y-4 shrink-0">
            <div className="space-y-2">
              <div className="flex justify-between text-on-surface-variant">
                <span className="font-body-md">Subtotal</span>
                <span className="font-body-md">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span className="font-body-md">Shipping</span>
                <span className="font-body-md text-forest-deep font-semibold">{cartTotal > 0 ? 'FREE' : '₹0.00'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-outline-variant">
                <span className="font-headline-md text-forest-deep">Total</span>
                <span className="font-headline-md text-forest-deep">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="pt-4 space-y-3">
              <button onClick={handleCheckoutClick} disabled={cartItems.length === 0} className="w-full bg-gold-accent text-on-primary-container h-14 rounded-xl font-label-lg text-[16px] hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                <span>Checkout Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full text-center text-forest-deep font-label-lg hover:text-primary-custom transition-colors py-2 underline underline-offset-4" onClick={() => setIsCartOpen(false)}>
                Continue Shopping
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2 text-on-surface-variant">
              <ShieldCheck className="w-[16px] h-[16px]" />
              <span className="text-[10px] uppercase tracking-widest font-label-sm">Secure Payment Guaranteed</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
