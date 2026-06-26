import { getOrderById, getAllOrders } from '@/app/actions/orders';
import { getOrderLabel } from '@/app/actions/shipmozo';
import { createClient } from '@/utils/supabase/server';
import { AlertTriangle } from 'lucide-react';
import { InvoicePrintButton } from '@/components/invoice-print-button';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div className="p-8 text-center">Please log in to view invoices.</div>;

  const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim()) : [];
  const isAdmin = adminEmails.includes(user.email || '');

  // Fetch order
  const { data: order } = await supabase.from('orders').select('*').eq('id', unwrappedParams.id).single();
  if (!order) return notFound();

  // Authorize
  if (!isAdmin && order.user_id !== user.id) return <div className="p-8 text-center">Unauthorized</div>;

  // Check AWB
  if (!order.awb_number) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-outline-variant/30 text-center">
          <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-error" />
          </div>
          <h2 className="text-2xl font-headline-md text-forest-deep mb-2">Invoice Not Ready</h2>
          <p className="text-on-surface-variant font-body-md mb-8">
            The shipping label/invoice for order #{order.id.replace(/-/g, '').substring(0, 10).toUpperCase()} has not been generated yet. A courier needs to be assigned first.
          </p>
          <Link href={isAdmin ? '/admin/orders' : '/order-history'} className="inline-block bg-forest-deep text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  // Fetch label from Shipmozo
  const labelRes = await getOrderLabel(order.awb_number);

  if (!labelRes.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-outline-variant/30 text-center">
          <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-error" />
          </div>
          <h2 className="text-2xl font-headline-md text-forest-deep mb-2">Error Generating Invoice</h2>
          <p className="text-on-surface-variant font-body-md mb-8">
            {labelRes.message}
          </p>
          <Link href={isAdmin ? '/admin/orders' : '/order-history'} className="inline-block bg-forest-deep text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:p-0 print:bg-white flex flex-col items-center">
      <div className="max-w-[800px] w-full mb-4 px-4 flex justify-end print:hidden">
        <InvoicePrintButton />
      </div>
      
      <div className="bg-white shadow-md print:shadow-none w-full max-w-[800px] mx-auto p-4 flex justify-center">
        <img 
          src={labelRes.labelBase64} 
          alt={`Shipping Label for Order ${order.id}`} 
          className="max-w-full h-auto"
          style={{ width: '100%', objectFit: 'contain' }}
        />
      </div>


    </div>
  );
}
