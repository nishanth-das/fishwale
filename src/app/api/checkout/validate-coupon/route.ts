import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json()
    if (!code) return NextResponse.json({ error: 'Coupon code required' }, { status: 400 })

    const supabase = await createClient()
    const { data: coupon } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (!coupon) return NextResponse.json({ error: 'Invalid or inactive coupon' }, { status: 400 })

    if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
      return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 })
    }

    if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
      return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 })
    }

    if (subtotal < coupon.min_order_value) {
      return NextResponse.json({ error: `Minimum order value for this coupon is ₹${coupon.min_order_value}` }, { status: 400 })
    }

    let discount = 0
    if (coupon.discount_type === 'percentage') {
      discount = (subtotal * coupon.discount_value) / 100
    } else {
      discount = coupon.discount_value
    }

    // Cap discount to subtotal
    discount = Math.min(discount, subtotal)

    return NextResponse.json({ discount, code: coupon.code })
  } catch(e: any) {
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 })
  }
}
