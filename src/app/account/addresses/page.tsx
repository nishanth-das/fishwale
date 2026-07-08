import { createClient } from '@/lib/supabase/server'
import AddressForm from './AddressForm'
import AddressList from './AddressList'

export const dynamic = 'force-dynamic'

export default async function AddressesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <AddressList addresses={addresses || []} />
        <AddressForm />
      </div>
    </div>
  )
}
