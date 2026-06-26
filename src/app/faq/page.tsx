import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | Mithila Makhana',
}

export default function FAQPage() {
  return (
    <main className="pt-32 pb-24 bg-cream-bg min-h-screen">
      <div className="max-w-[800px] mx-auto px-6 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-outline-variant/30">
        <h1 className="font-display-lg text-3xl md:text-5xl text-forest-deep mb-8">Frequently Asked Questions</h1>
        <div className="space-y-8 text-on-surface-variant font-body-md">
          <div>
            <h3 className="font-headline-md text-xl text-forest-deep mb-2">What makes Mithila Makhana different?</h3>
            <p className="text-lg">Our Makhana is directly sourced from the wetlands of Mithila, Bihar. It is GI-tagged, meaning it meets the highest standards of size, purity, and nutritional density.</p>
          </div>
          <div>
            <h3 className="font-headline-md text-xl text-forest-deep mb-2">Is Makhana vegan and gluten-free?</h3>
            <p className="text-lg">Yes, Makhana is 100% plant-based, vegan, and naturally gluten-free.</p>
          </div>
          <div>
            <h3 className="font-headline-md text-xl text-forest-deep mb-2">How long does shipping take?</h3>
            <p className="text-lg">Standard shipping takes 3-5 business days across India. International shipping takes 7-14 business days.</p>
          </div>
          <div>
            <h3 className="font-headline-md text-xl text-forest-deep mb-2">How should I store my Makhana?</h3>
            <p className="text-lg">Store in an airtight container in a cool, dry place. If they lose their crunch, you can dry roast them on a pan for 2-3 minutes.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
