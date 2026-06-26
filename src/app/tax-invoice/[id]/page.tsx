"use client"

import { use, useEffect, useState } from 'react'
import { getOrderById } from '@/app/actions/orders'

export default function TaxInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(unwrappedParams.id).then(data => {
      setOrder(data);
      setLoading(false);
      // Give it a second to render the images and layout, then trigger print
      if (data) {
        setTimeout(() => {
          window.print();
        }, 800);
      }
    });
  }, [unwrappedParams.id]);

  if (loading) return <div className="p-12 text-center font-body-md text-on-surface-variant">Generating Tax Invoice...</div>;
  if (!order) return <div className="p-12 text-center font-body-md text-error">Order not found</div>;

  const invoiceDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const subtotal = order.order_items?.reduce((acc: number, item: any) => acc + (item.price_at_time * item.quantity), 0) || 0;
  const discount = order.discount_amount || 0;
  const shipping = Math.max(0, order.total_amount - subtotal + discount);
  
  // Example tax calculation (Assuming 5% GST on snacks, modify if different)
  // Let's say the prices are inclusive of GST.
  const gstRate = 0.05;
  const taxableValue = subtotal / (1 + gstRate);
  const totalGst = subtotal - taxableValue;

  return (
    <div className="max-w-[21cm] mx-auto p-8 md:p-12 bg-white text-forest-deep print:p-0 print:max-w-full">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-forest-deep pb-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-surface-container rounded flex items-center justify-center font-bold text-xl text-primary-custom border border-outline-variant/30">
            {/* Placeholder Logo */}
            MM
          </div>
          <div>
            <h1 className="font-headline-lg text-2xl font-bold text-forest-deep">Mithilamakhana Pvt Ltd</h1>
            <p className="text-sm text-on-surface-variant font-body-md">Darbhanga, Bihar, India - 846004</p>
            <p className="text-sm text-on-surface-variant font-body-md">Email: support@mithilamakhana.com</p>
            <p className="text-sm text-on-surface-variant font-body-md mt-1"><strong>GSTIN:</strong> 10XXXXX1234X1Z5 (Pending)</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="font-headline-lg text-3xl font-bold text-gold-accent mb-2">TAX INVOICE</h2>
          <p className="font-label-lg"><strong>Invoice No:</strong> {order.id.replace(/-/g, '').substring(0, 10).toUpperCase()}</p>
          <p className="font-label-lg"><strong>Invoice Date:</strong> {invoiceDate}</p>
          <p className="font-label-lg"><strong>Payment Status:</strong> {order.payment_status}</p>
        </div>
      </div>

      {/* Bill To & Ship To */}
      <div className="grid grid-cols-2 gap-8 mb-10">
        <div>
          <h3 className="font-bold text-forest-deep border-b border-outline-variant/30 pb-2 mb-3">Billed To / Shipped To:</h3>
          {order.shipping_address ? (
            <div className="text-sm space-y-1">
              <p className="font-bold text-base">{order.shipping_address.name}</p>
              <p>{order.shipping_address.address}</p>
              <p>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.zip || order.shipping_address.pincode}</p>
              <p>Phone: {order.shipping_address.phone}</p>
              {order.profile?.email && <p>Email: {order.profile.email}</p>}
            </div>
          ) : (
            <p className="text-sm italic text-on-surface-variant">Details not provided</p>
          )}
        </div>
        <div className="text-right">
          <h3 className="font-bold text-forest-deep border-b border-outline-variant/30 pb-2 mb-3">Order Details:</h3>
          <div className="text-sm space-y-1">
            <p><strong>Order ID:</strong> {order.id.replace(/-/g, '').substring(0, 10).toUpperCase()}</p>
            <p><strong>Order Date:</strong> {invoiceDate}</p>
            {order.awb_number && <p><strong>AWB No:</strong> {order.awb_number}</p>}
          </div>
        </div>
      </div>

      {/* Itemized Table */}
      <table className="w-full text-left mb-8 border-collapse">
        <thead>
          <tr className="bg-surface-container-low border-b border-forest-deep">
            <th className="py-3 px-2 font-bold text-sm">#</th>
            <th className="py-3 px-2 font-bold text-sm">Item Description</th>
            <th className="py-3 px-2 font-bold text-sm text-center">Size</th>
            <th className="py-3 px-2 font-bold text-sm text-center">Qty</th>
            <th className="py-3 px-2 font-bold text-sm text-right">Unit Price (Inc. Tax)</th>
            <th className="py-3 px-2 font-bold text-sm text-right">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.order_items?.map((item: any, i: number) => (
            <tr key={i} className="border-b border-outline-variant/20">
              <td className="py-4 px-2 text-sm">{i + 1}</td>
              <td className="py-4 px-2 text-sm font-medium">{item.product?.name}</td>
              <td className="py-4 px-2 text-sm text-center">{item.size || '-'}</td>
              <td className="py-4 px-2 text-sm text-center">{item.quantity}</td>
              <td className="py-4 px-2 text-sm text-right">₹{item.price_at_time.toFixed(2)}</td>
              <td className="py-4 px-2 text-sm text-right font-bold">₹{(item.price_at_time * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Section */}
      <div className="flex justify-end mb-12">
        <div className="w-1/2 md:w-1/3">
          <div className="flex justify-between py-2 border-b border-outline-variant/20 text-sm">
            <span>Taxable Value:</span>
            <span>₹{taxableValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-outline-variant/20 text-sm">
            <span>GST (5% included):</span>
            <span>₹{totalGst.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between py-2 border-b border-outline-variant/20 text-sm text-emerald-600 font-bold">
              <span>Wallet Discount Used:</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-b border-outline-variant/20 text-sm">
            <span>Shipping Charges:</span>
            <span>{shipping > 0 ? `₹${shipping.toFixed(2)}` : 'FREE'}</span>
          </div>
          <div className="flex justify-between py-3 border-b-2 border-forest-deep font-bold text-lg">
            <span>Grand Total:</span>
            <span className="text-primary-custom">₹{order.total_amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <div className="border-t border-outline-variant/30 pt-6 mt-12 grid grid-cols-2 gap-8 text-sm text-on-surface-variant">
        <div>
          <h4 className="font-bold text-forest-deep mb-2">Terms & Conditions:</h4>
          <ul className="list-disc pl-4 space-y-1 text-xs">
            <li>All claims, if any, for shortages or damages must be reported within 2 days of delivery.</li>
            <li>This is a computer-generated invoice and does not require a signature.</li>
          </ul>
        </div>
        <div className="text-right flex flex-col justify-end">
          <p className="font-bold text-forest-deep">For Mithilamakhana Pvt Ltd</p>
          <div className="h-16 flex items-end justify-end">
            <span className="italic text-xs opacity-50">(Authorized Signatory)</span>
          </div>
        </div>
      </div>
      
      {/* Action buttons (hidden when printing) */}
      <div className="mt-12 text-center print:hidden">
        <button onClick={() => window.print()} className="px-6 py-2 bg-forest-deep text-white font-bold rounded-lg hover:bg-forest-deep/90 transition-all shadow-md">
          Print / Save PDF
        </button>
      </div>
    </div>
  )
}
