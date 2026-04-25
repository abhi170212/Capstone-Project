'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, isAdmin } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  MessageSquare, 
  BarChart3,
  Settings,
  ArrowLeft,
  Menu,
  X,
  Music,
  Shirt,
  Utensils
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin(user))) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !isAdmin(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const adminNavLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Destinations', href: '/admin/destinations', icon: MapPin },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Music', href: '/admin/music', icon: Music },
    { name: 'Attires', href: '/admin/attires', icon: Shirt },
    { name: 'Cuisine', href: '/admin/foods', icon: Utensils },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8EC]">
      {/* Top Bar */}
      <header className="bg-[#FFF8EC] shadow-sm border-b border-[#546B41]/20 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className="flex items-center gap-2 text-[#546B41]/70 hover:text-black font-bold">
              <ArrowLeft size={20} />
              <span className="hidden sm:inline uppercase tracking-widest text-xs">Back to Site</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-black text-black uppercase tracking-wider">{user.name}</p>
              <p className="text-xs font-semibold text-[#546B41]/70 uppercase tracking-widest">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-[#546B41] rounded-full flex items-center justify-center text-[#FFF8EC] font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:sticky top-16 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-[#FFF8EC] border-r border-[#546B41]/20 transition-transform duration-300 overflow-y-auto`}
        >
          <nav className="p-4 space-y-2">
            {adminNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold ${
                    isActive
                      ? 'bg-[#546B41] text-[#FFF8EC] shadow-md hover:bg-[#99AD7A]'
                      : 'text-[#546B41] hover:bg-[#DCCCAC]'
                  }`}
                >
                  <Icon size={20} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
