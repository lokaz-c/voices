'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { categories } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, isAuthor, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const isAdminPage = pathname.startsWith('/admin');
  const isAuthorPage = pathname.startsWith('/author');

  const handleLogout = async () => {
    await logout();
  };

  // Filter out 'Sustainability and Environment' from navbar categories
  const navbarCategories = categories.filter(
    (category) => category.name !== 'Sustainability and Environment'
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-slate-900">
                Voices and Viewpoints
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {!isAdminPage && !isAuthorPage ? (
              <>
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Home
                </Link>
                {navbarCategories.map((category) => (
                  <Link
                    key={category.name}
                    href={`/category/${category.slug}`}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(`/category/${category.slug}`)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {category.name}
                  </Link>
                ))}
                <Link
                  href="/about-us"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/about-us')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  About Us
                </Link>
              </>
            ) : isAdminPage ? (
              <>
                <Link
                  href="/admin/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin/dashboard')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin') && !isActive('/admin/dashboard')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Posts
                </Link>
                <Link
                  href="/admin/authors"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin/authors')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Authors
                </Link>
                <Link
                  href="/admin/comments"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin/comments')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Comments
                </Link>
                <Link
                  href="/admin/applications"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin/applications')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Applications
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/author/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/author/dashboard')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/author/new-post"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/author/new-post')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  New Post
                </Link>
                <Link
                  href="/author/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/author/profile')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Profile
                </Link>
              </>
            )}
            
            {/* User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <Link
                  href={isAdmin ? "/admin/dashboard" : "/author/dashboard"}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                >
                  <UserIcon className="h-4 w-4 mr-1" />
                  {user?.name || 'User'}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {!isAdminPage && !isAuthorPage ? (
              <>
                <Link
                  href="/"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                {navbarCategories.map((category) => (
                  <Link
                    key={category.name}
                    href={`/category/${category.slug}`}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(`/category/${category.slug}`)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
                <Link
                  href="/about-us"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/about-us')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
              </>
            ) : isAdminPage ? (
              <>
                <Link
                  href="/admin/dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/admin/dashboard')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/admin') && !isActive('/admin/dashboard')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Posts
                </Link>
                <Link
                  href="/admin/authors"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/admin/authors')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Authors
                </Link>
                <Link
                  href="/admin/comments"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/admin/comments')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Comments
                </Link>
                <Link
                  href="/admin/applications"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/admin/applications')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Applications
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/author/dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/author/dashboard')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/author/new-post"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/author/new-post')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  New Post
                </Link>
                <Link
                  href="/author/profile"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/author/profile')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
              </>
            )}
            
            {/* Mobile User Menu */}
            {isAuthenticated ? (
              <div className="border-t pt-4">
                <div className="px-3 py-2 text-sm text-gray-500">
                  {user?.email}
                </div>
                {isAuthor && !isAdmin && (
                  <Link
                    href="/author/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Author Portal
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 