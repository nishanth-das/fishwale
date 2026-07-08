import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | FishWale',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg text-gray-700">
      <h1 className="text-3xl font-heading font-bold text-gray-900 mb-6 text-center">Privacy Policy</h1>
      <p className="text-sm text-gray-500 text-center mb-8">Last Updated: [DATE]</p>

      <p>
        At FishWale.com, we respect your privacy and are committed to protecting your personal data.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
      <p>
        We collect information you provide directly to us, such as your name, email address, phone number, and delivery address when you create an account or place an order.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
      <p>
        We use your information to:
      </p>
      <ul>
        <li>Process and fulfill your orders.</li>
        <li>Communicate with you regarding your order status.</li>
        <li>Send you promotional offers (only if you have opted in).</li>
        <li>Improve our website and services.</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Data Sharing</h2>
      <p>
        We do not sell your personal data. We only share it with trusted third-party service providers (such as Razorpay for payments and our delivery partners) strictly for the purpose of fulfilling your order.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Security</h2>
      <p>
        We implement reasonable security measures to protect your data. Your payment information is encrypted and securely processed by Razorpay.
      </p>

      <p className="mt-8 text-sm text-gray-500">
        <em>Note: This is a draft document. [CLIENT TO REVIEW WITH LEGAL COUNSEL]</em>
      </p>
    </div>
  )
}
