import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { deactivateDeliveryZone } from '@/app/actions/adminActions'

export const dynamic = 'force-dynamic'

export default async function DeliveryZonesPage() {
  const supabase = await createClient()
  const { data: zones } = await supabase.from('delivery_zones').select('*').order('city')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Delivery Zones</h1>
        <Link href="/admin/delivery-zones/new" className="bg-brand-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
          + Add Zone
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-600">City</th>
              <th className="p-4 font-semibold text-gray-600">Pin Codes</th>
              <th className="p-4 font-semibold text-gray-600">Delivery Fee</th>
              <th className="p-4 font-semibold text-gray-600">Min Order Value</th>
              <th className="p-4 font-semibold text-gray-600">Active</th>
              <th className="p-4 font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {zones?.map(zone => (
              <tr key={zone.id} className={`border-b border-gray-100 hover:bg-gray-50 ${!zone.is_active ? 'opacity-50' : ''}`}>
                <td className="p-4 font-semibold text-gray-900">{zone.city}</td>
                <td className="p-4 text-gray-600">
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                    {zone.pin_codes?.length} codes
                  </span>
                </td>
                <td className="p-4 text-gray-600">₹{zone.delivery_fee}</td>
                <td className="p-4 text-gray-600">₹{zone.min_order_value}</td>
                <td className="p-4">
                  {zone.is_active ? <span className="text-green-600 font-bold">Yes</span> : <span className="text-gray-400 font-bold">No</span>}
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <Link href={`/admin/delivery-zones/${zone.id}/edit`} className="text-brand-primary hover:underline font-semibold">Edit</Link>
                    <form action={async () => {
                      'use server'
                      await deactivateDeliveryZone(zone.id)
                    }}>
                      <button type="submit" className="text-red-600 hover:underline font-semibold">Deactivate</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {(!zones || zones.length === 0) && (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500">No zones found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
