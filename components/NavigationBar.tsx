'use client';

// Top navigation bar

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { APP_NAME } from '@/config/constants';
import { useAuth } from '@/lib/contexts/AuthContext';
import Button from './ui/Button';

export default function NavigationBar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isPublicView = pathname?.startsWith('/t/');

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-400">{APP_NAME}</span>
            </Link>
          </div>

          {!isPublicView || user ? (
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/generate" className="text-gray-300 hover:text-blue-400 font-medium">
                Generate
              </Link>
              {user && (
                <Link href="/dashboard" className="text-gray-300 hover:text-blue-400 font-medium">
                  Dashboard
                </Link>
              )}
              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-400">
                        {user.email}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Link href="/auth/login">
                        <Button variant="outline" size="sm">
                          Login
                        </Button>
                      </Link>
                      <Link href="/auth/signup">
                        <Button size="sm">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : null}

          {/* Mobile menu button placeholder */}
          {!isPublicView || user ? (
            <div className="md:hidden">
              <button className="text-gray-300 hover:text-blue-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
