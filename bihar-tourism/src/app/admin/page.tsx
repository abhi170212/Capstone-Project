'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api, { adminApi } from '@/lib/api';
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
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, itinerariesRes] = await Promise.all([
          adminApi.getAnalytics(),
          api.get('/itineraries') // Uses the global itineraryApi endpoint which returns all for admins
        ]);
        setAnalytics(analyticsRes.data);
        setItineraries(itinerariesRes.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const deleteItinerary = async (id: string) => {
    if (!confirm('Are you sure you want to completely delete this itinerary?')) return;
    try {
      await api.delete(`/itineraries/${id}`);
      setItineraries(itineraries.filter(itin => itin._id !== id));
    } catch (err) {
      console.error('Failed to delete itinerary', err);
      alert('Failed to delete itinerary.');
    }
  };

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
                className="flex items-center justify-between p-4 bg-[#FFF8EC] rounded-xl hover:bg-[#DCCCAC]/30 border border-[#546B41]/20 transition-colors"
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

      {/* Global User Itineraries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#FFF8EC] rounded-2xl p-6 shadow-sm border border-[#546B41]/20 mt-8"
      >
        <h2 className="text-2xl font-black text-black mb-6 uppercase tracking-wider flex items-center gap-3">
          <Plane className="text-[#546B41]" /> User Trip Plans Matrix
        </h2>
        
        {itineraries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#546B41]/10 text-[#546B41] text-xs font-black uppercase tracking-widest">
                  <th className="p-4 border-b border-[#546B41]/20">Plan Name</th>
                  <th className="p-4 border-b border-[#546B41]/20">Operative (User)</th>
                  <th className="p-4 border-b border-[#546B41]/20">Duration</th>
                  <th className="p-4 border-b border-[#546B41]/20">Created</th>
                  <th className="p-4 border-b border-[#546B41]/20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {itineraries.filter((i: any) => i.user).map((itin: any) => (
                  <tr key={itin._id} className="hover:bg-white transition-colors group">
                    <td className="p-4 font-bold text-black text-sm">{itin.name}</td>
                    <td className="p-4 text-gray-600 font-medium text-sm">
                      {itin.user ? (
                        <div>
                          <p className="font-bold">{itin.user.name}</p>
                          <p className="text-xs">{itin.user.email}</p>
                        </div>
                      ) : (
                        <span className="text-red-500 italic text-xs">Legacy / Unlinked</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="bg-[#DCCCAC]/30 text-[#546B41] px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase">
                        {itin.days?.length || 0} Days
                      </span>
                    </td>
                    <td className="p-4 text-xs font-bold text-gray-500">
                      {new Date(itin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button onClick={() => deleteItinerary(itin._id)} className="text-gray-300 hover:text-red-500 p-2 bg-white rounded-full transition-colors shadow-sm opacity-0 group-hover:opacity-100" title="Delete Itinerary">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 font-medium p-4 text-center bg-white rounded-xl">No itineraries have been created by users yet.</p>
        )}
      </motion.div>
    </div>
  );
}
