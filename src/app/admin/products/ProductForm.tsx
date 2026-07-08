'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveProduct } from '@/app/actions/adminActions'

export default function ProductForm({ categories, initialData = null }: { categories: any[], initialData?: any }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    const formData = new FormData(e.currentTarget)
    try {
      await saveProduct(initialData?.id || null, formData)
      router.push('/admin/products')
    } catch(err) {
      alert("Failed to save product")
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" name="name" defaultValue={initialData?.name} required className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL-friendly)</label>
          <input type="text" name="slug" defaultValue={initialData?.slug} required className="w-full p-2 border border-gray-300 rounded font-mono text-sm outline-none focus:border-brand-primary" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select name="category_id" defaultValue={initialData?.category_id} required className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary">
            <option value="">Select Category...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
          <select name="stock_status" defaultValue={initialData?.stock_status || 'in_stock'} required className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary">
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹)</label>
          <input type="number" name="base_price" defaultValue={initialData?.base_price} required className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary" />
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Type</label>
            <select name="pricing_type" defaultValue={initialData?.pricing_type || 'fixed'} required className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary">
              <option value="fixed">Fixed Price</option>
              <option value="weight">By Weight</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <input type="text" name="unit" defaultValue={initialData?.unit || 'pc'} required placeholder="e.g., kg, pc" className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary" />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea name="description" defaultValue={initialData?.description} rows={3} className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary"></textarea>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Images (Comma separated URLs for now)</label>
        <input type="text" name="images" defaultValue={initialData?.images?.join(', ')} className="w-full p-2 border border-gray-300 rounded text-sm font-mono outline-none focus:border-brand-primary" placeholder="https://..., https://..." />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cut Options (Comma separated)</label>
        <input type="text" name="cut_options" defaultValue={initialData?.cut_options?.join(', ')} className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-brand-primary" placeholder="Whole, Curry Cut, Bengali Cut" />
      </div>
      
      <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_active" defaultChecked={initialData ? initialData.is_active : true} className="w-4 h-4 text-brand-primary rounded" />
          <span className="text-sm font-medium text-gray-700">Active (Visible on store)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_bestseller" defaultChecked={initialData?.is_bestseller} className="w-4 h-4 text-brand-primary rounded" />
          <span className="text-sm font-medium text-gray-700">Bestseller</span>
        </label>
      </div>

      <div className="pt-6">
        <button type="submit" disabled={isSaving} className="bg-brand-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 transition-colors">
          {isSaving ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  )
}
