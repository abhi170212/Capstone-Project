'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Smart Finder', href: '/smart-finder' },
    { name: 'Interactive Map', href: '/map' },
    { name: 'Trip Planner', href: '/trip-planner' },
    { name: 'Eco Tourism', href: '/eco-tourism' },
    { name: 'Cultural', href: '/cultural' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuFn69iagXQxUR6J9bvuyRoYiZ4NCZ6bzxjw&s" 
                alt="Bihar Tourism Logo" 
                className="w-12 h-12 rounded-full object-cover border border-green-600"
              />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Bihar Tourism
                </h1>
                <p className="text-xs text-gray-600">Eco & Cultural Paradise</p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center flex-1 justify-center md:space-x-0.5 lg:space-x-1 xl:space-x-3 mx-1">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="whitespace-nowrap"
              >
                <Link
                  href={link.href}
                  className={`px-2.5 py-1.5 font-medium transition-all duration-300 rounded-lg text-[13px] lg:text-sm inline-block ${
                    isActive 
                      ? 'text-green-700 bg-green-50 shadow-sm ring-1 ring-green-100' 
                      : 'text-gray-600 hover:text-green-700 hover:bg-gray-50 hover:shadow-sm'
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
              );
            })}
          </div>
            
          {/* Desktop Auth Links */}
          <div className="hidden md:flex items-center flex-shrink-0 border-l pl-4 ml-2">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-green-700 font-medium hover:bg-green-50 rounded-lg transition-colors whitespace-nowrap"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-green-600 font-medium rounded-lg transition-colors whitespace-nowrap">
                  Login
                </Link>
                <Link href="/signup" className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm whitespace-nowrap">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t"
        >
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-4 py-3 font-medium rounded-lg transition-all ${
                  isActive 
                    ? 'text-green-700 bg-green-50 shadow-sm ring-1 ring-green-100' 
                    : 'text-gray-600 hover:text-green-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
              );
            })}
            
            {/* Mobile Auth Links */}
            <div className="border-t pt-2 mt-2">
              {user ? (
                <>
                  <Link href="/dashboard" className="block px-4 py-3 text-green-700 font-medium hover:bg-green-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/signup" className="block px-4 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-center mt-2" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
