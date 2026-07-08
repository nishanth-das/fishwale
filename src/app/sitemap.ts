import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://fishwale.com'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Static routes
  const routes = [
    '',
    '/about',
    '/shop',
    '/delivery-areas',
    '/faq',
    '/contact',
    '/terms',
    '/privacy',
    '/refund-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Fetch active categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')

  const categoryRoutes = (categories || []).map((cat) => ({
    url: `${baseUrl}/shop/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  // Fetch active products
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_active', true)

  const productRoutes = (products || []).map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(product.updated_at || new Date()),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  return [...routes, ...categoryRoutes, ...productRoutes]
}
