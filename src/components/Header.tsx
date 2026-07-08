'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import LogoutButton from './LogoutButton'
import { useCartStore } from '@/store/cartStore'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  const cartItemsCount = useCartStore(state => state.items.reduce((acc, item) => acc + item.quantity, 0))
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    setMounted(true)
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => authListener.subscription.unsubscribe()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Primary Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="FishWale" width={160} height={48} className="h-10 w-auto object-contain" priority />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/shop" className="text-sm font-semibold text-gray-700 hover:text-brand-primary transition-colors">Shop All</Link>
              <Link href="/shop/river-fish" className="text-sm font-semibold text-gray-700 hover:text-brand-primary transition-colors">River Fish</Link>
              <Link href="/shop/sea-fish" className="text-sm font-semibold text-gray-700 hover:text-brand-primary transition-colors">Sea Fish</Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative group">
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for fresh fish, cuts..." 
                className="w-full bg-gray-50 text-sm rounded-full pl-5 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:bg-white border border-gray-200 focus:border-brand-primary/30 transition-all shadow-inner"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Auth & Cart */}
          <div className="flex items-center gap-5">
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/account" className="text-sm font-semibold text-gray-700 hover:text-brand-primary transition-colors hidden sm:block">
                  Account
                </Link>
                <div className="hidden sm:block"><LogoutButton /></div>
              </div>
            ) : (
              <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-brand-primary transition-colors">
                Log In
              </Link>
            )}

            <div className="h-6 w-px bg-gray-200 mx-1"></div>

            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-brand-primary transition-colors group">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-primary rounded-full shadow-sm">
                {mounted ? cartItemsCount : 0}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
