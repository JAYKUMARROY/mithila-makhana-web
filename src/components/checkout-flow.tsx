"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getProfile, manageAddress } from '@/app/actions/profile'
import { createOrder } from '@/app/actions/orders'
import { useCart } from '@/components/cart-context'
import { useToast } from '@/components/toast'
import { PaymentModal } from '@/components/payment-modal'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { validateCheckout } from '@/app/actions/orders'

export function CheckoutFlow({ 
  onBack, 
  isLoggedIn 
}: { 
  onBack: () => void;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const { cartItems, clearCart, setIsCartOpen } = useCart();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({ name: '', address: '', city: '', state: '', pincode: '', phone: '' });
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [showPaymentSimulation, setShowPaymentSimulation] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'PREPAID' | 'COD'>('PREPAID');
  const [walletAmountToUse, setWalletAmountToUse] = useState<number>(0);

  useEffect(() => {
    if (isLoggedIn) {
      getProfile().then(p => {
        setUserProfile(p);
        if (p?.addresses?.length > 0) {
          const defaultAddr = p!.addresses.find((a:any) => a.isDefault) || p!.addresses[0];
          setSelectedAddressId(defaultAddr.id);
          setIsAddingNewAddress(false);
        } else {
          setIsAddingNewAddress(true);
        }
      });
    }
  }, [isLoggedIn]);

  const maxUsableWallet = userProfile ? Math.min(userProfile.wallet_balance, Math.floor(cartItems.reduce((acc, item) => acc + item.price_at_time * item.quantity, 0) * 0.7)) : 0;

  useEffect(() => {
    if (walletAmountToUse > maxUsableWallet) {
      setWalletAmountToUse(maxUsableWallet);
    }
  }, [maxUsableWallet, walletAmountToUse]);

  const handleCheckoutSubmit = async () => {
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
    } else {
      const selected = userProfile?.addresses?.find((a:any) => a.id === selectedAddressId);
      if (!selected) {
        showToast("Please select a shipping address", 'error');
        return;
      }
    }

    setIsCheckingOut(true);
    const orderItems = cartItems.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity,
      price_at_time: item.price_at_time,
      size: item.size || '250g'
    }));

    const valRes = await validateCheckout(orderItems);
    setIsCheckingOut(false);
    
    if (valRes?.error) {
      showToast(valRes.error, 'error');
      return;
    }

    if (paymentMethod === 'COD') {
      processOrder(true, 'COD');
    } else {
      setShowPaymentSimulation(true);
    }
  };

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
      
      let walletAmount = 0;
      if (walletAmountToUse > 0 && total >= 349 && userProfile?.wallet_balance > 0) {
        walletAmount = Math.min(walletAmountToUse, Math.floor(total * 0.7));
      }
      
      const res = await createOrder({
        total_amount: total,
        shipping_address: finalAddress,
        items: orderItems,
        payment_method: method,
        wallet_amount: walletAmount
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
        showToast("Order placed successfully!");
        router.push('/order-history');
        setIsCartOpen(false);
      }
    } catch (e) {
      showToast("Something went wrong", 'error');
    }
    setIsCheckingOut(false);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price_at_time * item.quantity, 0);
  
  let walletDiscount = 0;
  if (walletAmountToUse > 0 && cartTotal >= 349 && userProfile?.wallet_balance > 0) {
    walletDiscount = Math.min(walletAmountToUse, Math.floor(cartTotal * 0.7));
  }
  const finalTotal = cartTotal - walletDiscount;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pb-6">
        <h3 className="font-headline-md text-forest-deep text-lg">Select Shipping Address</h3>
        
        {userProfile?.addresses?.length > 0 && !isAddingNewAddress && (
          <div className="space-y-4">
            {userProfile.addresses.map((addr: any) => (
              <div 
                key={addr.id} 
                onClick={() => setSelectedAddressId(addr.id)}
                className={`p-5 border rounded-xl cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-primary-custom bg-surface-container-low shadow-sm' : 'border-outline-variant/30 hover:border-primary-custom/50'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-headline-sm text-forest-deep flex items-center gap-2 font-bold">
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
                className="w-full py-4 border border-dashed border-primary-custom text-primary-custom rounded-xl font-label-lg hover:bg-surface-container-low transition-colors"
              >
                + Add New Address
              </button>
            )}
          </div>
        )}
        
        {isAddingNewAddress && (
          <div className="space-y-4">
            <input className="w-full px-4 py-3 bg-white border border-outline-variant rounded-xl font-body-md text-forest-deep focus:outline-none focus:border-primary-custom focus:ring-1 focus:ring-primary-custom transition-colors" placeholder="Full Name" value={shippingAddress.name} onChange={e => setShippingAddress(p => ({...p, name: e.target.value}))} />
            <input className="w-full px-4 py-3 bg-white border border-outline-variant rounded-xl font-body-md text-forest-deep focus:outline-none focus:border-primary-custom focus:ring-1 focus:ring-primary-custom transition-colors" placeholder="Address" value={shippingAddress.address} onChange={e => setShippingAddress(p => ({...p, address: e.target.value}))} />
            <div className="grid grid-cols-2 gap-3">
              <input className="w-full px-4 py-3 bg-white border border-outline-variant rounded-xl font-body-md text-forest-deep focus:outline-none focus:border-primary-custom focus:ring-1 focus:ring-primary-custom transition-colors" placeholder="City" value={shippingAddress.city} onChange={e => setShippingAddress(p => ({...p, city: e.target.value}))} />
              <input type="text" maxLength={6} pattern="\d{6}" className="w-full px-4 py-3 bg-white border border-outline-variant rounded-xl font-body-md text-forest-deep focus:outline-none focus:border-primary-custom focus:ring-1 focus:ring-primary-custom transition-colors" placeholder="PIN/ZIP Code" value={shippingAddress.pincode} onChange={e => setShippingAddress(p => ({...p, pincode: e.target.value.replace(/\D/g, '')}))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input className="w-full px-4 py-3 bg-white border border-outline-variant rounded-xl font-body-md text-forest-deep focus:outline-none focus:border-primary-custom focus:ring-1 focus:ring-primary-custom transition-colors" placeholder="State" value={shippingAddress.state} onChange={e => setShippingAddress(p => ({...p, state: e.target.value}))} />
              <input type="text" maxLength={10} pattern="\d{10}" className="w-full px-4 py-3 bg-white border border-outline-variant rounded-xl font-body-md text-forest-deep focus:outline-none focus:border-primary-custom focus:ring-1 focus:ring-primary-custom transition-colors" placeholder="Phone Number" value={shippingAddress.phone} onChange={e => setShippingAddress(p => ({...p, phone: e.target.value.replace(/\D/g, '')}))} />
            </div>
            
            {userProfile?.addresses?.length > 0 && (
              <button onClick={() => setIsAddingNewAddress(false)} className="text-sm text-primary-custom hover:underline font-label-lg mt-2 inline-block">Cancel & Use Saved Address</button>
            )}
          </div>
        )}

        {/* Wallet Section */}
        {userProfile && userProfile.wallet_balance > 0 && (
          <div className="space-y-4 pt-8 border-t border-surface-container mt-8">
            <h3 className="font-headline-sm text-forest-deep text-lg flex items-center gap-2">
              <span className="text-emerald-600">₹</span> Wallet Balance
            </h3>
            
            {cartTotal < 349 ? (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-sm text-amber-800">
                Minimum order of ₹349 required to use wallet balance. (Current: ₹{cartTotal})
              </div>
            ) : (
              <div className={`p-5 rounded-xl border transition-colors ${walletAmountToUse > 0 ? 'border-primary-custom/50 bg-surface-container-low shadow-sm' : 'border-outline-variant/30 bg-white'}`}>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-forest-deep">Use Wallet Balance</span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-xs">Available: ₹{userProfile.wallet_balance}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="0" 
                      max={maxUsableWallet} 
                      step="1"
                      value={walletAmountToUse}
                      onChange={(e) => setWalletAmountToUse(Number(e.target.value))}
                      className="w-full h-2 bg-outline-variant/30 rounded-lg appearance-none cursor-pointer accent-primary-custom"
                    />
                    <div className="shrink-0 w-24 text-right">
                      <span className="font-bold text-xl text-primary-custom block">₹{walletAmountToUse}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-on-surface-variant/70 uppercase tracking-wider mt-1">
                    <span>₹0</span>
                    <div className="text-right flex flex-col items-end">
                      <span>Max: ₹{maxUsableWallet}</span>
                      <span className="text-[10px] normal-case opacity-80">(up to 70% of order value)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4 pt-8 border-t border-surface-container mt-8">
          <h3 className="font-headline-sm text-forest-deep text-lg">Payment Method</h3>
          <div className="flex flex-col gap-3">
            <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'PREPAID' ? 'border-primary-custom bg-surface-container-low shadow-sm' : 'border-outline-variant/30 hover:border-primary-custom/50'}`}>
              <input type="radio" name="payment" className="accent-primary-custom w-4 h-4" checked={paymentMethod === 'PREPAID'} onChange={() => setPaymentMethod('PREPAID')} />
              <span className="font-label-lg text-forest-deep">Prepaid (Pay Online)</span>
            </label>
            <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-primary-custom bg-surface-container-low shadow-sm' : 'border-outline-variant/30 hover:border-primary-custom/50'}`}>
              <input type="radio" name="payment" className="accent-primary-custom w-4 h-4" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
              <span className="font-label-lg text-forest-deep">Cash on Delivery (COD)</span>
            </label>
          </div>
        </div>

        <button onClick={onBack} className="text-sm text-on-surface-variant hover:text-forest-deep underline block mt-6 font-label-lg transition-colors">← Back to cart</button>
      </div>

      <div className="bg-surface-container-lowest border-t border-surface-container pt-4 space-y-4 shrink-0 mt-auto">
        <button 
          onClick={handleCheckoutSubmit} 
          disabled={isCheckingOut || cartItems.length === 0} 
          className="w-full bg-gold-accent text-on-primary-container h-14 rounded-xl font-label-lg text-[16px] hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <span>{isCheckingOut ? 'Processing...' : `Place Order (₹${finalTotal.toFixed(2)})`}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="flex items-center justify-center gap-2 pt-2 text-on-surface-variant pb-2">
          <ShieldCheck className="w-[16px] h-[16px]" />
          <span className="text-[10px] uppercase tracking-widest font-label-sm">Secure Payment Guaranteed</span>
        </div>
      </div>

      <PaymentModal 
        isOpen={showPaymentSimulation}
        onClose={() => setShowPaymentSimulation(false)}
        onSimulateSuccess={() => processOrder(true, 'PREPAID')}
        onSimulateFailure={() => processOrder(false)}
        isProcessing={isCheckingOut}
      />
    </div>
  )
}
