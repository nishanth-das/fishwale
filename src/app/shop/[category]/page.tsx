import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/ProductCard'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params
  const supabase = await createClient()
  const { data: category } = await supabase.from('categories').select('*').eq('slug', categorySlug).single()
  
  if (!category) return { title: 'Category Not Found' }
  
  return {
    title: `${category.name} | FishWale`,
    description: `Browse our fresh selection of ${category.name.toLowerCase()} at FishWale.com.`,
    openGraph: {
      images: category.image_url ? [category.image_url] : [],
    }
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params
  const supabase = await createClient()

  // Verify category exists
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', categorySlug)
    .single()

  if (!category) {
    notFound()
  }

  // Fetch products for this category
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-heading font-bold text-brand-dark mb-4">{category.name}</h1>
        <p className="text-gray-500">Browse our selection of fresh {category.name.toLowerCase()}.</p>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} category={product.categories} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-12 text-center rounded-2xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-700 mb-2">No products found in this category</h3>
          <p className="text-gray-500">Check back later for fresh catch!</p>
        </div>
      )}
    </div>
  )
}
