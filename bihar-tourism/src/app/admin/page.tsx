'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';
import { 
  Users, 
  MapPin, 
  MessageSquare, 
  Plane, 
  Calendar,
  TrendingUp,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await adminApi.getAnalytics();
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = [
    { 
      label: 'Total Users', 
      value: analytics?.totalUsers || 0, 
      icon: Users, 
      color: 'bg-[#546B41]',
      href: '/admin/users'
    },
    { 
      label: 'Destinations', 
      value: analytics?.totalDestinations || 0, 
      icon: MapPin, 
      color: 'bg-[#546B41]',
      href: '/admin/destinations'
    },
    { 
      label: 'Reviews', 
      value: analytics?.totalReviews || 0, 
      icon: MessageSquare, 
      color: 'bg-[#546B41]',
      href: '/admin/reviews'
    },
    { 
      label: 'Trip Plans', 
      value: analytics?.totalItineraries || 0, 
      icon: Plane, 
      color: 'bg-[#546B41]',
      href: '/admin/analytics'
    },
    { 
      label: 'Festivals', 
      value: analytics?.totalFestivals || 0, 
      icon: Calendar, 
      color: 'bg-[#546B41]',
      href: '/festivals'
    },
    { 
      label: 'Avg Rating', 
      value: analytics?.averageRating || '0', 
      icon: Star, 
      color: 'bg-[#546B41]',
      href: '/admin/reviews'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Admin Dashboard</h1>
        <p className="text-[#546B41] font-medium tracking-wide">Manage your Bihar Tourism platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.href} className="block">
                <div className="bg-[#FFF8EC] rounded-2xl p-6 shadow-sm border border-[#546B41]/20 hover:border-[#546B41] hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-[#FFF8EC] group-hover:scale-110 group-hover:bg-[#DCCCAC] group-hover:text-[#546B41] transition-transform`}>
                      <Icon size={24} />
                    </div>
                    <TrendingUp size={20} className="text-[#546B41]/40 group-hover:text-[#546B41] transition-colors" />
                  </div>
                  <div className="text-3xl font-black text-black mb-1">{stat.value}</div>
                  <div className="text-sm font-bold tracking-widest uppercase text-[#546B41]">{stat.label}</div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Top Destinations */}
      {analytics?.topDestinations && analytics.topDestinations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FFF8EC] rounded-2xl p-6 shadow-sm border border-[#546B41]/20"
        >
          <h2 className="text-2xl font-black text-black mb-6 uppercase tracking-wider">Top Destinations by Reviews</h2>
          <div className="space-y-4">
            {analytics.topDestinations.map((dest: any, index: number) => (
              <div
                key={dest.destinationId}
                className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-[#DCCCAC]/20 border border-[#546B41]/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[#546B41] rounded-full flex items-center justify-center text-[#FFF8EC] font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-bold text-black uppercase tracking-wide text-sm">{dest.name}</p>
                    <p className="text-xs font-semibold text-[#546B41]">{dest.reviewCount} reviews</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-[#DCCCAC] fill-[#DCCCAC]" />
                  <span className="font-black text-black">{dest.averageRating}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#546B41] rounded-2xl p-8 text-[#FFF8EC] shadow-[0_10px_30px_rgba(84,107,65,0.2)]"
      >
        <h2 className="text-2xl font-black mb-4 uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/destinations"
            className="bg-[#FFF8EC]/10 border border-[#FFF8EC]/20 backdrop-blur-sm rounded-xl p-4 hover:bg-[#DCCCAC] hover:text-[#546B41] transition-all text-center group"
          >
            <MapPin size={32} className="mx-auto mb-2 text-[#DCCCAC] group-hover:text-[#546B41] transition-colors" />
            <p className="font-bold tracking-wide uppercase text-sm">Add Destination</p>
          </Link>
          <Link
            href="/admin/users"
            className="bg-[#FFF8EC]/10 border border-[#FFF8EC]/20 backdrop-blur-sm rounded-xl p-4 hover:bg-[#DCCCAC] hover:text-[#546B41] transition-all text-center group"
          >
            <Users size={32} className="mx-auto mb-2 text-[#DCCCAC] group-hover:text-[#546B41] transition-colors" />
            <p className="font-bold tracking-wide uppercase text-sm">Manage Users</p>
          </Link>
          <Link
            href="/admin/reviews"
            className="bg-[#FFF8EC]/10 border border-[#FFF8EC]/20 backdrop-blur-sm rounded-xl p-4 hover:bg-[#DCCCAC] hover:text-[#546B41] transition-all text-center group"
          >
            <MessageSquare size={32} className="mx-auto mb-2 text-[#DCCCAC] group-hover:text-[#546B41] transition-colors" />
            <p className="font-bold tracking-wide uppercase text-sm">Moderate Reviews</p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
