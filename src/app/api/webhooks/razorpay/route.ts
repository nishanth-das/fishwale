import { NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET!

    if (!secret) return NextResponse.json({ error: 'Missing webhook secret' }, { status: 500 })

    const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex')

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity
      const razorpay_order_id = payment.order_id
      
      const { data: order } = await supabaseAdmin.from('orders').update({
        payment_status: 'paid',
        status: 'confirmed',
        razorpay_payment_id: payment.id
      }).eq('razorpay_order_id', razorpay_order_id).eq('payment_status', 'pending').select().single()
      
      if (order && order.coupon_code) {
        const { data: coupon } = await supabaseAdmin.from('coupons').select('times_used').eq('code', order.coupon_code).single()
        if (coupon) {
          await supabaseAdmin.from('coupons').update({ times_used: coupon.times_used + 1 }).eq('code', order.coupon_code)
        }
      }
    }

    if (event.event === 'payment.failed') {
      const payment = event.payload.payment.entity
      const razorpay_order_id = payment.order_id
      
      await supabaseAdmin.from('orders').update({
        payment_status: 'failed',
      }).eq('razorpay_order_id', razorpay_order_id).eq('payment_status', 'pending')
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
