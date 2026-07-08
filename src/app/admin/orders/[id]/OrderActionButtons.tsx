'use client'
import { useState } from 'react'
import { updateOrderStatus, refundOrder } from '@/app/actions/adminActions'

export default function OrderActionButtons({ order }: { order: any }) {
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (status: string) => {
    setLoading(true)
    try {
      await updateOrderStatus(order.id, status)
    } catch(e) {
      alert("Failed to update status")
    } finally {
      setLoading(false)
    }
  }

  const handleRefund = async () => {
    if (!confirm('Are you sure you want to refund this order via Razorpay? This cannot be undone.')) return
    setLoading(true)
    try {
      await refundOrder(order.id, order.razorpay_payment_id, order.total)
      alert("Refund successful!")
    } catch(e: any) {
      alert(e.message || "Refund failed")
    } finally {
      setLoading(false)
    }
  }

  const statuses = ['pending_payment', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled']

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="font-bold text-lg mb-4">Update Order Status</h2>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            disabled={loading || order.status === s || (order.status === 'cancelled' && s !== 'cancelled')}
            className={`px-4 py-2 rounded text-sm font-semibold border ${order.status === s ? 'bg-brand-primary text-white border-brand-primary shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50'}`}
          >
            {s.replace(/_/g, ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {order.payment_status === 'paid' && order.status !== 'cancelled' && order.razorpay_payment_id && (
        <div className="border-t border-red-100 bg-red-50 p-4 -mx-6 -mb-6 rounded-b-xl flex items-center justify-between">
          <div>
            <h3 className="font-bold text-red-800 text-sm">Issue Refund</h3>
            <p className="text-xs text-red-600">Cancel the order and refund ₹{order.total} to the customer.</p>
          </div>
          <button 
            onClick={handleRefund} 
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-700 disabled:opacity-50 shadow-sm transition-colors"
          >
            Refund via Razorpay
          </button>
        </div>
      )}
    </div>
  )
}
