import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { generatePageMetadata } from '@/lib/seo'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

async function getCategory(slug: string) {
  try {
    return await client.fetch(
      `*[_type == "category" && slug.current == $slug][0]{
        title,
        description,
        "posts": *[_type == "post" && references(^._id)]{
          title,
          "slug": slug.current,
          excerpt,
          publishedAt
        }
      }`,
      { slug }
    )
  } catch (error) {
    console.error('Failed to fetch category:', error)
    return null
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.slug)
  
  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return generatePageMetadata({
    title: category.title,
    description: category.description || `Browse articles in ${category.title}`,
    slug: `/category/${params.slug}`,
  })
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategory(params.slug)

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          {category.title}
        </h1>
        {category.description && (
          <p className="text-lg text-slate-700 dark:text-slate-300">
            {category.description}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {category.posts?.map((post: { slug: string, title: string, excerpt?: string, publishedAt?: string }) => (
          <div key={post.slug} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                {post.title}
              </Link>
            </h2>
            {post.excerpt && (
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                {post.excerpt}
              </p>
            )}
            <div className="text-xs text-slate-500">
              {post.publishedAt &&
                new Date(post.publishedAt).toLocaleDateString('en-US', {
                  dateStyle: 'medium',
                })}
            </div>
          </div>
        ))}
        {(!category.posts || category.posts.length === 0) && (
          <p className="text-slate-500 col-span-full">No posts found in this category.</p>
        )}
      </div>
    </div>
  )
}
