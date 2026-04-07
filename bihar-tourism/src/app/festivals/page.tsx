'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { festivalApi } from '@/lib/api';
import { Festival } from '@/types';
import { Calendar, MapPin, Clock, Search } from 'lucide-react';
import Link from 'next/link';

export default function FestivalsPage() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const res = await festivalApi.getAll();
        setFestivals(res.data);
      } catch (err) {
        console.error('Failed to fetch festivals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFestivals();
  }, []);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];

  const filteredFestivals = festivals.filter(festival => {
    const matchesSearch = festival.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         festival.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         festival.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = !selectedMonth || festival.month === selectedMonth;
    return matchesSearch && matchesMonth;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Festivals & Events
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the vibrant cultural celebrations of Bihar throughout the year
          </p>
          <div className="w-32 h-1.5 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search festivals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="">All Months</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-bold text-gray-800">{filteredFestivals.length}</span> festival{filteredFestivals.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Festivals Grid */}
        {filteredFestivals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFestivals.map((festival, index) => (
              <motion.div
                key={festival._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={festival.images[0] || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80'}
                    alt={festival.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-bold text-orange-600">{festival.month}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{festival.name}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} className="text-orange-600" />
                      <span className="text-sm">{festival.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} className="text-orange-600" />
                      <span className="text-sm">{festival.month}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {festival.description}
                  </p>

                  <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg">
                    Learn More
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No festivals found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Calendar View Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Festival Calendar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {months.map((month, idx) => {
              const monthFestivals = festivals.filter(f => f.month === month);
              return (
                <div
                  key={month}
                  className="p-4 rounded-2xl border border-gray-100 hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer"
                  onClick={() => setSelectedMonth(month)}
                >
                  <div className="font-bold text-gray-800 mb-2">{month}</div>
                  <div className="text-sm text-gray-600">
                    {monthFestivals.length} festival{monthFestivals.length !== 1 ? 's' : ''}
                  </div>
                  {monthFestivals.length > 0 && (
                    <div className="mt-2 text-xs text-orange-600 font-medium">
                      {monthFestivals[0].name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-orange-600 to-pink-600 rounded-3xl p-12 text-white text-center"
        >
          <h2 className="text-4xl font-bold mb-4">
            Plan Your Festival Experience
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Create a personalized itinerary to explore Bihar's amazing festivals
          </p>
          <Link
            href="/trip-planner"
            className="inline-block px-8 py-4 bg-white text-orange-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Start Planning →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
