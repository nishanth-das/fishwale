import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | FishWale',
  description: 'Got questions? Find answers about our delivery, fresh fish quality, packaging, and refund policies at FishWale.com.',
}

export default function FAQPage() {
  const faqs = [
    {
      question: "How do you guarantee freshness?",
      answer: "We source our fish daily. Once received, it is immediately processed in a highly sanitary environment, expertly cleaned, and vacuum-sealed. It is kept at optimal temperatures until it reaches your doorstep."
    },
    {
      question: "How does the weight-based pricing work?",
      answer: "The price displayed is based on the gross weight of the fish (before cleaning and cutting). During the cleaning process (scaling, gutting, and trimming), there is a natural weight loss of about 15% to 30%, depending on the type of fish and the cut you select. The final delivered weight will be the net weight after processing."
    },
    {
      question: "What are your delivery slots?",
      answer: "We currently offer two main delivery slots for most areas: Morning (8 AM - 11 AM) and Evening (4 PM - 7 PM). You can choose your preferred slot during checkout."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major UPI apps (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Net Banking through our secure Razorpay payment gateway."
    },
    {
      question: "What is your cancellation and refund policy?",
      answer: "You can cancel your order for a full refund anytime before the order status changes to 'Packed'. Since we deal with perishable goods, we cannot accept cancellations once the fish has been cut and packed for your order. If you receive a damaged or incorrect item, please contact us immediately for a replacement or refund."
    },
    {
      question: "What should I do if an item arrives damaged or wrong?",
      answer: "Please take a photo of the item and its packaging as soon as you receive it, and contact our support team within 2 hours of delivery. We will immediately investigate and provide a full refund or a free replacement."
    }
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-heading font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h1>
      
      <div className="space-y-8 mt-10">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center text-gray-600">
        <p>Still have questions?</p>
        <a href="/contact" className="text-brand-primary font-bold hover:underline">Contact our Support Team</a>
      </div>
    </div>
  )
}
