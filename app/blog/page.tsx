import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60 // ISR

async function getData() {
  try {
    const posts = await client.fetch(`*[_type == "post"] | order(publishedAt desc){
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      ogImage,
      "categoryTitle": category->title
    }`)
    return posts
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getData()

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden pt-20 pb-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold font-outfit tracking-tight text-slate-900 dark:text-white">
            All <span className="text-gradient">Articles</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deep dives, reviews, and insights.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post: any) => (
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
    </div>
  )
}
