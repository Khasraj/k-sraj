'use client'

import Image from 'next/image'
import Link from 'next/link'
import Navigation from '../components/Navigation'
import {
  UserGroupIcon,
  AcademicCapIcon,
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Student Management',
    description: 'Comprehensive student profiles, academic history, and personal information tracking.',
    icon: UserGroupIcon,
  },
  {
    name: 'Academic Performance',
    description: 'Track and analyze student performance with detailed analytics and progress reports.',
    icon: AcademicCapIcon,
  },
  {
    name: 'Attendance System',
    description: 'Automated attendance tracking with real-time notifications and reporting.',
    icon: ClipboardDocumentCheckIcon,
  },
  {
    name: 'Teacher Management',
    description: 'Complete teacher information system with workload management and performance tracking.',
    icon: UsersIcon,
  },
  {
    name: 'Class Scheduling',
    description: 'Smart class scheduling system with conflict resolution and resource management.',
    icon: CalendarIcon,
  },
  {
    name: 'Fee Management',
    description: 'Streamlined fee collection and tracking with automated payment reminders.',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Report Generation',
    description: 'Comprehensive reporting system with customizable templates and data visualization.',
    icon: ChartBarIcon,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />

      {/* Main content */}
      <div>
        {/* Hero Section */}
        <div className="relative isolate overflow-hidden bg-gradient-to-r from-aqua-600 to-aqua-400 px-6 py-24 sm:py-32 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,rgba(240,253,253,0.3),rgba(255,255,255,0.1))] opacity-20" />
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white/10 shadow-xl shadow-aqua-600/10 ring-1 ring-white/10" />
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Modern School Management System
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-100">
                Transform your educational institution with our comprehensive, cloud-based school management solution.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/dashboard"
                  className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-aqua-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-300 hover:scale-105"
                >
                  Get Started
                </Link>
                <Link
                  href="/demo"
                  className="text-sm font-semibold leading-6 text-white hover:text-gray-100"
                >
                  Live Demo <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-aqua-600">Comprehensive Solution</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your school
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform provides all the tools and features needed to streamline your school&apos;s administrative processes.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col bg-white rounded-2xl p-8 shadow-lg ring-1 ring-gray-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <feature.icon className="h-8 w-8 flex-none text-aqua-600" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Trusted by schools worldwide
                </h2>
                <p className="mt-4 text-lg leading-8 text-gray-300">
                  Join thousands of schools that have transformed their management with our platform
                </p>
              </div>
              <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { name: 'Active Schools', value: '500+' },
                  { name: 'Students Managed', value: '100k+' },
                  { name: 'Success Rate', value: '99%' },
                  { name: 'Countries', value: '25+' },
                ].map((stat) => (
                  <div key={stat.name} className="flex flex-col-reverse bg-white/5 backdrop-blur-sm rounded-2xl p-8">
                    <dt className="text-base leading-7 text-gray-300">{stat.name}</dt>
                    <dd className="text-4xl font-semibold tracking-tight text-white">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl" aria-hidden="true">
            <div
              className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-aqua-400 to-aqua-300 opacity-25"
              style={{
                clipPath:
                  'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 