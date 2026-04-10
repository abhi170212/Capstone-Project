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
    { name: 'Festivals', href: '/festivals' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  if (pathname === '/login' || pathname === '/signup') return null;

  return (
    <nav className="bg-[#FFF8EC]/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-[#546B41]/20">
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full border-2 border-[#546B41] flex items-center justify-center bg-[#DCCCAC] text-black font-bold text-xl">
                BT
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">
                  Bihar Tourism
                </h1>
                <p className="text-xs text-black font-medium">Eco & Cultural Paradise</p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div id="nav-links" className="hidden md:flex items-center flex-1 justify-center md:space-x-0.5 lg:space-x-1 xl:space-x-3 mx-1">
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
                    className={`px-2.5 py-1.5 font-bold transition-all duration-300 rounded-lg text-[13px] lg:text-sm inline-block ${isActive
                      ? 'text-black bg-[#DCCCAC] shadow-sm ring-1 ring-[#546B41]/30'
                      : 'text-black hover:bg-[#99AD7A] hover:shadow-sm'
                      }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop Auth Links */}
          <div className="hidden md:flex items-center flex-shrink-0 border-l border-[#546B41]/30 pl-4 ml-2">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-black font-bold border border-[#546B41] hover:bg-[#DCCCAC] rounded-lg transition-colors whitespace-nowrap"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-black font-bold bg-[#99AD7A] hover:bg-[#DCCCAC] rounded-lg transition-colors shadow-sm whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="px-4 py-2 text-black font-bold border border-[#546B41] hover:bg-[#DCCCAC] rounded-lg transition-colors whitespace-nowrap">
                  Login
                </Link>
                <Link href="/signup" className="px-4 py-2 text-black font-bold bg-[#99AD7A] hover:bg-[#DCCCAC] rounded-lg transition-colors shadow-sm whitespace-nowrap">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black hover:text-[#546B41] focus:outline-none p-2"
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
          className="md:hidden bg-[#FFF8EC] border-t border-[#546B41]/20"
        >
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-4 py-3 font-bold rounded-lg transition-all ${isActive
                    ? 'text-black bg-[#DCCCAC] shadow-sm ring-1 ring-[#546B41]/30'
                    : 'text-black hover:bg-[#99AD7A]'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Mobile Auth Links */}
            <div className="border-t border-[#546B41]/20 pt-2 mt-2">
              {user ? (
                <>
                  <Link href="/dashboard" className="block px-4 py-3 text-black font-bold hover:bg-[#DCCCAC] rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 text-black font-bold hover:bg-[#DCCCAC] rounded-lg transition-colors mt-2">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-4 py-3 text-black border border-[#546B41] font-bold hover:bg-[#DCCCAC] rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/signup" className="block px-4 py-3 text-black bg-[#99AD7A] hover:bg-[#DCCCAC] font-bold rounded-lg transition-colors text-center mt-2" onClick={() => setIsMenuOpen(false)}>
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
