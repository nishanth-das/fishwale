import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Delivery Areas | FishWale',
  description: 'Check out the list of areas and pin codes where FishWale delivers premium fresh fish in Tripura.',
}

export const revalidate = 3600 // Revalidate every hour

export default async function DeliveryAreasPage() {
  const supabase = await createClient()
  
  const { data: zones } = await supabase
    .from('delivery_zones')
    .select('*')
    .eq('is_active', true)
    .order('city')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4 text-center">Delivery Areas</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        We are constantly expanding our delivery network. Check below to see if we currently deliver to your area in Tripura.
      </p>

      {zones && zones.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {zones.map((zone) => (
            <div key={zone.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-brand-primary transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {zone.city}
              </h2>
              
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Serviced Pin Codes</h3>
                <div className="flex flex-wrap gap-2">
                  {zone.pin_codes.map((pin: string) => (
                    <span key={pin} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-mono font-medium">
                      {pin}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4 text-sm text-gray-600 border-t pt-4">
                <div>
                  <span className="font-semibold block text-gray-900">Delivery Fee</span>
                  {zone.delivery_fee === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${zone.delivery_fee}`}
                </div>
                <div>
                  <span className="font-semibold block text-gray-900">Min Order</span>
                  ₹{zone.min_order_value}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">We are currently updating our delivery zones. Please check back later.</p>
        </div>
      )}

      <div className="mt-16 text-center bg-brand-primary/5 p-8 rounded-xl border border-brand-primary/20">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Don't see your area?</h3>
        <p className="text-gray-600 mb-4">We are rapidly expanding! More cities and pin codes in Tripura are coming soon.</p>
      </div>
    </div>
  )
}
