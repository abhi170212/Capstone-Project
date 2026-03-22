'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { destinationApi } from '@/lib/api';
import { Destination } from '@/types';
import MapComponent from '@/components/MapComponent';

export default function DestinationDetails() {
  const { id } = useParams();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        if (typeof id === 'string') {
          const res = await destinationApi.getById(id);
          setDestination(res.data);
        }
      } catch (err) {
        setError('Failed to load destination details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Oops!</h2>
        <p className="text-gray-600 mb-8 max-w-md">{error || 'Destination not found.'}</p>
        <button 
          onClick={() => window.location.href = '/destinations'}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
        >
          Back to Destinations
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px]">
        <img
          src={destination.images?.[0] || 'https://images.unsplash.com/photo-1623945032589-1c7c8987f52e?w=1600&q=80'}
          className="w-full h-full object-cover"
          alt={destination.name}
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">{destination.name}</h1>
            <p className="text-xl text-white/90 font-medium">
              <span className="inline-flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {destination.location}
              </span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Details */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">About {destination.name}</h2>
            <div className="prose prose-lg text-gray-600 max-w-none">
              <p className="whitespace-pre-line leading-relaxed">{destination.description}</p>
            </div>

            {/* Gallery */}
            {destination.images && destination.images.length > 1 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Gallery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destination.images.slice(1).map((img, i) => (
                    <div key={i} className="h-64 rounded-xl overflow-hidden shadow-lg">
                      <img src={img} className="w-full h-full object-cover" alt={`${destination.name} ${i+2}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-8 sticky top-24 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Information</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Category</h4>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    destination.type === 'eco' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {destination.type === 'eco' ? 'Eco-Tourism' : 'Cultural Heritage'}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Best Season</h4>
                  <p className="text-gray-700 font-medium">{destination.bestSeason}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Entry Fee</h4>
                  <p className="text-gray-700 font-medium">{destination.entryFee}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Visitor Rating</h4>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-800 mr-2">{destination.rating}</span>
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} className={`w-5 h-5 ${s <= Math.floor(destination.rating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Location on Map</h2>
          <div className="bg-white p-4 rounded-2xl shadow-lg h-[400px]">
            <MapComponent destinations={[destination] as any} height="100%" />
          </div>
        </div>
      </section>
    </div>
  );
}
