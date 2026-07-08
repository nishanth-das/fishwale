import { createClient } from '@/lib/supabase/server'
import { addCategory, deleteCategory } from '@/app/actions/adminActions'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">Name</th>
                <th className="p-4 font-semibold text-gray-600">Slug</th>
                <th className="p-4 font-semibold text-gray-600">Sort Order</th>
                <th className="p-4 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories?.map(cat => (
                <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-900">{cat.name}</td>
                  <td className="p-4 font-mono text-gray-500">{cat.slug}</td>
                  <td className="p-4 text-gray-600">{cat.sort_order}</td>
                  <td className="p-4">
                    <form action={async () => {
                      'use server'
                      await deleteCategory(cat.id)
                    }}>
                      <button type="submit" className="text-red-600 hover:underline font-semibold">Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
              {(!categories || categories.length === 0) && (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">No categories found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-6">
            <h2 className="font-bold text-gray-900 mb-4">Add Category</h2>
            <form action={addCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" name="name" required className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input type="text" name="slug" required className="w-full p-2 border rounded font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input type="number" name="sort_order" defaultValue="0" className="w-full p-2 border rounded" />
              </div>
              <button type="submit" className="w-full bg-brand-primary text-white py-2 rounded font-bold hover:bg-red-700 transition-colors">Add</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
