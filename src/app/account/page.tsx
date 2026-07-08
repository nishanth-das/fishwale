import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AccountDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch recent order count just for summary
  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {profile?.full_name || 'User'}!</h2>
        <p className="text-gray-600">Manage your fresh fish orders, track deliveries, and update your addresses here.</p>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Profile Details</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium text-gray-900">Name:</span> {profile?.full_name || 'Not set'}</p>
              <p><span className="font-medium text-gray-900">Email:</span> {user.email}</p>
              <p><span className="font-medium text-gray-900">Phone:</span> {profile?.phone || 'Not set'}</p>
            </div>
          </div>
          
          <div className="p-6 bg-brand-primary/5 rounded-xl border border-brand-primary/20 flex flex-col justify-center items-center text-center">
            <h3 className="text-3xl font-bold text-brand-primary mb-2">{ordersCount || 0}</h3>
            <p className="text-sm text-gray-600 mb-4">Total Orders Placed</p>
            <Link href="/account/orders" className="text-sm font-semibold text-brand-primary hover:underline">
              View Order History &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
