'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveDeliveryZone } from '@/app/actions/adminActions'

export default function ZoneForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [pinCodes, setPinCodes] = useState<string[]>(initialData?.pin_codes || [])
  const [pinInput, setPinInput] = useState('')

  const handleAddPin = () => {
    const val = pinInput.trim()
    if (val && !pinCodes.includes(val)) {
      setPinCodes([...pinCodes, val])
      setPinInput('')
    }
  }

  const removePin = (pin: string) => {
    setPinCodes(pinCodes.filter(p => p !== pin))
  }
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    const formData = new FormData(e.currentTarget)
    // Add pin codes as a comma separated string to formData
    formData.set('pin_codes', pinCodes.join(','))
    
    try {
      await saveDeliveryZone(initialData?.id || null, formData)
      router.push('/admin/delivery-zones')
    } catch(err) {
      alert("Failed to save delivery zone")
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City Name</label>
          <input type="text" name="city" defaultValue={initialData?.city} required className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary" placeholder="e.g. Agartala" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee (₹)</label>
          <input type="number" name="delivery_fee" defaultValue={initialData?.delivery_fee ?? 0} required className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Value (₹)</label>
          <input type="number" name="min_order_value" defaultValue={initialData?.min_order_value ?? 0} required className="w-full p-2 border border-gray-300 rounded outline-none focus:border-brand-primary" />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pin Codes (Press Add)</label>
        <div className="flex gap-2 mb-2">
          <input 
            type="text" 
            value={pinInput}
            onChange={e => setPinInput(e.target.value)}
            onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); handleAddPin(); } }}
            className="flex-1 p-2 border border-gray-300 rounded outline-none focus:border-brand-primary font-mono text-sm" 
            placeholder="e.g. 799001" 
          />
          <button type="button" onClick={handleAddPin} className="bg-gray-100 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-gray-200 border border-gray-300">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {pinCodes.map(pin => (
            <span key={pin} className="inline-flex items-center gap-1 bg-brand-primary/10 text-brand-primary px-2 py-1 rounded text-sm font-mono font-semibold">
              {pin}
              <button type="button" onClick={() => removePin(pin)} className="text-brand-primary hover:text-red-600 focus:outline-none">&times;</button>
            </span>
          ))}
          {pinCodes.length === 0 && <span className="text-xs text-gray-400">No pin codes added yet.</span>}
        </div>
      </div>
      
      <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_active" defaultChecked={initialData ? initialData.is_active : true} className="w-4 h-4 text-brand-primary rounded" />
          <span className="text-sm font-medium text-gray-700">Active</span>
        </label>
      </div>

      <div className="pt-6">
        <button type="submit" disabled={isSaving || pinCodes.length === 0} className="bg-brand-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 transition-colors">
          {isSaving ? 'Saving...' : 'Save Delivery Zone'}
        </button>
      </div>
    </form>
  )
}
