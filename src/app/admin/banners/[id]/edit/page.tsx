import { createClient } from '@/lib/supabase/server'
import BannerForm from '../../BannerForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: banner } = await supabase.from('banners').select('*').eq('id', id).single()

  if (!banner) return notFound()

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/banners" className="text-gray-500 hover:text-brand-primary font-semibold">&larr; Back</Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Banner</h1>
      </div>
      <BannerForm initialData={banner} />
    </div>
  )
}
