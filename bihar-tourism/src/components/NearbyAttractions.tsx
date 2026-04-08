'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Navigation, Clock, Star } from 'lucide-react';
import api from '@/lib/api';

interface NearbyAttractionsProps {
  destinationId: string;
  radius?: number;
}

export default function NearbyAttractions({ destinationId, radius = 50 }: NearbyAttractionsProps) {
  const [attractions, setAttractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNearby = async () => {
      try {
        const response = await api.get(`/destinations/${destinationId}/nearby?radius=${radius}`);
        setAttractions(response.data.data);
      } catch (err) {
        console.error('Failed to fetch nearby attractions:', err);
        setError('Unable to load nearby attractions');
      } finally {
        setLoading(false);
      }
    };
    fetchNearby();
  }, [destinationId, radius]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Nearby Attractions</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || attractions.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Nearby Attractions</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {attractions.length} found within {radius}km
        </span>
      </div>

      <div className="space-y-4">
        {attractions.slice(0, 5).map((attraction, index) => (
          <motion.div
            key={attraction._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={`/destinations/${attraction._id}`}
              className="group flex gap-4 p-4 bg-gray-50 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 rounded-xl transition-all border border-gray-100 hover:border-green-200 hover:shadow-md"
            >
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                <img
                  src={attraction.images?.[0] || 'https://images.unsplash.com/photo-1623945032589-1c7c8987f52e?w=200&q=80'}
                  alt={attraction.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-bold text-gray-800 group-hover:text-green-600 transition-colors truncate">
                    {attraction.name}
                  </h4>
                  <div className="flex items-center gap-1 text-sm font-semibold text-green-600 flex-shrink-0">
                    <Navigation size={14} />
                    {attraction.distance} km
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <MapPin size={14} />
                  <span className="truncate">{attraction.location}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    <span>{attraction.rating}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-white rounded-full border border-gray-200 capitalize">
                    {attraction.type}
                  </span>
                  <span className="px-2 py-0.5 bg-white rounded-full border border-gray-200">
                    {attraction.budget}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {attractions.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            +{attractions.length - 5} more attractions nearby
          </p>
        </div>
      )}
    </motion.div>
  );
}
