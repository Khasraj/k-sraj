'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SchoolRegistrationPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const code = formData.get('code') as string;
    const address = formData.get('address') as string;
    const county = formData.get('county') as string;
    const adminUsername = formData.get('adminUsername') as string;
    const adminPhone = formData.get('adminPhone') as string;
    const adminEmail = formData.get('adminEmail') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate phone number format (Kenyan format)
    const phoneRegex = /^(?:254|\+254|0)?([17](0|1|2|4|5|6|7|8|9)[0-9]{6})$/;
    if (!phoneRegex.test(adminPhone)) {
      setError('Please enter a valid Kenyan phone number');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register/school', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          school: {
            name,
            code,
            address,
            county,
          },
          admin: {
            username: adminUsername,
            phoneNumber: adminPhone,
            email: adminEmail || null,
            password,
            role: 'ADMIN',
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Redirect to login page on success
      router.push('/login?registered=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-bold text-aqua-600 mb-2">
          School Manager
        </h1>
        <p className="text-center text-sm text-gray-600 mb-8">
          Register Your School
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* School Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">School Information</h3>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  School Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-aqua-500 focus:border-aqua-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  School Code
                </label>
                <div className="mt-1">
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    placeholder="e.g., SCH001"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-aqua-500 focus:border-aqua-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  School Address
                </label>
                <div className="mt-1">
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-aqua-500 focus:border-aqua-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="county" className="block text-sm font-medium text-gray-700">
                  County
                </label>
                <div className="mt-1">
                  <input
                    id="county"
                    name="county"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-aqua-500 focus:border-aqua-500"
                  />
                </div>
              </div>
            </div>

            {/* Admin Details */}
            <div className="space-y-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Administrator Account</h3>

              <div>
                <label htmlFor="adminUsername" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="adminUsername"
                    name="adminUsername"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-aqua-500 focus:border-aqua-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="adminPhone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    id="adminPhone"
                    name="adminPhone"
                    type="tel"
                    placeholder="e.g., 0712345678"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-aqua-500 focus:border-aqua-500"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">Format: 07XX XXX XXX or +254 7XX XXX XXX</p>
              </div>

              <div>
                <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
                  Email (Optional)
                </label>
                <div className="mt-1">
                  <input
                    id="adminEmail"
                    name="adminEmail"
                    type="email"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-aqua-500 focus:border-aqua-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-aqua-500 focus:border-aqua-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-aqua-500 focus:border-aqua-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-aqua-600 hover:bg-aqua-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aqua-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Registering School...' : 'Register School'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already registered?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-aqua-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aqua-500"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 