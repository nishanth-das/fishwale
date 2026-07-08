import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export const revalidate = 0 // Search should always be fresh

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams
  const supabase = await createClient()

  // Fetch products matching search query
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(*)')
    .ilike('name', `%${q}%`)
    .eq('is_active', true)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-heading font-bold text-brand-dark mb-2">Search Results</h1>
        <p className="text-gray-500">
          Showing results for "{q}"
        </p>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} category={product.categories} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-12 text-center rounded-2xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-700 mb-4">No products found for "{q}"</h3>
          <Link href="/shop" className="inline-block px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-red-700 transition-colors">
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  )
}
