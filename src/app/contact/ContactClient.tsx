'use client'

import { useState } from 'react'

export default function ContactClient() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          contact_info: formData.get('contact_info'),
          message: formData.get('message')
        })
      })
      
      if (!res.ok) {
        throw new Error('Failed to send message')
      }
      
      setStatus('success')
      ;(e.target as HTMLFormElement).reset()
    } catch (err: any) {
      setStatus('error')
      setErrorMessage(err.message)
    }
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
      
      {status === 'success' ? (
        <div className="bg-green-50 text-green-700 p-6 rounded-lg text-center border border-green-200">
          <svg className="w-12 h-12 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h3 className="text-lg font-bold mb-2">Message Sent!</h3>
          <p>Thank you for reaching out. We will get back to you as soon as possible.</p>
          <button onClick={() => setStatus('idle')} className="mt-4 text-green-800 font-semibold hover:underline">Send another message</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input type="text" name="name" required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-primary" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address or Phone Number</label>
            <input type="text" name="contact_info" required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-primary" placeholder="john@example.com / +91 9876543210" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
            <textarea name="message" required rows={5} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-primary resize-none" placeholder="How can we help you?"></textarea>
          </div>
          
          {status === 'error' && <p className="text-red-500 text-sm font-semibold">{errorMessage}</p>}
          
          <button type="submit" disabled={status === 'loading'} className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  )
}
