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
        <p className="text-gray-500 mb-6">
          Showing results for "{q}"
        </p>

        <form action="/search" method="GET" className="relative max-w-2xl">
          <input 
            type="text" 
            name="q"
            defaultValue={q}
            placeholder="Search for fresh fish, cuts..." 
            className="w-full bg-white text-sm rounded-xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 border border-gray-300 focus:border-brand-primary/50 transition-all shadow-sm"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-primary text-white p-2 rounded-lg hover:bg-brand-primary-dark transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
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
