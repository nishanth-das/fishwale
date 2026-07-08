'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function BannerSlider({ banners }: { banners: any[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!banners || banners.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners])

  if (!banners || banners.length === 0) {
    // Default static fallback
    return (
      <section className="relative h-[60vh] min-h-[500px] w-full bg-gray-900">
        <Image 
          src="/images/hero.png" 
          alt="Fresh Premium Seafood" 
          fill 
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              Premium Fresh Fish Delivered to You
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 font-light">
              Hygienically cleaned, expertly cut, and delivered fresh across Agartala and Tripura.
            </p>
            <Link href="/shop" className="inline-block px-8 py-4 bg-brand-primary text-white font-bold rounded-full hover:bg-red-700 hover:scale-105 transition-all shadow-lg">
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-[60vh] min-h-[500px] w-full bg-gray-900 overflow-hidden group">
      {banners.map((banner, index) => {
        const Content = () => (
          <>
            <Image 
              src={banner.image_url} 
              alt={banner.title || 'FishWale Banner'} 
              fill 
              className="object-cover opacity-60"
              priority={index === 0}
            />
            {banner.title && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center px-4 max-w-3xl pointer-events-auto">
                  <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight drop-shadow-lg">
                    {banner.title}
                  </h1>
                </div>
              </div>
            )}
          </>
        )

        const isVisible = index === current

        return (
          <div 
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${isVisible ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {banner.link ? (
              <Link href={banner.link} className="block w-full h-full relative cursor-pointer">
                <Content />
              </Link>
            ) : (
              <div className="w-full h-full relative"><Content /></div>
            )}
          </div>
        )
      })}
      
      {/* Navigation dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full transition-all ${current === idx ? 'bg-brand-primary scale-125' : 'bg-white/50 hover:bg-white/80'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
