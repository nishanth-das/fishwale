'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global Error caught:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-red-100 p-6 rounded-full text-red-600 mb-6">
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>
      <h1 className="text-3xl font-heading font-bold text-gray-900 mb-4">Something went wrong!</h1>
      <p className="text-gray-500 mb-8 max-w-md">
        We encountered an unexpected error. Our team has been notified.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => reset()}
          className="bg-gray-900 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
        >
          Try again
        </button>
        <Link href="/" className="bg-brand-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors shadow-sm">
          Return Home
        </Link>
      </div>
    </div>
  )
}
