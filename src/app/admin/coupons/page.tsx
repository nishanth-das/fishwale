import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { deactivateCoupon } from '@/app/actions/adminActions'

export const dynamic = 'force-dynamic'

export default async function CouponsPage() {
  const supabase = await createClient()
  const { data: coupons } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
        <Link href="/admin/coupons/new" className="bg-brand-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
          + Add Coupon
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">Code</th>
                <th className="p-4 font-semibold text-gray-600">Discount</th>
                <th className="p-4 font-semibold text-gray-600">Min Order</th>
                <th className="p-4 font-semibold text-gray-600">Usage</th>
                <th className="p-4 font-semibold text-gray-600">Expiry</th>
                <th className="p-4 font-semibold text-gray-600">Active</th>
                <th className="p-4 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons?.map(c => {
                const isExpired = c.expiry && new Date(c.expiry) < new Date()
                return (
                  <tr key={c.id} className={`border-b border-gray-100 hover:bg-gray-50 ${!c.is_active || isExpired ? 'opacity-50' : ''}`}>
                    <td className="p-4 font-mono font-bold text-gray-900">{c.code}</td>
                    <td className="p-4 font-semibold text-green-600">
                      {c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}
                    </td>
                    <td className="p-4 text-gray-600">₹{c.min_order_value}</td>
                    <td className="p-4 text-gray-600">
                      {c.times_used} / {c.usage_limit || '∞'}
                    </td>
                    <td className="p-4 text-gray-600">
                      {c.expiry ? new Date(c.expiry).toLocaleDateString() : 'Never'}
                      {isExpired && <span className="text-xs text-red-500 ml-2 font-semibold">(Expired)</span>}
                    </td>
                    <td className="p-4">
                      {c.is_active ? <span className="text-green-600 font-bold">Yes</span> : <span className="text-gray-400 font-bold">No</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-3">
                        <Link href={`/admin/coupons/${c.id}/edit`} className="text-brand-primary hover:underline font-semibold">Edit</Link>
                        <form action={async () => {
                          'use server'
                          await deactivateCoupon(c.id)
                        }}>
                          <button type="submit" className="text-red-600 hover:underline font-semibold">Deactivate</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {(!coupons || coupons.length === 0) && (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">No coupons found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
