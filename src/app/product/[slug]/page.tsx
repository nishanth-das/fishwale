import { notFound } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/ProductCard'
import ProductOptions from '@/components/ProductOptions'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase.from('products').select('*').eq('slug', slug).single()
  
  if (!product) return { title: 'Product Not Found' }
  
  return {
    title: `${product.name} - FishWale`,
    description: product.description || `Buy fresh ${product.name} online at FishWale.`,
    openGraph: {
      images: product.images ? [product.images[0]] : [],
    }
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch product
  const { data: product } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) {
    notFound()
  }

  const category = Array.isArray(product.categories) ? product.categories[0] : product.categories
  
  // Fetch related products
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('category_id', product.category_id)
    .eq('is_active', true)
    .neq('id', product.id)
    .limit(4)

  const isOutOfStock = product.stock_status === 'out_of_stock'
  const imageUrl = product.images?.[0] || '/images/placeholder.jpg'

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images || [],
    description: product.description,
    offers: {
      '@type': 'Offer',
      price: product.base_price,
      priceCurrency: 'INR',
      availability: isOutOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        
        {/* Image Gallery */}
        <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
          <Image src={imageUrl} alt={product.name} fill className="object-cover" priority />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-900 text-lg font-bold px-6 py-2 rounded-lg shadow-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {category && (
            <span className="text-sm font-semibold text-brand-primary uppercase tracking-wider mb-2">
              {category.name}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-dark mb-4">{product.name}</h1>
          
          <div className="text-3xl font-bold text-gray-900 mb-6">
            ₹{product.base_price} <span className="text-lg text-gray-500 font-normal">/ {product.pricing_type === 'weight' ? 'kg' : product.unit || 'pack'}</span>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            {product.description || 'No description available.'}
          </p>

          <ProductOptions product={product} />
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-heading font-bold text-brand-dark mb-8">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} category={p.categories} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
