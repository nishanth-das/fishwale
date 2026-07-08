import { createClient } from '@/lib/supabase/server'
import CouponForm from '../../CouponForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: coupon } = await supabase.from('coupons').select('*').eq('id', id).single()

  if (!coupon) return notFound()

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/coupons" className="text-gray-500 hover:text-brand-primary font-semibold">&larr; Back</Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Coupon: {coupon.code}</h1>
      </div>
      <CouponForm initialData={coupon} />
    </div>
  )
}
