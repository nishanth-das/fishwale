'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
    
  if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
    throw new Error('Forbidden')
  }
  return supabase
}

// Category Actions
export async function addCategory(formData: FormData) {
  const supabase = await requireAdmin()
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const sort_order = parseInt(formData.get('sort_order') as string || '0')

  const { error } = await supabase.from('categories').insert({ name, slug, sort_order })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/categories')
}

export async function deleteCategory(id: string) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/categories')
}

// Product Actions
export async function saveProduct(id: string | null, formData: FormData) {
  const supabase = await requireAdmin()
  
  const productData = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    category_id: formData.get('category_id') as string,
    description: formData.get('description') as string,
    pricing_type: formData.get('pricing_type') as string,
    base_price: parseFloat(formData.get('base_price') as string),
    unit: formData.get('unit') as string,
    is_active: formData.get('is_active') === 'on',
    is_bestseller: formData.get('is_bestseller') === 'on',
    stock_status: formData.get('stock_status') as string,
    images: (formData.get('images') as string).split(',').map(s => s.trim()).filter(Boolean),
    cut_options: (formData.get('cut_options') as string).split(',').map(s => s.trim()).filter(Boolean),
  }

  if (id) {
    const { error } = await supabase.from('products').update(productData).eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('products').insert(productData)
    if (error) throw new Error(error.message)
  }
  revalidatePath('/admin/products')
  revalidatePath('/shop')
}

export async function deactivateProduct(id: string) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('products').update({ is_active: false }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
  revalidatePath('/shop')
}

export async function bulkUpdateStock(productIds: string[], stock_status: string) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('products').update({ stock_status }).in('id', productIds)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
}

// Order Actions
export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
  if (error) throw new Error(error.message)
  
  console.log(`[EMAIL SIMULATION] Sent order status update email for Order ${orderId}: New Status is ${status}`)
  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/orders')
}

export async function refundOrder(orderId: string, paymentId: string, amount: number) {
  const supabase = await requireAdmin()
  
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys not configured')
  }

  try {
    const res = await fetch('https://api.razorpay.com/v1/payments/' + paymentId + '/refund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(process.env.RAZORPAY_KEY_ID + ':' + process.env.RAZORPAY_KEY_SECRET).toString('base64')
      },
      body: JSON.stringify({ amount: amount * 100 }) // amount in paise
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error.description || 'Refund failed at Razorpay')
    }

    const { error } = await supabase.from('orders').update({ 
      payment_status: 'refunded',
      status: 'cancelled' // also cancel the order since it's refunded
    }).eq('id', orderId)

    if (error) throw new Error(error.message)
    
    revalidatePath(`/admin/orders/${orderId}`)
    revalidatePath('/admin/orders')
  } catch(e: any) {
    throw new Error(e.message)
  }
}

// Phase 6 Actions
export async function saveDeliveryZone(id: string | null, formData: FormData) {
  const supabase = await requireAdmin()
  const zoneData = {
    city: formData.get('city') as string,
    pin_codes: (formData.get('pin_codes') as string).split(',').map(s => s.trim()).filter(Boolean),
    delivery_fee: parseFloat(formData.get('delivery_fee') as string),
    min_order_value: parseFloat(formData.get('min_order_value') as string),
    is_active: formData.get('is_active') === 'on'
  }
  if (id) {
    const { error } = await supabase.from('delivery_zones').update(zoneData).eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('delivery_zones').insert(zoneData)
    if (error) throw new Error(error.message)
  }
  revalidatePath('/admin/delivery-zones')
}

export async function deactivateDeliveryZone(id: string) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('delivery_zones').update({ is_active: false }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/delivery-zones')
}

export async function saveCoupon(id: string | null, formData: FormData) {
  const supabase = await requireAdmin()
  const expiryRaw = formData.get('expiry') as string
  const usageLimitRaw = formData.get('usage_limit') as string
  const couponData = {
    code: (formData.get('code') as string).toUpperCase().trim(),
    discount_type: formData.get('discount_type') as string,
    discount_value: parseFloat(formData.get('discount_value') as string),
    min_order_value: parseFloat(formData.get('min_order_value') as string || '0'),
    expiry: expiryRaw ? new Date(expiryRaw).toISOString() : null,
    usage_limit: usageLimitRaw ? parseInt(usageLimitRaw) : null,
    is_active: formData.get('is_active') === 'on'
  }
  if (id) {
    const { error } = await supabase.from('coupons').update(couponData).eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('coupons').insert(couponData)
    if (error) throw new Error(error.message)
  }
  revalidatePath('/admin/coupons')
}

export async function deactivateCoupon(id: string) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('coupons').update({ is_active: false }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/coupons')
}

export async function saveBanner(id: string | null, formData: FormData) {
  const supabase = await requireAdmin()
  const activeFromRaw = formData.get('active_from') as string
  const activeToRaw = formData.get('active_to') as string
  const bannerData = {
    image_url: formData.get('image_url') as string,
    title: formData.get('title') as string,
    link: formData.get('link') as string,
    sort_order: parseInt(formData.get('sort_order') as string || '0'),
    active_from: activeFromRaw ? new Date(activeFromRaw).toISOString() : null,
    active_to: activeToRaw ? new Date(activeToRaw).toISOString() : null,
    is_active: formData.get('is_active') === 'on'
  }
  if (id) {
    const { error } = await supabase.from('banners').update(bannerData).eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('banners').insert(bannerData)
    if (error) throw new Error(error.message)
  }
  revalidatePath('/admin/banners')
  revalidatePath('/')
}

export async function deleteBanner(id: string) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('banners').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/banners')
  revalidatePath('/')
}
