import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Us | FishWale',
  description: 'Learn about FishWale.com, your trusted source for premium fresh fish delivered across Agartala and Tripura.',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-heading font-bold text-gray-900 mb-8 text-center">About FishWale</h1>
      
      <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
        <p>
          Welcome to <strong>FishWale.com</strong>, the premium fish market you can trust. Based in Tripura, our mission is simple: to bring the freshest, highest-quality fish straight from the catch to your kitchen.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Story</h2>
        <p>
          We know how challenging it can be to find truly fresh seafood in local markets. The crowds, the hygiene concerns, and the uncertainty of quality can turn a simple purchase into a hassle. That's why we started FishWale. We wanted to create a service where you can order premium river and sea fish with complete confidence, knowing it has been handled with the utmost care.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The FishWale Promise</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Uncompromising Quality:</strong> We source our fish directly from trusted fishermen and reliable sources.</li>
          <li><strong>Hygienically Cleaned & Packed:</strong> Every order is meticulously cleaned, expertly cut, and vacuum-sealed to preserve maximum freshness.</li>
          <li><strong>Accurate Weight:</strong> Our weight-based pricing is completely transparent. You pay only for what you get.</li>
          <li><strong>Same-Day Delivery:</strong> Our swift delivery network ensures your fish reaches your doorstep on time, still fresh and ready to cook.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Serving Agartala & Beyond</h2>
        <p>
          We are proud to serve the communities across Agartala and are continually expanding our reach across Tripura. Our goal is to make premium seafood accessible to everyone who appreciates great food.
        </p>

        <p className="mt-8 font-semibold text-brand-primary text-xl text-center">
          Experience the joy of fresh fish, without the hassle. Welcome to FishWale.
        </p>
      </div>
    </div>
  )
}
