import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/ProductCard'
import BannerSlider from '@/components/BannerSlider'
import { TrustBar, HomeFeatures } from '@/components/HomeInfoSections'

export const revalidate = 60 // Revalidate every minute

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch banners
  const { data: banners } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  // Fetch bestsellers
  const { data: bestsellers } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('is_active', true)
    .eq('is_bestseller', true)
    .limit(4)

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "FishWale",
    "image": "https://fishwale.com/images/hero.png",
    "url": "https://fishwale.com",
    "telephone": "+91 98624 52313",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Agartala",
      "addressRegion": "Tripura",
      "addressCountry": "IN"
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {/* Hero Section */}
      <BannerSlider banners={banners || []} />

      {/* Trust Bar */}
      <TrustBar />

      {/* Shop by Category */}
      {categories && categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-heading font-bold text-center text-brand-dark mb-12">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/shop/${cat.slug}`} className="group relative rounded-2xl overflow-hidden aspect-[4/3] block shadow-sm hover:shadow-xl transition-all">
                  <Image src={cat.image_url || '/images/placeholder.jpg'} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">{cat.name}</h3>
                    <span className="bg-brand-primary text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bestsellers */}
      {bestsellers && bestsellers.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-heading font-bold text-brand-dark mb-2">Fresh Today</h2>
                <p className="text-gray-500">Our most popular catch, selling fast.</p>
              </div>
              <Link href="/shop" className="text-brand-primary font-semibold hover:underline hidden sm:block">View All Products &rarr;</Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {bestsellers.map((product: any) => (
                <ProductCard key={product.id} product={product} category={product.categories} />
              ))}
            </div>
            
            <div className="mt-8 text-center sm:hidden">
              <Link href="/shop" className="inline-block px-6 py-3 border-2 border-brand-primary text-brand-primary font-bold rounded-lg hover:bg-brand-primary hover:text-white transition-colors">
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Additional Info Sections */}
      <HomeFeatures />
    </div>
  )
}
