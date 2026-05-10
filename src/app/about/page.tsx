import { generatePageMetadata } from '@/lib/seo'

export const metadata = generatePageMetadata({
  title: 'About Us',
  description: 'Learn more about Infontic.',
  slug: '/about',
})

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">About Infontic</h1>
      <p className="text-lg text-slate-700 dark:text-slate-300">
        Welcome to Infontic, your premier destination for insightful reviews and in-depth blog posts on the latest trends and products. Our team of experts is dedicated to bringing you honest, thorough, and engaging content.
      </p>
    </div>
  )
}
