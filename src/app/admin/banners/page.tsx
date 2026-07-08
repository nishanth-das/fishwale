import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { deleteBanner } from '@/app/actions/adminActions'

export const dynamic = 'force-dynamic'

export default async function BannersPage() {
  const supabase = await createClient()
  const { data: banners } = await supabase.from('banners').select('*').order('sort_order')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Homepage Banners</h1>
        <Link href="/admin/banners/new" className="bg-brand-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
          + Add Banner
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">Preview</th>
                <th className="p-4 font-semibold text-gray-600">Title / Link</th>
                <th className="p-4 font-semibold text-gray-600">Schedule</th>
                <th className="p-4 font-semibold text-gray-600">Sort</th>
                <th className="p-4 font-semibold text-gray-600">Active</th>
                <th className="p-4 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {banners?.map(b => (
                <tr key={b.id} className={`border-b border-gray-100 hover:bg-gray-50 ${!b.is_active ? 'opacity-50' : ''}`}>
                  <td className="p-4">
                    <img src={b.image_url} alt="" className="w-24 h-12 object-cover rounded border border-gray-200 bg-gray-100" />
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">{b.title || 'Untitled'}</div>
                    <div className="text-xs text-gray-500 max-w-[200px] truncate">{b.link || 'No Link'}</div>
                  </td>
                  <td className="p-4 text-xs text-gray-600 space-y-1">
                    <div>From: {b.active_from ? new Date(b.active_from).toLocaleDateString() : 'Always'}</div>
                    <div>To: {b.active_to ? new Date(b.active_to).toLocaleDateString() : 'Forever'}</div>
                  </td>
                  <td className="p-4 text-gray-600">{b.sort_order}</td>
                  <td className="p-4">
                    {b.is_active ? <span className="text-green-600 font-bold">Yes</span> : <span className="text-gray-400 font-bold">No</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <Link href={`/admin/banners/${b.id}/edit`} className="text-brand-primary hover:underline font-semibold">Edit</Link>
                      <form action={async () => {
                        'use server'
                        await deleteBanner(b.id)
                      }}>
                        <button type="submit" className="text-red-600 hover:underline font-semibold">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {(!banners || banners.length === 0) && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No banners found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
