'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveBanner } from '@/app/actions/adminActions'

export default function BannerForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    const formData = new FormData(e.currentTarget)
    try {
      await saveBanner(initialData?.id || null, formData)
      router.push('/admin/banners')
    } catch(err) {
      alert("Failed to save banner")
    } finally {
      setIsSaving(false)
    }
  }

  const formatLocal = (isoString?: string) => {
    if (!isoString) return ''
    const d = new Date(isoString)
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString().slice(0,16)
  }
  
  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input type="url" name="image_url" defaultValue={initialData?.image_url} required className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary" placeholder="https://..." />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title (Optional)</label>
          <input type="text" name="title" defaultValue={initialData?.title} className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Click Link (Optional)</label>
          <input type="text" name="link" defaultValue={initialData?.link} className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary" placeholder="/shop/seafood" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Active From (Optional)</label>
          <input type="datetime-local" name="active_from" defaultValue={formatLocal(initialData?.active_from)} className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Active To (Optional)</label>
          <input type="datetime-local" name="active_to" defaultValue={formatLocal(initialData?.active_to)} className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order (Lower is first)</label>
          <input type="number" name="sort_order" defaultValue={initialData?.sort_order ?? 0} className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary" />
        </div>
      </div>
      
      <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_active" defaultChecked={initialData ? initialData.is_active : true} className="w-4 h-4 text-brand-primary rounded" />
          <span className="text-sm font-medium text-gray-700">Active</span>
        </label>
      </div>

      <div className="pt-6">
        <button type="submit" disabled={isSaving} className="bg-brand-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 transition-colors">
          {isSaving ? 'Saving...' : 'Save Banner'}
        </button>
      </div>
    </form>
  )
}
