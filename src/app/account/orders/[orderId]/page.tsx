import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ReorderButton from '../ReorderButton'

export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: order } = await supabase
    .from('orders')
    .select('*, addresses(*), delivery_zones(*)')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (!order) {
    return <div className="p-12 text-center text-xl font-bold bg-white rounded-2xl shadow-sm border border-gray-100">Order not found.</div>
  }

  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id)

  const address = Array.isArray(order.addresses) ? order.addresses[0] : order.addresses

  const statuses = ['pending_payment', 'confirmed', 'packed', 'out_for_delivery', 'delivered']
  const isCancelled = order.status === 'cancelled'
  const currentStep = statuses.indexOf(order.status)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Order #{order.id.split('-')[0]}</h2>
        <Link href="/account/orders" className="text-brand-primary text-sm font-semibold hover:underline">&larr; Back to Orders</Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        
        {/* Stepper */}
        <div className="mb-10">
          {isCancelled ? (
            <div className="p-4 bg-red-50 text-red-700 font-bold rounded-lg text-center border border-red-100">
              This order was cancelled.
            </div>
          ) : (
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0 rounded-full"></div>
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-primary z-0 rounded-full transition-all"
                style={{ width: `${(Math.max(0, currentStep) / (statuses.length - 1)) * 100}%` }}
              ></div>
              
              {statuses.map((status, index) => {
                const isActive = index <= currentStep
                return (
                  <div key={status} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 ${isActive ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white border-gray-300 text-gray-300'}`}>
                      {isActive && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-semibold hidden sm:block ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                      {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-t border-b border-gray-100 py-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Delivery Details</h3>
            <p className="font-semibold">{address.label}</p>
            <p className="text-gray-600 text-sm">{address.address_line1}, {address.address_line2}</p>
            <p className="text-gray-600 text-sm">{address.city}, {address.state} - {address.pin_code}</p>
            <p className="text-brand-primary font-semibold mt-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {order.delivery_slot}
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Payment Info</h3>
            <p className="text-gray-600 text-sm mb-1">Status: <span className="font-semibold text-gray-900 capitalize">{order.payment_status}</span></p>
            {order.razorpay_payment_id && <p className="text-gray-600 text-sm">Transaction ID: {order.razorpay_payment_id}</p>}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4">Order Items</h3>
          <div className="space-y-3">
            {items?.map(item => (
              <div key={item.id} className="flex justify-between text-sm items-center">
                <div className="flex-1">
                  <span className="font-semibold">{item.quantity_or_weight}</span> x {item.product_name_snapshot}
                  {item.cut_option && <span className="text-gray-500 ml-2 bg-gray-100 px-2 py-0.5 rounded text-xs">{item.cut_option}</span>}
                </div>
                <span className="font-semibold text-gray-900">₹{item.line_total}</span>
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

        <div className="mt-8 flex justify-end">
          <ReorderButton orderItems={items || []} />
        </div>
      </div>
    </div>
  )
}
