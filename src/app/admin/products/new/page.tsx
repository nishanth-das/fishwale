import { createClient } from '@/lib/supabase/server'
import ProductForm from '../ProductForm'
import Link from 'next/link'

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order')

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="text-gray-500 hover:text-brand-primary font-semibold">&larr; Back</Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
      </div>
      <ProductForm categories={categories || []} />
    </div>
  )
}
