'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MapPin, 
  MessageSquare, 
  Star,
  Plane,
  Calendar,
  Award
} from 'lucide-react';

export default function AdminAnalyticsPage() {
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

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-black uppercase tracking-tight mb-2">Analytics Dashboard</h1>
        <p className="text-[#546B41] font-medium tracking-wide">Comprehensive platform insights and statistics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#546B41] rounded-2xl p-6 text-[#FFF8EC] shadow-[0_4px_0_0_rgba(0,0,0,1)] border-2 border-black"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#FFF8EC]/10 rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>
            <TrendingUp size={24} className="opacity-50" />
          </div>
          <div className="text-4xl font-black mb-1">{analytics.totalUsers}</div>
          <div className="text-[#DCCCAC] text-xs font-black uppercase tracking-widest">Total Users</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#99AD7A] rounded-2xl p-6 text-black shadow-[0_4px_0_0_rgba(0,0,0,1)] border-2 border-black"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center">
              <MapPin size={24} />
            </div>
            <TrendingUp size={24} className="opacity-50" />
          </div>
          <div className="text-4xl font-black mb-1">{analytics.totalDestinations}</div>
          <div className="text-black font-bold text-xs uppercase tracking-widest">Destinations</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#DCCCAC] rounded-2xl p-6 text-black shadow-[0_4px_0_0_rgba(0,0,0,1)] border-2 border-black"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center">
              <MessageSquare size={24} />
            </div>
            <TrendingUp size={24} className="opacity-50" />
          </div>
          <div className="text-4xl font-black mb-1">{analytics.totalReviews}</div>
          <div className="text-[#546B41] font-bold text-xs uppercase tracking-widest">Total Reviews</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#FFF8EC] rounded-2xl p-6 text-black shadow-[0_4px_0_0_rgba(0,0,0,1)] border-2 border-black"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#DCCCAC]/30 rounded-xl flex items-center justify-center">
              <Plane size={24} className="text-[#546B41]" />
            </div>
            <TrendingUp size={24} className="opacity-30" />
          </div>
          <div className="text-4xl font-black mb-1">{analytics.totalItineraries}</div>
          <div className="text-[#546B41] font-bold text-xs uppercase tracking-widest">Trip Plans Created</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#546B41] rounded-2xl p-6 text-[#FFF8EC] shadow-[0_4px_0_0_rgba(0,0,0,1)] border-2 border-black"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#FFF8EC]/10 rounded-xl flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <TrendingUp size={24} className="opacity-50" />
          </div>
          <div className="text-4xl font-black mb-1">{analytics.totalFestivals}</div>
          <div className="text-[#DCCCAC] text-xs font-black uppercase tracking-widest">Festivals & Events</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#99AD7A] rounded-2xl p-6 text-black shadow-[0_4px_0_0_rgba(0,0,0,1)] border-2 border-black"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center">
              <Star size={24} />
            </div>
            <Award size={24} className="opacity-50" />
          </div>
          <div className="text-4xl font-black mb-1">{analytics.averageRating}</div>
          <div className="text-black font-bold text-xs uppercase tracking-widest">Average Rating</div>
        </motion.div>
      </div>

      {/* Top Destinations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#FFF8EC] rounded-2xl p-8 shadow-[0_4px_0_0_rgba(0,0,0,1)] border-2 border-black"
      >
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 size={28} className="text-[#546B41]" />
          <h2 className="text-2xl font-black text-black uppercase tracking-wider">Top Destinations by Popularity</h2>
        </div>

        {analytics.topDestinations && analytics.topDestinations.length > 0 ? (
          <div className="space-y-4">
            {analytics.topDestinations.map((dest: any, index: number) => {
              const maxReviews = analytics.topDestinations[0]?.reviewCount || 1;
              const percentage = (dest.reviewCount / maxReviews) * 100;

              return (
                <div key={dest.destinationId} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#546B41] rounded-full flex items-center justify-center text-[#FFF8EC] font-bold text-sm shadow-[0_2px_0_0_rgba(0,0,0,1)] border border-black">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-black text-black uppercase tracking-wide group-hover:text-[#546B41] transition-colors">
                          {dest.name}
                        </p>
                        <p className="text-sm text-[#546B41] font-medium">{dest.reviewCount} reviews</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-[#DCCCAC] fill-[#DCCCAC]" />
                      <span className="font-black text-black">{dest.averageRating}</span>
                    </div>
                  </div>
                  <div className="ml-11 bg-white border border-[#546B41]/20 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-[#546B41] h-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <BarChart3 size={64} className="mx-auto mb-4 text-gray-300" />
            <p>No destination data available yet</p>
          </div>
        )}
      </motion.div>

      {/* Platform Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#546B41] rounded-2xl p-8 text-[#FFF8EC] shadow-[0_8px_0_0_rgba(0,0,0,1)] border-2 border-black"
      >
        <h2 className="text-2xl font-black uppercase tracking-wider mb-6">Platform Health Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#FFF8EC]/10 backdrop-blur-sm rounded-xl p-6 border border-[#FFF8EC]/20">
            <div className="text-xs font-black text-[#DCCCAC] uppercase tracking-widest mb-2">Reviews per User</div>
            <div className="text-3xl font-bold">
              {analytics.totalUsers > 0
                ? (analytics.totalReviews / analytics.totalUsers).toFixed(2)
                : '0'}
            </div>
          </div>
          <div className="bg-[#FFF8EC]/10 backdrop-blur-sm rounded-xl p-6 border border-[#FFF8EC]/20">
            <div className="text-xs font-black text-[#DCCCAC] uppercase tracking-widest mb-2">Trips per User</div>
            <div className="text-3xl font-bold">
              {analytics.totalUsers > 0
                ? (analytics.totalItineraries / analytics.totalUsers).toFixed(2)
                : '0'}
            </div>
          </div>
          <div className="bg-[#FFF8EC]/10 backdrop-blur-sm rounded-xl p-6 border border-[#FFF8EC]/20">
            <div className="text-xs font-black text-[#DCCCAC] uppercase tracking-widest mb-2">Destinations per Review</div>
            <div className="text-3xl font-bold">
              {analytics.totalReviews > 0
                ? (analytics.totalDestinations / analytics.totalReviews).toFixed(2)
                : '0'}
            </div>
          </div>
          <div className="bg-[#FFF8EC]/10 backdrop-blur-sm rounded-xl p-6 border border-[#FFF8EC]/20">
            <div className="text-xs font-black text-[#DCCCAC] uppercase tracking-widest mb-2">Engagement Score</div>
            <div className="text-3xl font-bold">
              {analytics.totalUsers > 0
                ? Math.round(((analytics.totalReviews + analytics.totalItineraries) / analytics.totalUsers) * 10)
                : 0}
              /100
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#FFF8EC] rounded-2xl p-8 shadow-[0_4px_0_0_rgba(0,0,0,1)] border-2 border-black"
      >
        <h2 className="text-2xl font-black text-black uppercase tracking-wider mb-6">Quick Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-[#99AD7A] rounded-xl border-2 border-black shadow-[0_2px_0_0_rgba(0,0,0,1)]">
            <h3 className="font-black text-black uppercase tracking-wider mb-2">🎯 Most Active Metric</h3>
            <p className="text-black font-medium">
              {analytics.totalReviews > analytics.totalItineraries
                ? `Users are leaving more reviews (${analytics.totalReviews}) than creating trip plans (${analytics.totalItineraries}). Consider promoting the trip planner feature!`
                : `Users are creating more trip plans (${analytics.totalItineraries}) than leaving reviews (${analytics.totalReviews}). Great engagement with planning tools!`}
            </p>
          </div>
          <div className="p-6 bg-[#DCCCAC] rounded-xl border-2 border-black shadow-[0_2px_0_0_rgba(0,0,0,1)]">
            <h3 className="font-black text-black uppercase tracking-wider mb-2">📊 Content Ratio</h3>
            <p className="text-black font-medium">
              You have {analytics.totalDestinations} destinations and {analytics.totalFestivals} festivals.
              {analytics.totalDestinations > 10
                ? ' Great content library! Consider adding more seasonal events.'
                : ' Consider adding more destinations to attract diverse visitors.'}
            </p>
          </div>
          <div className="p-6 bg-[#546B41] rounded-xl border-2 border-black shadow-[0_2px_0_0_rgba(0,0,0,1)] text-[#FFF8EC]">
            <h3 className="font-black uppercase tracking-wider mb-2">⭐ Quality Indicator</h3>
            <p className="font-medium opacity-90">
              Average rating of {analytics.averageRating}/5 indicates
              {parseFloat(analytics.averageRating) >= 4.0
                ? ' excellent user satisfaction! Keep maintaining quality content.'
                : parseFloat(analytics.averageRating) >= 3.0
                ? ' good user satisfaction. There\'s room for improvement.'
                : ' users may need better destination information.'}
            </p>
          </div>
          <div className="p-6 bg-[#FFF8EC] rounded-xl border-2 border-black shadow-[0_2px_0_0_rgba(0,0,0,1)]">
            <h3 className="font-black text-[#546B41] uppercase tracking-wider mb-2">🚀 Growth Opportunity</h3>
            <p className="text-black font-medium">
              {analytics.totalUsers < 50
                ? ' Early stage platform. Focus on user acquisition through marketing and social media.'
                : analytics.totalUsers < 200
                ? ' Growing user base. Consider adding referral programs to accelerate growth.'
                : ' Strong user base. Focus on retention and premium features.'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
