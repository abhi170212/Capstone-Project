'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Home, Map, Calendar, Compass, MoreHorizontal, User as UserIcon, LogOut, Info, Mail, Search, Award, Shield } from 'lucide-react';

export default function Navbar() {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isAdmin = user?.role === 'admin';

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
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 text-[#FFF8EC] bg-[#546B41] font-bold border border-[#546B41] hover:bg-[#99AD7A] rounded-lg transition-colors whitespace-nowrap shadow-sm"
                  >
                    Admin Panel
                  </Link>
                )}
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

          {/* Mobile Profile/Logo Right (No Hamburger) */}
          <div className="md:hidden flex items-center pr-2">
            {!user && (
              <Link href="/login" className="px-3 py-1.5 text-xs text-black font-bold border border-[#546B41] rounded-lg transition-colors whitespace-nowrap">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#FFF8EC] border-t-2 border-[#546B41]/20 pb-safe z-[60] shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center px-6 py-2">
          {[
            { name: 'Home', href: '/', icon: Home },
            { name: 'Destinations', href: '/destinations', icon: Compass },
            { name: 'Planner', href: '/trip-planner', icon: Calendar },
            { name: 'Map', href: '/map', icon: Map },
          ].map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center p-2 group transition-all">
                <div className={`p-1.5 rounded-full transition-all ${isActive ? 'bg-[#99AD7A] text-black border border-[#546B41]/30 -translate-y-1' : 'text-gray-500 group-hover:bg-[#DCCCAC] group-hover:text-black'}`}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] mt-1 font-bold ${isActive ? 'text-black' : 'text-gray-500'}`}>{item.name}</span>
              </Link>
            )
          })}
          
          <button onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)} className="flex flex-col items-center justify-center p-2 group transition-all relative">
            <div className={`p-1.5 rounded-full transition-all ${isMoreMenuOpen ? 'bg-[#99AD7A] text-black border border-[#546B41]/30 -translate-y-1' : 'text-gray-500 group-hover:bg-[#DCCCAC] group-hover:text-black'}`}>
              <MoreHorizontal size={22} strokeWidth={isMoreMenuOpen ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] mt-1 font-bold ${isMoreMenuOpen ? 'text-black' : 'text-gray-500'}`}>More</span>
          </button>
        </div>
      </div>

      {/* Mobile More Menu Drawer */}
      <AnimatePresence>
        {isMoreMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="md:hidden fixed inset-x-0 bottom-[68px] bg-[#FFF8EC] border-t-2 border-[#546B41]/20 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[50] overflow-hidden"
          >
            <div className="p-6 pb-8 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Secondary Navigation */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                 {[
                   { name: 'Smart Finder', href: '/smart-finder', icon: Search },
                   { name: 'Festivals', href: '/festivals', icon: Award },
                   { name: 'About Bihar', href: '/about', icon: Info },
                   { name: 'Contact Us', href: '/contact', icon: Mail },
                 ].map(link => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="bg-white border border-[#546B41]/10 p-4 rounded-2xl shadow-sm hover:border-[#546B41]/40 flex flex-col items-center justify-center gap-2 group transition-all"
                      onClick={() => setIsMoreMenuOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#DCCCAC]/30 flex items-center justify-center group-hover:bg-[#DCCCAC] transition-all">
                        <link.icon size={20} className="text-[#546B41]" />
                      </div>
                      <span className="text-xs font-bold text-black text-center">{link.name}</span>
                    </Link>
                 ))}
              </div>

              {/* Mobile Auth Links */}
              <div className="bg-white border border-[#546B41]/10 rounded-2xl p-4 shadow-sm">
                <h4 className="text-[10px] uppercase font-black tracking-widest text-[#546B41] mb-3">Account Integration</h4>
                {user ? (
                  <div className="space-y-2">
                    {isAdmin && (
                      <Link href="/admin" className="w-full flex items-center gap-3 px-4 py-3 bg-[#546B41] text-[#FFF8EC] font-bold hover:bg-[#99AD7A] rounded-xl transition-colors shadow-sm" onClick={() => setIsMoreMenuOpen(false)}>
                        <Shield size={18} /> Admin Panel
                      </Link>
                    )}
                    <Link href="/dashboard" className="w-full flex items-center gap-3 px-4 py-3 bg-[#FFF8EC] text-black font-bold hover:bg-[#DCCCAC] rounded-xl transition-colors border border-[#546B41]/10" onClick={() => setIsMoreMenuOpen(false)}>
                      <UserIcon size={18} /> User Dashboard
                    </Link>
                    <button onClick={() => { logout(); setIsMoreMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 font-bold hover:bg-red-100 rounded-xl transition-colors">
                      <LogOut size={18} /> Terminate Session
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login" className="w-full flex justify-center items-center gap-2 px-4 py-3 text-black border-2 border-[#546B41] font-bold hover:bg-[#DCCCAC] rounded-xl transition-colors" onClick={() => setIsMoreMenuOpen(false)}>
                      Login to Network
                    </Link>
                    <Link href="/signup" className="w-full flex justify-center items-center gap-2 px-4 py-3 text-black bg-[#99AD7A] hover:bg-[#DCCCAC] font-bold rounded-xl transition-colors text-center" onClick={() => setIsMoreMenuOpen(false)}>
                      Register Operative
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
