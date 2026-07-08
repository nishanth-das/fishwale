import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createBrowserClient } from '@supabase/ssr'

export interface CartItem {
  id: string // Client-side generated ID for guest cart
  product: any
  quantity: number
  weight_selection?: string
  cut_selection?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  syncWithServer: () => Promise<void>
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => 
          i.product.id === item.product.id && 
          i.weight_selection === item.weight_selection && 
          i.cut_selection === item.cut_selection
        )
        
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i.id === existingItem.id 
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          }
        }
        
        return { items: [...state.items, item] }
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
      })),
      clearCart: () => set({ items: [] }),
      syncWithServer: async () => {
        // Advanced logic: If user is logged in, sync this local state with `cart_items` in Supabase.
        // For this phase, we'll keep it simple and just rely on Zustand's localStorage persist for the guest cart,
        // which fulfills the basic persistence requirement for guest users. 
        // If we want a robust server sync, we'd read/write to Supabase here.
        // Let's implement a basic sync check for demonstration:
        
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          // You could dump `get().items` into the `cart_items` table here.
          console.log('User is logged in. Cart state synced locally, ready for checkout.')
        }
      }
    }),
    {
      name: 'fishwale-cart-storage',
    }
  )
)
