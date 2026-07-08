import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function OrderConfirmationPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch order, joining addresses and zones
  const { data: order } = await supabase
    .from('orders')
    .select('*, addresses(*), delivery_zones(*)')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (!order) {
    return <div className="p-12 text-center text-xl font-bold">Order not found or access denied.</div>
  }

  // Fetch items
  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id)

  const address = Array.isArray(order.addresses) ? order.addresses[0] : order.addresses

  // Logging email stub (as requested in PRD logic)
  console.log(`[EMAIL STUB] Sending order confirmation for ${order.id} to ${user.email}`)

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-10">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for shopping with FishWale. Your order has been placed successfully.</p>
          <p className="text-sm text-gray-500 mt-2">Order ID: {order.id}</p>
        </div>

        <div className="border-t border-b border-gray-100 py-6 mb-6">
          <h3 className="font-bold text-lg mb-4">Delivery Details</h3>
          <p className="font-semibold">{address.label}</p>
          <p className="text-gray-600 text-sm">{address.address_line1}, {address.address_line2}</p>
          <p className="text-gray-600 text-sm">{address.city}, {address.state} - {address.pin_code}</p>
          <p className="text-brand-primary font-semibold mt-3">Slot: {order.delivery_slot}</p>
        </div>

        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4">Order Items</h3>
          <div className="space-y-3">
            {items?.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <span className="font-semibold">{item.quantity_or_weight}</span> x {item.product_name_snapshot}
                  {item.cut_option && <span className="text-gray-500 ml-2">({item.cut_option})</span>}
                </div>
                <span className="font-semibold">₹{item.line_total}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>Delivery Fee</span>
            <span>₹{order.delivery_fee}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-900">
            <span>Total Paid</span>
            <span>₹{order.total}</span>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/shop" className="text-brand-primary font-semibold hover:underline">
            &larr; Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
