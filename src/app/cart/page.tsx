'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { useEffect, useState } from 'react'

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="min-h-screen bg-gray-50"></div>

  const subtotal = items.reduce((sum, item) => sum + (item.product.base_price * item.quantity), 0)

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <svg className="w-24 h-24 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added any fresh catch to your cart yet.</p>
        <Link href="/shop" className="px-8 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-red-700 transition-colors">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            {items.map(item => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                  <Image src={item.product.images?.[0] || '/images/placeholder.jpg'} alt={item.product.name} fill className="object-cover" />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-gray-900">{item.product.name}</h3>
                  <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                    {item.weight_selection && <span className="bg-gray-100 px-2 py-1 rounded">{item.weight_selection}</span>}
                    {item.cut_selection && <span className="bg-gray-100 px-2 py-1 rounded">{item.cut_selection}</span>}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-3 py-1 text-gray-600 hover:bg-gray-50">-</button>
                      <span className="px-3 py-1 font-semibold border-x border-gray-300">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-50">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-sm text-red-500 hover:text-red-700 font-semibold underline">Remove</button>
                  </div>
                </div>
                
                <div className="text-xl font-bold text-gray-900">
                  ₹{item.product.base_price * item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-gray-600 mb-6 border-b border-gray-200 pb-6">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-semibold text-gray-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-sm text-gray-500">Calculated at checkout</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end mb-8">
              <span className="text-lg font-bold text-gray-900">Estimated Total</span>
              <span className="text-2xl font-bold text-gray-900">₹{subtotal}</span>
            </div>
            
            <Link href="/checkout" className="block w-full py-4 text-center bg-brand-primary text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
