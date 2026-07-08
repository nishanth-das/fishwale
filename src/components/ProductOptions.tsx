'use client'
import { useState } from 'react'
import type { Database } from '@/types/supabase'
import { useCartStore } from '@/store/cartStore'

type Product = Database['public']['Tables']['products']['Row']

export default function ProductOptions({ product }: { product: Product }) {
  const isOutOfStock = product.stock_status === 'out_of_stock'
  
  const [selectedWeight, setSelectedWeight] = useState(product.pricing_type === 'weight' ? '500g' : undefined)
  const [selectedCut, setSelectedCut] = useState(product.cut_options?.[0] || undefined)
  const [showToast, setShowToast] = useState(false)

  const addItem = useCartStore(state => state.addItem)

  const handleAddToCart = () => {
    addItem({
      id: crypto.randomUUID(),
      product,
      quantity: 1,
      weight_selection: selectedWeight,
      cut_selection: selectedCut
    })

    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <div className="space-y-6 mb-8">
      {product.pricing_type === 'weight' && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Select Weight</label>
          <div className="flex gap-3">
            {['250g', '500g', '1kg'].map(w => (
              <button 
                key={w} 
                onClick={() => setSelectedWeight(w)}
                disabled={isOutOfStock} 
                className={`px-4 py-2 border rounded-lg transition-colors disabled:opacity-50 ${selectedWeight === w ? 'border-brand-primary bg-brand-primary/5 text-brand-primary font-semibold' : 'border-gray-300 hover:border-brand-primary'}`}
              >
                {w}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2 italic">* Actual packed weight may vary slightly and is confirmed at packing.</p>
        </div>
      )}

      {product.cut_options && product.cut_options.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Select Cut Type</label>
          <div className="flex flex-wrap gap-3">
            {product.cut_options.map((cut: string) => (
              <button 
                key={cut} 
                onClick={() => setSelectedCut(cut)}
                disabled={isOutOfStock} 
                className={`px-4 py-2 border rounded-lg transition-colors disabled:opacity-50 ${selectedCut === cut ? 'border-brand-primary bg-brand-primary/5 text-brand-primary font-semibold' : 'border-gray-300 hover:border-brand-primary'}`}
              >
                {cut}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto pt-8 border-t border-gray-100">
        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full md:w-auto px-8 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-red-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-up flex items-center gap-3">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Added {product.name} to cart!
        </div>
      )}
    </div>
  )
}
