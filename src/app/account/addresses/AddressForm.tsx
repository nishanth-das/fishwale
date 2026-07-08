'use client'
import { addAddress } from '@/app/actions/addressActions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddressForm() {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    try {
      await addAddress(formData)
      e.currentTarget.reset()
      router.refresh()
    } catch (error) {
      alert('Failed to save address')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Address</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" name="label" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
          <input type="text" name="address_line1" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="House/Flat No., Building Name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
          <input type="text" name="address_line2" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="Street, Area, Landmark" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input type="text" name="city" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="Agartala" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
            <input type="text" name="pin_code" required pattern="[0-9]{6}" title="6 digit PIN code" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="799001" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_default" id="is_default" className="w-4 h-4 text-brand-primary focus:ring-brand-primary rounded cursor-pointer" />
          <label htmlFor="is_default" className="text-sm text-gray-700 cursor-pointer">Set as default address</label>
        </div>
        
        <button type="submit" disabled={isPending} className="w-full py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
          {isPending ? 'Saving...' : 'Save Address'}
        </button>
      </form>
    </div>
  )
}
