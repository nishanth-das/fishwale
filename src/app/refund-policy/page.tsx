import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy | FishWale',
}

export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg text-gray-700">
      <h1 className="text-3xl font-heading font-bold text-gray-900 mb-6 text-center">Refund & Cancellation Policy</h1>
      <p className="text-sm text-gray-500 text-center mb-8">Last Updated: [DATE]</p>

      <p>
        We want you to be completely satisfied with your purchase from FishWale.com. Because we deal in perishable goods, our cancellation and refund policies are designed to be fair to both our customers and our business operations.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cancellations</h2>
      <p>
        You may cancel your order for a full refund <strong>at any time before the order status is updated to "Packed"</strong>. 
      </p>
      <p>
        Once an order is marked as "Packed," it means the fish has been specifically cut, cleaned, and prepared for you. Therefore, cancellations are not permitted after this point.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Refunds for Quality Issues</h2>
      <p>
        If you receive an item that is damaged, spoiled, or incorrect, please follow these steps:
      </p>
      <ol>
        <li>Take clear photographs of the item and its packaging immediately upon delivery.</li>
        <li>Contact our support team within <strong>2 hours</strong> of receiving the delivery.</li>
      </ol>
      <p>
        Upon verification, we will issue a full refund to your original payment method or provide a free replacement on your next order, based on your preference.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Refund Processing</h2>
      <p>
        Approved refunds are processed immediately through Razorpay and will automatically be credited back to your original payment method. Please allow 3-5 business days for the funds to reflect in your bank account, depending on your bank's processing times.
      </p>

      <p className="mt-8 text-sm text-gray-500">
        <em>Note: This is a draft document. [CLIENT TO REVIEW WITH LEGAL COUNSEL]</em>
      </p>
    </div>
  )
}
