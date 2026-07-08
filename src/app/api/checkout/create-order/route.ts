import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Razorpay from 'razorpay'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { items, address_id, zone_id, delivery_slot, coupon_code } = await request.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Missing service role key in env' }, { status: 500 })
    }

    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: zone } = await supabaseAdmin.from('delivery_zones').select('*').eq('id', zone_id).single()
    if (!zone) return NextResponse.json({ error: 'Invalid zone' }, { status: 400 })

    let subtotal = 0
    const orderItemsToInsert = []

    for (const item of items) {
      const { data: product } = await supabaseAdmin.from('products').select('*').eq('id', item.product.id).single()
      if (!product || !product.is_active || product.stock_status === 'out_of_stock') {
        return NextResponse.json({ error: `${item.product.name} is out of stock or unavailable.` }, { status: 400 })
      }
      
      const lineTotal = product.base_price * item.quantity
      subtotal += lineTotal
      
      orderItemsToInsert.push({
        product_id: product.id,
        product_name_snapshot: product.name,
        quantity_or_weight: item.weight_selection || item.quantity.toString(),
        cut_option: item.cut_selection,
        unit_price: product.base_price,
        line_total: lineTotal
      })
    }

    if (subtotal < zone.min_order_value) {
      return NextResponse.json({ error: 'Below minimum order value.' }, { status: 400 })
    }

    let discount = 0
    let validCouponCode = null

    if (coupon_code) {
      const { data: coupon } = await supabaseAdmin.from('coupons').select('*').eq('code', coupon_code.toUpperCase()).eq('is_active', true).single()
      if (coupon) {
        const isExpired = coupon.expiry && new Date(coupon.expiry) < new Date()
        const isExceeded = coupon.usage_limit && coupon.times_used >= coupon.usage_limit
        const isBelowMin = subtotal < coupon.min_order_value

        if (!isExpired && !isExceeded && !isBelowMin) {
          validCouponCode = coupon.code
          if (coupon.discount_type === 'percentage') {
            discount = (subtotal * coupon.discount_value) / 100
          } else {
            discount = coupon.discount_value
          }
          discount = Math.min(discount, subtotal)
        }
      }
    }

    const total = subtotal + zone.delivery_fee - discount

    const { data: order, error: orderError } = await supabaseAdmin.from('orders').insert({
      user_id: user.id,
      address_id,
      zone_id,
      delivery_slot,
      subtotal,
      delivery_fee: zone.delivery_fee,
      discount,
      coupon_code: validCouponCode,
      total,
      status: 'pending_payment',
      payment_status: 'pending'
    }).select().single()

    if (orderError) throw orderError

    const itemsWithOrderId = orderItemsToInsert.map(i => ({ ...i, order_id: order.id }))
    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(itemsWithOrderId)
    if (itemsError) throw itemsError

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: 'Razorpay keys missing in environment.' }, { status: 500 })
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: 'INR',
      receipt: order.id,
    })

    await supabaseAdmin.from('orders').update({ razorpay_order_id: rzpOrder.id }).eq('id', order.id)

    return NextResponse.json({
      order_id: order.id,
      razorpay_order_id: rzpOrder.id,
      amount: rzpOrder.amount,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    })

  } catch (error: any) {
    console.error('Create Order Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
