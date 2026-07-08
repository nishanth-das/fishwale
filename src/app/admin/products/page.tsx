import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import BulkStockUpdater from './BulkStockUpdater'

export const dynamic = 'force-dynamic'

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const supabase = await createClient()

  let query = supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false })
  
  if (q) {
    query = query.ilike('name', `%${q}%`)
  }

  const { data: products } = await query

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <div className="flex gap-2">
          <form method="GET" className="flex">
            <input type="text" name="q" defaultValue={q || ''} placeholder="Search products..." className="px-3 py-2 border border-gray-300 rounded-l-lg outline-none focus:border-brand-primary" />
            <button type="submit" className="bg-gray-100 text-gray-700 px-4 py-2 border border-l-0 border-gray-300 rounded-r-lg font-semibold hover:bg-gray-200">Search</button>
          </form>
          <Link href="/admin/products/new" className="bg-brand-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 whitespace-nowrap transition-colors">
            + Add Product
          </Link>
        </div>
      </div>

      <BulkStockUpdater products={products || []} />
    </div>
  )
}
