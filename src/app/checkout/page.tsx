import { createClient } from '@/lib/supabase/server'
import CheckoutClient from './CheckoutClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login?redirect=/checkout')
  }

  // Fetch user addresses
  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)

  // Fetch active delivery zones
  const { data: zones } = await supabase
    .from('delivery_zones')
    .select('*')
    .eq('is_active', true)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8">Checkout</h1>
      <CheckoutClient initialAddresses={addresses || []} zones={zones || []} user={user} />
    </div>
  )
}
