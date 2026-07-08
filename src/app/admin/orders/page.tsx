import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string, payment?: string }> }) {
  const { status, payment } = await searchParams
  const supabase = await createClient()

  let query = supabase.from('orders').select('*, profiles(full_name, phone)').order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (payment) query = query.eq('payment_status', payment)

  const { data: orders } = await query

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <div className="flex gap-4">
          <form method="GET" className="flex gap-2">
            <select name="status" defaultValue={status || ''} className="px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm focus:border-brand-primary">
              <option value="">All Statuses</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="confirmed">Confirmed</option>
              <option value="packed">Packed</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select name="payment" defaultValue={payment || ''} className="px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm focus:border-brand-primary">
              <option value="">All Payment</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
            <button type="submit" className="bg-gray-100 text-gray-800 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-200">Filter</button>
            {(status || payment) && <Link href="/admin/orders" className="px-4 py-2 text-gray-500 hover:underline flex items-center font-semibold">Clear</Link>}
          </form>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">ID</th>
                <th className="p-4 font-semibold text-gray-600">Customer</th>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Total</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map(order => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-mono text-xs">{order.id.split('-')[0]}</td>
                  <td className="p-4 font-semibold text-gray-900">{order.profiles?.full_name || 'Guest'}</td>
                  <td className="p-4 text-gray-600">{new Date(order.created_at).toLocaleString('en-IN')}</td>
                  <td className="p-4 font-semibold">₹{order.total} <br/><span className={`text-xs ${order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>{order.payment_status}</span></td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'cancelled' ? 'bg-red-100 text-red-700' : order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-brand-primary hover:underline font-semibold">Manage</Link>
                  </td>
                </tr>
              ))}
              {(!orders || orders.length === 0) && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
