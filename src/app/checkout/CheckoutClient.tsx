'use client'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'
import Script from 'next/script'

export default function CheckoutClient({ initialAddresses, zones, user }: any) {
  const { items, clearCart } = useCartStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  
  const [step, setStep] = useState(1)
  const [pinCode, setPinCode] = useState('')
  const [selectedZone, setSelectedZone] = useState<any>(null)
  
  const [addresses, setAddresses] = useState(initialAddresses)
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  
  const [deliverySlot, setDeliverySlot] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  // Coupon state
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  if (!mounted || items.length === 0) return null

  const subtotal = items.reduce((sum, item) => sum + (item.product.base_price * item.quantity), 0)
  const deliveryFee = selectedZone ? selectedZone.delivery_fee : 0
  const total = subtotal + deliveryFee - discount

  const handleZoneCheck = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const zone = zones.find((z: any) => z.pin_codes.includes(pinCode))
    if (zone) {
      if (subtotal < zone.min_order_value) {
        setError(`Minimum order value for this area is ₹${zone.min_order_value}.`)
      } else {
        setSelectedZone(zone)
        setStep(2)
      }
    } else {
      setError('Sorry, we do not deliver to this pin code yet.')
      fetch('/api/notify-zone', {
        method: 'POST',
        body: JSON.stringify({ pin_code: pinCode, email: user.email })
      }).catch(console.error)
    }
  }

  const handleApplyCoupon = async () => {
    setCouponError('')
    setIsValidatingCoupon(true)
    try {
      const res = await fetch('/api/checkout/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAppliedCoupon(data.code)
      setDiscount(data.discount)
    } catch(err: any) {
      setCouponError(err.message)
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const handlePayment = async () => {
    if (!selectedAddressId || !deliverySlot) {
      setError('Please select an address and delivery slot.')
      return
    }
    
    setIsProcessing(true)
    setError('')

    try {
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          address_id: selectedAddressId,
          zone_id: selectedZone.id,
          delivery_slot: deliverySlot,
          coupon_code: appliedCoupon || undefined
        })
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create order')

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: "INR",
        name: "FishWale.com",
        description: "Fresh Fish Delivery",
        order_id: data.razorpay_order_id,
        handler: async function (response: any) {
          await fetch('/api/checkout/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              order_id: data.order_id
            })
          })
          clearCart()
          router.push(`/order-confirmation/${data.order_id}`)
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: "#e63946"
        }
      }
      
      const rzp = new (window as any).Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        setError(response.error.description)
        setIsProcessing(false)
      })
      rzp.open()
      
    } catch (err: any) {
      setError(err.message)
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="flex-1 space-y-8">
        <div className={`p-6 bg-white rounded-xl border ${step === 1 ? 'border-brand-primary shadow-md' : 'border-gray-200 opacity-60'}`}>
          <h2 className="text-xl font-bold mb-4">1. Delivery Area</h2>
          {step === 1 ? (
            <form onSubmit={handleZoneCheck} className="flex gap-4">
              <input type="text" placeholder="Enter PIN Code" value={pinCode} onChange={e => setPinCode(e.target.value)} required className="flex-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-primary" />
              <button type="submit" className="px-6 py-2 bg-brand-primary text-white rounded-lg">Check</button>
            </form>
          ) : (
            <div className="flex justify-between items-center">
              <p>PIN Code: {pinCode} <span className="text-green-600 font-semibold">(Deliverable)</span></p>
              <button onClick={() => setStep(1)} className="text-sm text-brand-primary font-semibold">Change</button>
            </div>
          )}
          {error && step === 1 && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>

        <div className={`p-6 bg-white rounded-xl border ${step === 2 ? 'border-brand-primary shadow-md' : 'border-gray-200 opacity-60'}`}>
          <h2 className="text-xl font-bold mb-4">2. Delivery Address</h2>
          {step === 2 ? (
            <div className="space-y-4">
              {addresses.map((addr: any) => (
                <label key={addr.id} className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-brand-primary bg-brand-primary/5' : 'hover:border-gray-300'}`}>
                  <input type="radio" name="address" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="mt-1" />
                  <div>
                    <p className="font-semibold">{addr.label}</p>
                    <p className="text-sm text-gray-600">{addr.address_line1}, {addr.address_line2}</p>
                    <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pin_code}</p>
                  </div>
                </label>
              ))}
              {addresses.length === 0 && <p className="text-sm text-gray-500">Please add an address in your account first.</p>}
              
              <button disabled={!selectedAddressId} onClick={() => setStep(3)} className="mt-4 px-6 py-2 bg-brand-primary text-white rounded-lg disabled:opacity-50 font-bold">Continue</button>
            </div>
          ) : step > 2 ? (
            <div className="flex justify-between items-center">
              <p>Address selected</p>
              <button onClick={() => setStep(2)} className="text-sm text-brand-primary font-semibold">Change</button>
            </div>
          ) : <p className="text-sm text-gray-400">Complete step 1 first</p>}
        </div>

        <div className={`p-6 bg-white rounded-xl border ${step === 3 ? 'border-brand-primary shadow-md' : 'border-gray-200 opacity-60'}`}>
          <h2 className="text-xl font-bold mb-4">3. Delivery Slot</h2>
          {step === 3 ? (
            <div className="space-y-4">
              <select value={deliverySlot} onChange={e => setDeliverySlot(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-primary">
                <option value="">Select a slot</option>
                <option value="Tomorrow, 8 AM - 11 AM">Tomorrow, 8 AM - 11 AM</option>
                <option value="Tomorrow, 4 PM - 7 PM">Tomorrow, 4 PM - 7 PM</option>
              </select>
              <button disabled={!deliverySlot} onClick={() => setStep(4)} className="mt-4 px-6 py-2 bg-brand-primary text-white rounded-lg disabled:opacity-50 font-bold">Continue</button>
            </div>
          ) : step > 3 ? (
             <div className="flex justify-between items-center">
               <p>{deliverySlot}</p>
               <button onClick={() => setStep(3)} className="text-sm text-brand-primary font-semibold">Change</button>
             </div>
          ) : <p className="text-sm text-gray-400">Complete step 2 first</p>}
        </div>
      </div>

      <div className="w-full md:w-96">
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 sticky top-24">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <div className="space-y-3 mb-6 border-b pb-6">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.product.name}</span>
                <span>₹{item.product.base_price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="mb-6 border-b pb-6">
            <h4 className="text-sm font-semibold mb-2">Have a coupon?</h4>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={couponCode} 
                onChange={e => setCouponCode(e.target.value)} 
                disabled={!!appliedCoupon || isValidatingCoupon || step !== 4} 
                placeholder="Enter Code" 
                className="flex-1 px-3 py-2 border rounded-lg uppercase outline-none focus:ring-2 focus:ring-brand-primary text-sm disabled:bg-gray-100" 
              />
              {appliedCoupon ? (
                <button onClick={() => { setAppliedCoupon(''); setDiscount(0); setCouponCode(''); }} className="px-4 py-2 bg-red-100 text-red-600 font-semibold rounded-lg text-sm">Remove</button>
              ) : (
                <button onClick={handleApplyCoupon} disabled={!couponCode || isValidatingCoupon || step !== 4} className="px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg text-sm disabled:opacity-50 transition-colors">Apply</button>
              )}
            </div>
            {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
            {appliedCoupon && <p className="text-green-600 text-xs mt-2 font-semibold">Coupon applied successfully!</p>}
          </div>

          <div className="space-y-2 mb-6 border-b pb-6 text-sm">
             <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
             </div>
             <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{selectedZone ? `₹${selectedZone.delivery_fee}` : '---'}</span>
             </div>
             {appliedCoupon && (
                <div className="flex justify-between text-green-600 font-bold">
                   <span>Coupon ({appliedCoupon})</span>
                   <span>-₹{discount}</span>
                </div>
             )}
          </div>
          <div className="flex justify-between text-lg font-bold mb-6">
             <span>Total</span>
             <span>₹{total}</span>
          </div>
          {error && step === 4 && <p className="text-red-500 mb-4 text-sm font-semibold">{error}</p>}
          <button 
            disabled={step !== 4 || isProcessing} 
            onClick={handlePayment}
            className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  )
}
