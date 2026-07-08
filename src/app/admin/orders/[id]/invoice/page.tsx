import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase.from('orders').select('*, profiles(full_name, phone), addresses(*)').eq('id', id).single()
  if (!order) return notFound()

  const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order.id)
  const address = Array.isArray(order.addresses) ? order.addresses[0] : order.addresses

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white min-h-screen text-gray-900" style={{ fontFamily: 'sans-serif' }}>
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-red-600">FishWale</h1>
          <p className="text-gray-500 text-sm">Premium Online Fish Market</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-400 uppercase tracking-widest mb-1">Packing Slip</h2>
          <p className="font-mono font-semibold">#{order.id.split('-')[0]}</p>
          <p className="text-sm mt-1">Date: {new Date(order.created_at).toLocaleDateString('en-IN')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-12">
        <div>
          <h3 className="font-bold text-sm text-gray-500 uppercase mb-2">Ship To:</h3>
          <p className="font-semibold">{address.label}</p>
          <p className="text-sm">{address.address_line1}</p>
          {address.address_line2 && <p className="text-sm">{address.address_line2}</p>}
          <p className="text-sm">{address.city} - {address.pin_code}</p>
          <p className="text-sm mt-2 font-semibold">Phone: {order.profiles?.phone || 'N/A'}</p>
        </div>
        <div className="text-right border-l pl-8 border-gray-200">
          <h3 className="font-bold text-sm text-gray-500 uppercase mb-2">Delivery Details:</h3>
          <p className="font-semibold">{order.delivery_slot}</p>
          <p className="text-sm mt-4 font-semibold uppercase">{order.payment_method} - {order.payment_status}</p>
        </div>
      </div>

      <table className="w-full text-left mb-12">
        <thead>
          <tr className="border-b-2 border-gray-900">
            <th className="py-2 font-bold uppercase text-sm">Item</th>
            <th className="py-2 font-bold uppercase text-sm text-right">Qty/Weight</th>
            <th className="py-2 font-bold uppercase text-sm text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {items?.map(item => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="py-3">
                <p className="font-semibold">{item.product_name_snapshot}</p>
                {item.cut_option && <p className="text-xs text-gray-500 mt-0.5">Cut: {item.cut_option}</p>}
              </td>
              <td className="py-3 text-right font-medium">{item.quantity_or_weight}</td>
              <td className="py-3 text-right">₹{item.line_total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
          <div className="flex justify-between text-sm"><span>Delivery</span><span>₹{order.delivery_fee}</span></div>
          <div className="flex justify-between text-xl font-bold pt-2 border-t-2 border-gray-900 mt-2">
            <span>Total</span><span>₹{order.total}</span>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center text-sm text-gray-400">
        <p>Thank you for shopping with FishWale!</p>
      </div>

      <script dangerouslySetInnerHTML={{ __html: 'window.print();' }} />
    </div>
  )
}
