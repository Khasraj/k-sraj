'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SUBSCRIPTION_TIERS = [
  {
    name: 'Basic',
    key: 'BASIC',
    price: 2000,
    yearlyPrice: 20000,
    features: [
      'Up to 500 students',
      'Basic academic records',
      'Fee management',
      'Basic reports',
      'Email support',
    ],
  },
  {
    name: 'Premium',
    key: 'PREMIUM',
    price: 5000,
    yearlyPrice: 50000,
    features: [
      'Up to 2000 students',
      'Advanced academic tracking',
      'Complete financial management',
      'Advanced reports & analytics',
      'SMS notifications',
      'Priority email & phone support',
    ],
  },
  {
    name: 'Enterprise',
    key: 'ENTERPRISE',
    price: 10000,
    yearlyPrice: 100000,
    features: [
      'Unlimited students',
      'Full academic management',
      'Advanced financial tools',
      'Custom reports',
      'SMS & email notifications',
      '24/7 dedicated support',
      'Multi-campus support',
    ],
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedTierData, setSelectedTierData] = useState<any>(null);

  const handleSubscribeClick = (tier: any) => {
    setSelectedTierData(tier);
    setShowModal(true);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Format phone number to required format (254XXXXXXXXX)
    let formattedPhone = phoneNumber;
    if (phoneNumber.startsWith('0')) {
      formattedPhone = '254' + phoneNumber.slice(1);
    } else if (phoneNumber.startsWith('+254')) {
      formattedPhone = phoneNumber.slice(1);
    }

    try {
      const response = await fetch('/api/payments/mpesa/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: selectedTierData.key,
          months: isYearly ? 12 : 1,
          phoneNumber: formattedPhone,
          amount: isYearly ? selectedTierData.yearlyPrice : selectedTierData.price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Show success message and close modal
      setSelectedTier(selectedTierData.key);
      setShowModal(false);
      setPhoneNumber('');
      // You could implement a polling mechanism here to check payment status
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Select the perfect plan for your school
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-12 flex justify-center">
          <div className="relative flex items-center">
            <span className={`mr-3 ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              type="button"
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isYearly ? 'bg-aqua-600' : 'bg-gray-200'
              }`}
              onClick={() => setIsYearly(!isYearly)}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isYearly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`ml-3 ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly (Save 15%)
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-6 max-w-lg mx-auto">
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-3 sm:gap-6 sm:space-y-0">
          {SUBSCRIPTION_TIERS.map((tier) => (
            <div
              key={tier.key}
              className="divide-y divide-gray-200 rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {tier.name}
                </h3>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">
                    KES {isYearly ? tier.yearlyPrice.toLocaleString() : tier.price.toLocaleString()}
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    /{isYearly ? 'year' : 'month'}
                  </span>
                </p>
                <p className="mt-1">
                  <span className="text-sm text-gray-500">
                    {isYearly ? 'Billed annually' : 'Billed monthly'}
                  </span>
                </p>
                <ul className="mt-6 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribeClick(tier)}
                  disabled={isLoading || selectedTier === tier.key}
                  className="mt-8 block w-full rounded-md border border-transparent bg-aqua-600 px-6 py-3 text-center text-base font-medium text-white shadow-sm hover:bg-aqua-700 focus:outline-none focus:ring-2 focus:ring-aqua-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading && selectedTier === tier.key
                    ? 'Processing...'
                    : selectedTier === tier.key
                    ? 'Payment Initiated'
                    : 'Subscribe'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <p className="text-base text-gray-600">
            All plans include a 30-day free trial. No credit card required.
            <br />
            Questions? Contact our sales team for custom enterprise solutions.
          </p>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Enter M-Pesa Phone Number</h3>
            <form onSubmit={handleSubscribe}>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g., 0712345678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-aqua-500 focus:border-aqua-500"
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Enter your M-Pesa number in format: 07XXXXXXXX or 254XXXXXXXXX
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setPhoneNumber('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-aqua-600 rounded-md hover:bg-aqua-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aqua-500 disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 