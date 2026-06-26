"use client"

import Link from 'next/link'
import { ArrowLeft, MapPin, Truck, CheckCircle2, Package, Calendar, CreditCard, Download } from 'lucide-react'

import { use, useEffect, useState } from 'react'
import { getOrderById } from '@/app/actions/orders'

export default function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(unwrappedParams.id).then(data => {
      setOrder(data);
      setLoading(false);
    });
  }, [unwrappedParams.id]);

  if (loading) return <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">Loading details...</div>;
  
  if (!order) {
    return (
      <main className="pt-32 pb-24 bg-cream-bg min-h-screen">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <h2 className="text-2xl font-headline-md text-forest-deep mb-4">Order not found</h2>
          <Link href="/order-history" className="text-primary-custom hover:underline">Return to Order History</Link>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const subtotal = order.order_items?.reduce((acc: number, item: any) => acc + (item.price_at_time * item.quantity), 0) || 0;
  
  const formatTime = (isoString?: string, fallback?: boolean) => {
    if (isoString) {
      return new Date(isoString).toLocaleString('en-IN', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    }
    return fallback ? 'Completed' : 'Pending';
  };

  // Basic timeline logic based on status and timestamps
  const isDelivered = order.status === 'DELIVERED';
  const isShipped = isDelivered || order.status === 'SHIPPED';
  const isConfirmed = isShipped || order.status === 'CONFIRMED';
  
  const timeline = [
    { status: 'Order Placed', date: formatTime(order.created_at), completed: true },
    { status: 'Confirmed', date: formatTime(order.confirmed_at, isConfirmed), completed: isConfirmed },
    { status: 'Shipped', date: formatTime(order.shipped_at, isShipped), completed: isShipped },
    { status: 'Delivered', date: formatTime(order.delivered_at, isDelivered), completed: isDelivered }
  ];

  return (
    <main className="pt-32 pb-24 bg-cream-bg min-h-screen">
      <div className="max-w-[1000px] mx-auto px-6">
        <Link href="/order-history" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary-custom transition-colors mb-8 font-label-lg">
          <ArrowLeft className="w-5 h-5" /> Back to Orders
        </Link>

        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-display-lg text-3xl md:text-4xl text-forest-deep mb-2">Order #{order.id.split('-')[0].toUpperCase()}</h1>
            <p className="font-body-md text-on-surface-variant flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Placed on {formattedDate.split(',')[0]}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={`/invoice/${order.id}`} target="_blank" className="px-4 py-2 bg-white border border-outline-variant/50 rounded-lg text-forest-deep font-label-sm hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
              <Download className="w-4 h-4" /> Shipping Label
            </a>
            <a href={`/tax-invoice/${order.id}`} target="_blank" className="px-4 py-2 bg-forest-deep border border-forest-deep rounded-lg text-white font-label-sm hover:bg-forest-deep/90 transition-colors flex items-center justify-center gap-2 shadow-sm">
              <Download className="w-4 h-4" /> Tax Invoice
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
              <div className="p-6 border-b border-outline-variant/20">
                <h3 className="font-headline-md text-forest-deep text-xl">Items Ordered</h3>
              </div>
              <div className="divide-y divide-outline-variant/10">
                {order.order_items?.map((item: any, index: number) => (
                  <div key={index} className="p-6 flex gap-6">
                    <div className="w-20 h-20 bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10 shrink-0">
                      <img src={item.product?.image_url || 'https://via.placeholder.com/150'} alt={item.product?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-label-lg text-forest-deep text-lg mb-1">{item.product?.name} {item.size && `(${item.size})`}</h4>
                      <p className="text-on-surface-variant font-body-md">Qty: {item.quantity} × ₹{item.price_at_time}</p>
                    </div>
                    <div className="flex flex-col justify-center text-right">
                      <span className="font-headline-md text-forest-deep text-lg">₹{item.price_at_time * item.quantity}</span>
                    </div>
                  </div>
                ))}
                {(!order.order_items || order.order_items.length === 0) && (
                  <div className="p-6 text-on-surface-variant italic">No items found for this order.</div>
                )}
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h3 className="font-headline-md text-forest-deep text-xl flex items-center gap-2">
                  <Truck className="w-5 h-5 text-gold-accent" /> Tracking History
                </h3>
                {order.awb_number && (
                  <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/30">
                    <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">AWB / Tracking Number</p>
                    <p className="font-mono font-bold text-primary-custom">{order.awb_number}</p>
                  </div>
                )}
              </div>
              <div className="relative border-l-2 border-primary-custom/30 ml-4 space-y-8">
                {timeline.map((event, index) => (
                  <div key={index} className="relative pl-8">
                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${event.completed ? 'bg-primary-custom' : 'bg-outline-variant/30'}`}></div>
                    <div>
                      <h4 className={`font-label-lg ${event.completed ? 'text-forest-deep' : 'text-on-surface-variant'}`}>{event.status}</h4>
                      <p className="text-sm text-on-surface-variant mt-1">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-6 md:p-8">
              <h3 className="font-headline-md text-forest-deep text-xl mb-6">Order Summary</h3>
              <div className="space-y-3 font-body-md text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order.total_amount > 0 ? 'FREE' : '₹0.00'}</span>
                </div>
                <div className="pt-3 mt-3 border-t border-outline-variant/20 flex justify-between">
                  <span className="font-headline-md text-forest-deep">Total</span>
                  <span className="font-headline-md text-forest-deep">₹{order.total_amount}</span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-6 md:p-8">
              <h3 className="font-headline-md text-forest-deep text-xl mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-on-surface-variant" /> Shipping Address
              </h3>
              {order.shipping_address ? (
                <div className="font-body-md text-on-surface-variant space-y-1">
                  <p className="font-label-lg text-forest-deep mb-1">{order.shipping_address.name}</p>
                  <p>{order.shipping_address.address}</p>
                  <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                  <p>{order.shipping_address.zip || order.shipping_address.pincode}</p>
                  <p className="pt-2 text-sm">Phone: {order.shipping_address.phone}</p>
                </div>
              ) : (
                <p className="italic text-on-surface-variant">No address provided</p>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-6 md:p-8">
              <h3 className="font-headline-md text-forest-deep text-xl mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-on-surface-variant" /> Payment Status
              </h3>
              <div className="font-body-md text-on-surface-variant">
                <p className="font-label-lg text-forest-deep">{order.payment_status === 'COMPLETED' ? 'Paid' : 'Pending'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
