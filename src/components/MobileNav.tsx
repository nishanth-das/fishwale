'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useEffect, useState } from 'react'

export default function MobileNav() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const cartItemsCount = useCartStore(state => state.items.reduce((acc, item) => acc + item.quantity, 0))

  useEffect(() => setMounted(true), [])

  const navItems = [
    { 
      name: 'Home', 
      href: '/', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ) 
    },
    { 
      name: 'Categories', 
      href: '/shop', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ) 
    },
    { 
      name: 'Search', 
      href: '/search', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ) 
    },
    { 
      name: 'Cart', 
      href: '/cart', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      badge: true
    },
    { 
      name: 'Account', 
      href: '/account', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ) 
    },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[60] px-2 pt-2 pb-4 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {navItems.map(item => {
        // active state logic
        let isActive = false
        if (item.href === '/') {
          isActive = pathname === '/'
        } else {
          isActive = pathname?.startsWith(item.href) || false
        }
        
        return (
          <Link key={item.name} href={item.href} className={`flex flex-col items-center justify-center w-full relative pt-1 pb-1 ${isActive ? 'text-brand-primary' : 'text-gray-500 hover:text-brand-primary transition-colors'}`}>
            <div className="relative">
              {item.icon}
              {item.badge && mounted && cartItemsCount > 0 ? (
                <span className="absolute top-0 right-0 -mt-1.5 -mr-2.5 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[10px] font-bold leading-none text-white bg-brand-primary rounded-full shadow-sm border-2 border-white">
                  {cartItemsCount}
                </span>
              ) : null}
            </div>
            <span className={`text-[10px] font-medium mt-1 transition-colors ${isActive ? 'font-bold' : ''}`}>{item.name}</span>
          </Link>
        )
      })}
    </div>
  )
}
