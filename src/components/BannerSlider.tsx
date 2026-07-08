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
      <section className="relative h-[50vh] min-h-[400px] md:h-[70vh] md:min-h-[600px] w-full bg-black">
        <Image 
          src="/images/hero.png" 
          alt="Fresh Premium Seafood" 
          fill 
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/90 via-black/50 to-black/20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4 max-w-4xl relative z-10"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-extrabold text-white mb-4 md:mb-6 leading-tight drop-shadow-2xl">
              Premium Fresh Fish <br className="hidden md:block"/> Delivered to You
            </h1>
            <p className="text-base sm:text-lg md:text-2xl text-gray-200 mb-8 md:mb-10 font-medium drop-shadow-lg">
              Hygienically cleaned, expertly cut, and delivered fresh across Agartala and Tripura.
            </p>
            <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3 md:px-10 md:py-4 bg-brand-primary text-white font-bold text-base md:text-lg rounded-full hover:bg-red-700 hover:scale-105 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              Shop Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-[50vh] min-h-[400px] md:h-[70vh] md:min-h-[600px] w-full bg-black overflow-hidden group">
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
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
                {banner.title && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="text-center px-4 max-w-4xl pointer-events-auto relative z-10"
                    >
                      <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-extrabold text-white mb-4 md:mb-6 leading-tight drop-shadow-2xl">
                        {banner.title}
                      </h1>
                      {banner.link && (
                        <span className="inline-flex items-center gap-2 px-8 py-3 md:px-10 md:py-4 bg-brand-primary text-white font-bold text-base md:text-lg rounded-full hover:bg-red-700 hover:scale-105 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]">
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
