import { createClient } from '@/lib/supabase/server'
import ZoneForm from '../../ZoneForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditZonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: zone } = await supabase.from('delivery_zones').select('*').eq('id', id).single()

  if (!zone) return notFound()

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/delivery-zones" className="text-gray-500 hover:text-brand-primary font-semibold">&larr; Back</Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Zone: {zone.city}</h1>
      </div>
      <ZoneForm initialData={zone} />
    </div>
  )
}
