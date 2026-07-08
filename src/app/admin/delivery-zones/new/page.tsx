import ZoneForm from '../ZoneForm'
import Link from 'next/link'

export default function NewZonePage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/delivery-zones" className="text-gray-500 hover:text-brand-primary font-semibold">&larr; Back</Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Delivery Zone</h1>
      </div>
      <ZoneForm />
    </div>
  )
}
