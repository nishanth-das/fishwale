'use client'
import { motion } from 'framer-motion'
import { CheckCircle2, Truck, ShieldCheck, MapPin, Quote, Clock, Fish, Star } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

export function TrustBar() {

  return (
    <>
      {/* Premium Trust Bar */}
      <section className="bg-gradient-to-r from-brand-primary to-red-700 py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 text-center">
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="flex flex-col items-center p-4">
              <div className="bg-white/20 p-4 rounded-full mb-4">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-heading font-bold text-2xl tracking-wide mb-2">Same-Day Fresh</h3>
              <p className="text-white/80 font-medium text-lg">Caught today, cooked today. Straight from water to your kitchen.</p>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="flex flex-col items-center p-4">
              <div className="bg-white/20 p-4 rounded-full mb-4">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-heading font-bold text-2xl tracking-wide mb-2">Hygienically Packed</h3>
              <p className="text-white/80 font-medium text-lg">Expertly cleaned, descaled, and vacuum sealed for ultimate freshness.</p>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="flex flex-col items-center p-4">
              <div className="bg-white/20 p-4 rounded-full mb-4">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-heading font-bold text-2xl tracking-wide mb-2">Serving Tripura</h3>
              <p className="text-white/80 font-medium text-lg">Fast and reliable delivery network across Agartala and surrounding areas.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export function HomeFeatures() {
  return (
    <>
      {/* How it Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-brand-dark mb-4">How FishWale Works</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">We've simplified the process of buying fresh fish. Skip the messy markets and get premium quality seafood at your doorstep.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Fish, title: '1. Sourced Fresh', desc: 'We source the best catch daily from local fishermen.' },
              { icon: CheckCircle2, title: '2. Quality Check', desc: 'Strict quality control to ensure only premium fish is selected.' },
              { icon: ShieldCheck, title: '3. Custom Cuts', desc: 'Expert butchers cut and clean exactly to your preference.' },
              { icon: Truck, title: '4. Fast Delivery', desc: 'Vacuum packed and delivered cold to preserve freshness.' },
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow text-center relative overflow-hidden group"
              >
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-primary transition-colors">
                  <step.icon className="w-8 h-8 text-brand-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-brand-dark mb-4">What Our Customers Say</h2>
            <p className="text-gray-500 text-lg">Trusted by thousands of families in Agartala.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarmistha D.', text: 'The Hilsa was incredibly fresh! Perfect cut and clean packaging. Highly recommend FishWale.' },
              { name: 'Rahul M.', text: 'Finally a reliable app for fresh fish in Agartala. The delivery is prompt and the quality is always top-notch.' },
              { name: 'Priya C.', text: 'Saved me so much time avoiding the crowded markets. The Tiger Prawns were huge and delicious.' },
            ].map((testimonial, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-gray-50 p-8 rounded-3xl relative"
              >
                <Quote className="w-12 h-12 text-brand-primary/20 absolute top-6 right-6" />
                <div className="flex text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-gray-700 italic mb-6 text-lg relative z-10">"{testimonial.text}"</p>
                <h4 className="font-bold text-brand-dark font-heading">{testimonial.name}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
