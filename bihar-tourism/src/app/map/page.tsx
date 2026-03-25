'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MapComponent from '@/components/MapComponent';
import { destinationApi } from '@/lib/api';
import { Destination } from '@/types';
import { Map as MapIcon, Info, Navigation } from 'lucide-react';

export default function InteractiveMapPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await destinationApi.getAll();
        setDestinations(res.data);
      } catch (err) {
        console.error('Failed to fetch destinations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <MapIcon className="text-blue-600" size={36} /> Interactive Tourism Map
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            Explore Bihar's top destinations and find your next adventure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {loading ? (
              <div className="h-[600px] bg-gray-100 rounded-3xl animate-pulse flex items-center justify-center">
                <p className="text-gray-400">Loading Map...</p>
              </div>
            ) : (
              <div className="rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
                <MapComponent destinations={destinations} height="600px" />
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-50 rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Info size={20} className="text-blue-600" /> Quick Guide
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-xs">1</div>
                  <p className="text-sm text-gray-600">Zoom in to see clusters of destinations.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-xs">2</div>
                  <p className="text-sm text-gray-600">Click on any marker to view details.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-xs">3</div>
                  <p className="text-sm text-gray-600">Use the popup link to visit the destination page.</p>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-3xl p-6 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Navigation size={20} /> Total Locations
              </h3>
              <div className="text-5xl font-extrabold">{destinations.length}</div>
              <p className="mt-2 opacity-90 text-sm">Destinations mapped for your convenience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
