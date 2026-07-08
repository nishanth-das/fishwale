import BannerForm from '../BannerForm'
import Link from 'next/link'

export default function NewBannerPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/banners" className="text-gray-500 hover:text-brand-primary font-semibold">&larr; Back</Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Banner</h1>
      </div>
      <BannerForm />
    </div>
  )
}
