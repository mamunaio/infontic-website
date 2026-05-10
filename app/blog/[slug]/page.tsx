import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import { generatePageMetadata, generateArticleSchema } from '@/lib/seo'

interface PostPageProps {
  params: {
    slug: string
  }
}

async function getPost(slug: string) {
  try {
    return await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{
        title,
        excerpt,
        body,
        publishedAt,
        ogImage,
        "authorName": author->name,
        "categoryTitle": category->title
      }`,
      { slug }
    )
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return null
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return generatePageMetadata({
    title: post.title,
    description: post.excerpt || 'Read the full article on Infontic.',
    slug: `/blog/${params.slug}`,
    ogImage: post.ogImage ? urlFor(post.ogImage).url() : undefined,
  })
}

export async function generateStaticParams() {
  try {
    const posts = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`)
    return posts.map((post: { slug: string }) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Failed to fetch posts for static params:', error)
    return []
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  const jsonLd = generateArticleSchema({
    title: post.title,
    description: post.excerpt || '',
    slug: `/blog/${params.slug}`,
    ogImage: post.ogImage ? urlFor(post.ogImage).url() : undefined,
    publishedAt: post.publishedAt,
    authorName: post.authorName,
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          {post.categoryTitle && (
            <div className="text-sm text-blue-600 font-semibold uppercase mb-2">
              {post.categoryTitle}
            </div>
          )}
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {post.title}
          </h1>
          <div className="flex items-center text-slate-500 text-sm">
            {post.authorName && <span>By {post.authorName}</span>}
            {post.authorName && post.publishedAt && <span className="mx-2">•</span>}
            {post.publishedAt && (
              <span>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  dateStyle: 'long',
                })}
              </span>
            )}
          </div>
        </header>
        {post.ogImage && (
          <div className="relative w-full h-[400px] mb-8">
            <Image
              src={urlFor(post.ogImage).url()}
              alt={post.title}
              fill
              className="rounded-xl object-cover"
              priority
            />
          </div>
        )}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {post.body && <PortableText value={post.body} />}
        </div>
      </article>
    </div>
  )
}
