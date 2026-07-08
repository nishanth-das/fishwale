'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

export default function ReorderButton({ orderItems }: { orderItems: any[] }) {
  const [isReordering, setIsReordering] = useState(false)
  const router = useRouter()
  const addItem = useCartStore(state => state.addItem)

  const handleReorder = async () => {
    setIsReordering(true)
    try {
      const res = await fetch('/api/checkout/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemIds: orderItems.map(i => i.product_id) })
      })
      
      const { availableProducts, unavailableIds } = await res.json()
      
      const unavailableNames: string[] = []
      
      orderItems.forEach(item => {
        const product = availableProducts.find((p: any) => p.id === item.product_id)
        if (product) {
          addItem({
            id: crypto.randomUUID(),
            product: product,
            quantity: 1, 
            weight_selection: product.pricing_type === 'weight' ? item.quantity_or_weight : undefined,
            cut_selection: item.cut_option
          })
        } else {
          unavailableNames.push(item.product_name_snapshot)
        }
      })
      
      if (unavailableNames.length > 0) {
        alert(`Some items could not be reordered because they are out of stock or no longer available:\n- ${unavailableNames.join('\n- ')}`)
      }
      
      router.push('/cart')
    } catch (error) {
      console.error(error)
      alert("Failed to reorder. Please try again.")
    } finally {
      setIsReordering(false)
    }
  }

  return (
    <button 
      onClick={handleReorder} 
      disabled={isReordering}
      className="flex-1 md:flex-none px-4 py-2 bg-brand-primary text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-center"
    >
      {isReordering ? '...' : 'Reorder'}
    </button>
  )
}
