import { createClient } from '@/lib/supabase/server'
import ProductForm from '../../ProductForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order')
  const { data: product } = await supabase.from('products').select('*').eq('id', id).single()

  if (!product) return notFound()

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="text-gray-500 hover:text-brand-primary font-semibold">&larr; Back</Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product: {product.name}</h1>
      </div>
      <ProductForm categories={categories || []} initialData={product} />
    </div>
  )
}
