'use client';

import { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { destinations } from '@/data/destinations';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });

export default function DestinationDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const destinationId = parseInt(unwrappedParams.id);
  const destination = destinations.find(d => d.id === destinationId);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Destination Not Found</h1>
          <a href="/destinations" className="text-green-600 hover:text-green-700 font-semibold underline">
            Return to Destinations
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Header with Image */}
      <div className="relative h-[60vh] w-full">
        <img 
          src={destination.image} 
          alt={destination.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-end pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-block px-3 py-1 bg-green-500/90 backdrop-blur-md rounded-full text-white text-sm font-semibold mb-4 capitalize">
                {destination.category === 'eco' ? 'Eco Tourism' : destination.category === 'cultural' ? 'Cultural Heritage' : 'Eco & Cultural'}
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-2 tracking-tight">
                {destination.name}
              </h1>
              <div className="flex items-center text-white/90 text-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {destination.location}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About {destination.name}</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {destination.description}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {destination.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-700 font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Activities</h2>
              <div className="flex flex-wrap gap-3">
                {destination.activities.map((activity, idx) => (
                  <span key={idx} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-100">
                    {activity}
                  </span>
                ))}
              </div>
            </section>
            
            <section className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-200/50">
               <h2 className="text-2xl font-bold text-gray-900 mb-6">Location Map</h2>
               {mounted && (
                 <div className="h-[400px] w-full rounded-xl overflow-hidden ring-1 ring-black/5">
                   <MapComponent destinations={[destination]} height="100%" />
                 </div>
               )}
            </section>
            
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Info Card */}
            <div className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-200/50 border-t-4 border-green-500">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Visitor Information</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Best Time To Visit
                  </div>
                  <div className="font-semibold text-gray-900 px-6">{destination.bestTimeToVisit}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Budget Range
                  </div>
                  <div className="font-semibold text-gray-900 px-6 capitalize">{destination.budget}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Visitor Rating
                  </div>
                  <div className="font-semibold text-gray-900 px-6">{destination.rating} / 5.0</div>
                </div>
              </div>
            </div>

            {/* Eco Score Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-xl text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Eco Sustainability Score
              </h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-extrabold">{destination.ecoScore}</span>
                <span className="text-green-100">out of 10</span>
              </div>
              <div className="w-full bg-green-700 rounded-full h-2.5 mb-2">
                <div className="bg-white h-2.5 rounded-full" style={{ width: `${(destination.ecoScore / 10) * 100}%` }}></div>
              </div>
              <p className="text-xs text-green-100 mt-4 leading-snug text-center">
                This score reflects the destination&apos;s commitment to nature conservation, sustainable practices, and minimal environmental impact.
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
