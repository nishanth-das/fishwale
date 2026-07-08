import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ReorderButton from './ReorderButton'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
        <Link href="/shop" className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
          Start Shopping
        </Link>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'packed': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold text-gray-900">Order #{order.id.split('-')[0]}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusColor(order.status)}`}>
                  {formatStatus(order.status)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">
                {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-sm text-gray-600">
                {order.order_items?.length} {order.order_items?.length === 1 ? 'item' : 'items'} • ₹{order.total}
              </p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <Link href={`/account/orders/${order.id}`} className="flex-1 md:flex-none px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:border-brand-primary hover:text-brand-primary transition-colors text-center">
                View Details
              </Link>
              <ReorderButton orderItems={order.order_items} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
