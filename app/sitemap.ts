import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://infontic.com'
  
  // Static routes
  const routes = ['', '/about', '/search'].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  try {
    // Fetch posts from Sanity
    const posts = await client.fetch(`*[_type == "post"]{ "slug": slug.current, publishedAt }`)
    
    const postRoutes = posts.map((post: { slug: string, publishedAt?: string }) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...routes, ...postRoutes]
  } catch (error) {
    console.error('Failed to fetch posts for sitemap:', error)
    return routes
  }
}
