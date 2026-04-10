'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Destination } from '@/types';

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const mainImage = destination.images && destination.images.length > 0
    ? destination.images[0]
    : '/hero-images/2.png';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-[#FFF8EC] border border-[#DCCCAC] rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={mainImage}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-[#FFF8EC]/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1 border border-[#DCCCAC]">
          <svg className="w-4 h-4 text-[#546B41]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-semibold text-black">{destination.rating || 'N/A'}</span>
        </div>
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-black border border-black ${
            destination.type === 'eco'
              ? 'bg-[#99AD7A]'
              : destination.type === 'cultural'
                ? 'bg-[#DCCCAC]'
                : 'bg-[#FFF8EC]'
            }`}>
            {destination.type === 'eco' ? 'Eco Tourism' : destination.type === 'cultural' ? 'Cultural Heritage' : 'Historical Site'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-black mb-2">{destination.name}</h3>
        <div className="flex items-center text-black mb-3">
          <svg className="w-4 h-4 mr-2 text-[#546B41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium">{destination.location}</span>
        </div>
        <p className="text-black font-medium mb-4 line-clamp-2">{destination.description}</p>

        {/* Best Time */}
        <div className="flex items-center text-sm text-black font-medium mb-6">
          <svg className="w-4 h-4 mr-2 text-[#546B41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Best season: {destination.bestSeason}</span>
        </div>

        {/* CTA Button */}
        <Link
          href={`/destinations/${destination._id}`}
          className="block w-full bg-[#DCCCAC] border border-[#546B41] text-black text-center py-3 rounded-lg font-bold hover:bg-[#99AD7A] transition-colors duration-200"
        >
          Explore More
        </Link>
      </div>
    </motion.div>
  );
}
