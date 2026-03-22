'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DestinationCard from '@/components/DestinationCard';
import MapComponent from '@/components/MapComponent';
import { destinationApi } from '@/lib/api';
import { Destination } from '@/types';

export default function CulturalTourism() {
  const [culturalSites, setCulturalSites] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCulturalSites = async () => {
      try {
        const res = await destinationApi.getAll({ type: 'cultural' });
        setCulturalSites(res.data);
      } catch (err) {
        setError('Failed to load cultural heritage sites. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCulturalSites();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ... (Hero section) ... */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1623945032589-1c7c8987f52e?w=1600&q=80"
            alt="Cultural Tourism"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-700/50"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Cultural Heritage of Bihar
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Journey through ancient civilizations, sacred pilgrimage sites, and 
              architectural marvels that tell the story of Bihar's glorious past.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-8 bg-blue-50 rounded-2xl"
            >
              <svg className="w-16 h-16 mx-auto text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div className="text-lg text-gray-700 font-semibold mb-2">Ancient Universities</div>
              <p className="text-gray-600">Nalanda & Vikramshila</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center p-8 bg-purple-50 rounded-2xl"
            >
              <svg className="w-16 h-16 mx-auto text-purple-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <div className="text-lg text-gray-700 font-semibold mb-2">Sacred Sites</div>
              <p className="text-gray-600">Buddhist & Sikh Pilgrimage</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-8 bg-green-50 rounded-2xl"
            >
              <svg className="w-16 h-16 mx-auto text-green-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="text-lg text-gray-700 font-semibold mb-2">Archaeological Wonders</div>
              <p className="text-gray-600">UNESCO World Heritage Sites</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              Cultural Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the spiritual and historical treasures of Bihar
            </p>
            <div className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-6 rounded-full"></div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-600">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {culturalSites.map((destination, index) => (
                <motion.div
                  key={destination._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DestinationCard destination={destination} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              A Journey Through Time
            </h2>
            <p className="text-xl text-white/90">
              Bihar's cultural heritage spans thousands of years
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { period: '6th Century BCE', event: 'Lord Buddha\'s Enlightenment' },
              { period: '5th Century CE', event: 'Nalanda University Founded' },
              { period: '8th Century CE', event: 'Vikramshila University Established' },
              { period: '1666 CE', event: 'Guru Gobind Singh Ji Born' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl font-bold mb-2">{item.period}</div>
                <div className="text-white/90">{item.event}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Heritage Map
            </h2>
            <p className="text-xl text-gray-600">
              Locate all cultural and heritage sites
            </p>
          </motion.div>
          <MapComponent destinations={culturalSites} height="500px" />
        </div>
      </section>
    </div>
  );
}
