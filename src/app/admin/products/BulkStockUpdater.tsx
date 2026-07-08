'use client'
import { useState } from 'react'
import { bulkUpdateStock, deactivateProduct } from '@/app/actions/adminActions'
import Link from 'next/link'

export default function BulkStockUpdater({ products }: { products: any[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isUpdating, setIsUpdating] = useState(false)

  const toggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(products.map(p => p.id))
    else setSelectedIds([])
  }

  const toggleOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleBulkUpdate = async (status: string) => {
    if (selectedIds.length === 0) return
    setIsUpdating(true)
    try {
      await bulkUpdateStock(selectedIds, status)
      setSelectedIds([])
    } catch (e) {
      alert("Failed to update stock")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this product? Order history will be preserved.')) return
    setIsUpdating(true)
    try {
      await deactivateProduct(id)
    } catch (e) {
      alert("Failed to deactivate")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Bulk actions bar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-4 items-center">
        <span className="text-sm font-semibold text-gray-600">{selectedIds.length} selected</span>
        <select 
          onChange={(e) => {
            if (e.target.value) {
              handleBulkUpdate(e.target.value)
              e.target.value = "" // reset
            }
          }}
          disabled={selectedIds.length === 0 || isUpdating}
          className="text-sm border border-gray-300 rounded-md px-2 py-1.5 outline-none focus:border-brand-primary disabled:opacity-50"
        >
          <option value="">Bulk Update Stock...</option>
          <option value="in_stock">Set In Stock</option>
          <option value="low_stock">Set Low Stock</option>
          <option value="out_of_stock">Set Out of Stock</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-white border-b border-gray-200">
              <th className="p-4 w-12"><input type="checkbox" onChange={toggleAll} checked={selectedIds.length === products.length && products.length > 0} className="rounded cursor-pointer" /></th>
              <th className="p-4 font-semibold text-gray-600">Product</th>
              <th className="p-4 font-semibold text-gray-600">Category</th>
              <th className="p-4 font-semibold text-gray-600">Price</th>
              <th className="p-4 font-semibold text-gray-600">Stock Status</th>
              <th className="p-4 font-semibold text-gray-600">Active</th>
              <th className="p-4 font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className={`border-b border-gray-100 hover:bg-gray-50 ${!p.is_active ? 'opacity-50' : ''}`}>
                <td className="p-4"><input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleOne(p.id)} className="rounded cursor-pointer" /></td>
                <td className="p-4 font-semibold text-gray-900 flex items-center gap-3">
                  {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded border border-gray-200" /> : <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200" />}
                  {p.name}
                </td>
                <td className="p-4 text-gray-600">{p.categories?.name}</td>
                <td className="p-4 font-semibold text-gray-900">₹{p.base_price} <span className="text-gray-400 font-normal">/{p.unit}</span></td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold border ${p.stock_status === 'in_stock' ? 'bg-green-50 text-green-700 border-green-200' : p.stock_status === 'out_of_stock' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                    {p.stock_status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  {p.is_active ? <span className="text-green-600 font-bold">Yes</span> : <span className="text-gray-400 font-bold">No</span>}
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-brand-primary hover:underline font-semibold">Edit</Link>
                    <button onClick={() => handleDelete(p.id)} disabled={isUpdating} className="text-red-600 hover:underline font-semibold disabled:opacity-50">Deactivate</button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-gray-500">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
