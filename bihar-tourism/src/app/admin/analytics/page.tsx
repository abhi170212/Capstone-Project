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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive platform insights and statistics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>
            <TrendingUp size={24} className="opacity-50" />
          </div>
          <div className="text-4xl font-bold mb-1">{analytics.totalUsers}</div>
          <div className="text-blue-100">Total Users</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <MapPin size={24} />
            </div>
            <TrendingUp size={24} className="opacity-50" />
          </div>
          <div className="text-4xl font-bold mb-1">{analytics.totalDestinations}</div>
          <div className="text-green-100">Destinations</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <MessageSquare size={24} />
            </div>
            <TrendingUp size={24} className="opacity-50" />
          </div>
          <div className="text-4xl font-bold mb-1">{analytics.totalReviews}</div>
          <div className="text-purple-100">Total Reviews</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Plane size={24} />
            </div>
            <TrendingUp size={24} className="opacity-50" />
          </div>
          <div className="text-4xl font-bold mb-1">{analytics.totalItineraries}</div>
          <div className="text-orange-100">Trip Plans Created</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <TrendingUp size={24} className="opacity-50" />
          </div>
          <div className="text-4xl font-bold mb-1">{analytics.totalFestivals}</div>
          <div className="text-pink-100">Festivals & Events</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Star size={24} />
            </div>
            <Award size={24} className="opacity-50" />
          </div>
          <div className="text-4xl font-bold mb-1">{analytics.averageRating}</div>
          <div className="text-yellow-100">Average Rating</div>
        </motion.div>
      </div>

      {/* Top Destinations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 size={28} className="text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Top Destinations by Popularity</h2>
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
                      <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                          {dest.name}
                        </p>
                        <p className="text-sm text-gray-500">{dest.reviewCount} reviews</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-gray-800">{dest.averageRating}</span>
                    </div>
                  </div>
                  <div className="ml-11 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
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
        className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white"
      >
        <h2 className="text-2xl font-bold mb-6">Platform Health Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-sm text-gray-300 mb-2">Reviews per User</div>
            <div className="text-3xl font-bold">
              {analytics.totalUsers > 0
                ? (analytics.totalReviews / analytics.totalUsers).toFixed(2)
                : '0'}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-sm text-gray-300 mb-2">Trips per User</div>
            <div className="text-3xl font-bold">
              {analytics.totalUsers > 0
                ? (analytics.totalItineraries / analytics.totalUsers).toFixed(2)
                : '0'}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-sm text-gray-300 mb-2">Destinations per Review</div>
            <div className="text-3xl font-bold">
              {analytics.totalReviews > 0
                ? (analytics.totalDestinations / analytics.totalReviews).toFixed(2)
                : '0'}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-sm text-gray-300 mb-2">Engagement Score</div>
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
        className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-green-50 rounded-xl border border-green-100">
            <h3 className="font-bold text-green-800 mb-2">🎯 Most Active Metric</h3>
            <p className="text-green-700">
              {analytics.totalReviews > analytics.totalItineraries
                ? `Users are leaving more reviews (${analytics.totalReviews}) than creating trip plans (${analytics.totalItineraries}). Consider promoting the trip planner feature!`
                : `Users are creating more trip plans (${analytics.totalItineraries}) than leaving reviews (${analytics.totalReviews}). Great engagement with planning tools!`}
            </p>
          </div>
          <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-2">📊 Content Ratio</h3>
            <p className="text-blue-700">
              You have {analytics.totalDestinations} destinations and {analytics.totalFestivals} festivals.
              {analytics.totalDestinations > 10
                ? ' Great content library! Consider adding more seasonal events.'
                : ' Consider adding more destinations to attract diverse visitors.'}
            </p>
          </div>
          <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
            <h3 className="font-bold text-purple-800 mb-2">⭐ Quality Indicator</h3>
            <p className="text-purple-700">
              Average rating of {analytics.averageRating}/5 indicates
              {parseFloat(analytics.averageRating) >= 4.0
                ? ' excellent user satisfaction! Keep maintaining quality content.'
                : parseFloat(analytics.averageRating) >= 3.0
                ? ' good user satisfaction. There\'s room for improvement.'
                : ' users may need better destination information.'}
            </p>
          </div>
          <div className="p-6 bg-orange-50 rounded-xl border border-orange-100">
            <h3 className="font-bold text-orange-800 mb-2">🚀 Growth Opportunity</h3>
            <p className="text-orange-700">
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
