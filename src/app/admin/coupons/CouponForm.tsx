'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveCoupon } from '@/app/actions/adminActions'

export default function CouponForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    const formData = new FormData(e.currentTarget)
    try {
      await saveCoupon(initialData?.id || null, formData)
      router.push('/admin/coupons')
    } catch(err) {
      alert("Failed to save coupon")
    } finally {
      setIsSaving(false)
    }
  }

  // Format date for datetime-local input
  let defaultExpiry = ''
  if (initialData?.expiry) {
    const d = new Date(initialData.expiry)
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    defaultExpiry = d.toISOString().slice(0,16)
  }
  
  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
          <input type="text" name="code" defaultValue={initialData?.code} required className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary font-mono uppercase" placeholder="e.g. SUMMER20" />
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
            <select name="discount_type" defaultValue={initialData?.discount_type || 'percentage'} required className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary">
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat Amount (₹)</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <input type="number" name="discount_value" defaultValue={initialData?.discount_value} required min="1" className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Value (₹)</label>
          <input type="number" name="min_order_value" defaultValue={initialData?.min_order_value ?? 0} className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit (Leave blank for unlimited)</label>
          <input type="number" name="usage_limit" defaultValue={initialData?.usage_limit || ''} min="1" className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date & Time (Optional)</label>
          <input type="datetime-local" name="expiry" defaultValue={defaultExpiry} className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary" />
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
          {isSaving ? 'Saving...' : 'Save Coupon'}
        </button>
      </div>
    </form>
  )
}
