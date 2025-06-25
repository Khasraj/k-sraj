'use client';

import { useState, useEffect } from 'react';
import {
  UsersIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalFees: 0,
    totalClasses: 0,
  });

  // In a real app, you would fetch these stats from your API
  useEffect(() => {
    // Simulated data for now
    setStats({
      totalStudents: 450,
      totalTeachers: 25,
      totalFees: 2500000,
      totalClasses: 12,
    });
  }, []);

  const stats_cards = [
    {
      name: 'Total Students',
      value: stats.totalStudents,
      icon: UsersIcon,
      change: '+4.75%',
      changeType: 'positive',
    },
    {
      name: 'Total Teachers',
      value: stats.totalTeachers,
      icon: AcademicCapIcon,
      change: '+2.1%',
      changeType: 'positive',
    },
    {
      name: 'Total Fees Collected',
      value: `KES ${stats.totalFees.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      change: '+54.02%',
      changeType: 'positive',
    },
    {
      name: 'Total Classes',
      value: stats.totalClasses,
      icon: ChartBarIcon,
      change: '0%',
      changeType: 'neutral',
    },
  ];

  const quickActions = [
    {
      name: 'Add Student',
      href: '/dashboard/students/new',
      description: 'Add a new student to the system',
      icon: UsersIcon,
    },
    {
      name: 'Record Payment',
      href: '/dashboard/fees/new',
      description: 'Record a new fee payment',
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Add Teacher',
      href: '/dashboard/teachers/new',
      description: 'Add a new teacher to the system',
      icon: AcademicCapIcon,
    },
    {
      name: 'View Reports',
      href: '/dashboard/reports',
      description: 'View school performance reports',
      icon: ChartBarIcon,
    },
  ];

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Stats */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats_cards.map((stat) => (
              <div
                key={stat.name}
                className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
              >
                <dt>
                  <div className="absolute rounded-md bg-aqua-500 p-3">
                    <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-500">
                    {stat.name}
                  </p>
                </dt>
                <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  <p
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive'
                        ? 'text-green-600'
                        : stat.changeType === 'negative'
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {stat.change}
                  </p>
                </dd>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-medium leading-6 text-gray-900">
            Quick Actions
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <a
                key={action.name}
                href={action.href}
                className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-aqua-500 hover:ring-1 hover:ring-aqua-500"
              >
                <div className="flex-shrink-0">
                  <action.icon
                    className="h-6 w-6 text-aqua-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">
                      {action.name}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 