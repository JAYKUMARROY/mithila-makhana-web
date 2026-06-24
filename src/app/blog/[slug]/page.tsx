import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, Share2, Mail, Link as LinkIcon } from 'lucide-react'

export default function BlogPost() {
  return (
    <main className="pt-24 pb-20 bg-cream-bg">
      <article className="max-w-[800px] mx-auto px-6">
        {/* Back Link */}
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-forest-deep hover:text-primary-custom transition-colors font-label-lg">
            <ArrowLeft className="w-5 h-5" /> Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 text-on-surface-variant font-label-sm mb-6">
            <span className="bg-gold-accent/10 text-gold-accent px-3 py-1 rounded-full uppercase tracking-wider">Nutrition</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Oct 12, 2024</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 5 Min Read</span>
          </div>
          <h1 className="font-display-lg text-4xl md:text-5xl text-forest-deep mb-6 leading-tight">
            5 Health Benefits You Didn't Know About Mithila Makhana
          </h1>
          <p className="font-body-lg text-xl text-on-surface-variant leading-relaxed">
            From magnesium levels to protein-packed snacking, learn why Makhana is the ultimate choice for weight management and heart health.
          </p>
        </header>

        {/* Featured Image */}
        <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl mb-16">
          <img 
            className="w-full h-full object-cover" 
            alt="Makhana in a wooden bowl" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw3nMGdJV3lAszYfkIbf8ZOuQBhZpZnUe_h5qYKkHK9tAN9PMaA4X95_MheNiQsfPeJHyKa4FWA5LKBW2oxq20bMWiHuTMBAlMkeCWDGTh_XM9J9tyv2AGLvBdOBhzCWQ-xHEAKgs70dCZFuwMC_OAFU1Ykre0Wh7JrIXauoxOhm47RatGAQyiTwHNmYjyU8IU_qPO7cbEcKlN-BDNvM664KsBHtxmSl4oqNKn9Owqusle58qwAB4XmFZqWf__lVX_UoYAn4RqaZOT" 
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg prose-headings:text-forest-deep prose-headings:font-display-lg prose-p:text-on-surface prose-a:text-gold-accent max-w-none mb-16">
          <h2>1. Rich in Protein and Fiber</h2>
          <p>
            Makhana is incredibly rich in protein and fiber, making it an excellent snack for those looking to maintain or lose weight. Unlike heavily processed snacks, it keeps you full longer and provides sustained energy throughout the day.
          </p>

          <h2>2. Low Glycemic Index</h2>
          <p>
            For those managing blood sugar levels, Makhana is a lifesaver. Its low glycemic index means it releases glucose slowly into the bloodstream, preventing sudden spikes. This makes it a highly recommended snack for diabetics.
          </p>

          <blockquote className="border-l-4 border-gold-accent pl-6 py-2 my-8 italic text-forest-deep font-display-lg text-2xl bg-white p-6 rounded-r-xl shadow-sm">
            "Makhana is not just a snack; it's an ancient Ayurvedic remedy for balancing the body and mind."
          </blockquote>

          <h2>3. Packed with Antioxidants</h2>
          <p>
            These little seeds are abundant in antioxidants like kaempferol, which help in fighting inflammation and protecting the body against harmful free radicals. Regular consumption can lead to better skin health and anti-aging benefits.
          </p>

          <h2>4. Gluten-Free Superfood</h2>
          <p>
            For those with celiac disease or gluten intolerance, Makhana is a perfect substitute. It can be ground into flour or eaten roasted, offering a versatile ingredient for a healthy kitchen.
          </p>

          <h2>5. Sourced Directly from Mithila</h2>
          <p>
            The best quality Makhana comes from the wetlands of Mithila, Bihar. Our GI-tagged Makhana ensures that you are getting the purest, most authentically harvested seeds, supporting local farming communities in the process.
          </p>
        </div>

        {/* Share and Tags */}
        <div className="flex flex-col md:flex-row justify-between items-center py-8 border-y border-outline-variant/30 gap-6">
          <div className="flex items-center gap-4">
            <span className="font-label-lg text-forest-deep">Tags:</span>
            <span className="px-4 py-1.5 bg-white border border-surface-container rounded-full text-sm hover:border-gold-accent cursor-pointer transition-colors">Superfood</span>
            <span className="px-4 py-1.5 bg-white border border-surface-container rounded-full text-sm hover:border-gold-accent cursor-pointer transition-colors">Diet</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-label-lg text-forest-deep">Share:</span>
            <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-forest-deep hover:bg-forest-deep hover:text-white transition-all">
              <LinkIcon className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-forest-deep hover:bg-forest-deep hover:text-white transition-all">
              <Mail className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-forest-deep hover:bg-forest-deep hover:text-white transition-all">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </article>
    </main>
  )
}
