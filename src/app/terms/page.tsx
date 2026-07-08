import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | FishWale',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg text-gray-700">
      <h1 className="text-3xl font-heading font-bold text-gray-900 mb-6 text-center">Terms of Service</h1>
      <p className="text-sm text-gray-500 text-center mb-8">Last Updated: [DATE]</p>

      <p>
        Welcome to FishWale.com. By using our website and services, you agree to the following terms and conditions. Please read them carefully.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. General</h2>
      <p>
        FishWale.com provides an online platform for purchasing premium fresh fish. These terms govern your use of our website and your relationship with us.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Pricing and Weight</h2>
      <p>
        Prices displayed on our website are based on the gross weight of the fish (before cleaning and cutting). You acknowledge that cleaning and processing result in a natural weight loss (typically 15% to 30%). You will be charged based on the gross weight, and the delivered product will be the net weight.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Orders and Delivery</h2>
      <p>
        We strive to deliver within the selected time slots. However, delivery times are estimates and may be subject to delays due to unforeseen circumstances (weather, traffic, etc.). FishWale reserves the right to cancel orders if an item becomes unavailable.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Payments</h2>
      <p>
        All payments are securely processed through Razorpay. We do not store your credit/debit card information.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Liability</h2>
      <p>
        FishWale is not liable for any health issues arising from the consumption of our products. Please ensure proper cooking and handling of all seafood.
      </p>

      <p className="mt-8 text-sm text-gray-500">
        <em>Note: This is a draft document. [CLIENT TO REVIEW WITH LEGAL COUNSEL]</em>
      </p>
    </div>
  )
}
