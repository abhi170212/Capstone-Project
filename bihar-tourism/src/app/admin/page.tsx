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
      color: 'from-blue-500 to-blue-600',
      href: '/admin/users'
    },
    { 
      label: 'Destinations', 
      value: analytics?.totalDestinations || 0, 
      icon: MapPin, 
      color: 'from-green-500 to-green-600',
      href: '/admin/destinations'
    },
    { 
      label: 'Reviews', 
      value: analytics?.totalReviews || 0, 
      icon: MessageSquare, 
      color: 'from-purple-500 to-purple-600',
      href: '/admin/reviews'
    },
    { 
      label: 'Trip Plans', 
      value: analytics?.totalItineraries || 0, 
      icon: Plane, 
      color: 'from-orange-500 to-orange-600',
      href: '/admin/analytics'
    },
    { 
      label: 'Festivals', 
      value: analytics?.totalFestivals || 0, 
      icon: Calendar, 
      color: 'from-pink-500 to-pink-600',
      href: '/festivals'
    },
    { 
      label: 'Avg Rating', 
      value: analytics?.averageRating || '0', 
      icon: Star, 
      color: 'from-yellow-500 to-yellow-600',
      href: '/admin/reviews'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your Bihar Tourism platform</p>
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
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                      <Icon size={24} />
                    </div>
                    <TrendingUp size={20} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
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
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Destinations by Reviews</h2>
          <div className="space-y-4">
            {analytics.topDestinations.map((dest: any, index: number) => (
              <div
                key={dest.destinationId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{dest.name}</p>
                    <p className="text-sm text-gray-500">{dest.reviewCount} reviews</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-gray-800">{dest.averageRating}</span>
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
        className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white"
      >
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/destinations"
            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all text-center"
          >
            <MapPin size={32} className="mx-auto mb-2" />
            <p className="font-semibold">Add Destination</p>
          </Link>
          <Link
            href="/admin/users"
            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all text-center"
          >
            <Users size={32} className="mx-auto mb-2" />
            <p className="font-semibold">Manage Users</p>
          </Link>
          <Link
            href="/admin/reviews"
            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all text-center"
          >
            <MessageSquare size={32} className="mx-auto mb-2" />
            <p className="font-semibold">Moderate Reviews</p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
