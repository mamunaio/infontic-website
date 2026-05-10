import { Metadata } from 'next'

interface PageSeoProps {
  title: string
  description: string
  slug: string
  ogImage?: string
  publishedAt?: string
  authorName?: string
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://infontic.com'

export function generatePageMetadata({
  title,
  description,
  slug,
  ogImage,
}: PageSeoProps): Metadata {
  const url = `${siteUrl}${slug}`
  
  return {
    title: `${title} | Infontic`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Infontic',
      images: ogImage ? [{ url: ogImage }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export function generateArticleSchema({
  title,
  description,
  slug,
  ogImage,
  publishedAt,
  authorName,
}: PageSeoProps) {
  const url = `${siteUrl}${slug}`
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: ogImage,
    datePublished: publishedAt,
    author: {
      '@type': 'Person',
      name: authorName || 'Infontic Team',
    },
    url: url,
  }
}
