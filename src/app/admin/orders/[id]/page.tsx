import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import OrderActionButtons from './OrderActionButtons'

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, profiles(full_name, phone), addresses(*)')
    .eq('id', id)
    .single()

  if (!order) return notFound()

  const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order.id)
  const address = Array.isArray(order.addresses) ? order.addresses[0] : order.addresses

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="text-gray-500 hover:text-brand-primary font-semibold">&larr; Back</Link>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.split('-')[0]}</h1>
        </div>
        <Link target="_blank" href={`/admin/orders/${order.id}/invoice`} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-50 flex items-center gap-2 text-sm shadow-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Print Invoice
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-lg mb-4">Order Items</h2>
            <div className="space-y-4">
              {items?.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-semibold">{item.product_name_snapshot}</p>
                    <p className="text-gray-500">{item.quantity_or_weight} {item.cut_option ? `• ${item.cut_option}` : ''}</p>
                  </div>
                  <p className="font-bold">₹{item.line_total}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-gray-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
              <div className="flex justify-between text-gray-600"><span>Delivery Fee</span><span>₹{order.delivery_fee}</span></div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2"><span>Total</span><span>₹{order.total}</span></div>
            </div>
          </div>

          <OrderActionButtons order={order} />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-lg mb-4">Customer Details</h2>
            <p className="font-semibold text-gray-900">{order.profiles?.full_name || 'Guest'}</p>
            <p className="text-gray-600 text-sm mt-1">{order.profiles?.phone}</p>
            <hr className="my-4 border-gray-100" />
            <h3 className="font-semibold text-xs mb-2 text-gray-500 uppercase tracking-wider">Delivery Address</h3>
            <p className="font-semibold text-sm">{address.label}</p>
            <p className="text-gray-600 text-sm">{address.address_line1}</p>
            {address.address_line2 && <p className="text-gray-600 text-sm">{address.address_line2}</p>}
            <p className="text-gray-600 text-sm">{address.city} - {address.pin_code}</p>
            <p className="mt-3 text-sm font-semibold text-brand-primary bg-brand-primary/10 inline-block px-2 py-1 rounded">Slot: {order.delivery_slot}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-lg mb-4">Payment Information</h2>
            <p className="text-sm flex justify-between mb-2">
              <span className="text-gray-500">Method</span>
              <span className="font-semibold uppercase">{order.payment_method}</span>
            </p>
            <p className="text-sm flex justify-between mb-2">
              <span className="text-gray-500">Status</span>
              <span className={`font-semibold capitalize ${order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>{order.payment_status}</span>
            </p>
            {order.razorpay_payment_id && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Razorpay Payment ID</p>
                <p className="font-mono text-xs text-gray-900 break-all bg-gray-50 p-2 rounded border border-gray-200">{order.razorpay_payment_id}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
