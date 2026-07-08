import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Footer() {
  const supabase = await createClient()
  const { data: zones } = await supabase.from('delivery_zones').select('*').eq('is_active', true)

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-heading font-bold text-brand-primary tracking-tight mb-4">FishWale</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Premium online fish market delivering fresh river and sea fish directly to your doorstep in Agartala and Tripura.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-100">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-100">Delivery Areas</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {zones?.map(zone => (
                <li key={zone.id}>
                  {zone.city} <span className="opacity-60">(Min: ₹{zone.min_order_value})</span>
                </li>
              ))}
              {(!zones || zones.length === 0) && (
                <li>Agartala (Coming Soon)</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-100">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: support@fishwale.com</li>
              <li>Phone: +91 90000 00000</li>
              <li>Agartala, Tripura, India</li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} FishWale.com. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
