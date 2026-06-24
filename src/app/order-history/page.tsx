"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Package, Truck, CheckCircle2, ChevronRight, Download, Eye } from 'lucide-react'
import { getUserOrders } from '@/app/actions/orders'
import { useCart } from '@/components/cart-context'

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const handleBuyAgain = (item: any) => {
    if (!item.product) return;
    addToCart({
      product: {
        id: item.product_id,
        name: item.product.name,
        slug: item.product.slug || '',
        image_url: item.product.image_url,
        price: item.price_at_time
      },
      quantity: 1, // Buy 1 by default, or could be item.quantity
      size: item.size,
      price_at_time: item.price_at_time
    });
  };

  useEffect(() => {
    getUserOrders().then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="pt-32 pb-24 min-h-[500px] flex items-center justify-center">Loading orders...</div>;

  return (
    <main className="pt-32 pb-24 bg-cream-bg min-h-screen">
      <div className="max-w-[1000px] mx-auto px-6">
        <header className="mb-12">
          <h1 className="font-display-lg text-4xl md:text-5xl text-forest-deep mb-4">Order History</h1>
          <p className="font-body-lg text-on-surface-variant text-lg">
            View your past orders, track current shipments, and download invoices.
          </p>
        </header>

        <div className="space-y-8">
          {orders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-outline-variant/30">
              <Package className="w-12 h-12 text-on-surface-variant mx-auto mb-4" />
              <h3 className="font-headline-md text-forest-deep mb-2">No orders found</h3>
              <p className="text-on-surface-variant mb-6">Looks like you haven't placed any orders yet.</p>
              <Link href="/shop" className="px-6 py-3 bg-forest-deep text-white font-label-lg rounded-lg hover:bg-primary-custom transition-colors">Start Shopping</Link>
            </div>
          )}

          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
              {/* Order Header */}
              <div className="bg-surface-container-lowest border-b border-outline-variant/30 px-6 md:px-8 py-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex flex-wrap gap-x-8 gap-y-4">
                  <div>
                    <p className="text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px] mb-1">Order Placed</p>
                    <p className="font-label-lg text-forest-deep">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px] mb-1">Total</p>
                    <p className="font-label-lg text-forest-deep">₹{order.total_amount}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px] mb-1">Order ID</p>
                    <p className="font-label-lg text-forest-deep">#{order.id.split('-')[0].toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-2 md:mt-0">
                  <Link href={`/order-history/${order.id}`} className="px-4 py-2 bg-white border border-outline-variant/50 rounded-lg text-forest-deep font-label-sm text-sm hover:bg-surface-container-low transition-colors flex items-center gap-2">
                    <Eye className="w-4 h-4" /> View Details
                  </Link>
                  <button className="px-4 py-2 bg-white border border-outline-variant/50 rounded-lg text-forest-deep font-label-sm text-sm hover:bg-surface-container-low transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" /> Invoice
                  </button>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6 md:p-8">
                {/* Status Indicator */}
                <div className="flex items-center gap-2 mb-6">
                  {order.status === 'Delivered' ? (
                    <div className="flex items-center gap-2 text-[#6A9A7A]">
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="font-headline-md text-lg">Delivered</span>
                    </div>
                  ) : order.status === 'Shipped' ? (
                    <div className="flex items-center gap-2 text-gold-accent">
                      <Truck className="w-6 h-6" />
                      <span className="font-headline-md text-lg">Shipped & On The Way</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <Package className="w-6 h-6" />
                      <span className="font-headline-md text-lg">Processing</span>
                    </div>
                  )}
                </div>

                {/* Items List */}
                <div className="space-y-6">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex gap-6 items-center">
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10 shrink-0">
                        <img src={item.product?.image_url || 'https://via.placeholder.com/150'} alt={item.product?.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <Link href="/shop" className="font-label-lg text-forest-deep text-lg hover:text-primary-custom transition-colors block mb-1">
                          {item.product?.name}
                        </Link>
                        <p className="text-on-surface-variant font-body-md">Qty: {item.quantity}</p>
                      </div>
                      <div className="hidden md:block">
                        <button onClick={() => handleBuyAgain(item)} className="px-6 py-2 bg-forest-deep text-white rounded-lg font-label-lg hover:bg-primary-custom transition-colors inline-block text-center">
                          Buy It Again
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Mobile Buy Again Button */}
                <div className="mt-6 md:hidden">
                  <button onClick={() => order.order_items?.forEach(handleBuyAgain)} className="w-full py-3 bg-forest-deep text-white rounded-lg font-label-lg hover:bg-primary-custom transition-colors">
                    Buy Items Again
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-16 bg-forest-deep text-white rounded-2xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-headline-lg text-2xl mb-2 text-primary-fixed">Need help with an order?</h3>
            <p className="text-primary-fixed-dim/80">Our support team is available 24/7 to assist you with tracking, returns, or any issues.</p>
          </div>
          <Link href="/contact" className="shrink-0 px-8 py-4 bg-gold-accent text-forest-deep font-label-lg rounded-lg hover:bg-white transition-colors transform active:scale-95 shadow-lg flex items-center gap-2">
            Contact Support <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  )
}
