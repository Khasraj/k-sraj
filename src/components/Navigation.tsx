'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  AcademicCapIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  Bars3Icon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'About Us', href: '#about' },
  { name: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* Top navigation */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-aqua-600 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-x-4">
            <Image
              className="h-8 w-auto"
              src="/logo.png"
              alt="School Manager"
              width={32}
              height={32}
            />
            <span className="text-xl font-semibold text-white">School Manager</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold text-white hover:text-aqua-100 transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/login"
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-aqua-600 shadow-sm hover:bg-aqua-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-300"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-white hover:text-aqua-100"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-aqua-600 px-6 pb-4 pt-4">
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5 text-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className="block rounded-md px-3 py-2 text-base font-semibold text-white hover:bg-aqua-700"
                                onClick={() => setSidebarOpen(false)}
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="space-y-2">
                        <Link
                          href="/login"
                          className="block w-full rounded-md bg-white px-3 py-2 text-center text-base font-semibold text-aqua-600 hover:bg-aqua-50"
                          onClick={() => setSidebarOpen(false)}
                        >
                          Sign In
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
} 