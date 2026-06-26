import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { ShareButtons } from '@/components/share-buttons'
import { blogPosts } from '@/lib/blog-data'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found | Mithila Makhana',
    }
  }

  return {
    title: `${post.title} | Mithila Makhana Journal`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.image],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image],
    }
  }
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug)
  
  if (!post) {
    notFound()
  }

  return (
    <article className="bg-cream-bg min-h-screen selection:bg-gold-accent/30 pt-32 pb-32">
      
      <div className="max-w-[800px] mx-auto px-6">
        
        {/* Navigation Back */}
        <div className="mb-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-forest-deep/60 hover:text-forest-deep transition-colors text-sm font-bold tracking-widest uppercase">
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>
        </div>

        {/* Elegant Header */}
        <header className="mb-12 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
            <span className={`px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[11px] shadow-sm ${
              post.category === 'Nutrition' ? 'bg-forest-deep/5 text-forest-deep border border-forest-deep/10' :
              post.category === 'Recipes' ? 'bg-secondary-container text-secondary-custom border border-secondary-custom/20' :
              'bg-gold-accent/20 text-forest-deep border border-gold-accent/30'
            }`}>
              {post.category}
            </span>
            <span className="text-forest-deep/50 font-medium text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <span className="text-forest-deep/50 font-medium text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" /> {post.readTime}
            </span>
          </div>
          
          <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-forest-deep leading-[1.2] mb-6">
            {post.title}
          </h1>
          
          <p className="font-body-lg text-xl text-forest-deep/70 leading-relaxed max-w-2xl">
            {post.description}
          </p>
        </header>

        {/* Beautiful Contained Image */}
        <div className="w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-lg mb-16 border border-outline-variant/30">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Body */}
        <div className="relative">
          
          {/* Glassmorphic Author Info / Share Ribbon */}
          <div className="flex flex-col md:flex-row items-center justify-between bg-white/60 backdrop-blur-md border border-white p-6 rounded-2xl shadow-sm mb-12">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="w-12 h-12 rounded-full bg-forest-deep flex items-center justify-center text-white font-bold font-serif text-lg">
                M
              </div>
              <div>
                <p className="font-bold text-forest-deep">Editorial Team</p>
                <p className="text-xs text-forest-deep/60 font-medium uppercase tracking-widest mt-0.5">Mithila Makhana</p>
              </div>
            </div>
            
            <ShareButtons title={post.title} url={`https://mithilamakhana.com/blog/${post.slug}`} />
          </div>

          {/* Text Content */}
          <div 
            className="max-w-none text-justify md:text-left [&_p]:font-body-lg [&_p]:text-[18px] md:[&_p]:text-[20px] [&_p]:leading-relaxed [&_p]:font-light [&_p]:text-on-surface-variant [&_p]:mb-6 [&_h2]:font-display-sm [&_h2]:text-forest-deep [&_h2]:text-3xl md:[&_h2]:text-4xl [&_h2]:mt-12 [&_h2]:mb-6 [&_h3]:font-display-sm [&_h3]:text-forest-deep [&_h3]:text-2xl md:[&_h3]:text-3xl [&_h3]:mt-8 [&_h3]:mb-4 [&_strong]:font-bold [&_strong]:text-forest-deep [&_ul]:list-none [&_ul]:pl-0 [&_ul]:my-6 [&_ul]:text-[18px] md:[&_ul]:text-[20px] [&_ul]:font-light [&_ul]:text-on-surface-variant [&_li]:relative [&_li]:pl-8 [&_li]:mb-3 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.6em] [&_li]:before:w-2 [&_li]:before:h-2 [&_li]:before:bg-gold-accent [&_li]:before:rounded-full [&_blockquote]:border-l-4 [&_blockquote]:border-gold-accent [&_blockquote]:bg-white/60 [&_blockquote]:px-6 [&_blockquote]:py-6 [&_blockquote]:rounded-r-2xl [&_blockquote]:italic [&_blockquote]:text-forest-deep [&_blockquote]:my-8 [&_blockquote]:shadow-sm [&_blockquote]:text-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
        </div>

        {/* Minimal Footer CTA */}
        <div className="mt-20 pt-10 border-t border-outline-variant/30 flex flex-col items-center text-center">
          <p className="text-forest-deep/60 font-medium uppercase tracking-widest text-sm mb-4">Discover the Source</p>
          <h3 className="font-display-sm text-3xl text-forest-deep mb-8">Ready to try our GI-Tagged Makhana?</h3>
          <Link href="/shop" className="bg-forest-deep text-white font-bold px-8 py-3 rounded-xl hover:bg-gold-accent hover:text-forest-deep transition-colors shadow-md">
            Shop The Collection
          </Link>
        </div>
        
      </div>
    </article>
  )
}
