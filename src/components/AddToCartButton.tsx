'use client'
import { useState } from 'react'
import type { Database } from '@/types/supabase'

type Product = Database['public']['Tables']['products']['Row']

interface AddToCartButtonProps {
  product: Product
  disabled?: boolean
}

export default function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const [showToast, setShowToast] = useState(false)

  const handleAdd = () => {
    // In Phase 3, this will actually persist to a cart context/DB.
    // For now, it's just a UI stub.
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
    
    // Dispatch a custom event to update the header cart badge (stub behavior)
    window.dispatchEvent(new CustomEvent('cart-updated'))
  }

  return (
    <>
      <button 
        onClick={handleAdd}
        disabled={disabled}
        className="w-full md:w-auto px-8 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-red-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {disabled ? 'Out of Stock' : 'Add to Cart'}
      </button>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-up flex items-center gap-3">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Added {product.name} to cart!
        </div>
      )}
    </>
  )
}
