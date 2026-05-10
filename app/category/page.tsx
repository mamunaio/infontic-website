import Link from 'next/link'
import { client } from '@/sanity/lib/client'

export const revalidate = 60 // ISR

async function getCategories() {
  try {
    return await client.fetch(`*[_type == "category"]{ title, "slug": slug.current, icon }`)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden pt-20 pb-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold font-outfit tracking-tight text-slate-900 dark:text-white">
            All <span className="text-gradient">Categories</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse topics by category.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category: any) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group relative p-8 bg-white dark:bg-slate-900 rounded-2xl border border-border/50 hover:border-primary/50 transition-all premium-shadow hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative space-y-4 text-center">
                <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300 inline-block">
                  {category.icon || '📁'}
                </div>
                <div className="font-bold text-lg font-outfit group-hover:text-primary transition-colors">
                  {category.title}
                </div>
              </div>
            </Link>
          ))}
          {categories.length === 0 && (
            <p className="text-muted-foreground col-span-full py-12 text-center text-sm border-2 border-dashed border-border rounded-2xl">
              No categories found.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
