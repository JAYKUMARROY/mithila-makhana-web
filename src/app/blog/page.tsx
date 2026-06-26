"use client"
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BookOpen } from 'lucide-react'
import { blogPosts, BlogCategory } from '@/lib/blog-data'

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("All Posts")

  // The first post in the data is our featured post
  const featuredPost = blogPosts[0]
  
  // Filter the rest of the posts based on active category
  // Exclude the featured post from the grid if we are on "All Posts" to avoid duplication,
  // but if a specific category is selected, just show all matching posts in the grid.
  const filteredPosts = blogPosts.filter((post, index) => {
    if (activeCategory === "All Posts") {
      return index !== 0 // Skip featured post in the grid when showing all
    }
    return post.category === activeCategory
  })

  const categories: BlogCategory[] = ["All Posts", "Nutrition", "Recipes", "Heritage"]

  return (
    <div className="bg-cream-bg min-h-screen selection:bg-gold-accent/30 pb-24">
      
      {/* 1. Immersive Editorial Hero (Only show if 'All Posts' is selected to keep it clean) */}
      {activeCategory === "All Posts" && (
        <section className="pt-24 pb-12">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="relative w-full h-[600px] md:h-[700px] rounded-[3rem] overflow-hidden shadow-2xl group border-4 border-white/50">
              <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gold-accent/20 blur-[100px] z-0 mix-blend-screen pointer-events-none"></div>
              <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-custom/30 blur-[100px] z-0 mix-blend-screen pointer-events-none"></div>

              <Image 
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                alt={featuredPost.title}
                src={featuredPost.image} 
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
              
              <div className="absolute inset-0 bg-forest-deep/50"></div>
              
              <div className="absolute inset-0 flex items-center justify-center p-6 md:p-16">
                <div className="text-center max-w-3xl mx-auto text-white transform transition-transform duration-500 hover:scale-[1.02]">
                  <span className="inline-flex items-center gap-2 px-5 py-2 bg-gold-accent text-forest-deep font-bold text-xs rounded-full mb-6 uppercase tracking-widest shadow-md">
                    Featured {featuredPost.category}
                  </span>
                  <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                    {featuredPost.title}
                  </h1>
                  <p className="text-white/90 font-body-lg text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
                    {featuredPost.description}
                  </p>
                  <Link 
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-3 bg-white text-forest-deep px-8 py-4 rounded-xl font-bold hover:bg-gold-accent transition-all transform active:scale-95 shadow-lg group/btn"
                  >
                    Read the Full Story
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Sleek Interactive Filters */}
      <section className={`max-w-[1280px] mx-auto px-6 mb-16 ${activeCategory !== "All Posts" ? "pt-32" : ""}`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-4 rounded-2xl shadow-sm border border-outline-variant/30">
          <div className="flex items-center gap-3 px-4">
            <BookOpen className="w-5 h-5 text-gold-accent" />
            <h2 className="font-display-sm text-2xl text-forest-deep font-bold">Latest Journal</h2>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center justify-center">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                  activeCategory === cat 
                    ? "bg-forest-deep text-white shadow-md border-forest-deep" 
                    : "text-forest-deep bg-transparent hover:bg-cream-bg border-transparent hover:border-outline-variant/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Elevated Blog Grid */}
      <section className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article key={post.slug} className="group flex flex-col bg-white rounded-3xl shadow-sm border border-outline-variant/20 overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500">
              <Link href={`/blog/${post.slug}`} className="relative h-64 overflow-hidden block">
                <Image 
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                  alt={post.title} 
                  src={post.image} 
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-6 left-6">
                  <span className={`backdrop-blur-sm px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-sm ${
                    post.category === 'Nutrition' ? 'bg-white/90 text-forest-deep border border-outline-variant/20' :
                    post.category === 'Recipes' ? 'bg-secondary-container/90 text-secondary-custom border border-secondary-custom/20' :
                    'bg-gold-accent/90 text-forest-deep border border-gold-accent/20'
                  }`}>
                    {post.category}
                  </span>
                </div>
              </Link>
              <div className="p-8 flex flex-col flex-grow relative">
                <h3 className="font-display-sm text-2xl font-bold text-forest-deep mb-4 group-hover:text-primary-custom transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-on-surface-variant font-body-md mb-8 line-clamp-3 leading-relaxed">
                  {post.description}
                </p>
                <div className="mt-auto flex justify-between items-center pt-6 border-t border-outline-variant/20">
                  <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">{post.readTime}</span>
                  <Link href={`/blog/${post.slug}`} className="w-10 h-10 rounded-full bg-cream-bg flex items-center justify-center text-primary-custom group-hover:bg-primary-custom group-hover:text-white transition-all shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {/* Empty State if filtering results in no posts */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-on-surface-variant text-lg">No posts found in this category.</p>
            <button onClick={() => setActiveCategory("All Posts")} className="mt-4 text-primary-custom font-bold hover:underline">Clear Filter</button>
          </div>
        )}
      </section>
    </div>
  )
}
