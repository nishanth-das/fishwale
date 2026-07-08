import { NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, order_id } = await request.json()

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: 'Razorpay secret missing' }, { status: 500 })
    }

    const secret = process.env.RAZORPAY_KEY_SECRET
    const generated_signature = crypto.createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex')

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await supabaseAdmin.from('orders').update({
      payment_status: 'paid',
      status: 'confirmed',
      razorpay_payment_id
    }).eq('id', order_id).eq('payment_status', 'pending')

    return NextResponse.json({ success: true })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
