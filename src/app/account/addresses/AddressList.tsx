'use client'
import { deleteAddress, setDefaultAddress } from '@/app/actions/addressActions'
import { useState } from 'react'

export default function AddressList({ addresses }: { addresses: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setLoadingId(id)
    await deleteAddress(id)
    setLoadingId(null)
  }

  const handleSetDefault = async (id: string) => {
    setLoadingId(id)
    await setDefaultAddress(id)
    setLoadingId(null)
  }

  if (addresses.length === 0) {
    return <div className="text-gray-500">No addresses saved yet.</div>
  }

  return (
    <div className="space-y-4">
      {addresses.map((addr) => (
        <div key={addr.id} className={`p-6 rounded-xl border ${addr.is_default ? 'border-brand-primary bg-brand-primary/5 shadow-sm' : 'border-gray-200 bg-white'}`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-900">{addr.label}</h3>
            {addr.is_default && <span className="text-xs bg-brand-primary text-white px-2 py-1 rounded-full font-semibold shadow-sm">Default</span>}
          </div>
          <p className="text-sm text-gray-600">{addr.address_line1}</p>
          {addr.address_line2 && <p className="text-sm text-gray-600">{addr.address_line2}</p>}
          <p className="text-sm text-gray-600">{addr.city} - {addr.pin_code}</p>
          
          <div className="mt-4 flex gap-4 text-sm font-semibold">
            {!addr.is_default && (
              <button 
                onClick={() => handleSetDefault(addr.id)} 
                disabled={loadingId === addr.id}
                className="text-brand-primary hover:underline disabled:opacity-50"
              >
                Set as Default
              </button>
            )}
            <button 
              onClick={() => handleDelete(addr.id)} 
              disabled={loadingId === addr.id}
              className="text-red-500 hover:underline disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
