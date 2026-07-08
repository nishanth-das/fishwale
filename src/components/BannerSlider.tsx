'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

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
      <section className="relative h-[70vh] min-h-[600px] w-full bg-black">
        <Image 
          src="/images/hero.png" 
          alt="Fresh Premium Seafood" 
          fill 
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 via-transparent to-transparent">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4 max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-6 leading-tight drop-shadow-xl">
              Premium Fresh Fish <br className="hidden md:block"/> Delivered to You
            </h1>
            <p className="text-lg md:text-2xl text-gray-200 mb-10 font-light drop-shadow-md">
              Hygienically cleaned, expertly cut, and delivered fresh across Agartala and Tripura.
            </p>
            <Link href="/shop" className="inline-flex items-center gap-2 px-10 py-4 bg-brand-primary text-white font-bold text-lg rounded-full hover:bg-red-700 hover:scale-105 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              Shop Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-[70vh] min-h-[600px] w-full bg-black overflow-hidden group">
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {(() => {
            const banner = banners[current]
            const Content = () => (
              <>
                <Image 
                  src={banner.image_url} 
                  alt={banner.title || 'FishWale Banner'} 
                  fill 
                  className="object-cover opacity-50"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                {banner.title && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="text-center px-4 max-w-4xl pointer-events-auto"
                    >
                      <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-6 leading-tight drop-shadow-2xl">
                        {banner.title}
                      </h1>
                      {banner.link && (
                        <span className="inline-flex items-center gap-2 px-10 py-4 bg-brand-primary text-white font-bold text-lg rounded-full hover:bg-red-700 hover:scale-105 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                          Explore More
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </span>
                      )}
                    </motion.div>
                  </div>
                )}
              </>
            )

            return banner.link ? (
              <Link href={banner.link} className="block w-full h-full relative cursor-pointer">
                <Content />
              </Link>
            ) : (
              <div className="w-full h-full relative"><Content /></div>
            )
          })()}
        </motion.div>
      </AnimatePresence>
      
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
