'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import DestinationCard from '@/components/DestinationCard';
import ImageGallery from '@/components/ImageGallery';
import MapComponent from '@/components/MapComponent';
import Link from 'next/link';
import { destinationApi } from '@/lib/api';
import { Destination } from '@/types';

export default function Home() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await destinationApi.getAll();
        setDestinations(res.data);
      } catch (err) {
        console.error('Failed to fetch destinations:', err);
        setError('Could not load destinations');
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const featuredDestinations = destinations.filter(d => d.rating >= 4.6);
  const galleryImages = destinations.slice(0, 6).flatMap(d => d.images);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Destinations */}
      <section id="featured-destinations" className="py-20 px-4 bg-[#FFF8EC]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-black mb-4">
              Featured Destinations
            </h2>
            <p className="text-xl text-black font-medium max-w-3xl mx-auto">
              Discover the most popular eco and cultural tourism destinations in Bihar
            </p>
            <div className="w-32 h-1.5 bg-[#546B41] mx-auto mt-6 rounded-full"></div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#546B41] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : featuredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDestinations.map((destination, index) => (
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
          ) : (
            <div className="text-center py-20 text-gray-500">
              No featured destinations available at the moment.
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/destinations"
              className="inline-block px-8 py-4 bg-[#DCCCAC] border border-[#546B41] text-black rounded-full font-bold text-lg hover:bg-[#99AD7A] transition-colors shadow-none"
            >
              View All Destinations →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-[#99AD7A] border-y border-[#546B41]/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Experience the Land of Enlightenment
              </h2>
              <p className="text-lg text-black font-medium mb-6 leading-relaxed">
                Bihar, the ancient land where Lord Buddha attained enlightenment, offers a unique blend
                of eco-tourism and cultural heritage. From the sacred Bodhi Tree in Bodh Gaya to the
                pristine forests of Valmiki Tiger Reserve, discover destinations that will transform
                your soul.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-8 text-black">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">10+</div>
                  <div className="text-sm font-semibold">Tourist Destinations</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">2</div>
                  <div className="text-sm font-semibold">Tourism Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">∞</div>
                  <div className="text-sm font-semibold">Memories Created</div>
                </div>
              </div>
              <Link
                href="/about"
                className="inline-block px-8 py-4 bg-[#DCCCAC] text-black border border-[#546B41] rounded-full font-bold text-lg hover:bg-[#FFF8EC] transition-colors shadow-none"
              >
                Learn More About Bihar
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[400px] rounded-2xl overflow-hidden border-2 border-[#546B41]/30 shadow-none"
            >
              <img
                src="/hero-images/4.png"
                alt="Bihar Landscape"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section id="interactive-map" className="py-20 px-4 bg-[#DCCCAC]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-black mb-4">
              Explore on Map
            </h2>
            <p className="text-xl text-black font-medium">
              Discover tourist destinations across Bihar
            </p>
          </motion.div>
          <MapComponent destinations={destinations} height="500px" />
        </div>
      </section>

      {/* Image Gallery */}
      <section id="image-gallery" className="py-20 px-4 bg-[#FFF8EC]">
        <div className="max-w-7xl mx-auto">
          <ImageGallery images={galleryImages} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[#99AD7A] border-t border-[#546B41]/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-black mb-6"
          >
            Ready to Begin Your Journey?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 text-black font-medium"
          >
            Plan your visit to Bihar and experience the perfect blend of nature and culture
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-[#FFF8EC] border border-[#546B41] text-black rounded-full font-bold text-lg hover:bg-[#DCCCAC] transition-colors shadow-none"
            >
              Contact Us for Planning
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
