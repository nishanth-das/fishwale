import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: lowStockProducts } = await supabase
    .from('products')
    .select('id, name, stock_status, base_price')
    .neq('stock_status', 'in_stock')
    .eq('is_active', true)

  const { data: allOrders } = await supabase
    .from('orders')
    .select('status, total, created_at, payment_status')

  let todaysRevenue = 0
  let todaysCount = 0
  const statusCounts: Record<string, number> = {
    pending_payment: 0,
    confirmed: 0,
    packed: 0,
    out_for_delivery: 0,
    delivered: 0,
    cancelled: 0,
  }

  allOrders?.forEach(order => {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
    
    if (new Date(order.created_at) >= today) {
      todaysCount++
      if (order.status !== 'cancelled' && order.payment_status === 'paid') {
        todaysRevenue += Number(order.total)
      }
    }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-semibold text-gray-500 uppercase">Today's Orders</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{todaysCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-semibold text-gray-500 uppercase">Today's Revenue</p>
          <p className="text-3xl font-bold text-brand-primary mt-2">₹{todaysRevenue}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-semibold text-gray-500 uppercase">Pending / Confirmed</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{statusCounts['pending_payment']} / {statusCounts['confirmed']}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-semibold text-gray-500 uppercase">Out for Delivery</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{statusCounts['out_for_delivery']}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-brand-primary hover:underline font-semibold">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-600">Order ID</th>
                  <th className="p-4 font-semibold text-gray-600">Date</th>
                  <th className="p-4 font-semibold text-gray-600">Total</th>
                  <th className="p-4 font-semibold text-gray-600">Status</th>
                  <th className="p-4 font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders?.map(order => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-mono text-xs">{order.id.split('-')[0]}</td>
                    <td className="p-4 text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="p-4 font-semibold">₹{order.total}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/orders/${order.id}`} className="text-brand-primary hover:underline font-semibold">Manage</Link>
                    </td>
                  </tr>
                ))}
                {(!recentOrders || recentOrders.length === 0) && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-red-50">
            <h2 className="font-bold text-red-800 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Stock Alerts
            </h2>
          </div>
          <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
            {lowStockProducts?.map(product => (
              <div key={product.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                  <p className={`text-xs font-bold mt-1 ${product.stock_status === 'out_of_stock' ? 'text-red-600' : 'text-orange-500'}`}>
                    {product.stock_status.replace(/_/g, ' ').toUpperCase()}
                  </p>
                </div>
                <Link href={`/admin/products/${product.id}/edit`} className="text-xs text-gray-500 border border-gray-200 px-2 py-1 rounded hover:bg-gray-50">
                  Edit
                </Link>
              </div>
            ))}
            {(!lowStockProducts || lowStockProducts.length === 0) && (
              <div className="p-8 text-center text-gray-500 text-sm">All products are in stock!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
