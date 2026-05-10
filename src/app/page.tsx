import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60 // ISR

async function getData() {
  console.log('Fetching data from Sanity...')
  try {
    const categories = await client.fetch(`*[_type == "category"]{ title, "slug": slug.current, icon }`)
    console.log('Fetched categories:', categories.length)
    const posts = await client.fetch(`*[_type == "post"] | order(publishedAt desc)[0..5]{
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      ogImage,
      "categoryTitle": category->title
    }`)
    console.log('Fetched posts:', posts.length)
    
    return { categories, posts }
  } catch (error) {
    console.error('Failed to fetch data for homepage:', error)
    return { categories: [], posts: [] }
  }
}

export default async function Home() {
  console.log('Rendering Home page...')
  const { categories, posts } = await getData()

  return (
    <div className="pb-20">
      {/* Hero Section with Mesh Gradient */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(99,102,241,0.15)_0%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(45%_45%_at_50%_50%,rgba(99,102,241,0.2)_0%,rgba(0,0,0,0)_100%)]" />
        <div className="absolute top-0 left-0 -z-10 h-full w-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
        
        <div className="container mx-auto px-4 text-center space-y-8 animate-reveal">
          <div className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase rounded-full bg-primary/10 text-primary border border-primary/20">
            Welcome to the Future of Tech
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-outfit tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
            Elevate Your <span className="text-gradient">Digital Intelligence</span> with Infontic
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Your premium destination for high-fidelity reviews, deep-dive tech insights, and tomorrow&apos;s trends, today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/blog" className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-primary/20 transition-all transform hover:-translate-y-1">
              Read Latest Reviews
            </Link>
            <Link href="/about" className="glass px-8 py-4 rounded-2xl font-bold hover:bg-white/90 dark:hover:bg-slate-900/90 transition-all transform hover:-translate-y-1">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Category Grid - Modern Horizontal or Dynamic */}
      <section className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="glass p-8 rounded-[2rem] premium-shadow border-white/40 dark:border-white/5">
          <div className="flex justify-between items-end mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-outfit">Explore Categories</h2>
              <p className="text-muted-foreground text-sm">Find exactly what you&apos;re looking for</p>
            </div>
            <Link href="/categories" className="text-sm font-bold text-primary hover:underline underline-offset-4">
              View All &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category: any) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group relative p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-border/50 hover:border-primary/50 transition-all hover:bg-white dark:hover:bg-slate-900 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative space-y-3">
                  <div className="text-3xl transform group-hover:scale-110 transition-transform duration-300 inline-block">
                    {category.icon || '📁'}
                  </div>
                  <div className="font-bold text-sm font-outfit group-hover:text-primary transition-colors">
                    {category.title}
                  </div>
                </div>
              </Link>
            ))}
            {categories.length === 0 && (
              <p className="text-muted-foreground col-span-full py-12 text-center text-sm border-2 border-dashed border-border rounded-2xl">
                Start your journey by adding categories in Sanity Studio.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Latest Posts - Staggered Premium Grid */}
      <section className="container mx-auto px-4 py-32 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold font-outfit tracking-tight">Latest Insights</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post: any, index: number) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-border/50 hover:border-primary/30 transition-all premium-shadow hover:-translate-y-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {post.ogImage ? (
                  <Image
                    src={urlFor(post.ogImage).url()}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="text-4xl">📰</span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  {post.categoryTitle && (
                    <span className="glass px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-primary border-primary/20">
                      {post.categoryTitle}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col space-y-4">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-border" />
                  {post.publishedAt &&
                    new Date(post.publishedAt).toLocaleDateString('en-US', {
                      dateStyle: 'medium',
                    })}
                </div>
                <h3 className="text-2xl font-bold font-outfit leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                <div className="pt-4 mt-auto">
                  <span className="text-xs font-bold flex items-center gap-2 text-primary">
                    READ ARTICLE <span className="transform group-hover:translate-x-2 transition-transform">&rarr;</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full py-20 text-center glass rounded-3xl border-2 border-dashed border-border">
              <div className="text-4xl mb-4">✍️</div>
              <p className="text-muted-foreground font-medium">No stories yet. Time to write your first masterpiece!</p>
              <Link href="/studio" className="text-primary font-bold mt-4 inline-block hover:underline">Go to Studio &rarr;</Link>
            </div>
          )}
        </div>
      </section>

      {/* Premium Newsletter CTA */}
      <section className="container mx-auto px-4">
        <div className="relative overflow-hidden bg-slate-900 dark:bg-primary/10 rounded-[3rem] py-20 px-8 text-center border border-white/10">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary opacity-20 blur-[120px]" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600 opacity-20 blur-[120px]" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold font-outfit tracking-tight text-white">
                Join the <span className="text-primary italic font-serif">Inner Circle</span>
              </h2>
              <p className="text-slate-400 font-medium">
                Get exclusive reviews, curated tech news, and early access to our deep-dive reports. No spam, just pure intelligence.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 bg-white/5 p-2 rounded-3xl border border-white/10">
              <input
                type="email"
                placeholder="Your premium email address"
                className="flex-1 bg-transparent px-6 py-4 text-white focus:outline-none placeholder:text-slate-500"
              />
              <button className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all transform active:scale-95">
                Subscribe Now
              </button>
            </div>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
              Join 5,000+ technology enthusiasts
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
