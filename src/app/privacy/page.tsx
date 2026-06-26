import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Mithila Makhana',
}

export default function PrivacyPage() {
  return (
    <main className="pt-32 pb-24 bg-cream-bg min-h-screen">
      <div className="max-w-[800px] mx-auto px-6 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-outline-variant/30">
        <h1 className="font-display-lg text-3xl md:text-5xl text-forest-deep mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-on-surface-variant font-body-md text-lg">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="font-headline-md text-2xl text-forest-deep mt-8">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.</p>
          
          <h2 className="font-headline-md text-2xl text-forest-deep mt-8">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support, develop safety features, authenticate users, and send product updates.</p>
          
          <h2 className="font-headline-md text-2xl text-forest-deep mt-8">3. Data Security</h2>
          <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
          
          <h2 className="font-headline-md text-2xl text-forest-deep mt-8">4. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at support@mithilamakhana.com.</p>
        </div>
      </div>
    </main>
  )
}
