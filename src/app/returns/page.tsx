import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Returns & Refunds | Mithila Makhana',
}

export default function ReturnsPage() {
  return (
    <main className="pt-32 pb-24 bg-cream-bg min-h-screen">
      <div className="max-w-[800px] mx-auto px-6 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-outline-variant/30">
        <h1 className="font-display-lg text-3xl md:text-5xl text-forest-deep mb-8">Returns & Refunds</h1>
        <div className="space-y-6 text-on-surface-variant font-body-md text-lg">
          <h2 className="font-headline-md text-2xl text-forest-deep mt-8">1. Return Policy</h2>
          <p>We accept returns within 7 days of delivery for any damaged or incorrect items. The product must be unused and in its original packaging.</p>
          
          <h2 className="font-headline-md text-2xl text-forest-deep mt-8">2. Refund Process</h2>
          <p>Once we receive your returned item, we will inspect it and notify you of the status of your refund. If approved, we will initiate a refund to your original method of payment.</p>
          
          <h2 className="font-headline-md text-2xl text-forest-deep mt-8">3. Shipping Costs</h2>
          <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.</p>
          
          <h2 className="font-headline-md text-2xl text-forest-deep mt-8">4. Contact</h2>
          <p>To initiate a return, please contact our support team at support@mithilamakhana.com.</p>
        </div>
      </div>
    </main>
  )
}
