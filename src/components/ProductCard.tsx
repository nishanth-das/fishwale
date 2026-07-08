import Image from 'next/image'
import Link from 'next/link'
import type { Database } from '@/types/supabase'

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']

interface ProductCardProps {
  product: Product
  category?: Category
}

export default function ProductCard({ product, category }: ProductCardProps) {
  const isOutOfStock = product.stock_status === 'out_of_stock'
  const imageUrl = product.images?.[0] || '/images/placeholder.jpg'

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className={`relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col ${isOutOfStock ? 'opacity-75' : ''}`}>
        
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-800 text-sm font-bold px-3 py-1 rounded shadow">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          {category && (
            <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1">
              {category.name}
            </span>
          )}
          <h3 className="text-lg font-heading font-semibold text-brand-dark mb-1 line-clamp-1">{product.name}</h3>
          
          <div className="mt-auto pt-4 flex items-end justify-between">
            <div>
              <span className="text-xl font-bold text-gray-900">₹{product.base_price}</span>
              <span className="text-sm text-gray-500 ml-1">
                / {product.pricing_type === 'weight' ? 'kg' : product.unit || 'pack'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </Link>
  )
}
