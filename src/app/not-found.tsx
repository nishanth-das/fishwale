import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found | FishWale',
}

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-brand-primary/10 p-6 rounded-full text-brand-primary mb-6">
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
      <h1 className="text-5xl font-heading font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Oops! Looks like the page you are looking for has been moved or doesn't exist.
      </p>
      <Link href="/shop" className="bg-brand-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors shadow-sm">
        Return to Shop
      </Link>
    </div>
  )
}
