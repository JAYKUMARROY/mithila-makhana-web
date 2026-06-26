import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Mithila Makhana',
}

export default function TermsPage() {
  return (
    <main className="pt-32 pb-24 bg-cream-bg min-h-screen">
      <div className="max-w-[800px] mx-auto px-6 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-outline-variant/30">
        <h1 className="font-display-lg text-3xl md:text-5xl text-forest-deep mb-8">Terms of Service</h1>
        <div className="space-y-6 text-on-surface-variant font-body-md text-lg">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="font-headline-md text-2xl text-forest-deep mt-8">1. Acceptance of Terms</h2>
          <p>By accessing or using our website, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          
          <h2 className="font-headline-md text-2xl text-forest-deep mt-8">2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials on Mithila Makhana's website for personal, non-commercial transitory viewing only.</p>
          
          <h2 className="font-headline-md text-2xl text-forest-deep mt-8">3. Disclaimer</h2>
          <p>The materials on Mithila Makhana's website are provided on an 'as is' basis. Mithila Makhana makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.</p>
          
          <h2 className="font-headline-md text-2xl text-forest-deep mt-8">4. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in Bihar.</p>
        </div>
      </div>
    </main>
  )
}
