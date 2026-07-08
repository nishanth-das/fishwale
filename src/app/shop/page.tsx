import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/ProductCard'

export const revalidate = 60

export default async function ShopPage() {
  const supabase = await createClient()

  // Fetch all active products
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar placeholder (Filters to be expanded later) */}
        <div className="w-full md:w-64 flex-shrink-0">
          <h2 className="text-xl font-bold text-brand-dark mb-6">All Products</h2>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
             <p className="text-sm text-gray-500">Filters coming soon.</p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} category={product.categories} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-12 text-center rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500">Check back later for fresh catch!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
