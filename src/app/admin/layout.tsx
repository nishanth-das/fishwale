import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  // We rely on middleware for protection, but we fetch profile here for the top bar
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const links = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/categories', label: 'Categories' },
    { href: '/admin/delivery-zones', label: 'Delivery Zones' },
    { href: '/admin/coupons', label: 'Coupons' },
    { href: '/admin/banners', label: 'Banners' },
    { href: '/admin/messages', label: 'Messages' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 bg-gray-950 flex items-center justify-between">
          <Link href="/admin" className="text-xl font-bold font-heading text-white tracking-tight">
            FishWale <span className="text-brand-primary">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="block px-4 py-2 rounded text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <p className="text-sm text-gray-400">Logged in as</p>
          <p className="font-semibold">{profile?.full_name}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-end">
          <a href="/" className="text-sm text-gray-600 hover:text-brand-primary font-semibold flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Store
          </a>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
