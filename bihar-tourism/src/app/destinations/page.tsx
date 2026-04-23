'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DestinationCard from '@/components/DestinationCard';
import SearchBar from '@/components/SearchBar';
import MapComponent from '@/components/MapComponent';
import { destinationApi } from '@/lib/api';
import { Destination } from '@/types';

export default function Destinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  const heroImages = [
    "/hero-images/1.png",
    "/hero-images/2.png",
    "/hero-images/3.png",
    "/hero-images/4.png",
    "/hero-images/5.png"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await destinationApi.getAll();
        setDestinations(res.data);
      } catch (err) {
        setError('Failed to load destinations. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const filteredDestinations = destinations.filter((destination) => {
    const matchesSearch = destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' ||
      destination.type === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FFF8EC]">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden border-b border-[#546B41]/30">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ backgroundImage: `url(${heroImages[currentIndex]})` }}
            aria-label={`Destination Slider ${currentIndex + 1}`}
          />
        </AnimatePresence>

        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="px-8 md:px-16 py-10 max-w-4xl mx-auto bg-[#FFF8EC]/40 backdrop-blur-sm rounded-3xl border border-[#FFF8EC]/50 shadow-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-black mb-4">
                All Destinations
              </h1>
              <p className="text-xl text-black font-bold max-w-2xl mx-auto">
                Explore the complete list of eco and cultural tourism destinations in Bihar
              </p>
            </motion.div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-8 bg-[#546B41]' : 'w-2 bg-[#99AD7A]'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 px-4 -mt-8">
        <div className="max-w-5xl mx-auto">
          <SearchBar
            onSearch={setSearchQuery}
            onCategoryFilter={setCategoryFilter}
          />
        </div>
      </section>

      {/* Results Count */}
      <section className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <p className="text-lg text-black font-medium">
              Showing <span className="font-black text-[#546B41]">{filteredDestinations.length}</span> destinations
            </p>
            {(searchQuery || categoryFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                }}
                className="text-black hover:text-[#546B41] underline decoration-[#546B41] font-bold"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#546B41] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-[#DCCCAC] rounded-2xl border border-[#546B41]/30">
              <p className="text-black font-bold">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-[#99AD7A] text-black border border-[#546B41] font-bold rounded-lg text-sm hover:bg-[#FFF8EC] transition-colors shadow-none"
              >
                Retry
              </button>
            </div>
          ) : filteredDestinations.length > 0 ? (
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar scroll-smooth">
              {filteredDestinations.map((destination, index) => (
                <motion.div
                  key={destination._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="min-w-[85vw] sm:min-w-[45vw] md:min-w-0 snap-center shrink-0 h-full"
                >
                  <DestinationCard destination={destination} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-black mb-2">No destinations found</h3>
              <p className="text-black font-medium">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4 bg-[#DCCCAC] mt-12 border-t border-[#546B41]/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-black mb-4">
              View on Map
            </h2>
            <p className="text-xl text-black font-medium">
              See all destinations on the interactive map
            </p>
          </motion.div>
          <MapComponent destinations={destinations} height="500px" />
        </div>
      </section>
    </div>
  );
}
