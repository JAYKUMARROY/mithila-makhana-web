"use client"
import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'

export default function Blog() {
  return (
    <>
      <main className="pt-24 pb-20">
        {/* Featured Article */}
        <section className="max-w-[1280px] mx-auto px-6 mb-20">
          <div className="relative w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden shadow-xl group">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBYB3bhlLwwPF0hkK9aL7kGrgO0RRFSvey6nkIfPch4vgDLklUV_EMJf22v8OzSBwe0oySNplUyTCzjfIv1XUa80Zk-QADVknySxGGnGo_L-5oSjYdbUEdsLC1pbjjcO5-i6gDKscPyWEFukjSbFXcr0Q9eAjkWS-6HfBKRZdjxEFIFbP7CSdzbIkF9C3-BaX8_MLOFklej0pXURKnAIgKW8dbVSqVXAJwAedKkW7dkowFLNFffn4-0J5AtfwXv5yNg-uNgtz2ebVjX')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-3/4 lg:w-1/2">
              <span className="inline-block px-3 py-1 bg-gold-accent text-white font-label-lg text-[12px] rounded-full mb-4 uppercase tracking-wider">
                Featured Heritage
              </span>
              <h1 className="font-display-lg text-4xl md:text-display-lg text-white mb-6 leading-tight">
                Makhana: The Superfood of the Future
              </h1>
              <p className="text-white/80 font-body-lg text-body-lg mb-8 line-clamp-2">
                Discover how this ancient seed from the ponds of Mithila is becoming the global standard for clean, plant-based nutrition.
              </p>
              <Link 
                href="/blog/superfood-of-the-future" 
                className="inline-flex items-center gap-2 bg-white text-forest-deep px-8 py-3 rounded-lg font-label-lg hover:bg-gold-accent hover:text-white transition-all transform active:scale-95"
              >
                Read the Full Story
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="max-w-[1280px] mx-auto px-6 mb-12">
          <div className="flex flex-wrap gap-4 items-center justify-center border-b border-outline-variant/30 pb-6">
            <button className="px-6 py-2 rounded-full bg-forest-deep text-white font-label-lg transition-colors">All Posts</button>
            <button className="px-6 py-2 rounded-full text-forest-deep hover:bg-secondary-container transition-colors font-label-lg">Nutrition</button>
            <button className="px-6 py-2 rounded-full text-forest-deep hover:bg-secondary-container transition-colors font-label-lg">Recipes</button>
            <button className="px-6 py-2 rounded-full text-forest-deep hover:bg-secondary-container transition-colors font-label-lg">Heritage</button>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Nutrition */}
            <article className="flex flex-col bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden hover:shadow-md transition-all group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt="Nutrition" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw3nMGdJV3lAszYfkIbf8ZOuQBhZpZnUe_h5qYKkHK9tAN9PMaA4X95_MheNiQsfPeJHyKa4FWA5LKBW2oxq20bMWiHuTMBAlMkeCWDGTh_XM9J9tyv2AGLvBdOBhzCWQ-xHEAKgs70dCZFuwMC_OAFU1Ykre0Wh7JrIXauoxOhm47RatGAQyiTwHNmYjyU8IU_qPO7cbEcKlN-BDNvM664KsBHtxmSl4oqNKn9Owqusle58qwAB4XmFZqWf__lVX_UoYAn4RqaZOT" 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-forest-deep text-white px-3 py-1 rounded font-label-sm uppercase tracking-wider text-xs">Nutrition</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-headline-md text-headline-md text-forest-deep mb-3">5 Health Benefits You Didn't Know</h3>
                <p className="text-on-surface-variant font-body-md mb-6 line-clamp-3">
                  From magnesium levels to protein-packed snacking, learn why Makhana is the ultimate choice for weight management and heart health.
                </p>
                <div className="mt-auto flex justify-between items-center">
                  <span className="text-label-sm text-outline font-label-sm">5 Min Read</span>
                  <Link href="/blog/health-benefits" className="text-primary-custom font-label-lg flex items-center gap-1 hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>

            {/* Card 2: Recipes */}
            <article className="flex flex-col bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden hover:shadow-md transition-all group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt="Recipes" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8V4D8HJAxPQxL4zKalNGxLkQFyb7FNVCr4OcJeNXStkiiTL4KWJLfROM5IMqKRS8wtbj0xic0R_8d1viNyWs3tal6aDIJ5rN9OK03qE7wSW4uWLaEGRrjRLS5fHfQw5hZdKiaCZSD0WOdcrsN2F6svDLexPdWxjfsuQtMvtaxVBDTCI76r1ViyCGtWdW4WIamj35WvPgiB40nhCjhgRlH8p3K02oxlvjsCADuFhf2W3lEryJOd2ulwPr6_lfz-sQSO8zL9rOQde39" 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-secondary-custom text-white px-3 py-1 rounded font-label-sm uppercase tracking-wider text-xs">Recipes</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-headline-md text-headline-md text-forest-deep mb-3">Gourmet Roasted Makhana Three Ways</h3>
                <p className="text-on-surface-variant font-body-md mb-6 line-clamp-3">
                  Elevate your snacking game with our exclusive recipes for Peri-Peri, Himalayan Pink Salt, and Caramelized gold variants.
                </p>
                <div className="mt-auto flex justify-between items-center">
                  <span className="text-label-sm text-outline font-label-sm">8 Min Read</span>
                  <Link href="/blog/gourmet-recipes" className="text-primary-custom font-label-lg flex items-center gap-1 hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>

            {/* Card 3: Heritage */}
            <article className="flex flex-col bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden hover:shadow-md transition-all group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt="Heritage" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrLEYZ4G53saOg4k6MGo5STL-n24WeNYvnpdMkzcfijbOUxFCe5rC2kIxXPlETlzITZoZIPDlxfhiV-HlwT-QM-1RSw-V60WDH0VZEGI6OreAmAujg48hd5ZqJqSVIatwqMLDUfDNgQoSRSC4a6P3ANGXnvq9jUvnMP6tPs6-x5QWIzuo9EJP_TsY7lFmU3i774xnqqEZVuFxZMwcKqY0gi6ctAFxeuJb-UJrvllJ6vNIu_8lczpYuGMcSDgkEvVdQXXcfm5YjxFDG" 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-gold-accent text-white px-3 py-1 rounded font-label-sm uppercase tracking-wider text-xs">Heritage</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-headline-md text-headline-md text-forest-deep mb-3">The Soul of Mithila: GI Tag Story</h3>
                <p className="text-on-surface-variant font-body-md mb-6 line-clamp-3">
                  Understanding the significance of the Geographical Indication tag and how it protects the traditional harvesters of Bihar.
                </p>
                <div className="mt-auto flex justify-between items-center">
                  <span className="text-label-sm text-outline font-label-sm">12 Min Read</span>
                  <Link href="/blog/gi-tag-story" className="text-primary-custom font-label-lg flex items-center gap-1 hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>

            {/* Card 4: Heritage */}
            <article className="flex flex-col bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden hover:shadow-md transition-all group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt="Art and Agriculture" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIpK2dtbnx4CE4OuRxNkbBf5Lip0ollBX4v9t7lPCGq8siPI-WPI6aYQBMcgEZnYUxM20eUsy2ye3yPdJiMobOIGQ9DZd2abbIYqn3WpkL7Wiv7DWmiCfQGngLM4E2UqkFRItp757sUTXQkXKHSGcvowUWnnR7EhadUQPKhSyYwcposj4HVzYiKIxe82WLGENrWJwi-ODvLGJGGn4QW30rFfamnevTs03M-hB9_eatqFc7BnihXHtzFxPO9hnMlqcyCAwA7GyCQd_8" 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-gold-accent text-white px-3 py-1 rounded font-label-sm uppercase tracking-wider text-xs">Heritage</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-headline-md text-headline-md text-forest-deep mb-3">Art and Agriculture: Madhubani Roots</h3>
                <p className="text-on-surface-variant font-body-md mb-6 line-clamp-3">
                  Exploring the deep cultural connection between the traditional folk art of Bihar and the cultivation of Makhana seeds.
                </p>
                <div className="mt-auto flex justify-between items-center">
                  <span className="text-label-sm text-outline font-label-sm">6 Min Read</span>
                  <Link href="/blog/madhubani-roots" className="text-primary-custom font-label-lg flex items-center gap-1 hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>

            {/* Card 5: Nutrition */}
            <article className="flex flex-col bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden hover:shadow-md transition-all group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt="Post-Workout" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsSp7QghBl57jp6t09bQtMw9cJ4jlpX3UecxqXHWLdwjk5ZUS5JxGmVspHvEskLWaE5O4yLB_rnzJS2BXmXgPxZ2RvkLgqR5CPsxYfjjvihgW-eAp3g6c-JAu_OQJ5GCboyJB0XuWTdnlw42m2SBqMypTfi-97FLBMx_bfO53ylYA8hF0_i1Kz_L5a3HemWptsPrIjnXpx_8jl9S-6sGzLaw4d2OApl8dzH8Pca_uNlu74Qvyo01u7gRNEfSw04cYakxEG-r97rej4" 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-forest-deep text-white px-3 py-1 rounded font-label-sm uppercase tracking-wider text-xs">Nutrition</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-headline-md text-headline-md text-forest-deep mb-3">Makhana as a Post-Workout Fuel</h3>
                <p className="text-on-surface-variant font-body-md mb-6 line-clamp-3">
                  Why top fitness experts are swapping protein bars for traditional roasted seeds to aid muscle recovery and sustained energy.
                </p>
                <div className="mt-auto flex justify-between items-center">
                  <span className="text-label-sm text-outline font-label-sm">4 Min Read</span>
                  <Link href="/blog/post-workout-fuel" className="text-primary-custom font-label-lg flex items-center gap-1 hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>

            {/* Card 6: Recipes */}
            <article className="flex flex-col bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden hover:shadow-md transition-all group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt="Makhana Kheer" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMw5TdlKiU-DKX1yW2AKIUEfiuqzSZStxvCYCnyb9SSkhMogJk7NTeQGyyObMr1lLHKHKb3yymAEaSoORHSjvv3VO10_Ka8VEtGbfqaH4hx2f9eynwPYntOP5j417DnPsZOyxd9c31Cnk1wO1fKNbMSLpK1lXO2w0Q1WSvpOlOWYzTlZ3sVZF6q9HK9AS5fb9W3-s1ByjY2Lhh0WWbsXEdKbWY62hoOdo1xpiWamtCFCYlq00qwgNLeGLXReQRVJeyk82aioHUqIDv" 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-secondary-custom text-white px-3 py-1 rounded font-label-sm uppercase tracking-wider text-xs">Recipes</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-headline-md text-headline-md text-forest-deep mb-3">Festive Delights: Royal Makhana Kheer</h3>
                <p className="text-on-surface-variant font-body-md mb-6 line-clamp-3">
                  A step-by-step guide to preparing the most authentic, creamy dessert from the kitchens of Darbhanga royalty.
                </p>
                <div className="mt-auto flex justify-between items-center">
                  <span className="text-label-sm text-outline font-label-sm">10 Min Read</span>
                  <Link href="/blog/makhana-kheer" className="text-primary-custom font-label-lg flex items-center gap-1 hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-16 gap-2">
            <button className="w-10 h-10 rounded-lg border border-outline-variant flex items-center justify-center text-forest-deep bg-forest-deep text-white transition-all font-bold">1</button>
            <button className="w-10 h-10 rounded-lg border border-outline-variant flex items-center justify-center text-forest-deep hover:bg-forest-deep hover:text-white transition-all font-bold">2</button>
            <button className="w-10 h-10 rounded-lg border border-outline-variant flex items-center justify-center text-forest-deep hover:bg-forest-deep hover:text-white transition-all font-bold">3</button>
            <button className="w-10 h-10 rounded-lg border border-outline-variant flex items-center justify-center text-forest-deep hover:bg-forest-deep hover:text-white transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="mt-24 bg-forest-deep py-20 relative overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-6 relative z-10 text-center">
            <h2 className="font-headline-lg text-headline-lg text-primary-fixed mb-4">Join the Healthy Community</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-10 font-body-lg text-body-lg">
              Get seasonal recipes, nutritional deep-dives, and exclusive heritage stories delivered directly to your inbox every month.
            </p>
            <form 
              className="max-w-md mx-auto flex flex-col md:flex-row gap-4" 
              onSubmit={(e) => { e.preventDefault(); alert('Thank you for joining!'); }}
            >
              <input 
                className="flex-grow px-6 py-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-gold-accent focus:border-transparent outline-none transition-all" 
                placeholder="Enter your email address" 
                required 
                type="email" 
              />
              <button 
                className="bg-gold-accent text-forest-deep font-label-lg px-8 py-4 rounded-lg hover:bg-primary-fixed transition-all transform active:scale-95 shadow-lg" 
                type="submit"
              >
                Subscribe Now
              </button>
            </form>
            <p className="mt-6 text-white/40 text-label-sm">Respecting your privacy. Unsubscribe anytime.</p>
          </div>
        </section>
      </main>
    </>
  )
}
