'use client';

// Top navigation bar

import Link from 'next/link';
import { APP_NAME } from '@/config/constants';

export default function NavigationBar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">{APP_NAME}</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/generate" className="text-gray-700 hover:text-blue-600 font-medium">
              Generate
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
              Dashboard
            </Link>
            <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 font-medium">
              Login
            </Link>
          </div>

          {/* Mobile menu button placeholder */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-blue-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
